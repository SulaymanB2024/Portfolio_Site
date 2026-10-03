/** Development-only stepping of the real retained renderer, at its native 30 Hz. */
export function createStudyFrameReview(paint: () => void) {
  if (!(import.meta.env.DEV || import.meta.env.MODE === 'flight-review') || !new URLSearchParams(location.search).has('inspect-flight')) return null
  let base: number | null = null
  let frame = 0
  let recording = false
  let lastRecorded = -1
  let pending = 0
  const images: HTMLImageElement[] = []
  const toolbar = document.createElement('div')
  toolbar.setAttribute('aria-label', 'Transition frame review')
  toolbar.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:10001;background:#fff;color:#111;border:1px solid #555;padding:8px 12px;font:12px monospace;display:flex;gap:12px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 20px)'
  const output = document.createElement('output')
  output.textContent = 'Activate a project to step its transition'
  const next = document.createElement('button')
  next.textContent = 'Next frame'
  next.disabled = true
  next.onclick = () => { frame++; paint() }
  const record = document.createElement('button')
  record.textContent = 'Record all frames'
  record.disabled = true
  record.onclick = () => { recording = true; record.disabled = true; paint() }
  const gallery = document.createElement('div')
  gallery.setAttribute('aria-label', 'Recorded transition frames')
  gallery.style.cssText = 'position:fixed;inset:0;z-index:10000;background:var(--paper);overflow:auto;display:none;grid-template-columns:repeat(3,1fr);padding:20px 20px 70px;gap:12px'
  const show = document.createElement('button')
  show.textContent = 'Show recorded frames'
  show.disabled = true
  show.onclick = () => { gallery.style.display = gallery.style.display === 'none' ? 'grid' : 'none' }
  toolbar.append(output, next, record, show)
  const style = document.createElement('style')
  style.textContent = `html[data-flight-review] .project-arrival.is-docking::before{animation-play-state:paused;animation-delay:var(--review-dock-delay,0ms)}html[data-flight-review] .work-stage[data-work-opening]::before{animation-play-state:paused;animation-delay:var(--review-depart-delay,0ms)}`
  document.body.append(toolbar, style, gallery)
  document.documentElement.dataset.flightReview = ''
  return {
    begin(time: number) { base = time; frame = 0; next.disabled = false; record.disabled = false; return time },
    now(time: number) { return base === null ? time : base + frame * 1000 / 30 },
    paused() { return base !== null },
    painted(canvas: HTMLCanvasElement, phase: string, elapsed: number, progress: number) {
      if (base === null) return
      toolbar.dataset.reviewFrame = String(frame)
      toolbar.dataset.reviewPhase = phase
      toolbar.dataset.reviewProgress = progress.toFixed(6)
      output.textContent = `${String(frame).padStart(3, '0')} / ${(frame / 30).toFixed(3)}s / ${phase} / ${progress.toFixed(3)}`
      document.documentElement.style.setProperty(`--review-${phase}-delay`, `${-Math.max(0, elapsed)}ms`)
      if (recording && frame !== lastRecorded) {
        const copy = document.createElement('canvas')
        copy.width = canvas.width; copy.height = canvas.height
        const context = copy.getContext('2d')!
        context.fillStyle = getComputedStyle(document.querySelector('.personal-site') ?? document.body).getPropertyValue('--paper').trim()
        context.fillRect(0, 0, copy.width, copy.height)
        context.drawImage(canvas, 0, 0)
        const image = document.createElement('img')
        image.alt = `Frame ${frame}, ${(frame / 30).toFixed(3)} seconds, ${phase}, progress ${progress.toFixed(6)}`
        image.dataset.frame = String(frame)
        image.src = copy.toDataURL('image/png')
        image.style.width = '100%'
        images.push(image)
        lastRecorded = frame
      }
      if (phase === 'rest') {
        next.disabled = true
        if (recording) {
          recording = false; show.disabled = false
          gallery.replaceChildren(...images.map(image => {
            const figure = document.createElement('figure')
            const label = document.createElement('figcaption')
            label.textContent = image.alt; figure.style.margin = '0'
            figure.append(image, label); return figure
          }))
        }
      } else if (recording && !pending) {
        pending = requestAnimationFrame(() => { pending = 0; frame++; paint() })
      }
    },
    dispose() {
      cancelAnimationFrame(pending); toolbar.remove(); style.remove(); gallery.remove()
      delete document.documentElement.dataset.flightReview
      document.documentElement.style.removeProperty('--review-dock-delay')
      document.documentElement.style.removeProperty('--review-depart-delay')
      document.documentElement.style.removeProperty('--review-rest-delay')
    },
  }
}
