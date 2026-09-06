export type AppIncomeEvidenceKind = 'Observed fact' | 'Derived calculation' | 'Modeled estimate' | 'Interpretation';

export type AppIncomeDenominator = {
  id: 'serious-developers-current' | 'serious-apps-current' | 'serious-developers-sustained' | 'serious-apps-sustained' | 'all-developers-current' | 'all-apps-current';
  unit: 'Developers' | 'Apps';
  horizon: 'Current month' | 'Three-month sustained';
  population: 'Serious attempts' | 'All listed';
  lower: number;
  central: number;
  upper: number;
  note: string;
};

export type AppIncomeCase = {
  name: string;
  unit: string;
  category: string;
  mrr: number;
  displayMrr: string;
  context: string;
  verification: string;
  sourceId: string;
  threshold: 'above' | 'below';
};

export type AppIncomeSource = {
  id: string;
  label: string;
  publisher: string;
  evidenceClass: string;
  note: string;
  href: string;
  lastVerified?: string;
};

export const APP_INCOME_ASSET_BASE = '/research/independent-app-income';

export const APP_INCOME_LEDE = [
  'The honest answer is not a single percentage. “Independent app,” “developer,” “revenue,” and even “makes” can each point to a different denominator or economic layer. Counting every listing in an app store produces a radically lower success rate than counting products that survived launch, implemented monetization, and received a meaningful commercial effort. Counting a developer’s portfolio produces a higher rate than asking whether any one app clears the line. Measuring one good month produces a higher rate than requiring the result to persist.',
  'This analysis therefore treats $1,000 per month as a family of questions. Its central estimate is that 15.4% of serious independent developers currently generate at least $1,000 in gross monthly app revenue across their portfolios. The equivalent app-level estimate is 10.2%. Requiring three consecutive months lowers those central estimates to 12.0% of developers and 7.3% of apps. Across every listed app—including abandoned, experimental, inactive, and non-commercial products—the modeled app-level share is about 1.0%.',
  'None of those numbers is a census. There is no public, ownership-resolved panel that joins every iOS and Android app to its publisher, monetization path, revenue, proceeds, operating cost, and trailing history. The model below bridges the best available subscription cohort evidence to a broader app population, then makes every transfer factor visible. The range matters more than the decimal point.',
];

export const APP_INCOME_DENOMINATORS: AppIncomeDenominator[] = [
  {
    id: 'serious-developers-current',
    unit: 'Developers',
    horizon: 'Current month',
    population: 'Serious attempts',
    lower: 8.36,
    central: 15.41,
    upper: 25.02,
    note: 'Portfolio-level gross revenue across a modeled mean of 1.83 serious apps per developer.',
  },
  {
    id: 'serious-apps-current',
    unit: 'Apps',
    horizon: 'Current month',
    population: 'Serious attempts',
    lower: 5.26,
    central: 10.23,
    upper: 17.44,
    note: 'One independent consumer app, live at least 90 days, with monetization and a minimum effort or traction signal.',
  },
  {
    id: 'serious-developers-sustained',
    unit: 'Developers',
    horizon: 'Three-month sustained',
    population: 'Serious attempts',
    lower: 6.31,
    central: 12.0,
    upper: 20.23,
    note: 'Developer portfolio clears the threshold in each of three consecutive months; persistence is modeled.',
  },
  {
    id: 'serious-apps-sustained',
    unit: 'Apps',
    horizon: 'Three-month sustained',
    population: 'Serious attempts',
    lower: 3.78,
    central: 7.28,
    upper: 12.91,
    note: 'Single-app estimate after applying the three-month persistence assumption.',
  },
  {
    id: 'all-developers-current',
    unit: 'Developers',
    horizon: 'Current month',
    population: 'All listed',
    lower: 0.5,
    central: 1.55,
    upper: 4.21,
    note: 'Includes publishers associated with inactive, tiny, experimental, and non-commercial listings.',
  },
  {
    id: 'all-apps-current',
    unit: 'Apps',
    horizon: 'Current month',
    population: 'All listed',
    lower: 0.31,
    central: 0.98,
    upper: 2.74,
    note: 'The broadest denominator and the least certain composition model.',
  },
];

