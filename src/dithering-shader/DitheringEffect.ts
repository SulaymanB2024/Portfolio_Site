import { Effect } from 'postprocessing'
import { Uniform, Vector2, type WebGLRenderer, type WebGLRenderTarget } from 'three'
import ditheringShader from './DitheringShader.ts'

export interface DitheringEffectOptions {
  gridSize?: number
  pixelSizeRatio?: number
  grayscaleOnly?: boolean
  invertColor?: boolean
  enabled?: boolean
}
/** Retains the original Bayer /17 thresholds and RGB-sum luminance. */
export class DitheringEffect extends Effect {
  constructor({ gridSize = 4, pixelSizeRatio = 1, grayscaleOnly = false, invertColor = false, enabled = true }: DitheringEffectOptions = {}) {
    super('DitheringEffect', ditheringShader, {
      uniforms: new Map<string, Uniform>([
        ['resolution', new Uniform(new Vector2(1, 1))],
        ['gridSize', new Uniform(gridSize)],
        ['pixelSizeRatio', new Uniform(pixelSizeRatio)],
        ['grayscaleOnly', new Uniform(Number(grayscaleOnly))],
        ['invertColor', new Uniform(Number(invertColor))],
        ['ditheringEnabled', new Uniform(Number(enabled))]
      ])
    })
  }
  update(_renderer: WebGLRenderer, inputBuffer: WebGLRenderTarget): void {
    this.uniforms.get('resolution')!.value.set(inputBuffer.width, inputBuffer.height)
  }
  setGridSize(size: number): void {
    this.uniforms.get('gridSize')!.value = Math.max(1, size)
  }
  setPixelSizeRatio(ratio: number): void {
    this.uniforms.get('pixelSizeRatio')!.value = Math.max(1, ratio)
  }
  setGrayscaleOnly(enabled: boolean): void {
    this.uniforms.get('grayscaleOnly')!.value = Number(enabled)
  }
  setInvertColor(enabled: boolean): void {
    this.uniforms.get('invertColor')!.value = Number(enabled)
  }
  setEnabled(enabled: boolean): void {
    this.uniforms.get('ditheringEnabled')!.value = Number(enabled)
  }
}
