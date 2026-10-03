const INTERVAL = 1000 / 30
const WINDOW_MS = 2000

/** Retained visible clock, deadline scheduler, and bounded resolution policy. */
export class PortfolioRuntime {
  delta = 0
  seconds = 0
  scale = 1
  averageFrameMs = 0
  fps = 0
  private deadline = 0
  private previous: number | null = null
  private windowStart: number | null = null
  private windowSum = 0
  private windowCount = 0
  private badWindows = 0
  private goodMs = 0
  private pendingScale: number | null = null
  private statsStart: number | null = null
  private statsSum = 0
  private statsCount = 0

  canPaint(now: number, immediate = false) {
    if (!Number.isFinite(now)) return false
    if (!immediate && this.deadline && now < this.deadline - .75) return false
    if (immediate || !this.deadline || now - this.deadline > INTERVAL) this.deadline = now + INTERVAL
    else this.deadline += INTERVAL
    return true
  }

  /** Sleep between paints, leaving a short lead for the next display frame. */
  paintDelay(now: number) {
    return Number.isFinite(now) ? Math.max(0, this.deadline - now - 8) : 0
  }

  /** Call once per accepted frame. Returns true only when backing size changes. */
  advance(now: number, moving: boolean, blocked = false) {
    const raw = this.previous === null ? 0 : Math.max(0, now - this.previous)
    this.previous = now
    this.delta = Number.isFinite(raw) ? Math.min(raw / 1000, .1) : 0
    if (moving) this.seconds += this.delta
    if (raw > 0 && raw < 500) {
      this.statsStart ??= now - raw
      this.statsSum += raw
      this.statsCount++
      if (now - this.statsStart >= 750) {
        this.averageFrameMs = this.statsSum / this.statsCount
        this.fps = 1000 / this.averageFrameMs
        this.statsStart = now
        this.statsSum = this.statsCount = 0
      }
    }
    if (!moving || blocked || raw >= 500) {
      this.resetWindow()
      this.badWindows = 0
      this.goodMs = 0
    } else if (raw > 0) {
      this.windowStart ??= now - raw
      this.windowSum += raw
      this.windowCount++
      const span = now - this.windowStart
      if (span >= WINDOW_MS) {
        const mean = this.windowSum / this.windowCount
        this.badWindows = mean > 40 ? this.badWindows + 1 : 0
        this.goodMs = mean < 35 ? this.goodMs + span : 0
        if (this.scale === 1 && this.badWindows >= 2) this.pendingScale = .8
        if (this.scale === .8 && this.goodMs >= 8000) this.pendingScale = 1
        this.resetWindow()
      }
    }
    if (!blocked && this.pendingScale !== null) {
      const next = this.pendingScale
      this.pendingScale = null
      this.badWindows = this.goodMs = 0
      this.resetWindow()
      if (next !== this.scale) { this.scale = next; return true }
    }
    return false
  }

  private resetWindow() {
    this.windowStart = null
    this.windowSum = this.windowCount = 0
  }

  /** Hidden, paused, lost, or disposed surfaces retain phase without counting the gap. */
  suspend() {
    this.previous = null
    this.deadline = 0
    this.delta = 0
    this.resetWindow()
    this.badWindows = this.goodMs = 0
    this.statsStart = null
    this.statsSum = this.statsCount = 0
  }
}
