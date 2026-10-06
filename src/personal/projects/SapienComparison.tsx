import type { CSSProperties } from 'react'
import { sapienPricing, pricingChange } from './sapien-pricing'
import './sapien-comparison.css'

/** A static print figure: HTML owns labels; percentage positions share one zero-based scale. */
export function SapienComparison() {
  const { cohorts, offers, maximum, source } = sapienPricing
  return (
    <figure className="sapien-comparison" aria-labelledby="sapien-pricing-title">
      <figcaption className="specimen-caption mono">
        <span>iPhone Duo / matched 256GB offers</span>
        <span>Published Sapien study</span>
      </figcaption>
      <div className="sapien-comparison-heading">
        <h3 id="sapien-pricing-title">Qualification at two prices.</h3>
        <div className="sapien-price-key mono" aria-label="Price key">
          {offers.map((price, i) => (
            <span key={price}>
              <i className={`sapien-price-symbol ${i ? 'is-filled' : ''}`} aria-hidden="true" />${price.toLocaleString('en-US')}
            </span>
          ))}
        </div>
      </div>
      <span className="sapien-comparison-unit mono">Modeled qualification / %</span>
      <div className="sapien-comparison-axis mono" aria-hidden="true">
        {[0, 5, 10, maximum].map((tick) => (
          <span key={tick} style={{ left: `${(tick / maximum) * 100}%` }}>
            {tick}
          </span>
        ))}
      </div>
      <div className="sapien-comparison-rows" aria-hidden="true">
        {cohorts.map(({ id, label, profiles, qualification: [before, after] }) => (
          <div
            className="sapien-comparison-row"
            key={id}
            style={{ '--price-before': `${(before / maximum) * 100}%`, '--price-after': `${(after / maximum) * 100}%` } as CSSProperties}>
            <div className="sapien-comparison-cohort">
              <h4>{label}</h4>
              <span className="mono">n = {profiles.toLocaleString('en-US')}</span>
            </div>
            <div className="sapien-comparison-plot">
              <div className="sapien-comparison-grid" />
              <span className="sapien-comparison-range" />
              <span className="sapien-comparison-point is-before">
                <span>
                  {before.toFixed(2)}
                  <small>%</small>
                </span>
                <i />
              </span>
              <span className="sapien-comparison-point is-after">
                <span>
                  {after.toFixed(2)}
                  <small>%</small>
                </span>
                <i />
              </span>
            </div>
            <span className="sapien-comparison-change mono">
              +{pricingChange(before, after)}
              <small>percentage points</small>
            </span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Modeled qualification at two prices, with the same profiles at both prices within each cohort.</caption>
        <thead>
          <tr>
            <th scope="col">Cohort</th>
            <th scope="col">Profiles</th>
            {offers.map((price) => (
              <th scope="col" key={price}>
                ${price.toLocaleString('en-US')}
              </th>
            ))}
            <th scope="col">Change in percentage points</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map(({ id, label, profiles, qualification: [before, after] }) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td>{profiles.toLocaleString('en-US')}</td>
              <td>{before.toFixed(2)}%</td>
              <td>{after.toFixed(2)}%</td>
              <td>+{pricingChange(before, after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sapien-comparison-foot">
        <p>The same profiles at both prices within each cohort. Modeled qualification, not observed sales. No uncertainty intervals were published.</p>
        <a className="specimen-source mono" href={source} target="_blank" rel="noreferrer">
          Read the study <span aria-hidden="true">↗</span>
        </a>
      </div>
    </figure>
  )
}
