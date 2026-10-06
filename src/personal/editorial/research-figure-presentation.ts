const inkCharts = new Set([
  'the-ai-megawatt-power-ladder.svg',
  'the-ai-megawatt-utilization.svg',
  'the-ai-megawatt-sensitivity.svg',
])

export function researchFigurePresentation(src: string, baseUrl = '/') {
  const name = src.slice('/images/research/'.length)
  const derivative = src.startsWith('/images/research/') && inkCharts.has(name)
    ? `/images/research/reader/${name}` : src
  const asset = (path: string) => `${baseUrl}${path.replace(/^\//, '')}`
  return { original: asset(src), display: asset(derivative) }
}
