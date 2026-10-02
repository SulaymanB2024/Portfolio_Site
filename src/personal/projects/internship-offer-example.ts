/** Excerpt of InternshipDeadlines’ offer model at 3da259a3b51bab3448e9b082dad69fac7cb2711f.
 * Manual example inputs only; no imported roles, accounts or saved plans.
 * Original source fingerprints: public/research/product-evidence.json.
 */
export type BudgetDraft = { rate: string; unit: 'HOUR'; weeks: string; hours: string; monthly: string; setup: string; support: string };
export function finiteInput(value: string, max = 1_000_000): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= max ? n : null;
}
export function grossIncome(rate: number, unit: string, weeks: number, hours: number): number | null {
  if (![rate,weeks,hours].every(n=>Number.isFinite(n)&&n>=0) || weeks <= 0) return null;
  switch(unit) {
    case 'HOUR': return rate * hours * weeks;
    case 'WEEK': return rate * weeks;
    case 'MONTH': return rate * weeks * 12 / 52;
    case 'YEAR': return rate * weeks / 52;
    case 'TOTAL': return rate;
    default: return null;
  }
}
export function calculateBudget(draft: BudgetDraft) {
  const rate = finiteInput(draft.rate);
  const enteredWeeks = finiteInput(draft.weeks, 104);
  const weeks = enteredWeeks !== null && enteredWeeks > 0 ? enteredWeeks : null;
  const hours = finiteInput(draft.hours, 168);
  const monthly = finiteInput(draft.monthly, 100000);
  const setup = finiteInput(draft.setup), support = finiteInput(draft.support);
  const months = weeks === null ? null : weeks * 12 / 52;
  const income = rate !== null && weeks !== null && (draft.unit !== 'HOUR' || hours !== null)
    ? grossIncome(rate, draft.unit, weeks, hours ?? 0) : null;
  const living = monthly !== null && months !== null ? monthly * months : null;
  const spending = living !== null && setup !== null ? living + setup : null;
  const funding = income !== null && support !== null ? income + support : null;
  const balance = funding !== null && spending !== null ? funding - spending : null;
  const breakEvenMonthly = funding !== null && setup !== null && months !== null ? (funding - setup) / months : null;
  return { rate, weeks, hours, monthly, setup, support, months, income, living, spending, funding, balance, breakEvenMonthly };
}

export const exampleOffers: BudgetDraft[] = [
  { rate:'25', unit:'HOUR', weeks:'12', hours:'40', monthly:'1800', setup:'400', support:'0' },
  { rate:'30', unit:'HOUR', weeks:'8', hours:'40', monthly:'2400', setup:'600', support:'0' },
];
