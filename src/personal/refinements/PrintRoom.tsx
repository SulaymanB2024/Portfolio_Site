import { useEffect, useMemo, useRef, useState } from 'react'
import { printDots, printSvg, type PrintShape } from './print-study'

export default function PrintRoom({ open, onClose, onSky }: { open: boolean; onClose(): void; onSky(): void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const [shape, setShape] = useState<PrintShape>('orbit')
  const [impression, setImpression] = useState(0)
  const [saved, setSaved] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const dots = useMemo(() => printDots(shape, impression), [shape, impression])
  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      const target = restoreFocus.current?.isConnected ? restoreFocus.current : document.getElementById('main-content')
      target?.focus({ preventScroll: true })
    }
  }, [open])
  useEffect(() => { setSaved(false) }, [shape, impression, open])
  useEffect(() => {
    if (!open) { setDownloadUrl(''); return }
    const href = URL.createObjectURL(new Blob([printSvg(shape, impression)], { type: 'image/svg+xml' }))
    setDownloadUrl(href)
    return () => URL.revokeObjectURL(href)
  }, [open, shape, impression])
  return <dialog ref={dialog} className="print-room" aria-labelledby="print-room-title" aria-describedby="print-room-description" onCancel={onClose} onClick={event => {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
  }}>
    <header className="print-room-header"><span className="print-room-mono">Off the main path / {String(impression + 1).padStart(3, '0')}</span><button type="button" className="print-room-close" aria-label="Close print room" onClick={onClose} autoFocus>×</button></header>
    <div className="print-room-layout"><figure className="print-room-art"><svg viewBox="0 0 400 400" role="img" aria-label={`Generative halftone print: ${shape}, impression ${impression + 1}`}><g>{dots.map((dot, i) => <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity} style={{ transitionDelay: `${(i % 16) * 7}ms` }} />)}</g></svg><figcaption className="print-room-mono">256 points. A little possibility.</figcaption></figure>
      <div className="print-room-copy"><span className="print-room-mono">A small experiment</span><h2 id="print-room-title">The print<br /><em>room.</em></h2><p id="print-room-description">You found the quiet corner. Arrange a few dots, follow a little chance, and take an impression with you.</p><div className="print-room-shapes" role="group" aria-label="Print composition">{(['orbit', 'field', 'drift'] as const).map(value => <button type="button" key={value} aria-pressed={shape === value} onClick={() => setShape(value)}>{value}</button>)}</div><button type="button" className="print-room-recompose" onClick={() => setImpression(value => value + 1)}>Another impression<span aria-hidden="true">↻</span></button><a className="print-room-save" href={downloadUrl || undefined} download={`sulayman-print-${shape}-${String(impression + 1).padStart(3, '0')}.svg`} onClick={event => { if (!downloadUrl) event.preventDefault(); else setSaved(true) }}>Save this print<span aria-hidden="true">↓</span></a><span className="print-room-saved" role="status">{saved ? 'Your SVG is ready to keep.' : 'An original vector, yours to keep.'}</span></div>
    </div>
    <footer className="print-room-footer"><span className="print-room-mono">P.S. You can also type “curious”.</span><button type="button" onClick={onSky}>Or, look up<span aria-hidden="true">↗</span></button></footer>
  </dialog>
}
