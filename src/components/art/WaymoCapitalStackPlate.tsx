import { useState } from 'react';

interface CapitalLayer {
  layer: string;
  name: string;
  source: string;
  instruments: string;
  riskExposure: string;
  claimSeniority: 'First Loss / Equity' | 'Platform Equity' | 'Asset-Backed Senior Debt' | 'Operating Cost' | 'Residual Handback';
}

const CAPITAL_LAYERS: CapitalLayer[] = [
  { layer: '01', name: 'Core Technology Stack', source: 'Alphabet Inc. / Venture Sponsors', instruments: 'Corporate R&D Equity / External Growth Rounds', riskExposure: 'Software obsolescence, safety verification failure', claimSeniority: 'First Loss / Equity' },
  { layer: '02', name: 'Commercial Dispatch Platform', source: 'Waymo LLC (Operating Company)', instruments: 'Operating Equity & Marketplace Commission', riskExposure: 'Utilization density, pricing competition, insurance liability', claimSeniority: 'Platform Equity' },
  { layer: '03', name: 'Hardware Fleet SPV', source: 'Equipment Financiers / Bank Syndicates', instruments: 'Asset-Backed Securities (ABS) & Equipment Leases', riskExposure: 'Vehicle hardware residual value, sensor suite depreciation', claimSeniority: 'Asset-Backed Senior Debt' },
  { layer: '04', name: 'Depot & Fleet Maintenance', source: 'Third-Party Fleet Service Partners', instruments: 'Cost-Plus O&M Agreements / Master Service Agreements', riskExposure: 'Cleaning, tire wear, depot land lease rates, electricity costs', claimSeniority: 'Operating Cost' },
  { layer: '05', name: 'Salvage & Secondary Handback', source: 'Secondary Asset Recovery Channels', instruments: 'Residual Value Guarantees / Recycling Salvage', riskExposure: 'Secondary AV market viability, raw silicon reclamation', claimSeniority: 'Residual Handback' },
];

export function WaymoCapitalStackPlate() {
  const [selectedLayer, setSelectedLayer] = useState<CapitalLayer>(CAPITAL_LAYERS[2]);

  return (
    <figure
      id="waymo-capital-stack-plate"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Waymo Autonomous Fleet Capital Stack Diagram"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Fleet Capital Structure
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            Five Layers of Autonomous Hardware Financing
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Capital Stack & Residual Risk Allocation
        </p>
      </div>

      {/* Isometric Stacked Rectangles */}
      <div className="space-y-2 mb-6">
        {CAPITAL_LAYERS.map((item) => {
          const isSelected = selectedLayer.layer === item.layer;
          return (
            <div
              key={item.layer}
              onClick={() => setSelectedLayer(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLayer(item); }}
              className={`p-3 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isSelected
                  ? 'border-current bg-current/5 shadow-xs'
                  : 'border-current/12 hover:border-current/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 bg-current/10">
                  {item.layer}
                </span>
                <div>
                  <h4 className="font-serif text-base font-normal">{item.name}</h4>
                  <p className="text-[11px] text-current/65 font-sans">{item.source}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-right">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-current/50 block">Financing Vehicle</span>
                  <span className="text-[11px] text-current/80">{item.instruments}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 whitespace-nowrap ${
                    item.claimSeniority === 'Asset-Backed Senior Debt'
                      ? 'bg-blue-900/10 text-blue-900 border border-blue-900/30'
                      : item.claimSeniority === 'First Loss / Equity'
                        ? 'bg-rose-900/10 text-rose-900 border border-rose-900/30'
                        : 'bg-current/5 text-current/80'
                  }`}
                >
                  {item.claimSeniority}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Layer Detail */}
      <div className="border border-current/14 p-4 bg-current/[0.02] text-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-current/50">
              Layer {selectedLayer.layer} Primary Risk & Boundary
            </span>
            <p className="text-current/85 text-xs font-serif font-normal mt-0.5 max-w-lg">
              {selectedLayer.riskExposure}
            </p>
          </div>
          <div className="sm:text-right text-[11px] text-current/65">
            <span>Primary Claim: {selectedLayer.claimSeniority}</span><br />
            <span>Funding: {selectedLayer.source}</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Figure 01 · Structured capital layers in robotaxi deployment: isolating vehicle depreciation and sensor hardware from software equity allows commercial operators to shift asset-heavy balance sheet burdens to equipment debt syndicates.
      </figcaption>
    </figure>
  );
}
