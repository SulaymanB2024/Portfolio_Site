import originalProfile from './editorial/data/profile.json'

// Public prose updated from the September 30, 2026 résumés. The original
// profile/PDF remain historical source artifacts; private source links stay
// in evidence/copy/sources.json rather than the client bundle.
export const resumeReview = {
  asOf: '2026-09-30',
  introduction: 'I build products, research commercial questions, and turn complex data into systems people can use. My work spans AI, growth, and the web—at Chegg and Sapien, through VOID, and in projects of my own.',
  educationNote: 'Finance at UT Austin, with a practice in music and composition alongside it.',
  pdfLabel: 'Download July résumé',
  pdfNote: 'The PDF preserves my July 2026 résumé. This page reflects experience documented in September 2026.',
}

export const resumeProfile = {
  ...originalProfile,
  currentSummary: 'Sulayman Bowles is a UT Austin finance student working in product and growth at Chegg, leading growth and positioning at Sapien, running VOID, and building independent tools including InternshipDeadlines and Atlas.',
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
      publicSummary: 'Work on internship discovery, student research, and AI tools, connecting product development with growth.',
      bullets: [
        'Build and validate recruiting-data pipelines with product, engineering, data science, and marketing teams.',
        'Use embeddings and machine learning to study public social posts and turn student needs into growth experiments.',
        'Built an AI mock interviewer with adaptive follow-ups, conversation memory, recovery from failures, and feedback.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Sapien',
      location: 'Remote',
      title: 'Growth Manager',
      dates: 'Aug 2026 — Present',
      publicSummary: 'Lead growth and positioning for an AI market-research platform built around simulated populations.',
      bullets: [
        'Translate product capabilities into buyer use cases for pricing, concept testing, messaging, and consumer research.',
        'Built the SEO and content function across editorial work, category pages, ad creative, and sales narratives.',
        'Synthesize research and validation studies into clear claims, useful examples, and answers to buyer questions.',
      ],
      visibility: 'public',
    },
    {
      organization: 'VOID Agency',
      location: 'Austin, TX',
      title: 'Founder',
      dates: 'Jan 2026 — Present',
      publicSummary: 'Founded a consulting practice covering growth strategy, financial analysis, AI workflows, and website systems.',
      bullets: [
        'Translate business problems into operating plans and working tools for SMB and technology clients.',
        'Built the practice to $50K+ in collected revenue.',
        'Built Atlas, a Python and SQLite console that connects website crawls, technical findings, and the evidence behind them.',
      ],
      visibility: 'public',
    },
    {
      organization: 'InternshipDeadlines',
      location: 'Austin, TX',
      title: 'Founder & Product Lead',
      dates: 'Sep 2026 — Present',
      publicSummary: 'Built and launched an internship-discovery and application-planning product for students.',
      bullets: [
        'Designed a pipeline to validate sources, normalize role records, remove duplicates, and retain provenance.',
        'Use local language models for role classification and query understanding, alongside search ranking and relevance work.',
        'Connect internship search with employer research, preparation resources, and tools for comparing costs and offers.',
      ],
      visibility: 'public',
    },
    {
      organization: 'CreativeTrace',
      location: 'Remote',
      title: 'Creator, AI Creative Experimentation',
      dates: 'Jul 2026 — Present',
      publicSummary: 'Explore how creative patterns in public posts can inform concepts worth testing.',
      bullets: [
        'Combine post analysis and video understanding to group recurring creative and engagement patterns.',
        'Turn observations into hypotheses and draft concepts, keeping a path back to the source material.',
      ],
      visibility: 'public',
    },
    {
      organization: 'Jon Brumley Texas Venture Labs',
      location: 'Austin, TX',
      title: 'Student Associate',
      dates: 'Sep 2025 — Present',
      publicSummary: 'Research commercial questions for early-stage companies and turn the findings into recommendations founders can use.',
      bullets: [
        'Build market, pricing, and financial models to examine positioning, unit economics, and routes to market.',
      ],
      visibility: 'public',
    },
    {
      organization: 'AI Image Generation Startup',
      location: 'Remote',
      title: 'Co-Founder, Product & Go-to-Market',
      dates: 'Jan 2025 — Sep 2025',
      publicSummary: 'Co-founded an AI image-generation venture on Bittensor, working across product, pricing, architecture, and launch strategy.',
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
      detail: 'Recognition for a submission to Coinbase’s institutional client strategy challenge.',
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
      detail: 'Led a three-person team to build PayrollPro, a Solana payroll prototype exploring confidential transfers, shared treasury controls, and treasury risk.',
    },
    {
      ...originalProfile.awardsAndLeadership[1],
      title: 'Researchathon Winner',
      detail: 'Developed a digital-asset investment thesis using public data, valuation, market structure, risk analysis, and an execution plan.',
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
      detail: 'Participate in the energy-trading cohort, alongside an interest in energy markets and infrastructure.',
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
