import type { ArticleSection, WritingArticle } from './types'
import { inlineText } from './Markdown'

const studies: Record<string, [string, string]> = {
  'jane-street-exact-search-solver-verification': ['arithmetic-before-geometry', 'search'],
  'software-buyout-boom-2020-2022-exit-audit': ['deal-by-deal-control-inventory', 'cohort'],
  'who-owns-austin-home-service-companies': ['ownership-map', 'ownership'],
  'crawl-frontier-state-machine': ['frontier-states', 'frontier'],
  'raw-html-rendered-dom-evidence': ['semantic-diff', 'render'],
  'canonicalization-graph-consistency': ['typed-url-graph', 'relations'],
  'internal-links-directed-retrieval-graph': ['reachability', 'paths'],
  'robots-txt-courtesy-not-access-control': ['six-control-layers', 'controls'],
  'audit-findings-derived-records': ['six-record-layers', 'lineage'],
  'structured-data-without-content-drift': ['domain-record', 'projection'],
  'replayable-traces-ai-agent-evaluation': ['task-trial-trace', 'trial'],
  'sqlite-crawl-pipelines': ['transaction-boundary', 'transaction'],
  'technical-seo-migration-release-gates': ['redirect-graph', 'redirects'],
  'ai-search-crawler-policy': ['outcome-matrix', 'policy'],
  'technical-seo-public-data-infrastructure': ['public-record-pipeline', 'pipeline'],
  'canonical-identity-personal-seo': ['external-reconciliation', 'identity'],
}

function CohortMark({ category }: { category: number }) {
  // Foreground shapes survive printing when background graphics are disabled.
  return <svg className="study-cohort-mark" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    {category < 2 ? <circle cx="10" cy="10" r="8.5" fill={category === 0 ? 'currentColor' : 'none'} stroke="currentColor" />
      : <rect x="1.5" y="1.5" width="17" height="17" fill="none" stroke="currentColor" />}
  </svg>
}

function recordingPeriods(rows: string[][]) {
  const periods: { start: number; end: number; interval: number }[] = []
  for (let index = 1; index < rows.length; index++) {
    const start = Number(rows[index - 1][0]), end = Number(rows[index][0]), interval = end - start
    const previous = periods.at(-1)
    if (previous?.interval === interval) previous.end = end
    else periods.push({ start, end, interval })
  }
  return periods
}

function ScheduleRuler({ rows, periods, start, end, finish, compact = false }: {
  rows: string[][]; periods: ReturnType<typeof recordingPeriods>; start: number; end: number; finish: number; compact?: boolean
}) {
  const width = compact ? 320 : 740
  const left = 20, right = width - 28
  const position = (move: number) => left + (move - start) / (end - start) * (right - left)
  return <svg viewBox={`0 0 ${width} 142`} style={{ display: 'block', width: '100%', height: 'auto', fill: 'currentColor' }} aria-hidden="true">
    {periods.filter(period => period.start >= start && period.end <= end).map(period => <g key={period.start} className="study-schedule-period">
      <text x={(position(period.start) + position(period.end)) / 2} y="16" textAnchor="middle">Every {period.interval} moves</text>
      <path d={`M${position(period.start)} 35V29H${position(period.end)}V35`} className="study-rule" />
    </g>)}
    <path d={`M${left} 68H${right}`} className="study-rule" />
    {rows.filter(row => Number(row[0]) >= start && Number(row[0]) <= end).map(row => {
      const x = position(Number(row[0]))
      return <g key={row[0]} data-move={row[0]}>
        <circle cx={x} cy="68" r={compact ? 2 : 3} />
        <text x={x} y="54" textAnchor="middle">{row[0]}</text>
      </g>
    })}
    <text x={left} y="100" className="study-axis-label">Move</text>
    {end === finish && <g className="study-schedule-finish" data-finish={finish}>
      <path d={`M${right} 63l5 5-5 5-5-5Z`} />
      <path d={`M${right} 76V102`} className="study-rule" />
      <text x={right} y="126" textAnchor="end">{finish} · Last tower</text>
    </g>}
  </svg>
}

