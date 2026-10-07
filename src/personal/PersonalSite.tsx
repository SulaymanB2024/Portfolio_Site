import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Art } from './Art'
import { ProjectTransitionProvider } from './ProjectTransition'
import { contact, projects, type ArtKind } from './content'
import { siteCopy, withWritingCopy } from './site-copy'
import { updateSearchHead } from './search-head'
import { recordPersonalPageView } from './analytics'
import catalog from './editorial/data/catalog.json'
import { resolveRoute } from './editorial/routes'
import { findCaseStudy } from './projects/case-studies'
import { type ArticleSummary } from './editorial/types'
import { ArtworkMotionProvider } from './editorial/ArtworkMotion'
import { prepareArticleArrival } from './editorial/article-arrival'
import { articleSection } from './editorial/library'
import { jumpToArticleSection } from './editorial/reader-jump'
import { homePage, workPage, writingPage, topicPage, articlePage, projectPage, resumePage, caseStudyPage, aboutPage, contactPage, prepareRoutePage } from './route-pages'
import { findReadingTopic } from './editorial/topics'
import { artworkTransitionName, galleryArticleJourney, startArtworkTransition, type ArtworkTransition } from './editorial/artwork-continuity'
import { getArticleGenerativeArtwork } from './editorial/generative/manifest'
import { installMenuDismissal } from './refinements/menu-dismissal'
import { focusWithoutWarmup } from './refinements/warmup-policy'
import RouteBoundary from './RouteBoundary'
import BrandIdentity from './BrandIdentity'
import { DestinationLink } from './DestinationLink'
import { prepareRouteResources } from './route-preparation'
import { installRouteScroll } from './refinements/route-scroll'
import { installTableOverflowHints } from './refinements/table-overflow'
import './editorial/artwork-continuity.css'
import './personal.css'
import './editorial/editorial.css'
import './mobile-polish.css'
import './header-refinement.css'
import './visual-restraint.css'

const Home = homePage.Page
const WorkPage = workPage.Page
const WritingIndex = writingPage.Page
const TopicPage = topicPage.Page
const ArticlePage = articlePage.Page
const ProjectPage = projectPage.Page
const ResumePage = resumePage.Page
const CaseStudyPage = caseStudyPage.Page
const AboutPage = aboutPage.Page
const Contact = contactPage.Page
const articles = (catalog as ArticleSummary[]).map(withWritingCopy)
const navItems = [['About', 'about'], ['Writing', 'writing'], ['Work', 'work'], ['Résumé', 'resume'], ['Contact', 'contact']]
const path = () => resolveRoute(location.hash, location.pathname, articles)

function useRoute() {
  const [route, setRoute] = useState(path)
  const [pending, setPending] = useState(false)
  const current = useRef(route)
  useEffect(() => {
    let sequence = 0
    let active: ArtworkTransition | undefined
    const scroll = installRouteScroll()
    const change = async () => {
      const next = path()
      const ticket = ++sequence
      const arrival = scroll.begin()
      active?.skipTransition()
      if (next === current.current) {
        scroll.samePage(arrival)
        setPending(false)
        document.documentElement.dataset.artTransition = 'idle'
        return
      }
      setPending(true)
      const prepared = prepareRouteResources(next, prepareRoutePage, slug => prepareArticleArrival(slug, location.hash, location.pathname))
      const journey = galleryArticleJourney(current.current, next)
      const canAnimate = journey && !matchMedia('(prefers-reduced-motion: reduce)').matches
      const update = async () => {
        if (ticket !== sequence || path() !== next) return
        current.current = next
        flushSync(() => { setRoute(next); setPending(false) })
        await scroll.commit(arrival, () => {
          if (next.startsWith('writing/')) {
            const section = articleSection(location.hash, location.pathname)
            if (section) jumpToArticleSection(section, 'instant')
            return
          }
          if (next !== 'writing' && !next.startsWith('topics/')) return
          const selected = new URLSearchParams(location.hash.split('?')[1] || '').get('at')
          const selector = next === 'writing' ? '.writing-story' : '.topic-readings h2 a'
          const link = [...document.querySelectorAll<HTMLAnchorElement>(selector)]
            .find(item => item.dataset.slug === selected)
          // Position the destination before the browser captures its new artwork box.
          link?.scrollIntoView({ block: 'center', behavior: 'instant' })
        })
      }
      if (!canAnimate) {
        document.documentElement.dataset.artTransition = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'idle'
        await prepared
        await update()
        return
      }
      document.documentElement.dataset.artTransition = 'running'
      document.documentElement.dataset.artTransitionCount = String(Number(document.documentElement.dataset.artTransitionCount || 0) + 1)
      const articleRoute = next.startsWith('writing/') ? next : current.current
      const article = articles.find(item => `writing/${item.slug}` === articleRoute)
      const name = article ? artworkTransitionName(getArticleGenerativeArtwork(article.path)) : ''
      active = startArtworkTransition(name, async () => {
        // Keep the source's live canvas mounted until both page and article are ready.
        await prepared
        await update()
      })
      void active.ready.catch(() => { /* Failed preparation must not break navigation. */ })
      void active.finished.catch(() => {}).finally(() => {
        if (ticket === sequence) document.documentElement.dataset.artTransition = 'idle'
      })
    }
    window.addEventListener('hashchange', change)
    return () => { sequence++; active?.skipTransition(); scroll.dispose(); window.removeEventListener('hashchange', change) }
  }, [])
  useEffect(() => {
    // Initial deep links prepare article data while its page chunk is loading.
    if (route.startsWith('writing/')) void prepareArticleArrival(route.slice('writing/'.length), location.hash, location.pathname).catch(() => {})
    updateSearchHead(document, route)
    recordPersonalPageView(document, window)
  }, [route])
  return { route, pending }
}

