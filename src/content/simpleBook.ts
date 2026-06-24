export type SimpleBookLink = {
  label: string;
  href: string;
  description: string;
};

export type SimpleBookChapter = {
  id: string;
  numeral: string;
  title: string;
  eyebrow: string;
  body: string[];
  links?: SimpleBookLink[];
};

export const SIMPLE_BOOK_TITLE = 'A Short Book About Sulayman Bowles';

export const SIMPLE_BOOK_H1 = 'A Short Book About Me';

export const SIMPLE_BOOK_DESCRIPTION =
  'A first-person text edition of Sulayman Bowles website covering technical SEO, AI-search visibility, Atlas, Void Agency, Markets Research, finance/data work, and software systems.';

export const SIMPLE_BOOK_STATIC_SUMMARY =
  'A first-person book page by Sulayman Bowles about his work across technical SEO, AI-search visibility, finance/data research, Atlas, Void Agency, Markets Research, and software systems.';

export const SIMPLE_BOOK_LINKS: SimpleBookLink[] = [
  {
    label: 'Designed site',
    href: '/',
    description: 'The visual front door for the same work.',
  },
  {
    label: 'Atlas',
    href: '/atlas',
    description: 'The technical SEO audit console.',
  },
  {
    label: 'Void Agency method',
    href: '/method',
    description: 'The commercial audit frame.',
  },
  {
    label: 'Markets Research',
    href: '/markets',
    description: 'The finance and data research archive.',
  },
  {
    label: 'Resume',
    href: '/resume',
    description: 'The compact work record.',
  },
  {
    label: 'Email',
    href: 'mailto:sulayman.bowles@gmail.com',
    description: 'The direct contact path.',
  },
];

