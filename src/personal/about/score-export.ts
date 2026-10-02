import { clampedPhraseTempo, totalPhraseBeats, validatePhrase, type PhraseNote } from './music-phrase.ts'
import { layoutScore, scorePitch, type ScoreEvent } from './score-layout.ts'

export type ScoreExportOptions = { title?: string; tempo?: number }
const types: Record<number, string> = { [.25]: '16th', [.5]: 'eighth', [1]: 'quarter', [2]: 'half', [4]: 'whole' }
const escapeXml = (text: string) => text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!)

function xmlNote(event: ScoreEvent) {
  const pitch = event.midi === null ? null : scorePitch(event.midi)
  const pitchXml = pitch ? `<pitch><step>${pitch.letter}</step>${pitch.sharp ? '<alter>1</alter>' : ''}<octave>${pitch.octave}</octave></pitch>` : '<rest/>'
  const ties = `${event.tieIn ? '<tie type="stop"/>' : ''}${event.tieOut ? '<tie type="start"/>' : ''}`
  const notationTies = `${event.tieIn ? '<tied type="stop"/>' : ''}${event.tieOut ? '<tied type="start"/>' : ''}`
  const accidental = event.accidental ? `<accidental>${event.accidental === '♯' ? 'sharp' : 'natural'}</accidental>` : ''
  const stem = pitch && event.beats !== 4 ? `<stem>${pitch.staffStep >= 4 ? 'down' : 'up'}</stem>` : ''
  return `<note>${pitchXml}<duration>${event.beats * 4}</duration>${ties}<type>${types[event.beats]}</type>${accidental}${stem}${notationTies ? `<notations>${notationTies}</notations>` : ''}</note>`
}

/** MusicXML 4.0: written octave plus the contrabass's sounding octave-down transpose. */
export function exportMusicXml(notes: readonly PhraseNote[], options: ScoreExportOptions = {}) {
  const score = layoutScore(notes)
  const title = escapeXml(options.title?.trim() || 'Untitled study')
  const tempo = clampedPhraseTempo(options.tempo ?? 88)
  const measures = score.measures.length ? score.measures : [{ index: 0, events: [], beats: 0, complete: false }]
  const body = measures.map((measure, index) => {
    const print = index > 0 && index % 8 === 0 ? '<print new-page="yes"/>' : index > 0 && index % 2 === 0 ? '<print new-system="yes"/>' : ''
    const attributes = index === 0 ? '<attributes><divisions>4</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>F</sign><line>4</line></clef><transpose><diatonic>0</diatonic><chromatic>0</chromatic><octave-change>-1</octave-change></transpose></attributes>' : ''
    const direction = index === 0 ? `<direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${tempo}</per-minute></metronome></direction-type><sound tempo="${tempo}"/></direction>` : ''
    const end = index === measures.length - 1 ? '<barline location="right"><bar-style>light-heavy</bar-style></barline>' : ''
    return `<measure number="${index + 1}" implicit="${measure.complete ? 'no' : 'yes'}">${print}${attributes}${direction}${measure.events.map(xmlNote).join('')}${end}</measure>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<score-partwise version="4.0"><work><work-title>${title}</work-title></work><movement-title>${title}</movement-title><part-list><score-part id="P1"><part-name>Double bass</part-name><part-abbreviation>Db.</part-abbreviation><score-instrument id="I1"><instrument-name>Double bass</instrument-name><instrument-abbreviation>Db.</instrument-abbreviation></score-instrument><midi-instrument id="I1"><midi-channel>1</midi-channel><midi-program>44</midi-program></midi-instrument></score-part></part-list><part id="P1">\n${body}\n</part></score-partwise>\n`
}

function variableLength(value: number) {
  const bytes = [value & 127]
  while ((value = Math.floor(value / 128)) > 0) bytes.unshift((value & 127) | 128)
  return bytes
}
function uint32(value: number) { return [value >>> 24 & 255, value >>> 16 & 255, value >>> 8 & 255, value & 255] }
function meta(type: number, bytes: number[]) { return [255, type, ...variableLength(bytes.length), ...bytes] }

/** Standard MIDI format 0, 480 ticks/quarter; pitches are sounding E1–G3. */
export function exportMidi(notes: readonly PhraseNote[], options: ScoreExportOptions = {}) {
  const validation = validatePhrase(notes)
  if (!validation.valid) throw new RangeError(validation.error!)
  const tempo = Math.round(60000000 / clampedPhraseTempo(options.tempo ?? 88))
  const title = Array.from(new TextEncoder().encode(options.title?.trim() || 'Untitled study'))
  const events: Array<{ tick: number; order: number; bytes: number[] }> = [
    { tick: 0, order: 0, bytes: meta(3, title) },
    { tick: 0, order: 1, bytes: meta(81, [tempo >>> 16 & 255, tempo >>> 8 & 255, tempo & 255]) },
    { tick: 0, order: 2, bytes: meta(88, [4, 2, 24, 8]) },
    { tick: 0, order: 3, bytes: [192, 43] }, // GM instrument 44, encoded zero-based.
  ]
  let cursor = 0
  for (const note of notes) {
    const duration = note.beats * 480
    if (note.midi !== null) {
      events.push({ tick: cursor, order: 5, bytes: [144, note.midi, 96] })
      events.push({ tick: cursor + duration, order: 4, bytes: [128, note.midi, 0] })
    }
    cursor += duration
  }
  events.push({ tick: totalPhraseBeats(notes) * 480, order: 6, bytes: [255, 47, 0] })
  events.sort((a, b) => a.tick - b.tick || a.order - b.order)
  const track: number[] = []
  let previous = 0
  for (const event of events) { track.push(...variableLength(event.tick - previous), ...event.bytes); previous = event.tick }
  return Uint8Array.from([77, 84, 104, 100, 0, 0, 0, 6, 0, 0, 0, 1, 1, 224, 77, 84, 114, 107, ...uint32(track.length), ...track])
}
