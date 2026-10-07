import { useRef, type MouseEvent } from 'react'
import { projects, type Project } from '../content'
import { ProjectStudy } from '../WorkCollection'
import { NarrativeSystem } from './NarrativeEvidence'
import { WorkMaterials, WorkSources } from './WorkMaterials'
import { WorkPlate } from './WorkPlate'
import { workNarratives } from './work-narratives'
import { useProjectReading } from './useProjectReading'
import { projectChapterHref } from './project-reading-position'
import { ProjectEndnav } from './ProjectEndnav'
import { InternshipProductPath, ProjectContribution } from './ProjectContribution'
import { curatedNextProject } from './work-curation'
import { DestinationLink } from '../DestinationLink'
import { closePrintUrl } from '../refinements/print-instrument'
import './project-narrative.css'
import '../refinements/print-room-studio.css'

export default function ProjectNarrativePage({ project: p, dark }: { project: Project; dark: boolean }) {
  const narrative = workNarratives[p.slug]
  const next = curatedNextProject(p.slug) ?? projects[(projects.indexOf(p) + 1) % projects.length]
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useProjectReading(root, p.slug, '[data-story-chapter]', 'question')
  function chapterHref(id: string) {
    if (typeof window === 'undefined') return `#/work/${p.slug}?chapter=${id}`
    // A shared print is an arrival, not part of a bookmark for the project text.
    const address = new URL(closePrintUrl(location.href))
    return projectChapterHref(address.hash, address.pathname, address.search, p.slug, id)
  }
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = document.getElementById(`${p.slug}-${id}`)
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    section?.focus({ preventScroll: true })
    setActive(id)
    history.replaceState(history.state, '', projectChapterHref(location.hash, location.pathname, location.search, p.slug, id))
  }
  return (
    <article ref={root} className={`project-page project-narrative project-narrative-${p.slug}`}>
      <DestinationLink className="project-back mono" href="#/work" direction="left">All work</DestinationLink>
      <section className="project-hero">
        <div className="project-copy">
          <span className="eyebrow">
            {p.number} / {p.category}
          </span>
          <h1 className={`project-name project-name-${p.slug}`}>
            {p.slug === 'internshipdeadlines' ? (
              <>
                Internship
                <wbr />
                Deadlines
              </>
            ) : p.slug === 'investing-markets' ? (
              'Markets'
            ) : (
              p.name
            )}
            <span className="period">.</span>
          </h1>
          <p className="project-deck">{narrative.deck}</p>
          <p className="project-summary">{narrative.summary}</p>
          <ProjectContribution slug={p.slug} />
          <div className="project-links">
            {p.link && <DestinationLink className="arrow-link" href={p.link.href}>{p.link.label}</DestinationLink>}
            <DestinationLink className="project-reading-action" href={chapterHref('question')} direction="down" onClick={(event) => jump(event, 'question')}>
              Read the project
            </DestinationLink>
          </div>
        </div>
        <div className="project-object">
          <WorkPlate slug={p.slug} className="project-loading-plate" />
          <ProjectStudy project={p} dark={dark} />
          <span className="crosshair" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 1v7m0 8v7M1 12h7m8 0h7" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
        </div>
      </section>
      {p.slug === 'internshipdeadlines' && <InternshipProductPath />}
      {p.slug === 'miscellaneous' && <aside className="print-studio-invitation" aria-label="Make an original print"><p>A little room for making things.</p><button type="button" data-open-print-room>Enter the print room<span aria-hidden="true">↗</span></button></aside>}
      <nav className="story-index project-reading-bar" aria-label="In this project">
        {narrative.chapters.map((chapter, i) => (
          <a key={chapter.id} href={chapterHref(chapter.id)} aria-current={active === chapter.id ? 'location' : undefined} onClick={(event) => jump(event, chapter.id)}>
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {chapter.label}
          </a>
        ))}
      </nav>
      {narrative.chapters.map((chapter, index) => (
        <section
          className={`story-chapter story-chapter-${chapter.id}`}
          id={`${p.slug}-${chapter.id}`}
          data-story-chapter={chapter.id}
          key={chapter.id}
          tabIndex={-1}
          aria-labelledby={`${p.slug}-${chapter.id}-title`}>
          <div className="story-chapter-label mono">
            <span>{chapter.label}</span>
            <span aria-hidden="true">
              {String(index + 1).padStart(2, '0')} / {String(narrative.chapters.length).padStart(2, '0')}
            </span>
          </div>
          <div className="story-opening-layout">
            <h2 id={`${p.slug}-${chapter.id}-title`}>{chapter.title}</h2>
            <div className="story-prose">
              {(chapter.artifact ? chapter.body.slice(0, 1) : chapter.body).map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          {chapter.artifact === 'system' && (
            <div className="story-artifact">
              <NarrativeSystem slug={p.slug} />
            </div>
          )}
          {chapter.artifact && chapter.body.length > 1 && <div className="story-opening-layout story-prose-continuation"><div aria-hidden="true" /><div className="story-prose">{chapter.body.slice(1).map(text => <p key={text}>{text}</p>)}</div></div>}
          <WorkMaterials chapter={chapter} base={import.meta.env.BASE_URL} />
        </section>
      ))}
      <section className="story-conclusion" aria-label="Further work">
        <WorkSources links={narrative.links} base={import.meta.env.BASE_URL} />
      </section>
      <ProjectEndnav next={next} />
    </article>
  )
}
