import { useState } from 'react';

interface FrontierState {
  id: string;
  number: string;
  name: string;
  color: string;
  x: number;
  y: number;
  description: string;
  invariants: string;
  transitionTrigger: string;
}

const FRONTIER_STATES: FrontierState[] = [
  {
    id: 'discovered',
    number: '01',
    name: 'Discovered',
    color: '#465c67',
    x: 80,
    y: 110,
    description: 'Raw URL emitted from seed input, redirect target, sitemap entry, or HTML parser.',
    invariants: 'URL normalized; hash deduplication checked against seen_urls bloom filter.',
    transitionTrigger: 'Passes robots.txt admission rules and canonical normalization gate.',
  },
  {
    id: 'admitted',
    number: '02',
    name: 'Admitted',
    color: '#465c67',
    x: 290,
    y: 110,
    description: 'URL accepted into the crawl scope; assigned initial priority weight.',
    invariants: 'Host parsed; robots.txt crawl-delay recorded; URL depth <= max_crawl_depth.',
    transitionTrigger: 'Pushed into host-specific SQLite priority queue.',
  },
  {
    id: 'scheduled',
    number: '03',
    name: 'Scheduled',
    color: '#2f4738',
    x: 500,
    y: 110,
    description: 'URL resident in per-host FIFO queue waiting for token bucket release.',
    invariants: 'Host queue concurrency <= max_host_concurrency; delay elapsed.',
    transitionTrigger: 'Worker thread acquires lock and initiates socket connection.',
  },
  {
    id: 'fetching',
    number: '04',
    name: 'Fetching',
    color: '#2f4738',
    x: 710,
    y: 110,
    description: 'Asynchronous HTTP GET in flight with strict socket and TLS handshake timeouts.',
    invariants: 'TCP timeout <= 12s; streaming body read <= 4MB buffer ceiling.',
    transitionTrigger: 'HTTP response header and stream body fully buffered or error thrown.',
  },
  {
    id: 'extracted',
    number: '05',
    name: 'Extracted',
    color: '#2f4738',
    x: 710,
    y: 310,
    description: '200 OK body parsed; internal hyperlinks, canonical tags, and JSON-LD saved.',
    invariants: 'Discovered links fed back to State 01; document body saved to SQLite blob ledger.',
    transitionTrigger: 'Document parsing complete; transaction committed.',
  },
  {
    id: 'politeness',
    number: '06',
    name: 'Politeness Delay',
    color: '#465c67',
    x: 500,
    y: 310,
    description: 'Host queue paused for mandatory interval (min_interval = 250ms) to prevent server overload.',
    invariants: 'last_request_timestamp recorded; next_request_timestamp >= now + delay.',
    transitionTrigger: 'Wait timer elapses; host queue reactivated for next pending URL.',
  },
  {
    id: 'error-backoff',
    number: '07',
    name: 'Error Backoff',
    color: '#8b4d45',
    x: 290,
    y: 310,
    description: 'Temporary error encountered (429 Rate Limited, 503 Unavailable, or TLS timeout).',
    invariants: 'retry_count < max_retries (3); backoff interval doubled exponentially (2s -> 4s -> 8s).',
    transitionTrigger: 'Backoff timer fires; re-admitted to State 02 or sent to Terminal Archive.',
  },
  {
    id: 'terminal',
    number: '08',
    name: 'Terminal Archive',
    color: '#0a0a09',
    x: 80,
    y: 310,
    description: 'URL reachability resolved: successfully extracted, permanently 404/410, or retries exhausted.',
    invariants: 'Immutable audit entry written to SQLite crawl_history; removed from active queues.',
    transitionTrigger: 'Final status stored; worker thread freed.',
  },
];

