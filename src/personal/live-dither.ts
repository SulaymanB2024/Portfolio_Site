import { Uniform } from 'three'
import { DitheringEffect } from '../dithering-shader/DitheringEffect'
import shader from '../dithering-shader/DitheringShader'

/** Tiny grain variations animate the thresholds, without changing the source material. */
export class LiveDitherEffect extends DitheringEffect {
  constructor() {
    super({ gridSize: 2, grayscaleOnly: true })
    this.uniforms.set('liveDitherTime', new Uniform(0))
    this.uniforms.set('liveDitherAmount', new Uniform(0))
    this.setFragmentShader(`uniform float liveDitherTime;\nuniform float liveDitherAmount;\n${shader.replace(
      'bool dithered = getValue(luminance, fragCoord);',
      `float liveGrain = fract(sin(dot(floor(fragCoord), vec2(12.9898, 78.233)) + floor(liveDitherTime * 12.0) * .733) * 43758.5453);
       bool dithered = getValue(luminance + (liveGrain - .5) * liveDitherAmount, fragCoord);`,
    ).replace('vec3 ditherColor = dithered ? vec3(0.0) : baseColor;', 'vec3 ditherColor = dithered ? vec3(0.0) : vec3(1.0);')}`)
  }
  setTime(time: number, moving: boolean) {
    this.uniforms.get('liveDitherTime')!.value = time
    this.uniforms.get('liveDitherAmount')!.value = moving ? .095 : 0
  }
}
