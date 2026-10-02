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

export function moveKnight(path: readonly string[], square: string): string[] {
  if (!path.length || path.length >= 7 || path[path.length - 1] === 'h8' || !knightMoves(path[path.length - 1]).includes(square)) return [...path]
  return [...path, square]
}

export function puzzleResult(path: readonly string[]): 'playing' | 'solved' | 'finished' {
  return path[path.length - 1] === 'h8' ? 'solved' : path.length >= 7 ? 'finished' : 'playing'
}
