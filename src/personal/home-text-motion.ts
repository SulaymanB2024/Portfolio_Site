import { homeTextTokens, homeWordDelay } from './home-text-policy'
import './home-text-motion.css'

export const homeTextHeadings = '.hero-copy h1,.work-collection-intro h2,.work-study-text h2,.journal-heading h2,.journal-essay h3,.site-closing h2'
const labels = '.hero-copy > .arrow-link,.work-study-link,.work-further a > span:first-child,.section-tail .arrow-link,.journal-read,.journal-all,.site-closing-contact > .arrow-link'
type Replacement = { element: HTMLElement; original: Text; parent: Node; inserted: Node[] }

/** Progressive enhancement of static copy: no duplicate text or changed semantic names. */
export function installHomeTextMotion(site: HTMLElement) {
  const enhanced = new Set<HTMLElement>()
  const ownedLabels = new Map<HTMLElement, string>()
  const abandoned = new Set<HTMLElement>()
  const replacements: Replacement[] = []
  function restore(record: Replacement) {
    const { original, parent, inserted } = record
    const first = inserted.find(node => node.parentNode === parent)
    if (!first) return
    parent.insertBefore(original, first)
    inserted.forEach(node => { if (node.parentNode === parent) parent.removeChild(node) })
  }
  function abandon(element: HTMLElement) {
    abandoned.add(element)
    replacements.filter(record => record.element === element).forEach(restore)
    delete element.dataset.homeText
    if (element.getAttribute('aria-label') === ownedLabels.get(element)) element.removeAttribute('aria-label')
  }
  // If React updates an enhanced string, restore its own updated Text node immediately.
  const changes = new MutationObserver(records => {
    for (const event of records) {
      const changed = replacements.find(record => record.original === event.target)
      if (!changed || abandoned.has(changed.element)) continue
      abandon(changed.element)
    }
  })
  function scan() {
    // React can replace a host's complete text rather than update the retained Text node.
    for (const element of enhanced) {
      if (!abandoned.has(element) && !element.querySelector('.home-text-word')) abandon(element)
    }
    site.querySelectorAll<HTMLElement>(`${homeTextHeadings},${labels}`).forEach(element => {
      if (enhanced.has(element) || abandoned.has(element)) return
      enhanced.add(element)
      // Inline word boxes must not insert spoken spaces at a wbr or punctuation boundary.
      const originalLabel = element.getAttribute('aria-label')
      if (!originalLabel && element.matches(homeTextHeadings)) {
        const label = element.innerText.replace(/\s+/gu, ' ').trim()
        ownedLabels.set(element, label)
        element.setAttribute('aria-label', label)
      }
      element.dataset.homeText = element.matches('.hero-copy h1') ? 'hero' : element.matches(homeTextHeadings) ? 'heading' : 'label'
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      const texts: Text[] = []
      let node: Node | null
      while ((node = walker.nextNode())) {
        if (node.textContent?.trim() && !node.parentElement?.closest('.period,[aria-hidden="true"],.home-text-word')) texts.push(node as Text)
      }
      let index = 0
      for (const original of texts) {
        const parent = original.parentNode!
        const fragment = document.createDocumentFragment()
        // One run preserves the anonymous flex item used by a native text label.
        const run = element.dataset.homeText === 'label' ? document.createElement('span') : null
        if (run) { run.className = 'home-text-label-run'; fragment.append(run) }
        const content = run || fragment
        const inserted: Node[] = []
        for (const token of homeTextTokens(original.data)) {
          let part: Node
          if (!token.trim()) part = document.createTextNode(token)
          else {
            const word = document.createElement('span')
            word.className = 'home-text-word'
            word.textContent = token
            const delay = homeWordDelay(index++)
            word.style.setProperty('--home-word-delay', String(delay))
            word.style.setProperty('--home-word-rate', String(1 / (1 - delay)))
            if (token.replace(/[^\p{L}\p{N}]/gu, '').length > 3) word.dataset.homeWordAccent = 'true'
            part = word
          }
          if (!run) inserted.push(part)
          content.append(part)
        }
        if (run) inserted.push(run)
        // Retain React's original Text node for exact restoration on effect cleanup.
        parent.replaceChild(fragment, original)
        replacements.push({ element, original, parent, inserted })
        changes.observe(original, { characterData: true })
      }
    })
  }
  scan()
  const mutations = new MutationObserver(scan)
  mutations.observe(site, { childList: true, subtree: true })
  return () => {
    mutations.disconnect()
    changes.disconnect()
    replacements.forEach(restore)
    enhanced.forEach(element => {
      delete element.dataset.homeText
      if (element.getAttribute('aria-label') === ownedLabels.get(element)) element.removeAttribute('aria-label')
    })
  }
}
