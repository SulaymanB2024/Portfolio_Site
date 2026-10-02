export type InterestId = 'bass' | 'score' | 'knight'

export const personalObjects: { id: InterestId; label: string; title: string; sentence: string; detailLabel: string; detail: string; source: string; sourceLabel: string }[] = [
  {
    id: 'bass', label: 'Double bass', title: 'The low end.',
    sentence: 'I play double bass. Four strings, a bow, and a lot of listening.',
    detailLabel: 'On the stand',
    detail: 'With UT’s University Orchestra: Beethoven’s First Symphony and Florence Price’s Third, on the February 2025 program.',
    source: 'https://music.utexas.edu/events/4645-university-orchestra', sourceLabel: 'Concert program',
  },
  {
    id: 'score', label: 'Composition', title: 'A few notes.',
    sentence: 'I compose, too. Here, you can leave a little phrase of your own.',
    detailLabel: 'Beyond this page',
    detail: 'My original music was performed through Golden Hornet’s Young Composer Program in 2020 and 2022.',
    source: 'https://www.goldenhornet.org/calendar/young-composers-concert-2022', sourceLabel: 'Young Composers concert',
  },
  {
    id: 'knight', label: 'Logic puzzles', title: 'One more move.',
    sentence: 'I enjoy logic puzzles. Try a small one: A1 to H8 in six knight moves.',
    detailLabel: 'A recent puzzle',
    detail: 'I solved Jane Street’s July 2026 puzzle, “Pent-up Frustration 3: Knight Moves 7.” This little board is a separate, original challenge.',
    source: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-solution/', sourceLabel: 'The July puzzle',
  },
]

export const bassStrings = [
  { label: 'E', frequency: 41.203 }, { label: 'A', frequency: 55 },
  { label: 'D', frequency: 73.416 }, { label: 'G', frequency: 97.999 },
] as const
