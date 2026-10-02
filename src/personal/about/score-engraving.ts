import { clampedPhraseTempo, midiLabel, type PhraseNote } from './music-phrase.ts'
import { layoutScore, type ScoreEvent } from './score-layout.ts'

export const SCORE_WIDTH = 768
export const SCORE_HEIGHT = 1024
export const SCORE_MEASURES_PER_PAGE = 8
export type ScoreDrawingOptions = { title?: string; tempo?: number; page?: number; activeIndex?: number | null; ink?: string }
type CommandMetadata = { role: string; sourceIndex?: number; alpha?: number }
export type ScoreCommand = CommandMetadata & (
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; width: number }
  | { kind: 'path'; d: string; fill: boolean; width: number }
  | { kind: 'ellipse'; x: number; y: number; rx: number; ry: number; rotation: number; fill: boolean; width: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; fill: boolean }
  | { kind: 'text'; x: number; y: number; text: string; size: number; font: 'serif' | 'mono'; anchor: 'start' | 'middle' | 'end' }
)
export type ScoreHitTarget = { sourceIndex: number; x: number; y: number; width: number; height: number; label: string; measure: number }
type PositionedEvent = { event: ScoreEvent; x: number; y: number; system: number; bottom: number; down: boolean }

export function scorePageCount(notes: readonly PhraseNote[]) { return Math.max(1, Math.ceil(layoutScore(notes).totalMeasures / SCORE_MEASURES_PER_PAGE)) }

function titleLines(title: string) {
  const words = (title.trim() || 'Untitled study').split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (line && (line + ' ' + word).length > 42) { lines.push(line); line = word }
    else line += (line ? ' ' : '') + word
  }
  if (line) lines.push(line)
  return lines.slice(0, 2).map(value => value.length > 48 ? value.slice(0, 47) + '…' : value)
}

