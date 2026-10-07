import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { resumeChapters as chapterById } from './resume-chapters'
import ResumeDocument from './ResumeDocument'
import ResumeSculpture from './ResumeSculpture'
import { resumeSectionFromHash, withoutResumeSection } from './resume-navigation'
import { createLatestFrame } from '../latest-frame'
import { DestinationLink, LinkArrow } from '../DestinationLink'
import './resume-explorer.css'

const chapters = [chapterById.chegg, chapterById.sapien, chapterById.void, chapterById['internship-deadlines'], chapterById['creative-trace'], chapterById['venture-labs'], chapterById['ai-venture']]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function roleStart(dates: string) {
  const [month, year] = dates.split(' ')
  return Number(year) * 12 + months.indexOf(month)
}
const chronology = profile.experience.map((role, index) => ({ role, chapter: chapters[index], index }))
  .sort((a, b) => roleStart(b.role.dates) - roleStart(a.role.dates))

export default function ResumePage({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [requestedSection, setRequestedSection] = useState(() => resumeSectionFromHash(location.hash))
  const [documentOpen, setDocumentOpen] = useState(() => !!resumeSectionFromHash(location.hash))
  const documentToggle = useRef<HTMLButtonElement>(null)
  const documentSection = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const origin = useRef<number | null>(null)
  const roleButtons = useRef<(HTMLButtonElement | null)[]>([])
  const readingStart = useRef<HTMLElement>(null)
  const focusReturn = useRef<ReturnType<typeof createLatestFrame> | null>(null)
  const chapter = selected === null ? null : chapters[selected]
  const role = selected === null ? null : profile.experience[selected]
  const selectedPosition = chronology.findIndex(item => item.index === selected)
  const previous = chronology[selectedPosition - 1]
  const next = selectedPosition >= 0 ? chronology[selectedPosition + 1] : undefined

  useEffect(() => {
    const action = createLatestFrame()
    focusReturn.current = action
    return () => { action.dispose(); if (focusReturn.current === action) focusReturn.current = null }
  }, [])

  useLayoutEffect(() => {
    if (selected === null) return
    heading.current?.focus({ preventScroll: true })
    const bounds = readingStart.current?.getBoundingClientRect()
    if (matchMedia('(max-width: 760px)').matches || (bounds && (bounds.top < 0 || bounds.top > innerHeight - 160))) {
      readingStart.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }, [selected])

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

  function choose(index: number, button?: HTMLButtonElement) {
    focusReturn.current?.cancel()
    if (button) origin.current = index
    setSelected(index)
    if (selected === null && matchMedia('(min-width: 761px)').matches) window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function close() {
    setSelected(null)
    const index = origin.current
    focusReturn.current?.schedule(() => {
      const button = index === null ? null : roleButtons.current[index]
      button?.focus({ preventScroll: true })
      button?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    })
  }

  return <article className="resume-explorer" data-view={chapter ? 'experience' : 'overview'} aria-labelledby="resume-explorer-title">
    <div className="rx-screen" onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented && selected !== null) { event.preventDefault(); close() } }}>
      <div id="resume-experiences" className="rx-layout" data-selected={chapter?.id ?? 'overview'}>
        <header className="rx-title-actions">
          <h1 id="resume-explorer-title">Résumé.</h1>
          <div className="rx-entry-actions">
            <button ref={documentToggle} type="button" className="rx-document-toggle" aria-expanded={documentOpen} aria-controls="resume-document" onClick={toggleDocument}>{documentOpen ? 'Close full résumé' : 'Full résumé'}<span aria-hidden="true">{documentOpen ? '−' : '+'}</span></button>
            <a className="rx-download" href={`${import.meta.env.BASE_URL}Sulayman_Bowles_Resume.pdf`} download title={resumeReview.pdfNote} aria-describedby="resume-overview-pdf-note">July 2026 PDF<LinkArrow direction="down" /></a>
            <span className="sr-only" id="resume-overview-pdf-note">{resumeReview.pdfNote}</span>
          </div>
        </header>
        {chapter && role ?
            <header ref={readingStart} key={`heading:${chapter.id}`} className="rx-chapter-heading">
              <nav className="rx-chapter-nav" aria-label="Experience navigation">
                <button type="button" className="rx-close" onClick={close}><LinkArrow direction="left" /> All experience</button>
                <div className="rx-page-controls" role="group" aria-label={`Experience ${selectedPosition + 1} of ${chronology.length}`}>
                  <button type="button" disabled={!previous} onClick={() => previous && choose(previous.index)} aria-label={previous ? `Previous experience: ${previous.chapter.shortName}` : 'Previous experience'}><LinkArrow direction="left" /></button>
                  <span className="rx-page-position" aria-hidden="true">{String(selectedPosition + 1).padStart(2, '0')} / {String(chronology.length).padStart(2, '0')}</span>
                  <button type="button" disabled={!next} onClick={() => next && choose(next.index)} aria-label={next ? `Next experience: ${next.chapter.shortName}` : 'Next experience'}><LinkArrow /></button>
                </div>
              </nav>
              <h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>{chapter.shortName}</h2>
              <p className="rx-job-title">{role.title}</p>
              <p className="rx-meta"><span>{role.dates}</span>{role.location && <>{' '}<span>{role.location}</span></>}</p>
              {role.organization !== chapter.shortName && <span className="sr-only">{role.organization}</span>}
            </header> : <div className="rx-overview-copy">
              <header className="rx-index-heading" aria-hidden="true"><span>Experience</span><span>2025 — Present</span></header>
              <p className="rx-education">Finance at UT Austin · BBA expected 2028</p>
            </div>}
        <section className="rx-world" aria-label={chapter ? `${chapter.shortName} sculpture` : 'Knight sculpture'}>
          <ResumeSculpture chapter={chapter?.id ?? null} dark={dark} />
        </section>
        {chapter && role ? <section key={`body:${chapter.id}`} className="rx-selected" id="resume-chapter" aria-labelledby="resume-chapter-title">
              <p className="rx-role-summary">{chapter.introduction}</p>
              {chapter.proof && <p className="rx-proof"><strong>{chapter.proof.value}</strong><span>{chapter.proof.label}</span></p>}
              <dl className="rx-contributions">{chapter.practice.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
              {chapter.links.length > 0 && <nav className="rx-evidence" aria-label={`Work related to ${role.organization}`}>{chapter.links.map(link => <DestinationLink key={link.href} href={link.href}>{link.label}</DestinationLink>)}</nav>}
              <nav className="rx-sequence" aria-label="Continue exploring">
                {next ? <button type="button" onClick={() => choose(next.index)}><span><span className="rx-sequence-label">Next experience</span><span className="rx-sequence-name">{next.chapter.shortName}</span></span><LinkArrow /></button> : <button type="button" onClick={close}><span><span className="rx-sequence-label">Back to the index</span><span className="rx-sequence-name">All experience</span></span><LinkArrow direction="up" /></button>}
              </nav>
            </section> : <section className="rx-chronology" aria-labelledby="resume-chronology-title">
              <header className="rx-index-heading rx-list-heading"><h2 id="resume-chronology-title">Experience</h2><span aria-hidden="true">2025 — Present</span></header>
              <ol>{chronology.map(({ role, chapter: item, index }, position) => {
                const year = role.dates.split(' ')[1]
                const beginsYear = position === 0 || chronology[position - 1].role.dates.split(' ')[1] !== year
                return <li key={item.id} data-year-start={beginsYear}>
                  <button ref={button => { roleButtons.current[index] = button }} type="button" aria-label={`${item.shortName}, ${role.title}, ${role.dates}`} aria-controls="resume-experiences" onClick={event => choose(index, event.currentTarget)}>
                    <span className="rx-node-year" aria-hidden="true">{beginsYear ? year : ''}</span>
                    <span className="rx-node-copy"><span className="rx-node-name">{item.shortName}</span><span className="rx-role-label">{item.indexLabel}</span></span>
                    <LinkArrow className="rx-chronology-arrow" />
                  </button>
                </li>
              })}</ol>
            </section>}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{chapter ? `${role?.organization} experience selected.` : 'Résumé overview. Choose an experience to explore.'}</p>
    </div>
    <div ref={documentSection} id="resume-document" className="rx-document" data-open={documentOpen} hidden={!documentOpen} role="region" aria-labelledby="resume-name" tabIndex={-1}><ResumeDocument /><button type="button" className="rx-document-return" onClick={toggleDocument}>Back to résumé<LinkArrow direction="up" /></button></div>
  </article>
}
