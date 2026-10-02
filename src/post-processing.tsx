import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing'
import { DitheringEffect } from './dithering-shader/DitheringEffect'
import type { Settings } from './settings'
import { createBloomEffects, updateBloom } from './bloom'
let pipelineSequence = 0
/** One owned chain per renderer. Sliders update uniforms, never GPU allocations. */
export function PostProcessing({ settings }: { settings: Settings }) {
  const { gl, scene, camera, size, viewport, invalidate } = useThree()
  const pipeline = useRef<{
    composer: EffectComposer
    dither: DitheringEffect
    before: BloomEffect
    after: BloomEffect
    beforePass: EffectPass
    afterPass: EffectPass
    ditherPass: EffectPass
  } | null>(null)
  useLayoutEffect(() => {
    const originalAutoReset = gl.info.autoReset
    gl.info.autoReset = false
    const composer = new EffectComposer(gl, { multisampling: 0 })
    const dither = new DitheringEffect()
    const { before, after } = createBloomEffects()
    const beforePass = new EffectPass(camera, before)
    const ditherPass = new EffectPass(camera, dither)
    const afterPass = new EffectPass(camera, after)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(beforePass)
    composer.addPass(ditherPass)
    composer.addPass(afterPass)
    pipeline.current = { composer, dither, before, after, beforePass, afterPass, ditherPass }
    gl.domElement.dataset.pipeline = String(++pipelineSequence)
    return () => {
      pipeline.current = null
      composer.dispose()
      gl.info.autoReset = originalAutoReset
    }
  }, [gl, scene, camera])
  useLayoutEffect(() => {
    pipeline.current?.composer.setSize(size.width, size.height, false)
    invalidate()
  }, [size.width, size.height, viewport.dpr, invalidate])
  useLayoutEffect(() => {
    const p = pipeline.current
    if (!p) return
    p.dither.setGridSize(settings.grid)
    p.dither.setPixelSizeRatio(settings.pixel)
    p.dither.setGrayscaleOnly(settings.grayscale)
    p.dither.setInvertColor(settings.invert)
    p.dither.setEnabled(settings.dithering)
    updateBloom(p.before, settings.before)
    updateBloom(p.after, settings.after)
    p.beforePass.enabled = settings.before.enabled
    p.afterPass.enabled = settings.after.enabled
    p.beforePass.renderToScreen = false
    p.ditherPass.renderToScreen = !settings.after.enabled
    p.afterPass.renderToScreen = settings.after.enabled
    invalidate()
  }, [settings, invalidate])
  const frames = useRef(0)
  const timing = useRef({ cpu: 0, elapsed: 0, count: 0 })
  useFrame((_state, delta) => {
    gl.info.reset()
    const started = import.meta.env.DEV ? performance.now() : 0
    pipeline.current?.composer.render(delta)
    // DOM diagnostics support local regression checks without a second render loop.
    if (import.meta.env.DEV) {
      gl.domElement.dataset.frames = String(++frames.current)
      gl.domElement.dataset.textures = String(gl.info.memory.textures)
      gl.domElement.dataset.programs = String(gl.info.programs?.length ?? 0)
      gl.domElement.dataset.triangles = String(gl.info.render.triangles)
      timing.current.cpu += performance.now() - started
      timing.current.elapsed += delta
      timing.current.count++
      if (timing.current.count >= 60) {
        gl.domElement.dataset.cpuMs = (timing.current.cpu / timing.current.count).toFixed(2)
        gl.domElement.dataset.fps = (timing.current.count / timing.current.elapsed).toFixed(1)
        timing.current = { cpu: 0, elapsed: 0, count: 0 }
      }
    }
  }, 1)
  return null
}
