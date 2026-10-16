import type { Project } from '../content'
import { workNarratives } from './work-narratives'
import ProjectDetailPage from './ProjectDetailPage'

export default function ProjectNarrativePage({ project, dark }: { project: Project; dark: boolean }) {
  const title = project.slug === 'internshipdeadlines' ? <>Internship<wbr />Deadlines</> : project.slug === 'investing-markets' ? 'Markets' : project.name
  return <ProjectDetailPage slug={project.slug} title={title} document={workNarratives[project.slug]} dark={dark} />
}
