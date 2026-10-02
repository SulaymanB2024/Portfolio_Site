import { Effect } from 'postprocessing'
import { Color, Uniform, Vector2, type WebGLRenderer, type WebGLRenderTarget } from 'three'

/** A bounded screen-space flow, after the existing dither and palette passes. */
const fragment = /* glsl */ `
uniform float flowProgress;
uniform float flowDrift;
uniform float flowClock;
uniform vec2 flowOrigin;
uniform float flowSourceWidth;
uniform float flowSourceHeight;
uniform vec2 flowResolution;
uniform vec3 flowPaper;
uniform vec3 flowInk;

float flowHash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float flowBayer(vec2 p) {
  vec2 a = mod(floor(p), 4.0);
  float x = a.x; float y = a.y;
  // Spatial thresholds only modulate alpha; the original shaded/dithered RGB survives.
  float v = 0.0;
  if (y < 1.0) { if (x < 1.0) v=0.0; else if(x<2.0)v=8.0; else if(x<3.0)v=2.0; else v=10.0; }
  else if(y<2.0) { if(x<1.0)v=12.0; else if(x<2.0)v=4.0; else if(x<3.0)v=14.0; else v=6.0; }
  else if(y<3.0) { if(x<1.0)v=3.0; else if(x<2.0)v=11.0; else if(x<3.0)v=1.0; else v=9.0; }
  else { if(x<1.0)v=15.0; else if(x<2.0)v=7.0; else if(x<3.0)v=13.0; else v=5.0; }
  return (v + .5) / 16.0;
}

vec4 releasedSample(vec2 sourceUV, float front) {
  if (sourceUV.y < 0.0 || sourceUV.y > 1.0 || sourceUV.x < 0.0 || sourceUV.x > 1.0) return vec4(0.0);
  vec2 viewUV = flowOrigin + (sourceUV - .5) * vec2(flowSourceWidth, flowSourceHeight);
  vec4 sampleColor = texture2D(inputBuffer, viewUV);
  // The sampled buffer precedes palette mapping; use the same paper and ink as the body.
  sampleColor.rgb = mix(flowInk, flowPaper, clamp(sampleColor.r,0.0,1.0));
  sampleColor.a *= smoothstep(front - .018, front + .018, sourceUV.y);
  return sampleColor;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float p = clamp(flowProgress, 0.0, 1.0);
  if (p < .0001) { outputColor = inputColor; return; }
  // Restore the original narrow-column release in sculpture-local coordinates.
  // Responsive canvas expansion must not change the dissolve position or lane size.
  vec2 local = (uv - flowOrigin) / vec2(flowSourceWidth, flowSourceHeight) + .5;
  float front = .96 - p * 1.08;
  float pixelThreshold = flowBayer(uv * flowResolution / 2.0);
  float contourNoise = (flowHash(floor(local.x * 220.0)) - .5) * .032;
  float dissolve = smoothstep(front - .031, front + .031, local.y + contourNoise);
  float keep = step(dissolve, pixelThreshold);
  vec4 base = inputColor;
  base.a *= keep;

  // Narrow columns have separate speeds; they retain the model's own luminance.
  float lane = floor(local.x * 180.0);
  float seed = flowHash(lane + 4.9);
  float laneWidth = fract(local.x * 180.0);
  float waterGate = 1.0 - smoothstep(.48, .9, laneWidth);
  float gravity = p * p * (.56 + seed * .54);
  float fall = gravity + flowDrift * (.025 + seed * .075);
  // A slow moving optical bend keeps the released material alive at a held scroll.
  float wobble = sin(local.y * 12.0 + lane * .37 + flowClock * .55 + p * 5.0) * .0035 * p;
  float sampleX = (lane + .5) / 180.0 + wobble;
  vec2 upstream = vec2(sampleX, local.y + fall);
  vec4 head = releasedSample(upstream, front);
  vec4 tail1 = releasedSample(upstream + vec2(0.0, .027 + seed * .055), front);
  vec4 tail2 = releasedSample(upstream + vec2(0.0, .085 + seed * .11), front);
  float a = (head.a * .68 + tail1.a * .24 + tail2.a * .10) * waterGate;
  vec3 rgb = (head.rgb * head.a * .68 + tail1.rgb * tail1.a * .24 + tail2.rgb * tail2.a * .10) / max(a / max(waterGate, .001), .0001);
  // Separate filaments into little descending droplets, without a repeating scanline.
  float drop = flowHash(lane * 3.1 + floor((local.y + fall) * 130.0));
  a *= mix(.22, 1.0, step(.23, drop));
  a *= smoothstep(.005, .12, p) * (1.0 - smoothstep(.78, 1.0, p));
  a *= smoothstep(-.01, .16, uv.y);
  a *= 1.0 - base.a * .85;
  float finalAlpha = base.a + a * (1.0 - base.a);
  vec3 finalColor = (base.rgb * base.a + rgb * a * (1.0 - base.a)) / max(finalAlpha, .0001);
  outputColor = vec4(finalColor, finalAlpha);
}
`

export class WaterFlowEffect extends Effect {
  constructor() {
    super('WaterFlowEffect', fragment, {
      uniforms: new Map<string, Uniform>([
        ['flowProgress', new Uniform(0)],
        ['flowDrift', new Uniform(0)],
        ['flowClock', new Uniform(0)],
        ['flowOrigin', new Uniform(new Vector2(.75, .5))],
        ['flowSourceWidth', new Uniform(.5)],
        ['flowSourceHeight', new Uniform(.8)],
        ['flowResolution', new Uniform(new Vector2(1, 1))],
        ['flowPaper', new Uniform(new Color('#f3f3f0'))],
        ['flowInk', new Uniform(new Color('#191a17'))],
      ]),
    })
  }
  setProgress(progress: number, drift = 0) {
    this.uniforms.get('flowProgress')!.value = Math.max(0, Math.min(1, progress))
    this.uniforms.get('flowDrift')!.value = Math.max(0, Math.min(1, drift))
  }
  setView(centerX: number, centerY: number, widthRatio: number, heightRatio: number) {
    this.uniforms.get('flowOrigin')!.value.set(centerX, centerY)
    this.uniforms.get('flowSourceWidth')!.value = Math.max(.001, widthRatio)
    this.uniforms.get('flowSourceHeight')!.value = Math.max(.001, heightRatio)
  }
  setTime(time: number) { this.uniforms.get('flowClock')!.value = time }
  setPalette(paper: Color, ink: Color) {
    this.uniforms.get('flowPaper')!.value.copy(paper)
    this.uniforms.get('flowInk')!.value.copy(ink)
  }
  update(_renderer: WebGLRenderer, buffer: WebGLRenderTarget) {
    this.uniforms.get('flowResolution')!.value.set(buffer.width, buffer.height)
  }
}
