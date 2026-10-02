import test from 'node:test'
import assert from 'node:assert/strict'
import { KernelSize } from 'postprocessing'
import { createBloomEffects, updateBloom } from '../src/bloom.ts'
import { defaults } from '../src/settings.ts'
import { stageColors } from '../src/stage-colors.ts'

test('post-bloom keeps the legacy blur algorithm and default kernel after upgrade', () => {
  const { before, after } = createBloomEffects()
  updateBloom(before, defaults.before)
  updateBloom(after, defaults.after)
  assert.equal(before.mipmapBlurPass.enabled, true)
  assert.equal(after.mipmapBlurPass.enabled, false)
  assert.equal(after.blurPass.kernelSize, KernelSize.LARGE)
  assert.equal(after.luminanceMaterial.smoothing, defaults.after.smoothing)
  updateBloom(after, { ...defaults.after, radius: 0 })
  assert.equal(after.blurPass.kernelSize, KernelSize.VERY_SMALL)
  before.dispose()
  after.dispose()
})
test('stage text contrasts against a custom background regardless of appearance', () => {
  assert.equal(stageColors('#000000')['--scene-ink'], '#ffffff')
  assert.equal(stageColors('#ffffff')['--scene-ink'], '#000000')
  assert.equal(stageColors('#066aff')['--scene-ink'], '#ffffff')
  assert.equal(stageColors('#19191a')['--scene-ink'], '#ffffff')
})
