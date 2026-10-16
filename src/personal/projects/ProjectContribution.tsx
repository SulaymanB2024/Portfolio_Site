import { workContributions } from './work-curation'
import './project-contribution.css'
import { DestinationLink } from '../DestinationLink'

export function ProjectContribution({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const contribution = workContributions[slug]
  if (!contribution) return null
  return <div className={`project-contribution ${compact ? 'project-contribution-compact' : ''}`}>
    <dl>
      <div><dt>My role</dt><dd>{contribution.role}</dd></div>
      <div><dt>Status</dt><dd>{contribution.status}</dd></div>
    </dl>
    <p><span>Key decision</span>{contribution.decision}</p>
    <nav className="project-proof-links" aria-label="Project evidence">
      {contribution.proofs.map(proof => <DestinationLink key={proof.href} href={proof.href}>{proof.label}</DestinationLink>)}
    </nav>
  </div>
}

/** Actual product destinations, with no invented query result or saved application. */
export function InternshipProductPath() {
  return <section className="project-product-path" aria-labelledby="internship-product-path-title">
    <div className="product-path-intro"><span className="mono">The product in practice</span><h2 id="internship-product-path-title">Prepare, check, then plan.</h2></div>
    <ol>
      <li><a href="https://internshipdeadlines.com/guides/first-internship-resume" target="_blank" rel="noreferrer"><h3>Prepare your résumé <span aria-hidden="true">↗</span></h3><p>Turn a posting’s tasks into evidence from your own experience.</p></a></li>
      <li><a href="https://internshipdeadlines.com/methodology/" target="_blank" rel="noreferrer"><h3>Check the listing rules <span aria-hidden="true">↗</span></h3><p>See how employer checks, unconfirmed deadlines, and closures are handled.</p></a></li>
      <li><a href="https://internshipdeadlines.com/saved/" target="_blank" rel="noreferrer"><h3>Plan the application <span aria-hidden="true">↗</span></h3><p>Keep a personal stage, next action, target date, and notes.</p></a></li>
    </ol>
  </section>
}
