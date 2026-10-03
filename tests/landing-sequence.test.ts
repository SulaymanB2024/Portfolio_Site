import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { projects } from '../src/personal/content.ts'
import { CHAPTERS, railProgress, sceneSequence, textSequence, advanceScrollMotion } from '../src/personal/landing/sequence.ts'
import { thresholdMotion, sculpturePose, createScaleSampler } from '../src/personal/landing/motion-curves.ts'
import { scrollInkStrength } from '../src/personal/landing/scroll-dither.ts'
import { isStackedLanding, mobileSculptureFrame } from '../src/personal/landing/mobile-layout.ts'

const near = (a: number, b: number, tolerance = 1e-10) => assert.ok(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`)

test('the homepage intro leads to About and all four chapters retain their real project routes and assets', async () => {
  assert.equal(CHAPTERS[0].href, '#/about')
  assert.equal(CHAPTERS[0].linkLabel, 'About me')
  assert.deepEqual(CHAPTERS.slice(1).map(chapter => chapter.href), projects.map(project => `#/work/${project.slug}`))
  assert.deepEqual(CHAPTERS.slice(1).map(chapter => chapter.label), projects.map(project => project.name))
  assert.equal(CHAPTERS[3].article?.href, '#/writing/who-owns-texas-toll-roads')
  for (const chapter of CHAPTERS) {
    const asset = await readFile(new URL(`../public/${chapter.asset}`, import.meta.url))
    assert.equal(asset.readUInt32LE(0), 0x46546c67)
  }
})

test('native progress completes the landing rail before Writing, independently of the rest of the document', () => {
  const top = 98, rail = 4032, stage = 720, travel = rail - stage
  for (let index = 0; index <= 4; index++) {
    const scroll = top + travel * index / 4
    const p = railProgress(scroll, top, rail, stage)
    near(p, index / 4)
    assert.equal(textSequence(p).active, index)
    assert.equal(sceneSequence(p).to, CHAPTERS[Math.min(index + 1, 4)])
  }
  assert.equal(railProgress(top - 50, top, rail, stage), 0)
  for (const writingScroll of [top + rail, top + rail + 600, top + rail + 3000]) assert.equal(railProgress(writingScroll, top, rail, stage), 1)
  near(railProgress(2911.8, 0, 4726.4, 844), .75)
  assert.equal(railProgress(NaN, 0, rail, stage), 0)
})

test('links only appear with their matching readable title and chapter joins preserve the resting sculpture', () => {
  for (let i = 0; i <= 4000; i++) {
    const p = i / 4000, scene = sceneSequence(p), type = textSequence(p), motion = thresholdMotion(scene.local)
    const linkOpacity = type.active > scene.leg ? motion.incomingLinks : motion.outgoingLinks
    if (linkOpacity > 0) assert.deepEqual(type.states[type.active], { reveal: 1, erase: 0 })
    assert.ok(type.states.filter(state => state.reveal > 0 && state.erase < 1).length <= 1)
  }
  assert.deepEqual(sculpturePose(1, true), sculpturePose(0, false))
  assert.deepEqual(sculpturePose(.85, true), sculpturePose(.15, false))
})

test('reduced motion keeps one full title; reverse scroll and frame subdivision retain the same state', () => {
  const positions = Array.from({ length: 101 }, (_, i) => i / 100)
  assert.deepEqual(positions.map(p => textSequence(p)), [...positions].reverse().map(p => textSequence(p)).reverse())
  for (const p of positions) {
    const type = textSequence(p, 'threshold', true)
    assert.deepEqual(type.states[type.active], { reveal: 1, erase: 0 })
    assert.equal(type.states.filter(state => state.reveal === 1).length, 1)
    assert.deepEqual(advanceScrollMotion({ progress: 0, velocity: 3 }, p, 0, true), { progress: p, velocity: 0 })
  }
  const expected = advanceScrollMotion({ progress: .9, velocity: 0 }, .12, .5)
  for (const fps of [10, 30, 60, 120]) {
    let motion = { progress: .9, velocity: 0 }
    for (let i = 0; i < fps / 2; i++) motion = advanceScrollMotion(motion, .12, 1 / fps)
    near(motion.progress, expected.progress)
    near(motion.velocity, expected.velocity)
  }
})

