import { touchOrbitIntent } from './mobile-render-policy.ts'

type Orbit = { enabled: boolean; rotateLeft(angle: number): void; update(): unknown }

/** Classify a touch before turning; vertical swipes and pinch belong to the page. */
export function installObjectTouchOrbit(canvas: HTMLCanvasElement, orbit: Orbit, dragging: (active: boolean) => void) {
  const controller = new AbortController()
  const touches = new Set<number>()
  let gesture: { id: number; x: number; y: number; previousX: number; intent: 'pending' | 'scroll' | 'orbit' } | null = null

  function endGesture() {
    if (gesture?.intent === 'orbit') {
      if (canvas.hasPointerCapture(gesture.id)) canvas.releasePointerCapture(gesture.id)
      dragging(false)
    }
    gesture = null
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return
    touches.add(event.pointerId)
    orbit.enabled = false
    endGesture()
    if (touches.size === 1) gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, previousX: event.clientX, intent: 'pending' }
  }, { capture: true, passive: true, signal: controller.signal })
  canvas.addEventListener('pointermove', event => {
    if (!gesture || touches.size !== 1 || event.pointerId !== gesture.id) return
    if (gesture.intent === 'pending') {
      gesture.intent = touchOrbitIntent(event.clientX - gesture.x, event.clientY - gesture.y)
      if (gesture.intent === 'orbit') { canvas.setPointerCapture(event.pointerId); dragging(true) }
    }
    if (gesture.intent !== 'orbit') return
    orbit.rotateLeft(2 * Math.PI * (event.clientX - gesture.previousX) / Math.max(1, canvas.clientHeight))
    gesture.previousX = event.clientX
    orbit.update()
  }, { passive: true, signal: controller.signal })
  const end = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') return
    touches.delete(event.pointerId)
    if (gesture?.id === event.pointerId) endGesture()
    orbit.enabled = touches.size === 0
  }
  canvas.addEventListener('pointerup', end, { signal: controller.signal })
  canvas.addEventListener('pointercancel', end, { signal: controller.signal })
  return () => { controller.abort(); endGesture(); touches.clear(); orbit.enabled = true }
}
