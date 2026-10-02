export function squareCoordinates(square: string): [number, number] {
  if (!/^[a-h][1-8]$/.test(square)) throw new Error('Invalid chess square')
  return [square.charCodeAt(0) - 97, Number(square[1]) - 1]
}

export function knightMoves(square: string): string[] {
  const [x, y] = squareCoordinates(square)
  return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([nx, ny]) => nx >= 0 && nx < 8 && ny >= 0 && ny < 8)
    .map(([nx, ny]) => `${String.fromCharCode(97 + nx)}${ny + 1}`).sort()
}

export const knightChallenges = [
  { id: 'short', label: 'Two jumps', start: 'a1', goal: 'd4', limit: 2 },
  { id: 'middle', label: 'Four jumps', start: 'a1', goal: 'f6', limit: 4 },
  { id: 'long', label: 'Six jumps', start: 'a1', goal: 'h8', limit: 6 },
] as const

export function moveKnight(path: readonly string[], square: string, goal = 'h8', limit = 6): string[] {
  if (!path.length || path.length > limit || path[path.length - 1] === goal || !knightMoves(path[path.length - 1]).includes(square)) return [...path]
  return [...path, square]
}

export function puzzleResult(path: readonly string[], goal = 'h8', limit = 6): 'playing' | 'solved' | 'finished' {
  return path[path.length - 1] === goal ? 'solved' : path.length > limit ? 'finished' : 'playing'
}

/** Breadth-first search gives a shortest route, rather than a scripted answer. */
export function shortestKnightRoute(start: string, goal: string): string[] {
  squareCoordinates(start); squareCoordinates(goal)
  const queue: string[][] = [[start]]
  const visited = new Set([start])
  for (let index = 0; index < queue.length; index++) {
    const path = queue[index]
    const current = path[path.length - 1]
    if (current === goal) return path
    for (const square of knightMoves(current)) {
      if (!visited.has(square)) { visited.add(square); queue.push([...path, square]) }
    }
  }
  return []
}

export type KnightChallenge = { id: string; label: string; start: string; goal: string; limit: number; blocked?: readonly string[]; checkpoints?: readonly string[] }
export const allKnightChallenges: readonly KnightChallenge[] = [
  ...knightChallenges,
  {id:'detour',label:'Closed center',start:'a1',goal:'h8',limit:6,blocked:['d4','e4','d5','e5']},
  {id:'checkpoints',label:'Two stops',start:'a1',goal:'h8',limit:10,checkpoints:['c4','f6']},
]
export function challengeResult(path:readonly string[],challenge:KnightChallenge):'playing'|'solved'|'finished'{
  if(path.at(-1)===challenge.goal&&(challenge.checkpoints??[]).every(square=>path.includes(square)))return 'solved'
  return path.length>challenge.limit?'finished':'playing'
}
export function challengeMoves(path:readonly string[],challenge:KnightChallenge){
  return challengeResult(path,challenge)==='playing'?knightMoves(path[path.length-1]).filter(square=>!challenge.blocked?.includes(square)):[]
}
export function advanceChallenge(path:readonly string[],square:string,challenge:KnightChallenge){
  return challengeMoves(path,challenge).includes(square)?[...path,square]:[...path]
}
/** Search square + collected checkpoints, so hints respect the complete mission. */
export function challengeRoute(path:readonly string[],challenge:KnightChallenge){
  const targets=challenge.checkpoints??[],full=(1<<targets.length)-1
  let initial=0;targets.forEach((square,index)=>{if(path.includes(square))initial|=1<<index})
  const queue=[{route:[path[path.length-1]],mask:initial}],visited=new Set([`${path.at(-1)}:${initial}`])
  for(let index=0;index<queue.length;index++){
    const item=queue[index],square=item.route.at(-1)!
    if(square===challenge.goal&&item.mask===full)return item.route
    for(const next of knightMoves(square)){
      if(challenge.blocked?.includes(next))continue
      const target=targets.indexOf(next),mask=target<0?item.mask:item.mask|(1<<target),key=`${next}:${mask}`
      if(!visited.has(key)){visited.add(key);queue.push({route:[...item.route,next],mask})}
    }
  }
  return []
}
