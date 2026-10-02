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

/** Public project context and authored research, with claim boundaries in evidence/work-narratives/SOURCES.md. */
export const workNarratives: Record<string, WorkNarrative> = {
  internshipdeadlines: {
    role: 'Founder & product lead',
    lens: 'Source → role → application plan',
    opening: 'An opportunity becomes useful when you know what it means, where it came from, and what to do next.',
    chapters: [
      {
        id: 'question',
        kicker: 'The student’s problem',
        title: 'Finding the listing is only the beginning.',
        body: [
          'A student can find a promising role and still have basic questions: Is the application open? Does this date describe the deadline or the internship itself? What does the employer actually require? Recruiting information is spread across company pages, job boards, program guides, and calendars. Bringing it together creates a second problem: making the resulting record trustworthy.',
          'I founded InternshipDeadlines to connect that research to a practical next step. The product brings discovery, employer context, preparation, and planning into one workflow. Its directory includes historical records and unconfirmed details as well as currently checked roles. Those are different states of knowledge; the interface needs to make the difference understandable before someone invests time in an application.',
        ],
      },
      {
        id: 'system',
        kicker: 'The information underneath',
        title: 'Keep a path back to the employer.',
        body: [
          'My work starts with the records: validate sources, normalize role information, remove duplicates where the evidence supports it, and retain provenance. Classification and query understanding help connect a student’s search to the work, company, and location behind a listing. A useful result should still let the student return to the employer’s original posting and check the requirements there.',
          'Time is part of the record. An application cutoff, program start date, first observation, and source verification answer different questions. A missing deadline stays unconfirmed; it does not become a rolling deadline by default. Likewise, a fresh page view does not make an old source check current. Search can bring information together while preserving these distinctions, rather than flattening every role into a reassuring card.',
        ],
        note: 'Directory coverage and verified availability are separate measures. The employer’s current posting remains the application reference.',
      },
      {
        id: 'practice',
        kicker: 'From a result to a decision',
        title: 'Build a shortlist you can act on.',
        body: [
          'The application plan gives a saved role a next action, a personal target date, and notes. Employer research and preparation briefs help turn interest into a more specific application. This matters because a search result can be relevant without being the right opportunity for a particular student’s eligibility, circumstances, or goals.',
          'The planning tools extend the same idea to costs and offers. Two hourly rates tell only part of the story: placement length, paid hours, living costs, relocation, and support change the comparison. The offer tool makes those inputs visible and keeps missing amounts unknown. Its balance is a before-tax planning estimate, to consider alongside the work and mentorship. Saved application plans live in the browser; a backup carries them to another browser without implying an account or automatic sync.',
        ],
      },
    ],
    takeaway: 'Make discovery clear enough to become a plan—and keep the evidence visible along the way.',
    links: [
      { label: 'Explore InternshipDeadlines', href: 'https://internshipdeadlines.com/', description: 'Search roles, explore employers, and move from a listing to preparation and planning.' },
      { label: 'How the listings work', href: 'https://internshipdeadlines.com/methodology', description: 'The product’s source, timing, availability, and browser-storage definitions.' },
      { label: 'Compare two offers', href: 'https://internshipdeadlines.com/tools/offers', description: 'A practical comparison of pay, duration, support, and expected costs before tax.' },
    ],
  },
  sapien: {
    role: 'Growth Manager',
    lens: 'Business question → simulated audience → useful story',
    opening: 'A research result matters when someone can understand the decision it helps them make.',
    chapters: [
      {
        id: 'question',
        kicker: 'Start with the buyer’s decision',
        title: 'What are we trying to choose?',
        body: [
          'A product team may be deciding between concepts. A marketer may need a message for a particular audience. A pricing question may turn on the trade-off between a broader buyer base and the margin of an offer. These are concrete decisions with different research needs. Describing every one of them as “AI insights” makes it harder to understand what the work would actually deliver.',
          'I lead growth and positioning at Sapien. My contribution is to connect the platform to those buyer questions: explain the capability, develop useful examples, and make the research legible through content and commercial narratives. The product team builds the simulation platform; my work is on the research, positioning, and communication that help people understand where it can be useful.',
        ],
      },
      {
        id: 'system',
        kicker: 'The audience behind the answer',
        title: 'Keep the question and its evidence together.',
        body: [
          'Sapien builds simulated audiences grounded in population, purchase, behavioral, and research evidence. Its team uses those audiences for surveys, qualitative interviews, and comparisons of products, messages, or prices. Reports connect aggregate results to segment differences and individual responses. The audience definition, alternatives, and question are part of what makes an output interpretable.',
          'A published pricing example makes this concrete: the same modeled buyer profiles consider two prices, allowing the team to inspect the change within each audience. That is a modeled comparison under particular offers, rather than observed sales. For my work, this distinction is central to the story. Readers should be able to see what was compared, whose response it describes, and what additional evidence a real decision would require.',
        ],
        note: 'Simulated responses and observed customer behavior remain different evidence. Published examples belong to Sapien; they are not presented as studies I personally engineered.',
      },
      {
        id: 'practice',
        kicker: 'Research into communication',
        title: 'Make the idea useful in another person’s work.',
        body: [
          'My role spans research synthesis, editorial work, search content, ad creative, and sales narratives. Academic work, validation studies, and competing methods provide context for the claims a piece can support. Articles and recorded explainers then give the reader a question to follow, an example to inspect, and a reason the finding matters.',
          'That translation requires judgment. A technically interesting result may need a clearer audience or a more specific decision before it becomes a useful example. A striking headline needs the study context behind it. I want a buyer to finish a piece understanding what they could bring to the team, what a study might return, and how to examine the answer. The work is as much about choosing the right question and framing the result as it is about making the product visible.',
        ],
      },
    ],
    takeaway: 'Turn a capability into a question someone recognizes, then carry the evidence all the way into the story.',
    links: [
      { label: 'Explore Sapien', href: 'https://www.asksapien.ai/', description: 'The company’s public explanation of simulated populations, research workflows, and buyer use cases.' },
      { label: 'Inspect a study example', href: 'https://www.asksapien.ai/blog/ai-market-research-tools', description: 'A published pricing comparison and an explanation of the audience, outputs, and evidence behind it.' },
      { label: 'My role at Sapien', href: '#/resume', description: 'The growth, positioning, research, and content work documented in my experience.' },
    ],
  },
  'investing-markets': {
    role: 'Finance student & independent researcher',
    lens: 'Ownership → cash flow → risk',
    opening: 'A market story becomes more interesting when you follow the rights and obligations underneath it.',
    chapters: [
      {
        id: 'question',
        kicker: 'Look beneath the headline',
        title: 'What does “owning” the asset mean?',
        body: [
          'I study finance at UT Austin and work on commercial questions through venture research and independent writing. I’m interested in the distance between an attractive story and the mechanism that would make it work. Who controls the decision? What right does an investor actually hold? Which party receives the cash, and which obligation comes with it?',
          'My Texas toll-road research is a concrete example. A road can involve a public titleholder, a concession company with contractual revenue rights, an operator, lenders, and shareholders. Describing the whole arrangement with a single owner obscures the economics. Mapping the relationships gives the reader a way to distinguish the physical asset from the claims on its revenue and the responsibilities for keeping it operating.',
        ],
      },
      {
        id: 'system',
        kicker: 'Follow the payment',
        title: 'Revenue reaches different people in a different order.',
        body: [
          'A cash-flow model becomes more useful when its assumptions connect to documents. Operating costs, maintenance, reserves, financing, and contractual payments can sit between headline revenue and money available to equity. The relevant question is how that sequence changes under the actual agreement, including the rights that apply when a project is refinanced, sold, or terminated.',
          'SH 288 illustrates why the order matters. The state’s termination of its private concession triggered a contractual payment; the federal financing record says the proceeds first repaid outstanding debt, with the remainder available to shareholders. Different claims on the same project therefore had different exposures to the event. My research uses cases like this to connect ownership diagrams, contract terms, and financial statements, while keeping documented facts separate from calculations and unresolved details.',
        ],
        note: 'The linked toll-road essay is dated, educational research. It documents sources, assumptions, and information that remains unavailable.',
      },
      {
        id: 'practice',
        kicker: 'Work on the assumption',
        title: 'What could change the conclusion?',
        body: [
          'A thesis can depend on traffic, pricing power, financing costs, customer retention, or a regulatory constraint. I’m interested in identifying which assumption carries the most weight and what evidence would strengthen or weaken it. A model should make those dependencies easier to examine, rather than conceal them behind a single polished estimate.',
          'The same habit carries into work with early-stage companies: market research, pricing, financial models, and unit economics need to answer a founder’s commercial question. My interests in energy markets and digital assets add other systems to study, with different physical constraints, incentives, and market structures. This collection presents the research and reasoning behind those interests. Its purpose is to show how I investigate a problem, including the limits of the public record, rather than imply a portfolio performance result.',
        ],
      },
    ],
    takeaway: 'Understand the claim on the asset, trace the cash, and make the assumptions open to challenge.',
    links: [
      { label: 'Who owns Texas toll roads?', href: '#/markets/who-owns-texas-toll-roads', description: 'My source-led research on public ownership, concession rights, financing, and the economics of individual roads.' },
      { label: 'Read the SH 288 financing record', href: 'https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project', description: 'The federal project record describing the concession and the priority of debt repayment at termination.' },
      { label: 'Coursework & venture experience', href: '#/resume', description: 'Finance at UT Austin and commercial research with Jon Brumley Texas Venture Labs.' },
    ],
  },
  miscellaneous: {
    role: 'Independent building & creative experimentation',
    lens: 'Light → material → iteration',
    opening: 'Some ideas become clearer only after you give them a form and see how they behave.',
    chapters: [
      {
        id: 'question',
        kicker: 'Begin with something worth testing',
        title: 'What makes a digital object feel tangible?',
        body: [
          'A shape can be technically three-dimensional and still feel flat on a screen. Lighting, silhouette, texture, scale, and the way it moves all affect what we see. The experiments on this site begin with that practical question: how can a digital page feel tactile while remaining a place people can comfortably read and explore?',
          'The work sculptures give each project a physical idea to return to—a calendar instrument, an exposed synthetic mind, a market observatory, and an unfinished folded mechanism. Their geometry includes actual relief, openings, shafts, and local pivots. Those details give light and motion something meaningful to describe. The objects are original procedural assets created for this site; historical models and adapted generative studies elsewhere retain their own source attribution.',
        ],
      },
      {
        id: 'system',
        kicker: 'Build the image from its parts',
        title: 'Let light become ink and paper.',
        body: [
          'Ordered dithering turns a range of tones into a pattern of marks. On this site, dark marks carry the object while its highlights leave the page’s paper visible. The material, lighting, and dot pattern therefore have to work together. A smooth surface, a recess, and a beveled edge should still read as different forms after their shading has become grain.',
          'Motion adds another layer. An articulated wheel has a shaft; a suspended component has a pivot. Rotation and translation can reveal depth, while changing grain keeps the image alive. The reading experience remains the test: movement needs a way to pause, controls need clear purposes, and reduced-motion preferences need a settled view. The useful version of an effect is the one that adds something to the object without making the surrounding page harder to use.',
        ],
      },
      {
        id: 'practice',
        kicker: 'Make a small change you can inspect',
        title: 'Iteration is part of the medium.',
        body: [
          'A still image is one view of a moving system. A silhouette needs to survive rotation; an intricate mechanism needs to remain legible at phone scale. The same dot pattern can look different at another display density or browser scale. Looking at those states changes what gets kept: sometimes the next improvement is a clearer form, fewer competing details, or a quieter movement.',
          'That experimental approach also appears in tools and creative research. With CreativeTrace, I study recurring patterns in public posts and video, then turn observations into hypotheses and concepts to test. A pattern is a starting point for a creative decision, rather than a promise of engagement. Small research and automation tools serve a related purpose: make recurring work easier to inspect, revisit, and improve. Building produces something concrete to react to—and often a better question for the next attempt.',
        ],
        note: 'Original work sculptures and credited historical or generative sources are distinct. Attribution remains attached to the adapted work.',
      },
    ],
    takeaway: 'Give the idea a form, test what the form reveals, and refine the parts that earn their place.',
    links: [
      { label: 'Try the shader study', href: './shader.html', description: 'Explore the material and rendering experiment behind the site’s interest in light and ordered dithering.' },
      { label: 'Explore the writing', href: '#/writing', description: 'Research and essays paired with credited generative studies and their original source links.' },
      { label: 'A tool built around evidence', href: '#/work/atlas', description: 'Atlas connects a recurring website-research task to captured observations and inspectable findings.' },
    ],
  },
}
