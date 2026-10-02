import { BEATS_PER_MEASURE, PHRASE_BEATS, totalPhraseBeats, validatePhrase, type PhraseNote } from './music-phrase.ts'

export type ScorePitch = { writtenMidi: number; letter: string; octave: number; sharp: boolean; staffStep: number; ledgerLines: number[] }
export type ScoreEvent = {
  sourceIndex: number
  midi: number | null
  writtenMidi: number | null
  kind: 'note' | 'rest'
  beats: number
  measure: number
  beat: number
  /** Normalized horizontal position within this 4/4 measure (before page margins). */
  x: number
  /** Bottom bass-clef line G2 is 0; each line/space is one diatonic step. */
  staffStep: number | null
  accidental: '♯' | '♮' | null
  ledgerLines: number[]
  tieIn: boolean
  tieOut: boolean
}
export type ScoreMeasure = { index: number; events: ScoreEvent[]; beats: number; complete: boolean }

/** Double bass writes one octave above sounding pitch; black keys are spelled as sharps. */
export function scorePitch(midi: number): ScorePitch {
  if (!Number.isInteger(midi) || midi < 28 || midi > 55) throw new RangeError('Score pitch must lie between E1 and G3')
  const spellings = [['C', false], ['C', true], ['D', false], ['D', true], ['E', false], ['F', false], ['F', true], ['G', false], ['G', true], ['A', false], ['A', true], ['B', false]] as const
  const writtenMidi = midi + 12
  const [letter, sharp] = spellings[writtenMidi % 12]
  const octave = Math.floor(writtenMidi / 12) - 1
  const staffStep = octave * 7 + ['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(letter) - 18
  const ledgerLines: number[] = []
  for (let step = -2; step >= staffStep; step -= 2) ledgerLines.push(step)
  for (let step = 10; step <= staffStep; step += 2) ledgerLines.push(step)
  return { writtenMidi, letter, octave, sharp, staffStep, ledgerLines }
}

/** Split into conventional durations; notation ties pitched fragments, never rests. */
export function layoutScore(notes: readonly PhraseNote[]) {
  const validation = validatePhrase(notes)
  if (!validation.valid) throw new RangeError(validation.error!)
  const totalBeats = totalPhraseBeats(notes)
  const totalMeasures = Math.ceil(totalBeats / BEATS_PER_MEASURE)
  const measures: ScoreMeasure[] = Array.from({ length: totalMeasures }, (_, index) => ({ index, events: [], beats: Math.min(4, totalBeats - index * 4), complete: totalBeats >= (index + 1) * 4 }))
  const events: ScoreEvent[] = []
  const accidentals = new Map<number, Map<string, boolean>>()
  let cursor = 0
  notes.forEach((note, sourceIndex) => {
    let remaining = note.beats
    let segment = 0
    while (remaining > 0) {
      const measure = Math.floor(cursor / 4)
      const beat = cursor % 4
      const capacity = Math.min(remaining, 4 - beat)
      const beats = [...PHRASE_BEATS].reverse().find(value => value <= capacity)!
      const pitch = note.midi === null ? null : scorePitch(note.midi)
      const tieIn = !!pitch && segment > 0
      const tieOut = !!pitch && remaining > beats
      let accidental: ScoreEvent['accidental'] = null
      if (pitch) {
        const states = accidentals.get(measure) ?? new Map<string, boolean>()
        accidentals.set(measure, states)
        const key = `${pitch.letter}${pitch.octave}`
        const prior = states.get(key) ?? false
        if (!tieIn && prior !== pitch.sharp) accidental = pitch.sharp ? '♯' : '♮'
        states.set(key, pitch.sharp)
      }
      const event: ScoreEvent = { sourceIndex, midi: note.midi, writtenMidi: pitch?.writtenMidi ?? null, kind: pitch ? 'note' : 'rest', beats, measure, beat, x: beat / 4, staffStep: pitch?.staffStep ?? null, accidental, ledgerLines: pitch?.ledgerLines ?? [], tieIn, tieOut }
      measures[measure].events.push(event)
      events.push(event)
      remaining -= beats
      cursor += beats
      segment++
    }
  })
  return { measures, events, totalBeats, totalMeasures }
}
