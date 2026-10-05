import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Art } from '../Art'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { resumeChapters as chapterById } from './resume-chapters'
import ResumeDocument from './ResumeDocument'
import ResumeWorkDiagram from './ResumeWorkDiagram'
import { resumeSectionFromHash, withoutResumeSection } from './resume-navigation'
import { createLatestFrame } from '../latest-frame'
import { createResumeFocus, resumeTitleOrigin } from './resume-focus'
import './resume-explorer.css'

const resumeChapters = [chapterById.chegg, chapterById.sapien, chapterById.void, chapterById['internship-deadlines'], chapterById['creative-trace'], chapterById['venture-labs'], chapterById['ai-venture']]

type Selection = { kind: 'role'; index: number } | { kind: 'education' | 'recognition' | 'skills' }
const positions = [[12, 15], [88, 15], [11, 48], [89, 48], [13, 79], [87, 79], [50, 95]]
const secondary = [
  { kind: 'education', label: 'Education', note: 'UT Austin & beyond' },
  { kind: 'recognition', label: 'Awards & leadership', note: 'Competitions & campus' },
  { kind: 'skills', label: 'Skills & tools', note: 'What I work with' },
] as const

function ExternalLink({ href, children }: { href: string; children: string }) {
  return <a href={href} {...(href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}<span aria-hidden="true">↗</span></a>
}

export default function ResumePage({ dark }: { dark: boolean }) {
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 600px)').matches)
  useEffect(() => { const media = matchMedia('(max-width: 600px)'); const change = () => setNarrow(media.matches); media.addEventListener('change', change); return () => media.removeEventListener('change', change) }, [])
  const [selection, setSelection] = useState<Selection | null>(null)
  const [requestedSection, setRequestedSection] = useState(() => resumeSectionFromHash(location.hash))
  const [documentOpen, setDocumentOpen] = useState(() => !!resumeSectionFromHash(location.hash))
  const documentToggle = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const documentSection = useRef<HTMLDivElement>(null)
  const origin = useRef<HTMLButtonElement | null>(null)
  const openingOrigin = useRef<ReturnType<typeof resumeTitleOrigin>>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const map = useRef<HTMLDivElement>(null)
  const focusScene = useRef<ReturnType<typeof createResumeFocus> | null>(null)
  const direction = useRef(0)
  const focusReturn = useRef<ReturnType<typeof createLatestFrame> | null>(null)
  const selectedRole = selection?.kind === 'role' ? selection.index : -1
  const chapter = selectedRole >= 0 ? resumeChapters[selectedRole] : null
  const role = selectedRole >= 0 ? profile.experience[selectedRole] : null
  const selectionKey = selection?.kind === 'role' ? `role-${selection.index}` : selection?.kind

  useEffect(() => {
    const action = createLatestFrame()
    focusReturn.current = action
    return () => { action.dispose(); if (focusReturn.current === action) focusReturn.current = null }
  }, [])

  useLayoutEffect(() => {
    if (!dialog.current || !map.current) return
    const scene = createResumeFocus(dialog.current, map.current)
    focusScene.current = scene
    return () => { scene.dispose(); if (focusScene.current === scene) focusScene.current = null }
  }, [])
  useLayoutEffect(() => {
    if (selection && heading.current) focusScene.current?.enter(heading.current, openingOrigin.current, direction.current)
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

  function choose(next: Selection, button?: HTMLButtonElement) {
    if (dialog.current?.dataset.phase === 'leaving') return
    focusReturn.current?.cancel()
    if (!selection && button) {
      origin.current = button
      openingOrigin.current = resumeTitleOrigin(button.querySelector<HTMLElement>('.rx-node-name'))
    }
    direction.current = next.kind === 'role' && selection?.kind === 'role' ? Math.sign(next.index - selection.index) : 0
    setSelection(next)
  }
  function close() {
    const target = origin.current
    focusScene.current?.exit(heading.current, target?.querySelector<HTMLElement>('.rx-node-name') ?? null, () => {
      setSelection(null)
      focusReturn.current?.schedule(() => { if (target?.isConnected) target.focus({ preventScroll: true }) })
    })
  }
  function moveRole(index: number) {
    choose({ kind: 'role', index })
  }
  function keepFocusInScene(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],summary,[tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0)
    const first = controls[0], last = controls.at(-1)
    if (!first || !last) return
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === heading.current)) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus() }
  }

  return <article className="resume-explorer" aria-labelledby="resume-explorer-title">
    <div className="rx-screen">
      <h1 id="resume-explorer-title" className="sr-only">Résumé</h1>
      <section className="rx-world" aria-label="Explore my résumé">
        <div className={`rx-stage ${selection ? 'is-open' : ''}`}>
          <div ref={map} className="rx-map">
            <div className="rx-roles" role="group" aria-label="Experience">
              {resumeChapters.map((item, index) => <Fragment key={item.id}><button type="button"
                className={`rx-role rx-role-${index}`} style={{ '--x': `${positions[index][0]}%`, '--y': `${positions[index][1]}%` } as CSSProperties}
                aria-expanded={index === selectedRole} aria-controls="resume-chapter" aria-label={`Explore ${item.shortName}`}
                onClick={event => choose({ kind: 'role', index }, event.currentTarget)}>

                <span className="rx-node-name">{item.shortName}<span className="rx-role-arrow" aria-hidden="true">↗</span></span>
              </button>{index === 1 && <div className="rx-sculpture"><Art kind="helmet" dark={dark} cameraDistanceScale={narrow ? .52 : .68} idleMotion deferUntilVisible /><details className="rx-art-credit"><summary aria-label="Sculpture attribution">©</summary><p><a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54" target="_blank" rel="noreferrer">Jousting Helmet</a> · The Royal Armoury · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></p></details></div>}</Fragment>)}
            </div>
          </div>
          <dialog ref={dialog} className="rx-focus-scene" id="resume-chapter" aria-labelledby="resume-chapter-title" onKeyDown={keepFocusInScene} onCancel={event => { event.preventDefault(); close() }}>
            {selection && <section className="rx-chapter">
              <div className="rx-focus-bar"><button type="button" className="rx-close" onClick={close}><span aria-hidden="true">↖</span> Back to overview</button><span className="rx-focus-count">{String(selectedRole + 1).padStart(2, '0')} / {String(resumeChapters.length).padStart(2, '0')}</span></div>
              <div key={selectionKey} className="rx-chapter-body rx-focus-content">
                {chapter && role ? <>
                  <div className="rx-focus-layout"><header className="rx-focus-intro">
                  <p className="rx-chapter-kicker">{role.organization}</p>
                  <h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>{chapter.shortName}</h2>
                  <p className="rx-job-title">{role.title}</p>
                  <div className="rx-meta"><span>{role.dates}</span><span>{role.location}</span></div>
                  {chapter.proof && <div className="rx-proof"><strong>{chapter.proof.value}</strong><span>{chapter.proof.label}</span></div>}
                  </header><div className="rx-focus-work"><ResumeWorkDiagram key={chapter.id} chapter={chapter} /></div>
                  <div className="rx-focus-support">
                  <details className="rx-detail"><summary>Responsibilities & detail<span aria-hidden="true">+</span></summary><div><p>{role.publicSummary}</p><ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div></details>
                  {chapter.links.length > 0 && <nav className="rx-evidence" aria-label={`Work related to ${role.organization}`}>{chapter.links.map(link => <ExternalLink key={link.href} href={link.href}>{link.label}</ExternalLink>)}</nav>}
                  </div></div>
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
                  <div className="rx-recognition">{profile.awardsAndLeadership.map((item, i) => <details key={item.organization}><summary><span className="rx-meta">{item.dates}</span><strong>{['Coinbase challenge','Jane Street puzzle','OnionDAO Hackathon','Artemis Researchathon','Student Government','Texas Blockchain','Energy Trading'][i]}</strong><span className="rx-recognition-role">{item.title}</span><span className="rx-plus" aria-hidden="true">+</span></summary><div><p>{item.detail}</p><span className="rx-meta">{item.organization}{item.location && ` / ${item.location}`}</span>{i === 2 && <div className="rx-evidence"><ExternalLink href="#/work/payrollpro">Explore PayrollPro</ExternalLink></div>}</div></details>)}</div>
                </> : <>
                  <p className="rx-chapter-kicker">04 / Skills & tools</p><h2 ref={heading} id="resume-chapter-title" tabIndex={-1}>Skills & tools.</h2>
                  <p className="rx-lead">Code, commercial thinking, and research. Open a discipline to see the tools and methods behind the work.</p>
                  <div className="rx-toolkit">{profile.skillGroups.map((group, i) => <details key={group.label} open={i === 0}><summary><span className="rx-meta">0{i + 1}</span>{group.label}<span aria-hidden="true">+</span></summary><div>{group.items.map(item => <span key={item}>{item}</span>)}</div></details>)}</div>
                  <h3 className="rx-small-heading">Languages</h3><p className="rx-lead">{profile.languages.join(' · ')}</p>
                </>}
              </div>
            </section>}
          </dialog>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{selection ? `${role?.organization ?? secondary.find(item => item.kind === selection.kind)?.label} chapter open.` : 'Résumé overview. Choose a role to explore.'}</p>
      </section>
    </div>
    <div ref={documentSection} id="resume-document" className="rx-document" data-open={documentOpen} role="region" aria-labelledby="resume-name" tabIndex={-1}><ResumeDocument /><button type="button" className="rx-document-return" onClick={toggleDocument}>Back to the résumé overview<span aria-hidden="true">↑</span></button></div>
  </article>
}
