import { useId, useMemo, useState } from 'react'
import './project-diagrams.css'

const cx = (...names: (string | false)[]) => names.filter(Boolean).join(' ')

function Choices({ label, items, value, onChange }: { label: string; items: string[]; value: number; onChange(value: number): void }) {
  return <div className="project-diagram-choices" role="group" aria-label={label}>{items.map((item, index) =>
    <button type="button" key={item} aria-pressed={value === index} onClick={() => onChange(index)}>{item}</button>
  )}</div>
}

function Arrow({ id }: { id: string }) {
  return <defs><marker id={id} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M2 2 10 6 2 10" fill="none" stroke="currentColor" strokeWidth="1.4" /></marker></defs>
}

function PipelineDiagram() {
  const [step, setStep] = useState(0)
  const [hasDate, setHasDate] = useState(false)
  const arrow = `pipeline-${useId().replace(/:/g, '')}`
  const details = [
    ['Keep the original in view.', 'An employer posting is the reference point. Preserve its link, role requirements, and any date it actually supplies.'],
    ['A useful record keeps its gaps.', 'Organize the source into a consistent record. A missing deadline stays missing; it is not silently turned into an estimated date.'],
    ['Turn discovery into a next step.', 'A shortlist is a decision aid: compare fit, revisit the source, and prepare an application. The employer remains the authority on the opening.'],
  ]
  return <figure className="project-diagram project-diagram-pipeline" aria-label="Explore the internship information workflow">
    <div className="project-diagram-kicker"><span>Information → opportunity</span><span>Workflow schematic</span></div>
    <svg className="project-diagram-art" viewBox="0 0 900 320" role="img" aria-label={`Workflow: source, record, shortlist. Selected step: ${['source', 'record', 'shortlist'][step]}. ${hasDate ? 'A supplied date is preserved from the source.' : 'A missing date remains unknown.'}`}>
      <Arrow id={arrow} />
      <path className="project-diagram-thread" d="M125 166 C235 38 337 38 447 166 S660 295 775 166" />
      <path className={cx('project-diagram-route', step > 0 && 'is-selected')} d="M179 166 C265 166 327 166 388 166" markerEnd={`url(#${arrow})`} />
      <path className={cx('project-diagram-route', step > 1 && 'is-selected')} d="M501 166 C585 166 648 166 717 166" markerEnd={`url(#${arrow})`} />
      {[125, 450, 775].map((x, index) => <g key={x} className={cx('project-diagram-station', step === index && 'is-selected')}>
        <circle cx={x} cy="166" r="54" /><text x={x} y="190" textAnchor="middle" className="project-diagram-number">0{index + 1}</text>
      </g>)}
      <g className="project-diagram-source-lines"><path d="M91 82 H160 M91 67 H143 M91 52 H155" /><path d="M418 63 H488 M418 78 H473 M418 93 H484" /><path d="m751 73 9 9 19-22" /></g>
      <text x="125" y="275" textAnchor="middle" className="project-diagram-svg-label">EMPLOYER SOURCE</text>
      <text x="450" y="275" textAnchor="middle" className="project-diagram-svg-label">CONSISTENT RECORD</text>
      <text x="775" y="275" textAnchor="middle" className="project-diagram-svg-label">PERSONAL SHORTLIST</text>
    </svg>
    <div className="project-diagram-sequence" aria-hidden="true"><span>Employer source</span><span>Consistent record</span><span>Personal shortlist</span></div>
    <Choices label="Select a workflow step" items={['Source', 'Record', 'Shortlist']} value={step} onChange={setStep} />
    <div className="project-diagram-detail" aria-live="polite" aria-atomic="true"><h3>{details[step][0]}</h3><p>{details[step][1]}</p></div>
    <div className="project-diagram-date-test">
      <div><span className="project-diagram-label">Try one source condition</span><div className="project-diagram-inline-choices" role="group" aria-label="Illustrate whether the employer source supplies a deadline"><button type="button" aria-pressed={!hasDate} onClick={() => setHasDate(false)}>No date supplied</button><button type="button" aria-pressed={hasDate} onClick={() => setHasDate(true)}>Date supplied</button></div></div>
      <div className="project-diagram-date-result" role="status" aria-live="polite"><span className="project-diagram-label">Deadline field</span><strong>{hasDate ? 'From the source' : 'Unknown'}</strong><span>{hasDate ? 'Preserve the stated date and its source link.' : 'Show the gap. Revisit the employer posting.'}</span></div>
    </div>
    <figcaption>Illustrative workflow; verify openings at the employer source.</figcaption>
  </figure>
}

const researchQuestions = [
  { label: 'Product', question: 'Which part of the proposition deserves a closer look?', assumption: 'Describe the audience, the alternatives, and the choice being explored.', compare: 'Separate preference for a feature from willingness to choose the product.' },
  { label: 'Message', question: 'How might different audiences read the same message?', assumption: 'Keep the message and context consistent; make audience assumptions explicit.', compare: 'Look for questions about wording, comprehension, and relevance to investigate.' },
  { label: 'Price', question: 'What changes when the terms of a choice change?', assumption: 'Define the offer, price framing, and available alternatives before interpreting responses.', compare: 'Distinguish a response to the framing from a response to the underlying offer.' },
]

