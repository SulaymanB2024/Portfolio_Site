import * as THREE from 'three'
import { PORTFOLIO_DITHER_GLSL } from './dither-kernel'
import { studyFlightInkMotion } from './work-study-flight'

const GRID = 160

const VERTEX = /* glsl */ `
  uniform sampler2D inkSource;
  uniform vec4 inkRegion;
  uniform vec3 inkResolution;
  uniform vec3 inkMotion;
  uniform float inkTurn;
  varying float inkCoverage;
  ${PORTFOLIO_DITHER_GLSL}
  void main() {
    vec2 home = (position.xy - .5) * inkRegion.zw;
    vec2 sourcePixel = inkRegion.xy + position.xy * inkRegion.zw;
    vec4 model = texture2D(inkSource, sourcePixel / inkResolution.xy);
    vec2 cell = floor(position.xy * ${GRID.toFixed(1)});
    float seed = portfolioHash(cell);
    float tone = portfolioDisplayLuminance(model.rgb);
    inkCoverage = model.a * (1.0 - step(portfolioBayer8(cell), tone)) * inkMotion.z;
    if (any(lessThan(sourcePixel, vec2(0.0))) || any(greaterThanEqual(sourcePixel, inkResolution.xy))) inkCoverage = 0.0;

    float extent = min(inkRegion.z, inkRegion.w);
    float radius = length(home);
    float angle = atan(home.y, home.x);
    // Nearby fragments share a current; a small seed variation loosens its edge.
    // The broad spiral keeps the paper around it empty and returns every mark
    // to the same live-model sample, including the visitor's chosen orientation.
    float radial = clamp(radius / max(extent * .42, 1.0), 0.0, 1.0);
    // Inner ink travels faster than the outer edge: angular shear creates a
    // spiral with depth instead of turning the silhouette into a rotating ring.
    float curl = inkTurn * (.55 + 1.1 * (1.0 - radial));
    float fieldRadius = radius * (1.0 + .38 * inkMotion.x);
    fieldRadius += extent * (.018 * sin(angle * 3.0 + inkTurn) + .018 * (seed - .5)) * inkMotion.x;
    fieldRadius = min(fieldRadius, extent * .44);
    fieldRadius *= 1.0 - .22 * inkMotion.y;
    float swirlAngle = angle + curl + sin(angle * 2.0 + inkTurn) * .16 * inkMotion.x;
    vec2 field = vec2(cos(swirlAngle), sin(swirlAngle)) * fieldRadius;
    field += vec2(sin(inkTurn + angle * 2.0), cos(inkTurn * .7 + angle * 3.0)) * extent * .035 * inkMotion.x;
    vec2 displaced = mix(home, field, inkMotion.x);
    vec2 returning = mix(displaced, home, inkMotion.y);
    vec2 pixel = inkRegion.xy + inkRegion.zw * .5 + returning;
    gl_Position = vec4(pixel / inkResolution.xy * 2.0 - 1.0, 0.0, 1.0);
    // Backing-scale compensation keeps the marks consistent on phones and HiDPI.
    gl_PointSize = (1.3 + seed * 1.3) * inkResolution.z;
  }
`

const FRAGMENT = /* glsl */ `
  uniform vec3 inkColor;
  varying float inkCoverage;
  void main() {
    float radius = length(gl_PointCoord - .5);
    float edge = 1.0 - smoothstep(.30, .5, radius);
    float alpha = inkCoverage * edge * .92;
    if (alpha < .015) discard;
    gl_FragColor = vec4(inkColor, alpha);
    #include <colorspace_fragment>
  }
`

/** Borrows the live target; owns only its bounded geometry and material. */
export function createWorkStudyInk(texture: THREE.Texture, color: THREE.Color) {
  const positions = new Float32Array(GRID * GRID * 3)
  for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
    const offset = (y * GRID + x) * 3
    positions[offset] = (x + .5) / GRID
    positions[offset + 1] = (y + .5) / GRID
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX, fragmentShader: FRAGMENT,
    uniforms: {
      inkSource: { value: texture }, inkColor: { value: color },
      inkRegion: { value: new THREE.Vector4() },
      inkResolution: { value: new THREE.Vector3(1, 1, 1) },
      inkMotion: { value: new THREE.Vector3() }, inkTurn: { value: 0 },
    },
    transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
  })
  const points = new THREE.Points(geometry, material)
  points.visible = false
  points.frustumCulled = false
  points.renderOrder = 1
  return {
    points,
    update(progress: number, region: THREE.Vector4 | undefined, width: number, height: number, scale: number) {
      points.visible = false
      if (!region || region.z <= 0 || progress <= 0 || progress >= 1) return
      const motion = studyFlightInkMotion(progress)
      points.visible = motion.particles > 0
      if (!points.visible) return
      material.uniforms.inkRegion.value.copy(region)
      material.uniforms.inkResolution.value.set(width, height, scale)
      material.uniforms.inkMotion.value.set(motion.release, motion.gather, motion.particles)
      material.uniforms.inkTurn.value = motion.turn
    },
    clear() { points.visible = false },
    dispose() { points.visible = false; geometry.dispose(); material.dispose() },
  }
}
