import type { ResearchArticle } from './articleModels';
import { THE_AI_MEGAWATT_CAPACITY_SECTIONS } from './theAiMegawattCapacitySections';
import { THE_AI_MEGAWATT_MODEL_SECTIONS } from './theAiMegawattModelSections';
import { THE_AI_MEGAWATT_OUTPUT_SECTIONS } from './theAiMegawattOutputSections';
import { THE_AI_MEGAWATT_SOURCES } from './theAiMegawattSources';

export const THE_AI_MEGAWATT_ARTICLE_SLUG = 'the-ai-megawatt';
export const THE_AI_MEGAWATT_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'ai-systems',
  slug: THE_AI_MEGAWATT_ARTICLE_SLUG,
  number: '16',
  category: 'AI INFRASTRUCTURE',
  title: 'The AI Megawatt Is Not a Megawatt',
  seoTitle: 'What 1 GW of AI Data Center Power Actually Means',
  subtitle: 'What a 1 GW data center means from grid interconnection to GB300 rack capacity.',
  seoDescription: 'A current GB300 model translating a 1 GW data-center claim across grid interconnection, facility power, PUE, network overhead, rack capacity, installed GPUs, and utilization.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Grid / facility / compute',
    note: 'A capacity ladder from electrical boundary to installed and utilized accelerators.',
  },
  date: '2026.08.16',
  lastVerified: '2026.08.16',
  readTime: '28 MIN',
  author: 'SULAYMAN BOWLES',
  thesis: 'A bare 1 GW claim is not convertible into GPUs until its electrical boundary, status, and time basis are known; under an explicit 1 GW facility-nameplate reference design, the result is about 403,000 installed B300 GPUs, not a universal ratio.',
  conclusion: {
    title: 'Define the boundary before dividing by the rack',
    content: 'For a GB300 reference design, 1 GW of total-facility nameplate supports about 402,574 installed B300 GPUs in the reference case, versus roughly 355,819–434,856 across engineering sensitivities. Requested interconnection capacity alone supports no defensible fleet estimate. Keep grid, facility, IT, rack, installed fleet, average draw, computational utilization, and commercial utilization separate.',
  },
  evidenceBoundary: 'This is a homogeneous GB300 reference conversion, not a forecast of any named data center. The 142 kW rack value is an “up to” specification; PUE and external-IT factors are scenarios; the 50% interconnection-utilization example is illustrative; network power is incomplete beyond the documented eight-SU design; computational utilization does not equal useful work or revenue utilization.',
  metrics: [
    { label: 'Reference fleet', value: '402,574 B300s' },
    { label: 'Facility sensitivity', value: '356K–435K B300s' },
    { label: '1 GW IT boundary', value: '461K B300s' },
    { label: 'Research cutoff', value: '2026.08.16' },
  ],
  resources: [
    {
      label: 'Capacity conversion model',
      href: '/research/the-ai-megawatt-model.xlsx',
      description: 'Formula-driven facility, IT, rack, network, utilization, and sensitivity workbook.',
      format: 'XLSX',
    },
    {
      label: 'Source index',
      href: '/research/the-ai-megawatt-source-ledger.csv',
      description: 'Primary and secondary sources with claims, definitions, limitations, and provenance.',
      format: 'CSV',
    },
    {
      label: 'Claim table',
      href: '/research/the-ai-megawatt-claim-ledger.csv',
      description: 'Load-bearing claims classified as observed, derived, scenario, or interpretation.',
      format: 'CSV',
    },
    {
      label: 'Methodology appendix',
      href: '/research/the-ai-megawatt-methodology.md',
      description: 'Research contract, definitions, formulas, provenance, contradictions, and calculation checks.',
      format: 'MD',
    },
    {
      label: 'Sensitivity data',
      href: '/research/the-ai-megawatt-sensitivity.csv',
      description: 'PUE-by-external-IT-overhead matrix for installed B300 GPU equivalents.',
      format: 'CSV',
    },
  ],
  content: [
    'A one-gigawatt AI data center can mean at least four different things. It may be a requested grid interconnection, a total facility nameplate, an IT nameplate, or an average electrical draw. Those quantities are related, but they are not interchangeable. A bare “1 GW” claim therefore does not identify a GPU fleet.',
    'Under one explicit reference design—1,000 MW of total facility nameplate, PUE 1.145, 10% external IT overhead, and homogeneous NVIDIA GB300 NVL72 racks—the arithmetic supports about 5,591 rack equivalents and 402,574 installed B300 GPUs. Moving the facility and IT-overhead assumptions produces a scenario band of roughly 355,819 to 434,856 GPUs. The range is an engineering sensitivity, not a confidence interval.',
    'Change the boundary and the result changes before any hardware assumption does. If “1 GW” means IT nameplate, the same 10% external-IT allowance supports about 460,948 GPUs. If it means a grid interconnection request operating at an illustrative 50% average utilization, it implies 500 MW of average facility demand and 4.38 TWh per year, but installed GPU count remains underdetermined.',
    'The article builds a conversion contract rather than a universal answer. It begins with the electrical boundary, follows power through PUE and non-rack IT, uses the current GB300 rack and network reference architecture, and then separates installed accelerators from annual computational utilization. When a disclosure lacks the fields needed for that chain, the model stops instead of inventing precision.',
  ],
  sections: [
    ...THE_AI_MEGAWATT_CAPACITY_SECTIONS,
    ...THE_AI_MEGAWATT_MODEL_SECTIONS,
    ...THE_AI_MEGAWATT_OUTPUT_SECTIONS,
  ],
  sources: THE_AI_MEGAWATT_SOURCES,
};