function ResearchDiagram() {
  const [question, setQuestion] = useState(0)
  const [lens, setLens] = useState(0)
  const selected = researchQuestions[question]
  const arrow = `research-${useId().replace(/:/g, '')}`
  return <figure className="project-diagram project-diagram-research" aria-label="Explore how a synthetic research question is framed">
    <div className="project-diagram-kicker"><span>A question before a claim</span><span>Research schematic</span></div>
    <svg className="project-diagram-art research-print" viewBox="0 0 900 350" role="img" aria-label={`Illustrative printed response field for a ${selected.label.toLowerCase()} question. ${lens ? 'The outer marks indicate a claim boundary.' : 'The crossing line represents an interpretation lens.'} No study results are displayed.`}>
      <defs>
        <pattern id={`${arrow}-fine`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".95" fill="currentColor" /></pattern>
        <pattern id={`${arrow}-dense`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.55" fill="currentColor" /></pattern>
      </defs>
      <path d="M70 246C144 302 224 286 294 222S401 66 473 58C541 49 594 139 643 182S760 251 839 184C788 307 691 324 609 283S475 115 402 139C305 171 246 354 70 246Z" fill={`url(#${arrow}-dense)`} />
      <path d="M74 149C168 35 273 41 359 86S488 285 580 265C687 241 703 37 836 107C764 73 735 297 608 312C475 327 415 183 338 157S194 117 74 149Z" fill={`url(#${arrow}-fine)`} />
      <path d="M74 149C168 35 273 41 359 86S488 285 580 265C687 241 703 37 836 107" fill="none" stroke="currentColor" strokeWidth=".8" />
      {lens ? <path d="M42 77V36H86M814 36H858V77M42 274V316H86M814 316H858V274" fill="none" stroke="currentColor" strokeWidth="1.2" /> : <path d="M28 207C269 207 489 185 875 142" fill="none" stroke="currentColor" strokeWidth="1.2" />}
    </svg>
    <div className="project-diagram-sequence" aria-hidden="true"><span>Question</span><span>Synthetic response</span><span>{lens ? 'Claim boundary' : 'Interpretation'}</span></div>
    <Choices label="Choose a research question" items={researchQuestions.map(item => item.label)} value={question} onChange={setQuestion} />
    <div className="project-diagram-detail" aria-live="polite" aria-atomic="true"><h3>{selected.question}</h3><p>{selected.assumption}</p></div>
    <div className="project-diagram-lens">
      <span className="project-diagram-label">Read through a lens</span>
      <div className="project-diagram-inline-choices" role="group" aria-label="Choose an interpretation lens"><button type="button" aria-pressed={lens === 0} onClick={() => setLens(0)}>Compare alternatives</button><button type="button" aria-pressed={lens === 1} onClick={() => setLens(1)}>Bound the claim</button></div>
      <p role="status" aria-live="polite">{lens === 0 ? selected.compare : 'A simulated response can suggest a hypothesis or comparison. Claims about actual people need an appropriate human reference and a defined validation task.'}</p>
    </div>
    <figcaption>Example question frames; no measured study results are shown.</figcaption>
  </figure>
}

const marketLenses = [
  { label: 'Ownership', title: 'Who has the right to decide?', detail: 'Trace the decision rights and contractual obligations before calling something an asset, a service, or an investment.', annotation: 'DECISION RIGHTS', path: 'M168 207 C211 83 277 66 380 107', second: 'M521 111 C641 105 709 142 754 210' },
  { label: 'Revenue', title: 'Follow the path of a payment.', detail: 'Start with who pays for the service. Then ask which claims on that payment come first, what must be paid to operate, and what can reach the capital provider.', annotation: 'PAYMENT → CLAIMS', path: 'M747 247 C645 336 523 300 475 168', second: 'M385 132 C274 176 244 246 173 248' },
  { label: 'Risk', title: 'Who absorbs the change?', detail: 'A change in use, costs, or financing can affect different parties differently. Read the contract to find where the obligation actually sits.', annotation: 'EXPOSURE & OBLIGATIONS', path: 'M168 208 C297 275 353 247 416 167', second: 'M500 164 C573 266 656 298 754 247' },
]

function MarketDiagram() {
  const [lens, setLens] = useState(0)
  const selected = marketLenses[lens]
  const arrow = `market-${useId().replace(/:/g, '')}`
  return <figure className="project-diagram project-diagram-market" aria-label="Explore relationships in a market thesis">
    <div className="project-diagram-kicker"><span>Read the relationship</span><span>Contract schematic</span></div>
    <svg className="project-diagram-art" viewBox="0 0 900 365" role="img" aria-label={`${selected.label} lens connecting a capital provider, an operator, and service users. Relationships are illustrative, not a specific investment's data.`}>
      <Arrow id={arrow} />
      <path className="project-diagram-thread" d="M125 231 C251 40 623 8 789 231 C657 380 283 373 125 231" />
      <path className={cx('project-diagram-route', 'is-selected', lens === 2 && 'is-risk')} d={selected.path} markerEnd={lens !== 2 ? `url(#${arrow})` : undefined} />
      <path className={cx('project-diagram-route', 'is-selected', lens === 2 && 'is-risk')} d={selected.second} markerEnd={lens !== 2 ? `url(#${arrow})` : undefined} />
      {[[125, 231, '01'], [451, 115, '02'], [791, 231, '03']].map(([x, y, label]) => <g key={label} className="project-diagram-station"><circle cx={x} cy={y} r="51" /><text x={x} y={Number(y) + 23} textAnchor="middle" className="project-diagram-number">{label}</text></g>)}
      <text x="125" y="335" textAnchor="middle" className="project-diagram-svg-label">CAPITAL PROVIDER</text>
      <text x="451" y="38" textAnchor="middle" className="project-diagram-svg-label">OPERATOR</text>
      <text x="791" y="335" textAnchor="middle" className="project-diagram-svg-label">SERVICE USERS</text>
    </svg>
    <div className="project-diagram-sequence" aria-hidden="true"><span>01 / Capital provider</span><span>02 / Operator</span><span>03 / Service users</span></div>
    <p className="project-diagram-annotation mono" aria-live="polite">{selected.annotation}</p>
    <Choices label="Select a relationship to trace" items={marketLenses.map(item => item.label)} value={lens} onChange={setLens} />
    <div className="project-diagram-detail" aria-live="polite" aria-atomic="true"><h3>{selected.title}</h3><p>{selected.detail}</p></div>
    <figcaption>Illustrative relationships; no investment data is shown.</figcaption>
  </figure>
}

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]

function DitherDiagram() {
  const [size, setSize] = useState(4)
  const [shape, setShape] = useState(0)
  const inputId = `mark-size-${useId().replace(/:/g, '')}`
  const marks = useMemo(() => {
    const spacing = 7 + size * 2
    const columns = Math.ceil(900 / spacing), rows = Math.ceil(340 / spacing)
    const result: { x: number; y: number; radius: number }[] = []
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const x = col * spacing + spacing / 2, y = row * spacing + spacing / 2
      const nx = x / 900 * 2 - 1, ny = y / 340 * 2 - 1
      // A deterministic continuous tone field, not an image or a data series.
      const tone = Math.max(0, Math.min(1, .52 + .30 * Math.sin(nx * 5 + ny * 2 + Math.sin(ny * 3)) + .15 * Math.cos(Math.hypot(nx * .7, ny) * 8)))
      if (tone < (BAYER[row % 4][col % 4] + .5) / 16) result.push({ x, y, radius: size * .57 })
    }
    return result
  }, [size])
  return <figure className="project-diagram project-diagram-dither" aria-label="An interactive ordered dither field">
    <div className="project-diagram-kicker"><span>Continuous tone. Discrete ink.</span><span>A small working experiment</span></div>
    <svg className="project-diagram-dither-field" viewBox="0 0 900 340" role="img" aria-label={`Ordered dither field using ${shape ? 'square' : 'round'} marks at size ${size}. Larger marks produce a coarser texture.`}>
      {marks.map(({ x, y, radius }, index) => shape === 0 ? <circle key={index} cx={x} cy={y} r={radius} /> : <rect key={index} x={x - radius} y={y - radius} width={radius * 2} height={radius * 2} />)}
    </svg>
    <div className="project-diagram-dither-controls">
      <div className="project-diagram-range"><label htmlFor={inputId}>Mark size <output htmlFor={inputId}>{size}</output></label><input id={inputId} type="range" min="2" max="8" step="1" value={size} onChange={event => setSize(Number(event.currentTarget.value))} /><div className="project-diagram-range-ends"><span>Fine</span><span>Coarse</span></div></div>
      <div><span className="project-diagram-label">Mark shape</span><div className="project-diagram-inline-choices" role="group" aria-label="Choose a dither mark shape"><button type="button" aria-pressed={shape === 0} onClick={() => setShape(0)}>Round</button><button type="button" aria-pressed={shape === 1} onClick={() => setShape(1)}>Square</button></div></div>
    </div>
    <div className="project-diagram-detail"><h3>A texture made from a rule.</h3><p>A repeating 4 × 4 threshold matrix turns a continuous tone into ink marks. Change the mark size and shape to see how the same field gains a different rhythm.</p></div>
    <figcaption>A fixed threshold decides where paper becomes ink. The tone stays the same as the marks change.</figcaption>
  </figure>
}

/** Supporting chapter diagrams share the page's ink and paper, never a new canvas. */
export function ProjectDiagram({ slug }: { slug: string }) {
  switch (slug) {
    case 'internshipdeadlines': return <PipelineDiagram />
    case 'sapien': return <ResearchDiagram />
    case 'investing-markets': return <MarketDiagram />
    case 'miscellaneous': return <DitherDiagram />
    default: return null
  }
}

export default ProjectDiagram
