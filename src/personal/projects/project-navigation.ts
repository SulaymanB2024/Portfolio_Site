import { featuredProjects, projects } from '../content.ts'
import { caseStudies } from './case-studies.ts'

/** Legacy accounts remain readable and lead back into the featured journey. */
export function nextProject(slug: string) {
  const index = featuredProjects.findIndex(project => project.slug === slug)
  if (index >= 0) return featuredProjects[(index + 1) % featuredProjects.length]
  return [...projects, ...caseStudies].some(project => project.slug === slug) ? featuredProjects[0] : undefined
}
