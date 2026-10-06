import { inlineText } from './Markdown'
import type { ArticleFigure } from './types'
import { researchFigurePresentation } from './research-figure-presentation'
import ResearchDiagram, { hasResearchDiagram } from './ResearchDiagram'
import ResearchComparison, { hasResearchComparison } from './ResearchComparison'
import ResearchProcess, { hasResearchProcess } from './ResearchProcess'
import './research-figures.css'

export default function ResearchFigure({ figure }: { figure: ArticleFigure }) {
  const { original, display } = researchFigurePresentation(figure.src, import.meta.env.BASE_URL)
  const diagram = hasResearchDiagram(figure.src)
  const comparison = hasResearchComparison(figure.src)
  const process = hasResearchProcess(figure.src)
  const native = diagram || comparison || process
  const dense = /\/online-returns-(furniture|retailer-reseller)-waterfall\.png$/.test(figure.src)
  return <figure className="reader-research-figure" data-density={dense ? 'dense' : undefined}>
    {diagram ? <ResearchDiagram figure={figure} /> : comparison ? <ResearchComparison figure={figure} /> : process ? <ResearchProcess figure={figure} /> : <div className="reader-figure-viewport" role={dense ? 'region' : undefined} aria-label={dense ? figure.label || figure.alt : undefined} tabIndex={dense ? 0 : undefined}>
      <a className="reader-figure-link" href={original} target="_blank" rel="noreferrer" aria-label={`Open full-size figure: ${figure.alt}`}><img src={display} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" /></a>
    </div>}
    <figcaption>{inlineText(figure.caption)}{native && <a className="reader-original-figure" href={original} target="_blank" rel="noreferrer">Source figure ↗</a>}</figcaption>
  </figure>
}
