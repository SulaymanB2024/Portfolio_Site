import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { defaultPrint, instrumentSvg, normalizePrint, printCompositionUrl, printForms, printPoints, type PrintComposition } from './print-instrument'
import { drawPrint, mountPrintInstrument } from './print-instrument-renderer'
import './print-room-studio.css'

type Props = { open: boolean; arrival: PrintComposition | null; onClose(): void; onSky(): void }

export default function PrintInstrument({ open, arrival, onClose, onSky }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const player = useRef<ReturnType<typeof mountPrintInstrument>>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const lastPose = useRef<PrintComposition | null>(null)
  const download = useRef('')
  const operation = useRef(0)
  const drag = useRef<{ id: number; x: number; y: number; turn: number; tilt: number; touch: boolean } | null>(null)
  const [composition, setComposition] = useState<PrintComposition>(() => arrival ?? { ...defaultPrint, tone: document.documentElement.dataset.appearance === 'dark' ? 'ink' : 'paper' })
  const [held, setHeld] = useState(Boolean(arrival))
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close(); drag.current = null
      document.body.style.overflow = overflow
      const target = restoreFocus.current?.isConnected && restoreFocus.current !== document.body ? restoreFocus.current : document.getElementById('main-content')
      target?.focus({ preventScroll: true })
    }
  }, [open])
  useEffect(() => {
    if (!open || !canvas.current) return
    player.current = mountPrintInstrument(canvas.current, arrival ?? lastPose.current ?? composition)
    player.current?.setHeld(held || Boolean(arrival))
    if (!player.current) setMessage('This browser could not open the drawing surface.')
    return () => { const current = player.current; if (current) lastPose.current = current.snapshot(); current?.dispose(); player.current = null }
  }, [open])
  useEffect(() => { player.current?.update(composition) }, [composition])
  useEffect(() => { player.current?.setHeld(held) }, [held])
  useEffect(() => {
    if (!arrival) return
    setComposition(arrival); setHeld(true); setMessage('A shared composition, held exactly as it was made.'); setShareUrl('')
    lastPose.current = arrival
    if (player.current) { player.current.dispose(); player.current = canvas.current ? mountPrintInstrument(canvas.current, arrival) : null; player.current?.setHeld(true) }
  }, [arrival])
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(query.matches)
    query.addEventListener('change', changed)
    return () => query.removeEventListener('change', changed)
  }, [])
  useEffect(() => {
    operation.current++
    if (!open) setSaving(false)
    if (!open && download.current) { URL.revokeObjectURL(download.current); download.current = '' }
    return () => { operation.current++; if (download.current) { URL.revokeObjectURL(download.current); download.current = '' } }
  }, [open])

  function edit(change: Partial<PrintComposition>) {
    setComposition(previous => normalizePrint({ ...previous, ...change })); setMessage(''); setShareUrl('')
  }
  function snapshot() {
    const value = player.current?.snapshot() ?? composition
    player.current?.setHeld(true); setHeld(true); setComposition(value)
    return value
  }
  function close() { const value = player.current?.snapshot(); if (value) { lastPose.current = value; setComposition(value) }; onClose() }
  function start(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, turn: composition.turn, tilt: composition.tilt, touch: event.pointerType === 'touch' }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = event.clientX - current.x, dy = event.clientY - current.y
    if (current.touch && Math.abs(dy) > Math.abs(dx)) return
    edit({ turn: current.turn + dx * .009, tilt: current.touch ? current.tilt : current.tilt + dy * .006 })
  }
  function key(event: KeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, Partial<PrintComposition>> = {
      ArrowLeft: { turn: composition.turn - .12 }, ArrowRight: { turn: composition.turn + .12 },
      ArrowUp: { tilt: composition.tilt + .12 }, ArrowDown: { tilt: composition.tilt - .12 },
      Home: { turn: defaultPrint.turn, tilt: defaultPrint.tilt },
    }
    if (directions[event.key]) { event.preventDefault(); edit(directions[event.key]) }
  }
  function downloadBlob(blob: Blob, extension: string, value: PrintComposition) {
    if (download.current) URL.revokeObjectURL(download.current)
    download.current = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = download.current; link.download = `sulayman-${value.form}-${String(value.seed).padStart(6, '0')}.${extension}`
    link.click()
  }
  async function save(format: 'svg' | 'png') {
    const value = snapshot()
    const attempt = operation.current
    const active = () => attempt === operation.current && dialog.current?.open
    setSaving(true); setMessage('Preparing your print…')
    try {
      if (format === 'svg') downloadBlob(new Blob([instrumentSvg(value)], { type: 'image/svg+xml' }), 'svg', value)
      else {
        const sheet = document.createElement('canvas'); sheet.width = 1800; sheet.height = 1980
        const ctx = sheet.getContext('2d')
        if (!ctx) throw new Error('Drawing surface unavailable')
        drawPrint(ctx, printPoints(value), value, 1800, true)
        const blob = await new Promise<Blob | null>(resolve => sheet.toBlob(resolve, 'image/png'))
        if (!active()) return
        if (!blob) throw new Error('Print encoding unavailable')
        downloadBlob(blob, 'png', value)
      }
      if (active()) setMessage(`Your ${format.toUpperCase()} print is ready. The pose is held.`)
    } catch { if (active()) setMessage('The print could not be prepared. Try the other format.') }
    finally { if (active()) setSaving(false) }
  }
  async function share() {
    const address = printCompositionUrl(location.href, snapshot())
    const attempt = operation.current
    setShareUrl(address)
    try { await navigator.clipboard.writeText(address); if (attempt === operation.current) setMessage('Composition link copied. This pose will open exactly as you see it.') }
    catch { if (attempt === operation.current) setMessage('Select the composition link below to copy it.') }
  }

  return <dialog ref={dialog} className="print-room print-room-studio" aria-labelledby="print-room-title" aria-describedby="print-room-description" onCancel={close} onClick={event => {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close()
  }}>
    <header className="print-room-header"><span className="print-room-mono">A little possibility / {String(composition.seed).padStart(6, '0')}</span><button type="button" className="print-room-close" aria-label="Close print room" onClick={close} autoFocus>×</button></header>
    <div className="print-room-layout">
      <figure className="print-room-art">
        <div className="print-instrument-stage" data-tone={composition.tone} tabIndex={0} role="group" aria-label={`Turn the ${composition.form} study`} aria-describedby="print-instrument-help" onPointerDown={start} onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onLostPointerCapture={() => { drag.current = null }} onKeyDown={key}>
          <canvas ref={canvas} aria-hidden="true" />
          <span className="print-instrument-corner" aria-hidden="true">{composition.form}</span>
          <span className="print-instrument-state" aria-hidden="true">{reduced ? 'Still study' : held ? 'Pose held' : 'In motion'}</span>
        </div>
        <figcaption><span>{composition.form[0].toUpperCase() + composition.form.slice(1)}, variation {String(composition.seed).padStart(6, '0')}</span><span id="print-instrument-help">Drag to turn · Arrow keys to compose</span></figcaption>
      </figure>
      <div className="print-room-copy"><span className="print-room-mono">An instrument for form & grain</span><h2 id="print-room-title">The print<br /><em>room.</em></h2><p id="print-room-description">A surface, a little tension, a point of view. Find a form you like and take an impression with you.</p>
        <div className="print-room-shapes" role="group" aria-label="Print composition">{printForms.map(form => <button type="button" key={form} aria-pressed={composition.form === form} onClick={() => edit({ form })}>{form}</button>)}</div>
        <div className="print-instrument-sliders">
          <label><span>Tension <output>{composition.tension}</output></span><input aria-label="Print tension" type="range" min="0" max="100" value={composition.tension} onChange={event => edit({ tension: Number(event.target.value) })} /></label>
          <label><span>Grain <output>{composition.grain}</output></span><input aria-label="Print grain" type="range" min="0" max="100" value={composition.grain} onChange={event => edit({ grain: Number(event.target.value) })} /></label>
        </div>
        <div className="print-instrument-pose"><div role="group" aria-label="Print background"><button type="button" aria-pressed={composition.tone === 'paper'} onClick={() => edit({ tone: 'paper' })}>Paper</button><button type="button" aria-pressed={composition.tone === 'ink'} onClick={() => edit({ tone: 'ink' })}>Ink</button></div><button type="button" disabled={reduced} aria-pressed={held} onClick={() => { setMessage(''); setShareUrl(''); if (!held) snapshot(); else setHeld(false) }}>{held ? 'Resume motion' : 'Hold this pose'}</button></div>
        <button type="button" className="print-room-recompose" onClick={() => edit({ seed: (composition.seed + 7409) % 999999 + 1 })}>Another variation<span aria-hidden="true">↻</span></button>
        <div className="print-instrument-export"><button type="button" disabled={saving} onClick={() => { void save('svg') }}>Save vector <span aria-hidden="true">↓</span></button><button type="button" disabled={saving} onClick={() => { void save('png') }}>Save PNG <span aria-hidden="true">↓</span></button></div>
        <button type="button" className="print-room-recompose" onClick={() => { void share() }}>Share composition<span aria-hidden="true">↗</span></button>
        <span className="print-room-saved" role="status">{message || 'Your composition. A print to keep.'}</span>
        {shareUrl && <input className="print-instrument-share" aria-label="Composition link" readOnly value={shareUrl} onFocus={event => event.currentTarget.select()} />}
      </div>
    </div>
    <footer className="print-room-footer"><span className="print-room-mono">P.S. You can also type “curious”.</span><button type="button" onClick={() => { close(); onSky() }}>Or, look up<span aria-hidden="true">↗</span></button></footer>
  </dialog>
}