export const APP_INCOME_EVIDENCE_BRIDGE = [
  {
    kind: 'Observed fact' as const,
    value: '17.3%',
    label: 'Ever reached $1,000 monthly revenue',
    detail: 'RevenueCat’s selected cohort of newly launched subscription apps, measured within the first two years.',
  },
  {
    kind: 'Modeled estimate' as const,
    value: '× 75%',
    label: 'Current-month persistence',
    detail: 'Central assumption converting an ever-hit milestone into the chance that an app is above the line now.',
  },
  {
    kind: 'Modeled estimate' as const,
    value: '× 85%',
    label: 'Transfer beyond the selected cohort',
    detail: 'Central haircut for applying subscription-cohort evidence to the wider serious-app population.',
  },
  {
    kind: 'Modeled estimate' as const,
    value: '10.2%',
    label: 'Serious apps above $1,000 now',
    detail: 'App-level central estimate after the persistence and population-transfer adjustments.',
  },
  {
    kind: 'Modeled estimate' as const,
    value: '15.4%',
    label: 'Serious developers above $1,000 now',
    detail: 'Portfolio aggregation, with correlated outcomes across a modeled mean of 1.83 serious apps per developer.',
  },
];

export const APP_INCOME_REVENUE_BANDS = [
  { label: '$0', share: 22, detail: 'No current gross revenue' },
  { label: '$1–$99', share: 32, detail: 'Commercially negligible' },
  { label: '$100–$999', share: 35.78, detail: 'Sub-threshold middle' },
  { label: '$1k–$4,999', share: 6.5, detail: 'Crossed the headline line' },
  { label: '$5k–$24,999', share: 2.7, detail: 'Potential small-business scale' },
  { label: '$25k–$99,999', share: 0.8, detail: 'Rare upper tail' },
  { label: '$100k+', share: 0.22, detail: 'Extreme modeled tail' },
];

export const APP_INCOME_CASES: AppIncomeCase[] = [
  {
    name: 'lovelee',
    unit: 'Single app',
    category: 'Relationship / lifestyle',
    mrr: 2413,
    displayMrr: '$2,413',
    context: '280 active subscriptions; audience-led launch; nine months old at the cutoff.',
    verification: 'Superwall API-linked revenue dashboard',
    sourceId: 'S16',
    threshold: 'above',
  },
  {
    name: 'TrackAI',
    unit: 'Single app',
    category: 'Health / calorie tracking',
    mrr: 20342,
    displayMrr: '$20,342',
    context: '4,865 active subscriptions and 327k+ claimed installs; current revenue verified, margin is a founder claim.',
    verification: 'RevenueCat-linked dashboard',
    sourceId: 'S17',
    threshold: 'above',
  },
  {
    name: '3AK Track & Field',
    unit: 'Single app',
    category: 'Sports training',
    mrr: 10082,
    displayMrr: '$10,082',
    context: '2,885 active subscriptions; seasonal and currently listed for sale.',
    verification: 'RevenueCat-linked dashboard',
    sourceId: 'S18',
    threshold: 'above',
  },
  {
    name: 'Bibly',
    unit: 'Single app',
    category: 'Bible / religion',
    mrr: 5264,
    displayMrr: '$5,264',
    context: '1,053 active subscriptions; MRR and latest-30-day revenue differ, showing why basis labels matter.',
    verification: 'RevenueCat-linked dashboard',
    sourceId: 'S21',
    threshold: 'above',
  },
  {
    name: 'Mehroz Sheikh portfolio',
    unit: '16-product portfolio',
    category: 'Utilities / productivity',
    mrr: 555,
    displayMrr: '$555',
    context: '$855 in the latest 30 days across 16 products; multiple products at zero or near-zero revenue.',
    verification: 'Multiple linked revenue accounts',
    sourceId: 'S20',
    threshold: 'below',
  },
  {
    name: 'GurjarApp',
    unit: 'Single app',
    category: 'Community / social',
    mrr: 0,
    displayMrr: '$0',
    context: '212k claimed users and $100–$150 in monthly costs, but no current subscription revenue.',
    verification: 'Stripe-linked revenue; user count is founder-supplied',
    sourceId: 'S19',
    threshold: 'below',
  },
  {
    name: 'Noise Reducer',
    unit: 'Portfolio app',
    category: 'Audio / video utility',
    mrr: 137,
    displayMrr: '$137',
    context: 'A low but non-zero product inside the disclosed 16-product portfolio.',
    verification: 'Portfolio revenue listing',
    sourceId: 'S20',
    threshold: 'below',
  },
  {
    name: 'Revo Reminder',
    unit: 'Portfolio app',
    category: 'Productivity',
    mrr: 0,
    displayMrr: '$0',
    context: 'An explicit zero-revenue listing inside an actively disclosed builder portfolio.',
    verification: 'Portfolio revenue listing',
    sourceId: 'S20',
    threshold: 'below',
  },
];

