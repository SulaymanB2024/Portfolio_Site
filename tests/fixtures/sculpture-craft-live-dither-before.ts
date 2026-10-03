import { Effect, EffectAttribute } from 'postprocessing'
import { Color, Uniform, Vector2, type WebGLRenderer, type WebGLRenderTarget } from 'three'
import { PORTFOLIO_DITHER_GLSL } from '../../src/personal/dither-kernel.ts'

const fragment = /* glsl */ `
uniform vec2 printCssSize;
uniform vec2 printBufferSize;
uniform float printCellSize;
uniform float printBinary;
uniform float printClock;
uniform float printGrain;
uniform vec3 printInk;
uniform vec3 printPaper;
${PORTFOLIO_DITHER_GLSL}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (inputColor.a < .0001) { outputColor = vec4(0.0); return; }
  vec2 cell = floor(uv * printCssSize / printCellSize);
  vec2 sampleUv = (cell + .5) * printCellSize / printCssSize;
  vec2 halfTexel = .5 / printBufferSize;
  vec4 center = texture2D(inputBuffer, clamp(sampleUv, halfTexel, 1.0 - halfTexel));
  // Keep the CSS dot screen inside the form. At a partial or empty cell center,
  // use this pixel's surface so a thin rim cannot disappear with its whole cell.
  vec4 surface = center.a >= .9999 ? center : inputColor;
  // Weighted linear luminance retains the neutral scan's previous tonal gain.
  float tone = clamp(portfolioLinearLuminance(portfolioStraightColor(surface)) * 3.0, 0.0, 1.0);
  float threshold = portfolioLiveThreshold(portfolioBayer8(cell), cell, printClock, printGrain);
  float mark = step(threshold, tone);
  float paper = mark * mix(tone, 1.0, printBinary);
  outputColor = vec4(mix(printInk, printPaper, paper), inputColor.a);
}
`

/** Palette and dither share one pass. Grain has a stable spatial seed and visible clock. */
export class LiveDitherEffect extends Effect {
  constructor({ gridSize = 1, binary = true, live = true }: { gridSize?: number; binary?: boolean; live?: boolean } = {}) {
    super('PortfolioDither', fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform>([
        ['printCssSize', new Uniform(new Vector2(1, 1))],
        ['printBufferSize', new Uniform(new Vector2(1, 1))],
        ['printCellSize', new Uniform(Number.isFinite(gridSize) ? Math.max(1, gridSize) : 1)],
        ['printBinary', new Uniform(Number(binary))],
        ['printClock', new Uniform(0)],
        ['printGrain', new Uniform(live ? .025 : 0)],
        ['printInk', new Uniform(new Color('#191a17'))],
        ['printPaper', new Uniform(new Color('#f3f3f0'))],
      ]),
    })
  }
  setTime(seconds: number, moving: boolean) {
    if (moving && Number.isFinite(seconds)) this.uniforms.get('printClock')!.value = Math.max(0, seconds)
  }
  setView(width: number, height: number) {
    this.uniforms.get('printCssSize')!.value.set(Number.isFinite(width) ? Math.max(1, width) : 1, Number.isFinite(height) ? Math.max(1, height) : 1)
  }
  setPalette(paper: Color, ink: Color) {
    this.uniforms.get('printPaper')!.value.copy(paper)
    this.uniforms.get('printInk')!.value.copy(ink)
  }
  update(_renderer: WebGLRenderer, buffer: WebGLRenderTarget) {
    this.uniforms.get('printBufferSize')!.value.set(buffer.width, buffer.height)
  }
}
