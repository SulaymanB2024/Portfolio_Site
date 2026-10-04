export interface WorkNarrative {
  role: string
  lens: string
  opening: string
  chapters: {
    id: string
    kicker: string
    title: string
    body: string[]
    note?: string
  }[]
  takeaway: string
  links: { label: string; href: string; description: string }[]
}

/** Curated project narratives; factual boundaries: evidence/work-narratives/SOURCES.md. */
export const workNarratives: Record<string, WorkNarrative> = {
  internshipdeadlines: {
    role: 'Founder & product lead',
    lens: 'Discovery, source quality & application planning',
    opening: 'Find the role. Check the source. Plan the application.',
    chapters: [
      {
        id: 'question',
        kicker: 'The problem',
        title: 'A listing is not yet a plan.',
        body: [
          'Employer pages, job boards, program guides, and calendars scatter recruiting information. Finding a role leaves three tasks: check its availability, interpret its dates, and prepare.',
          'I founded InternshipDeadlines to connect search, employer research, and application planning. Listings distinguish historical records, unconfirmed details, and recent source checks.'
        ]
      },
      {
        id: 'system',
        kicker: 'Inside the product',
        title: 'A search result you can check.',
        body: [
          'I validate sources, standardize listings, and deduplicate when evidence supports a match, retaining provenance. Classification and query understanding match searches to roles, companies, and locations. The employer’s posting remains the application reference.',
          'Deadlines, program starts, first observations, and source checks are distinct dates. An absent deadline stays unknown, not “rolling.” Viewing a page does not refresh its source check.'
        ],
        note: 'A role in the directory is not necessarily a verified open application.'
      },
      {
        id: 'practice',
        kicker: 'The next step',
        title: 'Give each saved role a next step.',
        body: [
          'Each saved role has a next action, personal target date, and notes. Employer research and preparation briefs support the application.',
          'Compare offers by paid hours, duration, living costs, relocation, and support. Missing amounts stay unknown; the balance is a before-tax estimate. Plans are stored in the browser and can be backed up.'
        ]
      }
    ],
    takeaway: 'A shortlist becomes a plan when every role has a source and a next step.',
    links: [
      {
        label: 'Explore InternshipDeadlines',
        href: 'https://internshipdeadlines.com/',
        description: 'Search roles, research employers, and plan applications.'
      },
      {
        label: 'How the listings work',
        href: 'https://internshipdeadlines.com/methodology',
        description: 'Source, date, availability, and storage definitions.'
      },
      {
        label: 'Compare two offers',
        href: 'https://internshipdeadlines.com/tools/offers',
        description: 'Compare pay, duration, support, and costs before tax.'
      }
    ]
  },
  sapien: {
    role: 'Growth Manager',
    lens: 'Research synthesis, positioning & communication',
    opening: 'Help a buyer see what the research could answer—and what it cannot.',
    chapters: [
      {
        id: 'question',
        kicker: 'My contribution',
        title: 'Explain what a buyer could test.',
        body: [
          'Concept testing, messaging, and pricing require different research. A buyer needs to know which question the platform can answer.',
          'I lead growth and positioning at Sapien, explaining use cases through articles, examples, ad creative, and sales material. The product team builds the platform; I explain its applications and limits.'
        ]
      },
      {
        id: 'system',
        kicker: 'A closer look at the method',
        title: 'Compare two offers with the same audience.',
        body: [
          'Sapien uses simulated audiences for surveys, interviews, and product, message, or price comparisons. Reports connect aggregate results to segments and individual responses, retaining the audience, alternatives, and question.',
          'A published pricing example asks the same modeled buyer profiles to consider two prices. The comparison captures modeled choices under those offers, not observed sales.'
        ],
        note: 'This example explains Sapien’s published method. I did not engineer the study.'
      },
      {
        id: 'practice',
        kicker: 'Research into communication',
        title: 'From research to an explanation.',
        body: [
          'I review academic work, validation studies, and competing methods to determine what a finding supports before writing an article, explainer, or sales narrative.',
          'Each piece states the question, examines an example, and explains the result. I preserve the audience, comparison, and limits so modeled responses are not mistaken for observed behavior.'
        ]
      }
    ],
    takeaway: 'A buyer should leave knowing what to test and how to interpret the result.',
    links: [
      {
        label: 'Explore Sapien',
        href: 'https://www.asksapien.ai/',
        description: 'Simulated populations, research workflows, and buyer use cases.'
      },
      {
        label: 'Inspect a study example',
        href: 'https://www.asksapien.ai/blog/ai-market-research-tools',
        description: 'A pricing comparison with its audience, outputs, and supporting evidence.'
      },
      { label: 'My role at Sapien', href: '#/resume', description: 'Growth, positioning, research, and content responsibilities.' }
    ]
  },
  'investing-markets': {
    role: 'Finance student & independent researcher',
    lens: 'Ownership, contract rights & cash flow',
    opening: 'One road can have a public owner, a private operator, and several competing claims on its revenue.',
    chapters: [
      {
        id: 'question',
        kicker: 'The research question',
        title: 'Who owns the road—and the revenue?',
        body: [
          'I study finance at UT Austin. My venture research and independent writing examine investment rights: control, payment priority, and obligations.',
          'One Texas toll road can have a public titleholder, concession company, operator, lenders, and shareholders. Their claims differ; calling them all “the owner” obscures the economics.'
        ]
      },
      {
        id: 'system',
        kicker: 'A documented case',
        title: 'Revenue is not cash available to equity.',
        body: [
          'Operating costs, maintenance, reserves, financing, and contractual payments come before cash available to equity. A model must connect those obligations to the agreement.',
          'When Texas terminated SH 288’s private concession, proceeds first repaid outstanding debt; the remainder was available to shareholders, according to the federal financing record.'
        ],
        note: 'Dated educational research, with assumptions and missing information identified.'
      },
      {
        id: 'practice',
        kicker: 'From documents to a thesis',
        title: 'Test what could change the conclusion.',
        body: [
          'Traffic, pricing power, financing costs, and regulation can change a conclusion. A model should expose those dependencies.',
          'In venture work, I use market research, pricing, financial models, and unit economics to answer founders’ commercial questions. I also study energy and digital assets. These pages document research, not portfolio performance.'
        ]
      }
    ],
    takeaway: 'Ownership tells you who holds the asset. The contract tells you who gets paid.',
    links: [
      {
        label: 'Who owns Texas toll roads?',
        href: '#/markets/who-owns-texas-toll-roads',
        description: 'Public ownership, concession rights, financing, and road economics.'
      },
      {
        label: 'Read the SH 288 financing record',
        href: 'https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project',
        description: 'The federal record of the concession and debt repayment at termination.'
      },
      { label: 'Coursework & venture experience', href: '#/resume', description: 'UT Austin finance and Jon Brumley Texas Venture Labs.' }
    ]
  },
  miscellaneous: {
    role: 'Independent building & creative experimentation',
    lens: 'Geometry, light & material',
    opening: 'Studies in light, material, and movement, made to be explored.',
    chapters: [
      {
        id: 'question',
        kicker: 'The experiment',
        title: 'Can a digital object feel tangible?',
        body: [
          'Light and movement reveal a shape’s silhouette and surface. This site tests how they can make a page feel tactile while preserving readability.',
          'I built the work sculptures procedurally, using relief, openings, shafts, and pivots to give light and motion structure. Historical models and adapted generative art retain their attribution.'
        ]
      },
      {
        id: 'system',
        kicker: 'The material',
        title: 'Light becomes ink. Highlights become paper.',
        body: [
          'Ordered dithering translates tone into patterned marks. Dark marks define the form; highlights reveal the page. Lighting and material must survive that translation.',
          'Motion should reveal construction: wheels turn around shafts; components follow pivots. Pause controls and settled views accommodate reduced-motion preferences.'
        ]
      },
      {
        id: 'practice',
        kicker: 'The working habit',
        title: 'Refine it at the scale people use.',
        body: [
          'Silhouettes must remain readable through rotation and at phone scale; grain must withstand changes in pixel density and zoom. Less motion or simpler geometry can help.',
          'CreativeTrace develops testable hypotheses from patterns in public posts and video. Those patterns do not promise engagement. Other research and automation tools support recurring tasks.'
        ],
        note: 'The work sculptures are original; other source artwork is credited.'
      }
    ],
    takeaway: 'The study works when its form remains readable in motion and at rest.',
    links: [
      {
        label: 'Try the shader study',
        href: './shader.html',
        description: 'Explore the lighting and ordered-dither material.'
      },
      { label: 'Explore the writing', href: '#/writing', description: 'Essays paired with credited generative art.' },
      {
        label: 'A tool built around evidence',
        href: '#/work/atlas',
        description: 'Website audits connected to captured pages and findings.'
      }
    ]
  }
}
