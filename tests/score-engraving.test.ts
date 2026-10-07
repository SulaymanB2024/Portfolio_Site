import test from 'node:test'
import assert from 'node:assert/strict'
import { buildScoreEngraving, drawScoreCanvas, scorePageCount, type ScoreCommand } from '../src/personal/about/score-engraving.ts'
import { firstMeasurePhrase, type PhraseNote } from '../src/personal/about/music-phrase.ts'

test('the opening preview shows a complete bar of short notes and retains a crossing tie', () => {
  const short: PhraseNote[] = Array.from({ length: 16 }, (_, index) => ({ midi: index % 4 === 0 ? null : 43, beats: .25 }))
  const piece = [...short, { midi: 28, beats: 4 }]
  const opening = buildScoreEngraving(firstMeasurePhrase(piece), { activeIndex: 15 })
  assert.deepEqual(opening.hitTargets.filter(target => target.measure === 0), buildScoreEngraving(piece, { activeIndex: 15 }).hitTargets.filter(target => target.measure === 0))
  assert.equal(opening.hitTargets.length, 16, 'all sixteen events fit in the first bar')
  assert.ok(opening.commands.some(command => command.role === 'playback-highlight' && command.sourceIndex === 15))
  assert.ok(!opening.commands.some(command => command.sourceIndex === 16), 'later bars add no SVG commands to the small preview')
  const crossing: PhraseNote[] = [{ midi: null, beats: 2 }, { midi: 28, beats: 1 }, { midi: 28, beats: .5 }, { midi: 43, beats: 4 }, { midi: 55, beats: 1 }]
  const engraved = buildScoreEngraving(firstMeasurePhrase(crossing))
  assert.deepEqual(engraved.hitTargets.filter(target => target.measure === 0), buildScoreEngraving(crossing).hitTargets.filter(target => target.measure === 0))
  assert.ok(engraved.commands.some(command => command.role === 'tie' && command.sourceIndex === 3))
  assert.deepEqual(firstMeasurePhrase([]), [])
})

test('the blank manuscript has four vector bass-clef staves and eight numbered 4/4 measures', () => {
  const engraving = buildScoreEngraving([], { title: 'A study', tempo: 88 })
  assert.equal(engraving.width, 768)
  assert.equal(engraving.height, 1024)
  assert.equal(engraving.pageCount, 1)
  assert.equal(engraving.commands.filter(command => command.role === 'staff').length, 20)
  assert.equal(engraving.commands.filter(command => command.role === 'clef' && command.kind === 'path').length, 4)
  assert.equal(engraving.commands.filter(command => command.role === 'clef-dot').length, 8)
  assert.equal(engraving.commands.filter(command => command.role === 'time-signature').length, 2)
  assert.deepEqual(engraving.commands.filter(command => command.role === 'measure-number' && command.kind === 'text').map(command => command.kind === 'text' ? command.text : ''), ['1', '2', '3', '4', '5', '6', '7', '8'])
  assert.equal(engraving.hitTargets.length, 0)
  assert.ok(engraving.commands.filter(command => command.kind === 'text').every(command => command.role !== 'clef' && command.role !== 'rest'))
})

test('correct noteheads, stems, beams, accidentals, rests and ledger lines retain source-event ownership', () => {
  const notes: PhraseNote[] = [{ midi: 28, beats: .25 }, { midi: 30, beats: .25 }, { midi: 31, beats: .5 }, { midi: null, beats: 1 }, { midi: 43, beats: 2 }, { midi: 55, beats: 4 }]
  const engraving = buildScoreEngraving(notes)
  const heads = engraving.commands.filter(command => command.role === 'notehead')
  assert.equal(heads.length, 5)
  assert.deepEqual(heads.map(command => command.sourceIndex), [0, 1, 2, 4, 5])
  assert.equal(engraving.commands.filter(command => command.role === 'stem').length, 4)
  assert.equal(engraving.commands.filter(command => command.role === 'beam').length, 2)
  assert.equal(engraving.commands.filter(command => command.role === 'flag').length, 0)
  assert.equal(engraving.commands.filter(command => command.role === 'accidental' && command.sourceIndex === 1).length, 4)
  assert.equal(engraving.commands.filter(command => command.role === 'rest' && command.sourceIndex === 3).length, 1)
  assert.equal(engraving.commands.filter(command => command.role === 'ledger' && command.sourceIndex === 0).length, 1)
  assert.equal(engraving.commands.filter(command => command.role === 'ledger' && command.sourceIndex === 5).length, 3)
  const half = heads.find(command => command.sourceIndex === 4)!
  const whole = heads.find(command => command.sourceIndex === 5)!
  assert.ok(half.kind === 'ellipse' && !half.fill)
  assert.ok(whole.kind === 'ellipse' && !whole.fill && whole.rx > half.rx)
  assert.ok(!engraving.commands.some(command => command.role === 'stem' && command.sourceIndex === 5))
  assert.deepEqual(engraving.hitTargets.map(target => target.sourceIndex), [0, 1, 2, 3, 4, 5])
})

