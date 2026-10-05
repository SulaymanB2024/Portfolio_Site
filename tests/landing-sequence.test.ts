import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Box3, Vector3 } from 'three'
import { projects } from '../src/personal/content.ts'
import { CHAPTERS, railProgress, sceneSequence, textSequence, advanceScrollMotion, requiredScene } from '../src/personal/landing/sequence.ts'
import { thresholdMotion, sculpturePose, createScaleSampler, createApertureSampler, pacedTravel, cinematicShot, portalPose, cinematicPhase } from '../src/personal/landing/motion-curves.ts'
import { scrollInkStrength } from '../src/personal/landing/scroll-dither.ts'
import { isStackedLanding, mobileSculptureFrame } from '../src/personal/landing/mobile-layout.ts'

import { landingRenderBudget } from '../src/personal/landing/render-budget.ts'
import { desktopSculptureFrame } from '../src/personal/landing/art-direction.ts'

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
  const urls = JSON.parse(await readFile(new URL('../public/portfolio-models/urls.json', import.meta.url), 'utf8'))
  for (const chapter of CHAPTERS) {
    const optimized = await readFile(new URL(`../public/${urls[chapter.assetId].split('?')[0]}`, import.meta.url))
    assert.equal(optimized.readUInt32LE(0), 0x46546c67)
    assert.ok(optimized.length < (await readFile(new URL(`../public/${chapter.asset}`, import.meta.url))).length)
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
  for (const mobile of [false, true]) for (let i = 0; i <= 4000; i++) {
    const p = i / 4000, scene = sceneSequence(p), type = textSequence(p, 'threshold', false, mobile), motion = thresholdMotion(scene.local)
    const linkOpacity = type.active > scene.leg ? motion.incomingLinks : motion.outgoingLinks
    if (linkOpacity > 0) assert.deepEqual(type.states[type.active], { reveal: 1, erase: 0 })
    assert.ok(type.states.filter(state => state.reveal > 0 && state.erase < 1).length <= 1)
  }
  assert.deepEqual(sculpturePose(1, true), sculpturePose(0, false))
  assert.deepEqual(sculpturePose(.85, true), sculpturePose(.04, false))
})

test('startup at a held chapter only requires that sculpture; transitions require the actual pair and visor', () => {
  for (let index = 0; index < CHAPTERS.length; index++) {
    assert.deepEqual(requiredScene(index / 4), { indexes: [index], portal: false })
  }
  for (let leg = 0; leg < 4; leg++) {
    assert.deepEqual(requiredScene((leg + .5) / 4), { indexes: [leg, leg + 1], portal: true })
    assert.deepEqual(requiredScene((leg + .85) / 4), { indexes: [leg + 1], portal: false })
  }
  assert.deepEqual(requiredScene(.6, true), { indexes: [3], portal: false })
})

