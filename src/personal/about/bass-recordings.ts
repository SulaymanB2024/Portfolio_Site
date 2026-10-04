export type BassRecording = {
  id: string; composer: string; title: string; movement: string; file: string
  performer: string; credit: string; source: string; sourceLabel: string
  license: string; licenseUrl: string; licenseEvidence: string
}

/** Whole, unmodified concert recordings. Attribution applies to the audio files. */
export const bassRecordings: readonly BassRecording[] = [
  {
    id: 'koussevitzky', composer: 'Serge Koussevitzky', title: 'Concerto, Op. 3', movement: 'I. Allegro', file: 'koussevitzky-allegro.mp3',
    performer: 'Miguel Leiria Pereira', credit: 'Miguel Leiria Pereira, double bass · Butler University Symphony Orchestra · Stanley DeRusha, conductor. Recorded in 1999.',
    source: 'https://archive.org/details/Koussevitzky_Concerto_Op.3_I.Allegro', sourceLabel: 'Original recording · Internet Archive',
    license: 'CC BY-NC-ND 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    licenseEvidence: 'https://imslp.org/wiki/Double_Bass_Concerto,_Op.3_(Koussevitzky,_Serge)',
  },
  {
    id: 'bottesini', composer: 'Giovanni Bottesini', title: 'Concerto No. 2', movement: 'I. Allegro', file: 'bottesini-allegro.mp3',
    performer: 'Edgar Meyer', credit: 'Edgar Meyer, double bass · University of Chicago Symphony Orchestra · Barbara Schubert, conductor. Mandel Hall, April 25, 2009. Recorded by Eric Pancer.',
    source: 'https://archive.org/details/uso20090425', sourceLabel: 'Concert recording · Internet Archive',
    license: 'CC BY-NC-ND 3.0 US', licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/3.0/us/',
    licenseEvidence: 'https://archive.org/metadata/uso20090425',
  },
  {
    id: 'saint-saens', composer: 'Camille Saint-Saëns', title: 'The Elephant', movement: 'The Carnival of the Animals · V', file: 'saint-saens-elephant.mp3',
    performer: 'Seattle Youth Symphony', credit: 'Seattle Youth Symphony · Vilem Sokol, conductor · Neal O’Doan and Nancy O’Doan, pianos. The Pandora / Goldstein Archive, provided by Classicals.de.',
    source: 'https://www.classicals.de/saint-saens-carnival', sourceLabel: 'Recording & credits · Classicals.de',
    license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licenseEvidence: 'https://www.classicals.de/saint-saens-carnival',
  },
]
export const DEFAULT_BASS_RECORDING = 'koussevitzky'
export const recordingTime = (seconds: number) => {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}
