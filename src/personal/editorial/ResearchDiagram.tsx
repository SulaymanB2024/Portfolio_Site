import type { ArticleFigure } from './types'
import './research-diagrams.css'

type CapitalNode = { name: string; detail: string }
type CapitalColumn = { label: string; nodes: CapitalNode[] }
type CapitalMap = { columns: CapitalColumn[]; boundary: string }

// These are readable reconstructions of the supplied charts, not new research.
// Amounts and instrument status follow the matching public/research workbooks:
// Waymo: Equity Financing + Source Inputs; hidden financing: 05_Capital_Stacks,
// 13_Asset_Ownership + 23_Loss_Waterfalls. Unknown title and recourse stay unknown.
const capitalMaps: Record<string, CapitalMap> = {
  'waymo-capital-stack.png': {
    columns: [
      { label: 'Funding', nodes: [
        { name: 'Alphabet', detail: '$13.1–22.0B modeled cumulative contribution; exact round shares undisclosed.' },
        { name: 'Outside investors', detail: 'Financial and strategic equity investors participate in the disclosed rounds.' },
        { name: '$27.1–27.35B', detail: 'Disclosed 2020–2026 rounds. The 2020 total is disputed; the July 2024 commitment is excluded to avoid double counting.' },
      ] },
      { label: 'Waymo / controlled entities', nodes: [
        { name: 'Consolidated VIE', detail: 'Within Alphabet. Consolidation does not establish an asset-finance SPV.' },
        { name: 'Capital uses', detail: 'R&D, operating losses, vehicles, autonomy integration, depots, charging and working capital.' },
      ] },
      { label: 'Operations & receipts', nodes: [
        { name: 'OEMs, Magna & fleet partners', detail: 'Vehicle supply, Mesa integration and selected fleet operations.' },
        { name: 'Waymo One / Uber → riders', detail: 'Uber bookings in Austin and Atlanta. Rider fares differ from recognized Waymo revenue; settlement terms are undisclosed.' },
      ] },
    ],
    boundary: 'No quantified Waymo-level debt, fleet lease, customer funding or public financing was established in this record. Asset title, guarantees and residual-value allocation remain unresolved; Alphabet is the visible economic backstop.',
  },
  'hidden-financing-waymo-capital-stack.png': {
    columns: [
      { label: 'Capital providers', nodes: [
        { name: 'Alphabet', detail: 'Significant majority of the $16.0B 2026 round; exact contribution undisclosed.' },
        { name: 'Outside equity', detail: '$21.6B total visible equity across the 2024 and 2026 rounds, including parent funding.' },
      ] },
      { label: 'Entity & physical assets', nodes: [
        { name: 'Waymo LLC / consolidated VIE', detail: 'Technology control and service brand.' },
        { name: 'Robotaxis, Mesa, depots', detail: 'Waymo + Magna integration; vehicle title by city and depot ownership or lease signers are undisclosed.' },
      ] },
      { label: 'Operators & customers', nodes: [
        { name: 'Uber', detail: 'Austin / Atlanta fleet management, dispatch and depot operations.' },
        { name: 'Moove & Magna', detail: 'Moove: Phoenix / Miami fleet operations and charging. Magna: vehicle integration.' },
        { name: 'Riders', detail: 'Uber app or Waymo One; fare allocation partly undisclosed.' },
      ] },
    ],
    boundary: 'Operating losses and asset write-downs fall economically on Waymo equity and continued parent support. No disclosed asset lender; city-specific title, insurance, leases and guarantees remain unknown.',
  },
  'hidden-financing-serve-capital-stack.png': {
    columns: [
      { label: 'Capital providers', nodes: [
        { name: 'Common equity', detail: 'Primary cash source for operations and fleet growth.' },
        { name: 'Farnam', detail: '$4.46M original equipment-financing cost, mostly repaid by 2025; not a year-end liability.' },
        { name: 'Magna & component suppliers', detail: '2.145M-share warrant at $0.01; manufacturing support and non-cancellable component commitments.' },
      ] },
      { label: 'Entities & assets', nodes: [
        { name: 'Serve Robotics Inc.', detail: 'Corporate equity and supplier warrant.' },
        { name: 'Serve Operating Co.', detail: 'Owns and operates the robot fleet; tooling and components become completed units.' },
        { name: 'Financed robots', detail: 'Serve-owned collateral. The failed sale-leaseback was secured financing.' },
      ] },
      { label: 'Demand & cash flow', nodes: [
        { name: 'Uber Eats / merchants', detail: 'Orders and delivery demand; no material prepayment disclosed.' },
        { name: 'Delivery & branding revenue', detail: 'Operating cash returns to Serve Operating Co.; scheduled finance and purchase commitments persist when utilization falls.' },
      ] },
    ],
    boundary: 'The secured creditor has first claim on financed robot collateral while its claim remains outstanding. Serve equity retains utilization and residual-value risk; the Magna warrant represents dilution, not cash proceeds.',
  },
  'hidden-financing-anduril-capital-stack.png': {
    columns: [
      { label: 'Capital & support', nodes: [
        { name: 'Private equity', detail: '$1.5B in 2024, $2.5B reported in 2025 and $5.0B in 2026; corporate uses are not allocated publicly.' },
        { name: 'JobsOhio', detail: '$310M grant commitment, subject to jobs, payroll and capex conditions.' },
        { name: 'Ohio incentives', detail: '$70M requested site support. The 2.594% refundable credit runs for 30 years; $452.3M nominal future value is conditional.' },
      ] },
      { label: 'Arsenal-1 investment', nodes: [
        { name: 'Anduril Industries', detail: 'Factory owner and project entity not disclosed.' },
        { name: 'Factory & production lines', detail: '$910.5M minimum ten-year capex commitment; inventory, work in progress and supplier amounts are not public.' },
      ] },
      { label: 'Demand & operating cash', nodes: [
        { name: 'U.S. DoD / Army', detail: 'Customer contracts and procurement ceilings support demand.' },
        { name: 'Milestone / product revenue', detail: 'Progress-payment terms are not public. A contract ceiling is not prepaid asset capital.' },
      ] },
    ],
    boundary: 'Equity bears the first economic loss. Public support depends on collection, compliance and clawback terms; committed grants and future credits are not all cash received. No factory loan, equipment lease or customer advance was disclosed in this record.',
  },
  'hidden-financing-northvolt-capital-stack.png': {
    columns: [
      { label: 'Capital & credit support', nodes: [
        { name: 'Equity & project lenders', detail: '23 commercial banks, EIB and NIB: $5.0B non-recourse project package committed; draw amount unknown.' },
        { name: 'OEM offtakes', detail: 'More than $55B headline contracts support bankability, not financing cash.' },
        { name: 'Public guarantors', detail: 'Swedish state, InvestEU and export-credit support; guarantee exposure is contingent.' },
      ] },
      { label: 'Entities & physical project', nodes: [
        { name: 'Northvolt AB → Northvolt Ett AB', detail: 'Parent equity funds the project entity for the Skellefteå factory and recycling assets.' },
        { name: 'Factory, inventory & work in progress', detail: 'Specialized assets and incomplete ramp; project lenders hold security over project assets and cash.' },
      ] },
      { label: 'Distress & rescue liquidity', nodes: [
        { name: 'Chapter 11 debtors / estate', detail: '$30M filing cash against $5.8B debt. BMW cancelled a €2B order; support was suspended.' },
        { name: 'Scania / customer DIP', detail: '$100M approved / available rescue facility with superpriority; not evidence that the old stack recovered its value.' },
      ] },
    ],
    boundary: 'Project and parent equity absorb losses; recoveries of secured lenders, guarantors, suppliers and customers depend on collateral, contracts and jurisdiction. Ring-fencing reallocates loss. It does not remove execution risk.',
  },
}

