import test from 'node:test'
import assert from 'node:assert/strict'
import { createInterestAudio } from '../src/personal/about/interest-audio.ts'

test('closing or silencing an interest cancels audio waiting for browser activation', async () => {
  const original = globalThis.AudioContext
  let activate: () => void = () => {}
  let oscillators = 0
  let closes = 0
  class PendingAudioContext {
    state = 'suspended'
    resume() { return new Promise<void>(resolve => { activate = () => { this.state = 'running'; resolve() } }) }
    createOscillator() { oscillators++; throw new Error('Cancelled activation must not create a voice') }
    async close() { this.state = 'closed'; closes++ }
  }
  globalThis.AudioContext = PendingAudioContext as unknown as typeof AudioContext
  try {
    const audio = createInterestAudio()
    const pending = audio.play(55)
    audio.silence()
    activate()
    await pending
    assert.equal(oscillators, 0)
    audio.dispose()
    assert.equal(closes, 1)

    const disposed = createInterestAudio()
    const interrupted = disposed.play(55)
    disposed.dispose()
    activate()
    await interrupted
    assert.equal(oscillators, 0)
    assert.equal(closes, 2)
    await disposed.play(55)
    assert.equal(oscillators, 0)
  } finally {
    if (original) globalThis.AudioContext = original
    else delete (globalThis as { AudioContext?: unknown }).AudioContext
  }
})
