import { identity } from './identity'
import { siteCopy } from './site-copy'
import HomeContext from './HomeContext'
import './personal-profile.css'

function ProfileLinks() {
  return <nav className="profile-links mono" aria-label="Sulayman Bowles profiles">
    {identity.profiles.map(profile => <a key={profile.href} href={profile.href} rel="me noreferrer" target="_blank">{profile.label}<span aria-hidden="true">↗</span></a>)}
  </nav>
}

export function PersonalProfile({ compact = false }: { compact?: boolean }) {
  if (compact) return <HomeContext />
  const id = compact ? 'home-profile' : 'about-biography'
  return <section className={`personal-profile ${compact ? 'profile-compact' : ''}`} id={id} aria-labelledby={`${id}-title`}>
    <div className="profile-heading"><span className="eyebrow">{compact ? 'A little context' : 'Biography / work & study'}</span><h2 id={`${id}-title`} tabIndex={-1}>{identity.name}<span className="period">.</span></h2><p className="mono">Austin, Texas</p></div>
    <div className="profile-copy">
      <p className="profile-summary">{identity.summary}</p>
      {!compact && <>
        <div className="profile-details">
          <section><h3>Products & research</h3><p>I founded <a href="/work/internshipdeadlines">InternshipDeadlines</a> for internship search and application planning, and built <a href="/work/atlas">Atlas</a>, a website audit console. My <a href="/writing">essays</a> explore AI-operated businesses, software, and infrastructure economics.</p></section>
          <section><h3>Education & music</h3><p>I study finance at {identity.education.institution}, {identity.education.school}, with graduation expected in {identity.education.expectedGraduation}. {siteCopy.about.paragraphs[3]}</p></section>
        </div>
      </>}
      <nav className="profile-actions mono" aria-label="Biography and work"><a href={compact ? '/about' : '/resume'}>{compact ? 'Full biography' : 'Experience & education'}<span aria-hidden="true">→</span></a><a href="/work">Explore my work<span aria-hidden="true">→</span></a></nav>
      <ProfileLinks />
    </div>
  </section>
}

export function AuthorNote() {
  return <aside className="author-note" aria-labelledby="author-note-title">
    <span className="eyebrow" id="author-note-title">About the author</span>
    <p><a className="author-name" href="/about" rel="author">{identity.name}</a></p>
    <p>{identity.authorDescription}</p>
    <nav className="profile-actions mono" aria-label="More from the author"><a href="/about">Biography<span aria-hidden="true">→</span></a><a href="/writing">More writing<span aria-hidden="true">→</span></a><a href="/feed.xml">Writing feed<span aria-hidden="true">↗</span></a></nav>
  </aside>
}
