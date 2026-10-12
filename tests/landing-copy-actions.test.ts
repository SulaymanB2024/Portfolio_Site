import test from 'node:test'
import assert from 'node:assert/strict'
import { copyLinksUsable } from '../src/personal/landing/copy-actions.ts'
import { sceneSequence, textSequence } from '../src/personal/landing/sequence.ts'
import { thresholdMotion } from '../src/personal/landing/motion-curves.ts'

test('a small phone or desktop scroll retains access to both visibly held destinations', () => {
  for (const mobile of [false, true]) {
    const progress = .125 / 4
    const sequence = textSequence(progress, 'threshold', false, mobile)
    const alpha = thresholdMotion(sceneSequence(progress).local).outgoingLinks
    assert.ok(alpha > .49 && alpha < .51, 'reproduces the half-faded actions at the reported scroll position')
    assert.equal(copyLinksUsable(sequence, alpha), true)
  }
})

test('invisible or dissolving destinations leave pointer and keyboard access together', () => {
  for (const mobile of [false, true]) {
    for (const progress of [.05, .09, .12]) {
      const sequence = textSequence(progress, 'threshold', false, mobile)
      const motion = thresholdMotion(sceneSequence(progress).local)
      const alpha = sequence.active > sceneSequence(progress).leg ? motion.incomingLinks : motion.outgoingLinks
      assert.equal(copyLinksUsable(sequence, alpha), false)
    }
    assert.equal(copyLinksUsable(textSequence(.25, 'threshold', true, mobile), 1), true)
  }
})
