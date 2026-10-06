type TitleOrigin = { left: number; top: number; fontSize: number }

export function resumeTitleOrigin(element: HTMLElement | null): TitleOrigin | null {
  if (!element) return null
  const box = element.getBoundingClientRect()
  return { left: box.left, top: box.top, fontSize: parseFloat(getComputedStyle(element).fontSize) }
}

/** A reversible move into the role, without changing the document's scroll. */
export function createResumeFocus(dialog: HTMLDialogElement, map: HTMLElement, reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let revision = 0, disposed = false, animations: Animation[] = []
  let unlock: (() => void) | null = null
  const easing = 'cubic-bezier(.22,.75,.18,1)'
  const phase = (value: string) => { dialog.dataset.phase = value }
  function cancel() { revision++; animations.forEach(animation => animation.cancel()); animations = [] }
  function animate(element: HTMLElement, frames: Keyframe[], duration: number) {
    const animation = element.animate(frames, { duration, easing, fill: 'both' })
    animations.push(animation)
    return animation
  }
  function restoreMap() { map.style.removeProperty('transform'); map.style.removeProperty('visibility') }
  function concealMap() { map.style.visibility = 'hidden'; map.style.transform = 'translateY(-200vh)' }
  function lock() {
    if (unlock) return
    const roots = [dialog.ownerDocument.documentElement, dialog.ownerDocument.body]
    const previous = roots.map(root => ({ root, value: root.style.getPropertyValue('overflow'), priority: root.style.getPropertyPriority('overflow') }))
    roots.forEach(root => root.style.setProperty('overflow', 'hidden'))
    unlock = () => {
      previous.forEach(({ root, value, priority }) => value ? root.style.setProperty('overflow', value, priority) : root.style.removeProperty('overflow'))
      unlock = null
    }
  }
  function titleTransform(heading: HTMLElement, origin: TitleOrigin | null) {
    if (!origin) return 'translateY(12px) scale(.96)'
    const box = heading.getBoundingClientRect(), size = parseFloat(getComputedStyle(heading).fontSize)
    const scale = Math.max(.2, Math.min(1, origin.fontSize / size))
    return `translate(${origin.left - box.left}px, ${origin.top - box.top}px) scale(${scale})`
  }
  return {
    enter(heading: HTMLElement, origin: TitleOrigin | null, direction = 0) {
      if (disposed) return
      const opening = !dialog.open
      cancel()
      const ticket = revision
      lock()
      if (opening) dialog.showModal()
      dialog.scrollTop = 0
      heading.focus({ preventScroll: true })
      if (reduced()) { concealMap(); phase('focused'); return }
      phase('entering')
      const title = animate(heading, [{ transform: opening ? titleTransform(heading, origin) : `translateX(${direction * 22}px) scale(.98)` }, { transform: 'none' }], opening ? 560 : 340)
      if (opening) {
        restoreMap()
        const mapBox = map.getBoundingClientRect()
        map.style.transformOrigin = origin ? `${origin.left - mapBox.left}px ${origin.top - mapBox.top}px` : '50% 50%'
        const departing = animate(map, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.24)', opacity: 0 }], 380)
        animate(dialog, [{ opacity: 0 }, { opacity: 1 }], 240)
        void departing.finished.then(() => { if (revision === ticket) { departing.cancel(); concealMap() } }, () => {})
      } else concealMap()
      dialog.querySelectorAll<HTMLElement>('.rx-focus-work,.rx-focus-support,.rx-chapter-kicker,.rx-job-title,.rx-meta,.rx-proof')
        .forEach(element => animate(element, [{ opacity: .15, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], opening ? 430 : 300))
      void title.finished.then(() => { if (revision === ticket) phase('focused') }, () => {})
    },
    exit(heading: HTMLElement | null, origin: HTMLElement | null, finished: () => void) {
      if (disposed || !dialog.open || dialog.dataset.phase === 'leaving') return
      cancel()
      const ticket = revision
      const finish = () => {
        if (disposed || revision !== ticket) return
        cancel(); dialog.close(); unlock?.(); restoreMap(); map.style.removeProperty('transform-origin'); phase('overview'); finished()
      }
      if (reduced()) { finish(); return }
      phase('leaving'); restoreMap()
      if (heading) animate(heading, [{ transform: 'none' }, { transform: titleTransform(heading, resumeTitleOrigin(origin)) }], 400)
      const returning = animate(map, [{ transform: 'scale(1.24)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], 420)
      animate(dialog, [{ opacity: 1, offset: 0 }, { opacity: 1, offset: .15 }, { opacity: 0, offset: 1 }], 420)
      void returning.finished.then(finish, () => {})
    },
    dispose() {
      disposed = true; cancel(); if (dialog.open) dialog.close(); unlock?.(); restoreMap(); map.style.removeProperty('transform-origin')
    },
  }
}