export const APP_INCOME_COPY = {
  denominator: [
    'The denominator is the result. App stores contain abandoned experiments, client shells, brand companions, obsolete products, games that never attempted monetization, and apps whose business model lives outside store billing. Treating that inventory as equivalent to a product somebody actively tried to turn into a business makes the market look almost uniformly barren. Restricting the population to disclosed successes makes it look deceptively easy.',
    'The central population here is a “meaningful commercial attempt”: an independent consumer app that has been live for at least 90 days, has a functioning monetization path, and clears at least one effort or traction signal—1,000 lifetime installs, 10 ratings or reviews, $100 of lifetime revenue, $500 of launch or marketing spend, or 100 documented post-launch founder hours. That definition excludes templates, tests, abandoned prototypes, client-owned work, and products whose primary economics are physical-goods sales.',
    'The interactive range separates apps from developers and a current month from three-month persistence. The “all listed” rows are available as a deliberately broad counterfactual. They are useful for understanding store-scale abundance, but they are a poor answer to the practical founder question: “If I make a serious attempt, how often does it reach $1,000?”',
  ],
  evidence: [
    'The most useful observed anchor is RevenueCat’s launch cohort. In its 2026 report, 17.3% of selected newly launched subscription apps reached $1,000 in monthly revenue at least once within their first two years; 4.6% reached $10,000. The dataset covers more than 115,000 apps and $16 billion in revenue, but it is not a random draw from either store. Apps must integrate RevenueCat, be active, use subscriptions, and clear the report’s inclusion thresholds.',
    'An ever-hit milestone is not a current-state prevalence rate. A product can touch $1,000 during a launch spike, a seasonal peak, or a paid-acquisition burst and later fall below it. The model’s central bridge applies a 75% persistence factor and an 85% transfer factor. Multiplying those adjustments by the observed 17.3% produces the 10.2% central app-level estimate. Lower and upper cases vary the observed anchor, persistence, and transfer assumptions together.',
    'The developer result requires one more step. Independent builders often own more than one app, and the outcomes are correlated: the same skill, audience, code base, acquisition channel, and account reputation can help several products, while the same constraints can hurt all of them. A simulation with a mean of 1.83 serious apps per developer aggregates those portfolios without pretending each launch is an independent coin flip. Five hundred thousand draws, using seed 20260714, produce the reported interval. The workbook and reproduction script expose the full trace.',
  ],
  distribution: [
    'A threshold hides the shape of the market. The modeled serious-app distribution has a large zero and near-zero mass, a broad sub-$1,000 middle, and a very thin upper tail. About 22% of serious apps are modeled at zero current revenue, 32% between $1 and $99, and 35.8% between $100 and $999. That leaves roughly one in ten above $1,000, but only about one in 27 above $5,000.',
    'The observed subscription reports tell the same directional story. RevenueCat’s year-one monthly-revenue median is about $72, while the 90th percentile is $2,574. Adapty reports a $492 monthly median in its observed subscription-app cohort and says the top 10% capture 94.5% of revenue. Cohort filters differ, so those values should not be combined mechanically. Their common signal is concentration: a small upper tail accounts for most dollars while a very large population remains economically small.',
    'The $1,000 line is therefore neither trivial nor exceptional. It sits above the vast majority of serious apps, but below the scale required to replace a salary after fees and operating costs. It is better understood as evidence of working distribution and monetization—a product with enough paying demand to deserve a closer look—than as proof of a durable business.',
  ],
  portfolio: [
    'Developer-level success is not just “at least one breakout.” In the model, some builders cross $1,000 because one app clears the threshold, while an estimated 17% to 25% of successful developers get there only by adding together several sub-threshold apps. That is the portfolio effect: $400, $350, and $300 are unimpressive in isolation but meaningful as a shared operating system.',
    'The effect has limits. Between 55% and 75% of successful developers are modeled to receive at least 70% of revenue from their top app. Portfolios can reuse code, cross-promote, and diversify platform or category risk, but revenue still tends to concentrate. More apps also create maintenance, support, policy, analytics, and discovery costs. A portfolio is not automatically a hedge; it can be a bundle of correlated obligations.',
    'The disclosed 16-product Mehroz Sheikh portfolio is a useful left-tail example. It generated $855 in the latest 30 days and $555 of aggregate MRR at the cutoff, with several products between zero and a few dozen dollars. That case cannot estimate prevalence, but it shows why developer-level and app-level questions diverge—and why app count alone says little about commercial scale.',
  ],
  economics: [
    'Gross revenue is not proceeds, and proceeds are not owner profit. At $9.99 per month, 101 active subscribers produce at least $1,000 of gross billings before refunds and tax. At a 15% platform or payment fee, 118 are needed to leave $1,000 of proceeds. Under a lean scenario with $150 in monthly fixed costs and $0.25 in variable cost per subscriber, the requirement rises to 140 subscribers for $1,000 of owner profit.',
    'The gap widens for AI-heavy, content-heavy, or acquisition-dependent products. The model’s gross-revenue requirement for $1,000 of owner profit is $1,438 in a lean case, $2,143 with heavier API costs, $2,727 with paid acquisition, and $3,750 in a high-fee, high-acquisition scenario. Founder labor and personal taxes remain excluded. A public MRR screenshot cannot establish any of those cost layers.',
    'Advertising has a different denominator. A base scenario—12 sessions per monthly active user, two ad impressions per session, 90% fill, and a $5 effective CPM—requires roughly 9,260 monthly active users to generate $1,000. The modeled range is enormous: about 1,462 users in a strong engagement and pricing case versus nearly 69,445 in a conservative case. Those are scenarios, not observed market averages, and they are included precisely to show how little “number of users” says without engagement and monetization context.',
  ],
  cases: [
    'Public revenue dashboards are excellent for mechanism and terrible for prevalence. Builders disclose when they are proud, selling a product, teaching a playbook, or attracting an audience. Verification services can strengthen the revenue number while leaving acquisition cost, refunds, contractor expense, platform mix, and founder labor unknown. A case can show that an outcome is possible and explain how it happened; it cannot tell us how common the outcome is.',
    'The selected ledger intentionally keeps counterexamples next to successes. TrackAI and 3AK show subscription products in the five-figure MRR range. GurjarApp shows that a six-figure user count can coexist with zero current subscription revenue and ongoing costs. The 16-product portfolio shows that sustained output can still aggregate below the threshold. Filtering the table changes what is visible, but it never changes the model.',
  ],
  limitations: [
    'The largest missing object is an ownership-resolved longitudinal panel. Apple and Google publish store-scale counts, but not a table linking each app to an independent owner, its complete monetization stack, current gross revenue, developer proceeds, operating cost, and six or more months of history. Subscription vendors observe high-quality transaction data for selected clients. Public dashboards observe selected disclosure. Regulators observe billing metrics that can omit ads, external payments, physical goods, and cross-platform revenue.',
    'Entity resolution is the second gap. One publisher can contain several developers; one developer can publish through several accounts; an app can change hands; and the same code base can appear across platforms. The model treats apps and developers separately, but no public source can perfectly join them. The portfolio distribution and correlation assumptions are therefore explicit rather than hidden.',
    'Category and geography are also pooled. Games, health apps, utilities, education products, creator tools, and religious apps have different conversion, retention, content, and acquisition structures. Store fees and payment programs vary by country, program, and transaction type. The estimates are a cross-category orientation, not a forecast for a particular app. The right way to use them is to choose the relevant denominator, inspect the range, then replace the general assumptions with category-specific evidence as it becomes available.',
  ],
  methodology: [
    'The public package is designed to be challenged. The PDF explains the argument; the workbook carries definitions, assumptions, formulas, source classes, cases, and sensitivity tables; the evidence appendix exposes CSV and JSON files; and the Python script reproduces the headline model. Intervals are uncertainty ranges across assumptions and simulated portfolio composition, not frequentist confidence intervals from a random store sample.',
    'The evidence taxonomy is preserved across the article. Observed facts are direct statistics or dashboard values within a named cohort. Derived calculations apply transparent arithmetic to observed inputs. Modeled estimates add assumptions to bridge evidence gaps. Interpretations explain what the combination means. A precise-looking number does not move upward in that hierarchy simply because it has more decimal places.',
  ],
} as const;

