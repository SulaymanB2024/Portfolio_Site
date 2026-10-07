import { inlineText } from './Markdown'
import type { ArticleFigure } from './types'
import { researchFigurePresentation } from './research-figure-presentation'
import ResearchDiagram, { hasResearchDiagram } from './ResearchDiagram'
import ResearchComparison, { hasResearchComparison } from './ResearchComparison'
import ResearchProcess, { hasResearchProcess } from './ResearchProcess'
import RareEarthFigures, { hasRareEarthFigure } from './RareEarthFigures'
import TexasTollFigures, { hasTexasTollFigure } from './TexasTollFigures'
import AirlineLoyaltyFigure, { hasAirlineLoyaltyFigure } from './AirlineLoyaltyFigure'
import './research-figures.css'

export default function ResearchFigure({ figure, caption, id }: { figure: ArticleFigure; caption?: ReactNode; id?: string }) {
  const { original, display } = researchFigurePresentation(figure.src, import.meta.env.BASE_URL)
  const diagram = hasResearchDiagram(figure.src)
  const comparison = hasResearchComparison(figure.src)
  const process = hasResearchProcess(figure.src)
  const rareEarth = hasRareEarthFigure(figure.src)
  const texasToll = hasTexasTollFigure(figure.src)
  const airlineLoyalty = hasAirlineLoyaltyFigure(figure.src)
  const native = diagram || comparison || process || rareEarth || texasToll || airlineLoyalty
  return <figure className="reader-research-figure" id={id}>
    {diagram ? <ResearchDiagram figure={figure} /> : comparison ? <ResearchComparison figure={figure} /> : process ? <ResearchProcess figure={figure} /> : rareEarth ? <RareEarthFigures figure={figure} /> : texasToll ? <TexasTollFigures figure={figure} /> : airlineLoyalty ? <AirlineLoyaltyFigure figure={figure} /> : <><p className="reader-figure-scroll-cue" aria-hidden="true">Scroll horizontally to inspect the figure →</p><div className="reader-figure-viewport" role="region" aria-label={figure.label || figure.alt} tabIndex={0}>
      <a className="reader-figure-link" href={original} target="_blank" rel="noreferrer" aria-label={`Open full-size figure: ${figure.alt}`}><img src={display} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" /></a>
    </div></>}
    <figcaption>{caption ?? inlineText(figure.caption)}{native && <a className="reader-original-figure" href={original} target="_blank" rel="noreferrer">Source figure ↗</a>}</figcaption>
  </figure>
}
import type { ReactNode } from 'react'