test('page selection preserves later notes, normalized source mapping and playback highlighting', () => {
  const notes = Array.from({ length: 64 }, () => ({ midi: 43, beats: 2 }))
  assert.equal(scorePageCount(notes), 4)
  const engraving = buildScoreEngraving(notes, { page: 3, activeIndex: 63 })
  assert.deepEqual(engraving.hitTargets.map(target => target.sourceIndex), Array.from({ length: 16 }, (_, index) => index + 48))
  const highlighted = engraving.commands.filter(command => command.role === 'playback-highlight')
  assert.equal(highlighted.length, 1)
  assert.equal(highlighted[0].sourceIndex, 63)
  assert.ok(engraving.hitTargets.every(target => target.x > 0 && target.y > 0 && target.x + target.width < 768 && target.y + target.height < 1024))
  assert.equal(buildScoreEngraving(notes, { page: 99 }).page, 3)
  assert.deepEqual(buildScoreEngraving(notes, { page: 3 }), buildScoreEngraving(notes, { page: 3 }), 'engraving is deterministic')
})

test('ties crossing a page remain attached to the same original event on both pages', () => {
  const notes: PhraseNote[] = [...Array.from({ length: 7 }, () => ({ midi: null, beats: 4 })), { midi: null, beats: 2 }, { midi: null, beats: 1 }, { midi: null, beats: .5 }, { midi: 33, beats: 4 }]
  const first = buildScoreEngraving(notes, { page: 0 })
  const second = buildScoreEngraving(notes, { page: 1 })
  assert.equal(first.pageCount, 2)
  assert.equal(first.commands.filter(command => command.role === 'tie').length, 1)
  assert.equal(second.commands.filter(command => command.role === 'tie').length, 3)
  assert.ok([...first.commands, ...second.commands].filter(command => command.role === 'tie').every(command => command.sourceIndex === 10))
  assert.ok(first.hitTargets.some(target => target.sourceIndex === 10) && second.hitTargets.some(target => target.sourceIndex === 10))
})

test('isolated short notes get flags and all five rest durations have vector glyphs', () => {
  const notes: PhraseNote[] = [{ midi: 28, beats: .25 }, { midi: null, beats: .25 }, { midi: 31, beats: .5 }, { midi: null, beats: .5 }, { midi: null, beats: 1 }, { midi: null, beats: 2 }, { midi: null, beats: 4 }]
  const engraving = buildScoreEngraving(notes)
  assert.equal(engraving.commands.filter(command => command.role === 'flag' && command.sourceIndex === 0).length, 2)
  assert.equal(engraving.commands.filter(command => command.role === 'flag' && command.sourceIndex === 2).length, 1)
  assert.equal(engraving.commands.filter(command => command.role === 'beam').length, 0)
  for (const sourceIndex of [1, 3, 4, 5, 6]) assert.ok(engraving.commands.some(command => command.role === 'rest' && command.sourceIndex === sourceIndex))
})

test('Canvas draws the same vector commands as the SVG source onto a cleared transparent page', () => {
  const original = globalThis.Path2D
  class RecordedPath { d: string; constructor(d: string) { this.d = d } }
  globalThis.Path2D = RecordedPath as unknown as typeof Path2D
  const paths: string[] = [], texts: string[] = [], ellipses: Array<number[]> = [], clears: number[][] = [], scales: number[][] = []
  const context = {
    canvas: { width: 1536, height: 2048 }, save() {}, restore() {}, setTransform() {}, clearRect(...values: number[]) { clears.push(values) }, scale(...values: number[]) { scales.push(values) }, beginPath() {}, moveTo() {}, lineTo() {}, fillRect() {},
    ellipse(...values: number[]) { ellipses.push(values) }, fillText(value: string) { texts.push(value) }, fill(shape?: RecordedPath) { if (shape) paths.push(shape.d) }, stroke(shape?: RecordedPath) { if (shape) paths.push(shape.d) },
  } as unknown as CanvasRenderingContext2D
  try {
    const notes = [{ midi: 28, beats: .5 }, { midi: null, beats: 1 }, { midi: 55, beats: 4 }]
    const engraved = drawScoreCanvas(context, notes, { title: '<A quiet & careful piece>', tempo: 90, activeIndex: 0 })
    const expectedPaths = engraved.commands.filter((command): command is ScoreCommand & { kind: 'path' } => command.kind === 'path').map(command => command.d)
    assert.deepEqual(paths, expectedPaths)
    assert.deepEqual(clears, [[0, 0, 1536, 2048]])
    assert.deepEqual(scales, [[2, 2]])
    assert.ok(texts.includes('<A quiet & careful piece>'))
    assert.equal(ellipses.length, engraved.commands.filter(command => command.kind === 'ellipse').length)
  } finally {
    if (original) globalThis.Path2D = original
    else delete (globalThis as { Path2D?: unknown }).Path2D
  }
})
