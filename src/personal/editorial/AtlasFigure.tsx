const stages = [
  ['Capture', 'The URL, response and collection conditions.'],
  ['Interpret', 'The captured state and the rule applied to it.'],
  ['Review', 'The finding, its evidence and what remains uncertain.'],
  ['Export', 'The explanation and the path back to the observation.'],
]

export default function AtlasFigure() {
  return <figure className="atlas-evidence-figure" aria-labelledby="atlas-evidence-caption">
    <div className="atlas-evidence-heading"><span>A finding’s path through Atlas</span><span aria-hidden="true">→</span></div>
    <ol>{stages.map(([title, detail]) => <li key={title}><strong>{title}</strong><p>{detail}</p></li>)}</ol>
    <figcaption id="atlas-evidence-caption">Provenance belongs in the workflow: a recommendation should lead back to the captured state and the rule behind it. <a href="#source-scope">Repository scope ↗</a></figcaption>
  </figure>
}
