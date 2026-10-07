import { useId } from 'react'
import type { ArticleFigure } from './types'
import './research-comparison.css'

const routesImage = '/images/research/online-returns-environmental-routes.png'
const revenueImage = '/images/research/index-provider-revenue-mix.png'

// Environmental_Routes!B4:G12, retained reverse-logistics-tax-model.xlsx.
// SHA-256 d80cc0ecb5a4101a8c3075d97e0514ae04ca233996b1d0c3c122f4f076e497d1.
// These are model assumptions, not disclosed retailer disposition rates.
const routes = [
  { label: 'Resale / reuse', full: 'Direct resale/reuse' },
  { label: 'Liquidation', full: 'Liquidation transfer (downstream unobserved)' },
  { label: 'Donation', full: 'Donation' },
  { label: 'Recycling', full: 'Recycling/material recovery' },
  { label: 'Disposal', full: 'Direct destruction/disposal' },
  { label: 'Unrecovered', full: 'Fraudulent/missing/not physically recovered' },
]
const dispositions = [
  { label: 'Clothing', price: '$20', values: [83, 8, 0, 0, 7, 2] },
  { label: 'Beauty', price: '$20', values: [32, 0, 0, 0, 67, 1] },
  { label: 'Household', price: '$20', values: [78, 8, 0, 0, 13, 1] },
  { label: 'Footwear', price: '$100', values: [88, 0, 0, 9, 0, 3] },
  { label: 'Headphones', price: '$100', values: [83, 0, 0, 12, 0, 5] },
  { label: 'Appliance', price: '$100', values: [67, 15, 0, 15, 0, 3] },
  { label: 'Laptop / phone', price: '$500', values: [84, 0, 0, 9, 0, 7] },
  { label: 'Furniture', price: '$500', values: [82, 0, 17, 0, 0, 1] },
  { label: 'Accessory', price: '$500', values: [84, 0, 0, 9, 0, 7] },
]

// Reported amounts from provider-commercial-machine in the retained index essay.
// Original chart SHA-256 1e72c92c11c41d7fde611efa56b26788932046f0e73637c766567e3672441bf5.
const revenue = [
  { label: 'Asset-linked fees', millions: 1206, amount: '$1.206B' },
  { label: 'Subscriptions', millions: 320, amount: '$320M' },
  { label: 'Usage-based royalties', millions: 324, amount: '$324M' },
]

export function hasResearchComparison(src: string) {
  return src === routesImage || src === revenueImage
}

function PatternDefinitions({ prefix }: { prefix: string }) {
  return <svg className="research-comparison-patterns" width="0" height="0" aria-hidden="true">
    <defs>
      <pattern id={`${prefix}-0`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="currentColor" /></pattern>
      <pattern id={`${prefix}-1`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="research-pattern-paper" /><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></pattern>
      <pattern id={`${prefix}-2`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="research-pattern-paper" /><circle cx="4" cy="4" r="1.4" fill="currentColor" /></pattern>
      <pattern id={`${prefix}-3`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="research-pattern-paper" /><path d="M4 0V8" stroke="currentColor" strokeWidth="1.5" /></pattern>
      <pattern id={`${prefix}-4`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="research-pattern-paper" /><path d="M0 0L8 8M8 0L0 8" stroke="currentColor" strokeWidth="1.2" /></pattern>
      <pattern id={`${prefix}-5`} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" className="research-pattern-paper" /><path d="M0 4H8" stroke="currentColor" strokeWidth="1.5" /></pattern>
    </defs>
  </svg>
}

function Swatch({ prefix, index }: { prefix: string; index: number }) {
  return <svg width="16" height="16" aria-hidden="true"><rect width="16" height="16" fill={`url(#${prefix}-${index})`} /></svg>
}

function DispositionComparison({ prefix }: { prefix: string }) {
  return <div className="research-comparison research-comparison-routes">
    <PatternDefinitions prefix={prefix} />
    <p className="research-comparison-note">Modeled routes, not measured environmental outcomes.</p>
    <ul className="research-route-key">{routes.map((route, index) => <li key={route.full}><Swatch prefix={prefix} index={index} /><span>{route.full}</span></li>)}</ul>
    <dl className="research-route-rows">{dispositions.map(product => {
      let offset = 0
      return <div key={product.label} className="research-route-row">
        <dt>{product.label}<span>{product.price}</span></dt>
        <dd>
          <svg width="100%" height="24" className="research-route-bar" aria-hidden="true">{product.values.map((value, index) => {
            const start = offset
            offset += value
            return value ? <rect key={index} x={`${start}%`} width={`${value}%`} height="24" fill={`url(#${prefix}-${index})`} className="research-route-segment" data-route={index} data-share={value} /> : null
          })}</svg>
          <ul className="research-route-values">{product.values.map((value, index) => value ? <li key={routes[index].full}><Swatch prefix={prefix} index={index} /><span>{routes[index].label} <strong>{value}%</strong></span></li> : null)}</ul>
        </dd>
      </div>
    })}</dl>
  </div>
}

function RevenueComparison({ prefix }: { prefix: string }) {
  const total = revenue.reduce((sum, item) => sum + item.millions, 0)
  return <div className="research-comparison research-comparison-revenue">
    <PatternDefinitions prefix={prefix} />
    <p className="research-revenue-total"><span>S&P Global Indices · 2025 revenue</span><strong>$1.850B</strong></p>
    <dl className="research-revenue-rows">{revenue.map((item, index) => {
      const percentage = item.millions / total * 100
      return <div key={item.label} className="research-revenue-row">
        <dt>{item.label}</dt>
        <dd><div className="research-revenue-values"><strong>{item.amount}</strong><span>{percentage.toFixed(1)}%</span></div>
          <svg width="100%" height="24" aria-hidden="true"><rect width="100%" height="24" className="research-revenue-track" /><rect width={`${percentage}%`} height="24" fill={`url(#${prefix}-${index})`} data-millions={item.millions} /></svg>
        </dd>
      </div>
    })}</dl>
  </div>
}

/** Source-backed replacements for charts whose series cannot survive grayscale. */
export default function ResearchComparison({ figure }: { figure: ArticleFigure }) {
  const prefix = `research-comparison-${useId().replaceAll(':', '')}`
  if (figure.src === routesImage) return <DispositionComparison prefix={prefix} />
  if (figure.src === revenueImage) return <RevenueComparison prefix={prefix} />
  return null
}
