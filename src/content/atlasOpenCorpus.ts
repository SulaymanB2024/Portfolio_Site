export const ATLAS_OPEN_CORPUS_RUN = {
  id: 'quotes-to-scrape-2026-07-16',
  corpusName: 'Quotes to Scrape',
  corpusUrl: 'https://quotes.toscrape.com/',
  capturedAt: '2026-07-16T16:14:17Z',
  captureMethod: 'Bounded direct HTTPS source capture; no live crawl occurs during portfolio builds.',
  scope: 'Two public demonstration pages selected to show static and JavaScript-authored content states.',
  claimLimit: 'This is a reproducible technical demonstration, not an audit of the corpus owner or a claim about search performance.',
  artifacts: {
    manifest: '/research/atlas-open-corpus-run-2026-07-16.json',
    csv: '/research/atlas-open-corpus-run-2026-07-16.csv',
  },
} as const;

export const atlasOpenCorpusRows = [
  {
    url: 'https://quotes.toscrape.com/',
    status: '200',
    indexability: 'not-evaluated',
    depth: '0',
    inlinks: 'seed',
    outlinks: '47',
    canonical: 'not-present-in-source',
    issue: 'static quote cards observed',
    confidence: 'high',
    renderState: 'source and visible quote-card markup align',
    note: 'Ten quote-card elements were present in the captured source HTML.',
  },
  {
    url: 'https://quotes.toscrape.com/js/',
    status: '200',
    indexability: 'not-evaluated',
    depth: '1',
    inlinks: 'discovered from corpus navigation',
    outlinks: '3',
    canonical: 'not-present-in-source',
    issue: 'render-dependent quote output',
    confidence: 'high',
    renderState: 'source contains JSON data and a document.write quote-card loop',
    note: 'The raw HTML has no quote-card element; the page script declares ten records and writes quote-card markup at runtime.',
  },
] as const;

export const atlasOpenCorpusFindings = [
  {
    label: 'Raw versus rendered state',
    observation: 'The JavaScript route returns a 200 response, but its quote content is authored by a client-side document.write loop rather than present as quote-card elements in source HTML.',
    derivation: 'The captured source contains ten JSON records and one runtime loop; source inspection contains no rendered quote-card element.',
    confidence: 'High',
    action: 'Use a renderer before making content-coverage claims for this route.',
  },
  {
    label: 'Canonical field is absent in source',
    observation: 'Neither captured page declares a rel=canonical element in its source response.',
    derivation: 'The field was absent from both bounded source captures.',
    confidence: 'High observation / no severity assigned',
    action: 'Record the field for review; do not infer a defect or outcome from this corpus-only demonstration.',
  },
  {
    label: 'Pagination is a crawl path',
    observation: 'Both sampled pages expose an explicit next-page URL in their HTML.',
    derivation: 'The navigation links point to /page/2/ and /js/page/2/.',
    confidence: 'High',
    action: 'Preserve the discovered paths in the crawl ledger and test them independently on a later bounded run.',
  },
] as const;
