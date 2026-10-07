import type { EnginePvMove, EngineThinkingProgress } from './chess-analysis.ts'

export type SearchPlotPoint = {
  sample: EngineThinkingProgress
  x: number
  y: number | null
  kind: 'exact' | 'bound' | 'mate' | 'depth'
  key: string
}

/** Each mark is a reported depth. Only adjacent exact cp scores form a line. */
export function searchPlot(samples: readonly EngineThinkingProgress[]) {
  const reported = samples.filter(sample => sample.depth > 0)
  const firstDepth = Math.min(...reported.map(sample => sample.depth))
  const lastDepth = Math.max(...reported.map(sample => sample.depth))
  const ceiling = Math.max(50, ...reported.filter(sample => sample.score?.kind === 'cp').map(sample => Math.abs(sample.score!.value)))
  const points: SearchPlotPoint[] = reported.map(sample => {
    const score = sample.score
    return {
      sample,
      x: firstDepth === lastDepth ? 240 : 16 + (sample.depth - firstDepth) / (lastDepth - firstDepth) * 448,
      y: score?.kind === 'cp' ? 30 - score.value / ceiling * 20 : null,
      kind: !score ? 'depth' : score.kind === 'mate' ? 'mate' : score.bound ? 'bound' : 'exact',
      key: `${sample.depth}:${score?.kind ?? ''}:${score?.value ?? ''}:${score?.bound ?? ''}`,
    }
  })
  const segments: string[] = []
  let segment = ''
  for (const point of points) {
    if (point.kind === 'exact') segment += `${segment ? 'L' : 'M'}${point.x},${point.y}`
    else if (segment) { segments.push(segment); segment = '' }
  }
  if (segment) segments.push(segment)
  return { points, segments, ceiling, firstDepth: reported.length ? firstDepth : null, lastDepth: reported.length ? lastDepth : null }
}

/** Prefix keys animate only the part of the observed principal line that changed. */
export function principalLineSteps(pv: readonly EnginePvMove[] | undefined, fen: string, limit = 8) {
  const fields = fen.split(/\s+/)
  const startsBlack = fields[1] === 'b'
  const firstNumber = Number(fields[5])
  let prefix = ''
  return (pv ?? []).slice(0, limit).map((move, index) => {
    const uci = `${move.from}${move.to}${move.promotion ?? ''}`
    prefix += `/${uci}`
    const number = firstNumber + Math.floor((index + Number(startsBlack)) / 2)
    return {
      ...move, key: prefix, uci,
      number: (index + Number(startsBlack)) % 2 === 0 ? `${number}.` : index === 0 ? `${number}…` : '',
    }
  })
}
