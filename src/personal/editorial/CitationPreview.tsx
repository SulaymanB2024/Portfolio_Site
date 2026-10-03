import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { articleSection } from './library'

type Citation = {
  label: string
  title?: string
  text: string
  links: { href: string; label: string; external: boolean }[]
  href: string
  trigger: HTMLAnchorElement
}

/** Read the rendered source, so a preview and the full bibliography cannot drift. */
function useCitationPreview() {
  const [citation, setCitation] = useState<Citation | null>(null)
  const openCitation = useCallback((event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
    const trigger = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.article-citation a') : null
    const href = trigger?.getAttribute('href')
    if (!trigger || !href || trigger.target || trigger.hasAttribute('download')) return false
    if (href.startsWith('#/') && href.split('?')[0] !== location.hash.split('?')[0]) return false
    const id = articleSection(href)
    if (!id || !/^(source-|note-)/.test(id)) return false
    const source = document.getElementById(id)
    if (!source || !source.closest('.reader-prose') || !('showPopover' in HTMLElement.prototype)) return false
    const copy = source.cloneNode(true) as HTMLElement
    // Footnote return arrows belong to the bibliography, not the source text.
    copy.querySelectorAll('a[aria-label^="Back to reference"]').forEach(link => link.remove())
    const links = [...copy.querySelectorAll<HTMLAnchorElement>('a[href]')].map(link => ({ href: link.getAttribute('href')!, label: link.textContent?.trim().replace(/\s*↗$/, '') || 'Open source', external: link.origin !== location.origin }))
    const title = id.startsWith('source-') ? links[0]?.label : undefined
    if (title) copy.querySelectorAll('a[href]').forEach(link => link.replaceWith(' '))
    copy.querySelectorAll('p, div, li').forEach(block => block.append(' '))
    const text = copy.textContent?.trim().replace(/\s+/g, ' ') || ''
    if (!text && !title) return false
    event.preventDefault()
    setCitation({ label: trigger.getAttribute('aria-label') || 'Source note', title, text, links, href, trigger })
    return true
  }, [])
  return { citation, openCitation, closeCitation: () => setCitation(null) }
}

export default function CitationPreview() {
  const { citation, openCitation, closeCitation: close } = useCitationPreview()
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const article = panel.current?.closest('.article-page')
    if (!article) return
    // Handle before the reader's delegated navigation; only the note rerenders.
    const click = (event: Event) => { if (event instanceof MouseEvent) openCitation(event) }
    article.addEventListener('click', click)
    return () => article.removeEventListener('click', click)
  }, [openCitation])
  useLayoutEffect(() => {
    if (!citation || !panel.current) return
    const element = panel.current
    citation.trigger.setAttribute('aria-expanded', 'true')
    citation.trigger.setAttribute('aria-controls', 'reader-source-preview')
    element.showPopover()
    closeButton.current?.focus({ preventScroll: true })
    return () => {
      if (element.matches(':popover-open')) element.hidePopover()
      citation.trigger.removeAttribute('aria-expanded')
      citation.trigger.removeAttribute('aria-controls')
    }
  }, [citation])

  function dismiss() {
    citation?.trigger.focus({ preventScroll: true })
    close()
  }

  return <div ref={panel} id="reader-source-preview" className="reader-source-preview" popover="auto" role="dialog" aria-labelledby="reader-source-label" onToggle={event => { if (event.newState === 'closed' && !event.currentTarget.matches(':popover-open')) close() }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); dismiss() }
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')]
    // Leave the note at its keyboard boundary and return to the cited passage.
    if (document.activeElement === (event.shiftKey ? controls[0] : controls.at(-1))) { event.preventDefault(); dismiss() }
  }}>
    {citation && <><div className="reader-source-heading"><span id="reader-source-label">{citation.label}</span><button ref={closeButton} type="button" aria-label="Close source note" onClick={dismiss}>×</button></div>{citation.title && <h2>{citation.title}</h2>}{citation.text && <p>{citation.text}</p>}<nav aria-label="Source note links">{citation.links.map((link, index) => <a key={`${link.href}-${index}`} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>{citation.title && index === 0 ? 'Open source' : link.label}<span aria-hidden="true"> ↗</span></a>)}<a className="reader-source-full" href={citation.href} onClick={close}>In the bibliography <span aria-hidden="true">↓</span></a></nav></>}
  </div>
}