export const APP_INCOME_LIMITATIONS = [
  'No unified app-store census includes ownership, revenue basis, costs, and trailing history.',
  'Subscription cohorts overrepresent apps with implemented subscription infrastructure and enough activity to meet inclusion rules.',
  'Public case dashboards are selected for disclosure, verification, or saleability and are never used as frequency counts.',
  'Advertising, external checkout, services, physical goods, and cross-platform income can be invisible to store-billing data.',
  'Persistence, app-to-developer ownership, portfolio correlation, and category mix are modeled rather than directly observed.',
  'Profit excludes founder labor and personal tax unless a sensitivity explicitly says otherwise.',
];

export const APP_INCOME_DOWNLOADS = [
  {
    label: 'Full research report',
    format: 'PDF · 30 pages',
    href: `${APP_INCOME_ASSET_BASE}/independent_app_income_distribution_report.pdf`,
    note: 'The complete narrative, definitions, model bridge, cases, caveats, and technical appendix.',
  },
  {
    label: 'Editable research report',
    format: 'DOCX',
    href: `${APP_INCOME_ASSET_BASE}/independent_app_income_distribution_report.docx`,
    note: 'Editable source document for future image, copy, and editorial revisions.',
  },
  {
    label: 'Income distribution model',
    format: 'XLSX · 17 sheets',
    href: `${APP_INCOME_ASSET_BASE}/independent_app_income_model.xlsx`,
    note: 'Definitions, estimates, assumptions, unit economics, cases, claim ledger, and chart data.',
  },
  {
    label: 'Machine-readable evidence appendix',
    format: 'ZIP · CSV / JSON / Python',
    href: `${APP_INCOME_ASSET_BASE}/independent_app_evidence_appendix.zip`,
    note: 'Portable data tables, source-quality rubric, and model-reproduction code.',
  },
  {
    label: 'Claim ledger',
    format: 'CSV',
    href: `${APP_INCOME_ASSET_BASE}/data/claim_ledger.csv`,
    note: 'Every headline claim labeled by evidence type, source or model, confidence, and caveat.',
  },
  {
    label: 'Reproduce the model',
    format: 'PYTHON',
    href: `${APP_INCOME_ASSET_BASE}/data/model_reproduction.py`,
    note: 'Seeded reproduction script for the headline Monte Carlo model.',
  },
];

