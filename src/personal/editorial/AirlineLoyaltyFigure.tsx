import type { ArticleFigure } from './types'
import './airline-loyalty-figure.css'

type FinancingStage = { title: string; detail: string }
type FinancingFact = { before: string; value?: string; after?: string }
type LoyaltyProgram = { name: string; stages: FinancingStage[]; facts: FinancingFact[] }

// Transcribed from the retained Exhibit 6 PNG. Amounts, collection controls and
// repayment/state dates are corroborated by the retained article's debt sections.
const programs: LoyaltyProgram[] = [
  {
    name: 'American AAdvantage',
    stages: [
      { title: 'Co-brand + intercompany agreements', detail: 'IP, data, licenses, SPV equity' },
      { title: 'Pledged collection account', detail: '90% direct-deposit target' },
      { title: 'Waterfall', detail: 'fees -> interest -> principal -> reserve' },
      { title: 'Excess cash to airline', detail: 'unless DSCR / reserve trigger' },
    ],
    facts: [
      { before: '2021: ', value: '$10.0bn', after: ' financing [R]' },
      { before: '2025: ', value: '+$1.0bn', after: ' term loan [R]' },
      { before: 'Peak DSCR test: ', value: '2.0x', after: ' [R]' },
      { before: 'Status: active at March 31, 2026 [R]' },
    ],
  },
  {
    name: 'United MileagePlus',
    stages: [
      { title: 'Co-brand + intercompany agreements', detail: 'Contributed IP, member data, license-back' },
      { title: 'Revenue / collection accounts', detail: '90% collections; daily sweep' },
      { title: 'Waterfall', detail: 'fees -> interest -> principal -> reserve' },
      { title: 'Excess cash to United', detail: 'unless DSCR / reserve trigger' },
    ],
    facts: [
      { before: '2020: ', value: '$6.8bn', after: ' financing [R]' },
      { before: 'Peak DSCR test: ', value: '2.0x', after: ' [R]' },
      { before: 'Term loan repaid July 2024 [R]' },
      { before: 'Notes redeemed July 2025 [R]' },
    ],
  },
]

export function hasAirlineLoyaltyFigure(src: string) {
  return src.split('/').at(-1) === 'airline-loyalty-backed-financing.png'
}

export default function AirlineLoyaltyFigure({ figure }: { figure: ArticleFigure }) {
  if (!hasAirlineLoyaltyFigure(figure.src)) return null
  return <div className="airline-loyalty-figure" role="group" aria-label={figure.alt}>
    <header className="loyalty-financing-heading">
      <h3>Exhibit 6. Loyalty-backed financing structures</h3>
      <p>American and United used the same core design: isolate assets, direct collections, service debt, then release excess cash.</p>
    </header>
    <div className="loyalty-financing-comparison">{programs.map(program => <section className="loyalty-financing-column" key={program.name} aria-label={program.name}>
      <h4>{program.name}</h4>
      <ol className="loyalty-financing-steps" aria-label={`${program.name} collection waterfall`}>{program.stages.map(stage => <li key={stage.title}>
        <h5>{stage.title}</h5><p>{stage.detail}</p>
      </li>)}</ol>
      <ul className="loyalty-financing-facts" aria-label={`${program.name} financing and dated status`}>{program.facts.map(fact => <li key={fact.before}>
        {fact.before}{fact.value && <strong className="loyalty-financing-amount">{fact.value}</strong>}{fact.after}
      </li>)}</ul>
    </section>)}</div>
  </div>
}
