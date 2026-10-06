import type { ArticleFigure } from './types'
import './research-process.css'

// Readable reconstructions of the retained source figures. Airline values are
// estimated in the supplied financing report and four-clocks/cash-is-not-revenue
// manuscript sections. Waymo amounts use the more precise retained manuscript
// and Downside Scenarios / Residual Value worksheets, not rounded bitmap labels.
const downsideStages = [
  ['Demand shock', 'Paid trips or fares fall; factory delays or partner and regulatory limits reduce service.'],
  ['Cash-flow effect', 'Ride revenue falls immediately. Energy and some maintenance decline; other costs respond slowly.'],
  ['Fixed-cost pressure', 'Insurance, depots and support remain largely fixed. Depreciation persists; corporate R&D is outside this fleet model.'],
  ['Funding response', 'Use operating cash, slow expansion or raise equity. No Waymo debt trigger was disclosed in the record.'],
  ['Equity loss', 'Waymo equity absorbs burn; outside investors and Alphabet lose value. Alphabet may fund, restructure or stop.'],
]
const fleetCases = [
  { label: 'Base fleet contribution', value: '$33.0M', amount: 33 },
  { label: '25% utilization shock', value: '−$18.3M', amount: -18.3 },
  { label: '25% revenue shock', value: '−$61.5M', amount: -61.5 },
]

function WaymoDownside() {
  return <div className="research-process research-waymo-downside">
    <ol className="research-downside-flow" aria-label="Waymo economic downside transmission">
      {downsideStages.map(([title, detail], index) => <li key={title}>
        <span className="research-process-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <strong>{title}</strong><p>{detail}</p>
      </li>)}
    </ol>
    <div className="research-process-case-heading">Modeled annual contribution after depreciation</div>
    <dl className="research-process-cases">{fleetCases.map(row => {
      const endpoint = 100 + row.amount / 61.5 * 90
      return <div key={row.label}>
        <dt>{row.label}</dt><dd><strong>{row.value}</strong>
          <svg viewBox="0 0 160 24" aria-hidden="true">
            <path d="M100 1V23" className="research-process-zero" />
            <rect x={Math.min(100, endpoint)} y="7" width={Math.abs(endpoint - 100)} height="10" />
          </svg>
        </dd>
      </div>
    })}</dl>
    <div className="research-asset-branch">
      <div><strong>Asset obsolescence / liquidation</strong><p>Custom autonomy hardware can have weak resale. Battery degradation and removal costs reduce recovery.</p><span className="research-residual-range">$185.3–940.5M</span><span className="research-residual-label">Modeled residual-value exposure</span></div>
      <div><strong>Vehicle owner / residual guarantor</strong><p>Likely Waymo / Alphabet for owned assets. A partner or lessor bears loss only if contracts avoid buybacks, guarantees and service recourse.</p></div>
    </div>
    <p className="research-process-note">Economic transmission differs from legal bankruptcy priority. Title, security and guarantees remain unresolved. If debt or leases are added, contracts can introduce cash traps, borrowing-base cuts, repossession and parent cure rights.</p>
  </div>
}

type ClockEvent = { label: string; detail: string; estimated?: boolean }
const loyaltyStages: { stage: string; events: ClockEvent[] }[] = [
  { stage: 'Day 0', events: [
    { label: 'Cash', detail: 'Card purchase; no airline cash.' },
    { label: 'Accounting', detail: 'No airline entry.' },
    { label: 'Fulfillment', detail: '1,000 points post to the member.' },
    { label: 'Financing', detail: 'No lender event.' },
  ] },
  { stage: 'Month +1', events: [
    { label: 'Cash', detail: 'Issuer pays about $12.', estimated: true },
    { label: 'Accounting', detail: '$4.80 current revenue; $7.20 contract liability.', estimated: true },
    { label: 'Fulfillment', detail: 'No travel yet.' },
    { label: 'Financing', detail: 'Cash may enter a pledged account.' },
  ] },
  { stage: 'Years 0–2', events: [
    { label: 'Cash', detail: 'Cash is held or deployed.' },
    { label: 'Accounting', detail: 'Award liability remains outstanding.' },
    { label: 'Fulfillment', detail: 'Expected wait about 1.7 years, conditional on redemption.', estimated: true },
    { label: 'Financing', detail: 'Debt service and reserves come first within the pledged cash waterfall.' },
  ] },
  { stage: 'Resolution', events: [
    { label: 'Cash', detail: 'No new issuer cash; fulfillment costs can arise.' },
    { label: 'Accounting', detail: 'Passenger / other revenue or proportional breakage recognition.' },
    { label: 'Fulfillment', detail: 'Airline flight, partner award or never redeemed.' },
    { label: 'Financing', detail: 'Excess cash release or early amortization, per financing terms.' },
  ] },
]

function LoyaltyClocks() {
  return <div className="research-process research-loyalty-clocks">
    <p className="research-clock-estimate-note">1,000 points · Base-model estimates; issuer prices and contract allocation are not publicly disclosed.</p>
    <ol className="research-clock-stages" aria-label="Four clocks from point issuance to resolution">
      {loyaltyStages.map(({ stage, events }) => <li key={stage}>
        <strong className="research-clock-stage">{stage}</strong>
        <dl>{events.map(event => <div key={event.label}>
          <dt>{event.label}</dt><dd>{event.detail}{event.estimated && <span className="research-clock-estimated">Estimated</span>}</dd>
        </div>)}</dl>
      </li>)}
    </ol>
    <p className="research-process-note">Card spending, partner payment, revenue recognition, award delivery and lender collections are separate events. The contract liability usually settles through service; it is not a conventional loan. Breakage estimates nonredemption rather than legal expiration.</p>
  </div>
}

export function hasResearchProcess(src: string) {
  const name = src.split('/').at(-1)
  return name === 'waymo-downside-waterfall.png' || name === 'airline-loyalty-cash-conversion-cycle.png'
}

export default function ResearchProcess({ figure }: { figure: ArticleFigure }) {
  const name = figure.src.split('/').at(-1)
  if (name === 'waymo-downside-waterfall.png') return <WaymoDownside />
  if (name === 'airline-loyalty-cash-conversion-cycle.png') return <LoyaltyClocks />
  return null
}
