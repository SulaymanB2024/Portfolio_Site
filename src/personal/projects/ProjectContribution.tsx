import { workContributions } from './work-curation'
import './project-contribution.css'

export function ProjectContribution({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const contribution = workContributions[slug]
  if (!contribution) return null
  return <div className={`project-contribution ${compact ? 'project-contribution-compact' : ''}`}>
    <dl>
      <div><dt>My role</dt><dd>{contribution.role}</dd></div>
      <div><dt>Status</dt><dd>{contribution.status}</dd></div>
    </dl>
    <p><span>Key decision</span>{contribution.decision}</p>
  </div>
}

/** Actual product destinations, with no invented query result or saved application. */
export function InternshipProductPath() {
  return <section className="project-product-path" aria-labelledby="internship-product-path-title">
    <div className="product-path-intro"><span className="mono">The product in practice</span><h2 id="internship-product-path-title">Search, check, then plan.</h2></div>
    <ol>
      <li><a href="https://internshipdeadlines.com/" target="_blank" rel="noreferrer"><h3>Find a role <span aria-hidden="true">↗</span></h3><p>Search by role, employer, and location.</p></a></li>
      <li><a href="https://internshipdeadlines.com/internships/nvidia-e63b7085/nvidia-spring-2027-internships-developer-and-performance-technology-a24959af/" target="_blank" rel="noreferrer"><h3>Check its source <span aria-hidden="true">↗</span></h3><p>Inspect the dated NVIDIA record and its employer reference.</p></a></li>
      <li><a href="https://internshipdeadlines.com/saved/" target="_blank" rel="noreferrer"><h3>Plan the application <span aria-hidden="true">↗</span></h3><p>Keep a personal stage, next action, target date, and notes.</p></a></li>
    </ol>
  </section>
}
