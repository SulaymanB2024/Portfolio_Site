export type ProfileExperience = {
  organization: string;
  location: string;
  title: string;
  dates: string;
  publicSummary: string;
  bullets: readonly string[];
  visibility: 'public' | 'confidential-generic';
};

export type ProfileSkillGroup = {
  label: string;
  items: readonly string[];
};

export const PROFILE_FACTS = {
  name: 'Sulayman Bowles',
  currentSummary:
    'Sulayman Bowles is a UT Austin finance student and Growth & Product Intern at Chegg. He builds Atlas technical SEO software, runs Void Agency, and publishes research on AI systems, infrastructure, and ownership.',
  currentResearchWork: 'Growth and synthetic-research content work at Sapien, alongside source-led research on AI systems, infrastructure, and ownership.',
  musicBackground: 'Classical bass and composition remain part of my background. My current degree is the BBA in Finance at McCombs.',
  publicContact: { email: 'sulayman.bowles@gmail.com', phone: '512-827-9016' },
  positioning: 'Technical SEO, AI systems, and finance research.',
  education: {
    institution: 'The University of Texas at Austin',
    school: 'McCombs School of Business',
    location: 'Austin, TX',
    expectedGraduation: 'May 2028',
    degrees: [
      { degree: 'Bachelor of Business Administration', field: 'Finance' },
    ],
    coursework: ['Valuation', 'Investment Management', 'Intermediate Accounting', 'Business Analytics', 'Statistics'],
  },
  experience: [
    {
      organization: 'Chegg, Inc.',
      location: 'Austin, TX',
      title: 'Growth & Product Intern',
      dates: 'May 2026 — Present',
      publicSummary: 'Leads user-generated and scaled-content work, defining production priorities and growth experiments for student-facing products.',
      bullets: [
        'Builds content-intelligence workflows and prototypes voice-agent experiences with defined requirements, fallback behavior, and evaluation cases.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Confidential B2B manufacturer',
      location: 'Remote',
      title: 'SEO & Digital Marketing Analytics Intern',
      dates: 'May 2026 — Present',
      publicSummary: 'Builds GA4 and Search Console baselines and turns search, site, and messaging data into recurring decision support.',
      bullets: [
        'Reviews launch-site traffic, query performance, engagement, and user-flow diagnostics without disclosing company-identifying details or private outcomes.',
      ],
      visibility: 'confidential-generic',
    },
    {
      organization: 'Void Agency',
      location: 'Austin, TX',
      title: 'Founder',
      dates: 'Jan 2026 — Present',
      publicSummary: 'Founded a technical SEO and web-systems agency and reports $50K+ in collected revenue; private invoices are not public.',
      bullets: [
        'Built Atlas, a Python and SQLite audit system that crawls websites, maps internal links, classifies pages, flags technical issues, and exports structured reports.',
        'Turns crawl, metadata, schema, performance, and AI-search findings into prioritized implementation roadmaps for SMB clients.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Jon Brumley Texas Venture Labs',
      location: 'Austin, TX',
      title: 'Student Associate',
      dates: 'Sep 2025 — Present',
      publicSummary: 'Builds market, pricing, and financial models for early-stage companies and supports founder decision-making.',
      bullets: [
        'Synthesizes research into investor-style recommendations covering customer discovery, competitive positioning, unit economics, and go-to-market strategy.',
      ],
      visibility: 'public',
    },
    {
      organization: 'AI Visual Infrastructure Venture',
      location: 'Remote',
      title: 'Co-Founder',
      dates: 'Jan 2025 — Sep 2025',
      publicSummary: 'Co-founded an AI visual-services venture and reports $100K in collected revenue; private transaction records are not public.',
      bullets: [
        'Evaluated model-quality tradeoffs, creator workflows, pricing logic, and visual-asset positioning for AI-enabled creative services.',
      ],
      visibility: 'public',
    },
  ] satisfies readonly ProfileExperience[],
  awardsAndLeadership: [
    {
      organization: 'OnionDAO Hackathon',
      location: 'Chicago, IL',
      title: '1st Place, Team Lead',
      dates: 'Jun 2025',
      detail: 'Led a three-person team to build PayrollPro, a Solana payroll prototype with confidential transfers, multisig treasury controls, and treasury-risk logic.',
    },
    {
      organization: 'No Limit Holdings x Artemis Researchathon',
      location: 'Philadelphia, PA',
      title: 'Crypto Investment Research Prize Winner, Penn Blockchain Conference',
      dates: 'Mar 2026',
      detail: 'Prepared a digital-asset thesis using public token data, valuation logic, market-structure analysis, risk assessment, and execution planning.',
    },
    {
      organization: 'Student Government',
      location: 'Austin, TX',
      title: 'University-Wide Representative',
      dates: 'Mar 2025 — Present',
      detail: 'Elected university-wide representative coordinating student input through surveys, town halls, and cross-college outreach.',
    },
    {
      organization: 'Texas Blockchain',
      location: 'Austin, TX',
      title: 'Investment Team Analyst',
      dates: 'Sep 2025 — Present',
      detail: 'Researches digital assets and infrastructure protocols for student-run investment discussions.',
    },
  ],
  skillGroups: [
    { label: 'Technical skills', items: ['Python', 'SQL', 'JavaScript', 'SQLite', 'Tableau', 'Excel', 'PowerPoint'] },
    { label: 'Analytics & SEO', items: ['GA4', 'Google Search Console', 'technical SEO auditing', 'crawl analysis', 'structured reporting'] },
    { label: 'Product & research', items: ['Product briefs', 'competitive research', 'workflow analysis', 'market sizing', 'financial modeling'] },
    { label: 'AI & design tools', items: ['Claude Code', 'Cursor', 'Figma'] },
  ] satisfies readonly ProfileSkillGroup[],
  certifications: ['Google Data Analytics Professional Certificate', 'Google Project Management Professional Certificate', 'Bloomberg Market Concepts'],
  languages: ['Spanish (Intermediate)'],
  projects: [
    { name: 'Atlas SEO Audit Console', path: '/atlas', status: 'Implemented; public proof partial; active development' },
    { name: 'Void Agency', path: 'https://www.void-agency.com/', status: 'Operating' },
    { name: 'Can AI Run a Business? 30 AI Manager Cases', path: '/research/ai-systems/the-first-ai-managers', status: 'Published July 14, 2026' },
    { name: 'Texas toll-road ownership research', path: '/markets/who-owns-texas-toll-roads', status: 'Published July 11, 2026' },
  ],
  proofClaims: [
    { label: 'Atlas', claim: 'Crawl and evidence console with a reproducible public demonstration', asOf: '2026-07-16', publicSource: '/atlas/sample-crawl' },
    { label: 'Void Agency', claim: '$50K+ collected revenue — first-party claim; private invoices are not public', asOf: '2026-05-31', publicSource: null },
    { label: 'Chegg', claim: 'Growth & Product Intern — role and continuing dates stated in the September 2026 résumé; corroborating employer record is not linked', asOf: '2026-09-01', publicSource: null },
    { label: 'Public research', claim: 'AI systems, infrastructure, and investment research with source-led analysis', asOf: '2026-07-16', publicSource: '/research' },
  ],
  canonicalLinks: {
    home: 'https://sulayman-bowles.dev/',
    about: 'https://sulayman-bowles.dev/about',
    resume: 'https://sulayman-bowles.dev/resume',
    work: 'https://sulayman-bowles.dev/work',
    atlas: 'https://sulayman-bowles.dev/atlas',
    research: 'https://sulayman-bowles.dev/research',
    contact: 'https://sulayman-bowles.dev/contact',
    technicalLedger: 'https://sulayman-bowles.tech/',
    github: 'https://github.com/SulaymanB2024',
    linkedin: 'https://www.linkedin.com/in/sulayman-bowles/',
  },
  lastReviewed: '2026-09-10',
  nextRoleReview: '2026-10-01',
} as const;

export function formatIsoDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatEducation() {
  return PROFILE_FACTS.education.degrees.map((degree) => `${degree.degree} in ${degree.field}`).join('; ');
}
