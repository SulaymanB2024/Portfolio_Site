import { allKnightChallenges, challengeRoute, challengeResult, type KnightChallenge } from './knight-puzzle'

type Props = { challenge: KnightChallenge; onChallenge(id: string): void; path: string[]; onMove(square: string): void; onReset(): void; onUndo(): void; onBoard(): void }

export default function PuzzleNotebook({ challenge, onChallenge, path, onMove, onReset, onUndo, onBoard }: Props) {
  const current = path[path.length - 1]
  const shortest = challengeRoute(path, challenge)
  const remaining = challenge.limit - path.length + 1
  const reachable = shortest.length > 0 && shortest.length - 1 <= remaining
  const done = challengeResult(path, challenge) === 'solved'
  const distance = (challenge.goal.charCodeAt(0) - 97) + Number(challenge.goal[1]) - 1
  return <div className="about-puzzle-notebook">
    <div className="about-challenge-choices" role="group" aria-label="Choose a knight challenge">{allKnightChallenges.map(item => <button key={item.id} onClick={() => onChallenge(item.id)} aria-pressed={item.id === challenge.id}><span>{item.label}</span><span className="mono">A1 → {item.goal.toUpperCase()} · {item.limit} jumps</span></button>)}</div>
    {challenge.blocked?.length && <p className="about-route-feedback">D4, E4, D5 and E5 are closed. Find a route around them.</p>}
    {challenge.checkpoints?.length && <div className="about-checkpoints mono" aria-label="Required stops">{challenge.checkpoints.map(square=><span key={square} data-collected={path.includes(square)}>{square.toUpperCase()} {path.includes(square)?'✓':'○'}</span>)}<span>Finish on {challenge.goal.toUpperCase()}.</span></div>}
    <div className="about-puzzle-notebook-grid">
      <div>
        <h3>Your route</h3><ol className="about-route-history mono">{path.map((square, index) => <li key={`${square}-${index}`}><span>{index}</span><strong>{square.toUpperCase()}</strong></li>)}</ol>
        <p className="about-route-feedback">{done ? 'You found a shortest route.' : reachable ? `${remaining} ${remaining === 1 ? 'jump' : 'jumps'} left. There’s still a route from here.` : `This square needs at least ${shortest.length - 1} more jumps. You have ${remaining} left.`}</p>
        <div className="about-play-actions mono"><button onClick={() => onMove(shortest[1])} disabled={done || !reachable || !shortest[1]}>Take a hint</button><button onClick={onUndo} disabled={path.length < 2}>Undo move</button><button onClick={onReset} disabled={path.length < 2}>New route</button></div><div className="about-play-actions mono"><button onClick={onBoard}>Play on the board <span aria-hidden="true">↑</span></button></div>
      </div>
      <details className="about-puzzle-reason"><summary>{challenge.checkpoints?.length?'Keep more than a square in mind':challenge.blocked?.length?'A different kind of route':`Why ${challenge.limit} jumps?`}<span aria-hidden="true">+</span></summary>{challenge.checkpoints?.length?<><p>Visit C4 and F6 in either order, then finish on H8. A square is only part of the state: you also need to remember which stops you’ve collected.</p><p>The hint searches those states again after every move. Reaching H8 without both stops doesn’t finish the puzzle.</p></>:challenge.blocked?.length?<><p>The shortest journey still takes six jumps. The four closed squares remove some routes, so a tempting move may leave too much ground to cover.</p><p>A hint explores legal routes around the closures from your current position. It is available only when the remaining move budget can reach the finish.</p></>:<><p>From A1 to {challenge.goal.toUpperCase()}, you need to cover {distance} squares across the two directions. A knight covers three in each jump. {challenge.limit>2?`Even ${challenge.limit-2} jumps only cover ${(challenge.limit-2)*3}.`:'One jump cannot cover all six.'}</p><p>A knight also changes square color every time it moves. The start and finish are the same color, so the number of jumps must be even. {challenge.limit} is the first possible total—and there’s a route that reaches it.</p></>}<a href="https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-index/" target="_blank" rel="noreferrer">The July puzzle I solved <span aria-hidden="true">↗</span></a></details>
    </div>
  </div>
}
