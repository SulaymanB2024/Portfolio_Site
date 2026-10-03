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
    opening: 'A useful listing answers three questions: what is it, can I trust it, and what do I do next?',
    chapters: [
      {
        id: 'question',
        kicker: 'The problem',
        title: 'A listing is not yet a plan.',
        body: [
          'Recruiting information lives across employer pages, job boards, program guides, and calendars. Finding a role is the easy part. Knowing whether it is open, what a date means, and how to prepare takes another round of research.',
          'I founded InternshipDeadlines to bring discovery, employer context, preparation, and planning into one workflow. Historical records, unconfirmed details, and currently checked roles remain different states of knowledge.'
        ]
      },
      {
        id: 'system',
        kicker: 'Inside the product',
        title: 'Keep the source in sight.',
        body: [
          'I validate sources, normalize roles, retain provenance, and remove duplicates where the evidence supports it. Classification and query understanding connect a search to the company, location, and work behind a listing. The employer’s posting remains the application reference.',
          'Time needs the same care. A cutoff, program start, first observation, and verification date mean different things. An absent deadline stays unknown; it does not silently become “rolling.” A fresh page view does not refresh an old source check.'
        ],
        note: 'Directory coverage is not a count of verified open applications.'
      },
      {
        id: 'practice',
        kicker: 'The next step',
        title: 'Make the shortlist actionable.',
        body: [
          'A saved role gets a next action, personal target date, and notes. Employer research and preparation briefs help turn a promising result into a specific application.',
          'The offer tool compares paid hours, duration, living costs, relocation, and support. Missing amounts stay unknown; the balance is a before-tax planning estimate. Plans live in the browser, with a backup for moving them elsewhere.'
        ]
      }
    ],
    takeaway: 'Discovery should lead to a next step, with the evidence still in reach.',
    links: [
      {
        label: 'Explore InternshipDeadlines',
        href: 'https://internshipdeadlines.com/',
        description: 'Search roles, explore employers, and move from a listing to preparation and planning.'
      },
      {
        label: 'How the listings work',
        href: 'https://internshipdeadlines.com/methodology',
        description: 'The product’s source, timing, availability, and browser-storage definitions.'
      },
      {
        label: 'Compare two offers',
        href: 'https://internshipdeadlines.com/tools/offers',
        description: 'A practical comparison of pay, duration, support, and expected costs before tax.'
      }
    ]
  },
  sapien: {
    role: 'Growth Manager',
    lens: 'Research synthesis, positioning & communication',
    opening: 'Start with a decision a buyer recognizes. Explain the research that could help them make it.',
    chapters: [
      {
        id: 'question',
        kicker: 'My contribution',
        title: 'Give the capability a useful question.',
        body: [
          'A team choosing a concept, a marketer testing a message, and a buyer evaluating a price need different research. “AI insights” is too broad to tell any of them what they would get.',
          'I lead growth and positioning at Sapien: translating the platform into buyer questions, useful examples, articles, creative, and sales narratives. The product team builds the simulation platform. My work makes its capabilities and limits legible.'
        ]
      },
      {
        id: 'system',
        kicker: 'A closer look at the method',
        title: 'One audience. Two possibilities.',
        body: [
          'The team uses simulated audiences for surveys, interviews, and comparisons of products, messages, or prices. Reports connect aggregate results to segments and individual responses. The audience, alternatives, and question remain part of the output.',
          'In a published pricing example, the same modeled buyer profiles consider two prices. That pairing helps the team inspect differences within an audience. It describes a modeled choice under particular offers; it is not observed sales.'
        ],
        note: 'This is an explanation of Sapien’s published method, not a study I personally engineered.'
      },
      {
        id: 'practice',
        kicker: 'Research into communication',
        title: 'Make the story worth someone’s time.',
        body: [
          'My work spans research synthesis, editorial, search content, ad creative, and sales narratives. Academic work, validation studies, and competing methods help establish what a piece can support.',
          'A useful story gives a reader a question to follow, an example to inspect, and a reason it matters. The final claim must still carry the audience, comparison, and limits of the evidence behind it.'
        ]
      }
    ],
    takeaway: 'Choose a concrete question. Carry its evidence into the explanation.',
    links: [
      {
        label: 'Explore Sapien',
        href: 'https://www.asksapien.ai/',
        description: 'The company’s public explanation of simulated populations, research workflows, and buyer use cases.'
      },
      {
        label: 'Inspect a study example',
        href: 'https://www.asksapien.ai/blog/ai-market-research-tools',
        description: 'A published pricing comparison and an explanation of the audience, outputs, and evidence behind it.'
      },
      { label: 'My role at Sapien', href: '#/resume', description: 'The growth, positioning, research, and content work documented in my experience.' }
    ]
  },
  'investing-markets': {
    role: 'Finance student & independent researcher',
    lens: 'Ownership, contract rights & cash flow',
    opening: 'The physical asset is only the beginning. The interesting part is who holds the rights to it.',
    chapters: [
      {
        id: 'question',
        kicker: 'The research question',
        title: 'Who owns the road—and the revenue?',
        body: [
          'I study finance at UT Austin and investigate commercial questions through venture research and independent writing. I’m interested in the mechanism behind an attractive story: control, contractual rights, payment priority, and obligations.',
          'Texas toll roads make those distinctions tangible. A public titleholder, concession company, operator, lenders, and shareholders can all have different claims on one road. Calling them all “the owner” hides the economics.'
        ]
      },
      {
        id: 'system',
        kicker: 'A documented case',
        title: 'Read the order of payment.',
        body: [
          'Headline revenue is not money available to equity. Operating costs, maintenance, reserves, financing, and contractual payments sit between them. A useful model connects those assumptions to the actual agreement.',
          'SH 288 makes the priority concrete. When the state terminated the private concession, the federal financing record says the proceeds first repaid outstanding debt, with the remainder available to shareholders. One event exposed different claims on the same project.'
        ],
        note: 'The toll-road essay is dated, educational research. Missing information and assumptions remain identified.'
      },
      {
        id: 'practice',
        kicker: 'From documents to a thesis',
        title: 'Find the assumption that matters.',
        body: [
          'Traffic, pricing power, financing costs, and regulation can change a conclusion. I want a model to make those dependencies visible, rather than compress them into one polished estimate.',
          'The same approach informs work with early-stage companies: market research, pricing, financial models, and unit economics should answer a founder’s commercial question. Energy and digital assets offer other systems to study. These pages show my reasoning, not a portfolio performance record.'
        ]
      }
    ],
    takeaway: 'Understand the right. Trace the payment. Challenge the assumption.',
    links: [
      {
        label: 'Who owns Texas toll roads?',
        href: '#/markets/who-owns-texas-toll-roads',
        description: 'My source-led research on public ownership, concession rights, financing, and the economics of individual roads.'
      },
      {
        label: 'Read the SH 288 financing record',
        href: 'https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project',
        description: 'The federal project record describing the concession and the priority of debt repayment at termination.'
      },
      { label: 'Coursework & venture experience', href: '#/resume', description: 'Finance at UT Austin and commercial research with Jon Brumley Texas Venture Labs.' }
    ]
  },
  miscellaneous: {
    role: 'Independent building & creative experimentation',
    lens: 'Geometry, light & material',
    opening: 'Give an idea a form. Then see what that form reveals.',
    chapters: [
      {
        id: 'question',
        kicker: 'The experiment',
        title: 'Can a digital object feel tangible?',
        body: [
          'A three-dimensional shape can still feel flat. Silhouette, light, texture, scale, and movement decide what we see. This site is an ongoing experiment in making a page feel tactile while keeping it comfortable to read.',
          'The work sculptures are original procedural assets built for this site. Relief, openings, shafts, and local pivots give light and motion a structure to describe. Historical models and adapted generative work elsewhere keep their own attribution.'
        ]
      },
      {
        id: 'system',
        kicker: 'The material',
        title: 'Light becomes ink. Highlights become paper.',
        body: [
          'Ordered dithering translates tone into a repeatable pattern of marks. Here the dark marks carry the form and the highlights leave the page visible. The lighting and material need to survive that translation.',
          'Movement should reveal construction: a wheel turns around its shaft; a component moves around its pivot. It also needs a pause control and a settled view for reduced-motion preferences. The surrounding page remains the test.'
        ]
      },
      {
        id: 'practice',
        kicker: 'The working habit',
        title: 'Keep the parts that earn their place.',
        body: [
          'A silhouette must survive rotation and phone scale. Grain needs to hold up at different pixel densities and zoom levels. Sometimes the next improvement is less movement or a simpler form.',
          'CreativeTrace follows a similar habit: observe recurring patterns in public posts and video, then develop creative hypotheses to test. Those patterns do not promise engagement. Small research and automation tools make recurring work easier to inspect and revisit.'
        ],
        note: 'Original work sculptures and credited source artwork are separate bodies of work.'
      }
    ],
    takeaway: 'Build something you can react to. Refine what it teaches you.',
    links: [
      {
        label: 'Try the shader study',
        href: './shader.html',
        description: 'Explore the material and rendering experiment behind the site’s interest in light and ordered dithering.'
      },
      { label: 'Explore the writing', href: '#/writing', description: 'Research and essays paired with credited generative studies and their original source links.' },
      {
        label: 'A tool built around evidence',
        href: '#/work/atlas',
        description: 'Atlas connects a recurring website-research task to captured observations and inspectable findings.'
      }
    ]
  }
}
