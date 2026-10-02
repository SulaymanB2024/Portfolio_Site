import { createCanvasSketch } from './generative/canvas-runtime'
import type { GenerativeArtwork } from './generative/types'
import { artworkWorkerBackend } from './artwork-worker-backend'
import { previewScheduler, type PreviewFrameStats, type PreviewHandle } from './preview-scheduler'
import { createArtworkHandoffs } from './artwork-handoff'

export type ArtworkPlayerStatus = {
  id: number; painted: boolean; failed: boolean; renderer: 'worker' | 'main'; jobs: number; stats: Readonly<PreviewFrameStats>
}
let nextPlayerId = 1

/** The renderer owns an imperative surface, so a route can lend it without resetting its sketch. */
export function createArtworkPlayer(artwork: GenerativeArtwork, physicalSize: number) {
  const surface = document.createElement('div')
  surface.style.width = surface.style.height = '100%'
  const listeners = new Set<(status: ArtworkPlayerStatus) => void>()
  const status: ArtworkPlayerStatus = { id: nextPlayerId++, painted: false, failed: false, renderer: 'main', jobs: 0,
    stats: { frames: 0, drawMs: 0, averageMs: 0, targetFps: 18 } }
  let job: PreviewHandle | null = null
  let worker: PreviewHandle | null = null
  let sketch: ReturnType<typeof createCanvasSketch> | null = null
  let disposed = false, loadingMain = false, visible = false, paused = false, traveling = false, travelPaused = false
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const emit = () => listeners.forEach(listener => listener(status))
  const active = () => !disposed && !status.failed && !paused && !(traveling && travelPaused) && !document.hidden && !motion.matches && (visible || traveling)
  const sync = () => job?.setActive(active())
  const frame = (stats: Readonly<PreviewFrameStats>) => {
    if (disposed) return
    status.stats = stats; status.painted = true; emit()
  }
  const fail = () => {
    if (disposed) return
    job?.remove(); sketch?.remove(); status.failed = true; emit()
  }
  function main() {
    if (disposed || loadingMain) return
    loadingMain = true; worker?.remove(); worker = null; job = null
    status.renderer = 'main'; status.jobs = 0; status.painted = false; emit()
    artwork.factory().then(module => {
      if (disposed) return
      sketch = createCanvasSketch(module.default, surface, { physicalSize })
      job = previewScheduler.add({ active: active(), draw: () => sketch?.draw() ?? false, onFrame: frame, onError: fail })
    }).catch(fail)
  }
  worker = artworkWorkerBackend.register({ host: surface, sketchId: artwork.sketchId, physicalSize, active: false,
    onFrame: frame, onError: main, onJobs: count => { status.jobs = count; emit() } })
  if (worker) { job = worker; status.renderer = 'worker' } else main()
  document.addEventListener('visibilitychange', sync)
  motion.addEventListener('change', sync)
  return {
    get status() { return status },
    moveTo(host: HTMLElement) { if (!disposed) host.replaceChildren(surface) },
    setVisible(next: boolean) { visible = next; sync() },
    setPlayback(nextVisible: boolean, nextPaused: boolean) { visible = nextVisible; paused = nextPaused; sync() },
    setTravel(next: boolean) { if (next && !traveling) travelPaused = paused; traveling = next; sync() },
    subscribe(listener: (status: ArtworkPlayerStatus) => void) { listeners.add(listener); listener(status); return () => { listeners.delete(listener) } },
    dispose() {
      if (disposed) return
      disposed = true; listeners.clear(); job?.remove(); worker?.remove(); sketch?.remove(); surface.remove()
      document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync)
    },
  }
}
export type ArtworkPlayer = ReturnType<typeof createArtworkPlayer>
export const artworkPlayers = createArtworkHandoffs<HTMLElement, ArtworkPlayer>()
if (import.meta.hot) import.meta.hot.dispose(() => artworkPlayers.dispose())