function FundingMap({ map }: { map: CapitalMap }) {
  return <div className="research-diagram research-funding-map">
    <div className="research-funding-columns">
      {map.columns.map(column => <section className="research-funding-column" key={column.label} aria-label={column.label}>
        <p className="research-funding-label">{column.label}</p>
        <dl>{column.nodes.map(node => <div key={node.name}>
          <dt>{node.name}</dt><dd>{node.detail}</dd>
        </div>)}</dl>
      </section>)}
    </div>
    <p className="research-diagram-boundary">{map.boundary}</p>
  </div>
}

// The original CoreWeave graph mixes corporate totals with individual borrower
// links. Keep those two levels apart and avoid a universal seniority waterfall.
function CoreWeaveMap() {
  const contracts = [
    ['CCAC VII LLC / DDTL 3', 'GPU / server collateral', 'Parent guarantee'],
    ['CCAC VIII LLC / DDTL 4', 'GPU / server collateral', 'Non-recourse except carve-outs'],
    ['DDTL V LLC / DDTL 5', 'Customer-deployment GPU pool', 'Borrower-specific assets and cash waterfall'],
    ['New Jersey campus JV', '15% CoreWeave / 85% developer', '$51M carrying value; $95M guarantee and up to $200M funding'],
  ]
  return <div className="research-diagram research-coreweave-map">
    <dl className="research-financing-totals" aria-label="CoreWeave FY2025 consolidated obligations">
      <div><dt>Debt principal</dt><dd>$21.615B</dd></div>
      <div><dt>Lease liabilities</dt><dd>$8.449B</dd></div>
      <div><dt>Deferred revenue</dt><dd>$8.185B</dd></div>
    </dl>
    <div className="research-contract-map" aria-label="CoreWeave borrower and joint-venture relationships">
      <div className="research-contract-parent"><strong>CoreWeave, Inc.</strong><span>Equity, corporate debt and guarantees on selected facilities</span></div>
      <dl className="research-contract-entities">{contracts.map(([entity, assets, recourse]) => <div key={entity}>
        <dt>{entity}</dt><dd><span>{assets}</span><span>{recourse}</span></dd>
      </div>)}</dl>
    </div>
    <dl className="research-contract-cash">
      <div><dt>Asset lenders</dt><dd>Interest and principal; first claim on the relevant collateral pool.</dd></div>
      <div><dt>Landlords & vendors</dt><dd>Leased infrastructure and $368M software financing create fixed claims.</dd></div>
      <div><dt>Cloud customers</dt><dd>Take-or-pay plus 15–25% prepayments; compute delivery obligations remain.</dd></div>
    </dl>
    <p className="research-diagram-boundary">Parent guarantees, leases, customer contracts and borrower waterfalls determine recourse and loss order. Consolidated totals do not allocate balances to each entity.</p>
  </div>
}

