export interface MarketThesis {
  slug: string;
  number: string;
  category: string;
  title: string;
  seoTitle: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  conviction: string;
  horizon: string;
  allocation: string;
  risks: string;
  formula: string;
  formulaLabel: string;
  content: string[];
}

export const MARKET_THESES: MarketThesis[] = [
  {
    slug: 'network-monopolies',
    number: '01',
    category: 'MACRO EQUITY STRATEGY',
    title: 'On the Structural Allocation to Network Monopolies under Perpetual Debasement',
    seoTitle: 'Network Monopolies & Debasement',
    subtitle: 'Why global scale network effects act as sovereign-grade collateral in credit expansion cycles.',
    seoDescription:
      'Market research memo by Sulayman Bowles on network monopolies, fiat debasement, pricing power, platform margins, and allocation logic for long-horizon investors.',
    image: '/og-default.png',
    date: '2026.04.18',
    readTime: '09 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: '9.4 / 10',
    horizon: '7 - 10 YEARS',
    allocation: '40.0%',
    risks: 'Antitrust regulation, hardware supply chain choke points, margin compression.',
    formula: 'V(N) \\propto N \\cdot \\log(N) \\cdot R_{debase}',
    formulaLabel: 'Liquidity Adjusted Network Value Multiplier',
    content: [
      'Modern asset allocation models fail to account for the systemic debasement of fiat denominators. When central bank balance sheets expand at a secular compound annual rate of 8% to 12%, nominal valuations become a vector of monetary dilution rather than organic growth. In this regime, traditional discounted cash flow (DCF) models collapse under unstable discount rates.',
      'To preserve purchasing power, capital must settle in assets with high pricing power and low capital expenditure requirements. Global network monopolies represent the ultimate sink for excess liquidity. Because their margins are protected by high switching costs and near-zero marginal distribution costs, they can absorb monetary expansion and pass inflation directly to consumers.',
      'Our allocation strategy prioritizes platforms that function as private tax collectors on global digital transactions. As long as money supply velocity remains suppressed and aggregate credit expansion continues, these digital estates will compound value at a rate that outpaces currency debasement by an average of 450 basis points annually.',
    ],
  },
  {
    slug: 'computational-commodity-systems',
    number: '02',
    category: 'DECENTRALIZED INFRASTRUCTURE',
    title: 'Computational Commodity Systems: Node Architecture & Cryptographic Resource Pricing',
    seoTitle: 'Computational Commodity Systems',
    subtitle: 'Evaluating the emerging market for trustless, zero-knowledge verification hardware.',
    seoDescription:
      'Market research memo by Sulayman Bowles on decentralized compute, node architecture, zero-knowledge verification hardware, resource pricing, and protocol incentives.',
    image: '/og-default.png',
    date: '2026.05.02',
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: '8.6 / 10',
    horizon: '5 - 8 YEARS',
    allocation: '25.0%',
    risks: 'Smart contract vulnerability, hardware supply shocks, network incentive dilution.',
    formula: 'P_{compute} = \\frac{\\mu_{demand}}{\\sigma_{capacity}} \\cdot \\Theta_{incentive}',
    formulaLabel: 'Algorithmic Resource Pricing Equilibrium',
    content: [
      'The centralization of computing power in hyperscale data centers poses a structural threat to sovereign privacy and system redundancy. Decentralized physical infrastructure networks (DePIN) offer a viable alternative by coordinating globally distributed compute hardware via trustless smart contracts.',
      'We view raw compute capacity (GPU cycles, zero-knowledge proof generation, and machine learning model training) as the defining commodity of the next half-century. By tokenizing compute supply, decentralized markets align global incentives, lowering barrier to entry for developers and reducing overall infrastructure overhead by 60% compared to legacy cloud providers.',
      'Our investment framework focuses on protocol coordination layers. By standardizing verification mechanisms and establishing algorithmic market clearing prices, these systems turn volatile hardware supplies into reliable, institutional-grade compute assets.',
    ],
  },
  {
    slug: 'fiat-horizon',
    number: '03',
    category: 'MONETARY METRICS',
    title: 'Fiat Horizon: Standard Deviation Boundaries, Credit Expansion, and Hard-Money Backings',
    seoTitle: 'Fiat Horizon & Hard-Money Backing',
    subtitle: 'A quantitative study of volatility bands surrounding fiat currency velocity and commodity reserves.',
    seoDescription:
      'Market research memo by Sulayman Bowles on fiat velocity, credit expansion, hard-money reserves, gold and Bitcoin backing, volatility bands, and solvency risk.',
    image: '/og-default.png',
    date: '2026.05.15',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: '9.8 / 10',
    horizon: '10+ YEARS',
    allocation: '35.0%',
    risks: 'Central bank digital currency overrides, custody confiscation, short-term liquidity squeezes.',
    formula: 'B_{backing} = \\sum (Res_{gold} + Net_{bitcoin}) \\div M_{2}',
    formulaLabel: 'Sovereign Solvency Hard-Backing Ratio',
    content: [
      'The current international monetary architecture operates on a confidence model that is increasingly detached from physical constraints. When sovereign debt to GDP ratios exceed 120%, the mathematical paths to solvency narrow to two options: outright default or financial repression via negative real interest rates.',
      'We track the standard deviation boundaries of fiat currency velocity. As velocity drops toward its historical lower bounds, the marginal utility of additional debt creation declines, leading to currency debasement. In this environment, hard assets - specifically physical gold and decentralized digital assets like Bitcoin - serve as the absolute counterweight to credit expansion.',
      'Our metric models show that holding gold and Bitcoin provides an asymmetric protection profile. They carry no counterparty risk, cannot be arbitrarily inflated by committee decree, and behave as highly liquid sovereign-grade collateral when credit confidence shifts.',
    ],
  },
];

export function getMarketThesisBySlug(slug: string) {
  return MARKET_THESES.find((thesis) => thesis.slug === slug);
}

export function getMarketThesisByIndex(index: number) {
  return MARKET_THESES[index] ?? MARKET_THESES[0];
}
