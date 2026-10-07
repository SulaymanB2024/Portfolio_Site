/** SVG equivalent of portfolioBayer8 in the site's original dither-kernel.ts. */
const bayer2 = (x: number, y: number) => x * 2 + y * 3 - x * y * 4
const thresholds = Array.from({ length: 64 }, (_, i) => {
  const x = i % 8, y = Math.floor(i / 8)
  return (16 * bayer2(x % 2,y % 2) + 4 * bayer2(Math.floor(x / 2) % 2,Math.floor(y / 2) % 2) + bayer2(Math.floor(x / 4),Math.floor(y / 4)) + .5) / 64
})

/** Static ordered grain: no random reshuffling, added canvas, or animation clock. */
export default function ChessPrintScreen({ id, coverage = .5, unit = 1.5, background, ink = 'var(--ink)' }: { id: string; coverage?: number; unit?: number; background?: string; ink?: string }) {
  // The renderer's ink coverage is 1 - step(threshold, luminance).
  const marks = thresholds.flatMap((threshold,index) => threshold > 1 - coverage ? [`M${index%8*unit} ${Math.floor(index/8)*unit}h${unit}v${unit}h-${unit}Z`] : []).join('')
  return <pattern id={id} patternUnits="userSpaceOnUse" width={8*unit} height={8*unit}>{background && <rect width={8*unit} height={8*unit} fill={background}/>}<path d={marks} fill={ink} shapeRendering="crispEdges"/></pattern>
}
