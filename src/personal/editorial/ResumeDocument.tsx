import { memo, type MouseEvent } from 'react'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { displayDate } from './types'
import { DestinationLink, LinkArrow } from '../DestinationLink'
import { resumeSections as sections, resumeSectionHref, type ResumeSection } from './resume-navigation'
import './resume.css'

const roleNotes: Record<string, { id: string; link?: [string, string] }> = {
  'Chegg, Inc.': { id: 'chegg', link: ['https://www.internships.com/', 'Internships.com'] },
  'Sapien': { id: 'sapien', link: ['#/work/sapien', 'My work at Sapien'] },
  'VOID Agency': { id: 'void', link: ['#/work/atlas', 'Explore Atlas'] },
  'CreativeTrace': { id: 'creative-trace' },
  'Jon Brumley Texas Venture Labs': { id: 'venture-labs' },
  'AI Image Generation Startup': { id: 'ai-venture' },
}

function roleNote(organization: string) {
  return roleNotes[organization] ?? {
    id: organization.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }
}

function jumpToSection(event: MouseEvent<HTMLAnchorElement>, id: ResumeSection) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  // Keep long-document navigation immediate and preserve the current view.
  event.preventDefault()
  const query = new URLSearchParams(location.hash.split('?')[1] || '')
  query.set('section', id)
  history.replaceState(history.state, '', `#/resume?${query}`)
  const heading = document.getElementById(`resume-${id}`)
  heading?.focus({ preventScroll: true })
  heading?.scrollIntoView({ behavior: 'instant', block: 'start' })
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return <h2 id={`resume-${id}`} className="cv-section-title" tabIndex={-1}>
    {children}
  </h2>
}

