import { Art } from '../Art'
import './product-evidence.css'

// Retain compatibility with older route callers without reviving removed inserts.
export default function ProductEvidence(_props: { kind: 'atlas' | 'internshipdeadlines' }) {
  return null
}

export function AtlasPortfolioFeature({ dark = false }: { dark?: boolean }) {
  return <section className="atlas-portfolio-feature" aria-labelledby="atlas-portfolio-title"><div className="atlas-portfolio-copy"><span>Product & engineering</span><h2 id="atlas-portfolio-title">Atlas</h2><p>A crawl and audit console that keeps the page, the observation and the reasoning together.</p><a href="#/work/atlas">Inside the product <span aria-hidden="true">↗</span></a></div><Art kind="globe" dark={dark} className="atlas-product-sculpture" idleMotion={false} /></section>
}
