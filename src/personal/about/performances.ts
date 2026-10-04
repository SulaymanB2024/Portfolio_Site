export interface PerformanceLink {
  label: string;
  href: string;
  kind: 'recording' | 'program';
}

export interface Performance {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  displayDate: string;
  role: 'performer' | 'composer';
  series: 'ut-austin' | 'all-state';
  ensemble: string;
  repertoire: string[];
  links: PerformanceLink[];
  sourceNotes: string;
}

/** Appearances supported by a named program credit or an official ensemble roster. */
export const performances: Performance[] = [
  {
    id: 'ut-university-orchestra-2025-02-25',
    title: 'University Orchestra',
    date: '2025-02-25',
    displayDate: 'February 25, 2025',
    role: 'performer',
    series: 'ut-austin',
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
    id: 'ut-butler-holiday-concert-2024-12',
    title: 'Butler Holiday Concert',
    date: '2024-12-07',
    endDate: '2024-12-08',
    displayDate: 'December 7–8, 2024',
    role: 'performer',
    series: 'ut-austin',
    ensemble: 'UT Austin · Wind Ensemble & Combined Choirs',
    repertoire: [
      'Lara Hoggard — Personent Hodie',
      'LeRoy Anderson — Christmas Festival',
      'LeRoy Anderson — Sleigh Ride',
      'Randol Alan Bass — Gloria',
      'Robert Shaw, arr. Robert Russell Bennett — The Many Moods of Christmas',
    ],
    links: [
      { label: 'Concert program', href: 'https://music.utexas.edu/events/4631-butler-holiday-concert', kind: 'program' },
    ],
    sourceNotes: 'The saved UT concert-program draft explicitly lists Bowles, Sulayman under Wind Ensemble double bass. The official event corroborates the December 7–8 dates and this ensemble’s program. Its former Vimeo stream is unavailable. The two performances share one archive entry.',
  },
  {
    id: 'ut-symphony-orchestra-2024-10-26',
    title: 'Symphony Orchestra',
    date: '2024-10-26',
    displayDate: 'October 26, 2024',
    role: 'performer',
    series: 'ut-austin',
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
    series: 'ut-austin',
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
    id: 'tmea-all-state-symphony-orchestra-2024',
    title: 'Texas All-State Symphony Orchestra',
    date: '2024-02-10',
    displayDate: 'February 10, 2024',
    role: 'performer',
    series: 'all-state',
    ensemble: 'TMEA · John Devlin, conductor · San Antonio',
    repertoire: [
      'Michael Daugherty — Red Cape Tango',
      'Clarice Assad — Bonecos de Olinda',
      'Richard Strauss — Till Eulenspiegels lustige Streiche',
      'Arturo Márquez — Conga del Fuego Nuevo',
    ],
    links: [
      { label: 'Concert repertoire', href: 'https://www.tmea.org/all-state/performances/?organization=2024+Symphony+Orchestra&submit=Search', kind: 'program' },
      { label: 'Recording · purchase', href: 'https://markcustom.com/markcustom_new/Menu2_ViewAlbum.asp?CDNum=57410-MCD', kind: 'recording' },
      { label: 'TMEA roster', href: 'https://www.tmea.org/all-state/historical-rosters/?organization=2024+Symphony+Orchestra&instrument=String+Bass&school_op=eq&school=McCallum+HS&city_op=eq&city=Austin&submit=Search', kind: 'program' },
    ],
    sourceNotes: 'TMEA’s official historical roster credits Sulayman Bowles, McCallum HS, on string bass in the 2024 Symphony Orchestra. Its performance archive supplies the conductor and repertoire; Mark Custom is the official recording provider. The February 10 concert date is corroborated by contemporary school-district All-State announcements. No audition ranking is presented as a performance chair.',
  },
  {
    id: 'tmea-all-state-5a-symphonic-band-2023',
    title: 'Texas All-State 5A Symphonic Band',
    date: '2023-02-11',
    displayDate: 'February 11, 2023',
    role: 'performer',
    series: 'all-state',
    ensemble: 'TMEA · Dennis Llinás, conductor · San Antonio',
    repertoire: [
      'Kimberly Archer — Humoresque',
      'Dennis Llinás — Un Cafecito',
      'Richard Strauss, arr. Jimmie Howard Reynolds — Trio from Act III of Der Rosenkavalier',
      'Gustav Holst, trans. Merlin Patterson — The Planets: Mars; Jupiter',
    ],
    links: [
      { label: 'Concert repertoire', href: 'https://www.tmea.org/all-state/performances/?organization=2023+5A+Symphonic+Band&submit=Search', kind: 'program' },
      { label: 'Recording · purchase', href: 'https://markcustom.com/markcustom_new/Menu2_ViewAlbum.asp?CDNum=56801-MCD', kind: 'recording' },
      { label: 'TMEA roster', href: 'https://www.tmea.org/all-state/historical-rosters/?organization=2023+5A+Symphonic+Band&instrument=String+Bass&school_op=eq&school=McCallum+HS&city_op=eq&city=Austin&submit=Search', kind: 'program' },
    ],
    sourceNotes: 'TMEA’s official historical roster credits Sulayman Bowles, McCallum HS, on string bass in the 2023 5A Symphonic Band. Its performance archive supplies the conductor, works and arrangers; the official recording is catalog 56801-MCD. The February 11 concert date is corroborated by contemporary school-district All-State announcements.',
  },
];

export const performanceArchiveNote = 'Double bass · UT Austin & Texas All-State';
