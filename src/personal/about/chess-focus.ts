export type ChessFocus = {
  enter(trigger: HTMLElement): void
  close(restoreFocus?: boolean): void
  dispose(): void
}

/** Expand the existing stage, including its live canvas; never remount a game. */
export function createChessFocus(stage: HTMLElement, onChange: (expanded: boolean) => void): ChessFocus {
  const doc = stage.ownerDocument
  let expanded = false, nativeEntered = false, disposed = false
  let trigger: HTMLElement | null = null
  let restore: (() => void) | null = null
  const focusable = () => [...stage.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], select:not(:disabled), input:not(:disabled), summary, [tabindex]:not([tabindex="-1"])')]
    .filter(element => element.tabIndex >= 0 && !element.closest('[hidden], [inert]') && element.getClientRects().length > 0 && doc.defaultView?.getComputedStyle(element).visibility !== 'hidden')

  function close(restoreFocus = true, notify = true) {
    if (!expanded) return
    expanded = false; nativeEntered = false
    restore?.(); restore = null
    if (doc.fullscreenElement === stage) void doc.exitFullscreen().catch(() => {})
    if (notify) onChange(false)
    if (restoreFocus && trigger?.isConnected && trigger.getClientRects().length) trigger.focus({ preventScroll: true })
    trigger = null
  }
  function fullscreenChanged() {
    if (doc.fullscreenElement === stage) nativeEntered = true
    else if (nativeEntered) close()
  }
  function keydown(event: KeyboardEvent) {
    if (!expanded || event.defaultPrevented) return
    // Native select dismissal and nested piece/disclosure Escape take precedence.
    if (event.key === 'Escape' && (event.target as HTMLElement | null)?.closest?.('select')) return
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
    if (event.key !== 'Tab') return
    const elements = focusable(), first = elements[0], last = elements.at(-1)
    if (!first || !last) return
    if (event.shiftKey && (doc.activeElement === first || !stage.contains(doc.activeElement))) {
      event.preventDefault(); last.focus({ preventScroll: true })
    } else if (!event.shiftKey && (doc.activeElement === last || !stage.contains(doc.activeElement))) {
      event.preventDefault(); first.focus({ preventScroll: true })
    }
  }
  doc.addEventListener('fullscreenchange', fullscreenChanged)
  doc.addEventListener('keydown', keydown)

  return {
    enter(source) {
      if (expanded || disposed) return
      expanded = true; trigger = source
      const attributes = ['data-chess-expanded', 'role', 'aria-modal', 'aria-label'].map(name => [name, stage.getAttribute(name)] as const)
      const roots = [doc.documentElement, doc.body].map(element => ({ element, value: element.style.getPropertyValue('overflow'), priority: element.style.getPropertyPriority('overflow') }))
      const siblings: { element: HTMLElement; inert: boolean }[] = []
      // Isolate siblings at each level while retaining the original canvas subtree.
      for (let branch: Element = stage; branch.parentElement; branch = branch.parentElement) {
        for (const sibling of branch.parentElement.children) {
          if (sibling === branch || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue
          const element = sibling as HTMLElement
          siblings.push({ element, inert: element.inert }); element.inert = true
        }
        if (branch.parentElement === doc.body) break
      }
      stage.setAttribute('data-chess-expanded', '')
      stage.setAttribute('role', 'dialog'); stage.setAttribute('aria-modal', 'true'); stage.setAttribute('aria-label', 'Fullscreen chess board')
      roots.forEach(({ element }) => element.style.setProperty('overflow', 'hidden'))
      restore = () => {
        for (const [name, value] of attributes) { if (value === null) stage.removeAttribute(name); else stage.setAttribute(name, value) }
        for (const { element, value, priority } of roots) { if (value) element.style.setProperty('overflow', value, priority); else element.style.removeProperty('overflow') }
        for (const { element, inert } of siblings) element.inert = inert
      }
      onChange(true)
      // The viewport expansion remains usable if native fullscreen is unavailable.
      if (typeof stage.requestFullscreen === 'function' && doc.fullscreenEnabled !== false && !doc.fullscreenElement) {
        try {
          void stage.requestFullscreen().then(() => {
            if (disposed || !expanded) {
              if (doc.fullscreenElement === stage) void doc.exitFullscreen().catch(() => {})
            } else fullscreenChanged()
          }).catch(() => {})
        } catch { /* Keep the accessible viewport expansion. */ }
      }
    },
    close,
    dispose() {
      disposed = true; close(false, false)
      doc.removeEventListener('fullscreenchange', fullscreenChanged)
      doc.removeEventListener('keydown', keydown)
    },
  }
}
