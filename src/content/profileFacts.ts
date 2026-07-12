export const PROFILE_FACTS = {
  name: 'Sulayman Bowles',
  currentSummary:
    'Sulayman Bowles is a UT Austin McCombs student building Atlas, running Void Agency, and working across technical SEO, search systems, product, and finance research.',
  education: {
    institution: 'The University of Texas at Austin',
    school: 'McCombs School of Business',
    degree: 'Bachelor of Business Administration',
    field: 'Finance',
    graduation: 'May 2027',
  },
  roles: [
    {
      title: 'Founder',
      organization: 'Void Agency',
      dates: 'Dec 2025 — Present',
      path: '/void-agency',
    },
    {
      title: 'AI Product Manager Intern',
      organization: 'Chegg, Office of the Chief Product Officer',
      dates: 'May 2026 — Aug 2026',
      path: '/resume',
    },
    {
      title: 'Technical SEO Analytics',
      organization: 'Private engagement',
      dates: 'May 2026 — Present',
      path: '/resume',
    },
    {
      title: 'Student Associate',
      organization: 'Jon Brumley Texas Venture Labs',
      dates: 'Sep 2025 — Present',
      path: '/resume',
    },
  ],
  projects: [
    { name: 'Atlas SEO Audit Console', path: '/atlas', status: 'Core workflow shipped; active development' },
    { name: 'Void Agency', path: '/void-agency', status: 'Operating' },
    { name: 'Texas toll-road ownership research', path: '/markets/who-owns-texas-toll-roads', status: 'Published July 11, 2026' },
    { name: 'ViralBench + Codex harness design', path: '/viralbench-codex-agent-harness', status: 'Published July 9, 2026' },
  ],
  proofClaims: [
    {
      label: 'Atlas',
      claim: 'Crawl and evidence console with a public sanitized run',
      asOf: '2026-07-12',
      publicSource: '/atlas/sample-crawl',
    },
    {
      label: 'Void Agency',
      claim: '$50K+ collected revenue',
      asOf: '2026-05-31',
      publicSource: '/resume',
    },
    {
      label: 'Chegg',
      claim: 'AI Product Manager Intern, Office of the Chief Product Officer',
      asOf: '2026-07-12',
      publicSource: '/resume',
    },
    {
      label: 'SEO analytics',
      claim: 'GA4, Search Console, launch baselines, and prioritized recommendations',
      asOf: '2026-07-12',
      publicSource: '/resume',
    },
    {
      label: 'Texas Venture Labs',
      claim: 'Student Associate working on validation, unit economics, GTM, and financial models',
      asOf: '2026-07-12',
      publicSource: '/resume',
    },
    {
      label: 'Public research',
      claim: 'Texas toll-road ownership, operators, and economics',
      asOf: '2026-07-11',
      publicSource: '/markets/who-owns-texas-toll-roads',
    },
  ],
  canonicalLinks: {
    home: 'https://sulayman-bowles.dev/',
    about: 'https://sulayman-bowles.dev/about',
    resume: 'https://sulayman-bowles.dev/resume',
    work: 'https://sulayman-bowles.dev/work',
    atlas: 'https://sulayman-bowles.dev/atlas',
    research: 'https://sulayman-bowles.dev/research',
    contact: 'https://sulayman-bowles.dev/contact',
    aiInformation: 'https://sulayman-bowles.dev/ai-information',
    technicalLedger: 'https://sulayman-bowles.tech/',
    github: 'https://github.com/SulaymanB2024',
    linkedin: 'https://www.linkedin.com/in/sulayman-bowles/',
  },
  lastReviewed: '2026-07-12',
  nextRoleReview: '2026-08-31',
} as const;

export function formatIsoDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
