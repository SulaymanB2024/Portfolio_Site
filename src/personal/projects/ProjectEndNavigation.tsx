import { DestinationLink } from '../DestinationLink'
import { nextProject } from './project-navigation'

/** Share the same continuation with the mounted page and its readable HTML. */
export function ProjectEndNavigation({ slug }: { slug: string }) {
  const next = nextProject(slug)
  return <nav className="project-detail-end" aria-label="Explore more work">
    <DestinationLink href="#/work" direction="left">All work</DestinationLink>
    {next && <a href={`#/work/${next.slug}`}>Continue with {next.name}<span aria-hidden="true">→</span></a>}
  </nav>
}