// Each study is placed beside the explanation that supplies its evidence. Values
// and labels drawn from tables are read from the manuscript rather than copied.
export function articleStudyKind(slug: string, sectionId: string) {
  if (slug === 'jane-street-exact-search-solver-verification' && sectionId === 'result') return 'schedule'
  const study = studies[slug]
  return study?.[0] === sectionId ? study[1] : undefined
}

export default function ArticleStudyFigure({ article, section }: { article: WritingArticle; section: ArticleSection }) {
  const kind = articleStudyKind(article.slug, section.id)
  if (!kind) return null
  const rows = section.table?.rows || []
  let diagram, caption: string
  switch (kind) {
    case 'paths':
      diagram = <div className="study-paths"><div className="study-paths-entry"><small>Approved entry</small><strong>Entry point</strong></div><div className="study-paths-parents"><div><strong>One parent</strong><span>→</span></div><div><strong>Another parent</strong><span>→</span></div></div><div className="study-paths-target"><small>Canonical destination</small><strong>Target page</strong></div></div>
      caption = 'A two-hop route through one parent can be fragile. An independent parent supplies another path; this schematic describes resilience, not ranking weight or a measured site graph.'
      break
    case 'controls':
      diagram = <ol className="study-controls">{rows.map((row, index) => <li key={row[0]}><span className="study-index">{String(index + 1).padStart(2, '0')}</span><div><small>{row[0]}</small><strong>{row[1]}</strong></div><p>{row[3]}</p></li>)}</ol>
      caption = 'Crawler preference, index processing, private access, and origin capacity act at different boundaries. Each desired outcome belongs with the control that can enforce it.'
      break
    case 'trial':
      diagram = <div className="study-trial"><div className="study-trial-inputs"><div><strong>{rows[0][0]}</strong><small>{rows[0][1]}</small></div><div><strong>{rows[1][0]}</strong><small>{rows[1][1]}</small></div></div><div className="study-trial-attempt"><strong>{rows[2][0]}</strong><small>{rows[2][2]}</small></div><div className="study-trial-outputs"><div><strong>{rows[3][0]}</strong><small>{rows[3][2]}</small></div><div><strong>{rows[4][0]}</strong><small>{rows[4][2]}</small></div></div></div>
      caption = 'Each attempt links a task and configuration to separate, versioned traces and grades.'
      break
    case 'redirects':
      diagram = <div className="study-redirects"><div className="study-redirect-origins"><strong>Old route <span aria-hidden="true">→</span></strong><strong>Historical alias <span aria-hidden="true">→</span></strong></div><div className="study-redirect-target"><small>One permanent hop</small><strong>Approved canonical</strong><p>Eligible response · equivalent user purpose</p></div><div className="study-redirect-removal"><span>Without an equivalent</span><code>404 / 410</code><small>Removal, rather than an irrelevant redirect.</small></div></div>
      caption = 'Point historical aliases directly to the approved destination.'
      break
    case 'policy':
      diagram = <div className="study-policy">{rows.map(row => <div key={row[0]}><strong>{row[0]}</strong><small>{row[1]}</small><code>{row[2]}</code></div>)}</div>
      caption = 'Verified July 14, 2026. User-requested fetching varies by provider; private content requires enforceable authorization.'
      break
    case 'pipeline':
      diagram = <ol className="study-pipeline">{rows.map((row, index) => <li key={row[0]}><span className="study-index">{String(index + 1).padStart(2, '0')}</span><strong>{row[0]}</strong><small>{row[1]}</small></li>)}</ol>
      caption = 'Retain each transformation so findings trace back to their captures.'
      break
    case 'identity':
      diagram = <ol className="study-identity">{rows.map(row => <li key={row[0]}><span className="study-index">{row[0]}</span><div><strong>{row[1]}</strong><small>{row[3]}</small></div></li>)}</ol>
      caption = 'Edit owned records, request corrections elsewhere, and preserve accurate history.'
      break
    case 'schedule': {
      const finish = Number.parseInt(article.metrics?.find(metric => metric.label === 'Path')?.value || '', 10)
      const periods = recordingPeriods(rows), split = periods[0]?.end
      if (!Number.isFinite(finish) || !periods.length || finish <= Number(rows.at(-1)?.[0])) return null
      diagram = <><div className="study-schedule-wide"><ScheduleRuler rows={rows} periods={periods} start={0} end={finish} finish={finish} /></div>
        <div className="study-schedule-narrow"><ScheduleRuler rows={rows} periods={periods} start={0} end={split} finish={finish} compact /><ScheduleRuler rows={rows} periods={periods} start={split} end={finish} finish={finish} compact /></div>
        <ol className="sr-only">{rows.map(row => <li key={row[0]}>Move {row[0]}: recorded score {row[1]}</li>)}<li>Move {finish}: last tower, after the final recorded clue. The neighbor-sum answer is a separate calculation.</li></ol></>
      const gap = finish - Number(rows.at(-1)?.[0])
      caption = `The final tower comes ${gap === 1 ? 'one move' : `${gap} moves`} after the last recorded clue. Scores are listed below.`
      break
    }
    case 'search': {
      const labels = ['Schedules', 'Score states', 'Segments', 'One route']
      const checks = ['Timing bounds', 'Published scores', 'Legal knight paths', 'Global consistency']
      diagram = <div className="study-search">{['Arithmetic', 'Geometry'].map((group, groupIndex) => <div className="study-search-group" key={group}>
        <span className="study-search-label">{group}</span>
        <ol start={groupIndex * 2 + 1}>{rows.slice(groupIndex * 2, groupIndex * 2 + 2).map((row, index) => {
          const stage = groupIndex * 2 + index
          return <li key={row[0]} aria-label={row[0]}><span className="study-index">{String(stage + 1).padStart(2, '0')}</span><strong>{labels[stage]}</strong><small>{checks[stage]}</small></li>
        })}</ol>
      </div>)}</div>
      caption = 'Filter timing and scores first. Search board geometry only for surviving schedules.'
      break
    }
    case 'cohort': {
      const categories = [...new Set(rows.map(row => row[4]))]
      diagram = <div className="study-cohort"><div className="study-cohort-grid">{rows.map(row => <div key={row[0]} className={`study-cohort-member study-category-${categories.indexOf(row[4])}`} title={`${row[0]} — ${row[4]}`}><CohortMark category={categories.indexOf(row[4])} /><span className="study-company">{row[0]}</span></div>)}</div><ul className="study-cohort-key">{categories.map((category, index) => <li key={category} className={`study-category-${index}`}><CohortMark category={index} /><strong>{rows.filter(row => row[4] === category).length}</strong>{category}</li>)}</ul></div>
      caption = 'One mark per cohort record at August 17, 2026. Ownership events do not measure sponsor returns.'
      break
    }
    case 'ownership': {
      const selected = rows.filter(row => row[1] === 'Southern Home Services')
      if (!selected.length) return null
      diagram = <div className="study-ownership"><ul>{selected.map(row => <li key={row[0]}>{row[0]}</li>)}</ul><div className="study-ownership-platform"><small>Operating platform</small><strong>{selected[0][1]}</strong></div><div className="study-ownership-owner"><small>Controller / investor</small><strong>{selected[0][2]}</strong></div></div>
      caption = 'Three Austin-facing brands share one platform. Brand counts do not measure market share.'
      break
    }
    case 'frontier':
      diagram = <div className="study-frontier"><ol>{rows.slice(0, 4).map((row, index) => <li key={row[0]}><code>{row[0]}</code><small>{row[1]}</small>{index === 3 && <code>{row[2]}</code>}</li>)}</ol><div className="study-frontier-branches">{rows.slice(4).map(row => <div key={row[2]}><small>{row[0]} · {row[1]}</small><code>{row[2]}</code><p>{row[3]}</p></div>)}</div></div>
      caption = 'Fetch outcomes and policy branches retain their events and evidence.'
      break
    case 'render':
      diagram = <div className="study-render"><div><small>Source observation</small><strong>Server response</strong><p>Status, headers, body, redirects</p></div><div className="study-render-middle"><span aria-hidden="true">→</span><strong>Browser conditions</strong><p>Scripts · network · state · stop condition</p><span aria-hidden="true">→</span></div><div><small>Rendered observation</small><strong>DOM capture</strong><p>Fields, links, content, completeness</p></div><div className="study-render-diff"><strong>Field-level comparison</strong><span>Retain both observations and explain the conditions between them.</span></div></div>
      caption = 'A difference is an observation. The capture conditions determine which explanation it can support.'
      break
    case 'relations': {
      const destinations = ['Resolved URL', 'Preferred URL', 'Sitemap artifact', 'Linked URL', 'Equivalent-content hypothesis']
      diagram = <div className="study-relations"><div className="study-relations-source"><strong>Observed URL</strong><small>One node per run</small></div><ul>{rows.map((row, index) => <li key={row[0]} className={row[0] === 'duplicates' ? 'study-hypothesis' : undefined}><span className="study-edge"><code>{row[0]}</code><span aria-hidden="true">→</span></span><div><strong>{destinations[index]}</strong><small>{row[1]}</small></div></li>)}</ul></div>
      caption = 'Relationships have different sources and meanings. A duplicate hypothesis must remain distinguishable from a publisher instruction.'
      break
    }
    case 'lineage':
      diagram = <ol className="study-lineage">{rows.map((row, index) => <li key={row[0]}><span className="study-index">{String(index + 1).padStart(2, '0')}</span><strong>{row[0]}</strong><span>{row[2]}</span></li>)}</ol>
      caption = 'A finding is downstream of captured evidence and versioned interpretation. Review and recommendation add records rather than replacing the capture.'
      break
    case 'projection':
      diagram = <div className="study-projection"><div className="study-projection-record"><strong>Validated content record</strong><small>One set of facts and stable identities</small></div><div className="study-projection-outputs"><div><strong>Visible page</strong><ul>{rows.map(row => <li key={row[0]}><code>{row[0]}</code><span>{row[1]}</span></li>)}</ul></div><div><strong>Machine-readable page</strong><ul>{rows.map(row => <li key={row[0]}><code>{row[0]}</code><span>{row[2]}</span></li>)}</ul></div></div></div>
      caption = 'Both public projections come from the same record. Validate their meaning together after the build.'
      break
    default:
      diagram = <div className="study-transaction"><div className="study-transaction-outside"><span>Before the transaction</span><strong>Persist the artifact</strong><small>Network and filesystem work stays outside the writer lock.</small></div><div className="study-transaction-inside"><span>One durable result</span><strong>BEGIN → COMMIT</strong><ul>{['Attempt state', 'Response metadata', 'Artifact references', 'Observations', 'Edges', 'Frontier transitions'].map(label => <li key={label}>{label}</li>)}</ul></div><div className="study-transaction-outside"><span>After an interruption</span><strong>Redeliver safely</strong><small>Uniqueness prevents duplicate logical records.</small></div></div>
      caption = 'Persist the artifact before committing its immutable reference and result. Storage or commit failures remain recoverable.'
  }
  return <figure id={`study-${section.id}`} className={`article-study article-study-${kind}`} aria-label={section.table?.caption || section.title}>
    {diagram}<figcaption>{inlineText(caption)}</figcaption>
  </figure>
}
