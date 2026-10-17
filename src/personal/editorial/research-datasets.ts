// Describe the existing public tables, not the companies or an inferred return.
// Reuse terms are unspecified; public access does not grant an open license.
export interface ResearchDataset {
  name: string
  label: string
  description: string
  href: string
}

export const researchDatasets: Record<string, ResearchDataset[]> = {
  'who-owns-texas-toll-roads': [{
    name: 'Texas toll-road ownership snapshot — July 2026',
    label: 'Texas toll-road ownership CSV',
    description: 'Nine dated toll-system and concession records distinguish physical owner, operator, revenue claimant, concession term and billing agency. This July 23, 2026 educational snapshot is not a comprehensive statewide facility inventory; source IDs refer to the article’s source ledger.',
    href: '/research/texas-toll-road-ownership-2026.csv',
  }],
  'software-buyout-boom-2020-2022-exit-audit': [{
    name: 'Software buyout cohort — 2020–2022 announcements',
    label: 'Row-level cohort',
    description: 'Twenty-five classified transactions with announcement year, headline value, sponsor group, current-control summary, and outcome category.',
    href: '/research/software-buyout-cohort-2020-2022.csv',
  }],
  'who-owns-austin-home-service-companies': [{
    name: 'Austin home-service ownership brand table — 2026',
    label: 'Austin ownership brand table',
    description: 'The normalized brand-level table behind the 67-brand snapshot, including owner type, chain, evidence rating, and Austin footprint.',
    href: '/research/austin-home-service-ownership-2026.csv',
  }],
}