test('short acceleration ramps join a steady travel rate and give the resolved chapter a reading hold', () => {
  const derivative = (t: number) => (pacedTravel(t + 1e-5) - pacedTravel(t - 1e-5)) / 2e-5
  near(derivative(.3), derivative(.7), 1e-8)
  assert.ok(derivative(0) < 1e-7 && derivative(1) < 1e-7)
  for (let i = 0; i <= 1000; i++) {
    const t = i / 1000
    near(pacedTravel(t), 1 - pacedTravel(1 - t))
    assert.ok(pacedTravel(t) >= 0 && pacedTravel(t) <= 1)
  }
  for (const local of [.83, .9, 1]) {
    assert.equal(thresholdMotion(local).travel, 1)
    assert.equal(thresholdMotion(local).incomingLinks, 1)
    assert.deepEqual(sculpturePose(local, true), sculpturePose(0, false))
  }
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

test('scroll following reverses immediately, settles quickly, and never overshoots its destination', () => {
  const first = advanceScrollMotion({ progress: 0, velocity: 0 }, .8, .02)
  assert.ok(first.progress > 0 && first.progress < .8 && first.velocity > 0)
  const reversal = advanceScrollMotion(first, 0, .000001)
  assert.ok(reversal.velocity < 0 && reversal.progress < first.progress)
  assert.ok(advanceScrollMotion({ progress: 0, velocity: 0 }, 1, 1 / 60).progress > .59)
  assert.ok(advanceScrollMotion({ progress: 0, velocity: 0 }, 1, .09).progress > .99)
  let motion = first
  for (let frame = 0; frame < 300; frame++) {
    motion = advanceScrollMotion(motion, .08, 1 / 60)
    assert.ok(motion.progress >= .08 && motion.progress <= 1)
    assert.ok(Number.isFinite(motion.velocity))
  }
  near(motion.progress, .08)
  near(motion.velocity, 0)
  const settled = advanceScrollMotion({ progress: .4, velocity: 8 }, .5, 1)
  near(settled.progress, .5); near(settled.velocity, 0)
})

test('moving ink is bounded, direction-independent, quiet at rest, and disabled for reduced motion', () => {
  assert.equal(scrollInkStrength(0, 3000, 720), 0)
  assert.equal(scrollInkStrength(2, 3000, 720, true), 0)
  assert.equal(scrollInkStrength(NaN, 3000, 720), 0)
  assert.equal(scrollInkStrength(1, 3000, 0), 0)
  near(scrollInkStrength(.2, 3000, 600), scrollInkStrength(-.2, 6000, 1200))
  assert.ok(scrollInkStrength(.08, 3000, 720) < scrollInkStrength(.3, 3000, 720))
  assert.ok(scrollInkStrength(100, 3000, 720) <= .3)
})

test('the actual visor aperture is visible early and expands at a consistent apparent rate across viewports', async () => {
  const bytes = await readFile(new URL('../public/landing/threshold-lens.glb', import.meta.url))
  const model = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const track = model.animations[0].tracks.find(track => track.name.endsWith('.scale'))!
  const opening = model.scene.getObjectByName('Opening')!
  const bounds = new Box3().setFromObject(opening), dimensions = bounds.getSize(new Vector3())
  // The clip begins at .001 scale. Recover the authored mesh dimensions.
  dimensions.divideScalar(track.values[0])
  const raw = createScaleSampler(track.times, track.values), scale = new Float64Array(3)
  for (const [width, height] of [[1280, 800], [1040, 977], [390, 844], [320, 568], [667, 375]]) {
    const span = 2 * 5.9 * Math.tan(16 * Math.PI / 180), wrapperScale = isStackedLanding(width, height) ? .35 : .9
    const ratioX = dimensions.x * wrapperScale / (span * width / height), ratioY = dimensions.y * wrapperScale / span
    const sample = createApertureSampler(raw, 1, ratioX, ratioY)
    const visible = (value: number) => 1.8 * value / (1.8 + value)
    const extent = () => Math.sqrt(visible(scale[0] * ratioX) * visible(scale[1] * ratioY))
    sample(0, scale); const start = extent()
    sample(1, scale); const end = extent()
    let previous = 0
    for (let i = 0; i <= 100; i++) {
      sample(i / 100, scale)
      const actual = extent()
      assert.ok(actual >= previous - 1e-8)
      near(actual, start + (end - start) * i / 100, 2e-5)
      previous = actual
    }
    sample(thresholdMotion(.20).travel, scale)
    assert.ok(scale[0] * ratioX * width > 45, `Visor lead-in too small at ${width}×${height}`)
    sample(1, scale)
    assert.ok(scale[0] * ratioX > 1.3 && scale[1] * ratioY > 1.3, `Aperture does not cover viewport at ${width}×${height}`)
    const ending = [...scale]
    sample(1 - 1e-7, scale)
    for (let axis = 0; axis < 3; axis++) near(scale[axis], ending[axis], .02)
  }
})

test('phone sculptures project inside the space below their title and links', () => {
  for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932], [600, 900]]) {
    const copyTop = Math.max(78, Math.min(120, height * .114))
    const lineHeight = Math.max(34, Math.min(64, width * .134, height * .064))
    for (const chapter of CHAPTERS) for (const bounds of [{ x: 1.7, y: 2, z: 1.4 }, { x: 2, y: 1.2, z: 1.8 }]) {
      const frame = mobileSculptureFrame(width, height, copyTop, lineHeight, chapter.lines.length, chapter.article ? 2 : 1, bounds, 34)
      const focal = height / (2 * Math.tan(16 * Math.PI / 180))
      assert.ok(frame.scale > 0 && Number.isFinite(frame.scale))
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const depth = 6.1 - sz * bounds.z * frame.scale / 2
        const x = width / 2 + focal * sx * bounds.x * frame.scale / 2 / depth
        const y = height / 2 - focal * (frame.y + sy * bounds.y * frame.scale / 2) / depth
        assert.ok(x >= width * .02 && x <= width * .98, `Horizontal clipping at ${width}×${height}`)
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
  for (const name of ['threshold-iris.glb', 'threshold-visor.glb', 'threshold-lens.glb']) {
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


test('touch rendering bounds the costly buffers while preserving a sharper type pass', () => {
  for (const [width, height, dpr, coarse] of [[390, 844, 3, true], [430, 932, 3, true], [667, 375, 2, true], [1280, 900, 2, false], [2560, 1440, 2, false]] as const) {
    const budget = landingRenderBudget(width, height, dpr, coarse)
    assert.ok(budget.sceneRatio <= budget.canvasRatio)
    assert.ok(width * height * budget.sceneRatio ** 2 <= (budget.mobile ? 230000 : 1200000) + 1)
    assert.ok(width * height * budget.canvasRatio ** 2 <= (budget.mobile ? 400000 : 2200000) + 1)
    assert.ok(budget.canvasRatio > 0 && budget.canvasRatio <= 1.25)
  }
})

test('enlarged desktop sculptures remain inside the viewport below the header', () => {
  for (const [width, height] of [[1040, 977], [1280, 800], [667, 375]]) {
    for (let index = 0; index < 5; index++) {
      const bounds = { x: 1.6, y: 2, z: 1.4 }, frame = desktopSculptureFrame(width, height, index, bounds)
      const focal = height / (2 * Math.tan(16 * Math.PI / 180))
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
        const depth = 5.9 - sz * bounds.z * frame.scale / 2
        const x = width / 2 + focal * (frame.x + sx * bounds.x * frame.scale / 2) / depth
        const y = height / 2 - focal * (frame.y + sy * bounds.y * frame.scale / 2) / depth
        assert.ok(x > width * .44 && x <= width * .98 + 1e-7)
        assert.ok(y >= Math.min(112, height * .22) - 1e-7 && y <= height - 20 + 1e-7)
      }
    }
  }
})


test('camera and light join the same rest shot with zero velocity, and mobile movement is restrained', () => {
  const rest = cinematicShot(0, false)
  assert.deepEqual(cinematicShot(1, true), rest)
  assert.deepEqual(cinematicShot(.74, true), rest)
  for (let index = 0; index < 5; index++) for (const incoming of [false, true]) {
    const boundary = incoming ? .68 : .10
    const a = cinematicShot(boundary - 1e-5, incoming, false, index), b = cinematicShot(boundary + 1e-5, incoming, false, index)
    for (const key of Object.keys(a) as (keyof typeof a)[]) near((b[key] - a[key]) / 2e-5, 0, 1e-6)
    for (let step = 0; step <= 100; step++) {
      const local = step / 100, desktop = cinematicShot(local, incoming, false, index), phone = cinematicShot(local, incoming, true, index)
      assert.ok(Math.abs(desktop.depth) <= .35 && Math.abs(phone.depth) <= .175)
      for (const key of ['x', 'y', 'depth', 'aimX', 'aimY'] as const) near(phone[key], desktop[key] * .5)
      assert.ok(Object.values(desktop).every(Number.isFinite))
    }
  }
  const positions = Array.from({length:101}, (_,i)=>i/100)
  for(const incoming of [false,true]) assert.deepEqual(positions.map(p=>cinematicShot(p,incoming)), [...positions].reverse().map(p=>cinematicShot(p,incoming)).reverse())
})

test('the optical turn resolves before the aperture clears, and links follow the settled camera', () => {
  for (let leg = 0; leg < 4; leg++) {
    for (const local of [.48, .62, 1]) {
      const optical = portalPose(local, leg)
      near(optical.pitch, 0); near(optical.yaw, 0); near(optical.roll, 0)
    }
    near(portalPose(.12, leg).center, 0)
    near(portalPose(.62, leg).center, 1)
  }
  for (let step = 0; step <= 1000; step++) {
    const local = step/1000, motion = thresholdMotion(local)
    if(motion.incomingLinks > 0) {
      assert.deepEqual(cinematicShot(local,true),cinematicShot(0,false))
      assert.deepEqual(sculpturePose(local,true),sculpturePose(0,false))
    }
  }
  assert.equal(cinematicPhase(.18),'approach')
  assert.equal(cinematicPhase(.4),'passage')
  assert.equal(cinematicPhase(.65),'settle')
  assert.equal(cinematicPhase(.85),'held')
})
