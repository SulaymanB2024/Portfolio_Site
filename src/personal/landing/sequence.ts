import { TITLE_TIMING, MOBILE_TITLE_TIMING, easeBetween, thresholdMotion } from './motion-curves.ts'

export interface LandingChapter {
  id: 'helmet' | 'product' | 'sapien' | 'markets' | 'experiments'
  lines: readonly string[]
  label: string
  category: string
  asset: string
  assetId: string
  href: string
  linkLabel: string
  article?: { label: string; href: string }
}

/** The approved study's opening and four project chapters, in site order. */
export const CHAPTERS: readonly LandingChapter[] = [
  { id: 'helmet', lines: ['The frontier', 'is all that', 'matters.'], label: 'Sulayman Bowles', category: '', asset: 'helmet-balanced.glb', assetId: 'helmet', href: '#/work', linkLabel: 'Selected work', article: { label: 'About me', href: '#/about' } },
  { id: 'product', lines: ['Internship', 'Deadlines.'], label: 'InternshipDeadlines', category: 'Product', asset: 'work-studies/internshipdeadlines.glb', assetId: 'work-internshipdeadlines', href: '#/work/internshipdeadlines', linkLabel: 'Explore project' },
  { id: 'sapien', lines: ['Sapien.'], label: 'Sapien', category: 'AI', asset: 'work-studies/sapien.glb', assetId: 'work-sapien', href: '#/work/sapien', linkLabel: 'Explore project' },
  { id: 'markets', lines: ['Investing', '& Markets.'], label: 'Investing & Markets', category: 'Markets', asset: 'work-studies/investing-markets.glb', assetId: 'work-investing-markets', href: '#/work/investing-markets', linkLabel: 'Explore project', article: { label: 'Who owns Texas toll roads?', href: '#/writing/who-owns-texas-toll-roads' } },
  { id: 'experiments', lines: ['Experiments.'], label: 'Experiments', category: 'Experiments', asset: 'work-studies/miscellaneous.glb', assetId: 'work-miscellaneous', href: '#/work/miscellaneous', linkLabel: 'Explore project' },
]

const legs = CHAPTERS.length - 1
const clampProgress = (value: number) => typeof value === 'number' && !Number.isNaN(value) ? Math.max(0, Math.min(1, value)) : 0

export function railProgress(scroll: number, documentTop: number, railHeight: number, stageHeight: number) {
  if (![scroll, documentTop, railHeight, stageHeight].every(Number.isFinite)) return 0
  return clampProgress((scroll - documentTop) / Math.max(1, railHeight - stageHeight))
}

export function sceneSequence(progress: number) {
  const p = clampProgress(progress)
  const leg = Math.min(legs - 1, Math.floor(p * legs))
  return { p, leg, local: p * legs - leg, from: CHAPTERS[leg], to: CHAPTERS[leg + 1] }
}

/** Only the sculptures visible at this scroll position are required to paint. */
export function requiredScene(progress: number, reduced = false) {
  if (reduced) return { indexes: [textSequence(progress, 'threshold', true).active], portal: false }
  const { leg, local } = sceneSequence(progress), travel = thresholdMotion(local).travel
  return travel === 0 || travel === 1
    ? { indexes: [leg + Number(travel === 1)], portal: false }
    : { indexes: [leg, leg + 1], portal: true }
}

export interface TextState { reveal: number; erase: number }
export interface TextSequence { states: TextState[]; active: number }

/** Dissolve before printing the next chapter, retaining the approved blank interval. */
export function textSequence(progress: number, _mode: 'threshold' = 'threshold', reduced = false, mobile = false): TextSequence {
  const p = clampProgress(progress)
  const timing = mobile && !reduced ? MOBILE_TITLE_TIMING : TITLE_TIMING
  // Reduced motion retains its original instant chapter boundaries.
  const boundaries = Array.from({ length: legs }, (_, index) => (index + (reduced ? .38 : timing.switch)) / legs)
  const active = boundaries.reduce((index, boundary) => index + Number(p >= boundary), 0)
  const states = CHAPTERS.map(() => ({ reveal: 0, erase: 0 }))
  if (reduced) {
    states[active].reveal = 1
    return { states, active }
  }
  states.forEach((state, index) => {
    state.reveal = index === 0 ? 1 : easeBetween(p * legs - index + 1, timing.revealStart, timing.revealEnd)
    state.erase = index === legs ? 0 : easeBetween(p * legs - index, timing.eraseStart, timing.eraseEnd)
  })
  return { states, active }
}

export interface ScrollMotion { progress: number; velocity: number }

/** A brief visual settle absorbs scroll steps; native page scrolling stays immediate. */
export function advanceScrollMotion(current: ScrollMotion, target: number, seconds: number, reduced = false, maxRate = Infinity): ScrollMotion {
  const from = clampProgress(current.progress), to = clampProgress(target)
  if (reduced) return { progress: to, velocity: 0 }
  const bounded = Number.isFinite(maxRate) && maxRate > 0
  // A decode/main-thread gap is not visible animation time.
  const elapsed = Number.isFinite(seconds) ? Math.min(Math.max(0, seconds), bounded ? .05 : Infinity) : 0
  if (!elapsed) return { progress: from, velocity: 0 }
  const rate = 32, error = to - from, decay = Math.exp(-rate * elapsed)
  const step = error * (1 - decay)
  // Only asset recovery supplies a speed bound. Ordinary native scroll keeps
  // its brief settle; a decoded chapter cannot leap across the whole passage.
  if (bounded && Math.abs(step) > maxRate * elapsed) {
    return { progress: from + Math.sign(error) * maxRate * elapsed, velocity: Math.sign(error) * maxRate }
  }
  return { progress: to - error * decay, velocity: rate * error * decay }
}