function useAppearance() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('sulayman-appearance') === 'dark' } catch { return false }
  })
  useEffect(() => {
    try { localStorage.setItem('sulayman-appearance', dark ? 'dark' : 'light') } catch { /* Optional preference. */ }
  }, [dark])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'sulayman-appearance') setDark(event.newValue === 'dark')
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  return { dark, setDark }
}

export default function PersonalSite() {
  return <ArtworkMotionProvider><ProjectTransitionProvider><SitePages /></ProjectTransitionProvider></ArtworkMotionProvider>
}

function SitePages() {
  const { route, pending } = useRoute()
  const { dark, setDark } = useAppearance()
  const [menuOpen, setMenuOpen] = useState(false)
  const [landingActive, setLandingActive] = useState(true)
  const menuButton = useRef<HTMLButtonElement>(null)
  const main = useRef<HTMLElement>(null)
  const focusedRoute = useRef(route)
  const project = projects.find(p => route === `work/${p.slug}`)
  const article = articles.find(item => route === `writing/${item.slug}`)
  const topic = route.startsWith('topics/') ? findReadingTopic(route.slice('topics/'.length)) : undefined
  const study = findCaseStudy(route)
  const isDark = dark
  const section = project || study ? 'work' : article || topic ? 'writing' : route || 'home'
  useLayoutEffect(() => {
    if (main.current && (article || project || study)) return installTableOverflowHints(main.current)
  }, [route, article, project, study])
  useEffect(() => { setMenuOpen(false) }, [route])
  useEffect(() => {
    if (focusedRoute.current === route) return
    focusedRoute.current = route
    main.current?.focus({ preventScroll: true })
  }, [route])
  useEffect(() => {
    if (!menuOpen) return
    const header = menuButton.current?.closest('header')
    if (!header) return
    const frame = requestAnimationFrame(() => focusWithoutWarmup(document.querySelector<HTMLAnchorElement>('#main-navigation a')))
    const dispose = installMenuDismissal(header, restoreFocus => {
      setMenuOpen(false)
      if (restoreFocus) menuButton.current?.focus({ preventScroll: true })
    })
    return () => { cancelAnimationFrame(frame); dispose() }
  }, [menuOpen])
  useLayoutEffect(() => {
    document.documentElement.dataset.appearance = isDark ? 'dark' : 'light'
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#111210' : '#f5f2ea')
  }, [isDark])
  const art = new URLSearchParams(location.search).get('art') as ArtKind | null
  if (import.meta.env.DEV && art && ['helmet', 'crystal', 'ribbon', 'globe', 'cross'].includes(art)) {
    return <div className="art-export" data-appearance={dark ? 'dark' : 'light'}><Art kind={art} dark={dark} /><button className="export-theme" onClick={() => setDark(!dark)}>Change backdrop</button></div>
  }
  const isHome = route === '' || route === 'home'
  const compactNav = isHome && landingActive
  return <div className={`personal-site ${project ? 'project-site' : ''} ${isHome ? 'home-site' : ''}`} data-appearance={isDark ? 'dark' : 'light'} data-section={section} data-landing-active={isHome ? String(landingActive) : undefined}>
    {isHome && <div className="page-wash" aria-hidden="true" />}
    <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus() }}>Skip to content</a>
    <header className="personal-header" data-nav-compact={compactNav}>
      <a href="#/" className="identity" aria-label="Sulayman Bowles — home" onClick={event => { if (!isHome || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); main.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}><BrandIdentity /></a>
      <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? 'is-open' : ''}>{navItems.map(([item, slug]) => {
        const extra = slug !== 'about' && slug !== 'writing'
        const collapsed = compactNav && !menuOpen && extra
        return <span key={slug} className={`nav-slot${extra ? ' nav-extra' : ''}`} inert={collapsed}><a href={`#/${slug}`} tabIndex={collapsed ? -1 : undefined} aria-current={section === slug ? 'page' : undefined} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; setMenuOpen(false); if (menuOpen && route === slug) requestAnimationFrame(() => menuButton.current?.focus({ preventScroll: true })) }}>{item}</a></span>
      })}</nav>
      <div className="header-end"><button className="appearance-toggle" aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} onClick={() => setDark(!dark)}><span aria-hidden="true">◐</span></button><button ref={menuButton} className="nav-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button></div>
    </header>
    {pending && <p className="route-opening mono" role="status">Opening the page…</p>}
    <main ref={main} id="main-content" tabIndex={-1} key={route} aria-busy={pending || undefined}>
      <RouteBoundary homeRoute={isHome} onError={() => setLandingActive(false)}><Suspense fallback={<p className="reader-loading mono" role="status">Opening the page…</p>}>{project ? <ProjectPage project={project} dark={isDark} /> : study ? <CaseStudyPage study={study} dark={isDark} /> : article ? <ArticlePage slug={article.slug} /> : topic ? <TopicPage slug={topic.slug} /> : route === 'writing' ? <WritingIndex /> : route === 'resume' ? <ResumePage dark={isDark} /> : route === 'work' ? <WorkPage dark={isDark} /> : route === 'about' ? <AboutPage dark={isDark} /> : route === 'contact' ? <Contact dark={isDark} /> : route === '' || route === 'home' ? <Home dark={isDark} onLandingActiveChange={setLandingActive} /> : <NotFound />}</Suspense></RouteBoundary>
    </main>
    {route !== 'about' && route !== 'resume' && <Footer route={route} closing={!article && route !== 'contact' && route !== 'resume'} />}
  </div>
}

