import { useId, useState } from 'react'
import { calculateBudget, exampleOffers, finiteInput, type BudgetDraft } from './internship-offer-example'
import './product-evidence.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const money = (value: number | null) => value === null ? 'Unknown' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
const fields = [
  { key: 'rate', label: 'Hourly pay · USD', max: 1_000_000 },
  { key: 'weeks', label: 'Placement · weeks', max: 104 },
  { key: 'monthly', label: 'Living costs · USD/month', max: 100_000 },
] as const

export default function ProductEvidence({ kind }: { kind: 'atlas' | 'internshipdeadlines' }) {
  return kind === 'atlas' ? <figure className="product-evidence product-evidence-atlas">
    <a className="product-capture" href={asset('images/projects/atlas-console.jpg')} target="_blank" rel="noreferrer" aria-label="View the full Atlas console screenshot">
      <img src={asset('images/projects/atlas-console.jpg')} alt="Atlas’s Pages workspace, showing a page inventory beside the selected page’s fingerprint and coverage timeline." width={1272} height={716} loading="lazy" decoding="async" />
      <span>View full interface <span aria-hidden="true">↗</span></span>
    </a>
    <figcaption><strong>The observation stays beside the page.</strong><span>Actual local console, October 2026. Synthetic example.com data illustrates the interface. <a href={asset('research/product-evidence.json')}>Capture details ↗</a></span></figcaption>
  </figure> : <InternshipOfferExample />
}

function InternshipOfferExample() {
  const id = useId()
  const [offers, setOffers] = useState(() => exampleOffers.map(offer => ({ ...offer })))
  const results = offers.map(offer => calculateBudget(offer))
  const complete = results.every(result => result.balance !== null)
  const difference = complete ? results[0].balance! - results[1].balance! : null
  function edit(index: number, key: keyof BudgetDraft, value: string) {
    setOffers(current => current.map((offer, i) => i === index ? { ...offer, [key]: value } : offer))
  }
  return <figure className="product-evidence product-evidence-internship">
    <div className="offer-example-heading"><div><span>Inside InternshipDeadlines</span><h3>Pay is one part of the offer.</h3></div><button type="button" onClick={() => setOffers(exampleOffers.map(offer => ({ ...offer })))}>Reset example <span aria-hidden="true">↺</span></button></div>
    <p className="offer-example-intro">Change the example inputs to see how placement length and living costs change the comparison.</p>
    <div className="offer-example-grid">{offers.map((offer, index) => <fieldset key={index}>
      <legend>Example {index === 0 ? 'A' : 'B'}</legend>
      {fields.map(field => {
        const inputId = `${id}-${index}-${field.key}`
        const value = finiteInput(offer[field.key], field.max)
        const invalid = !!offer[field.key].trim() && (value === null || field.key === 'weeks' && value === 0)
        return <label key={field.key} htmlFor={inputId}><span>{field.label}</span><input id={inputId} type="number" min={0} max={field.max} step="any" inputMode="decimal" value={offer[field.key]} onChange={event => edit(index, field.key, event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? `${inputId}-error` : undefined} placeholder="Unknown" />{invalid && <small id={`${inputId}-error`}>Enter {field.key === 'weeks' ? 'more than 0' : '0'} to {field.max.toLocaleString('en-US')}.</small>}</label>
      })}
      <p className="offer-example-assumptions">40 paid hours/week · {money(Number(offer.setup))} one-time costs · $0 support</p>
      <div className="offer-example-result"><span>Balance before tax</span><output aria-live="polite" aria-atomic="true" aria-label={`Example ${index === 0 ? 'A' : 'B'} balance before tax`}>{money(results[index].balance)}</output></div>
    </fieldset>)}</div>
    <p className="offer-example-comparison" aria-live="polite">{difference === null ? 'Enter all three amounts for both examples to compare them.' : difference === 0 ? 'The example balances are equal.' : Math.abs(difference) < .005 ? 'The example balances are less than $0.01 apart.' : `Example ${difference > 0 ? 'A' : 'B'} leaves ${money(Math.abs(difference))} more over the whole placement.`}</p>
    <figcaption><strong>A working excerpt of the product’s offer model.</strong><span>Repository example inputs, not employer offers. Monthly costs use weeks × 12 ÷ 52. The balance excludes tax, benefits, deductions, overtime and unpaid time. <a href="https://internshipdeadlines.com/tools/offers" target="_blank" rel="noreferrer">Explore the full tool ↗</a></span></figcaption>
  </figure>
}

export function AtlasPortfolioFeature() {
  return <section className="atlas-portfolio-feature" aria-labelledby="atlas-portfolio-title"><div className="atlas-portfolio-copy"><span>Product & engineering</span><h2 id="atlas-portfolio-title">Atlas</h2><p>A crawl and audit console that keeps the page, the observation and the reasoning together.</p><a href="#/work/atlas">Inside the product <span aria-hidden="true">↗</span></a></div><ProductEvidence kind="atlas" /></section>
}
