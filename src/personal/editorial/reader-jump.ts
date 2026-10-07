/** Reveal and focus a section, including sources inside a disclosure. */
export function jumpToArticleSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(id)
  if (!target) return
  let ancestor = target.parentElement
  while (ancestor) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true
    ancestor = ancestor.parentElement
  }
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior, block: 'start' })
  target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}
