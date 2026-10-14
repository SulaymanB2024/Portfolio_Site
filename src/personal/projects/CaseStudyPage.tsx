import type { CaseStudy } from './case-studies'
import { caseNarratives } from './case-narratives'
import ProjectDetailPage from './ProjectDetailPage'

export default function CaseStudyPage({ study, dark }: { study: CaseStudy; dark: boolean }) {
  const title = study.slug === 'viralbench' ? <>ViralBench<br />+ Codex</> : study.name
  return <ProjectDetailPage slug={study.slug} title={title} document={caseNarratives[study.slug]} dark={dark} caseStudy />
}
