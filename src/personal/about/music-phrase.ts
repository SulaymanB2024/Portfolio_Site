export type PhraseNote = { midi: number | null; beats: number }

export const PHRASE_BEATS = [.25, .5, 1, 2, 4] as const
export const MAX_PHRASE_EVENTS = 64
export const MAX_PHRASE_BEATS = 128
export const BEATS_PER_MEASURE = 4

export const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export function midiFrequency(midi: number) { return 440 * 2 ** ((midi - 69) / 12) }
export function midiLabel(midi: number | null) { return midi === null ? 'Rest' : `${noteNames[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}` }

export function totalPhraseBeats(notes: readonly PhraseNote[]) { return notes.reduce((beats, note) => beats + note.beats, 0) }

/** Retain the crossing event so the engraver can draw its outgoing tie. */
export function firstMeasurePhrase(notes: readonly PhraseNote[]): PhraseNote[] {
  let beats = 0
  const opening: PhraseNote[] = []
  for (const note of notes) {
    if (beats >= BEATS_PER_MEASURE) break
    opening.push(note)
    beats += note.beats
  }
  return opening
}
export function clampedPhraseTempo(tempo: number) { return Math.max(40, Math.min(180, Number.isFinite(tempo) ? tempo : 88)) }

export function isPhraseNote(note: PhraseNote) {
  return (note.midi === null || Number.isInteger(note.midi) && note.midi >= 28 && note.midi <= 55)
    && (PHRASE_BEATS as readonly number[]).includes(note.beats)
}

export function validatePhrase(notes: readonly PhraseNote[]) {
  if (notes.length > MAX_PHRASE_EVENTS) return { valid: false, error: 'A piece may contain at most 64 notes and rests.' }
  if (!notes.every(isPhraseNote)) return { valid: false, error: 'Choose E1–G3 or a rest, and a sixteenth, eighth, quarter, half or whole note.' }
  if (totalPhraseBeats(notes) > MAX_PHRASE_BEATS) return { valid: false, error: 'A piece may contain at most 128 beats.' }
  return { valid: true, error: null }
}

export function phraseSchedule(notes: readonly PhraseNote[], tempo: number) {
  const validation = validatePhrase(notes)
  if (!validation.valid) throw new RangeError(validation.error!)
  const bpm = clampedPhraseTempo(tempo)
  let delay = 0
  return notes.map((note, sourceIndex) => {
    const duration = note.beats * 60 / bpm
    const event = { frequency: note.midi === null ? null : midiFrequency(note.midi), sourceIndex, delay, duration }
    delay += duration
    return event
  })
}

export function addPhraseNote(notes: readonly PhraseNote[], note: PhraseNote, limit = MAX_PHRASE_EVENTS): PhraseNote[] {
  const candidate = [...notes, note]
  if (notes.length >= Math.min(MAX_PHRASE_EVENTS, Math.max(0, limit)) || !validatePhrase(candidate).valid) return [...notes]
  return candidate
}