test('scroll impulses retain velocity through reversals and never pass their destination', () => {
  const first = advanceScrollMotion({ progress: 0, velocity: 0 }, .8, .02)
  assert.ok(first.progress > 0 && first.progress < .8 && first.velocity > 0)
  const reversal = advanceScrollMotion(first, 0, .000001)
  assert.ok(Math.abs(reversal.velocity - first.velocity) < .001)
  let motion = first
  for (let frame = 0; frame < 300; frame++) {
    motion = advanceScrollMotion(motion, .08, 1 / 60)
    assert.ok(motion.progress >= .08 && motion.progress <= 1)
    assert.ok(Number.isFinite(motion.velocity))
  }
  near(motion.progress, .08)
  near(motion.velocity, 0)
  assert.deepEqual(advanceScrollMotion({ progress: .4, velocity: 8 }, .5, 1), { progress: .5, velocity: 0 })
})

test('moving ink is bounded, direction-independent, quiet at rest, and disabled for reduced motion', () => {
  assert.equal(scrollInkStrength(0, 3000, 720), 0)
  assert.equal(scrollInkStrength(2, 3000, 720, true), 0)
  assert.equal(scrollInkStrength(NaN, 3000, 720), 0)
  assert.equal(scrollInkStrength(1, 3000, 0), 0)
  near(scrollInkStrength(.2, 3000, 600), scrollInkStrength(-.2, 6000, 1200))
  assert.ok(scrollInkStrength(.08, 3000, 720) < scrollInkStrength(.3, 3000, 720))
  assert.ok(scrollInkStrength(100, 3000, 720) < .85)
})

test('phone sculptures project inside the space between their actual title and links', () => {
  for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932], [600, 900]]) {
    const copyTop = Math.max(86, Math.min(128, height * .125))
    const lineHeight = Math.max(36, Math.min(66, width * .138, height * .07))
    for (const chapter of CHAPTERS) for (const bounds of [{ x: 1.7, y: 2, z: 1.4 }, { x: 2, y: 1.2, z: 1.8 }]) {
      const frame = mobileSculptureFrame(width, height, copyTop, lineHeight, chapter.lines.length, chapter.article ? 2 : 1, bounds, 34)
      const focal = height / (2 * Math.tan(16 * Math.PI / 180))
      assert.ok(frame.scale > 0 && Number.isFinite(frame.scale))
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const depth = 6.1 - sz * bounds.z * frame.scale / 2
        const x = width / 2 + focal * sx * bounds.x * frame.scale / 2 / depth
        const y = height / 2 - focal * (frame.y + sy * bounds.y * frame.scale / 2) / depth
        assert.ok(x >= width * .06 && x <= width * .94, `Horizontal clipping at ${width}×${height}`)
        assert.ok(y >= frame.top && y <= frame.bottom, `Title/link overlap at ${width}×${height}`)
      }
    }
  }
  assert.equal(isStackedLanding(590, 844), true)
  assert.equal(isStackedLanding(667, 375), false)
  assert.equal(isStackedLanding(700, 700), false)
  assert.equal(isStackedLanding(701, 1000), false)
})

test('the production threshold assets retain smooth bounded interpolation through their actual GLB keys', async () => {
  for (const name of ['threshold-iris.glb', 'threshold-visor.glb']) {
    const bytes = await readFile(new URL(`../public/landing/${name}`, import.meta.url))
    const model = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
    const track = model.animations[0].tracks.find(track => track.name.endsWith('.scale'))!
    const sample = createScaleSampler(track.times, track.values), value = new Float64Array(3)
    for (let i = 0; i < track.times.length; i++) {
      sample(track.times[i], value)
      for (let axis = 0; axis < 3; axis++) near(value[axis], track.values[i * 3 + axis])
    }
    let previous = [0, 0, 0]
    for (let i = 0; i <= 1000; i++) {
      sample(i / 1000, value)
      for (let axis = 0; axis < 3; axis++) {
        assert.ok(Number.isFinite(value[axis]) && value[axis] > 0 && value[axis] >= previous[axis] - 1e-10)
        assert.ok(value[axis] <= track.values[track.values.length - 3 + axis] + 1e-10)
      }
      previous = [...value]
    }
  }
})
