export interface LandingChapter {
  id: 'helmet' | 'product' | 'sapien' | 'markets' | 'experiments'
  lines: readonly string[]
  label: string
  category: string
  asset: string
  href: string
  linkLabel: string
  article?: { label: string; href: string }
}

/** The approved study's opening and four project chapters, in site order. */
export const CHAPTERS: readonly LandingChapter[] = [
  { id: 'helmet', lines: ['The frontier', 'is all that', 'matters.'], label: 'Sulayman Bowles', category: '', asset: 'helmet-balanced.glb', href: '#/about', linkLabel: 'About me' },
  { id: 'product', lines: ['Internship', 'Deadlines.'], label: 'InternshipDeadlines', category: 'Product', asset: 'work-studies/internshipdeadlines.glb', href: '#/work/internshipdeadlines', linkLabel: 'Explore project' },
  { id: 'sapien', lines: ['Sapien.'], label: 'Sapien', category: 'AI', asset: 'work-studies/sapien.glb', href: '#/work/sapien', linkLabel: 'Explore project' },
  { id: 'markets', lines: ['Investing', '& Markets.'], label: 'Investing & Markets', category: 'Markets', asset: 'work-studies/investing-markets.glb', href: '#/work/investing-markets', linkLabel: 'Explore project', article: { label: 'Who owns Texas toll roads?', href: '#/writing/who-owns-texas-toll-roads' } },
  { id: 'experiments', lines: ['Experiments.'], label: 'Experiments', category: 'Experiments', asset: 'work-studies/miscellaneous.glb', href: '#/work/miscellaneous', linkLabel: 'Explore project' },
]

const legs = CHAPTERS.length - 1
const clampProgress = (value: number) => typeof value === 'number' && !Number.isNaN(value) ? Math.max(0, Math.min(1, value)) : 0
const smooth = (value: number) => {
  const t = clampProgress(value)
  return clampProgress(t * t * t * (t * (t * 6 - 15) + 10))
}

export function railProgress(scroll: number, documentTop: number, railHeight: number, stageHeight: number) {
  if (![scroll, documentTop, railHeight, stageHeight].every(Number.isFinite)) return 0
  return clampProgress((scroll - documentTop) / Math.max(1, railHeight - stageHeight))
}

export function sceneSequence(progress: number) {
  const p = clampProgress(progress)
  const leg = Math.min(legs - 1, Math.floor(p * legs))
  return { p, leg, local: p * legs - leg, from: CHAPTERS[leg], to: CHAPTERS[leg + 1] }
}

export interface TextState { reveal: number; erase: number }
export interface TextSequence { states: TextState[]; active: number }

/** Dissolve before printing the next chapter, retaining the approved blank interval. */
export function textSequence(progress: number, _mode: 'threshold' = 'threshold', reduced = false): TextSequence {
  const p = clampProgress(progress)
  const boundaries = Array.from({ length: legs }, (_, index) => (index + .56) / legs)
  const active = boundaries.reduce((index, boundary) => index + Number(p >= boundary), 0)
  const states = CHAPTERS.map(() => ({ reveal: 0, erase: 0 }))
  if (reduced) {
    states[active].reveal = 1
    return { states, active }
  }
  const width = .22 / legs, gap = .03 / legs
  states.forEach((state, index) => {
    state.reveal = index === 0 ? 1 : smooth((p - boundaries[index - 1] - gap) / width)
    state.erase = index === legs ? 0 : smooth((p - boundaries[index] + gap + width) / width)
  })
  return { states, active }
}

export interface ScrollMotion { progress: number; velocity: number }

/** Exact critically damped motion carries velocity between scroll events. */
export function advanceScrollMotion(current: ScrollMotion, target: number, seconds: number, reduced = false): ScrollMotion {
  const from = clampProgress(current.progress), to = clampProgress(target)
  if (reduced) return { progress: to, velocity: 0 }
  const elapsed = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const velocity = Number.isFinite(current.velocity) ? current.velocity : 0
  if (!elapsed) return { progress: from, velocity }
  const frequency = 26, error = from - to, tangent = velocity + frequency * error
  const decay = Math.exp(-frequency * elapsed)
  const next = to + (error + tangent * elapsed) * decay
  // Stop at the destination if a sudden reversal carries excess momentum.
  if (error === 0 || error * (next - to) <= 0 || next < 0 || next > 1) return { progress: to, velocity: 0 }
  return { progress: next, velocity: (velocity - frequency * tangent * elapsed) * decay }
}
