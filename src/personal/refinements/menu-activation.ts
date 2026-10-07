type MenuActivation = Pick<MouseEvent, 'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'defaultPrevented' | 'preventDefault'> & {
  currentTarget: Pick<HTMLAnchorElement, 'hash' | 'target' | 'hasAttribute' | 'ownerDocument'>
}

/** Keep the destination ahead of dismissal: iOS may lose native activation
 * when React hides the tapped anchor before the browser follows it. */
export function activateMenuLink(event: MenuActivation, close: () => void): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  const link = event.currentTarget
  const view = link.ownerDocument.defaultView
  if (!view || !link.hash.startsWith('#/') || link.target === '_blank' || link.hasAttribute('download')) return false

  // Navigation motion owns an already-handled gesture. Respect other handlers
  // that prevented activation without committing this destination.
  if (event.defaultPrevented && view.location.hash !== link.hash) return false
  if (!event.defaultPrevented) {
    event.preventDefault()
    if (view.location.hash !== link.hash) view.location.hash = link.hash
  }
  close()
  return true
}
