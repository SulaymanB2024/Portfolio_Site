import * as THREE from 'three'
import { PORTFOLIO_DITHER_GLSL } from './dither-kernel'

export const STUDY_INK_GRID = 224

/** The surface and its released ink agree on sampling, tone and departure. */
export const STUDY_INK_GLSL = /* glsl */ `
  const float inkGrid = ${STUDY_INK_GRID.toFixed(1)};
  float inkEase(float t) { t = clamp(t, 0.0, 1.0); return t*t*t*(t*(t*6.0-15.0)+10.0); }
  float inkThreshold(vec2 cell) { return fract(52.9829189 * fract(dot(cell, vec2(.06711056, .00583715)))); }
  float inkRelease(vec2 uv) {
    float sweep = clamp(.62 * (1.0 - uv.y) + .38 * uv.x + .075 * sin(uv.y * 7.0 - uv.x * 5.0), 0.0, 1.0);
    return .025 + .16 * sweep;
  }
  float inkJourney(vec2 uv, float progress) { return clamp((progress - inkRelease(uv)) / .68, 0.0, 1.0); }
  float inkLifted(float journey) { return step(.00001, journey); }
  float inkResolve(float progress) { return inkEase((progress - .74) / .20); }
  float inkHandoff(vec2 pixel, float progress) {
    float resolve = inkResolve(progress);
    return resolve <= 0.0 ? 0.0 : step(inkThreshold(floor(pixel / 2.0)), resolve);
  }
`

const BAKE_VERTEX = /* glsl */ `
  varying vec2 cellUv;
  void main() { cellUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

// This atlas contains surface positions and ink coverage, not a display image.
// Capture once from the already-rendered GLB so every moving mark keeps its
// identity when the camera and destination rectangle change during the flight.
const BAKE_FRAGMENT = /* glsl */ `
  uniform sampler2D sourceColor;
  uniform sampler2D sourceDepth;
  uniform vec4 sourceRegion;
  uniform vec2 sourceResolution;
  uniform mat4 sourceInverseProjection;
  uniform float sourceCoverageScale;
  varying vec2 cellUv;
  ${PORTFOLIO_DITHER_GLSL}
  ${STUDY_INK_GLSL}
  void main() {
    vec2 cell = floor(cellUv * inkGrid);
    vec2 uv = (cell + .5) / inkGrid;
    vec2 pixel = sourceRegion.xy + uv * sourceRegion.zw;
    if (any(lessThan(pixel, vec2(0.0))) || any(greaterThanEqual(pixel, sourceResolution))) { gl_FragColor = vec4(0.0); return; }
    vec2 textureUv = pixel / sourceResolution;
    vec4 color = texture2D(sourceColor, textureUv);
    float depth = texture2D(sourceDepth, textureUv).x;
    vec4 view = sourceInverseProjection * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    float ink = min(1.0, color.a * sourceCoverageScale) * (1.0 - step(inkThreshold(cell), portfolioDisplayLuminance(color.rgb)));
    gl_FragColor = vec4(view.xyz / view.w, depth < .999999 ? ink : 0.0);
  }