export function CrawlStateMachineDiagram() {
  const [selectedState, setSelectedState] = useState<FrontierState>(FRONTIER_STATES[0]);

  return (
    <figure
      id="frontier-state-machine-diagram"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Crawl Frontier State Machine Diagram"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Architectural State Model
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            The Eight Finite States of the Crawl Frontier
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Click any state node to inspect transitions
        </p>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full border border-current/10 bg-current/[0.01] p-2">
        <svg
          viewBox="0 0 860 420"
          className="w-full h-auto"
          role="img"
          aria-label="State transition diagram showing the 8 frontier states from discovery to terminal archival"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" opacity="0.65" />
            </marker>
            <marker id="arrow-risk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#8b4d45" opacity="0.85" />
            </marker>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.75" fill="currentColor" opacity="0.08" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Forward Transition Vectors */}
          {/* 01 -> 02 */}
          <line x1="150" y1="110" x2="215" y2="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" markerEnd="url(#arrow)" />
          {/* 02 -> 03 */}
          <line x1="365" y1="110" x2="425" y2="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" markerEnd="url(#arrow)" />
          {/* 03 -> 04 */}
          <line x1="575" y1="110" x2="635" y2="110" stroke="currentColor" strokeWidth="1.5" opacity="0.6" markerEnd="url(#arrow)" />
          {/* 04 -> 05 (Success) */}
          <line x1="710" y1="150" x2="710" y2="265" stroke="currentColor" strokeWidth="1.5" opacity="0.7" markerEnd="url(#arrow)" />
          {/* 04 -> 07 (HTTP 429/5xx Error) */}
          <path d="M 680 145 C 600 230, 420 250, 350 280" fill="none" stroke="#8b4d45" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" markerEnd="url(#arrow-risk)" />
          {/* 05 -> 06 (Politeness loopback) */}
          <line x1="640" y1="310" x2="575" y2="310" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" markerEnd="url(#arrow)" />
          {/* 06 -> 03 (Next URL in host queue) */}
          <path d="M 500 265 C 500 210, 500 180, 500 155" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" markerEnd="url(#arrow)" />
          {/* 05 -> 01 (Discovered links feedback) */}
          <path d="M 740 350 C 780 400, 100 420, 80 155" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.4" markerEnd="url(#arrow)" />
          {/* 07 -> 08 (Retries exhausted) */}
          <line x1="220" y1="310" x2="155" y2="310" stroke="#8b4d45" strokeWidth="1.5" opacity="0.6" markerEnd="url(#arrow-risk)" />
          {/* 05 -> 08 (Document written to terminal archive) */}
          <path d="M 660 330 C 500 370, 250 370, 155 330" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" markerEnd="url(#arrow)" />

          {/* Labels on transition paths */}
          <text x="180" y="102" fontSize="9" fill="currentColor" opacity="0.6" fontFamily="monospace" textAnchor="middle">Robots.txt ok</text>
          <text x="400" y="102" fontSize="9" fill="currentColor" opacity="0.6" fontFamily="monospace" textAnchor="middle">Queue priority</text>
          <text x="605" y="102" fontSize="9" fill="currentColor" opacity="0.6" fontFamily="monospace" textAnchor="middle">Token grant</text>
          <text x="735" y="210" fontSize="9" fill="currentColor" opacity="0.6" fontFamily="monospace">HTTP 200</text>
          <text x="510" y="220" fontSize="9" fill="#8b4d45" opacity="0.8" fontFamily="monospace">429 / 5xx / Timeout</text>
          <text x="430" y="390" fontSize="9" fill="currentColor" opacity="0.5" fontFamily="monospace" textAnchor="middle">Extracted &lt;a href&gt; link recursion feedback</text>

          {/* State Nodes */}
          {FRONTIER_STATES.map((state) => {
            const isSelected = selectedState.id === state.id;
            return (
              <g
                key={state.id}
                transform={`translate(${state.x - 65}, ${state.y - 35})`}
                onClick={() => setSelectedState(state)}
                className="cursor-pointer transition-transform duration-150 hover:scale-105"
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedState(state); }}
              >
                {/* Node Box */}
                <rect
                  width="130"
                  height="70"
                  fill="var(--article-paper)"
                  stroke={isSelected ? 'currentColor' : 'currentColor'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 1 : 0.3}
                  className="transition-all"
                />
                {/* Active indicator bar */}
                {isSelected && (
                  <rect width="130" height="3" fill={state.color} />
                )}
                {/* Number */}
                <text x="10" y="22" fontSize="10" fontFamily="monospace" fill={state.color} fontWeight="600" opacity="0.85">
                  {state.number}
                </text>
                {/* Title */}
                <text x="10" y="42" fontSize="12" fontFamily="serif" fill="currentColor" fontWeight="500">
                  {state.name}
                </text>
                {/* Micro status */}
                <text x="10" y="58" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.5">
                  {state.id.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected State Inspector Panel */}
      <div className="mt-4 border border-current/14 p-4 bg-current/[0.02] flex flex-col md:flex-row justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 bg-current/10">
              State {selectedState.number}
            </span>
            <h4 className="font-serif text-lg font-medium">{selectedState.name}</h4>
          </div>
          <p className="text-xs text-current/80 mt-1.5 leading-relaxed">
            {selectedState.description}
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-current/12 pt-3 md:pt-0 md:pl-4 min-w-[260px] text-xs space-y-2">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-current/50 block">State Invariants</span>
            <span className="text-current/80 text-[11px] leading-tight block mt-0.5">{selectedState.invariants}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-current/50 block">Transition Gate</span>
            <span className="text-current/80 text-[11px] leading-tight block mt-0.5">{selectedState.transitionTrigger}</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · The deterministic crawl lifecycle: unlike naive unbounded queues, a production crawl frontier models state transitions across politeness limits, exponential backoff, and terminal archival in local SQLite storage.
      </figcaption>
    </figure>
  );
}
