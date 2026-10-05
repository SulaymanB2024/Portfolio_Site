/** Published matched-menu results, checked October 4, 2026. Not the main-offer cohorts. */
export const sapienPricing = {
  source: 'https://www.asksapien.ai/blog/ai-market-research-tools',
  offers: [1999, 1599],
  maximum: 15,
  cohorts: [
    { id: 'core', label: 'Core', profiles: 2103, qualification: [5.52, 11.27] },
    { id: 'expansion', label: 'Expansion', profiles: 2897, qualification: [6.18, 12.5] }
  ]
} as const

export function pricingChange(before: number, after: number) {
  return (after - before).toFixed(2)
}
