import './project-reading.css'

/** One quiet exit shared by project narratives and technical studies. */
export function ProjectEndnav({ next }: { next: { slug: string; name: string; category: string } }) {
  return (
    <nav className="project-endnav" aria-label="Explore more work">
      <a className="project-return mono" href="#/work">
        <span aria-hidden="true">←</span>All work
      </a>
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
        <span className="project-continue-arrow" aria-hidden="true">
          →
        </span>
      </a>
    </nav>
  )
}
