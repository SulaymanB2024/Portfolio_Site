import { memo, type MouseEvent } from 'react'
import { resumeProfile as profile, resumeReview } from '../profile-copy'
import { displayDate } from './types'
import { resumeSections as sections, resumeSectionHref, type ResumeSection } from './resume-navigation'
import './resume.css'

const roleNotes: Record<string, { id: string; link?: [string, string] }> = {
  'Chegg, Inc.': { id: 'chegg' },
  'Sapien': { id: 'sapien' },
  'VOID Agency': { id: 'void', link: ['#/work/atlas', 'Explore Atlas'] },
  'InternshipDeadlines': { id: 'internship-deadlines', link: ['https://internshipdeadlines.com/', 'Visit InternshipDeadlines'] },
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
  // The document is already mounted. Repeated section requests must still
  // move focus after Back to top clears the URL without a hashchange event.
  if (location.hash === event.currentTarget.hash) event.preventDefault()
  const heading = document.getElementById(`resume-${id}`)
  heading?.focus({ preventScroll: true })
  heading?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

function SectionHeading({ id, number, children }: { id: string; number: string; children: string }) {
  return <h2 id={`resume-${id}`} className="cv-section-title" tabIndex={-1}>
    <span className="cv-section-number" aria-hidden="true">{number}</span>{children}
  </h2>
}

function ResumeDocument() {
  const [firstName, ...lastName] = profile.name.split(' ')
  const awards = profile.awardsAndLeadership.slice(0, 4)
  const leadership = profile.awardsAndLeadership.slice(4)

  return <article className="resume-page cv-page" aria-labelledby="resume-name">
    <header className="cv-masthead">
      <div className="cv-document-line">
        <p className="cv-kicker">Résumé <span aria-hidden="true">/</span> Austin, Texas</p>
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
            <a className="arrow-link" href={`${import.meta.env.BASE_URL}Sulayman_Bowles_Resume.pdf`} download aria-describedby="resume-pdf-note">{resumeReview.pdfLabel}<span aria-hidden="true">↓</span></a>
            <button className="cv-print-button" onClick={() => window.print()}>Print this page<span aria-hidden="true">↗</span></button>
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
            {sections.map(([id, label], index) => <a key={id} href={resumeSectionHref(id)} onClick={event => jumpToSection(event, id)}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}
            </a>)}
          </nav>
          <details className="cv-mobile-nav">
            <summary>Explore this résumé<span aria-hidden="true">+</span></summary>
            <nav aria-label="Résumé sections on mobile">
              {sections.map(([id, label], index) => <a key={id} href={resumeSectionHref(id)} onClick={event => {
                if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  event.currentTarget.closest('details')?.removeAttribute('open')
                }
                jumpToSection(event, id)
              }}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
            </nav>
          </details>
          <a className="cv-rail-contact" href="#/contact">Get in touch<span aria-hidden="true">↗</span></a>
        </div>
      </aside>

      <div className="cv-content">
        <section className="cv-section cv-experience" aria-labelledby="resume-experience">
          <SectionHeading id="experience" number="01">Experience</SectionHeading>
          {profile.experience.map(item => {
            const note = roleNote(item.organization)
            return <div className="cv-entry" key={item.organization}>
              <div className="cv-entry-side">
                <div className="cv-entry-meta"><span>{item.dates}</span>{item.location && <span>{item.location}</span>}</div>
              </div>
              <div className="cv-entry-main">
                <div className="cv-entry-heading">
                  <h3 id={`resume-${note.id}`} tabIndex={-1}>{item.organization}</h3>
                  <p className="cv-role">{item.title}</p>
                </div>
                <p className="cv-summary">{item.publicSummary}</p>
                <ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                {note.link && <a className="cv-entry-link" href={note.link[0]} {...(note.link[0].startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>{note.link[1]}<span aria-hidden="true">↗</span></a>}
              </div>
            </div>
          })}
        </section>

        <section className="cv-section cv-work" aria-labelledby="resume-selected-work">
          <SectionHeading id="selected-work" number="02">Selected work</SectionHeading>
          <p className="cv-section-intro">A closer look at the work.</p>
          <div className="cv-work-list">
            <a className="cv-work-link" href="#/work/atlas">
              <span className="cv-work-type">Python &amp; SQLite<br />Technical SEO</span>
              <div><h3>Atlas</h3><p>Website crawling, internal-link mapping, and a path from every finding to its evidence.</p><span className="cv-work-read">Read the case study</span></div>
              <span className="cv-work-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="cv-work-link" href="#/work/payrollpro">
              <span className="cv-work-type">Solana<br />Hackathon prototype</span>
              <div><h3>PayrollPro</h3><p>Confidential payroll transfers, shared treasury controls, and the boundaries of a prototype.</p><span className="cv-work-read">Read the case study</span></div>
              <span className="cv-work-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="cv-further-links"><a href="#/work">All projects<span aria-hidden="true">→</span></a><a href="#/writing">Research &amp; writing<span aria-hidden="true">→</span></a></div>
        </section>

        <section className="cv-section" aria-labelledby="resume-education">
          <SectionHeading id="education" number="03">Education</SectionHeading>
          <div className="cv-education">
            <div className="cv-entry-meta"><span>Expected {profile.education.expectedGraduation}</span><span>{profile.education.location}</span></div>
            <div className="cv-education-detail">
              <h3>{profile.education.institution}</h3>
              <p className="cv-role">{profile.education.school}</p>
              <ul className="cv-degrees">{profile.education.degrees.map(item => <li key={item.degree}><span>{item.degree}</span><em>{item.field}</em></li>)}</ul>
              <p className="cv-coursework"><span>Coursework</span>{profile.education.coursework.join(' · ')}</p>
            </div>
          </div>
        </section>

        <section className="cv-section cv-recognition" aria-labelledby="resume-recognition">
          <SectionHeading id="recognition" number="04">Awards &amp; leadership</SectionHeading>
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
          <SectionHeading id="skills" number="05">Skills &amp; tools</SectionHeading>
          <dl className="cv-skills">{profile.skillGroups.map(group => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(' · ')}</dd></div>)}</dl>
          <div className="cv-additional">
            <div><h3 className="cv-subheading">Certifications</h3><ul>{profile.certifications.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div><h3 className="cv-subheading">Languages</h3><ul>{profile.languages.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>

        <nav className="resume-bottom-links cv-bottom-links" aria-label="Professional profiles">
          <a className="arrow-link" href={profile.canonicalLinks.github} target="_blank" rel="noreferrer">GitHub<span aria-hidden="true">↗</span></a>
          <a className="arrow-link" href={profile.canonicalLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn<span aria-hidden="true">↗</span></a>
          <a className="arrow-link" href="#/contact">Contact<span aria-hidden="true">→</span></a>
        </nav>
      </div>
    </div>
  </article>
}

export default memo(ResumeDocument)