export const APP_INCOME_FAQS = [
  {
    question: 'What percentage of indie app developers make $1,000 per month?',
    answer: 'The central model estimates 15.4% of developers behind meaningful commercial attempts currently generate at least $1,000 in gross monthly app revenue across their portfolios, with an 8.4% to 25.0% uncertainty range. Across all listed publishers, the modeled central estimate falls to 1.55%.',
  },
  {
    question: 'What percentage of individual apps make $1,000 per month?',
    answer: 'For serious independent apps, the central current-month estimate is 10.2%, with a 5.3% to 17.4% range. Across every listed app, including inactive and non-commercial products, the central estimate is about 1.0%.',
  },
  {
    question: 'Is $1,000 MRR the same as $1,000 profit?',
    answer: 'No. MRR usually describes recurring gross or net subscription revenue, depending on the dashboard. Developer proceeds subtract platform or payment fees. Owner profit also subtracts hosting, APIs, support, tools, contractors, acquisition, and other operating costs.',
  },
  {
    question: 'How many subscribers does a $9.99 app need?',
    answer: 'About 101 active subscribers for $1,000 gross, 118 for $1,000 of proceeds after a 15% fee, and 140 for $1,000 of owner profit under the lean cost scenario used here.',
  },
  {
    question: 'Why not use public founder revenue dashboards to calculate the success rate?',
    answer: 'Because disclosure is selected. Successful, unusual, teachable, or for-sale products are more likely to appear. Verified dashboards are useful case evidence, but their frequency cannot represent the store population.',
  },
  {
    question: 'Are these confidence intervals?',
    answer: 'No. They are plausible uncertainty intervals generated by varying evidence anchors, persistence, transfer, portfolio size, and correlation assumptions. The underlying public evidence is not a random, ownership-resolved census.',
  },
];

