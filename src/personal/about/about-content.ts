export type InterestId = 'bass' | 'score' | 'knight'

export const personalObjects: { id: InterestId; label: string; title: string; sentence: string; detailLabel: string; detail: string; source: string; sourceLabel: string }[] = [
  {
    id: 'bass', label: 'Double bass', title: 'The low end.',
    sentence: 'Play the strings, or explore my performances below.',
    detailLabel: 'On the stand',
    detail: 'UT’s University Orchestra, February 2025: Beethoven’s First Symphony and Florence Price’s Third.',
    source: 'https://music.utexas.edu/events/4645-university-orchestra', sourceLabel: 'Concert program',
  },
  {
    id: 'score', label: 'Composition', title: 'A few notes.',
    sentence: 'Write a phrase. Play it. Explore the performances below.',
    detailLabel: 'On stage',
    detail: 'All-State and UT Austin performances, with repertoire and concert programs.',
    source: 'https://music.utexas.edu/events/4645-university-orchestra', sourceLabel: 'UT Austin concert program',
  },
  {
    id: 'knight', label: 'Chess & puzzles', title: 'One more move.',
    sentence: 'Play chess, or reach H8 from A1 in six knight moves.',
    detailLabel: 'A recent puzzle',
    detail: 'I solved Jane Street’s July 2026 “Pent-up Frustration 3: Knight Moves 7.” This board is a separate, original challenge.',
    source: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-solution/', sourceLabel: 'The July puzzle',
  },
]

export const bassStrings = [
  { label: 'E', midi: 28, frequency: 41.203, key: 'A' }, { label: 'A', midi: 33, frequency: 55, key: 'S' },
  { label: 'D', midi: 38, frequency: 73.416, key: 'D' }, { label: 'G', midi: 43, frequency: 97.999, key: 'F' },
] as const
