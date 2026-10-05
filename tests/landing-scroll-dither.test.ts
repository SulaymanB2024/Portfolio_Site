import test from 'node:test'
import assert from 'node:assert/strict'
import { advanceScrollInk, scrollDitherPassage } from '../src/personal/landing/scroll-dither.ts'
import { cinematicShot, sculpturePose, portalFrameOpacity } from '../src/personal/landing/motion-curves.ts'

test('grain releases completely after a fast scroll and follows the same timing across frame rates', () => {
  const attack = advanceScrollInk(0, .3, 1 / 60)
  assert.ok(attack > 0 && attack < .3)
  for (const fps of [30, 60, 120]) {
    let ink = .3
    for (let frame = 0; frame < fps / 2; frame++) ink = advanceScrollInk(ink, 0, 1 / fps)
    assert.equal(ink, 0, `Grain is still moving after release at ${fps} Hz`)
    ink = 0
    for (let frame = 0; frame < fps / 10; frame++) ink = advanceScrollInk(ink, .3, 1 / fps)
    assert.ok(Math.abs(ink - advanceScrollInk(0, .3, .1)) < 1e-10)
  }
  assert.equal(advanceScrollInk(.3, .3, 1 / 60, true), 0)
  assert.equal(advanceScrollInk(NaN, NaN, Infinity), 0)
  assert.equal(advanceScrollInk(.2, 0, -1), .2)
})

test('the scroll sweep retraces exactly and clears at every reading hold and rail endpoint', () => {
  for (const progress of [0, .21, .25, .46, .5, .71, .75, .96, 1, -1, 2]) {
    assert.equal(scrollDitherPassage(progress).strength, 0, `Reading hold ${progress} has grain`)
  }
  for (let leg = 0; leg < 4; leg++) for (const local of [.08, .09, .10]) {
    assert.ok(scrollDitherPassage((leg + local) / 4).strength < 1e-12, `Chapter ${leg} has grain before departure`)
  }
  const progress = Array.from({ length: 401 }, (_, index) => index / 400)
  assert.deepEqual(progress.map(p => scrollDitherPassage(p)), [...progress].reverse().map(p => scrollDitherPassage(p)).reverse())
  for (const p of progress) {
    const wide = scrollDitherPassage(p), phone = scrollDitherPassage(p, true)
    assert.ok(wide.strength >= 0 && wide.strength <= 1 && wide.sweep >= 0 && wide.sweep <= 1)
    assert.equal(phone.sweep, wide.sweep)
    assert.ok(Math.abs(phone.strength - wide.strength * .65) < 1e-10)
    assert.deepEqual(scrollDitherPassage(p, false, true), { strength: 0, sweep: 0 })
  }
  assert.deepEqual(scrollDitherPassage(NaN), { strength: 0, sweep: 0 })
  assert.deepEqual(scrollDitherPassage(Infinity), { strength: 0, sweep: 0 })
  for (let leg = 0; leg < 4; leg++) assert.ok(scrollDitherPassage((leg + .4) / 4).strength > .9)
})

test('scroll turns are restrained on phones and the light stays fixed through every passage', () => {
  for (let chapter = 0; chapter < 5; chapter++) for (const incoming of [false, true]) for (let step = 0; step <= 100; step++) {
    const p = step / 100, wide = sculpturePose(p, incoming, chapter), phone = sculpturePose(p, incoming, chapter, true)
    for (const key of ['yaw', 'pitch', 'roll', 'articulation'] as const) assert.ok(Math.abs(phone[key] - wide[key] * .6) < 1e-10)
    assert.ok(Math.abs(phone.scale - (1 + (wide.scale - 1) * .6)) < 1e-10)
    assert.ok(wide.scale >= 1 && wide.scale <= 1.025)
    const shot = cinematicShot(p, incoming, false, chapter)
    assert.equal(shot.lightX, 0); assert.equal(shot.lightY, 0)
  }
})

test('the optical rim clears before the incoming headline prints', () => {
  let previous = portalFrameOpacity(0)
  for (let step = 0; step <= 1000; step++) {
    const opacity = portalFrameOpacity(step / 1000)
    assert.ok(opacity >= 0 && opacity <= .65 && opacity <= previous)
    previous = opacity
  }
  for (const local of [.42, .44, .50, .62, .74, 1]) assert.equal(portalFrameOpacity(local), 0)
})
