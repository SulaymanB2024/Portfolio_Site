import { useState } from 'react';

type CanonicalCase = 'convergent' | 'split-brain' | 'circular-redirect';

export function CanonicalGraphDiagram() {
  const [activeCase, setActiveCase] = useState<CanonicalCase>('convergent');

  return (
    <figure
      id="canonical-graph-diagram"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Canonicalization Graph Consistency Diagram"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Equivalence Class Verification
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            Canonicalization as a Graph Consistency Problem
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Compare valid DAG convergence vs invalid cycles
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-1 items-center mb-4">
        <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Scenario:</span>
        {[
          { id: 'convergent', label: 'Valid Acyclic Equivalence Class' },
          { id: 'split-brain', label: 'Split-Brain Transitive Drift' },
          { id: 'circular-redirect', label: 'Circular Canonical Loop' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCase(tab.id as CanonicalCase)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              activeCase === tab.id
                ? 'border-current bg-current text-[var(--article-paper)] font-medium'
                : 'border-current/15 text-current/70 hover:border-current/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full border border-current/10 bg-current/[0.01] p-2">
        <svg
          viewBox="0 0 860 360"
          className="w-full h-auto"
          role="img"
          aria-label="Graph diagrams contrasting convergent canonical clusters against cyclic traps"
        >
          <defs>
            <marker id="canon-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" opacity="0.6" />
            </marker>
            <marker id="canon-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#2f4738" />
            </marker>
            <marker id="canon-arrow-risk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#8b4d45" />
            </marker>
            <pattern id="canon-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.75" fill="currentColor" opacity="0.08" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#canon-grid)" />

          {activeCase === 'convergent' && (
            <>
              {/* Canonical Representative Node */}
              <g transform="translate(560, 180)">
                <circle r="44" fill="var(--article-paper)" stroke="#2f4738" strokeWidth="2.5" />
                <circle r="52" fill="none" stroke="#2f4738" strokeWidth="1" strokeDasharray="4 2" />
                <text y="-10" fontSize="9" fontFamily="monospace" fill="#2f4738" textAnchor="middle" fontWeight="600">SELF-CANONICAL</text>
                <text y="8" fontSize="13" fontFamily="serif" fill="currentColor" textAnchor="middle" fontWeight="500">/research/series</text>
                <text y="24" fontSize="8" fontFamily="monospace" fill="#2f4738" textAnchor="middle">Rel=&quot;canonical&quot; (Self)</text>
              </g>

              {/* Equivalence Class Member Nodes */}
              {[
                { label: '?utm_source=news', y: 80 },
                { label: '?page=1&sort=date', y: 140 },
                { label: '/research/series/', y: 220 },
                { label: '?ref=newsletter', y: 280 },
              ].map((m, i) => (
                <g key={i}>
                  <line x1="280" y1={m.y} x2="500" y2="180" stroke="#2f4738" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" markerEnd="url(#canon-arrow-green)" />
                  <g transform={`translate(160, ${m.y})`}>
                    <rect x="-100" y="-16" width="200" height="32" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1" />
                    <text y="4" fontSize="10" fontFamily="monospace" fill="currentColor" textAnchor="middle">{m.label}</text>
                  </g>
                </g>
              ))}

              <text x="390" y="240" fontSize="10" fontFamily="monospace" fill="#2f4738" textAnchor="middle">All variants resolve to single invariant ID</text>
            </>
          )}

          {activeCase === 'split-brain' && (
            <>
              {/* Node A */}
              <g transform="translate(180, 180)">
                <circle r="36" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.5" />
                <text y="-4" fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">URL A</text>
                <text y="10" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">/product</text>
              </g>

              {/* Node B */}
              <g transform="translate(430, 180)">
                <circle r="36" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="1.5" />
                <text y="-4" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">URL B</text>
                <text y="10" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">/products/main</text>
              </g>

              {/* Node C */}
              <g transform="translate(680, 180)">
                <circle r="36" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="1.5" />
                <text y="-4" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">URL C</text>
                <text y="10" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">/store/product</text>
              </g>

              {/* Inconsistent Vectors */}
              <line x1="220" y1="180" x2="385" y2="180" stroke="#8b4d45" strokeWidth="1.5" markerEnd="url(#canon-arrow-risk)" />
              <line x1="470" y1="180" x2="635" y2="180" stroke="#8b4d45" strokeWidth="1.5" markerEnd="url(#canon-arrow-risk)" />
              <path d="M 680 140 C 600 60, 260 60, 180 140" fill="none" stroke="#8b4d45" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#canon-arrow-risk)" />

              <text x="305" y="168" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">rel=canonical</text>
              <text x="555" y="168" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">rel=canonical</text>
              <text x="430" y="85" fontSize="10" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">Disagreement: 301 Redirect loop back to A</text>
            </>
          )}

          {activeCase === 'circular-redirect' && (
            <>
              {/* Circular loop between Page A and Page B */}
              <g transform="translate(280, 180)">
                <circle r="40" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="2" />
                <text y="-6" fontSize="10" fontFamily="monospace" fill="#8b4d45" textAnchor="middle" fontWeight="600">PAGE A</text>
                <text y="10" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle">/category/shoes</text>
              </g>

              <g transform="translate(580, 180)">
                <circle r="40" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="2" />
                <text y="-6" fontSize="10" fontFamily="monospace" fill="#8b4d45" textAnchor="middle" fontWeight="600">PAGE B</text>
                <text y="10" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle">/shoes/all</text>
              </g>

              {/* Curved arrows forming a circle */}
              <path d="M 310 150 C 370 100, 490 100, 550 150" fill="none" stroke="#8b4d45" strokeWidth="2" markerEnd="url(#canon-arrow-risk)" />
              <path d="M 550 210 C 490 260, 370 260, 310 210" fill="none" stroke="#8b4d45" strokeWidth="2" markerEnd="url(#canon-arrow-risk)" />

              <text x="430" y="115" fontSize="10" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">Page A points canonical to Page B</text>
              <text x="430" y="255" fontSize="10" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">Page B points canonical to Page A</text>
              <text x="430" y="185" fontSize="12" fontFamily="serif" fill="#8b4d45" textAnchor="middle" fontStyle="italic">Crawl Trap: Non-Convergent Equivalence</text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 border border-current/14 p-4 bg-current/[0.02] text-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-current/50">Graph Invariant</span>
            <p className="text-current/85 text-xs font-serif font-normal mt-0.5 max-w-lg">
              {activeCase === 'convergent' && 'A canonical cluster must form a directed acyclic tree of height 1. Every tracking parameter, session ID, and trailing-slash variant collapses immediately onto the self-canonical root.'}
              {activeCase === 'split-brain' && 'Transitive canonical chains (A -> B -> C) fail Googlebot indexing rules. Search engines ignore conflicting multi-hop canonical vectors and select an arbitrary heuristic winner.'}
              {activeCase === 'circular-redirect' && 'Circular canonical declarations create infinite loop anomalies in indexation algorithms, frequently resulting in de-indexing of both document records.'}
            </p>
          </div>
          <div className="text-right text-[11px] text-current/60">
            <span>Target: DAG Height = 1</span><br />
            <span>Cycle Check: O(V + E)</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · Canonicalization as equivalence class validation: correct implementations partition the URL space into clean equivalence classes whose directed edges terminate unconditionally on a self-canonical representative.
      </figcaption>
    </figure>
  );
}
