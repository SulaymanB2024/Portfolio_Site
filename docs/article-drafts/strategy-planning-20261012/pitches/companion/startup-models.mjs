import context from './model-context.mjs'
import { harveyBuyer, vantaBuyer } from './scenario-math.mjs'

const money = value => `${value < 0 ? '−' : ''}$${Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
const percent = value => value === null ? 'No payback' : `${(100 * value).toFixed(1)}%`
const defaults = {
  harvey: { adoption: context.harvey.assumed.customer_adoption, review: context.harvey.assumed.additional_review, capture: .25 },
  vanta: { weeks: context.vanta.assumed.weeks, questionnaires: context.vanta.assumed.questionnaires_month, capture: .5 },
}
const states = structuredClone(defaults)
const fixedDetails = Object.fromEntries(['harvey', 'vanta'].map(company => [company, document.querySelector(`#${company} details`)]))
const presets = {
  harvey: { article: defaults.harvey, adoption: { ...defaults.harvey, adoption: .3 }, review: { ...defaults.harvey, review: .6 }, zero: { ...defaults.harvey, adoption: 0 } },
  vanta: { article: defaults.vanta, audit: { ...defaults.vanta, weeks: 16 }, capture: { ...defaults.vanta, capture: 1 }, zero: { ...defaults.vanta, weeks: 0, questionnaires: 0 } },
}
function element(tag, className, text) {
  const e = document.createElement(tag)
  if (className) e.className = className
  if (text !== undefined) e.textContent = text
  return e
}
function render(company) {
  const knobs = states[company]
  const r = company === 'harvey' ? harveyBuyer(context.harvey, knobs) : vantaBuyer(context.vanta, knobs)
  const root = document.getElementById(`${company}-result`)
  root.replaceChildren()
  root.append(element('p', 'result-label', company === 'harvey' ? 'First-year net contribution benefit' : 'First-year net cash benefit'), element('p', 'result-value', money(r.firstBenefit)))
  const judgment = r.firstBenefit > 0 ? 'The rollout pays back.' : r.firstBenefit === 0 ? 'The rollout breaks even.' : r.recurringBenefit > 0 ? 'Renewal clears the bill; rollout does not.' : r.recurringBenefit === 0 ? 'Renewal breaks even; rollout does not.' : 'The recurring budget does not pay back.'
  root.append(element('p', 'result-judgment', judgment))
  const bridge = element('div', 'bridge')
  bridge.setAttribute('role', 'figure')
  bridge.setAttribute('aria-label', company === 'harvey' ? 'Captured contribution versus contract and implementation costs' : 'Avoided cash spending versus contract and implementation costs')
  const max = Math.max(r.captured, r.firstCost, 1)
  for (const [label, value, style] of [[company === 'harvey' ? 'Captured contribution' : 'Avoided cash spending', r.captured, ''], ['First-year cost', r.firstCost, 'cost'], ['Recurring annual cost', r.recurringCost, 'renewal']]) {
    const row = element('div', 'bridge-row'), title = element('div', 'bar-title'), track = element('div', 'track'), bar = element('div', `bar ${style}`)
    title.append(element('span', '', label), element('strong', '', money(value)))
    bar.style.width = `${100 * value / max}%`
    bar.setAttribute('aria-hidden', 'true')
    track.append(bar); row.append(title, track); bridge.append(row)
  }
  root.append(bridge)
  const stats = element('dl', 'result-stats')
  for (const [label, value] of [['Released hours / year', r.hours.toLocaleString('en-US', { maximumFractionDigits: 0 })], ['Recurring net benefit', money(r.recurringBenefit)], ['Capture needed in year one', percent(r.firstCapture)], ['Capture needed on renewal', percent(r.recurringCapture)]]) {
    const item = element('div'); item.append(element('dt', '', label), element('dd', '', value)); stats.append(item)
  }
  root.append(stats)
  root.append(element('p', 'threshold-note', 'Renewal holds the selected workload and capture rate fixed.'))
  const note = r.firstCapture === null ? 'No usable work is released. The contract and implementation costs remain.' : r.firstCapture > 1 ? 'Even capturing all of the modeled value cannot cover the first-year bill.' : company === 'harvey' ? 'The capture rate counts hours that earn incremental contribution, after added review. Available capacity alone does not pay the contract.' : 'Cash capture means spending actually avoided. Keep the separately counted questionnaire work out of the weekly estimate.'
  root.append(element('p', 'threshold-note', note))
  root.append(fixedDetails[company])
  for (const input of document.querySelectorAll(`#${company}-controls input`)) {
    const key = input.dataset.key, value = knobs[key]
    input.value = ['weeks', 'questionnaires'].includes(key) ? value : value * 100
    input.setAttribute('aria-valuetext', key === 'weeks' ? `${value} weeks` : key === 'questionnaires' ? `${value} per month` : `${Math.round(value * 100)} percent`)
    document.getElementById(`${input.id}-value`).setAttribute('aria-live', 'off')
    document.getElementById(`${input.id}-value`).textContent = ['weeks', 'questionnaires'].includes(key) ? String(value) : `${Math.round(value * 100)}%`
  }
  for (const button of document.querySelectorAll(`[data-model='${company}']`)) {
    button.setAttribute('aria-pressed', String(Object.entries(presets[company][button.dataset.preset]).every(([key, value]) => value === knobs[key])))
  }
  document.getElementById(`${company}-status`).textContent = `${company === 'harvey' ? 'Harvey' : 'Vanta'}: first-year benefit ${money(r.firstBenefit)}; recurring benefit ${money(r.recurringBenefit)}. ${judgment}`
}
for (const company of ['harvey', 'vanta']) {
  document.getElementById(`${company}-controls`).addEventListener('input', event => {
    const key = event.target.dataset.key
    if (!key) return
    states[company][key] = Number(event.target.value) / (['weeks', 'questionnaires'].includes(key) ? 1 : 100)
    render(company)
  })
  document.getElementById(`${company}-controls`).addEventListener('submit', event => event.preventDefault())
}
for (const button of document.querySelectorAll('[data-preset]')) button.addEventListener('click', () => {
  const company = button.dataset.model
  states[company] = { ...presets[company][button.dataset.preset] }
  render(company)
})
const h = context.harvey.assumed, v = context.vanta.assumed
document.getElementById('harvey-setup').textContent = `Keep the bill for ${h.customer_seats} purchased seats fixed. Fewer active users or more review leaves less work to monetize.`
document.getElementById('harvey-contract').textContent = `Assumed annual license bill: ${money(h.customer_seats * h.annual_license_per_seat)}, plus ${money(h.first_year_implementation)} implementation in year one.`
document.getElementById('harvey-fixed').textContent = `${h.customer_seats} licensed seats at ${money(h.annual_license_per_seat)} each per year; ${money(h.first_year_implementation)} first-year implementation. ${h.eligible_hours_saved_week} eligible hours saved per active seat each week, for ${h.weeks} weeks; ${money(h.contribution_per_monetized_hour)} contribution per monetized hour.`
document.getElementById('vanta-fixed').textContent = `${v.weekly_saved_hours_excluding_questionnaires} weekly hours saved on evidence work; ${v.hours_per_questionnaire_before_after[0]} hours per questionnaire before, ${v.hours_per_questionnaire_before_after[1]} after. ${money(v.avoidable_labor_cost_hour)} avoidable labor cost per hour; ${money(v.first_year_implementation)} first-year implementation.`
document.getElementById('vanta-normalization').textContent = `The ${money(context.vanta.reported.ARR_m * 1e6 / context.vanta.reported.customers)} modeled annual contract uses the ARR/customer checkpoint: $${context.vanta.reported.ARR_m}m / ${context.vanta.reported.customers.toLocaleString('en-US')}, as of ${context.vanta.reported.ARR_checkpoint_date}. It is a normalization, not disclosed pricing or paid-cohort ACV.`
for (const company of ['harvey', 'vanta']) document.getElementById(`${company}-source`).href = context.sources[company].href
document.getElementById('cutoff').textContent = context.cutoff
document.getElementById('cutoff').dateTime = context.cutoff
render('harvey'); render('vanta')
