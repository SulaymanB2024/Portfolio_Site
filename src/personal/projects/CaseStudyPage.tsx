import { useRef, type MouseEvent } from 'react'
import { caseStudies, chapterId, type CaseStudy } from './case-studies'
import { caseNarratives } from './case-narratives'
import { CaseHeroArtwork } from './CaseHeroArtwork'
import { AtlasSourceComparison, PayrollLifecycle, ViralReviewLoop } from './CaseDossierEvidence'
import { WorkMaterials } from './WorkMaterials'
import { Art } from '../Art'
import './case-studies.css'
import './case-dossier.css'
import { useProjectReading } from './useProjectReading'
import { projectChapterHref } from './project-reading-position'
import { ProjectEndnav } from './ProjectEndnav'
import { DestinationLink } from '../DestinationLink'
import { ProjectContribution } from './ProjectContribution'
import { curatedNextProject } from './work-curation'

export default function CaseStudyPage({ study, dark }: { study: CaseStudy; dark: boolean }) {
  const document = caseNarratives[study.slug]
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useProjectReading(root, study.slug, '.study-chapter', chapterId(0))
  const next = curatedNextProject(study.slug) ?? caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  const chapterHref = (id: string) =>
    typeof window === 'undefined' ? `#/work/${study.slug}?chapter=${id}` : projectChapterHref(location.hash, location.pathname, location.search, study.slug, id)
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = globalThis.document.getElementById(id)
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    section?.focus({ preventScroll: true })
    setActive(id)
    history.replaceState(history.state, '', projectChapterHref(location.hash, location.pathname, location.search, study.slug, id))
  }
  return (
    <article ref={root} className={`case-study case-dossier case-study-${study.slug}`}>
      <DestinationLink className="study-back mono" href="#/work" direction="left">All work</DestinationLink>
      <header className="study-hero">
        <div className="study-hero-copy">
          <span className="eyebrow">
            {study.category} / {study.period}
          </span>
          <h1>
            {study.slug === 'viralbench' ? (
              <>
                ViralBench <br />
                <em>+ Codex</em>
              </>
            ) : (
              study.name
            )}
            <span className="period">.</span>
          </h1>
          <p className="study-title">{document.deck}</p>
          <p className="study-summary">{document.summary}</p>
          <ProjectContribution slug={study.slug} />
          <a href={chapterHref(document.chapters[0].id)} onClick={(event) => jump(event, document.chapters[0].id)}>
            Read the project <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="study-hero-figure">
          {study.slug === 'atlas' ? <Art kind="globe" dark={dark} className="study-glb" idleMotion={false} /> : <CaseHeroArtwork kind={study.slug} />}
        </div>
      </header>
      <div className="study-reading">
        <nav className="study-contents project-reading-bar" aria-label="In this project">
          {document.chapters.map((chapter, index) => (
            <a key={chapter.id} href={chapterHref(chapter.id)} aria-current={active === chapter.id ? 'location' : undefined} onClick={(event) => jump(event, chapter.id)}>
              <span className="mono" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {chapter.label}
            </a>
          ))}
        </nav>
        <div className="study-prose">
          {document.chapters.map((chapter, index) => (
            <section className="study-chapter" id={chapter.id} key={chapter.id} tabIndex={-1} aria-labelledby={`${chapter.id}-title`}>
              <div className="study-chapter-label">
                <span className="mono">{chapter.label}</span>
                <span className="mono" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')} / {String(document.chapters.length).padStart(2, '0')}
                </span>
              </div>
              <div className="study-account">
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                <div className="study-chapter-copy">
                  {(chapter.artifact ? chapter.body.slice(0, 1) : chapter.body).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
              {chapter.artifact && (
                <div className="study-dossier-body">
                  {chapter.artifact === 'atlas' ? <AtlasSourceComparison /> : chapter.artifact === 'payroll' ? <PayrollLifecycle /> : <ViralReviewLoop />}
                </div>
              )}
              {chapter.artifact && chapter.body.length > 1 && <div className="study-account study-prose-continuation"><div aria-hidden="true" /><div className="study-chapter-copy">{chapter.body.slice(1).map(text => <p key={text}>{text}</p>)}</div></div>}
              <WorkMaterials chapter={chapter} base={import.meta.env.BASE_URL} />
            </section>
          ))}
        </div>
      </div>
      <ProjectEndnav next={next} />
    </article>
  )
}