/** A deterministic vector engraving shared by the SVG editor and the 3D paper texture. */
export function buildScoreEngraving(notes: readonly PhraseNote[], options: ScoreDrawingOptions = {}) {
  const score = layoutScore(notes)
  const pageCount = Math.max(1, Math.ceil(score.totalMeasures / 8))
  const requestedPage = Number.isFinite(options.page) ? Math.floor(options.page!) : 0
  const page = Math.max(0, Math.min(pageCount - 1, requestedPage))
  const commands: ScoreCommand[] = []
  const hitTargets: ScoreHitTarget[] = []
  const positioned = new Map<ScoreEvent, PositionedEvent>()
  const line = (x1: number, y1: number, x2: number, y2: number, width = 1.2, role = 'staff', sourceIndex?: number) => commands.push({ kind: 'line', x1, y1, x2, y2, width, role, sourceIndex })
  const path = (d: string, fill = true, width = 1.4, role = 'glyph', sourceIndex?: number) => commands.push({ kind: 'path', d, fill, width, role, sourceIndex })
  const ellipse = (x: number, y: number, rx: number, ry: number, fill = true, rotation = 0, role = 'glyph', sourceIndex?: number) => commands.push({ kind: 'ellipse', x, y, rx, ry, fill, rotation, width: fill ? 0 : 2.2, role, sourceIndex })
  const rect = (x: number, y: number, width: number, height: number, role = 'glyph', sourceIndex?: number) => commands.push({ kind: 'rect', x, y, width, height, fill: true, role, sourceIndex })
  const text = (x: number, y: number, value: string, size: number, font: 'serif' | 'mono' = 'mono', anchor: 'start' | 'middle' | 'end' = 'start', role = 'label') => commands.push({ kind: 'text', x, y, text: value, size, font, anchor, role })

  titleLines(options.title ?? '').forEach((value, index) => text(384, 82 + index * 32, value, 29, 'serif', 'middle', 'title'))
  text(64, 142, 'DOUBLE BASS', 10)
  text(704, 142, `QUARTER NOTE = ${clampedPhraseTempo(options.tempo ?? 88)}`, 10, 'mono', 'end')
  line(64, 158, 704, 158, .7, 'rule')
  text(64, 946, 'Sounds one octave below the written score.', 10)
  text(704, 978, `${page + 1} / ${pageCount}`, 10, 'mono', 'end', 'page-number')

  for (let system = 0; system < 4; system++) {
    const bottom = 266 + system * 178
    for (let staffLine = 0; staffLine < 5; staffLine++) line(64, bottom - staffLine * 12, 704, bottom - staffLine * 12)
    line(64, bottom - 48, 64, bottom, 1.2, 'barline')
    line(384, bottom - 48, 384, bottom, 1.2, 'barline')
    line(704, bottom - 48, 704, bottom, 1.2, 'barline')
    const clefX = 83, clefY = bottom - 36
    // Original closed contour: F-clef bowl and descending curl, plus the two F-line dots.
    path(`M ${clefX - 2} ${clefY + 2} C ${clefX - 13} ${clefY - 6} ${clefX - 7} ${clefY - 22} ${clefX + 6} ${clefY - 20} C ${clefX + 25} ${clefY - 19} ${clefX + 24} ${clefY - 3} ${clefX + 17} ${clefY + 9} C ${clefX + 10} ${clefY + 23} ${clefX - 2} ${clefY + 33} ${clefX - 17} ${clefY + 38} C ${clefX - 4} ${clefY + 26} ${clefX + 8} ${clefY + 13} ${clefX + 9} ${clefY} C ${clefX + 10} ${clefY - 9} ${clefX + 5} ${clefY - 13} ${clefX} ${clefY - 10} C ${clefX - 4} ${clefY - 8} ${clefX - 3} ${clefY - 3} ${clefX - 2} ${clefY + 2} Z`, true, 0, 'clef')
    ellipse(clefX + 29, clefY - 6, 2.8, 2.8, true, 0, 'clef-dot')
    ellipse(clefX + 29, clefY + 6, 2.8, 2.8, true, 0, 'clef-dot')
    if (system === 0) {
      for (const y of [bottom - 47, bottom - 23]) {
        const x = 122
        path(`M ${x + 9} ${y} L ${x} ${y + 13} L ${x} ${y + 16} L ${x + 10} ${y + 16} L ${x + 10} ${y + 23} L ${x + 14} ${y + 23} L ${x + 14} ${y + 16} L ${x + 18} ${y + 16} L ${x + 18} ${y + 12} L ${x + 14} ${y + 12} L ${x + 14} ${y} L ${x + 10} ${y} L ${x + 10} ${y + 12} L ${x + 4} ${y + 12} L ${x + 13} ${y} Z`, true, 0, 'time-signature')
      }
    }
    for (let column = 0; column < 2; column++) {
      const measureIndex = page * 8 + system * 2 + column
      const measure = score.measures[measureIndex]
      const barLeft = column ? 384 : 64, barRight = column ? 704 : 384
      text(barLeft + 2, bottom - 69, String(measureIndex + 1), 10, 'mono', 'start', 'measure-number')
      if (!measure) continue
      const firstX = column ? 411 : system === 0 ? 166 : 146
      const noteWidth = barRight - firstX - 19
      for (const event of measure.events) {
        const x = firstX + noteWidth * event.x
        const y = event.staffStep === null ? bottom - 24 : bottom - event.staffStep * 6
        const position = { event, x, y, system, bottom, down: (event.staffStep ?? 0) >= 4 }
        positioned.set(event, position)
        hitTargets.push({ sourceIndex: event.sourceIndex, x: x - 13, y: y - 22, width: 26, height: 44, label: `Event ${event.sourceIndex + 1}: ${midiLabel(event.midi)}, ${event.beats === .25 ? 'sixteenth' : event.beats === .5 ? 'eighth' : event.beats === 1 ? 'quarter' : event.beats === 2 ? 'half' : 'whole'} ${event.kind}`, measure: measureIndex })
        if (options.activeIndex === event.sourceIndex) commands.push({ kind: 'ellipse', x, y, rx: 19, ry: 25, rotation: 0, fill: true, width: 0, alpha: .13, role: 'playback-highlight', sourceIndex: event.sourceIndex })
        if (event.kind === 'rest') {
          if (event.beats === 4) rect(x - 7, bottom - 36, 14, 5.2, 'rest', event.sourceIndex)
          else if (event.beats === 2) rect(x - 7, bottom - 29.2, 14, 5.2, 'rest', event.sourceIndex)
          else if (event.beats === 1) path(`M ${x - 4} ${y - 15} L ${x + 5} ${y - 5} L ${x - 2} ${y + 3} Q ${x + 8} ${y + 8} ${x + 2} ${y + 15} Q ${x - 8} ${y + 9} ${x - 4} ${y + 4} L ${x} ${y} L ${x - 7} ${y - 9} Z`, true, 0, 'rest', event.sourceIndex)
          else {
            const count = event.beats === .25 ? 2 : 1
            line(x + 4, y - 11, x - 3, y + 14 + (count - 1) * 5, 2.1, 'rest', event.sourceIndex)
            for (let flag = 0; flag < count; flag++) {
              ellipse(x - 1.4 - flag * 1.7, y - 8 + flag * 8, 3.4, 3.1, true, 0, 'rest', event.sourceIndex)
              path(`M ${x + 4 - flag * 1.7} ${y - 11 + flag * 8} Q ${x + 1 - flag * 1.7} ${y - 1 + flag * 8} ${x - 4 - flag * 1.7} ${y - 7 + flag * 8}`, false, 1.8, 'rest', event.sourceIndex)
            }
          }
          continue
        }
        for (const step of event.ledgerLines) line(x - 11, bottom - step * 6, x + 11, bottom - step * 6, 1.4, 'ledger', event.sourceIndex)
        if (event.accidental === '♯') {
          const a = x - 19
          line(a - 3, y - 12, a - 4, y + 12, 1.3, 'accidental', event.sourceIndex)
          line(a + 3, y - 13, a + 2, y + 11, 1.3, 'accidental', event.sourceIndex)
          line(a - 8, y - 3, a + 7, y - 6, 3, 'accidental', event.sourceIndex)
          line(a - 8, y + 5, a + 7, y + 2, 3, 'accidental', event.sourceIndex)
        } else if (event.accidental === '♮') {
          const a = x - 19
          line(a - 3, y - 12, a - 3, y + 6, 1.4, 'accidental', event.sourceIndex)
          line(a + 3, y - 6, a + 3, y + 12, 1.4, 'accidental', event.sourceIndex)
          line(a - 3, y - 3, a + 3, y - 6, 2.8, 'accidental', event.sourceIndex)
          line(a - 3, y + 6, a + 3, y + 3, 2.8, 'accidental', event.sourceIndex)
        }
        ellipse(x, y, event.beats === 4 ? 8 : 6.4, 4.5, event.beats < 2, event.beats === 4 ? 0 : -20, 'notehead', event.sourceIndex)
      }

      // Beam short notes within the same quarter-note beat; rests and barlines break groups.
      const beamGroups: PositionedEvent[][] = []
      let group: PositionedEvent[] = []
      const flush = () => { if (group.length > 1) beamGroups.push(group); group = [] }
      for (const event of measure.events) {
        const position = positioned.get(event)!
        if (event.kind === 'rest' || event.beats >= 1) { flush(); continue }
        if (group.length && Math.floor(group[0].event.beat) !== Math.floor(event.beat)) flush()
        group.push(position)
      }
      flush()
      const beamed = new Set(beamGroups.flat().map(position => position.event))
      for (const group of beamGroups) {
        const down = group.reduce((sum, position) => sum + position.event.staffStep!, 0) / group.length >= 4
        const beamY = down ? Math.max(...group.map(position => position.y)) + 35 : Math.min(...group.map(position => position.y)) - 35
        const stemX = (position: PositionedEvent) => position.x + (down ? -5.6 : 5.6)
        for (const position of group) { position.down = down; line(stemX(position), position.y, stemX(position), beamY, 1.5, 'stem', position.event.sourceIndex) }
        rect(stemX(group[0]), beamY - (down ? 0 : 4), stemX(group[group.length - 1]) - stemX(group[0]) + 1, 4, 'beam', group[0].event.sourceIndex)
        for (let index = 0; index < group.length; index++) {
          if (group[index].event.beats !== .25) continue
          const current = stemX(group[index])
          const next = group[index + 1]
          const previous = group[index - 1]
          const y = beamY + (down ? -8 : 4)
          if (next?.event.beats === .25) rect(current, y, stemX(next) - current + 1, 4, 'beam', group[index].event.sourceIndex)
          else if (previous?.event.beats !== .25) {
            const direction = next ? 1 : -1
            const length = Math.min(11, Math.abs(stemX(next ?? previous) - current) / 2)
            rect(direction === 1 ? current : current - length, y, length, 4, 'beam', group[index].event.sourceIndex)
          }
        }
      }
      for (const event of measure.events) {
        if (event.kind === 'rest' || event.beats === 4 || beamed.has(event)) continue
        const position = positioned.get(event)!
        const direction = position.down ? 1 : -1
        const x = position.x + (position.down ? -5.6 : 5.6), y = position.y + direction * 35
        line(x, position.y, x, y, 1.5, 'stem', event.sourceIndex)
        const flagCount = event.beats === .25 ? 2 : event.beats === .5 ? 1 : 0
        for (let flag = 0; flag < flagCount; flag++) {
          const f = y - direction * flag * 8, side = position.down ? -1 : 1
          path(`M ${x} ${f} C ${x + side * 18} ${f - direction * 7} ${x + side * 16} ${f - direction * 19} ${x + side * 5} ${f - direction * 24} C ${x + side * 11} ${f - direction * 13} ${x + side * 7} ${f - direction * 10} ${x} ${f - direction * 8} Z`, true, 0, 'flag', event.sourceIndex)
        }
      }
      if (measureIndex === score.totalMeasures - 1 && score.totalMeasures > 0) {
        line(barRight - 5, bottom - 48, barRight - 5, bottom, 1.2, 'final-barline')
        line(barRight, bottom - 48, barRight, bottom, 3.2, 'final-barline')
      }
    }
  }

  const tie = (fromX: number, toX: number, y: number, down: boolean, sourceIndex: number) => {
    if (toX <= fromX) return
    const side = down ? -1 : 1, lift = Math.min(13, (toX - fromX) / 4)
    path(`M ${fromX} ${y + side * 9} C ${fromX + (toX - fromX) * .3} ${y + side * (9 + lift)} ${toX - (toX - fromX) * .3} ${y + side * (9 + lift)} ${toX} ${y + side * 9}`, false, 1.6, 'tie', sourceIndex)
  }
  score.events.forEach((event, index) => {
    const position = positioned.get(event)
    if (!position) return
    if (event.tieOut) {
      const next = positioned.get(score.events[index + 1])
      tie(position.x + 7, next?.system === position.system ? next.x - 7 : 699, position.y, position.down, event.sourceIndex)
    }
    if (event.tieIn) {
      const previous = positioned.get(score.events[index - 1])
      if (!previous || previous.system !== position.system) tie(position.x - 25, position.x - 7, position.y, position.down, event.sourceIndex)
    }
  })
  return { width: SCORE_WIDTH, height: SCORE_HEIGHT, page, pageCount, commands, hitTargets }
}