function Crosshair({ className = '' }: { className?: string }) { return <span className={`crosshair ${className}`} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 1v7m0 8v7M1 12h7m8 0h7" /><circle cx="12" cy="12" r="4" /></svg></span> }
function SectionLabel({ children, end }: { children: React.ReactNode; end?: React.ReactNode }) {
  return <div className="section-label"><span>/ {children}</span><i />{end && <span>{end}</span>}</div>
}


function NotFound() { return <section className="not-found"><span className="eyebrow">{siteCopy.notFound.kicker}</span><h1>{siteCopy.notFound.headline[0]}<br />{siteCopy.notFound.headline[1]}</h1><DestinationLink className="arrow-link" href="#/">{siteCopy.notFound.action}</DestinationLink></section> }

function Footer({ closing, route }: { closing: boolean; route: string }) {
  return <footer className="personal-footer">{closing && <div className="site-closing"><div className="site-closing-main"><h2>{siteCopy.footer.title}</h2><div className="site-closing-contact"><p>{siteCopy.footer.description}</p><DestinationLink className="closing-email" href={`mailto:${contact.email}`} direction="external" emphasis="contact">{contact.email}</DestinationLink><DestinationLink className="arrow-link" href={contact.linkedin}>LinkedIn</DestinationLink></div></div></div>}<div className="footer-baseline"><span className="mono">Sulayman Bowles</span><details className="colophon"><summary className="mono">Colophon <span aria-hidden="true">+</span></summary><div><h2>Colophon</h2><p>{siteCopy.footer.colophon}</p><p><a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54" target="_blank" rel="noreferrer">Jousting Helmet</a> by The Royal Armoury, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Dithering based on <a href="https://github.com/niccolofanton/dithering-shader" target="_blank" rel="noreferrer">Niccolò Fanton’s study</a> and <a href="https://www.shadertoy.com/view/ltSSzW" target="_blank" rel="noreferrer">Klems’ Bayer pattern</a>.</p><a className="mono" href={`${import.meta.env.BASE_URL}shader.html`}>Explore the original study ↗</a></div></details><a className="footer-top mono" href={`#/${route}`} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); const query = new URLSearchParams(location.hash.split('?')[1] || ''); query.delete('chapter'); query.delete('section'); history.replaceState(history.state, '', `#/${route}${query.size ? `?${query}` : ''}`); document.getElementById('main-content')?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>{siteCopy.footer.top} <span aria-hidden="true">↑</span></a></div></footer>
}
