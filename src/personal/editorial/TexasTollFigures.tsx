import type { ArticleFigure } from './types'
import './texas-toll-figures.css'

const images = {
  questions: 'texas-toll-roads-stay-tolled-five-questions.svg',
  comparison: 'texas-toll-roads-stay-tolled-100.svg',
  cash: 'texas-toll-roads-stay-tolled-hctra-cash.svg',
}

// Responsive reconstructions of the three retained SVGs. The comparison keeps
// the two-decimal amounts in the accompanying manuscript/formula table, rather
// than calculating missing labels from rounded SVG geometry. No new research.
const questions = [
  ['Initial project cost', 'Has cumulative net cash recovered the historical build cost?'],
  ['Road-level debt', 'Does this facility still have identifiable standalone debt?'],
  ['System debt and pledges', "Can this road's revenue support pooled obligations elsewhere?"],
  ['Legal tolling authority', 'Does a public body still have statutory power to charge?'],
  ['Concession rights', 'Does a private contract preserve revenue rights through a stated term?'],
]
const categories = ['Operations', 'Repair & maintenance', 'Debt service', 'Required reserve']
const systems = [
  { name: 'CTTS', amounts: [30.17, 19.29, 47.49, 3.05] },
  { name: 'Grand Parkway', amounts: [15.03, 4.82, 44.59, 35.56] },
]
const cashActivity = [
  { label: 'Customer receipts', amount: 995.7 },
  { label: 'Cash operations', amount: 404.8 },
  { label: 'Principal + interest', amount: 242.0 },
  { label: 'Capital purchases', amount: 315.3 },
  { label: 'County mobility transfer', amount: 398.6 },
]
const tollRevenue = 1027.6

function FiveQuestions() {
  return <div className="texas-toll-figure texas-toll-questions-figure">
    <h3>“Paid off” is five different questions</h3>
    <p className="texas-toll-introduction">A road can satisfy one test and remain tolled because another layer is still active.</p>
    <ol className="texas-toll-questions">{questions.map(([label, question], index) => <li key={label}>
      <span className="texas-toll-question-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><strong>{label}</strong><p>{question}</p></div>
    </li>)}</ol>
  </div>
}

function SystemComparison() {
  return <div className="texas-toll-figure texas-toll-comparison">
    <h3>Same-basis comparison: two TxDOT systems</h3>
    <p className="texas-toll-introduction">Dollars per $100 of each system’s FY2025 operating revenue</p>
    <ul className="texas-toll-key" aria-label="Recurring obligations">{categories.map((category, index) => <li key={category}>
      <span className={`texas-toll-swatch texas-toll-layer-${index}`} aria-hidden="true" />{category}
    </li>)}</ul>
    {systems.map(system => <section className="texas-toll-system" key={system.name} aria-label={system.name}>
      <h4>{system.name}</h4>
      <div className="texas-toll-stacked-bar" aria-hidden="true">{system.amounts.map((amount, index) => <span key={categories[index]} className={`texas-toll-layer-${index}`} style={{ width: `${amount}%` }} />)}</div>
      <div className="texas-toll-axis" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
      <dl className="texas-toll-system-values">{system.amounts.map((amount, index) => <div key={categories[index]}>
        <dt><span className={`texas-toll-swatch texas-toll-layer-${index}`} aria-hidden="true" />{categories[index]}</dt>
        <dd>${amount.toFixed(2)}</dd>
      </div>)}</dl>
    </section>)}
    <p className="texas-toll-boundary">Both rows use the same TxDOT FY2025 report, fiscal year, denominator and category schedule.</p>
    <p className="texas-toll-boundary texas-toll-boundary-continuation">This is not a statewide allocation and should not be combined with NTTA or HCTRA’s different reporting bases.</p>
  </div>
}

function CountyCash() {
  return <div className="texas-toll-figure texas-toll-cash">
    <h3>HCTRA: selected FY2025 cash activity</h3>
    <p className="texas-toll-introduction">Absolute amounts, not a closed allocation of one current toll dollar</p>
    <p className="texas-toll-cash-reference"><span>Reported toll revenue</span><strong>$1,027.6m</strong></p>
    <dl className="texas-toll-cash-rows">{cashActivity.map(row => <div key={row.label}>
      <dt>{row.label}</dt><dd>${row.amount.toFixed(1)}m</dd>
      <svg className="texas-toll-cash-bar" width="100%" height="24" aria-hidden="true">
        <rect x="0" y="7" width={`${row.amount / tollRevenue * 100}%`} height="10" />
        <line x1="100%" x2="100%" y1="0" y2="24" />
      </svg>
    </div>)}</dl>
    <p className="texas-toll-boundary">Selected uses exceed toll revenue because beginning cash, investments, earnings, borrowing and other sources also funded the year.</p>
  </div>
}

export function hasTexasTollFigure(src: string) {
  return Object.values(images).includes(src.split('/').at(-1) || '')
}

export default function TexasTollFigures({ figure }: { figure: ArticleFigure }) {
  const name = figure.src.split('/').at(-1)
  if (name === images.questions) return <FiveQuestions />
  if (name === images.comparison) return <SystemComparison />
  if (name === images.cash) return <CountyCash />
  return null
}
