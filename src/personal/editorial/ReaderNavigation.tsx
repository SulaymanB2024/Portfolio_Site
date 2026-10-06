import type { MouseEvent } from 'react'
import { sectionHref } from './library'

function closeAfterSelection(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const disclosure = event.currentTarget.closest('details')
  if (disclosure) disclosure.open = false
}

export default function ReaderNavigation({ sections, href }: {
  sections: { id: string; title: string }[]; href: string
}) {
  if (!sections.length) return null
  return <aside className="reader-navigation">
    <details className="reader-index">
      <summary>Contents <span aria-hidden="true">+</span></summary>
      <nav aria-label="Article sections"><ol>{sections.map(section => <li key={section.id}>
        <a href={sectionHref(href, section.id)} onClick={closeAfterSelection}>{section.title.replace(/^(?:[IVXLCDM]+|\d+)[.)]\s+/, '')}</a>
      </li>)}</ol></nav>
    </details>
  </aside>
}
