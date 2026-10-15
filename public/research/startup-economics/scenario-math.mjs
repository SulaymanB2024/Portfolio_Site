// Buyer economics only. Company observations remain in the reviewed snapshot.
function bounded(value, max, label) {
  if (!Number.isFinite(value) || value < 0 || value > max) throw new RangeError(`Invalid ${label}`)
  return value
}
export function harveyBuyer(config, knobs) {
  const a = config.assumed
  const adoption = bounded(knobs.adoption, 1, 'adoption')
  const review = bounded(knobs.review, 1, 'review')
  const capture = bounded(knobs.capture, 1, 'capture')
  const hours = a.customer_seats * adoption * a.eligible_hours_saved_week * a.weeks * (1 - review)
  const fullValue = hours * a.contribution_per_monetized_hour
  const captured = fullValue * capture
  const recurringCost = a.customer_seats * a.annual_license_per_seat
  const firstCost = recurringCost + a.first_year_implementation
  return { hours, captured, firstCost, recurringCost,
    firstBenefit: captured - firstCost, recurringBenefit: captured - recurringCost,
    firstCapture: fullValue ? firstCost / fullValue : null,
    recurringCapture: fullValue ? recurringCost / fullValue : null }
}
export function vantaBuyer(config, knobs) {
  const a = config.assumed
  const weeks = bounded(knobs.weeks, 52, 'work weeks')
  const questionnaires = bounded(knobs.questionnaires, 20, 'questionnaires')
  const capture = bounded(knobs.capture, 1, 'capture')
  const [before, after] = a.hours_per_questionnaire_before_after
  const hours = a.weekly_saved_hours_excluding_questionnaires * weeks + questionnaires * 12 * (before - after)
  const fullValue = hours * a.avoidable_labor_cost_hour
  const captured = fullValue * capture
  const recurringCost = config.reported.ARR_m * 1e6 / config.reported.customers
  const firstCost = recurringCost + a.first_year_implementation
  return { hours, captured, firstCost, recurringCost,
    firstBenefit: captured - firstCost, recurringBenefit: captured - recurringCost,
    firstCapture: fullValue ? firstCost / fullValue : null,
    recurringCapture: fullValue ? recurringCost / fullValue : null }
}