export const SIMPLE_BOOK_CHAPTERS: SimpleBookChapter[] = [
  {
    id: 'where-i-am-starting',
    numeral: 'I',
    title: 'Where I am starting',
    eyebrow: 'Context',
    body: [
      'I am a McCombs student at UT Austin building across technical SEO, AI-search visibility, finance research, and software. That can look scattered from the outside, but the work keeps returning to one problem: messy information has to become usable before it can become valuable.',
      'I am drawn to work where the first useful act is not a pitch. It is reading the source text, checking the raw and rendered HTML, looking at crawl records, opening the assumptions, and asking what the evidence actually supports.',
      'I trust work more when I can see the assumptions. That is true in a crawl audit, a valuation memo, a search visibility plan, or a small software system. If I cannot inspect the input, the method, and the output, I do not trust the conclusion enough.',
    ],
  },
  {
    id: 'what-i-am-building',
    numeral: 'II',
    title: 'What I am building',
    eyebrow: 'Direction',
    body: [
      'I am building a body of work around visibility, judgment, and repeatable systems. Technical SEO gives me concrete evidence: robots rules, canonicals, internal links, sitemap coverage, response codes, schema, page templates, and raw crawl exports.',
      'I use software to make work repeatable, inspectable, and faster. A good audit should not depend on memory or charisma. It should leave behind records that another operator can open, question, and use.',
      'Void Agency is the commercial frame. Atlas is the technical proof. Markets Research is where I practice judgment under uncertainty. Together they give me one coherent direction instead of three unrelated interests.',
    ],
  },
  {
    id: 'how-i-think',
    numeral: 'III',
    title: 'How I think',
    eyebrow: 'Method',
    body: [
      'I usually start by separating surface from structure. In search work, the surface is the page copy or the dashboard score. The structure is the crawl path, indexation state, canonical logic, internal link graph, source text, rendered HTML, and query evidence.',
      'A technical audit without page-level proof is not useful enough. I want affected URLs, source observations, the reason the issue matters, and the operating decision it should create. Otherwise the audit becomes a list of opinions.',
      'I try to keep claims close to the evidence. GA4 and GSC data, crawl records, query buckets, valuation assumptions, research memos, and dashboard views all become more useful when the reader can trace how I got from observation to recommendation.',
    ],
  },
  {
    id: 'atlas',
    numeral: 'IV',
    title: 'Atlas',
    eyebrow: 'Technical proof',
    body: [
      'I built Atlas because I wanted technical SEO work to feel less like a black-box report and more like an evidence console. I care about what a crawler can actually discover, what it can render, what the page declares, and what the site architecture implies.',
      'I think of Atlas as a way to make page-level proof easier to collect and easier to review. The useful questions are specific: which URLs are blocked, duplicated, orphaned, canonicalized away, missing structured data, thin in the rendered view, or disconnected from important internal paths?',
      'I do not want Atlas to be a decorative dashboard. I want it to make crawl evidence legible enough that a founder, marketer, engineer, or analyst can see the same issue and understand why it changes the next decision.',
    ],
    links: [
      {
        label: 'Open Atlas',
        href: '/atlas',
        description: 'Read the product case for the audit console.',
      },
    ],
  },
  {
    id: 'void-agency',
    numeral: 'V',
    title: 'Void Agency',
    eyebrow: 'Commercial frame',
    body: [
      'I use Void Agency as the commercial frame for technical SEO, AI-search visibility, and site systems work. It gives the research and tooling a client-facing test: can this make a site easier to crawl, understand, cite, and act on?',
      'I care about the practical layer. Robots rules, internal links, canonicals, schema, templates, performance inputs, and analytics evidence only matter when they change how a business allocates time, budget, or engineering attention.',
      'I am not trying to make generic agency copy. I am trying to build a clear operating method: crawl the site, diagnose the evidence, prioritize the fixes, measure the change, and keep the claims tied to what can be inspected.',
    ],
    links: [
      {
        label: 'Read the method',
        href: '/method',
        description: 'See the Void Agency audit process.',
      },
    ],
  },
  {
    id: 'markets-and-finance',
    numeral: 'VI',
    title: 'Markets and finance',
    eyebrow: 'Judgment',
    body: [
      'Finance attracts me because loose thinking gets punished. If I make a weak assumption about margins, growth, discount rates, liquidity, or incentives, the model eventually exposes it.',
      'I use Markets Research as a place to practice that discipline. The work is not only about being right. It is about stating the assumptions clearly enough that someone can challenge them without guessing what I meant.',
      'I see a connection between a valuation memo and a technical audit. Both require source data, judgment under uncertainty, and a willingness to separate what is known from what is inferred.',
    ],
    links: [
      {
        label: 'Open Markets Research',
        href: '/markets',
        description: 'Read the finance and data research archive.',
      },
    ],
  },
  {
    id: 'software-and-systems',
    numeral: 'VII',
    title: 'Software and systems',
    eyebrow: 'Repeatability',
    body: [
      'I use software when the work should not have to be rebuilt by hand every time. A script, interface, dashboard, or small database is useful when it preserves the logic of the work and makes the next pass cleaner.',
      'I like systems that are plain enough to inspect. I would rather have a narrower tool that shows its inputs and assumptions than a broad tool that hides the method behind a score.',
      'The software side matters because it turns research into operations. Crawl exports, query groups, GA4/GSC evidence, issue tables, valuation assumptions, and memos become more durable when they live in a structure that can be reused.',
    ],
  },
  {
    id: 'work-record',
    numeral: 'VIII',
    title: 'Work record',
    eyebrow: 'Proof',
    body: [
      'I want my work record to be readable without overexplaining it. UT Austin and McCombs give me the academic frame. Void Agency gives me operating pressure. Atlas gives me a technical artifact. Markets Research gives me a place to show how I reason through uncertainty.',
      'I have worked around SEO audits, website systems, local search, AI-search visibility, product research, analytics, market validation, financial models, and public-facing interfaces. The overlap is not accidental. I keep looking for the point where evidence becomes an operating decision.',
      'I am more interested in proof than polish. A public route, a crawl sample, a research memo, an assumptions table, or a working interface tells me more than a dense paragraph of positioning.',
    ],
    links: [
      {
        label: 'Open resume',
        href: '/resume',
        description: 'See the compact experience page.',
      },
    ],
  },
  {
    id: 'what-i-am-looking-for',
    numeral: 'IX',
    title: 'What I am looking for',
    eyebrow: 'Fit',
    body: [
      'I am looking for work where evidence and commercial judgment both matter. I am interested in technical SEO systems, AI-search visibility, product research, finance/data analysis, and software that makes expert work easier to inspect.',
      'I fit best around problems with source material: crawled pages, search queries, analytics exports, market data, customer evidence, valuation assumptions, or unfinished workflows. I like turning those inputs into a clear decision path.',
      'I am less interested in vague strategy and more interested in the operating layer. What is blocked, what is misunderstood, what is mispriced, what is unmeasured, and what should change next?',
    ],
  },
  {
    id: 'contact-and-links',
    numeral: 'X',
    title: 'Contact and links',
    eyebrow: 'Entry points',
    body: [
      'I keep the designed site as the front door because it shows the visual system and the public proof. I keep this page quieter because some context is easier to read without motion, cards, or presentation pressure.',
      'I am easiest to evaluate through the work itself: Atlas for technical proof, Void Agency for the commercial method, Markets Research for judgment under uncertainty, and the resume for the compact record.',
      'If the overlap is useful, I prefer a direct note with the problem, the source material, and the decision you are trying to make.',
    ],
    links: SIMPLE_BOOK_LINKS,
  },
];
