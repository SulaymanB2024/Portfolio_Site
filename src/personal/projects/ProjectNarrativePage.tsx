import { useRef, type MouseEvent, type ReactNode } from 'react'
import { projects, type Project } from '../content'
import { ProjectStudy } from '../WorkCollection'
import { NarrativePractice, NarrativeSystem } from './NarrativeEvidence'
import { WorkPlate } from './WorkPlate'
import { workNarratives } from './work-narratives'
import { useProjectReading } from './useProjectReading'
import { ProjectEndnav } from './ProjectEndnav'
import './project-narrative.css'

function StoryLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith('http')
  return (
    <a
      className={`arrow-link ${className}`}
      href={href.startsWith('./') ? `${import.meta.env.BASE_URL}${href.slice(2)}` : href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {children}
      <span aria-hidden="true">{external ? '↗' : '→'}</span>
    </a>
  )
}

export default function ProjectNarrativePage({ project: p, dark }: { project: Project; dark: boolean }) {
  const narrative = workNarratives[p.slug]
  const chapterLabels: Record<string, string[]> = {
    internshipdeadlines: ['The question', 'The workflow', 'The plan'],
    sapien: ['Buyer questions', 'Research', 'Communication'],
    'investing-markets': ['Ownership', 'Cash flow', 'Assumptions'],
    miscellaneous: ['The idea', 'Ink & paper', 'Iteration']
  }
  const sectionTitles: Record<string, string[]> = {
    internshipdeadlines: ['From finding a role to applying for it.', 'A record you can trace.', 'A shortlist with a next step.'],
    sapien: ['Start with a buyer’s question.', 'How the comparison works.', 'From research to published work.'],
    'investing-markets': ['Separate the road from the rights.', 'Who gets paid first.', 'The research in full.'],
    miscellaneous: ['Form, light, and movement.', 'A working material study.', 'Refining the construction.']
  }
  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useProjectReading(root, p.slug, '[data-story-chapter]', 'question')
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = document.getElementById(`${p.slug}-${id}`)
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    section?.focus({ preventScroll: true })
    setActive(id)
    const address = new URL(location.href)
    address.hash = `/work/${p.slug}?chapter=${id}`
    history.replaceState(history.state, '', address)
  }
  return (
    <article ref={root} className={`project-page project-narrative project-narrative-${p.slug}`}>
      <a className="project-back mono" href="#/work">
        ← All work
      </a>
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
          <p className="project-deck">{p.headline.join(' ')}</p>
          <p className="project-summary">{p.summary}</p>
          <div className="project-links">
            {p.link && <StoryLink href={p.link.href}>{p.link.label}</StoryLink>}
            <a className="project-read mono" href={`#/work/${p.slug}?chapter=question`} onClick={(event) => jump(event, 'question')}>
              Read the project<span aria-hidden="true">↓</span>
            </a>
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
      <dl className="project-context">
        <div>
          <dt>My role</dt>
          <dd>{narrative.role}</dd>
        </div>
        <div>
          <dt>Approach</dt>
          <dd>{narrative.lens}</dd>
        </div>
      </dl>
      <nav className="story-index project-reading-bar" aria-label="In this project">
        <span className="mono">Inside the work</span>
        {narrative.chapters.map((chapter, i) => (
          <a
            key={chapter.id}
            href={`#/work/${p.slug}?chapter=${chapter.id}`}
            aria-current={active === chapter.id ? 'location' : undefined}
            onClick={(event) => jump(event, chapter.id)}>
            <span aria-hidden="true">0{i + 1}</span>
            {chapterLabels[p.slug][i]}
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
            <span>{chapter.kicker}</span>
            <span aria-hidden="true">0{index + 1} / 03</span>
          </div>
          {index === 0 ? (
            <div className="story-opening-layout">
              <h2 id={`${p.slug}-${chapter.id}-title`}>{sectionTitles[p.slug][index]}</h2>
              <div className="story-prose">
                {chapter.body.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          ) : index === 1 ? (
            <>
              <div className="story-system-layout">
                <div className="story-system-heading">
                  <h2 id={`${p.slug}-${chapter.id}-title`}>{sectionTitles[p.slug][index]}</h2>
                </div>
                <div className="story-prose">
                  {(p.slug === 'miscellaneous' ? chapter.body : chapter.body.slice(0, 1)).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
              <NarrativeSystem slug={p.slug} />
              {chapter.note && <p className="story-note">{chapter.note}</p>}
            </>
          ) : (
            <>
              <div className="story-practice-account">
                <h2 id={`${p.slug}-${chapter.id}-title`}>{sectionTitles[p.slug][index]}</h2>
                <div className="story-prose">
                  {chapter.body.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
              <NarrativePractice slug={p.slug} />
              {chapter.note && <p className="story-note">{chapter.note}</p>}
            </>
          )}
        </section>
      ))}
      <section className="story-conclusion" aria-label="References and further reading">
        <span className="mono">Sources & further reading</span>
        <div className="story-related">
          {narrative.links.map((link, i) => (
            <a
              key={link.href}
              href={link.href.startsWith('./') ? `${import.meta.env.BASE_URL}${link.href.slice(2)}` : link.href}
              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
              <span className="mono" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
              </div>
              <span aria-hidden="true">{link.href.startsWith('http') ? '↗' : '→'}</span>
            </a>
          ))}
        </div>
      </section>
      <ProjectEndnav next={next} />
    </article>
  )
}
