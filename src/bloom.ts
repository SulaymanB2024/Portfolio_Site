import { BloomEffect } from 'postprocessing'
import type { BloomSettings } from './settings'

/** Pin the legacy algorithms instead of inheriting version-dependent defaults. */
export function createBloomEffects() {
  return { before: new BloomEffect({ mipmapBlur: true }), after: new BloomEffect({ mipmapBlur: false }) }
}
export function updateBloom(effect: BloomEffect, settings: BloomSettings) {
  effect.intensity = settings.intensity
  effect.luminanceMaterial.threshold = settings.threshold
  effect.luminanceMaterial.smoothing = settings.smoothing
  if (effect.mipmapBlurPass.enabled) effect.mipmapBlurPass.radius = settings.radius
  // Radius was ignored by legacy Kawase bloom. Keep its default LARGE kernel at
  // radius .75, while making the existing control useful at other settings.
  else effect.blurPass.kernelSize = Math.round(settings.radius * 4)
}
