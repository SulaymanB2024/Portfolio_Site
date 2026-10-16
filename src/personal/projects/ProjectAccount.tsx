import { WorkMaterials } from './WorkMaterials'
import { workLinkHref, type WorkDocument, type WorkLink } from './work-document'

export function ProjectSources({ links, base = '/' }: { links: WorkLink[]; base?: string }) {
  if (!links.length) return null
  return <ul className="project-source-list">{links.map(link => <li key={link.href}>
    <a href={workLinkHref(link.href, base)} {...(link.download ? { download: true } : link.href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {link.label}<span aria-hidden="true">{link.download ? '↓' : link.href.startsWith('https:') ? '↗' : '→'}</span>
    </a>
  </li>)}</ul>
}

/** Shared by the mounted project pages and their readable static editions. */
export function ProjectAccount({ document, sectionId, base = '/' }: {
  document: WorkDocument; sectionId: (id: string) => string; base?: string;
}) {
  return <div className="project-account">{document.chapters.map(chapter => <section
    className="project-account-section" id={sectionId(chapter.id)} data-story-chapter={chapter.id}
    key={chapter.id} tabIndex={-1} aria-labelledby={`${sectionId(chapter.id)}-title`}>
    <h2 id={`${sectionId(chapter.id)}-title`}>{chapter.title}</h2>
    {chapter.body.map(text => <p key={text}>{text}</p>)}
    <WorkMaterials chapter={{ ...chapter, links: undefined, note: undefined }} />
    {chapter.note && <p className="project-source-note">{chapter.note}</p>}
    <ProjectSources links={chapter.links ?? []} base={base} />
  </section>)}</div>
}
