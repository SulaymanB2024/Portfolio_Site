import { useId } from 'react'

/** Editorial illustrations of the organizing idea, not a product or transaction state. */
export function CaseHeroArtwork({ kind }: { kind: 'payrollpro' | 'viralbench' }) {
  const grain = useId().replaceAll(':', '')
  return (
    <div className={`case-hero-art case-hero-art-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 620 570" fill="none">
        <defs>
          <pattern id={grain} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
          </pattern>
        </defs>
        {kind === 'payrollpro' ? (
          <>
            <path d="M88 259C80 139 192 66 323 92C483 127 560 284 497 415C422 563 165 528 112 389" stroke="currentColor" strokeDasharray="2 7" opacity=".5" />
            {[330, 240, 150].map((y, i) => (
              <g key={y}>
                <path d={`M119 ${y}C119 ${y - 65} 502 ${y - 65} 502 ${y}V${y + 46}C502 ${y + 110} 119 ${y + 110} 119 ${y + 46}Z`} fill={`url(#${grain})`} stroke="currentColor" />
                <ellipse cx="310.5" cy={y} rx="191.5" ry="61" fill="var(--paper)" stroke="currentColor" />
                {[0, 1, 2, 3].map((n) => (
                  <ellipse key={n} cx="310.5" cy={y + 2} rx={142 + n * 10} ry={43 + n * 3} stroke="currentColor" opacity={0.2 + n * 0.17} />
                ))}
                <ellipse cx="310.5" cy={y + 2} rx="80" ry="24" fill={i === 0 ? 'var(--paper)' : `url(#${grain})`} stroke="currentColor" />
              </g>
            ))}
            <path d="M310 111V456" stroke="currentColor" strokeDasharray="1 5" />
            <circle cx="310" cy="489" r="5" fill="currentColor" />
          </>
        ) : (
          <>
            <ellipse cx="319" cy="285" rx="215" ry="243" transform="rotate(32 319 285)" stroke="currentColor" strokeDasharray="2 7" opacity=".55" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${i * 39} ${-i * 34})`}>
                <path d="M90 253 329 181 447 323 208 395Z" fill="var(--paper)" stroke="currentColor" />
                <path d="M90 253V274L208 416L447 344V323L208 395Z" fill={`url(#${grain})`} stroke="currentColor" />
                <path d="M90 253 208 395 447 323" stroke="currentColor" />
                {[0, 1, 2, 3, 4].map((j) => (
                  <path key={j} d={`M${128 + j * 12} ${262 + j * 15}l${j === 4 ? 110 : 171} -51`} stroke="currentColor" opacity={j === 0 ? 0.8 : 0.45} />
                ))}
                <circle cx="313" cy="286" r="22" transform="skewY(-16)" fill={`url(#${grain})`} stroke="currentColor" />
              </g>
            ))}
            <path d="M98 432C195 536 379 541 480 450" stroke="currentColor" />
            <path d="m466 448 14 2-5 15" stroke="currentColor" />
          </>
        )}
      </svg>
    </div>
  )
}
