import type { CaseStudySlug } from './case-studies'

/** Diagrams explain each project's organizing idea; they are not product screenshots. */
export function StudyArtwork({ kind, compact = false }: { kind: CaseStudySlug; compact?: boolean }) {
  return <div className={`study-art study-art-${kind} ${compact ? 'study-art-compact' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 560 420" fill="none">
      <path className="study-art-grid" d="M40 80H520M40 160H520M40 240H520M40 320H520M120 40V380M200 40V380M280 40V380M360 40V380M440 40V380" />
      {kind === 'atlas' ? <>
        <path className="study-art-orbit" d="M80 210Q270 -50 480 210Q270 470 80 210Z" />
        <path d="M80 210L205 115L345 115L480 210L345 305L205 305ZM80 210L205 305L345 115L480 210M205 115L345 305M205 115V305M345 115V305M80 210H480" />
        {[ [80,210], [205,115], [205,305], [345,115], [345,305], [480,210] ].map(([cx,cy],i) => <g key={i}><circle className="study-art-node" cx={cx} cy={cy} r={i===5 ? 16:8} /><circle cx={cx} cy={cy} r={i===5 ? 26:15} /></g>)}
        <text x="80" y="255" textAnchor="middle">SOURCE</text><text x="276" y="65" textAnchor="middle">OBSERVATIONS</text><text x="480" y="263" textAnchor="middle">REVIEW</text>
        <text className="study-art-note" x="280" y="378" textAnchor="middle">EVERY FINDING HAS A PATH BACK.</text>
      </> : kind === 'payrollpro' ? <>
        <circle className="study-art-orbit" cx="280" cy="210" r="160" />
        <path d="M165 150L395 150L280 330ZM165 150L280 210L395 150M280 210V330" />
        <circle cx="165" cy="150" r="54" /><circle cx="395" cy="150" r="54" /><circle cx="280" cy="330" r="38" />
        <rect className="study-art-node" x="150" y="145" width="30" height="24" rx="2" /><path d="M156 145V137a9 9 0 0 1 18 0v8" />
        <path d="m373 152 11 11 22-26M380 130h26" />
        <path d="M265 319h30M265 330h30M265 341h19" />
        <circle className="study-art-node" cx="280" cy="210" r="5" />
        <text x="165" y="77" textAnchor="middle">CONFIDENTIALITY</text><text x="395" y="77" textAnchor="middle">APPROVAL</text><text x="280" y="393" textAnchor="middle">AUDIT RECORD</text>
      </> : <>
        <circle className="study-art-orbit" cx="280" cy="210" r="155" />
        <path d="M170 100H390V320H170ZM170 100L390 320M390 100L170 320" />
        <path className="study-art-loop" d="M204 56C360 2 484 106 464 238M356 363C200 419 76 314 96 182" />
        <path d="m454 224 10 14 15-10M106 196l-10-14-15 10" />
        {[ [170,100], [390,100], [390,320], [170,320] ].map(([cx,cy],i)=><g key={i}><rect className="study-art-node" x={cx-24} y={cy-24} width="48" height="48" /><text className="study-art-numeral" x={cx} y={cy+5} textAnchor="middle">0{i+1}</text></g>)}
        <text x="170" y="153" textAnchor="middle">TRACE</text><text x="390" y="153" textAnchor="middle">PATCH</text><text x="390" y="372" textAnchor="middle">REPLAY</text><text x="170" y="372" textAnchor="middle">REVIEW</text>
        <circle cx="280" cy="210" r="35" /><text x="280" y="214" textAnchor="middle">GATE</text>
      </>}
    </svg>
  </div>
}
