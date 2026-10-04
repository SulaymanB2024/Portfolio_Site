import { midiFrequency } from './music-phrase.ts'

export type BassExcerpt = {
  id: string; composer: string; title: string; passage: string; tempo: number
  source: string; sourceLabel: string; edition: string; interpretation: string
  spellings?: Readonly<Record<number, string>>
  notes: readonly { midi: number | null; beats: number }[]
}
const notes = (values: readonly (readonly [number | null, number])[]) => values.map(([midi, beats]) => ({ midi, beats }))

/** Sounding pitches, independently checked against the named score pages. No octave folding. */
export const bassRepertoire: readonly BassExcerpt[] = [
  {
    id: 'koussevitzky', composer: 'Serge Koussevitzky', title: 'Concerto, Op. 3', passage: 'I. Allegro · Alla breve theme', tempo: 120,
    source: 'https://urresearch.rochester.edu/fileDownloadForInstitutionalItem.action?itemFileId=69974&itemId=21596',
    sourceLabel: 'Forberg solo part · p. 2', edition: 'Robert Forberg, plate 6204. Sibley Music Library, University of Rochester. Public-domain score.',
    interpretation: 'The E-minor solo part is heard in F-sharp minor with solo tuning. Written pitches sound ten semitones lower. The F-sharp tied across bars 3–4 is sustained. Preview tempo: quarter note = 120.',
    notes: notes([[54,3],[null,1],[54,3],[54,1/3],[56,1/3],[57,1/3],[57,1.5],[56,.5],[54,3],[54,1],[56,1],[57,1]]),
  },
  {
    id: 'bottesini', composer: 'Giovanni Bottesini', title: 'Concerto No. 2', passage: 'I. Moderato · solo entrance, bars 5–8', tempo: 80,
    source: 'https://vmirror.imslp.org/files/imglnks/usimg/2/29/IMSLP582141-PMLP168859-bottesini_concerto2_pianoms_b.pdf',
    sourceLabel: 'B-minor manuscript · p. 2', edition: 'Bottesini’s B-minor piano manuscript, Biblioteca Palatina, Bott. 72/I–III. Public-domain score.',
    interpretation: 'This manuscript writes the solo in sounding pitch. Tied notes stay joined; the two unmeasured grace notes take time from the preceding F-sharp. Their timing and the quarter-note preview tempo of 80 are performance choices.',
    spellings: { 53: 'E♯3' },
    notes: notes([[54,7/3],[56,1/3],[58,1/3],[59,1/3],[61,1/3],[62,1/3],[61,.75],[59,.25],[54,1.5],[54,.375],[55,.0625],[54,.0625],[53,.5],[54,.5],[57,7/3],[55,1/3],[54,1/3],[52,1/3],[47,1/3],[49,1/3],[52,1/3],[50,1/3],[49,1/3],[50,2],[54,1]]),
  },
  {
    id: 'saint-saens', composer: 'Camille Saint-Saëns', title: 'The Elephant', passage: 'The Carnival of the Animals · bars 5–12', tempo: 96,
    source: 'https://www.mfiles.co.uk/scores/carnival-of-the-animals-the-elephant.pdf',
    sourceLabel: 'Published score · p. 1', edition: 'Original Saint-Saëns melody (1886; first published 1922). Notes checked against Music Files Ltd’s published score; its modern engraving is not reproduced here.',
    interpretation: 'The bass line sounds an octave below the written part. The 3/8 rhythm is retained; eighth notes last half a quarter beat. Preview tempo: quarter note = 96.',
    spellings: { 34: 'B♭1', 39: 'E♭2', 44: 'A♭2', 46: 'B♭2' },
    notes: notes([[34,.5],[39,.5],[39,.5],[39,.5],[41,.25],[39,.25],[38,.25],[39,.25],[34,.5],[41,.5],[41,.5],[41,1],[44,.5],[43,.25],[44,.25],[46,.5],[43,.5],[39,.25],[41,.25],[43,.5],[39,.5],[36,.25],[38,.25],[39,.5],[41,.5],[41,.5],[39,.25],[38,.25],[36,.25],[34,.25]]),
  },
]
export const DEFAULT_BASS_EXCERPT = 'koussevitzky'

/** This separate schedule admits solo register, tuplets, ties and grace-note timing. */
export function bassExcerptSchedule(excerpt: BassExcerpt) {
  if (!Number.isFinite(excerpt.tempo) || excerpt.tempo < 40 || excerpt.tempo > 180 || !excerpt.notes.length || excerpt.notes.length > 64) throw new RangeError('Invalid bass excerpt')
  let delay = 0
  return excerpt.notes.map((note, sourceIndex) => {
    if (note.midi !== null && (!Number.isInteger(note.midi) || note.midi < 28 || note.midi > 62) || !Number.isFinite(note.beats) || note.beats <= 0 || note.beats > 8) throw new RangeError('Invalid solo pitch or rhythm')
    const duration = note.beats * 60 / excerpt.tempo
    const event = { frequency: note.midi === null ? null : midiFrequency(note.midi), delay, duration, sourceIndex }
    delay += duration
    if (delay > 120) throw new RangeError('Bass excerpts must last at most two minutes')
    return event
  })
}
