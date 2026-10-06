import { workLinkHref, type WorkChapter, type WorkLink } from './work-document'
import './work-materials.css'

export function WorkSources({ links, base = '/' }: { links: WorkLink[]; base?: string }) {
  return (
    <div className="work-sources">
      {links.map((link) => (
        <a
          key={link.href}
          href={workLinkHref(link.href, base)}
          {...(link.download ? { download: true } : link.href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>
          <div>
            <h3>{link.label}</h3>
            <p>{link.description}</p>
          </div>
          <span aria-hidden="true">{link.download ? '↓' : link.href.startsWith('https:') ? '↗' : '→'}</span>
        </a>
      ))}
    </div>
  )
}

/** Shared by the interactive pages and their readable static editions. */
export function WorkMaterials({ chapter, base = '/' }: { chapter: WorkChapter; base?: string }) {
  return (
    <>
      {chapter.table && (
        <div className="work-table-wrap" role="region" aria-label={chapter.table.caption} tabIndex={0}>
          <table className="work-table">
            <caption>{chapter.table.caption}</caption>
            <thead>
              <tr>
                {chapter.table.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chapter.table.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, column) =>
                    column === 0 ? (
                      <th key={column} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={column}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {chapter.table.note && <p className="work-material-note">{chapter.table.note}</p>}
        </div>
      )}
      {chapter.links && <WorkSources links={chapter.links} base={base} />}
      {chapter.note && <p className="work-material-note">{chapter.note}</p>}
    </>
  )
}
