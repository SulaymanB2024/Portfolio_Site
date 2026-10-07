/** Add a cue only when a readable table actually extends beyond its viewport.
 * Resize observation also covers late figures, font loading, and rotation. */
export function installTableOverflowHints(root: HTMLElement) {
  const tables = new Map<HTMLElement, { description: string | null; table: HTMLTableElement | null }>()
  let disposed = false
  const restore = (element: HTMLElement, description: string | null) => {
    delete element.dataset.tableOverflow
    if (description == null) element.removeAttribute('aria-description')
    else element.setAttribute('aria-description', description)
  }
  const update = (element: HTMLElement) => {
    const overflow = element.scrollWidth > element.clientWidth + 1
    element.dataset.tableOverflow = String(overflow)
    if (overflow) element.setAttribute('aria-description', 'Scroll horizontally to compare all columns.')
    else {
      const previous = tables.get(element)?.description
      if (previous == null) element.removeAttribute('aria-description')
      else element.setAttribute('aria-description', previous)
    }
  }
  const resize = new ResizeObserver(entries => {
    if (disposed) return
    entries.forEach(entry => {
      const target = entry.target as HTMLElement
      const viewport = tables.has(target) ? target : target.closest<HTMLElement>('.article-table-wrap, .work-table-wrap, .toll-snapshot__scroll')
      if (viewport && tables.has(viewport)) update(viewport)
    })
  })
  const discover = () => {
    if (disposed) return
    for (const [element, original] of tables) {
      if (root.contains(element)) continue
      resize.unobserve(element)
      if (original.table) resize.unobserve(original.table)
      restore(element, original.description)
      tables.delete(element)
    }
    root.querySelectorAll<HTMLElement>('.article-table-wrap, .work-table-wrap, .toll-snapshot__scroll').forEach(element => {
      if (!tables.has(element)) {
        tables.set(element, { description: element.getAttribute('aria-description'), table: null })
        resize.observe(element)
      }
      const original = tables.get(element)!
      const table = element.querySelector('table')
      if (table !== original.table) {
        if (original.table) resize.unobserve(original.table)
        original.table = table
        if (table) resize.observe(table)
      }
      update(element)
    })
  }
  const mutations = new MutationObserver(discover)
  mutations.observe(root, { childList: true, characterData: true, subtree: true })
  document.fonts.addEventListener('loadingdone', discover)
  discover()
  void document.fonts.ready.then(discover)
  return () => {
    disposed = true
    resize.disconnect()
    mutations.disconnect()
    document.fonts.removeEventListener('loadingdone', discover)
    for (const [element, original] of tables) restore(element, original.description)
    tables.clear()
  }
}