export function drawScoreCanvas(context: CanvasRenderingContext2D, notes: readonly PhraseNote[], options: ScoreDrawingOptions = {}) {
  const engraving = buildScoreEngraving(notes, options)
  if (!context.canvas.width) context.canvas.width = SCORE_WIDTH
  if (!context.canvas.height) context.canvas.height = SCORE_HEIGHT
  const width = context.canvas.width || SCORE_WIDTH, height = context.canvas.height || SCORE_HEIGHT
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, width, height)
  context.scale(width / SCORE_WIDTH, height / SCORE_HEIGHT)
  context.fillStyle = context.strokeStyle = options.ink ?? '#24221e'
  context.lineCap = 'round'
  context.lineJoin = 'round'
  for (const command of engraving.commands) {
    context.globalAlpha = command.alpha ?? 1
    if (command.kind === 'text') {
      context.font = `${command.size}px ${command.font === 'serif' ? "Georgia, 'Times New Roman', serif" : "'Courier New', monospace"}`
      context.textAlign = command.anchor === 'middle' ? 'center' : command.anchor === 'end' ? 'right' : 'left'
      context.fillText(command.text, command.x, command.y)
    } else if (command.kind === 'rect') context.fillRect(command.x, command.y, command.width, command.height)
    else if (command.kind === 'path') {
      const shape = new Path2D(command.d)
      context.lineWidth = command.width
      if (command.fill) context.fill(shape); else context.stroke(shape)
    } else if (command.kind === 'line') {
      context.lineWidth = command.width
      context.beginPath(); context.moveTo(command.x1, command.y1); context.lineTo(command.x2, command.y2); context.stroke()
    } else {
      context.lineWidth = command.width
      context.beginPath(); context.ellipse(command.x, command.y, command.rx, command.ry, command.rotation * Math.PI / 180, 0, Math.PI * 2)
      if (command.fill) context.fill(); else context.stroke()
    }
  }
  context.restore()
  return engraving
}
