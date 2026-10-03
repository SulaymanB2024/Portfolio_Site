// A small parser-blocking script: set the palette and fallback policy before body paint.
// Keep this independent of the app bundle so a failed module still leaves a readable page.
;(function () {
  const page = document.documentElement
  let dark = false
  try { dark = localStorage.getItem('sulayman-appearance') === 'dark' } catch { /* Optional storage. */ }
  page.dataset.appearance = dark ? 'dark' : 'light'
  page.style.colorScheme = dark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111210' : '#f5f2ea')
  page.dataset.siteBoot = 'pending'

  const appSelector = ':scope > .personal-site, :scope > .art-export'
  let observer
  let fallback
  const reveal = setTimeout(() => {
    if (page.dataset.siteBoot === 'pending') page.dataset.siteBoot = 'waiting'
  }, 1000)
  const deadline = setTimeout(() => finish('fallback'), 12000)
  const booting = () => page.dataset.siteBoot === 'pending' || page.dataset.siteBoot === 'waiting'
  function finish(state) {
    if (!booting()) return
    const root = document.getElementById('root')
    // React can remove the original HTML before an initial render error is reported.
    if (state === 'fallback' && fallback && root && !root.querySelector(appSelector) && !root.contains(fallback)) root.replaceChildren(fallback)
    page.dataset.siteBoot = state
    fallback = undefined
    clearTimeout(reveal)
    clearTimeout(deadline)
    observer?.disconnect()
    document.removeEventListener('readystatechange', observeMount)
    document.removeEventListener('DOMContentLoaded', observeMount)
    window.removeEventListener('error', failed, true)
    window.removeEventListener('unhandledrejection', failed)
  }
  function inspectMount() {
    // These are the two supported app roots; the static document is never app-ready.
    if (document.getElementById('root')?.querySelector(appSelector)) finish('ready')
  }
  function observeMount() {
    if (document.readyState === 'loading' || !booting() || observer) return
    const root = document.getElementById('root')
    if (!root) { finish('fallback'); return }
    // Interactive fires before deferred modules run; retain the original DOM, without cloning it.
    fallback = root.querySelector(':scope > .static-site')
    observer = new MutationObserver(inspectMount)
    observer.observe(root, { childList: true })
    inspectMount()
  }
  function failed(event) {
    if (event.type === 'unhandledrejection' || event instanceof ErrorEvent || event.target instanceof HTMLScriptElement) queueMicrotask(() => finish('fallback'))
  }
  document.addEventListener('readystatechange', observeMount)
  document.addEventListener('DOMContentLoaded', observeMount, { once: true })
  window.addEventListener('error', failed, true)
  window.addEventListener('unhandledrejection', failed)
})()
