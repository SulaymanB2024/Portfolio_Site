export interface PerformanceLink {
  label: string;
  href: string;
  kind: 'recording' | 'program';
}

export interface Performance {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  role: 'performer' | 'composer';
  ensemble: string;
  repertoire: string[];
  links: PerformanceLink[];
  sourceNotes: string;
}

/** Appearances supported by an explicit program credit or a credited recording. */
export const performances: Performance[] = [
  {
    id: 'ut-university-orchestra-2025-02-25',
    title: 'University Orchestra',
    date: '2025-02-25',
    displayDate: 'February 25, 2025',
    role: 'performer',
    ensemble: 'The University of Texas at Austin · double bass',
    repertoire: [
      'Ludwig van Beethoven — Symphony No. 1 in C Major, Op. 21',
      'Florence Price — Symphony No. 3 in C Minor',
    ],
    links: [
      { label: 'Concert program', href: 'https://music.utexas.edu/events/4645-university-orchestra', kind: 'program' },
    ],
    sourceNotes: 'The official concert program names Sulayman Bowles in the double bass section.',
  },
  {
    id: 'ut-symphony-orchestra-2024-10-26',
    title: 'Symphony Orchestra',
    date: '2024-10-26',
    displayDate: 'October 26, 2024',
    role: 'performer',
    ensemble: 'The University of Texas at Austin · double bass',
    repertoire: [
      'Giuseppe Verdi — Overture to La forza del destino',
      'Richard Strauss — Romanze in E-flat Major, TrV 80',
      'Eldar Hudiyev, arr. Farkhad Khudyev — Circus for Clarinet and Orchestra',
      'Ludwig van Beethoven — Symphony No. 5 in C Minor, Op. 67',
    ],
    links: [
      { label: 'Concert program', href: 'https://music.utexas.edu/events/4610-symphony-orchestra', kind: 'program' },
    ],
    sourceNotes: 'The official concert program names Sulayman Bowles in the double bass section. Its former Vimeo stream is unavailable.',
  },
  {
    id: 'ut-symphony-orchestra-2024-09-29',
    title: 'Symphony Orchestra',
    date: '2024-09-29',
    displayDate: 'September 29, 2024',
    role: 'performer',
    ensemble: 'The University of Texas at Austin · double bass',
    repertoire: [
      'Donald Grantham — Baron Cimetiere’s Mambo',
      'Gara Garayev — Seven Beauties Ballet Suite',
      'Igor Stravinsky — The Firebird Suite (1919)',
    ],
    links: [
      { label: 'Concert program', href: 'https://music.utexas.edu/events/4596-symphony-orchestra', kind: 'program' },
    ],
    sourceNotes: 'The official concert program names Sulayman Bowles in the double bass section. Its former Vimeo stream is unavailable.',
  },
  {
    id: 'golden-hornet-young-composers-2024',
    title: 'The Beauty of Loss',
    date: '2024-04-07',
    displayDate: 'April 7, 2024',
    role: 'composer',
    ensemble: 'Golden Hornet Young Composers · professional chamber ensemble',
    repertoire: ['Sulayman Bowles — The Beauty of Loss'],
    links: [
      { label: 'Full concert recording', href: 'https://www.youtube.com/watch?v=vQhobHt5g0k', kind: 'recording' },
      { label: 'Concert program', href: 'https://drive.google.com/file/d/11SN3b9sfKPxgA7xHGOV-ob0U7xVu9sRg/view', kind: 'program' },
    ],
    sourceNotes: 'The official recording links this publicly accessible program, which credits The Beauty of Loss to Sulayman Bowles. The program date is April 7, 2024.',
  },
  {
    id: 'golden-hornet-young-composers-2022',
    title: 'Melancholy',
    date: '2022-03-27',
    displayDate: 'March 27, 2022',
    role: 'composer',
    ensemble: 'Golden Hornet Young Composers · professional chamber ensemble',
    repertoire: ['Sulayman Bowles — Melancholy'],
    links: [
      { label: 'Full concert recording', href: 'https://www.youtube.com/watch?v=t3VP-lRlaZ4', kind: 'recording' },
      { label: 'Concert details', href: 'https://www.goldenhornet.org/calendar/young-composers-concert-2022', kind: 'program' },
    ],
    sourceNotes: 'The official event explicitly credits Sulayman Bowles as a composer. The title is corroborated by his concert-order and score archive; the recording is Golden Hornet’s full 2022 concert.',
  },
  {
    id: 'golden-hornet-young-composers-2021',
    title: 'Call of the Cavies',
    date: '2021-04-18',
    displayDate: 'April 18, 2021',
    role: 'composer',
    ensemble: 'Golden Hornet Young Composers Collaboration',
    repertoire: ['Sulayman Bowles — Call of the Cavies'],
    links: [
      { label: 'Piece recording', href: 'https://www.youtube.com/watch?v=GoZOo34NCQI', kind: 'recording' },
      { label: 'Full concert recording', href: 'https://www.youtube.com/watch?v=dpunl4dcLno', kind: 'recording' },
      { label: 'Concert program', href: 'https://drive.google.com/file/d/1yT4vg-dzHpGPDTCW5dIdquRG4WO18LFo/view', kind: 'program' },
    ],
    sourceNotes: 'Golden Hornet’s individual recording credits the work to Sulayman Bowles. The event date is the virtual concert date; the individual recording was published in July 2021.',
  },
  {
    id: 'golden-hornet-young-composers-2020',
    title: 'Unfolding of Night',
    date: '2020-08-23',
    displayDate: 'August 23, 2020',
    role: 'composer',
    ensemble: 'Tetractys · Golden Hornet Young Composers',
    repertoire: ['Sulayman Bowles — Unfolding of Night'],
    links: [
      { label: 'Piece recording', href: 'https://www.youtube.com/watch?v=qc6q_XkS0aE', kind: 'recording' },
      { label: 'Full concert recording', href: 'https://www.youtube.com/watch?v=hoetkUVJrck', kind: 'recording' },
      { label: 'Concert details', href: 'https://www.goldenhornet.org/calendar/young-composers-concert-2020', kind: 'program' },
    ],
    sourceNotes: 'Golden Hornet’s individual recording credits Sulayman Bowles as composer and Tetractys as performers. The event date is the virtual concert date; the individual recording was published in October 2020.',
  },
];

export const performanceArchiveNote = 'An archive of performances confirmed in available programs and recordings.';
