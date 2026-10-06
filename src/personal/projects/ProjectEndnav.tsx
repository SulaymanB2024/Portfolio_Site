import './project-reading.css'
import { DestinationLink, LinkArrow } from '../DestinationLink'

/** One quiet exit shared by project narratives and technical studies. */
export function ProjectEndnav({ next }: { next: { slug: string; name: string; category: string } }) {
  return (
    <nav className="project-endnav" aria-label="Explore more work">
      <DestinationLink className="project-return mono" href="#/work" direction="left">All work</DestinationLink>
      <a className="project-continue" href={`#/work/${next.slug}`}>
        <span className="mono">Next project / {next.category}</span>
        <h2>
          {next.slug === 'internshipdeadlines' ? (
            <>
              Internship
              <wbr />
              Deadlines
            </>
          ) : (
            next.name
          )}
        </h2>
        <LinkArrow className="project-continue-arrow" />
      </a>
    </nav>
  )
}
