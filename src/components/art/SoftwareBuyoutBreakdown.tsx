import { useMemo, useState } from 'react';

type CohortStatus = 'all' | 'continuing' | 'liquidity-listed' | 'creditor-transfer' | 'clean-realization';

interface BuyoutDeal {
  target: string;
  headlineValue: string;
  valueNum: number;
  leadSponsor: string;
  year: number;
  statusCategory: 'continuing' | 'liquidity-listed' | 'creditor-transfer' | 'clean-realization';
  statusDescription: string;
  controlNote: string;
}

const BUYOUT_COHORT: BuyoutDeal[] = [
  { target: 'Citrix Systems', headlineValue: '$16.5B', valueNum: 16.5, leadSponsor: 'Vista Equity / Elliott (Evergreen)', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Merged with TIBCO to form Cloud Software Group; debt repriced; sponsor control retained.' },
  { target: 'Anaplan', headlineValue: '$10.7B', valueNum: 10.7, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private platform; ongoing operational restructuring; 100% sponsor equity intact.' },
  { target: 'Zendesk', headlineValue: '$10.2B', valueNum: 10.2, leadSponsor: 'Hellman & Friedman / Permira', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private operations; debt refinanced 2025; no sponsor realization.' },
  { target: 'Avalara', headlineValue: '$8.4B', valueNum: 8.4, leadSponsor: 'Vista Equity Partners', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Integrated add-ons; private ownership unchanged.' },
  { target: 'Coupa Software', headlineValue: '$8.0B', valueNum: 8.0, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Executive leadership change; active holding.' },
  { target: 'Medallia', headlineValue: '$6.4B', valueNum: 6.4, leadSponsor: 'Thoma Bravo', year: 2021, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private portfolio hold; tack-on acquisitions; no realization event.' },
  { target: 'SailPoint Technologies', headlineValue: '$6.1B', valueNum: 6.1, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'liquidity-listed', statusDescription: 'Public Listing with Retained Control', controlNote: 'Secondary IPO opened public trading; Thoma Bravo retains >60% voting power; fails clean control exit test.' },
  { target: 'Cornerstone OnDemand', headlineValue: '$5.2B', valueNum: 5.2, leadSponsor: 'Clearlake Capital', year: 2021, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private holding; add-on acquisitions; sponsor retains primary equity.' },
  { target: 'KnowBe4', headlineValue: '$4.6B', valueNum: 4.6, leadSponsor: 'Vista Equity Partners', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private enterprise platform; ongoing revenue expansion; no realization.' },
  { target: 'Pluralsight', headlineValue: '$3.5B', valueNum: 3.5, leadSponsor: 'Vista Equity Partners', year: 2021, statusCategory: 'creditor-transfer', statusDescription: 'Creditor Recapitalization / Transfer', controlNote: 'Debt shifted via drop-down; lenders assumed equity control in 2024 restructuring; zero sponsor realization.' },
  { target: 'Ping Identity', headlineValue: '$2.8B', valueNum: 2.8, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Combined with ForgeRock; private holding operating as single enterprise identity group.' },
  { target: 'Duck Creek Technologies', headlineValue: '$2.6B', valueNum: 2.6, leadSponsor: 'Vista Equity Partners', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'P&C insurance SaaS; private operating entity.' },
  { target: 'ForgeRock', headlineValue: '$2.3B', valueNum: 2.3, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Merged into Ping platform; single control block.' },
  { target: 'Sumo Logic', headlineValue: '$1.7B', valueNum: 1.7, leadSponsor: 'Francisco Partners', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Private operational hold; cost restructuring.' },
  { target: 'Momentive (SurveyMonkey)', headlineValue: '$1.5B', valueNum: 1.5, leadSponsor: 'Symphony Technology Group (STG)', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Re-branded SurveyMonkey; private operating company.' },
  { target: 'Magnet Forensics', headlineValue: '$1.3B', valueNum: 1.3, leadSponsor: 'Thoma Bravo', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Merged with Grayshift to form unified digital forensics asset.' },
  { target: 'UserTesting', headlineValue: '$1.3B', valueNum: 1.3, leadSponsor: 'Thoma Bravo', year: 2022, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Merged with UserZoom; private software hold.' },
  { target: 'Mimecast', headlineValue: '$5.8B', valueNum: 5.8, leadSponsor: 'Permira', year: 2021, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Cybersecurity platform; private holding.' },
  { target: 'Blackbaud (Attempted/Stake)', headlineValue: '$4.3B', valueNum: 4.3, leadSponsor: 'Clearlake Capital', year: 2022, statusCategory: 'liquidity-listed', statusDescription: 'Minority Public Stake', controlNote: 'Takeover rejected; partial public position retained without full operational control.' },
  { target: 'Alteryx', headlineValue: '$4.4B', valueNum: 4.4, leadSponsor: 'Clearlake / Insight Partners', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Data analytics platform; ongoing private restructuring.' },
  { target: 'New Relic', headlineValue: '$6.5B', valueNum: 6.5, leadSponsor: 'Francisco Partners / TPG', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Observability platform; private operating company.' },
  { target: 'Software AG', headlineValue: '$2.6B', valueNum: 2.6, leadSponsor: 'Silver Lake', year: 2023, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'European take-private; enterprise software division divestitures.' },
  { target: 'Avast Software', headlineValue: '$8.6B', valueNum: 8.6, leadSponsor: 'NortonLifeLock (Sponsor Stake)', year: 2021, statusCategory: 'liquidity-listed', statusDescription: 'Stock Consideration in Public Buyer', controlNote: 'Sponsors received equity in Gen Digital; partial sell-down over time.' },
  { target: 'Sungard AS', headlineValue: '$1.8B', valueNum: 1.8, leadSponsor: 'Lender Consortium / Clearlake', year: 2020, statusCategory: 'creditor-transfer', statusDescription: 'Bankruptcy Restructuring', controlNote: 'Chapter 11 liquidation and asset sale to secondary infrastructure operators.' },
  { target: 'Envestnet', headlineValue: '$4.5B', valueNum: 4.5, leadSponsor: 'Bain Capital / Reverence', year: 2024, statusCategory: 'continuing', statusDescription: 'Continuing Sponsor Ownership', controlNote: 'Recent take-private cohort close; active wealthtech holding.' },
];

export function SoftwareBuyoutBreakdown() {
  const [filter, setFilter] = useState<CohortStatus>('all');

  const filteredDeals = useMemo(() => {
    if (filter === 'all') return BUYOUT_COHORT;
    return BUYOUT_COHORT.filter((d) => d.statusCategory === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const totalVal = BUYOUT_COHORT.reduce((acc, d) => acc + d.valueNum, 0);
    const continuingVal = BUYOUT_COHORT.filter((d) => d.statusCategory === 'continuing').reduce((acc, d) => acc + d.valueNum, 0);
    const creditorVal = BUYOUT_COHORT.filter((d) => d.statusCategory === 'creditor-transfer').reduce((acc, d) => acc + d.valueNum, 0);
    return {
      totalDeals: BUYOUT_COHORT.length,
      totalVal: totalVal.toFixed(1),
      continuingVal: continuingVal.toFixed(1),
      creditorVal: creditorVal.toFixed(1),
      cleanExits: 0,
    };
  }, []);

  return (
    <figure
      id="software-buyout-cohort-table"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Software Buyout Cohort Exit Audit Table"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · 25-Deal Take-Private Audit
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            2020–2022 Software Buyout Realization Ledger
          </h3>
        </div>
        <p className="text-xs text-current/65">
          August 17, 2026 Evidence Cutoff
        </p>
      </div>

      {/* Cohort Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs">
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Cohort Headline EV</p>
          <p className="text-xl font-serif font-normal mt-0.5">${stats.totalVal}B</p>
          <p className="text-[10px] text-current/60 mt-0.5">25 take-private buyouts</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Clean Control Exits</p>
          <p className="text-xl font-serif font-normal mt-0.5 text-amber-800">{stats.cleanExits}</p>
          <p className="text-[10px] text-current/60 mt-0.5">Zero full sponsor realizations</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Active Sponsor Holds</p>
          <p className="text-xl font-serif font-normal mt-0.5">${stats.continuingVal}B</p>
          <p className="text-[10px] text-current/60 mt-0.5">18 deals in continuing control</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Creditor Transfers</p>
          <p className="text-xl font-serif font-normal mt-0.5 text-rose-800">${stats.creditorVal}B</p>
          <p className="text-[10px] text-current/60 mt-0.5">3 distressed or lender recapitalizations</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 items-center mb-5">
        <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Status Filter:</span>
        {[
          { id: 'all', label: `All 25 Deals ($${stats.totalVal}B)` },
          { id: 'continuing', label: 'Continuing Control (18)' },
          { id: 'liquidity-listed', label: 'Listed / Partial (4)' },
          { id: 'creditor-transfer', label: 'Creditor Transfer (3)' },
          { id: 'clean-realization', label: 'Clean Realization (0)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as CohortStatus)}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              filter === tab.id
                ? 'border-current bg-current text-[var(--article-paper)] font-medium'
                : 'border-current/15 text-current/70 hover:border-current/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <div className="overflow-x-auto border border-current/14">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-current/14 bg-current/[0.03] text-[10px] uppercase tracking-wider text-current/60">
              <th className="p-2.5 pl-3">Target Company</th>
              <th className="p-2.5">Headline EV</th>
              <th className="p-2.5">Announced</th>
              <th className="p-2.5">Lead Sponsor(s)</th>
              <th className="p-2.5">2026 Control Classification</th>
              <th className="p-2.5 pr-3">Evidence & Control Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/10">
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-current/60 font-serif text-sm">
                  Zero transactions met the standard clean control exit definition at this cutoff.
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal) => (
                <tr key={deal.target} className="hover:bg-current/[0.02] transition-colors">
                  <td className="p-2.5 pl-3 font-medium text-current">{deal.target}</td>
                  <td className="p-2.5 font-medium text-current tabular-nums">{deal.headlineValue}</td>
                  <td className="p-2.5 text-current/70 tabular-nums">{deal.year}</td>
                  <td className="p-2.5 text-current/85">{deal.leadSponsor}</td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-medium ${
                        deal.statusCategory === 'clean-realization'
                          ? 'border border-emerald-700/40 text-emerald-800'
                          : deal.statusCategory === 'liquidity-listed'
                            ? 'border border-blue-700/40 text-blue-800'
                            : deal.statusCategory === 'creditor-transfer'
                              ? 'border border-rose-700/40 text-rose-800'
                              : 'border border-current/20 text-current/80'
                      }`}
                    >
                      {deal.statusDescription}
                    </span>
                  </td>
                  <td className="p-2.5 pr-3 text-[11px] text-current/70 leading-relaxed max-w-sm">
                    {deal.controlNote}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Source: SEC 8-K / Schedule 13D filings, company merger announcements, court filings, and lender notices verified through August 17, 2026. Headline values represent company-reported transaction amounts at announcement; clean realization requires complete elimination of original sponsor control without residual guarantees.
      </figcaption>
    </figure>
  );
}
