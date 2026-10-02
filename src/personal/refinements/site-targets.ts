export type SiteTargets = {
  site: HTMLElement | null; header: HTMLElement | null; nav: HTMLElement | null
  main: HTMLElement | null; footer: HTMLElement | null; colophon: HTMLElement | null
}
type Listener = (targets: SiteTargets) => void
const registries = new WeakMap<HTMLElement, { subscribe(listener: Listener): () => void }>()

/** The shell changes on routing; canvas frames and article internals do not. */
export function subscribeSiteTargets(root: HTMLElement, listener: Listener) {
  let registry = registries.get(root)
  if (!registry) {
    const listeners = new Set<Listener>()
    const read = (): SiteTargets => {
      const site = root.querySelector<HTMLElement>('.personal-site')
      const header = site?.querySelector<HTMLElement>('.personal-header') ?? null
      const footer = site?.querySelector<HTMLElement>('.personal-footer') ?? null
      return { site, header, footer, nav: header?.querySelector<HTMLElement>('nav') ?? null,
        main: site?.querySelector<HTMLElement>('#main-content') ?? null,
        colophon: footer?.querySelector<HTMLElement>('.colophon > div') ?? null }
    }
    let targets = read()
    const observer = new MutationObserver(refresh)
    function bind() {
      observer.disconnect()
      observer.observe(root, { childList: true })
      if (targets.site) observer.observe(targets.site, { childList: true })
      if (targets.header) observer.observe(targets.header, { childList: true })
      if (targets.footer) observer.observe(targets.footer, { childList: true, subtree: true })
    }
    function refresh() {
      const next = read()
      if ((Object.keys(next) as (keyof SiteTargets)[]).every(key => next[key] === targets[key])) return
      const rebind = next.site !== targets.site || next.header !== targets.header || next.footer !== targets.footer
      targets = next
      if (rebind) bind()
      listeners.forEach(notify => notify(targets))
    }
    bind()
    registry = { subscribe(notify) {
      listeners.add(notify)
      notify(targets)
      return () => {
        listeners.delete(notify)
        if (!listeners.size) { observer.disconnect(); registries.delete(root) }
      }
    } }
    registries.set(root, registry)
  }
  return registry.subscribe(listener)
}
