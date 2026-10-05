import originalProfile from './editorial/data/profile.json' with { type: 'json' }

// Public prose updated from the September 30, 2026 résumés. The original
// profile/PDF remain historical source artifacts; private source links stay
// in evidence/copy/sources.json rather than the client bundle.
export const resumeReview = {
  asOf: '2026-09-30',
  introduction: 'I work in product, growth, and commercial research at Chegg, Sapien, and VOID, and build independent products.',
  educationNote: 'I study finance at UT Austin, compose, and play double bass.',
  pdfLabel: 'Download July résumé',
  pdfNote: 'July 2026 PDF · September 2026 web résumé.',
}

export const resumeProfile = {
  ...originalProfile,
  currentSummary: 'Sulayman Bowles studies finance at UT Austin, works in product and growth at Chegg, leads growth at Sapien, and runs VOID. His products include InternshipDeadlines and Atlas.',
  positioning: 'Product, growth, AI, and research.',
  education: {
    ...originalProfile.education,
    // The newer résumés list Finance. Music activity belongs in the biography;
    // omission of the older BA listing does not establish a degree withdrawal.
    degrees: [{ degree: 'Bachelor of Business Administration', field: 'Finance' }],
  },
  experience: [
    {
      organization: 'Chegg, Inc.',
      location: 'Austin, TX / Remote',
      title: 'Product Intern, Growth — Internships.com',
      dates: 'May 2026 — Present',
      publicSummary: 'Develop internship-search workflows and AI tools through student research.',
      bullets: [
        'Build and validate recruiting-data pipelines with product, engineering, data science, and marketing teams.',
        'Analyze public social posts with embeddings and machine learning to inform student-focused growth experiments.',
        'Built an AI mock interviewer with adaptive follow-ups, conversation memory, failure recovery, and feedback.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Sapien',
      location: 'Remote',
      title: 'Growth Manager',
      dates: 'Aug 2026 — Present',
      publicSummary: 'Lead growth and positioning for a market research platform using simulated audiences.',
      bullets: [
        'Develop buyer use cases for pricing, concept testing, messaging, and consumer research.',
        'Built the SEO and content function: editorial, category pages, ad creative, and sales material.',
        'Review research and validation studies to explain use cases, findings, and limits.',
      ],
      visibility: 'public',
    },
    {
      organization: 'VOID Agency',
      location: 'Austin, TX',
      title: 'Founder',
      dates: 'Jan 2026 — Present',
      publicSummary: 'Founded a consultancy for growth strategy, financial analysis, AI workflows, and web systems.',
      bullets: [
        'Develop operating plans and software tools for small businesses and technology clients.',
        'Collected $50K+ in revenue.',
        'Built Atlas, a Python and SQLite console connecting website crawls, findings, and evidence.',
      ],
      visibility: 'public',
    },
    {
      organization: 'InternshipDeadlines',
      location: 'Austin, TX',
      title: 'Founder & Product Lead',
      dates: 'Sep 2026 — Present',
      publicSummary: 'Built and launched a student product for internship search and application planning.',
      bullets: [
        'Designed a pipeline for source validation, listing normalization, deduplication, and provenance.',
        'Combine local language models for role classification and query understanding with search ranking.',
        'Connect internship search with employer research, preparation, and cost and offer comparisons.',
      ],
      visibility: 'public',
    },
    {
      organization: 'CreativeTrace',
      location: 'Remote',
      title: 'Creator, AI Creative Experimentation',
      dates: 'Jul 2026 — Present',
      publicSummary: 'Develop creative concepts from patterns in public posts and video.',
      bullets: [
        'Analyze public posts and video for recurring creative and engagement patterns.',
        'Develop hypotheses and draft concepts linked to their sources.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Jon Brumley Texas Venture Labs',
      location: 'Austin, TX',
      title: 'Student Associate',
      dates: 'Sep 2025 — Present',
      publicSummary: 'Research markets, pricing, and unit economics for early-stage companies.',
      bullets: [
        'Build market, pricing, and financial models to recommend positioning and routes to market.',
      ],
      visibility: 'public',
    },
    {
      organization: 'AI Image Generation Startup',
      location: 'Remote',
      title: 'Co-Founder, Product & Go-to-Market',
      dates: 'Jan 2025 — Sep 2025',
      publicSummary: 'Co-founded an AI image-generation venture on Bittensor, spanning product, pricing, architecture, and launch.',
      bullets: [
        'Grew the venture to $100K in revenue.',
        'Owned product requirements, pricing, technical architecture, and go-to-market materials.',
      ],
      visibility: 'public',
    },
  ],
  awardsAndLeadership: [
    {
      organization: 'Coinbase Institutional Client Strategy Challenge',
      location: '',
      title: 'Selected among 20 winning submissions',
      dates: 'Jun 2026',
      detail: 'Institutional client strategy submission.',
    },
    {
      organization: 'Jane Street Monthly Puzzle',
      location: '',
      title: 'Correct Solver',
      dates: 'Jul 2026',
      detail: 'Listed among the correct solvers of “Pent Up Frustration 3: Knight Moves 7.”',
    },
    {
      ...originalProfile.awardsAndLeadership[0],
      detail: 'Led a three-person team building PayrollPro, a Solana prototype for confidential payroll, shared treasury control, and treasury risk.',
    },
    {
      ...originalProfile.awardsAndLeadership[1],
      title: 'Researchathon Winner',
      detail: 'Developed a digital-asset thesis with public data, valuation, market structure, risk analysis, and an execution plan.',
    },
    {
      ...originalProfile.awardsAndLeadership[2],
      detail: 'Represent student perspectives through surveys, town halls, and outreach across colleges.',
    },
    {
      ...originalProfile.awardsAndLeadership[3],
      detail: 'Research digital assets and infrastructure protocols for student investment discussions.',
    },
    {
      organization: 'UTEXAS Energy Trading',
      location: 'Austin, TX',
      title: 'Cohort Member',
      dates: 'Listed Sep 2026',
      detail: 'Participate in the energy-trading cohort.',
    },
  ],
  skillGroups: [
    { label: 'Building', items: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'SQLite', 'Web systems'] },
    { label: 'Data & analytics', items: ['Data validation', 'Embeddings', 'Classification & retrieval', 'GA4', 'Google Search Console', 'Excel', 'Tableau'] },
    { label: 'Product & commercial work', items: ['Product positioning', 'Growth strategy', 'Financial analysis', 'Pricing', 'Consumer insights', 'Market research'] },
    { label: 'Research & creative work', items: ['Research synthesis', 'AI workflows', 'Technical SEO', 'Writing', 'Figma', 'Creative experimentation'] },
  ],
  projects: [
    { name: 'InternshipDeadlines', path: 'https://internshipdeadlines.com/', status: 'Launched; active development' },
    { name: 'Sapien', path: 'https://www.asksapien.ai/', status: 'Growth and positioning' },
    ...originalProfile.projects,
    { name: 'CreativeTrace', path: '#/work/miscellaneous', status: 'Research and experimentation' },
  ],
  // Older July proof claims remain in the original source, not the new profile.
  proofClaims: [],
  lastReviewed: resumeReview.asOf,
}
