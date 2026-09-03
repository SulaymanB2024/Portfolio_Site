import { useState } from 'react';

type TopologyMode = 'directed-graph' | 'hub-and-spoke' | 'orphan-anomaly' | 'linear-chain';

export function RetrievalGraphDiagram() {
  const [activeTopology, setActiveTopology] = useState<TopologyMode>('directed-graph');

  return (
    <figure
      id="directed-retrieval-graph-diagram"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Directed Retrieval Graph Diagram"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Graph Topology Model
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            Internal Links as Directed Retrieval Graphs
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Interactive topological inspection
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex flex-wrap gap-1 items-center mb-4">
        <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Topology:</span>
        {[
          { id: 'directed-graph', label: 'Directed Retrieval Network' },
          { id: 'hub-and-spoke', label: 'Balanced Hub & Spoke' },
          { id: 'linear-chain', label: 'Deep Linear Dilution' },
          { id: 'orphan-anomaly', label: 'Orphan Node Anomaly' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTopology(tab.id as TopologyMode)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              activeTopology === tab.id
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
          viewBox="0 0 860 380"
          className="w-full h-auto"
          role="img"
          aria-label="Topological graph of internal links showing nodes and directed edges"
        >
          <defs>
            <marker id="edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" opacity="0.6" />
            </marker>
            <marker id="edge-arrow-orphan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#8b4d45" opacity="0.8" />
            </marker>
            <pattern id="retrieval-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.75" fill="currentColor" opacity="0.08" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#retrieval-grid)" />

          {/* Root / Authority Seed Node */}
          <g transform="translate(100, 190)">
            <circle r="36" fill="var(--article-paper)" stroke="currentColor" strokeWidth="2" />
            <circle r="44" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
            <text y="-8" fontSize="10" fontFamily="monospace" fill="#465c67" textAnchor="middle" fontWeight="600">DEPTH 0</text>
            <text y="8" fontSize="13" fontFamily="serif" fill="currentColor" textAnchor="middle" fontWeight="500">Root / Hub</text>
            <text y="22" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.6" textAnchor="middle">Weight: 1.00</text>
          </g>

          {activeTopology === 'directed-graph' && (
            <>
              {/* Directed Edges */}
              <line x1="140" y1="170" x2="280" y2="105" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
              <line x1="145" y1="190" x2="280" y2="190" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
              <line x1="140" y1="210" x2="280" y2="275" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />

              {/* Cluster Nodes Depth 1 */}
              {[
                { label: 'Cluster A', y: 100, weight: '0.32' },
                { label: 'Cluster B', y: 190, weight: '0.38' },
                { label: 'Cluster C', y: 280, weight: '0.28' },
              ].map((c, i) => (
                <g key={i} transform={`translate(320, ${c.y})`}>
                  <circle r="26" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.5" />
                  <text y="-4" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle">{c.label}</text>
                  <text y="10" fontSize="8" fontFamily="monospace" fill="#2f4738" textAnchor="middle">W: {c.weight}</text>
                </g>
              ))}

              {/* Cross-Cluster Mesh Edges */}
              <path d="M 320 126 C 320 150, 320 160, 320 164" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" markerEnd="url(#edge-arrow)" />
              <path d="M 345 105 C 440 100, 440 160, 520 140" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" markerEnd="url(#edge-arrow)" />
              <path d="M 345 190 C 440 190, 440 160, 520 160" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" markerEnd="url(#edge-arrow)" />
              <path d="M 345 280 C 440 280, 440 220, 520 220" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" markerEnd="url(#edge-arrow)" />

              {/* Leaf Document Nodes Depth 2 */}
              {[
                { label: 'Doc 01', y: 110 },
                { label: 'Doc 02', y: 160 },
                { label: 'Doc 03', y: 210 },
                { label: 'Doc 04', y: 260 },
              ].map((d, i) => (
                <g key={i} transform={`translate(560, ${d.y})`}>
                  <circle r="18" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1" />
                  <text y="3" fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">{d.label}</text>
                </g>
              ))}

              {/* Retrieval Target Node Depth 3 */}
              <line x1="580" y1="160" x2="720" y2="185" stroke="#2f4738" strokeWidth="1.8" markerEnd="url(#edge-arrow)" />
              <line x1="580" y1="210" x2="720" y2="195" stroke="#2f4738" strokeWidth="1.8" markerEnd="url(#edge-arrow)" />
              <g transform="translate(760, 190)">
                <circle r="30" fill="var(--article-paper)" stroke="#2f4738" strokeWidth="2" />
                <circle r="36" fill="none" stroke="#2f4738" strokeWidth="1" strokeDasharray="4 2" />
                <text y="-4" fontSize="10" fontFamily="monospace" fill="#2f4738" textAnchor="middle" fontWeight="600">TARGET</text>
                <text y="10" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle">High Authority</text>
              </g>
            </>
          )}

          {activeTopology === 'hub-and-spoke' && (
            <>
              {/* Radial spoke layout */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = 450 + Math.cos(rad) * 120;
                const y = 190 + Math.sin(rad) * 120;
                return (
                  <g key={i}>
                    <line x1="450" y1="190" x2={x} y2={y} stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
                    <circle cx={x} cy={y} r="18" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.2" />
                    <text x={x} y={y + 3} fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">P.{String(i+1).padStart(2, '0')}</text>
                  </g>
                );
              })}
              <g transform="translate(450, 190)">
                <circle r="32" fill="var(--article-paper)" stroke="currentColor" strokeWidth="2" />
                <text y="4" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle">Central Hub</text>
              </g>
            </>
          )}

          {activeTopology === 'linear-chain' && (
            <>
              {/* A -> B -> C -> D -> E linear link dilution */}
              {[180, 320, 460, 600, 740].map((x, i) => (
                <g key={i}>
                  {i < 4 && (
                    <line x1={x + 28} y1="190" x2={x + 110} y2="190" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
                  )}
                  <circle cx={x} cy="190" r="24" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.5" />
                  <text x={x} y="185" fontSize="8" fontFamily="monospace" fill="#465c67" textAnchor="middle">DEPTH {i+1}</text>
                  <text x={x} y="198" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">Node {String.fromCharCode(65 + i)}</text>
                  <text x={x} y="225" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.5" textAnchor="middle">PR: {(1 / Math.pow(1.8, i+1)).toFixed(3)}</text>
                </g>
              ))}
            </>
          )}

          {activeTopology === 'orphan-anomaly' && (
            <>
              {/* Connected tree */}
              <line x1="140" y1="180" x2="300" y2="130" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
              <line x1="140" y1="200" x2="300" y2="250" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#edge-arrow)" />
              <circle cx="320" cy="130" r="22" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="320" cy="250" r="22" fill="var(--article-paper)" stroke="currentColor" strokeWidth="1.5" />
              <text x="320" y="134" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">Indexed A</text>
              <text x="320" y="254" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">Indexed B</text>

              {/* Orphan Node (Disconnected) */}
              <g transform="translate(620, 190)">
                <circle r="32" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="2" strokeDasharray="4 3" />
                <text y="-8" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle" fontWeight="600">IN-DEGREE 0</text>
                <text y="7" fontSize="12" fontFamily="serif" fill="#8b4d45" textAnchor="middle" fontWeight="500">Orphan Node</text>
                <text y="20" fontSize="8" fontFamily="monospace" fill="#8b4d45" opacity="0.8" textAnchor="middle">Crawl Discovery: Nil</text>
              </g>

              {/* Question mark / alert symbol */}
              <path d="M 400 190 L 570 190" stroke="#8b4d45" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
              <text x="485" y="180" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">Missing Inbound Directed Path</text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 border border-current/14 p-4 bg-current/[0.02] text-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-current/50">Topological Rule</span>
            <p className="text-current/85 text-xs font-serif font-normal mt-0.5 max-w-lg">
              {activeTopology === 'directed-graph' && 'Retrieval priority follows the directed acyclic flow of internal links. Crawlers compute authority damping vectors across adjacent nodes.'}
              {activeTopology === 'hub-and-spoke' && 'Balanced clusters distribute crawl budget uniformly across child nodes with reciprocal parent breadcrumbs.'}
              {activeTopology === 'linear-chain' && 'Deep link chains (> 4 clicks) dilute discovery probability exponentially, causing tail document starvation.'}
              {activeTopology === 'orphan-anomaly' && 'An orphan node possesses in-degree 0 from the site’s directed graph; despite XML sitemap inclusion, discovery latency increases by up to 14×.'}
            </p>
          </div>
          <div className="text-right text-[11px] text-current/60">
            <span>Damping Factor d = 0.85</span><br />
            <span>Convergence: O(E log V)</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · Mathematical representation of website internal link architecture as a directed retrieval graph. Edge directionality dictates search crawler discovery order and PageRank distribution.
      </figcaption>
    </figure>
  );
}
