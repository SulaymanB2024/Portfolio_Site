export type ResearchStatus = 'draft note' | 'research memo' | 'market report' | 'developed essay';

export interface EvidenceLedgerItem {
  item: string;
  implication: string;
  confidence: 'low' | 'medium' | 'high';
  source: string;
}

export interface ResearchAssumption {
  assumption: string;
  importance: string;
  weakens: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface Counterargument {
  view: string;
  whyRight: string;
  decidingEvidence: string;
}

export interface ResearchImplications {
  investment: string;
  operator: string;
  product: string;
  technical: string;
}

export interface MarketThesis {
  slug: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  thesis: string;
  date: string;
  lastUpdated: string;
  readTime: string;
  author: string;
  status: ResearchStatus;
  depth: string;
  tags: string[];
  horizon: string;
  modelQuestion: string;
  evidenceBase: string;
  risks: string;
  formula: string;
  formulaLabel: string;
  executiveBrief: string[];
  mechanism: {
    actors: string[];
    incentives: string[];
    leveragePoints: string[];
    causalChain: string[];
  };
  evidenceLedger: EvidenceLedgerItem[];
  assumptions: ResearchAssumption[];
  counterarguments: Counterargument[];
  implications: ResearchImplications;
  openQuestions: string[];
  strengthen: string[];
  relatedPages: Array<{ label: string; href: string }>;
  content: string[];
}

export const MARKET_THESES: MarketThesis[] = [
  {
    slug: 'network-monopolies',
    number: '01',
    category: 'PLATFORMS / MARKET STRUCTURE',
    title: 'Network Monopolies, Switching Costs, and Platform Power',
    subtitle:
      'A structured memo on whether network effects, switching costs, and data loops can protect platform economics when regulation, ad cycles, and AI distribution pressure rise.',
    thesis:
      'Network platforms compound when users, developers, advertisers, and data loops reinforce one another. The thesis only holds if switching costs and habit survive regulation, margin pressure, and distribution resets.',
    date: '2026.04.18',
    lastUpdated: 'May 28, 2026',
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    status: 'research memo',
    depth: 'structured memo; source ledger still incomplete',
    tags: ['platforms', 'network effects', 'switching costs', 'pricing power'],
    horizon: '7 - 10 YEAR VIEW',
    modelQuestion: 'Which parts of the moat are measurable, and which are narrative?',
    evidenceBase:
      'Evidence needed: retention cohorts, take-rate history, ad-load tolerance, switching behavior, developer dependency, antitrust filings, and margin bridges.',
    risks: 'Antitrust remedies, distribution shifts, ad-cycle weakness, AI answer layers, privacy restrictions, and margin compression.',
    formula:
      'Retention + multi-sided participation + switching costs + pricing power - regulatory pressure - distribution reset risk',
    formulaLabel: 'Mechanism Test',
    executiveBrief: [
      'The memo separates network effects from simple scale.',
      'A strong platform should make leaving expensive for users, developers, advertisers, or businesses without relying only on brand preference.',
      'The central risk is that regulation or AI-mediated distribution can weaken the interface where the platform captures value.',
      'The work is not complete until the moat is tied to retention, pricing, margin, and dependency evidence.',
    ],
    mechanism: {
      actors: ['Users', 'creators/developers', 'advertisers or merchants', 'platform operator', 'regulators'],
      incentives: [
        'Users want reach, identity, convenience, or stored history.',
        'Creators and developers follow audience density and monetization.',
        'Advertisers and merchants pay where intent or attention is measurable.',
        'The platform operator optimizes take rate, ranking rules, and product surface control.',
      ],
      leveragePoints: [
        'Identity graph and user history',
        'Ranking/discovery algorithm',
        'Payment, ad, or data rails',
        'Developer APIs and partner dependencies',
      ],
      causalChain: [
        'More participants improve utility or distribution.',
        'Higher utility increases retention and switching cost.',
        'Retention supports pricing power, ad load, or take rate.',
        'Pricing power funds product and infrastructure reinvestment.',
        'Regulation or distribution resets can break the loop at capture points.',
      ],
    },
    evidenceLedger: [
      {
        item: 'Retention and cohort behavior',
        implication: 'Shows whether the platform has habitual use or only cyclical traffic.',
        confidence: 'low',
        source: 'TODO/source needed: company filings, cohort disclosures, third-party usage data.',
      },
      {
        item: 'Take-rate, ad-load, or pricing history',
        implication: 'Tests whether the platform can monetize density without damaging user or merchant behavior.',
        confidence: 'low',
        source: 'TODO/source needed: segment disclosures, advertiser commentary, merchant fee history.',
      },
      {
        item: 'Regulatory and antitrust remedies',
        implication: 'Frames the downside case where the platform keeps users but loses control over data, ranking, or bundling.',
        confidence: 'medium',
        source: 'TODO/source needed: enforcement records, consent decrees, pending litigation.',
      },
    ],
    assumptions: [
      {
        assumption: 'Switching costs are behavioral and economic, not just brand preference.',
        importance: 'Without real switching cost, platform margins can compress quickly.',
        weakens: 'Users multi-home easily or creators move audience without revenue loss.',
        confidence: 'medium',
      },
      {
        assumption: 'The platform keeps control of the value-capture surface.',
        importance: 'AI answer layers or app-store changes can reroute demand before monetization.',
        weakens: 'Traffic shifts to intermediaries that commoditize the platform endpoint.',
        confidence: 'low',
      },
      {
        assumption: 'Regulation changes economics more slowly than product adaptation.',
        importance: 'The long-horizon case depends on adaptation outrunning enforcement.',
        weakens: 'Structural remedies force data portability, unbundling, or fee caps.',
        confidence: 'low',
      },
    ],
    counterarguments: [
      {
        view: 'Network monopolies are already priced as durable winners.',
        whyRight: 'The market may have capitalized the moat into a premium multiple.',
        decidingEvidence: 'Forward return needs a margin bridge, not just a moat description.',
      },
      {
        view: 'AI search and agent interfaces reduce platform surfaces to suppliers.',
        whyRight: 'If users stop visiting the platform UI, ranking control and ad inventory weaken.',
        decidingEvidence: 'Traffic source mix, direct usage retention, API economics, and agent referral quality.',
      },
      {
        view: 'Regulation can force interoperability and erase switching costs.',
        whyRight: 'Portability and unbundling can weaken lock-in even when the product remains useful.',
        decidingEvidence: 'Specific remedy scope, compliance cost, and user migration after enforced changes.',
      },
    ],
    implications: {
      investment:
        'The investable case requires proof that monetization can rise without eroding retention or inviting value-destructive remedies.',
      operator:
        'Operators should track the exact surface where switching cost is created: data, workflow, audience, identity, or payments.',
      product:
        'Product strategy should strengthen durable user history and workflow dependency rather than only top-of-funnel growth.',
      technical:
        'Data work should separate direct demand, referred demand, API usage, crawlable public surfaces, and AI-answer visibility.',
    },
    openQuestions: [
      'Which network effects are one-sided, two-sided, or data-driven?',
      'How much revenue comes from surfaces that AI intermediaries could bypass?',
      'What regulatory remedy would actually change user behavior?',
      'Where is switching cost observable in retention, pricing, or workflow data?',
    ],
    strengthen: [
      'Add primary filing excerpts and segment margin tables.',
      'Build a retention/pricing-power comparison table across platform types.',
      'Map antitrust remedy scenarios to revenue and margin lines.',
    ],
    relatedPages: [
      { label: 'Markets Research', href: '/markets' },
      { label: 'Finance Research Entry Page', href: '/markets/valuation-research' },
      { label: 'Contact', href: '/#contact' },
    ],
    content: [
      'The memo separates network effects from simple scale. The core test is whether switching costs, multi-sided participation, and value capture reinforce one another over time.',
      'Evidence still needs to be attached before this reads as a finished market report.',
    ],
  },
  {
    slug: 'computational-commodity-systems',
    number: '02',
    category: 'COMPUTE / AI INFRASTRUCTURE',
    title: 'Computational Commodity Systems and AI Infrastructure Margins',
    subtitle:
      'A draft research artifact on compute supply, AI infrastructure, energy constraints, utilization, and the risk that model-serving becomes a commodity margin business.',
    thesis:
      'Compute looks scarce during capacity shocks, but commodity pressure appears when supply normalizes, buyers route workloads across providers, and energy or utilization becomes the margin constraint.',
    date: '2026.05.02',
    lastUpdated: 'May 28, 2026',
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    status: 'draft note',
    depth: 'staged thesis; evidence ledger mostly TODO',
    tags: ['compute', 'AI infrastructure', 'energy', 'margins', 'utilization'],
    horizon: '5 - 8 YEAR VIEW',
    modelQuestion: 'Which layer captures durable margin: chips, power, clouds, model hosts, or workflow owners?',
    evidenceBase:
      'Evidence needed: GPU utilization, capex commitments, power availability, inference pricing, cloud gross margin, depreciation schedules, and workload portability.',
    risks:
      'Hardware cycles, power bottlenecks, model efficiency gains, hyperscaler pricing pressure, utilization gaps, and token-incentive dilution in decentralized networks.',
    formula:
      'Delivered compute margin = utilization x pricing power - energy cost - depreciation - networking/verification overhead',
    formulaLabel: 'Margin Model',
    executiveBrief: [
      'The note tests whether AI compute is a durable bottleneck or a cyclical commodity system.',
      'Hardware scarcity can create temporary pricing power, but long-term margins depend on utilization, power, software lock-in, and workload switching cost.',
      'The hard question is who controls the scarce layer when capacity expands.',
      'This remains a staged note until provider pricing, utilization, and energy data are sourced.',
    ],
    mechanism: {
      actors: ['Chip designers', 'cloud platforms', 'data center operators', 'power suppliers', 'model companies', 'enterprise buyers'],
      incentives: [
        'Clouds want high utilization and long commitments.',
        'Model companies want lower inference cost and reliable capacity.',
        'Data center operators want power-secured capacity with predictable tenants.',
        'Enterprise buyers want portability, reliability, and lower unit cost.',
      ],
      leveragePoints: [
        'Power availability and interconnect queues',
        'GPU supply and depreciation cycle',
        'Inference routing and workload portability',
        'Developer tooling and committed-spend contracts',
      ],
      causalChain: [
        'Model demand pushes near-term capacity shortages.',
        'Shortage supports premium pricing and capex acceleration.',
        'New capacity and efficiency gains reduce scarcity.',
        'Workloads route toward cheaper reliable supply.',
        'Margins settle at the layer with the strongest bottleneck or switching cost.',
      ],
    },
    evidenceLedger: [
      {
        item: 'Inference and training price curves',
        implication: 'Shows whether compute supply is commoditizing or retaining scarcity premium.',
        confidence: 'low',
        source: 'TODO/source needed: cloud price sheets, model API pricing, reserved-instance discounts.',
      },
      {
        item: 'Data center power constraints',
        implication: 'Identifies whether power, not chips, is the real bottleneck.',
        confidence: 'low',
        source: 'TODO/source needed: utility interconnect queues, data center filings, power purchase agreements.',
      },
      {
        item: 'Utilization and capex commitments',
        implication: 'Distinguishes durable demand from overbuild risk.',
        confidence: 'low',
        source: 'TODO/source needed: hyperscaler capex notes, lease terms, utilization commentary.',
      },
    ],
    assumptions: [
      {
        assumption: 'Workloads can move between providers when price differences matter.',
        importance: 'Portability pushes compute toward commodity pricing.',
        weakens: 'Tooling, data gravity, compliance, or latency makes switching expensive.',
        confidence: 'medium',
      },
      {
        assumption: 'Power access remains a scarce constraint for frontier-scale capacity.',
        importance: 'Power scarcity can protect margins even when chip supply improves.',
        weakens: 'Efficiency gains reduce power demand or new power capacity arrives faster than expected.',
        confidence: 'low',
      },
      {
        assumption: 'Model efficiency offsets some demand growth.',
        importance: 'Efficiency changes the denominator of compute demand.',
        weakens: 'Use cases expand faster than unit costs fall.',
        confidence: 'medium',
      },
    ],
    counterarguments: [
      {
        view: 'AI compute remains structurally scarce for the full cycle.',
        whyRight: 'Demand may keep absorbing each new capacity wave.',
        decidingEvidence: 'Backlog duration, utilization, pricing retention, and multi-year customer commitments.',
      },
      {
        view: 'Only chip designers capture the durable profit pool.',
        whyRight: 'Specialized accelerators and software stacks can concentrate margin upstream.',
        decidingEvidence: 'Gross margin persistence, customer concentration, and accelerator substitution rates.',
      },
      {
        view: 'Decentralized compute can undercut cloud pricing.',
        whyRight: 'Underused hardware can sell excess capacity cheaply.',
        decidingEvidence: 'Reliable uptime, latency, verification cost, and non-subsidized demand after token rewards fall.',
      },
    ],
    implications: {
      investment:
        'Avoid treating all AI infrastructure revenue as equal; margin durability may sit with power, chips, software lock-in, or distribution rather than raw capacity.',
      operator:
        'Operators should track unit economics by workload type, utilization, energy price, and contract duration.',
      product:
        'Product teams can reduce exposure by designing provider-portable inference and separating model logic from hosting lock-in.',
      technical:
        'Data systems should log workload cost, latency, provider, cache hit rate, and quality so routing can be evaluated instead of assumed.',
    },
    openQuestions: [
      'Where are buyers locked in: data, latency, compliance, tooling, model quality, or contract discounts?',
      'How fast do efficiency gains lower inference cost per useful task?',
      'Which workloads tolerate spot-style compute or decentralized supply?',
      'How much of the bottleneck is chips versus power and permitting?',
    ],
    strengthen: [
      'Add a provider price history table.',
      'Add a power/interconnect constraint map with primary sources.',
      'Compare capex depreciation assumptions across cloud and data center operators.',
    ],
    relatedPages: [
      { label: 'Markets Research', href: '/markets' },
      { label: 'Atlas', href: '/atlas' },
      { label: 'Contact', href: '/#contact' },
    ],
    content: [
      'The note tests whether AI compute scarcity turns into durable margin or a commodity cycle.',
      'The important variables are utilization, energy, depreciation, workload switching cost, and buyer concentration.',
    ],
  },
  {
    slug: 'fiat-horizon',
    number: '03',
    category: 'MONEY / DEBT / TIME HORIZONS',
    title: 'Fiat Horizon: Debt, Currency Trust, and Time Preference',
    subtitle:
      'A draft note on money, sovereign debt, real rates, currency trust, hard-asset narratives, and the way time horizons change under monetary uncertainty.',
    thesis:
      'When debt burdens rise and currency trust weakens, investors and operators shorten their planning horizon unless real yields, institutional credibility, or productive asset returns compensate them.',
    date: '2026.05.15',
    lastUpdated: 'May 28, 2026',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    status: 'draft note',
    depth: 'early essay skeleton; primary-source work needed',
    tags: ['money', 'debt', 'currency trust', 'real rates', 'hard assets'],
    horizon: '10+ YEAR VIEW',
    modelQuestion: 'When do hard assets protect time horizon, and when do they become liquidity traps?',
    evidenceBase:
      'Evidence needed: real-rate history, debt service, fiscal balances, dollar liquidity, drawdown behavior, custody risk, ETF flows, and stress-period correlations.',
    risks:
      'Liquidity squeezes, regulatory restrictions, custody failures, fiscal stabilization, positive real-rate regimes, and hard-asset volatility.',
    formula:
      'Currency trust = real yield + institutional credibility + liquidity depth - debt-service pressure - inflation uncertainty',
    formulaLabel: 'Trust Framework',
    executiveBrief: [
      'The note separates a monetary thesis from a hard-asset slogan.',
      'Debt pressure can weaken confidence, but purchasing-power protection depends on entry price, liquidity, custody, and the real-rate regime.',
      'Gold, Bitcoin, cash, and productive assets do not hedge the same risk.',
      'This is a draft until the historical regime table and source ledger are complete.',
    ],
    mechanism: {
      actors: ['Sovereign issuers', 'central banks', 'households', 'asset allocators', 'banks', 'hard-asset holders'],
      incentives: [
        'Sovereigns want funding flexibility and manageable debt service.',
        'Central banks balance inflation credibility, employment, and financial stability.',
        'Asset allocators seek purchasing-power protection and liquidity.',
        'Households shorten horizons when cash feels unreliable.',
      ],
      leveragePoints: [
        'Real interest rates',
        'Debt-service share of fiscal capacity',
        'Dollar liquidity and funding stress',
        'Custody and settlement rails',
        'Inflation expectations and policy credibility',
      ],
      causalChain: [
        'Debt and deficits raise questions about future purchasing power.',
        'If real yields stay weak, savers search for alternative stores of value.',
        'Alternative assets can rise with trust concerns but still sell off during liquidity stress.',
        'Policy credibility or positive real yields can pull demand back toward cash and bonds.',
        'Long-term hedges fail if custody, regulation, or entry price overwhelms the monetary case.',
      ],
    },
    evidenceLedger: [
      {
        item: 'Real-rate and inflation regime history',
        implication: 'Tests when hard assets outperformed versus when cash or bonds regained appeal.',
        confidence: 'low',
        source: 'TODO/source needed: FRED/Treasury series, CPI data, gold and Bitcoin returns.',
      },
      {
        item: 'Debt-service pressure',
        implication: 'Shows whether fiscal capacity is narrowing or still manageable.',
        confidence: 'low',
        source: 'TODO/source needed: Treasury, CBO, IMF, BIS, or central-bank reports.',
      },
      {
        item: 'Stress-period correlations and drawdowns',
        implication: 'Prevents treating long-term scarcity assets as short-term liquidity hedges.',
        confidence: 'medium',
        source: 'TODO/source needed: asset return series across liquidity shocks.',
      },
    ],
    assumptions: [
      {
        assumption: 'Debt-service pressure can affect currency trust before outright crisis.',
        importance: 'The thesis depends on gradual horizon compression, not only collapse scenarios.',
        weakens: 'Productivity, growth, or fiscal reform offsets debt-service pressure.',
        confidence: 'low',
      },
      {
        assumption: 'Hard assets respond differently across liquidity regimes.',
        importance: 'Gold, Bitcoin, and cash should not be modeled as one hedge basket.',
        weakens: 'Correlations converge during stress or regulatory action dominates.',
        confidence: 'medium',
      },
      {
        assumption: 'Time horizon is partly a monetary variable.',
        importance: 'The essay links currency confidence to operator and investor behavior.',
        weakens: 'Planning horizons remain stable despite inflation or policy volatility.',
        confidence: 'low',
      },
    ],
    counterarguments: [
      {
        view: 'Fiat systems can absorb high debt loads for longer than skeptics expect.',
        whyRight: 'Deep markets, taxation power, reserve status, and central-bank credibility can extend the system.',
        decidingEvidence: 'Real yields, auction demand, dollar funding stress, and inflation-expectation stability.',
      },
      {
        view: 'Hard assets are too volatile to preserve time horizon.',
        whyRight: 'Large drawdowns can force sellers before the long-term thesis plays out.',
        decidingEvidence: 'Drawdown duration, liquidity needs, custody quality, and position sizing.',
      },
      {
        view: 'Productive assets are better protection than monetary hedges.',
        whyRight: 'Businesses with pricing power can compound real earnings while inert assets cannot.',
        decidingEvidence: 'Margin durability, pricing pass-through, reinvestment returns, and valuation paid.',
      },
    ],
    implications: {
      investment:
        'The allocation question is not hard assets versus cash; it is which instrument protects purchasing power for a specific liquidity need and time horizon.',
      operator:
        'Operators should stress-test financing, pricing, and working-capital assumptions under tighter credit and weaker currency confidence.',
      product:
        'Financial products should make regime assumptions explicit instead of selling one hedge for every monetary condition.',
      technical:
        'Research tooling should combine macro time series, asset drawdowns, custody constraints, and scenario notes in one source ledger.',
    },
    openQuestions: [
      'Which real-rate regime most closely matches the current setup?',
      'How should debt-service pressure be measured for reserve-currency issuers?',
      'What is the deciding difference between a hedge and a speculative liquidity asset?',
      'How much custody/regulatory risk should reduce the hard-asset case?',
    ],
    strengthen: [
      'Build a regime table across inflation, real rates, gold, Bitcoin, cash, and equities.',
      'Add primary fiscal and debt-service sources.',
      'Add stress-period drawdown charts with explicit dates and source links.',
    ],
    relatedPages: [
      { label: 'Markets Research', href: '/markets' },
      { label: 'Finance Research Entry Page', href: '/markets/valuation-research' },
      { label: 'Contact', href: '/#contact' },
    ],
    content: [
      'The note tests how monetary trust, real rates, and debt pressure change time horizons.',
      'The work needs primary source tables before it can be treated as a developed essay.',
    ],
  },
];

export function getMarketThesisBySlug(slug: string) {
  return MARKET_THESES.find((thesis) => thesis.slug === slug);
}

export function getMarketThesisByIndex(index: number) {
  return MARKET_THESES[index] ?? MARKET_THESES[0];
}