type PropertyStack = { property: string; evidence: string; amounts: number[] }

// Source: west-campus-property-models.xlsx. SkyLoft: B83 total uses less B94
// mortgage and B99 preferred; other properties: B94 debt + B106 residual value.
// Values are in $ millions. Residual equity is a model value, not funding raised.
const propertyStacks: PropertyStack[] = [
  { property: 'SkyLoft', evidence: '2019 disclosed debt and preferred; common derived from total uses', amounts: [36, 30.125, 35, 23.241118] },
  { property: '2400 Nueces', evidence: 'Illustrative RFS-bond allocation; actual project balance not public', amounts: [42, 0, 0, 63.48110952380952] },
  { property: 'Waterloo', evidence: 'Owner established; current debt illustrative', amounts: [88, 0, 0, 68.29360727272728] },
  { property: 'The Standard', evidence: '2018 construction loan established; current recap debt illustrative', amounts: [95, 0, 0, 68.30936873043478] },
  { property: 'Callaway', evidence: 'Platform established; current debt illustrative', amounts: [62.5, 0, 0, 85.73602772727272] },
  { property: '26 West', evidence: 'Acquisition established; current debt illustrative', amounts: [38.79, 0, 0, 137.80445533333334] },
]
const stackLayers = ['Senior / modeled debt', 'Subordinate mortgage', 'Preferred equity', 'Common / residual equity']
const money = (amount: number, decimals = 1) => `$${amount.toFixed(decimals)}M`

function PropertyStacks() {
  return <div className="research-diagram research-property-stacks">
    <div className="research-stack-scale" aria-hidden="true"><span>$0</span><span>$100M</span><span>$200M</span></div>
    <ol className="research-stack-properties">{propertyStacks.map((row, index) => <li key={row.property}>
      <div className="research-stack-heading"><strong>{row.property}</strong><span>{row.evidence}</span></div>
      <div className="research-stack-bar" aria-hidden="true">{row.amounts.map((amount, layer) => amount > 0 && <span className={`research-stack-layer-${layer}`} key={layer} style={{ width: `${amount / 200 * 100}%` }} />)}</div>
      <dl className="research-stack-values">{row.amounts.map((amount, layer) => amount > 0 && <div key={layer}>
        <dt><span className={`research-stack-key research-stack-layer-${layer}`} aria-hidden="true" />{stackLayers[layer]}</dt><dd>{money(amount, index === 0 ? layer === 1 ? 3 : layer === 3 ? 2 : 1 : 1)}</dd>
      </div>)}</dl>
    </li>)}</ol>
    <p className="research-diagram-boundary">Only SkyLoft has a disclosed loan stack in the package. The other five bars pair illustrative debt with modeled residual equity; they do not report current financing balances.</p>
  </div>
}

export function hasResearchDiagram(src: string) {
  const name = src.split('/').at(-1) || ''
  return Object.hasOwn(capitalMaps, name) || name === 'hidden-financing-coreweave-capital-stack.png' || name === 'west-campus-capital-stack.png'
}

export default function ResearchDiagram({ figure }: { figure: ArticleFigure }) {
  const name = figure.src.split('/').at(-1) || ''
  if (name === 'hidden-financing-coreweave-capital-stack.png') return <CoreWeaveMap />
  if (name === 'west-campus-capital-stack.png') return <PropertyStacks />
  const map = capitalMaps[name]
  return map ? <FundingMap map={map} /> : null
}
