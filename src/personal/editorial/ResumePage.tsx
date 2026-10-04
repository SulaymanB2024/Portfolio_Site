import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Art } from '../Art'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { resumeChapters as chapterById } from './resume-chapters'
import ResumeDocument from './ResumeDocument'
import { displayDate } from './types'
import { resumeSectionFromHash, withoutResumeSection } from './resume-navigation'
import { createLatestFrame } from '../latest-frame'
import './resume-explorer.css'

const resumeChapters = [chapterById.chegg, chapterById.sapien, chapterById.void, chapterById['internship-deadlines'], chapterById['creative-trace'], chapterById['venture-labs'], chapterById['ai-venture']]

type Selection = { kind: 'role'; index: number } | { kind: 'education' | 'recognition' | 'skills' }
const positions = [[18, 17], [82, 17], [14, 47], [86, 47], [21, 77], [79, 77], [50, 87]]
const secondary = [
  { kind: 'education', label: 'Education', note: 'UT Austin & beyond' },
  { kind: 'recognition', label: 'Awards & leadership', note: 'Competitions & campus' },
  { kind: 'skills', label: 'Skills & tools', note: 'What I work with' },
] as const

function ExternalLink({ href, children }: { href: string; children: string }) {
  return <a href={href} {...(href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}<span aria-hidden="true">↗</span></a>
}

export default function ResumePage({ dark }: { dark: boolean }) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [requestedSection, setRequestedSection] = useState(() => resumeSectionFromHash(location.hash))
  const [documentOpen, setDocumentOpen] = useState(() => !!resumeSectionFromHash(location.hash))
  const documentToggle = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const documentSection = useRef<HTMLDivElement>(null)
  const focusOnOpen = useRef(false)
  const origin = useRef<HTMLButtonElement | null>(null)
  const focusReturn = useRef<ReturnType<typeof createLatestFrame> | null>(null)
  const roleButtons = useRef<(HTMLButtonElement | null)[]>([])
  const selectedRole = selection?.kind === 'role' ? selection.index : -1
  const chapter = selectedRole >= 0 ? resumeChapters[selectedRole] : null
  const role = selectedRole >= 0 ? profile.experience[selectedRole] : null
  const selectionKey = selection?.kind === 'role' ? `role-${selection.index}` : selection?.kind

  useEffect(() => {
    const action = createLatestFrame()
    focusReturn.current = action
    return () => { action.dispose(); if (focusReturn.current === action) focusReturn.current = null }
  }, [])

  useEffect(() => {
    if (!selection || (!matchMedia('(max-width: 900px)').matches && !focusOnOpen.current)) return
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      heading.current?.closest('.rx-chapter')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [selectionKey])

  useEffect(() => {
    const reachSection = () => {
      focusReturn.current?.cancel()
      const section = resumeSectionFromHash(location.hash)
      setRequestedSection(section)
      if (section) setDocumentOpen(true)
    }
    window.addEventListener('hashchange', reachSection)
    return () => window.removeEventListener('hashchange', reachSection)
  }, [])

  useEffect(() => {
    if (!documentOpen) return
    const frame = requestAnimationFrame(() => {
      const section = requestedSection ? document.getElementById(`resume-${requestedSection}`) : documentSection.current
      if (!section) return
      section.focus({ preventScroll: true })
      section.scrollIntoView({ block: 'start', behavior: requestedSection || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [documentOpen, requestedSection])

  function toggleDocument() {
    focusReturn.current?.cancel()
    const closing = documentOpen
    setRequestedSection(null)
    history.replaceState(history.state, '', withoutResumeSection(location.hash))
    setDocumentOpen(!closing)
    const target = documentToggle.current
    if (closing) focusReturn.current?.schedule(() => {
      if (!target?.isConnected) return
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    })
  }

  function choose(next: Selection, button?: HTMLButtonElement, focus = false) {
    focusReturn.current?.cancel()
    focusOnOpen.current = focus || next.kind !== 'role'
    if (button) origin.current = button
    setSelection(next)
  }
  function close() {
    const target = origin.current
    setSelection(null)
    focusReturn.current?.schedule(() => {
      if (!target?.isConnected) return
      target.focus({ preventScroll: true })
      const bounds = target.getBoundingClientRect()
      if (bounds && (matchMedia('(max-width: 900px)').matches || bounds.top < 0 || bounds.bottom > innerHeight)) {
        target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    })
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && selection) { event.preventDefault(); close() }
  }
  function moveRole(index: number) {
    choose({ kind: 'role', index }, roleButtons.current[index] ?? undefined, true)
  }

  return <article className="resume-explorer" aria-labelledby="resume-explorer-title">
    <div className="rx-screen">
      <header className="rx-header">
        <div><span className="eyebrow">Sulayman Bowles / Austin, Texas</span><h1 id="resume-explorer-title">Résumé<span className="period">.</span></h1></div>
        <div className="rx-header-deck"><p>{profile.positioning}</p><span>Select a role to see the work.</span></div>
      </header>
      <div className="rx-document-bar"><button ref={documentToggle} type="button" className="rx-document-toggle" aria-expanded={documentOpen} aria-controls="resume-document" onClick={toggleDocument}>Read the full résumé<span aria-hidden="true">{documentOpen ? '−' : '+'}</span></button><div><a href={`${import.meta.env.BASE_URL}Sulayman_Bowles_Resume.pdf`} download aria-describedby="rx-pdf-note">{resumeReview.pdfLabel}<span aria-hidden="true">↓</span></a><button type="button" onClick={() => window.print()}>Print<span aria-hidden="true">↗</span></button></div></div>
      <div className="rx-notes"><p id="rx-pdf-note">{resumeReview.pdfNote}</p><p>Profile as of <time dateTime={profile.lastReviewed}>{displayDate(profile.lastReviewed)}</time></p></div>
      <section className="rx-world" aria-label="Explore my résumé" onKeyDown={onKeyDown}>
        <div className="rx-world-label"><span>01 / Experience</span><span>Choose a role to explore <span aria-hidden="true">↙</span></span></div>
        <div className={`rx-stage ${selection ? 'is-open' : ''}`}>
          <div className="rx-map">
            <svg className="rx-connections" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <ellipse cx="500" cy="282" rx="325" ry="210" />
              {positions.map(([x, y], i) => <path key={i} className={i === selectedRole ? 'is-active' : ''} d={`M500 282 Q${500 + (x * 10 - 500) * .45} ${y * 6} ${x * 10} ${y * 6}`} />)}
            </svg>
            <div className="rx-roles" role="group" aria-label="Experience">
              {resumeChapters.map((item, index) => <Fragment key={item.id}><button ref={el => { roleButtons.current[index] = el }} type="button"
                className={`rx-role rx-role-${index}`} style={{ '--x': `${positions[index][0]}%`, '--y': `${positions[index][1]}%` } as CSSProperties}
                aria-expanded={index === selectedRole} aria-controls="resume-chapter" aria-label={`Explore ${item.shortName}`}
                onClick={event => index === selectedRole ? close() : choose({ kind: 'role', index }, event.currentTarget, event.detail === 0)}>
                <span className="rx-node-index"><span>{String(index + 1).padStart(2, '0')}</span><i /><span className="rx-node-open" aria-hidden="true">{index === selectedRole ? '−' : '+'}</span></span>
                <span className="rx-node-name">{item.shortName}</span><span className="rx-node-discipline">{item.discipline}</span>
              </button>{index === 1 && <div className="rx-sculpture"><Art kind="helmet" dark={dark} cameraDistanceScale={.72} idleMotion={false} deferUntilVisible /></div>}</Fragment>)}
            </div>
          </div>
          <div className="rx-chapter-slot" id="resume-chapter">
            {selection && <section className="rx-chapter" aria-labelledby="resume-chapter-title">
              <button type="button" className="rx-close" onClick={close}><span aria-hidden="true">↖</span> Back to the overview<span aria-hidden="true">×</span></button>
              <div key={selectionKey} className="rx-chapter-body">
                {chapter && role ? <>
                  <p className="rx-chapter-kicker">{String(selectedRole + 1).padStart(2, '0')} / {role.organization}</p>
                  <h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>{chapter.headline}</h2>
                  <p className="rx-job-title">{role.title}</p>
                  <div className="rx-meta"><span>{role.dates}</span><span>{role.location}</span></div>
                  <p className="rx-lead">{chapter.introduction}</p>
                  {chapter.proof && <div className="rx-proof"><strong>{chapter.proof.value}</strong><span>{chapter.proof.label}</span></div>}
                  <div className="rx-practice" aria-label="The work in practice">{chapter.practice.map((item, i) => <div key={item.label}><span className="rx-practice-point" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{item.label}</h3><p>{item.text}</p></div></div>)}</div>
                  <details className="rx-detail"><summary>Responsibilities & detail<span aria-hidden="true">+</span></summary><div><p>{role.publicSummary}</p><ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div></details>
                  {chapter.links.length > 0 && <nav className="rx-evidence" aria-label={`Work related to ${role.organization}`}>{chapter.links.map(link => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</nav>}
                  <nav className="rx-sequence" aria-label="Explore another role">
                    {selectedRole > 0 ? <button onClick={() => moveRole(selectedRole - 1)}><span>← Previous</span>{resumeChapters[selectedRole - 1].shortName}</button> : <span />}
                    {selectedRole < resumeChapters.length - 1 ? <button onClick={() => moveRole(selectedRole + 1)}><span>Next →</span>{resumeChapters[selectedRole + 1].shortName}</button> : <span />}
                  </nav>
                </> : selection.kind === 'education' ? <>
                  <p className="rx-chapter-kicker">02 / Education</p><h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>Finance at<br />UT Austin.</h2>
                  <p className="rx-lead">{profile.education.institution}<br />{profile.education.school}</p>
                  <div className="rx-education-degree">{profile.education.degrees.map(degree => <div key={degree.degree}><strong>{degree.field}</strong><p>{degree.degree}</p></div>)}<span className="rx-meta">Expected {profile.education.expectedGraduation} / {profile.education.location}</span></div>
                  <h3 className="rx-small-heading">In the classroom</h3><div className="rx-subjects">{profile.education.coursework.map((item, i) => <span key={item}><i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i>{item}</span>)}</div>
                  <h3 className="rx-small-heading">Beyond the classroom</h3><ul className="rx-simple-list">{profile.certifications.map(item => <li key={item}>{item}</li>)}</ul>
                </> : selection.kind === 'recognition' ? <>
                  <p className="rx-chapter-kicker">03 / Awards & leadership</p><h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>Awards &<br />leadership.</h2>
                  <p className="rx-lead">Competitions, puzzles, research, and the communities I contribute to.</p>
                  <div className="rx-recognition">{profile.awardsAndLeadership.map((item, i) => <details key={item.organization}><summary><span className="rx-meta">{item.dates}</span><strong>{['Coinbase challenge','Jane Street puzzle','OnionDAO Hackathon','Artemis Researchathon','Student Government','Texas Blockchain','Energy Trading'][i]}</strong><span className="rx-recognition-role">{item.title}</span><span className="rx-plus" aria-hidden="true">+</span></summary><div><p>{item.detail}</p><span className="rx-meta">{item.organization}{item.location && ` / ${item.location}`}</span>{i === 2 && <div className="rx-evidence"><ExternalLink href="#/work/payrollpro">Explore PayrollPro</ExternalLink></div>}</div></details>)}</div>
                </> : <>
                  <p className="rx-chapter-kicker">04 / Skills & tools</p><h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>Skills & tools.</h2>
                  <p className="rx-lead">Code, commercial thinking, and research. Open a discipline to see the tools and methods behind the work.</p>
                  <div className="rx-toolkit">{profile.skillGroups.map((group, i) => <details key={group.label} open={i === 0}><summary><span className="rx-meta">0{i + 1}</span>{group.label}<span aria-hidden="true">+</span></summary><div>{group.items.map(item => <span key={item}>{item}</span>)}</div></details>)}</div>
                  <h3 className="rx-small-heading">Languages</h3><p className="rx-lead">{profile.languages.join(' · ')}</p>
                </>}
              </div>
            </section>}
          </div>
        </div>
        <nav className="rx-secondary" aria-label="More of my résumé">{secondary.map(item => <button key={item.kind} type="button" aria-expanded={selection?.kind === item.kind} aria-controls="resume-chapter" onClick={event => selection?.kind === item.kind ? close() : choose({ kind: item.kind }, event.currentTarget)}><span>{item.label}<i aria-hidden="true">{selection?.kind === item.kind ? '−' : '+'}</i></span><small>{item.note}</small></button>)}</nav>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{selection ? `${role?.organization ?? secondary.find(item => item.kind === selection.kind)?.label} chapter open.` : 'Résumé overview. Choose a role to explore.'}</p>
      </section>
    </div>
    <div ref={documentSection} id="resume-document" className="rx-document" data-open={documentOpen} role="region" aria-labelledby="resume-name" tabIndex={-1}><ResumeDocument /><button type="button" className="rx-document-return" onClick={toggleDocument}>Back to the résumé overview<span aria-hidden="true">↑</span></button></div>
  </article>
}