function ResumeDocument() {
  const [firstName, ...lastName] = profile.name.split(' ')
  const awards = profile.awardsAndLeadership.slice(0, 4)
  const leadership = profile.awardsAndLeadership.slice(4)

  return <article className="resume-page cv-page" aria-labelledby="resume-name">
    <header className="cv-masthead">
      <div className="cv-document-line">
        <p className="cv-kicker">Austin, Texas</p>
        <p className="cv-review-date">Profile as of <time dateTime={profile.lastReviewed}>{displayDate(profile.lastReviewed)}</time></p>
      </div>
      <div className="cv-introduction">
        <div className="cv-heading">
          <h1 id="resume-name"><span>{firstName}</span> <span>{lastName.join(' ')}<span className="period">.</span></span></h1>
          <p className="cv-positioning">{profile.positioning}</p>
        </div>
        <div className="cv-description">
          <p className="cv-intro-text">{resumeReview.introduction}</p>
          <div className="cv-actions resume-actions">
            <a className="cv-download" href={`${import.meta.env.BASE_URL}${resumeReview.pdfFile}`} download={resumeReview.pdfFile} aria-describedby="resume-pdf-note">{resumeReview.pdfLabel}<LinkArrow direction="down" /></a>
            <button type="button" className="cv-print-button" onClick={() => window.print()}>Print this page<span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </div>
      <p id="resume-pdf-note" className="cv-pdf-note resume-actions">{resumeReview.pdfNote}</p>
      <p className="cv-print-contact">{[profile.canonicalLinks.home, profile.canonicalLinks.github, profile.canonicalLinks.linkedin].map(url => url.replace(/^https?:\/\//, '').replace(/\/$/, '')).join(' · ')}</p>
    </header>

    <div className="cv-layout">
      <aside className="cv-rail" aria-label="Résumé navigation">
        <div className="cv-rail-inner">
          <p className="cv-rail-label">Contents</p>
          <nav className="cv-desktop-nav" aria-label="Résumé sections">
            {sections.map(([id, label]) => <a key={id} href={resumeSectionHref(id)} onClick={event => jumpToSection(event, id)}>{label}</a>)}
          </nav>
          <details className="cv-mobile-nav">
            <summary>Explore this résumé<span aria-hidden="true">+</span></summary>
            <nav aria-label="Résumé sections on mobile">
              {sections.map(([id, label]) => <a key={id} href={resumeSectionHref(id)} onClick={event => {
                if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  event.currentTarget.closest('details')?.removeAttribute('open')
                }
                jumpToSection(event, id)
              }}>{label}</a>)}
            </nav>
          </details>
          <DestinationLink className="cv-rail-contact" href="#/contact">Get in touch</DestinationLink>
        </div>
      </aside>

      <div className="cv-content">
        <section className="cv-section cv-experience" aria-labelledby="resume-experience">
          <SectionHeading id="experience">Experience</SectionHeading>
          {profile.experience.map(item => {
            const note = roleNote(item.organization)
            return <div className="cv-entry" key={item.organization}>
              <div className="cv-entry-main">
                <div className="cv-entry-heading">
                  <h3 id={`resume-${note.id}`} tabIndex={-1}>{item.organization}</h3>
                  <p className="cv-role">{item.title}</p>
                  <div className="cv-entry-meta"><span>{item.dates}</span>{item.location && <span>{item.location}</span>}</div>
                </div>
                <p className="cv-summary">{item.publicSummary}</p>
                <ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                {note.link && <DestinationLink className="cv-entry-link" href={note.link[0]}>{note.link[1]}</DestinationLink>}
              </div>
            </div>
          })}
        </section>

        <section className="cv-section cv-work" aria-labelledby="resume-selected-work">
          <SectionHeading id="selected-work">Selected work</SectionHeading>
          <div className="cv-work-list">
            <a className="cv-work-link" href="#/work/atlas">
              <div><h3>Atlas</h3><span className="cv-work-type">Python &amp; SQLite · Technical SEO</span><p>Traceable website audit recommendations, backed by captured pages, links and measurements.</p></div>
              <LinkArrow className="cv-work-arrow" />
            </a>
            <a className="cv-work-link" href="#/work/payrollpro">
              <div><h3>PayrollPro</h3><span className="cv-work-type">Solana · Hackathon prototype</span><p>Confidential payroll transfers, shared treasury controls, and the boundaries of a prototype.</p></div>
              <LinkArrow className="cv-work-arrow" />
            </a>
          </div>
          <div className="cv-further-links"><DestinationLink href="#/work">All projects</DestinationLink><DestinationLink href="#/writing">Research &amp; writing</DestinationLink></div>
        </section>

        <section className="cv-section" aria-labelledby="resume-education">
          <SectionHeading id="education">Education</SectionHeading>
          <div className="cv-education">
            <div className="cv-education-detail">
              <h3>{profile.education.institution}</h3>
              <p className="cv-role">{profile.education.school}</p>
              <div className="cv-entry-meta"><span>Expected {profile.education.expectedGraduation}</span><span>{profile.education.location}</span></div>
              <ul className="cv-degrees">{profile.education.degrees.map(item => <li key={item.degree}><span>{item.degree}</span><em>{item.field}</em></li>)}</ul>
              <p className="cv-coursework"><span>Coursework</span>{profile.education.coursework.join(', ')}</p>
            </div>
          </div>
        </section>

        <section className="cv-section cv-recognition" aria-labelledby="resume-recognition">
          <SectionHeading id="recognition">Awards &amp; leadership</SectionHeading>
          <div className="cv-awards-grid">
            {awards.map(item => <div className="cv-award" key={item.organization}>
              <div className="cv-award-date"><span>{item.dates}</span>{item.location && <span>{item.location}</span>}</div>
              <h3>{item.organization}</h3>
              <p className="cv-role">{item.title}</p>
              <p className="cv-summary">{item.detail}</p>
            </div>)}
          </div>
          <div className="cv-leadership">
            <h3 className="cv-subheading">On campus</h3>
            {leadership.map(item => <div className="cv-leadership-entry" key={item.organization}>
              <div><h4>{item.organization}</h4><p className="cv-role">{item.title}</p><div className="cv-entry-meta"><span>{item.dates}</span>{item.location && <span>{item.location}</span>}</div></div>
              <p className="cv-summary">{item.detail}</p>
            </div>)}
          </div>
        </section>

        <section className="cv-section cv-capabilities" aria-labelledby="resume-skills">
          <SectionHeading id="skills">Skills &amp; tools</SectionHeading>
          <dl className="cv-skills">{profile.skillGroups.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(', ')}</dd></div>)}</dl>
          <div className="cv-additional">
            <div><h3 className="cv-subheading">Certifications</h3><ul>{profile.certifications.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div><h3 className="cv-subheading">Languages</h3><ul>{profile.languages.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>

        <nav className="resume-bottom-links cv-bottom-links" aria-label="Professional profiles">
          <DestinationLink className="arrow-link" href={profile.canonicalLinks.github}>GitHub</DestinationLink>
          <DestinationLink className="arrow-link" href={profile.canonicalLinks.linkedin}>LinkedIn</DestinationLink>
          <DestinationLink className="arrow-link" href="#/contact">Contact</DestinationLink>
        </nav>
      </div>
    </div>
  </article>
}

export default memo(ResumeDocument)
