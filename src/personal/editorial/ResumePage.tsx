import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { resumeChapters as chapterById } from './resume-chapters'
import ResumeDocument from './ResumeDocument'
import ResumeSculpture from './ResumeSculpture'
import { resumeDocumentFromHash, resumeDocumentHref, resumeSectionFromHash, withoutResumeDocument } from './resume-navigation'
import { createLatestFrame } from '../latest-frame'
import { DestinationLink, LinkArrow } from '../DestinationLink'
import './resume-explorer.css'

const chapterForOrganization = {
  'Chegg, Inc.': chapterById.chegg,
  'Sapien': chapterById.sapien,
  'VOID Agency': chapterById.void,
  'CreativeTrace': chapterById['creative-trace'],
  'Jon Brumley Texas Venture Labs': chapterById['venture-labs'],
  'AI Image Generation Startup': chapterById['ai-venture'],
}
const chapters = profile.experience.map(role => chapterForOrganization[role.organization as keyof typeof chapterForOrganization])
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
  const [documentOpen, setDocumentOpen] = useState(() => resumeDocumentFromHash(location.hash))
  const [sculptureMounted, setSculptureMounted] = useState(() => !resumeDocumentFromHash(location.hash))
  const documentVisible = useRef(documentOpen)
  documentVisible.current = documentOpen
  const observedHash = useRef(location.hash)
  const documentOrigin = useRef<{ scroll: number; target: HTMLElement | null } | null>(null)
  const documentToggle = useRef<HTMLButtonElement>(null)
  const experienceReturn = useRef<HTMLButtonElement>(null)
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

  useEffect(() => {
    // A direct document link needs no hidden WebGL startup. Once opened,
    // preserve the scene while reading so returning keeps its inspection state.
    if (!documentOpen) setSculptureMounted(true)
  }, [documentOpen])

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
      // Native Back emits both popstate and hashchange. Process that destination
      // once so its second event cannot cancel the queued focus restoration.
      if (location.hash === observedHash.current) return
      const route = location.hash.split('?')[0]
      if (route && route !== '#/resume') return
      observedHash.current = location.hash
      focusReturn.current?.cancel()
      const section = resumeSectionFromHash(location.hash)
      const open = resumeDocumentFromHash(location.hash)
      if (open && !documentVisible.current) documentOrigin.current = { scroll: window.scrollY, target: documentToggle.current }
      setRequestedSection(section)
      setDocumentOpen(open)
      if (!open && documentVisible.current) restoreExplorer()
    }
    window.addEventListener('hashchange', reachSection)
    window.addEventListener('popstate', reachSection)
    return () => { window.removeEventListener('hashchange', reachSection); window.removeEventListener('popstate', reachSection) }
  }, [])

  useEffect(() => {
    if (!documentOpen) return
    const frame = requestAnimationFrame(() => {
      const section = requestedSection ? document.getElementById(`resume-${requestedSection}`) : documentSection.current
      if (!section) return
      section.focus({ preventScroll: true })
      section.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [documentOpen, requestedSection])

  function restoreExplorer() {
    const saved = documentOrigin.current
    focusReturn.current?.schedule(() => {
      const target = saved?.target?.isConnected ? saved.target : documentToggle.current
      target?.focus({ preventScroll: true })
      window.scrollTo({ top: saved?.scroll ?? 0, behavior: 'instant' })
    })
  }

  function toggleDocument() {
    focusReturn.current?.cancel()
    const closing = documentOpen
    setRequestedSection(null)
    const hash = closing ? withoutResumeDocument(location.hash) : resumeDocumentHref(location.hash)
    observedHash.current = hash
    if (closing) history.replaceState(history.state, '', hash)
    else {
      documentOrigin.current = { scroll: window.scrollY, target: documentToggle.current }
      history.pushState(history.state, '', hash)
    }
    setDocumentOpen(!closing)
    if (closing) restoreExplorer()
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

  return <article className="resume-explorer" data-view={documentOpen ? 'document' : chapter ? 'experience' : 'overview'} aria-labelledby={documentOpen ? 'resume-name' : chapter ? 'resume-chapter-title' : 'resume-explorer-title'}>
    <div className="rx-screen" hidden={documentOpen} onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented && selected !== null) { event.preventDefault(); close() } }}>
      <div id="resume-experiences" className="rx-layout" data-selected={chapter?.id ?? 'overview'}>
        <header className="rx-title-actions">
          <div className="rx-title-copy">{chapter ? <p className="rx-context">Résumé</p> : <><h1 id="resume-explorer-title">Résumé.</h1><p className="rx-positioning">{profile.positioning}</p></>}</div>
          <div className="rx-entry-actions">
            <a className="rx-download" href={`${import.meta.env.BASE_URL}${resumeReview.pdfFile}`} download={resumeReview.pdfFile} aria-describedby="resume-overview-pdf-note">{resumeReview.pdfLabel}<LinkArrow direction="down" /></a>
            <button ref={documentToggle} type="button" className="rx-document-toggle" aria-expanded={documentOpen} aria-controls="resume-document" onClick={toggleDocument}>{documentOpen ? 'Close full résumé' : 'Read full résumé'}<LinkArrow direction={documentOpen ? 'up' : 'down'} /></button>
            <span className="sr-only" id="resume-overview-pdf-note">{resumeReview.pdfNote}</span>
          </div>
        </header>
        {chapter && role ?
            <header ref={readingStart} key={`heading:${chapter.id}`} className="rx-chapter-heading">
              <nav className="rx-chapter-nav" aria-label="Experience navigation">
                <button ref={experienceReturn} type="button" className="rx-close" onClick={close}><LinkArrow direction="left" /> All experience</button>
                <div className="rx-page-controls" role="group" aria-label={`Experience ${selectedPosition + 1} of ${chronology.length}`}>
                  <button type="button" disabled={!previous} onClick={() => previous && choose(previous.index)} aria-label={previous ? `Previous experience: ${previous.chapter.shortName}` : 'Previous experience'}><LinkArrow direction="left" /></button>
                  <span className="rx-page-position" aria-hidden="true">{String(selectedPosition + 1).padStart(2, '0')} / {String(chronology.length).padStart(2, '0')}</span>
                  <button type="button" disabled={!next} onClick={() => next && choose(next.index)} aria-label={next ? `Next experience: ${next.chapter.shortName}` : 'Next experience'}><LinkArrow /></button>
                </div>
              </nav>
              <h1 ref={heading} id="resume-chapter-title" tabIndex={-1}>{chapter.shortName}</h1>
              <p className="rx-job-title">{role.title}</p>
              <p className="rx-meta"><span>{role.dates}</span>{role.location && <>{' '}<span>{role.location}</span></>}</p>
              {role.organization !== chapter.shortName && <span className="sr-only">{role.organization}</span>}
            </header> : null}
        <section className="rx-world" aria-label={chapter ? `${chapter.shortName} sculpture` : 'Helmet sculpture'}>
          {sculptureMounted && <ResumeSculpture chapter={chapter?.id ?? null} dark={dark} onUnavailable={() => {
            const target = experienceReturn.current ?? documentToggle.current
            target?.focus({ preventScroll: true })
            target?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
          }} />}
        </section>
        {chapter && role ? <section key={`body:${chapter.id}`} className="rx-selected" id="resume-chapter" aria-labelledby="resume-chapter-title">
              <h2 className="rx-work-heading">{chapter.headline}</h2>
              <p className="rx-role-summary">{chapter.introduction}</p>
              {chapter.proof && <p className="rx-proof"><strong>{chapter.proof.value}</strong><span>{chapter.proof.label}</span></p>}
              <dl className="rx-contributions">{chapter.practice.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
              {chapter.links.length > 0 && <nav className="rx-evidence" aria-label={`Work related to ${role.organization}`}>{chapter.links.map(link => <DestinationLink key={link.href} href={link.href}>{link.label}</DestinationLink>)}</nav>}
              <nav className="rx-sequence" aria-label="Continue exploring">
                {next ? <button type="button" onClick={() => choose(next.index)}><span><span className="rx-sequence-label">Next experience</span><span className="rx-sequence-name">{next.chapter.shortName}</span></span><LinkArrow /></button> : <button type="button" onClick={close}><span><span className="rx-sequence-label">Back to the index</span><span className="rx-sequence-name">All experience</span></span><LinkArrow direction="up" /></button>}
              </nav>
            </section> : <section className="rx-chronology" aria-labelledby="resume-chronology-title">
              <header className="rx-index-heading"><h2 id="resume-chronology-title">Experience</h2></header>
              <ol>{chronology.map(({ role, chapter: item, index }) => {
                return <li key={item.id}>
                  <button ref={button => { roleButtons.current[index] = button }} type="button" aria-label={`${item.shortName}, ${role.title}, ${role.dates}`} aria-controls="resume-experiences" onClick={event => choose(index, event.currentTarget)}>
                    <span className="rx-node-copy"><span className="rx-node-name">{item.shortName}</span><span className="rx-node-meta"><span className="rx-role-label">{role.title}</span><span className="rx-node-dates">{role.dates}</span></span></span>
                    <LinkArrow className="rx-chronology-arrow" />
                  </button>
                </li>
              })}</ol>
              <p className="rx-education">Finance at UT Austin · BBA expected 2028</p>
            </section>}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{chapter ? `${role?.organization} experience selected.` : 'Résumé overview. Choose an experience to explore.'}</p>
      <details className="rx-art-credit"><summary>Artwork credit</summary><p>Animated study of <a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54" target="_blank" rel="noreferrer">Jousting Helmet</a> · The Royal Armoury · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Display pose and animation added; original engraving retained.</p></details>
    </div>
    <div ref={documentSection} id="resume-document" className="rx-document" data-open={documentOpen} hidden={!documentOpen} role="region" aria-labelledby="resume-name" tabIndex={-1} onKeyDown={event => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); toggleDocument() }
    }}>
      <button type="button" className="rx-document-return rx-document-return-top" onClick={toggleDocument}><LinkArrow direction="left" /> Back to {chapter?.shortName ?? 'résumé'}</button>
      <ResumeDocument />
      <button type="button" className="rx-document-return" onClick={toggleDocument}>Back to {chapter?.shortName ?? 'résumé'}<LinkArrow direction="up" /></button>
    </div>
  </article>
}
