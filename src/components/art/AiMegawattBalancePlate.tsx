import { useState } from 'react';

type MegawattView = 'power-train' | 'pue-breakdown';

export function AiMegawattBalancePlate() {
  const [view, setView] = useState<MegawattView>('power-train');

  return (
    <figure
      id="ai-megawatt-balance-plate"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="AI Megawatt Power Train and Balance-of-Plant Diagram"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Power Train Engineering
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            The Balance-of-Plant Cascade: 100 MW Nameplate to Compute
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Model: 100 MW High-Density Data Center Substation
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-1 items-center mb-4">
        <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Inspection:</span>
        {[
          { id: 'power-train', label: 'Electrical & Thermal Power Train' },
          { id: 'pue-breakdown', label: 'Nameplate vs Compute Efficiency' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id as MegawattView)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              view === tab.id
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
          aria-label="Power flow diagram from utility grid interconnect to GPU compute racks"
        >
          <defs>
            <marker id="mw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" opacity="0.6" />
            </marker>
            <pattern id="mw-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.75" fill="currentColor" opacity="0.08" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#mw-grid)" />

          {view === 'power-train' ? (
            <>
              {/* Power Stages across horizontal axis */}
              {[
                { stage: '01', name: 'Utility Substation', spec: '138 kV Interconnect', loss: '100.0 MW In', x: 70, y: 150 },
                { stage: '02', name: 'MV Switchgear', spec: '13.8 kV Distribution', loss: 'Transformer: -1.2 MW', x: 230, y: 150 },
                { stage: '03', name: 'UPS & Flywheel', spec: 'Static Transfer Switch', loss: 'Conversion: -2.3 MW', x: 390, y: 150 },
                { stage: '04', name: 'Power Distribution', spec: '415V Server Busbars', loss: 'I²R Line Loss: -0.9 MW', x: 550, y: 150 },
                { stage: '05', name: 'GB300 NVL72 Racks', spec: 'Compute & Tensor Cores', loss: 'Net Compute: 77.6 MW', x: 730, y: 150 },
              ].map((s, i) => (
                <g key={i}>
                  {i < 4 && (
                    <line x1={s.x + 65} y1={s.y} x2={s.x + 95} y2={s.y} stroke="currentColor" strokeWidth="2" opacity="0.6" markerEnd="url(#mw-arrow)" />
                  )}
                  <g transform={`translate(${s.x}, ${s.y})`}>
                    <rect x="-60" y="-45" width="120" height="90" fill="var(--article-paper)" stroke="currentColor" strokeWidth={i === 4 ? 2 : 1.2} />
                    {i === 4 && <rect x="-60" y="-45" width="120" height="4" fill="#2f4738" />}
                    <text y="-25" fontSize="9" fontFamily="monospace" fill="#465c67" textAnchor="middle">STAGE {s.stage}</text>
                    <text y="-6" fontSize="11" fontFamily="serif" fill="currentColor" textAnchor="middle" fontWeight="500">{s.name}</text>
                    <text y="10" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.6" textAnchor="middle">{s.spec}</text>
                    <text y="28" fontSize="9" fontFamily="monospace" fill={i === 4 ? '#2f4738' : '#8b4d45'} textAnchor="middle" fontWeight="600">{s.loss}</text>
                  </g>
                </g>
              ))}

              {/* Thermal Loop Below */}
              <path d="M 730 205 C 730 280, 550 280, 550 280" fill="none" stroke="#465c67" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#mw-arrow)" />
              <g transform="translate(450, 280)">
                <rect x="-90" y="-25" width="180" height="50" fill="var(--article-paper)" stroke="#465c67" strokeWidth="1.2" />
                <text y="-8" fontSize="9" fontFamily="monospace" fill="#465c67" textAnchor="middle">DIRECT-TO-CHIP COOLING</text>
                <text y="8" fontSize="10" fontFamily="serif" fill="currentColor" textAnchor="middle">Warm Water Loop (45°C) · Heat Exchanger</text>
              </g>
              <path d="M 350 280 C 230 280, 150 280, 150 220" fill="none" stroke="#465c67" strokeWidth="1.5" strokeDasharray="3 3" />
              <g transform="translate(150, 280)">
                <circle r="22" fill="var(--article-paper)" stroke="#8b4d45" strokeWidth="1.2" />
                <text y="-2" fontSize="8" fontFamily="monospace" fill="#8b4d45" textAnchor="middle">PUE</text>
                <text y="10" fontSize="9" fontFamily="monospace" fill="#8b4d45" textAnchor="middle" fontWeight="600">+18.0 MW</text>
              </g>
              <text x="150" y="325" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.6" textAnchor="middle">Evaporative Cooling Towers</text>
            </>
          ) : (
            <>
              {/* Stacked Bar Comparison */}
              <g transform="translate(60, 60)">
                <text x="0" y="0" fontSize="12" fontFamily="serif" fill="currentColor">100 MW Utility Allocation Breakdown</text>

                {/* Full bar: 100MW */}
                <rect x="0" y="25" width="740" height="50" fill="#8b4d45" opacity="0.8" />
                {/* Usable compute: 77.6MW */}
                <rect x="0" y="25" width="574" height="50" fill="#2f4738" />
                {/* Distribution loss: 4.4MW */}
                <rect x="574" y="25" width="33" height="50" fill="#465c67" />

                <g transform="translate(250, 56)">
                  <text fontSize="12" fontFamily="monospace" fill="#f4f3ef" textAnchor="middle" fontWeight="600">Net Compute Chips: 77.6 MW (77.6%)</text>
                </g>
                <g transform="translate(660, 56)">
                  <text fontSize="11" fontFamily="monospace" fill="#f4f3ef" textAnchor="middle">Cooling: 18.0 MW (18%)</text>
                </g>
              </g>

              {/* Data Table rows below */}
              <g transform="translate(60, 160)">
                {[
                  { label: 'Nameplate Interconnect Capacity', value: '100.0 MW', pct: '100.0%', note: 'Signed utility interconnection agreement' },
                  { label: 'Substation & Transformer Losses (98.8% eff)', value: '-1.2 MW', pct: '-1.2%', note: 'Step-down 138kV to 13.8kV' },
                  { label: 'UPS & Rectifier Losses (96.5% eff)', value: '-2.3 MW', pct: '-2.3%', note: 'Continuous double conversion' },
                  { label: 'Low Voltage Distribution I²R Loss', value: '-0.9 MW', pct: '-0.9%', note: '415V copper busbar line loss' },
                  { label: 'Cooling Plant Parasitic Load (PUE 1.18)', value: '-18.0 MW', pct: '-18.0%', note: 'Pumps, cooling towers, chiller assist' },
                  { label: 'Actual Realized Silicon Compute Power', value: '77.6 MW', pct: '77.6%', note: 'Power delivered to GPU/CPU voltage regulators' },
                ].map((row, i) => (
                  <g key={i} transform={`translate(0, ${i * 26})`}>
                    <line x1="0" y1="20" x2="740" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                    <text x="10" y="14" fontSize="10" fontFamily="serif" fill="currentColor">{row.label}</text>
                    <text x="360" y="14" fontSize="10" fontFamily="monospace" fill={i === 5 ? '#2f4738' : 'currentColor'} fontWeight={i === 5 ? '600' : 'normal'}>{row.value}</text>
                    <text x="450" y="14" fontSize="9" fontFamily="monospace" fill="currentColor" opacity="0.7">{row.pct}</text>
                    <text x="540" y="14" fontSize="9" fontFamily="sans-serif" fill="currentColor" opacity="0.6">{row.note}</text>
                  </g>
                ))}
              </g>
            </>
          )}
        </svg>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · Power conversion cascade from high-voltage utility transmission to chip-level silicon dissipation: for every 100 megawatts contracted from the grid, only 77.6 megawatts reach compute silicon under state-of-the-art PUE 1.18 liquid-cooled architectures.
      </figcaption>
    </figure>
  );
}
