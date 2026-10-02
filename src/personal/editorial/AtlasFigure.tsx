import capture from '../../../public/research/atlas-open-corpus-run-2026-07-16.json'
import './evidence-figures.css'

const manifestHref = `${import.meta.env.BASE_URL}research/atlas-open-corpus-run-2026-07-16.json`

export default function AtlasFigure() {
  return <figure className="atlas-evidence-figure atlas-capture-figure" aria-labelledby="atlas-evidence-caption">
    <div className="atlas-evidence-heading"><span>Retained source capture</span><time dateTime={capture.captured_at}>July 16, 2026</time></div>
    <div className="atlas-capture-pages">
      {capture.rows.map((row, index) => <div className="atlas-capture-page" key={row.url}>
        <div className="atlas-capture-page-heading"><h3>{index === 0 ? 'Ordinary page' : 'JavaScript page'}</h3><span>HTTP {row.status_code}</span></div>
        <a className="atlas-capture-url" href={row.url} target="_blank" rel="noreferrer">{row.url.replace('https://', '')}<span aria-hidden="true"> ↗</span></a>
        <dl>
          <div className="atlas-capture-primary"><dt>Quote-card elements in source HTML</dt><dd>{row.source_quote_card_count}</dd></div>
          <div><dt>Runtime data records</dt><dd className={row.runtime_data_record_count == null ? 'atlas-capture-unknown' : undefined}>{row.runtime_data_record_count ?? 'Not counted in this capture'}</dd></div>
          <div><dt>Browser-rendered quote cards</dt><dd className="atlas-capture-unknown">Not measured</dd></div>
        </dl>
      </div>)}
    </div>
    <details className="atlas-render-fixture">
      <summary>Inspect the rendered-state test</summary>
      <p>The repository uses a separate fixture to test how a raw observation becomes a finding. These are test inputs, not a browser capture of the pages above.</p>
      <dl>
        <div><dt>Raw HTML</dt><dd><strong>0</strong> H1 headings<span>Raw-only missing-H1 observation retained.</span></dd></div>
        <div><dt>Effective rendered state</dt><dd><strong>1</strong> H1 heading<span>Missing-H1 finding is not raised against the effective page.</span></dd></div>
      </dl>
      <a href="#source-render">Render-pipeline fixture and provenance tests ↗</a>
    </details>
    <figcaption id="atlas-evidence-caption">Source capture, July 16, 2026. These are retained observations; this figure does not report browser-rendered quote counts. The demonstration does not establish indexing or search performance. <a href={manifestHref}>Retained capture manifest ↗</a></figcaption>
  </figure>
}