`

const VERTEX = /* glsl */ `
  uniform sampler2D inkSurface;
  uniform vec4 inkRegion;
  uniform vec3 inkResolution;
  uniform vec3 inkCenter;
  uniform float inkRadius;
  uniform float inkProgress;
  uniform mat4 inkViewChange;
  uniform mat4 inkProjection;
  uniform vec2 inkSourceCell;
  uniform float inkSourceFocal;
  varying float inkCoverage;
  varying vec2 inkHalfSize;
  varying float inkAngle;
  varying float inkRound;
  ${PORTFOLIO_DITHER_GLSL}
  ${STUDY_INK_GLSL}

  vec3 turn(vec3 p, vec3 axis, float angle) {
    float c = cos(angle), s = sin(angle);
    return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
  }

  vec3 current(vec3 home, float t, float seed) {
    if (t <= 0.0 || t >= 1.0) return home;
    vec3 h = (home - inkCenter) / inkRadius;
    float q = inkEase(t);
    float lift = pow(sin(3.14159265359 * t), 1.6);
    float phase = 4.8 * q;
    // Differential torsion keeps the sculpture's own surfaces and voids in the
    // movement. Each depth layer unfurls, instead of collapsing onto a logo.
    vec3 axis = normalize(vec3(.24, .91, .34));
    float layer = dot(h, axis);
    float contour = smoothstep(.28, .86, length(h));
    float torsion = lift * (.32 + .68 * contour) * (.62 + .48 * layer + .20 * h.z);
    vec3 p = turn(h, axis, torsion);
    p = turn(p, normalize(vec3(.1, .28, 1.0)), -.12 * lift);
    // Two smooth curl modes fold the released surface into fine, coherent
    // filaments. Their spatial derivatives have zero divergence.
    vec3 k1 = vec3(2.7, 1.1, -1.4), k2 = vec3(-1.2, 3.1, 1.8);
    vec3 curl = cross(k1, vec3(.2, .8, .3)) * cos(dot(k1, h) - phase);
    curl += .58 * cross(k2, vec3(.7, -.1, .5)) * sin(dot(k2, h) + phase * .7);
    vec3 tangent = normalize(cross(axis, h) + vec3(.001));
    float fringe = smoothstep(.5, .85, length(h));
    p += lift * (.065 * curl + tangent * fringe * .13);
    p += lift * tangent * (seed - .5) * .025;
    p *= 1.0 + .08 * lift;
    return inkCenter + p * inkRadius;
  }

  vec3 projectToPixels(vec3 point) {
    vec4 view = inkViewChange * vec4(point, 1.0);
    vec4 clip = inkProjection * view;
    vec2 uv = clip.xy / max(clip.w, .001) * .5 + .5;
    return vec3(inkRegion.xy + uv * inkRegion.zw, -view.z);
  }

  void main() {
    vec2 uv = position.xy;
    vec2 cell = floor(uv * inkGrid);
    vec4 surface = texture2D(inkSurface, uv);
    float t = inkJourney(uv, inkProgress);
    float seed = portfolioHash(cell);
    vec3 point = current(surface.xyz, t, seed);
    vec3 projected = projectToPixels(point);
    vec3 before = projectToPixels(current(surface.xyz, max(0.0, t - .005), seed));
    vec3 after = projectToPixels(current(surface.xyz, min(1.0, t + .005), seed));
    vec2 velocity = after.xy - before.xy;
    float travel = length(velocity);
    float airborne = inkEase(min(t, 1.0 - t) / .16);
    float farSide = clamp((point.z - inkCenter.z) / inkRadius, -.8, .8);
    float depthInk = mix(1.0, .62 + .34 * smoothstep(-.5, .6, farSide), airborne);
    inkCoverage = surface.a * inkLifted(t) * depthInk;
    if (projected.z <= .05) inkCoverage = 0.0;
    gl_Position = vec4(projected.xy / inkResolution.xy * 2.0 - 1.0, 0.0, 1.0);

    float focal = inkProjection[1][1] * inkRegion.w;
    float perspective = clamp((focal / inkSourceFocal) * (-surface.z / max(projected.z, .05)), .45, 2.2);
    vec2 homeSize = inkSourceCell * perspective;
    float width = max(.85 * inkResolution.z, min(homeSize.x, homeSize.y) * .60);
    float strokeLength = max(width, min(4.8 * inkResolution.z, max(homeSize.x, homeSize.y) * .72 + travel * .52));
    // Keep the returned ink finely engraved until the live surface takes over.
    // Expanding it back into full cells creates a dark flash before the handoff.
    float engraved = inkEase(t / .16);
    vec2 markSize = mix(homeSize, vec2(strokeLength, width), engraved);
    float angle = travel > .001 ? atan(velocity.y, velocity.x) : 0.0;
    // A stroke has no preferred end: take the short rotation into its resting orientation.
    inkAngle = .5 * atan(sin(angle * 2.0), cos(angle * 2.0)) * airborne;
    float bound = length(markSize) + 1.5 * inkResolution.z;
    gl_PointSize = bound;
    inkHalfSize = markSize / bound * .5;
    inkRound = engraved;
  }
`

const FRAGMENT = /* glsl */ `
  uniform vec3 inkColor;
  uniform float inkProgress;
  ${STUDY_INK_GLSL}
  varying float inkCoverage;
  varying vec2 inkHalfSize;
  varying float inkAngle;
  varying float inkRound;
  void main() {
    vec2 p = gl_PointCoord - .5;
    float c = cos(inkAngle), s = sin(inkAngle);
    // Point coordinates run downward; the flow velocity is measured upward.
    p.y = -p.y;
    p = mat2(c, -s, s, c) * p;
    vec2 local = abs(p) / max(inkHalfSize, vec2(.001));
    float d = mix(max(local.x, local.y), length(local), inkRound);
    float feather = max(fwidth(d) * .7, .04);
    float edge = mix(1.0 - step(1.0, d), 1.0 - smoothstep(1.0 - feather, 1.0 + feather, d), inkRound);
    float alpha = inkCoverage * edge * (1.0 - inkHandoff(gl_FragCoord.xy, inkProgress));
    if (alpha < .01) discard;
    gl_FragColor = vec4(inkColor, alpha);
    #include <colorspace_fragment>
  }
