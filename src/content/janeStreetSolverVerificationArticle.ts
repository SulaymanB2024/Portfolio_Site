import type { ResearchArticle } from './articleModels';

export const JANE_STREET_SOLVER_VERIFICATION_ARTICLE_SLUG =
  'jane-street-exact-search-solver-verification';
export const JANE_STREET_SOLVER_VERIFICATION_ARTICLE_PATH =
  `/research/data-systems/${JANE_STREET_SOLVER_VERIFICATION_ARTICLE_SLUG}`;

export const JANE_STREET_SOLVER_VERIFICATION_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'data-systems',
  slug: JANE_STREET_SOLVER_VERIFICATION_ARTICLE_SLUG,
  aliases: [],
  number: '22',
  category: 'ALGORITHMS / VERIFICATION',
  title: 'How I Verified a 54-Move Exact Search Solver',
  seoTitle: 'Jane Street Puzzle Solver Verification: Exact Search Case Study',
  subtitle:
    'A technical case study of reconstructing Jane Street’s July 2026 three-dimensional knight path by separating score-schedule inference, geometric search, and post-search verification.',
  seoDescription:
    'Technical case study of a 54-move exact-search solver for Jane Street’s July 2026 puzzle: score-state pruning, constrained path stitching, and verifier design.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Exact search / verification',
    note: 'Score arithmetic, path search, and verification are treated as separate jobs.',
  },
  date: '2026.09.15',
  lastVerified: '2026.09.15',
  readTime: '14 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'A search program finding one valid-looking path is not enough. I reduced the puzzle in stages: infer the score schedule before searching geometry, stitch exact path segments between forced clue states, then recompute the proposed route through a separate verifier that does not trust the search result.',
  conclusion: {
    title: 'Treat the solution as a certificate, not a print statement',
    content:
      'The useful artifact is the chain of evidence: the puzzle specification, a constrained search, an explicit 54-move path, recomputed scores and clue checks, the tower-completion condition, and the final neighbor-sum calculation. Jane Street’s published solution confirms the answer 33,609. The retained verifier checks my proposed route; it does not turn my implementation into an independently audited proof system.',
  },
  evidenceBoundary:
    'This article describes my retained July 2026 solver and verifier using private implementation records plus Jane Street’s public puzzle, archive, and solution pages. I am not publishing the private source repository or claiming that Jane Street reviewed my code. Jane Street’s official solution confirms the puzzle answer 33,609. The implementation details reported here were checked against the retained solver on September 15, 2026; this publication run did not freshly execute that private solver.',
  metrics: [
    { label: 'Board', value: '64 squares / 13 regions' },
    { label: 'Recovered schedule', value: 'K = 7' },
    { label: 'Path', value: '54 moves' },
    { label: 'Published answer', value: '33,609' },
  ],
  resources: [
    {
      label: 'Portfolio case study',
      href: '/work/jane-street-puzzle',
      description:
        'The shorter project view: problem framing, design decisions, retained result, and source boundaries.',
      format: 'CASE',
    },
    {
      label: 'Jane Street July 2026 puzzle',
      href: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-index/',
      description:
        'The original puzzle statement, including the 13 regions, towers, three-dimensional knight moves, scoring rules, and changing clue schedule.',
      format: 'WEB',
    },
    {
      label: 'Jane Street official solution',
      href: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-solution/',
      description:
        'Jane Street’s published July 2026 solution, including the solved path graphic and final answer of 33,609.',
      format: 'WEB',
    },
    {
      label: 'Technical competition dossier',
      href: 'https://sulayman-bowles.tech/competitions/jane-street-puzzle-leaderboard',
      description:
        'A compact public record of the solver, reconstruction approach, and verifier boundary.',
      format: 'WEB',
    },
  ],
  content: [
    'Jane Street’s July 2026 puzzle looks like a pathfinding problem, but a path is only one part of the state. The knight moves on an 8-by-8 board divided into 13 regions. One square in each region becomes a tower, which changes altitude and therefore changes the scoring operation. A same-altitude move adds the move number, an upward move multiplies by it, and a downward move divides only when the current score is exactly divisible. The published clue scores are observed every three moves through move 18 and then every K moves for an unknown K greater than three.',
    'That coupling makes a brute-force “try knight paths until something fits” approach wasteful. Score arithmetic can reject most schedule interpretations before the geometry search begins. Geometry can then be searched between forced clue states rather than across the full board in one undifferentiated traversal. The retained implementation follows that separation: schedule inference first, exact segment search second, global stitching third.',
    'The final step is deliberately outside the search loop. A separate verifier starts from the proposed coordinates, tower placements, K, and schedule mode, then recomputes legal moves, score transitions, scheduled clues, tower completion, and the unvisited-square neighbor sums. It produces a machine-readable path table and clue audit. That is a stronger record than a solver printing 33,609 and exiting.',
  ],
  sections: [
    {
      id: 'state-problem',
      title: 'The puzzle is a coupled state problem, not ordinary pathfinding',
      paragraphs: [
        'Each board square has a two-dimensional coordinate, but the tower decision gives it an altitude of either zero or one. A legal move therefore has absolute coordinate differences {0, 1, 2} across x, y, and z. The same planar jump can be legal or illegal depending on whether one endpoint is a tower.',
        'The score creates a second dependency. At move n, staying at the same altitude adds n, moving up multiplies by n, and moving down requires exact divisibility by n before dividing. Because clue scores occur only on scheduled moves, the route must satisfy geometry, score arithmetic, clue timing, and tower placement at the same time.',
        'The stopping condition matters too. The knight stops when it has visited all 13 towers. A route that reaches every tower and then continues is invalid even if every earlier move is legal. I treated that as a verifier condition rather than an informal assumption.',
      ],
      table: {
        caption: 'State carried by the reconstruction',
        columns: ['State component', 'Why it matters', 'Typical invalidation'],
        rows: [
          ['Board position', 'Determines planar knight reachability', 'Destination cannot be reached in the remaining moves'],
          ['Altitude', 'Changes both move legality and score operation', 'Proposed move has the wrong 3D delta'],
          ['Score', 'Must land exactly on the published clue values', 'Division is not exact or a clue score is missed'],
          ['Visited squares', 'The knight cannot revisit a space', 'Segment reuses an earlier square'],
          ['Tower by region', 'Exactly one tower belongs to each region', 'Two altitude-1 squares are assigned to one region'],
          ['Schedule', 'Determines which moves must hit clue squares', 'A clue is reached on an unscheduled move'],
        ],
      },
    },
    {
      id: 'arithmetic-before-geometry',
      title: 'I solved the score schedule before asking geometry to do expensive work',
      paragraphs: [
        'After move 18, the puzzle says scores are recorded every K moves for some larger K, but the wording admits two natural timing interpretations. The retained search evaluates both. For each mode it tries K values from 4 upward while the required clue schedule still fits inside the board-length bound.',
        'The first reduction ignores board geometry entirely. A dynamic program tracks score, altitude, which nonzero clue scores have already been consumed, and the order in which those scores could appear on scheduled moves. Every transition applies the exact add, multiply, or divisible-only divide rule. If a scheduled move does not produce one of the remaining clue values, that state dies immediately.',
        'This changes the shape of the problem. By the time the search looks for coordinates, it is no longer guessing both the score sequence and the spatial route. It is trying to realize a much smaller set of arithmetic-consistent clue orders as legal three-dimensional knight paths.',
      ],
      table: {
        caption: 'Why the search is staged',
        columns: ['Stage', 'Input', 'What it rejects before the next stage'],
        rows: [
          ['Schedule enumeration', 'Two post-18 timing interpretations and candidate K values', 'Schedules that cannot place the required recordings within the move bound'],
          ['Score-state search', 'Move number, score, altitude, remaining clue scores', 'Arithmetic sequences that cannot reproduce the published clues'],
          ['Geometric segment search', 'Forced clue endpoints and exact move counts', 'Knight paths that violate reachability, score, no-repeat, or tower consistency'],
          ['Global stitching', 'Candidate segments', 'Locally valid segments that conflict when combined into one route'],
        ],
      },
    },
    {
      id: 'segment-search',
      title: 'Forced clues turn one large search into exact segments',
      paragraphs: [
        'Once a clue order and schedule are fixed, consecutive clue states provide a start square, end square, start score, end score, and exact number of moves between them. The retained solver searches those intervals as segments instead of exploring every 54-move route from the start.',
        'Before recursion, it precomputes the board’s knight-neighbor graph and shortest-path distances. During a segment search, a branch is dropped if the target clue is farther away than the number of moves remaining. It also rejects repeated squares, early visits to other nonzero clue squares, impossible score transitions, and conflicting tower assignments inside a region.',
        'The segment still has to fit the rest of the route. Stitching carries forward global square status, tower commitments, and which regions already have towers. A segment that is internally valid can therefore be rejected when it contradicts an earlier segment. That separation kept local search aggressive without letting local choices overwrite global constraints.',
      ],
    },
    {
      id: 'verifier',
      title: 'The verifier starts from the proposed path and recomputes the rules',
      paragraphs: [
        'The verifier does not accept a “found” flag from the search. It receives the board regions, clue dictionary, recovered K and schedule mode, tower placements, and the path coordinates. It reconstructs the move sequence from those values and raises an error on the first broken rule.',
        'It checks the 8-by-8 region map, the twelve five-square regions plus the one four-square region, one valid tower location per region, the required starting square, uniqueness of every visited square, and every three-dimensional knight delta. It then recomputes the full score path, including exact divisibility on downward moves.',
        'Next it checks that each scheduled recording lands on the correct clue square with the correct score, that no nonzero clue is reached off schedule, and that all towers are first completed on the final move rather than earlier. Only after those checks does it calculate the answer by summing the scores of orthogonally adjacent visited squares around each unvisited square.',
        'I call this a separate verifier rather than a formally independent implementation. The search reuses some coordinate and score-transition helpers from the verifier module. A stronger proof package would duplicate the specification in a second implementation or generate a compact certificate that another program could check without sharing those helpers.',
      ],
      table: {
        caption: 'What the retained verifier recomputes',
        columns: ['Check', 'Failure caught'],
        rows: [
          ['Board / regions', 'Malformed 8×8 map, wrong region count, or wrong region sizes'],
          ['Tower placement', 'Missing region, tower outside its region, or duplicate tower square'],
          ['Path uniqueness', 'A square is visited more than once'],
          ['3D move legality', 'Coordinate deltas are not a permutation of 0, 1, and 2'],
          ['Score transition', 'Wrong add/multiply operation or non-integral downward division'],
          ['Clue schedule', 'Wrong clue score, skipped scheduled clue, or clue reached off schedule'],
          ['Stopping rule', 'All towers are reached before the path actually stops'],
          ['Final answer', 'Neighbor sums do not recompute to the recorded result'],
        ],
      },
      codeExamples: [
        {
          title: 'Retained solution summary',
          description:
            'The small result surface I want a reviewer to be able to recompute from the path, not merely trust as program output.',
          language: 'json',
          code: '{\n  "K": 7,\n  "schedule_mode": "natural_after_18",\n  "path_length": 54,\n  "answer": 33609\n}',
        },
      ],
    },
    {
      id: 'result',
      title: 'The recovered schedule is K = 7, but the final score is not the final answer',
      paragraphs: [
        'The retained reconstruction uses the natural “after move 18” interpretation with K = 7. The recorded clue moves are 0, 3, 6, 9, 12, 15, 18, 25, 32, 39, 46, and 53. The route then makes move 54 onto the last tower. That distinction is useful: the last path score is part of the verified route, while the puzzle answer comes from a separate neighbor-sum calculation over the squares the knight never visited.',
        'The retained path has 54 moves and produces 33,609 after the neighbor sums are recomputed. Jane Street’s official July 2026 solution independently publishes the same final answer. That corroborates the numerical result; it does not establish that Jane Street inspected this implementation, this search strategy, or this verifier.',
        'For a technical review, the interesting part is therefore not the number 33,609. It is how much of the path can be rejected before brute force, how the solver keeps tower and score state coherent across segments, and whether the final artifact can be checked without trusting the search procedure that produced it.',
      ],
      table: {
        caption: 'Recovered recording schedule',
        columns: ['Move', 'Recorded score'],
        rows: [
          ['0', '0'],
          ['3', '1'],
          ['6', '16'],
          ['9', '23'],
          ['12', '528'],
          ['15', '37'],
          ['18', '88'],
          ['25', '138'],
          ['32', '272'],
          ['39', '449'],
          ['46', '750'],
          ['53', '1,100'],
        ],
      },
    },
    {
      id: 'production-proof',
      title: 'What I would add before calling the solver a stronger proof system',
      paragraphs: [
        'The retained package is enough to reconstruct and check one solution, but there are obvious ways to make the evidence stronger. First, I would write a second verifier from the puzzle statement without sharing score or coordinate helpers with the search. That would reduce the chance that one interpretation bug is copied into both sides of the check.',
        'Second, I would add property tests around move legality, score transitions, schedule generation, and answer recomputation. Third, I would emit a compact solution certificate with the path, tower placements, K, schedule mode, and a content hash so another implementation could validate the same artifact deterministically.',
        'Those additions would not make the search itself more clever. They would make the result easier to audit. For work like this, that is often the better next engineering step: once a solver finds an answer, spend the next unit of effort reducing the amount of trust required to believe it.',
      ],
    },
  ],
  sources: [
    {
      label: 'Jane Street — July 2026 puzzle: ‘Pent-Up’ Frustration 3 / Knight Moves 7',
      href: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-index/',
      lastVerified: '2026-09-15',
    },
    {
      label: 'Jane Street — July 2026 official solution',
      href: 'https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-solution/',
      lastVerified: '2026-09-15',
    },
    {
      label: 'Jane Street — puzzle archive',
      href: 'https://www.janestreet.com/puzzles/archive/',
      lastVerified: '2026-09-15',
    },
  ],
};
