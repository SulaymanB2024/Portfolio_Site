import { useState } from 'react'

export type DecisionStep = { label: string; title: string; detail: string; output: string }

export default function DecisionExplorer({ label, steps, note, outputLabel = 'In the record' }: { label: string; steps: DecisionStep[]; note: string; outputLabel?: string }) {
  const [active, setActive] = useState(0)
  const step = steps[active]
  return <div className="decision-explorer">
    <div className="decision-choices" role="group" aria-label={label}>{steps.map((item,index)=><button type="button" key={item.label} onClick={()=>setActive(index)} aria-pressed={index===active}><span>{item.label}</span></button>)}</div>
    <div className="decision-detail" aria-live="polite" aria-atomic="true"><span className="eyebrow">{label} / 0{active+1}</span><h3>{step.title}</h3><p>{step.detail}</p><div className="decision-output"><span className="mono">{outputLabel}</span><p>{step.output}</p></div></div>
    <p className="decision-note">{note}</p>
  </div>
}
