import { useState } from 'react';

interface ValueChainStage {
  stage: string;
  name: string;
  substance: string;
  usStatus: 'commercial' | 'commissioning' | 'pilot' | 'offshore-gap';
  usStatusLabel: string;
  players: string;
  yieldPct: string;
}

const VALUE_CHAIN: ValueChainStage[] = [
  { stage: '01', name: 'Mine & Flotation', substance: 'Bastnäsite / Monazite Ore (15% TREO)', usStatus: 'commercial', usStatusLabel: 'Commercial Scale', players: 'MP Materials (Mountain Pass)', yieldPct: '100% (Feed)' },
  { stage: '02', name: 'Hydromet Separation', substance: 'Refined Nd/Pr Rare Earth Oxides', usStatus: 'commissioning', usStatusLabel: 'Active Commissioning', players: 'MP Materials, USA Rare Earth', yieldPct: '88% Recovery' },
  { stage: '03', name: 'Metal Reduction', substance: 'Molten-Salt Electrolysis (NdPr Metal)', usStatus: 'offshore-gap', usStatusLabel: 'Primary Offshore Chokepoint', players: 'Limited domestic pilot capacity', yieldPct: '94% Metallization' },
  { stage: '04', name: 'Alloy Strip Casting', substance: 'NdFeB Flake Alloy (+ Dy/Tb Heavy REE)', usStatus: 'pilot', usStatusLabel: 'Pilot / Scale-Up', players: 'E-VAC Magnetics, MP Fort Worth', yieldPct: '98% Cast' },
  { stage: '05', name: 'Jet Milling & Sintering', substance: 'Sintered NdFeB Magnet Blocks', usStatus: 'commissioning', usStatusLabel: 'Factory Construction', players: 'MP Materials Fort Worth, Noveon', yieldPct: '82% Block Yield' },
  { stage: '06', name: 'Automotive Qual', substance: 'E-Motor Stator & Rotor Integration', usStatus: 'pilot', usStatusLabel: 'Multi-Year OEM PPAP Qualification', players: 'GM, tier-1 EV propulsion suppliers', yieldPct: 'Tier-1 Certified' },
];

export function RareEarthStagePlate() {
  const [selectedStage, setSelectedStage] = useState<ValueChainStage>(VALUE_CHAIN[2]);

  return (
    <figure
      id="rare-earth-stage-plate"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Rare Earth Magnet Production Value Chain Plate"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Supply Chain Maturity Model
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            The Six-Stage Sintered Magnet Value Chain
          </h3>
        </div>
        <p className="text-xs text-current/65">
          U.S. Domestic Qualification Status · 2026 Audit
        </p>
      </div>

      {/* SVG Value Chain Track */}
      <div className="relative w-full border border-current/10 bg-current/[0.01] p-2">
        <svg
          viewBox="0 0 860 260"
          className="w-full h-auto"
          role="img"
          aria-label="Six stage value chain diagram from mining to automotive qualification"
        >
          <defs>
            <marker id="re-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" opacity="0.6" />
            </marker>
          </defs>

          {/* Connection rail */}
          <line x1="70" y1="110" x2="790" y2="110" stroke="currentColor" strokeWidth="2" opacity="0.25" />

          {/* 6 Stage Nodes */}
          {VALUE_CHAIN.map((s, i) => {
            const cx = 70 + i * 144;
            const cy = 110;
            const isSelected = selectedStage.stage === s.stage;
            const isChokepoint = s.usStatus === 'offshore-gap';

            return (
              <g
                key={s.stage}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => setSelectedStage(s)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedStage(s); }}
                aria-pressed={isSelected}
              >
                {/* Connecting arrow */}
                {i < 5 && (
                  <line x1="28" y1="0" x2="116" y2="0" stroke="currentColor" strokeWidth="2" opacity="0.5" markerEnd="url(#re-arrow)" />
                )}

                {/* Node Ring */}
                <circle
                  r={isSelected ? 26 : 22}
                  fill="var(--article-paper)"
                  stroke={isChokepoint ? '#8b4d45' : isSelected ? '#2f4738' : 'currentColor'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={isChokepoint ? '3 2' : undefined}
                />

                {/* Stage Number */}
                <text
                  y="4"
                  fontSize="11"
                  fontFamily="monospace"
                  fill={isChokepoint ? '#8b4d45' : isSelected ? '#2f4738' : 'currentColor'}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {s.stage}
                </text>

                {/* Labels above/below */}
                <text
                  y="-34"
                  fontSize="10"
                  fontFamily="serif"
                  fill="currentColor"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {s.name}
                </text>
                <text
                  y="42"
                  fontSize="8"
                  fontFamily="monospace"
                  fill={isChokepoint ? '#8b4d45' : '#465c67'}
                  textAnchor="middle"
                  fontWeight={isChokepoint ? '600' : 'normal'}
                >
                  {s.usStatus === 'offshore-gap' ? 'CRITICAL GAP' : s.usStatus.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="mt-4 border border-current/14 p-4 bg-current/[0.02] flex flex-col md:flex-row justify-between gap-4 text-xs">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 bg-current/10">
              Stage {selectedStage.stage}
            </span>
            <h4 className="font-serif text-base font-medium">{selectedStage.name}</h4>
          </div>
          <p className="text-current/80 text-xs mt-1">
            Physical Product: {selectedStage.substance}
          </p>
          <p className="text-current/65 text-[11px] mt-1 font-sans">
            Domestic Operators: {selectedStage.players}
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-current/12 pt-3 md:pt-0 md:pl-4 min-w-[240px] space-y-2">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-current/50 block">U.S. Maturity Status</span>
            <span
              className={`inline-block px-1.5 py-0.5 text-[10px] font-medium mt-0.5 ${
                selectedStage.usStatus === 'offshore-gap'
                  ? 'border border-rose-700/40 text-rose-800'
                  : selectedStage.usStatus === 'commercial'
                    ? 'border border-emerald-700/40 text-emerald-800'
                    : 'border border-blue-700/40 text-blue-800'
              }`}
            >
              {selectedStage.usStatusLabel}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-current/50 block">Process Efficiency</span>
            <span className="text-[11px] text-current/80 tabular-nums">{selectedStage.yieldPct}</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · Permanent magnet value chain maturity map: while domestic upstream mining produces raw concentrate, Stage 03 (metal reduction) and Stage 05 (sintering) represent the primary industrial chokepoints required to reach qualified automotive propulsion magnets.
      </figcaption>
    </figure>
  );
}
