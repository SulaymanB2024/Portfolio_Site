import { caseStudies } from './case-studies'
import { StudyArtwork } from './StudyArtwork'
import './case-studies.css'

export default function CaseStudyIndex() {
  return <section className="study-index" aria-labelledby="study-index-title">
    <div className="study-index-heading"><h2 id="study-index-title">A closer look.</h2><p>Three projects, from the initial question to the decisions behind the work.</p></div>
    <div className="study-index-list">{caseStudies.map(study => <a className="study-index-entry" key={study.slug} href={`#/work/${study.slug}`}>
      <StudyArtwork kind={study.slug} compact />
      <div className="study-index-copy"><span className="eyebrow">{study.category}</span><h3>{study.name}</h3><p>{study.title}</p></div>
      <div className="study-index-end"><span className="mono">{study.period}</span><span className="study-index-status">{study.status}</span></div>
      <span className="study-index-arrow" aria-hidden="true">↗</span>
    </a>)}</div>
  </section>
}
