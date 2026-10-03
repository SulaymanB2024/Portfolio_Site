import { useState } from 'react'
import { atlasSample, describeAtlasRow } from './atlas-evidence'

export default function AtlasEvidence() {
  const [selected, setSelected] = useState(0)
  const row = describeAtlasRow(selected)
  return <div className="atlas-evidence">
    <div className="atlas-evidence-top"><span className="mono">Retained sample / Quotes to Scrape</span><span className="mono">16 JUL 2026</span></div>
    <div className="atlas-page-selector" role="group" aria-label="Choose a captured sample page">
      {atlasSample.rows.map((page,index)=><button type="button" key={page.url} aria-pressed={selected===index} onClick={()=>setSelected(index)}><span className="mono">0{index+1}</span>{index===0 ? 'Static page' : 'JavaScript page'}<span className="mono">{new URL(page.url).pathname}</span></button>)}
    </div>
    <div className="atlas-observation">
      <div className="atlas-source-count"><span className="eyebrow">Quote cards in source HTML</span><strong>{row.source_quote_card_count.toString().padStart(2,'0')}</strong><div className="atlas-card-marks" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} data-present={i<row.source_quote_card_count} />)}</div></div>
      <dl className="atlas-fields"><div><dt>Response</dt><dd>{row.status_code} OK</dd></div><div><dt>Embedded data records</dt><dd>{row.runtimeRecords ?? 'Not recorded'}</dd></div><div><dt>Canonical tag</dt><dd>{row.canonical}</dd></div><div><dt>Next page discovered</dt><dd>{new URL(row.discovered_next_url).pathname}</dd></div></dl>
    </div>
    <div className="atlas-interpretation" aria-live="polite" aria-atomic="true"><h3>{selected===0 ? 'The content is in the response.' : 'The response is only the beginning.'}</h3><p>{row.explanation}</p><p className="atlas-next-step"><span className="mono">Next step</span>{row.nextStep}</p></div>
    <p className="atlas-sample-note">A saved source capture, not a live crawl or a rendered-page measurement. This sample makes no search-performance claim. <a href={`${import.meta.env.BASE_URL}research/atlas-open-corpus-run-2026-07-16.json`} download>Inspect JSON ↓</a><a href={`${import.meta.env.BASE_URL}research/atlas-open-corpus-run-2026-07-16.csv`} download>Download CSV ↓</a></p>
  </div>
}