`

/** One position atlas and one point draw; the original GLB/canvas stay retained. */
export function createWorkStudyInk(color: THREE.Color, renderer: THREE.WebGLRenderer) {
  const supported = renderer.extensions.has('EXT_color_buffer_float')
  // A one-time complete surface render includes parts outside the viewport.
  // The square target retains the source camera's projection; UVs, not its
  // temporary pixel aspect, are used to recover the exact surface positions.
  const surface = new THREE.WebGLRenderTarget(512, 512, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true, stencilBuffer: false })
  surface.depthTexture = new THREE.DepthTexture(512, 512, THREE.UnsignedIntType)
  const atlas = new THREE.WebGLRenderTarget(STUDY_INK_GRID, STUDY_INK_GRID, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false, stencilBuffer: false })
  const bakeMaterial = new THREE.ShaderMaterial({
    vertexShader: BAKE_VERTEX, fragmentShader: BAKE_FRAGMENT,
    uniforms: {
      sourceColor: { value: surface.texture }, sourceDepth: { value: surface.depthTexture },
      sourceRegion: { value: new THREE.Vector4() }, sourceResolution: { value: new THREE.Vector2() },
      sourceInverseProjection: { value: new THREE.Matrix4() }, sourceCoverageScale: { value: 1 },
    },
    depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending,
  })
  const bakeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial)
  const bakeScene = new THREE.Scene()
  const bakeCamera = new THREE.Camera()
  bakeScene.add(bakeQuad)
  if (supported) void renderer.compileAsync(bakeScene, bakeCamera).catch(() => {})
  const sourceWorld = new THREE.Matrix4()
  let captured = false
  const positions = new Float32Array(STUDY_INK_GRID * STUDY_INK_GRID * 3)
  for (let y = 0; y < STUDY_INK_GRID; y++) for (let x = 0; x < STUDY_INK_GRID; x++) {
    const offset = (y * STUDY_INK_GRID + x) * 3
    positions[offset] = (x + .5) / STUDY_INK_GRID
    positions[offset + 1] = (y + .5) / STUDY_INK_GRID
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX, fragmentShader: FRAGMENT,
    uniforms: {
      inkSurface: { value: atlas.texture }, inkColor: { value: color },
      inkRegion: { value: new THREE.Vector4() }, inkResolution: { value: new THREE.Vector3(1, 1, 1) },
      inkProgress: { value: 0 }, inkCenter: { value: new THREE.Vector3() }, inkRadius: { value: 1 },
      inkViewChange: { value: new THREE.Matrix4() }, inkProjection: { value: new THREE.Matrix4() },
      inkSourceCell: { value: new THREE.Vector2() }, inkSourceFocal: { value: 1 },
    },
    transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
  })
  const points = new THREE.Points(geometry, material)
  points.visible = false
  points.frustumCulled = false
  points.renderOrder = 1
  return {
    points, supported, surfaceTexture: atlas.texture,
    capture(scene: THREE.Scene, camera: THREE.PerspectiveCamera, center: THREE.Vector3, radius: number, width: number, height: number, reveal: number) {
      if (captured || !supported || width <= 0 || height <= 0) return
      renderer.setRenderTarget(surface)
      renderer.setScissorTest(false)
      renderer.setViewport(0, 0, 512, 512)
      renderer.clear(true, true, false)
      renderer.render(scene, camera)
      bakeMaterial.uniforms.sourceRegion.value.set(0, 0, 512, 512)
      bakeMaterial.uniforms.sourceResolution.value.set(512, 512)
      bakeMaterial.uniforms.sourceInverseProjection.value.copy(camera.projectionMatrixInverse)
      bakeMaterial.uniforms.sourceCoverageScale.value = 1 / Math.max(.02, reveal)
      sourceWorld.copy(camera.matrixWorld)
      material.uniforms.inkCenter.value.copy(center).applyMatrix4(camera.matrixWorldInverse)
      material.uniforms.inkRadius.value = radius
      material.uniforms.inkSourceCell.value.set(width / STUDY_INK_GRID, height / STUDY_INK_GRID)
      material.uniforms.inkSourceFocal.value = camera.projectionMatrix.elements[5] * height
      renderer.setRenderTarget(atlas)
      renderer.setScissorTest(false)
      renderer.setViewport(0, 0, STUDY_INK_GRID, STUDY_INK_GRID)
      renderer.render(bakeScene, bakeCamera)
      captured = true
    },
    update(progress: number, region: THREE.Vector4 | undefined, camera: THREE.PerspectiveCamera | undefined, width: number, height: number, scale: number) {
      points.visible = captured && !!region && !!camera && progress > 0 && progress < 1
      if (!points.visible || !region || !camera) return
      material.uniforms.inkRegion.value.copy(region)
      material.uniforms.inkResolution.value.set(width, height, scale)
      material.uniforms.inkProgress.value = progress
      material.uniforms.inkViewChange.value.multiplyMatrices(camera.matrixWorldInverse, sourceWorld)
      material.uniforms.inkProjection.value.copy(camera.projectionMatrix)
    },
    clear() { points.visible = false; captured = false },
    dispose() { points.visible = false; geometry.dispose(); material.dispose(); bakeQuad.geometry.dispose(); bakeMaterial.dispose(); atlas.dispose(); surface.dispose() },
  }
}
