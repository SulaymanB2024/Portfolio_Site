import type { OutreachCompanyContext } from '../outreach-context'
import { renderRecruiterLanding } from './landing'

export default function RecruiterLandingPage({ company }: { company: OutreachCompanyContext }) {
  return <div dangerouslySetInnerHTML={{ __html: renderRecruiterLanding(company) }} />
}
