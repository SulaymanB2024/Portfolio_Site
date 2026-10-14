import { useRef, type MouseEvent, type ReactNode } from 'react'
import { ProjectArtwork } from './ProjectArtwork'
import { ProjectEndNavigation } from './ProjectEndNavigation'
import { closePrintUrl } from '../refinements/print-instrument'
import { useProjectReading } from './useProjectReading'
import { projectChapterHref } from './project-reading-position'
import { ProjectAccount, ProjectSources } from './ProjectAccount'
import type { WorkDocument } from './work-document'
import './project-detail.css'
import '../refinements/print-room-studio.css'

export default function ProjectDetailPage({ slug, title, document: account, dark, caseStudy = false }: {
  slug: string; title: ReactNode; document: WorkDocument; dark: boolean;
  caseStudy?: boolean;
}) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useProjectReading(root, slug, '.project-account-section', account.chapters[0].id)
  const sectionId = (id: string) => caseStudy ? id : `${slug}-${id}`
  function chapterHref(id: string) {
    if (typeof window === 'undefined') return `#/work/${slug}?chapter=${id}`
    const address = new URL(closePrintUrl(location.href))
    return projectChapterHref(address.hash, address.pathname, address.search, slug, id)
  }
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = document.getElementById(sectionId(id))
    section?.scrollIntoView({ behavior: 'instant', block: 'start' })
    section?.focus({ preventScroll: true })
    setActive(id)
    history.replaceState(history.state, '', chapterHref(id))
  }
  return <article ref={root} className={`project-page project-detail project-detail-${slug}`}>
    <header className="project-detail-opening">
      <div className="project-detail-intro"><h1 id={`${slug}-artwork-title`}>{title}<span className="period">.</span></h1><p>{account.summary}</p></div>
      <ProjectArtwork key={slug} slug={slug} dark={dark} />
    </header>
    <nav className="project-reading-bar project-detail-index" aria-label="In this project">
      <div className="project-index-track">{account.chapters.map(chapter => <a key={chapter.id} data-project-chapter={chapter.id} href={chapterHref(chapter.id)} aria-current={active === chapter.id ? 'location' : undefined} onClick={event => jump(event, chapter.id)}>{chapter.label}</a>)}</div>
    </nav>
    <ProjectAccount document={account} sectionId={sectionId} base={import.meta.env.BASE_URL} />
    {(account.links.length > 0 || slug === 'miscellaneous') && <div className="project-detail-further">
      <ProjectSources links={account.links} base={import.meta.env.BASE_URL} />
      {slug === 'miscellaneous' && <button type="button" className="project-print-link" data-open-print-room>Make an original print<span aria-hidden="true">↗</span></button>}
    </div>}
    <ProjectEndNavigation slug={slug} />
  </article>
}