export const APP_INCOME_SOURCES: AppIncomeSource[] = [
  { id: 'S01', label: 'Independent Mobile App Economics research dossier', publisher: 'User-supplied research', evidenceClass: 'Internal dossier · mixed', note: 'Starting evidence map and lower-confidence founder cases; no standalone representative app dataset.', href: `${APP_INCOME_ASSET_BASE}/independent_app_income_distribution_report.pdf` },
  { id: 'S02', label: '2025 App Store Transparency Report', publisher: 'Apple', evidenceClass: 'A1 · official store data', note: 'Store inventory and search-visibility counts used to bound the broad listed-app denominator.', href: 'https://www.apple.com/legal/app-store/transparency/2025/', lastVerified: '2026-07-14' },
  { id: 'S03', label: 'Number of Android apps on Google Play', publisher: 'AppBrain', evidenceClass: 'C1 · app directory', note: 'Current directory estimate for available Android listings; not an official Google census.', href: 'https://www.appbrain.com/stats/number-of-android-apps', lastVerified: '2026-07-14' },
  { id: 'S04', label: 'Android and Google Play statistics', publisher: 'AppBrain', evidenceClass: 'C1 · app directory', note: 'Ratings and paid-app shares used as noisy activity and commercialization proxies.', href: 'https://www.appbrain.com/stats', lastVerified: '2026-07-14' },
  { id: 'S05', label: 'Android apps with in-app billing', publisher: 'AppBrain', evidenceClass: 'C1 · library detection', note: 'In-app billing library detection; can miss apps and does not establish current revenue.', href: 'https://www.appbrain.com/stats/in-app-billing-android-applications', lastVerified: '2026-07-14' },
  { id: 'S06', label: 'Google mobile platform final decision', publisher: 'UK Competition and Markets Authority', evidenceClass: 'A2 · regulatory decision', note: 'Evidence that more than 90% of Play-distributing developers generated no revenue through Google Play Billing; other revenue may be invisible.', href: 'https://assets.publishing.service.gov.uk/media/68f8bf4780cf98c6e8ed8f83/Final_decision_report.pdf', lastVerified: '2026-07-14' },
  { id: 'S07', label: 'State of Subscription Apps 2026', publisher: 'RevenueCat', evidenceClass: 'B1 · transaction cohort', note: 'Primary threshold anchor, revenue distribution, conversion, and revenue-per-install evidence for selected subscription apps.', href: 'https://www.revenuecat.com/state-of-subscription-apps/', lastVerified: '2026-07-14' },
  { id: 'S08', label: 'State of In-App Subscriptions 2026', publisher: 'Adapty', evidenceClass: 'B1/C1 · vendor cohort', note: 'Median and concentration evidence from a separate selected subscription-app cohort.', href: 'https://adapty.io/state-of-in-app-subscriptions/', lastVerified: '2026-07-14' },
  { id: 'S09', label: 'Subscription revenue concentration analysis', publisher: 'Adapty', evidenceClass: 'C1 · vendor analysis', note: 'Top-decile concentration and new-app lifetime bands; used with caution because the framing is promotional.', href: 'https://adapty.io/blog/app-subscription-revenue-concentration/', lastVerified: '2026-07-14' },
  { id: 'S10', label: 'Small Business Developers and App Creators', publisher: 'Analysis Group / Apple', evidenceClass: 'B2 · sponsored study', note: 'Small-developer context; the study excludes developers below its annual download threshold.', href: 'https://www.apple.com/newsroom/pdfs/small-business-developers-and-app-creators-on-the-app-store-in-2022.pdf' },
  { id: 'S11', label: 'App Store Small Business Program', publisher: 'Apple Developer', evidenceClass: 'A1 · official fee rule', note: '15% reduced commission for qualifying developers; eligibility and transaction details apply.', href: 'https://developer.apple.com/app-store/small-business-program/', lastVerified: '2026-07-14' },
  { id: 'S12', label: 'Google Play service fees', publisher: 'Google Play Console Help', evidenceClass: 'A1 · official fee rule', note: 'Fee schedules vary by program, region, and transaction type; 15% is used only as a common modeling benchmark.', href: 'https://support.google.com/googleplay/android-developer/answer/112622', lastVerified: '2026-07-14' },
  { id: 'S13', label: 'The App Economy Consolidates Before the Next Gold Rush', publisher: 'Developer Nation / VisionMobile', evidenceClass: 'B2/C2 · founder survey', note: 'Historical evidence for a large zero and sub-$100 tail; stale and self-selected.', href: 'https://www.developernation.net/blog/the-app-economy-consolidates-before-the-next-gold-rush/' },
  { id: 'S14', label: 'Google Play Is Not a Long Tail Market', publisher: 'Zhong and Michahelles', evidenceClass: 'B2 · academic study', note: 'Historical transaction evidence for superstar-market concentration.', href: 'https://cocoa.ethz.ch/downloads/2013/06/None_p499-zhong.pdf' },
  { id: 'S15', label: 'Impact of Revenue Models on Mobile App Market Performance', publisher: 'International Journal of Research in Marketing', evidenceClass: 'B2 · academic study', note: 'App-level evidence that monetization effects differ by category; focused on newly launched US iOS games and productivity apps.', href: 'https://doi.org/10.1016/j.ijresmar.2021.11.004' },
  { id: 'S16', label: 'lovelee revenue profile', publisher: 'TrustMRR', evidenceClass: 'C2 · verified dashboard', note: 'Selected current case; revenue verification does not resolve acquisition cost or long-run persistence.', href: 'https://trustmrr.com/startup/lovelee', lastVerified: '2026-07-14' },
  { id: 'S17', label: 'TrackAI revenue profile', publisher: 'TrustMRR', evidenceClass: 'C2 · verified dashboard', note: 'Selected upper-tail case; current revenue is linked, while profit and margin remain founder claims.', href: 'https://trustmrr.com/startup/trackai', lastVerified: '2026-07-14' },
  { id: 'S18', label: '3AK Track & Field revenue profile', publisher: 'TrustMRR', evidenceClass: 'C2 · verified dashboard', note: 'Selected upper-tail case with seasonality and sale-listing selection.', href: 'https://trustmrr.com/startup/3ak-track-field', lastVerified: '2026-07-14' },
  { id: 'S19', label: 'GurjarApp revenue profile', publisher: 'TrustMRR', evidenceClass: 'C2 · verified dashboard', note: 'Counterexample showing that a large stated user base does not imply current monetization.', href: 'https://trustmrr.com/startup/gurjarapp-social-media-platform', lastVerified: '2026-07-14' },
  { id: 'S20', label: 'Mehroz Sheikh founder portfolio', publisher: 'TrustMRR', evidenceClass: 'C2 · verified portfolio', note: 'Developer-level left-tail case with 16 disclosed products and multiple zero or low-revenue listings.', href: 'https://trustmrr.com/founder/mehroz__sheikh', lastVerified: '2026-07-14' },
  { id: 'S21', label: 'Bibly revenue profile', publisher: 'TrustMRR', evidenceClass: 'C2 · verified dashboard', note: 'Selected near-$5,000 MRR case; recurrence definitions and founder claims still require care.', href: 'https://trustmrr.com/startup/bibly', lastVerified: '2026-07-14' },
];
