import { useMemo } from 'react'
import HomePage from '../HomePage'
import type { OutreachCompanyContext } from '../outreach-context'
import { recruiterOpening } from './landing'

export default function RecruiterLandingPage({ company, dark, onLandingActiveChange }: { company: OutreachCompanyContext; dark: boolean; onLandingActiveChange: (active: boolean) => void }) {
  const opening = useMemo(() => recruiterOpening(company), [company.slug, company.name])
  return <HomePage dark={dark} onLandingActiveChange={onLandingActiveChange} opening={opening} />
}
