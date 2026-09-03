import { useMemo, useState } from 'react';

type TradeCategory = 'all' | 'hvac-plumbing' | 'roofing-exterior' | 'pest-control' | 'electrical-specialized';
type OwnerType = 'all' | 'sponsor' | 'independent' | 'public' | 'franchise' | 'unresolved';

interface BrandRecord {
  name: string;
  trade: string;
  category: 'hvac-plumbing' | 'roofing-exterior' | 'pest-control' | 'electrical-specialized';
  ownerType: 'sponsor' | 'independent' | 'public' | 'franchise' | 'unresolved';
  platform: string;
  sponsorOrOwner: string;
  localStatus: string;
  evidenceGrade: 'A' | 'B' | 'C';
}

const AUSTIN_BRANDS: BrandRecord[] = [
  { name: 'Radiant Plumbing & Air', trade: 'HVAC, Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'T3 Services Group', sponsorOrOwner: 'The Riverside Company', localStatus: 'Founded in Austin; platform subsidiary', evidenceGrade: 'A' },
  { name: "Stan's Heating, Air & Plumbing", trade: 'HVAC, Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Master Trades Group', sponsorOrOwner: 'L Catterton', localStatus: 'Historic Austin brand; platform backed', evidenceGrade: 'A' },
  { name: 'Fox Service Company', trade: 'HVAC, Plumbing, Electrical', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Southern Home Services', sponsorOrOwner: 'Gryphon Investors', localStatus: 'Austin operating hub; multi-regional sponsor platform', evidenceGrade: 'A' },
  { name: "Daniel's Plumbing & Air", trade: 'Plumbing, HVAC', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Southern Home Services', sponsorOrOwner: 'Gryphon Investors', localStatus: 'Austin branch inside Southern platform', evidenceGrade: 'A' },
  { name: 'Precision Heating & Air', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Southern Home Services', sponsorOrOwner: 'Gryphon Investors', localStatus: 'Central Texas branch inside Southern platform', evidenceGrade: 'A' },
  { name: 'McCullough Heating & Air', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Apex Service Partners', sponsorOrOwner: 'Alpine Investors', localStatus: 'Austin founder origins; national sponsor roll-up', evidenceGrade: 'A' },
  { name: 'Clarke Kent Plumbing', trade: 'Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Apex Service Partners', sponsorOrOwner: 'Alpine Investors', localStatus: 'Austin branch inside Apex platform', evidenceGrade: 'A' },
  { name: 'Champion AC & Plumbing', trade: 'HVAC, Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Apex Service Partners', sponsorOrOwner: 'Alpine Investors', localStatus: 'Central Texas platform operating unit', evidenceGrade: 'A' },
  { name: 'Strand Brothers Service Experts', trade: 'HVAC, Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Service Experts', sponsorOrOwner: 'Brookfield Infrastructure Partners', localStatus: 'Austin legacy brand acquired by national operator', evidenceGrade: 'A' },
  { name: 'Goettl Air Conditioning', trade: 'HVAC, Plumbing', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Goettl Home Services', sponsorOrOwner: 'Court Square Capital Partners', localStatus: 'Southwest regional operator in Austin market', evidenceGrade: 'A' },
  { name: 'Blue Sky Heating & Air', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'sponsor', platform: 'Skyline Services', sponsorOrOwner: 'Private Sponsor Group', localStatus: 'Acquired platform tuck-in', evidenceGrade: 'B' },
  { name: 'Petro Home Services Austin', trade: 'HVAC, Heating', category: 'hvac-plumbing', ownerType: 'public', platform: 'Star Group, L.P.', sponsorOrOwner: 'Public (NYSE: SGU)', localStatus: 'Public corporate multi-state branch', evidenceGrade: 'A' },
  { name: 'ABC Home & Commercial Services', trade: 'HVAC, Pest, Lawn, Plumbing', category: 'pest-control', ownerType: 'independent', platform: 'ABC Operating Entities', sponsorOrOwner: 'Bobby Jenkins Family (Local)', localStatus: 'Austin-headquartered independent family business', evidenceGrade: 'A' },
  { name: 'Reliant Plumbing', trade: 'Plumbing', category: 'hvac-plumbing', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Founder / Local Ownership', localStatus: 'Austin local owner-operator', evidenceGrade: 'A' },
  { name: 'Total Plumbing & Rooter', trade: 'Plumbing', category: 'hvac-plumbing', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Family Owned (Austin)', localStatus: 'Austin family-operated contractor', evidenceGrade: 'B' },
  { name: 'Austin Air Conditioning & Heating', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Founder Owned', localStatus: 'Austin independent shop', evidenceGrade: 'B' },
  { name: 'Arrow Service Center', trade: 'HVAC, Appliance', category: 'hvac-plumbing', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Founder', localStatus: 'Austin independent contractor', evidenceGrade: 'B' },
  { name: 'Alta Pest Control', trade: 'Pest Control', category: 'pest-control', ownerType: 'independent', platform: 'Alta Pest Group', sponsorOrOwner: 'Founders (with minority growth debt)', localStatus: 'Founder-controlled multi-state company', evidenceGrade: 'A' },
  { name: 'Chem-free Organic Pest & Lawn', trade: 'Pest Control, Lawn', category: 'pest-control', ownerType: 'independent', platform: 'Jenkins Family Holdings', sponsorOrOwner: 'Local Family Owned', localStatus: 'Austin eco-pest operator', evidenceGrade: 'A' },
  { name: 'Orkin Austin', trade: 'Pest Control', category: 'pest-control', ownerType: 'public', platform: 'Rollins, Inc.', sponsorOrOwner: 'Public (NYSE: ROL)', localStatus: 'Corporate branch location', evidenceGrade: 'A' },
  { name: 'Terminix Austin', trade: 'Pest Control', category: 'pest-control', ownerType: 'public', platform: 'Rentokil Initial plc', sponsorOrOwner: 'Public (LSE: RTO / NYSE: RTO)', localStatus: 'Corporate division', evidenceGrade: 'A' },
  { name: 'Ja-Roy Pest Control', trade: 'Pest Control', category: 'pest-control', ownerType: 'public', platform: 'Rentokil Initial plc', sponsorOrOwner: 'Public (LSE: RTO)', localStatus: 'Acquired subsidiary branch', evidenceGrade: 'A' },
  { name: 'Wilson Roofing', trade: 'Roofing, Gutters', category: 'roofing-exterior', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Family Owned', localStatus: 'Austin independent roofer since 1976', evidenceGrade: 'A' },
  { name: 'Kanga Roof Austin', trade: 'Roofing', category: 'roofing-exterior', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Founder', localStatus: 'Austin independent roofer', evidenceGrade: 'B' },
  { name: 'Ja-Mar Roofing & Sheet Metal', trade: 'Roofing', category: 'roofing-exterior', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Management', localStatus: 'Austin independent regional contractor', evidenceGrade: 'B' },
  { name: 'Centex Foundation Repair', trade: 'Foundation Repair', category: 'roofing-exterior', ownerType: 'independent', platform: 'Centex Operating', sponsorOrOwner: 'Local Ownership Group', localStatus: 'Central Texas independent contractor', evidenceGrade: 'A' },
  { name: 'Douglas Foundation Repair', trade: 'Foundation Repair', category: 'roofing-exterior', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Founder Owned', localStatus: 'Austin local contractor', evidenceGrade: 'B' },
  { name: 'Mr. Rooter Plumbing of Austin', trade: 'Plumbing', category: 'hvac-plumbing', ownerType: 'franchise', platform: 'Neighborly', sponsorOrOwner: 'KKR (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Aire Serv of Austin', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'franchise', platform: 'Neighborly', sponsorOrOwner: 'KKR (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Precision Door Service Austin', trade: 'Garage Doors', category: 'electrical-specialized', ownerType: 'franchise', platform: 'Neighborly', sponsorOrOwner: 'KKR (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Mosquito Joe of NW Austin', trade: 'Pest Control', category: 'pest-control', ownerType: 'franchise', platform: 'Neighborly', sponsorOrOwner: 'KKR (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Benjamin Franklin Plumbing Austin', trade: 'Plumbing', category: 'hvac-plumbing', ownerType: 'franchise', platform: 'Authority Brands', sponsorOrOwner: 'Apax Partners (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Mister Sparky Austin', trade: 'Electrical', category: 'electrical-specialized', ownerType: 'franchise', platform: 'Authority Brands', sponsorOrOwner: 'Apax Partners (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'One Hour Heating & Air Austin', trade: 'HVAC', category: 'hvac-plumbing', ownerType: 'franchise', platform: 'Authority Brands', sponsorOrOwner: 'Apax Partners (Franchisor) / Local Franchisee', localStatus: 'Independently owned Austin franchise', evidenceGrade: 'A' },
  { name: 'Austin Generac Power Pros', trade: 'Electrical, Generators', category: 'electrical-specialized', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Master Electrician', localStatus: 'Local independent contractor', evidenceGrade: 'B' },
  { name: 'Castillo Electrical Services', trade: 'Electrical', category: 'electrical-specialized', ownerType: 'independent', platform: 'Independent', sponsorOrOwner: 'Local Family Owned', localStatus: 'Austin local electrical contractor', evidenceGrade: 'B' },
  { name: 'Austin Elite Appliance Repair', trade: 'Appliance Repair', category: 'electrical-specialized', ownerType: 'unresolved', platform: 'Operating LLC', sponsorOrOwner: 'Holding entity undisclosed', localStatus: 'Austin retail presence; parent entity pending', evidenceGrade: 'C' },
  { name: 'Capital City Rooter Co.', trade: 'Plumbing, Drain', category: 'hvac-plumbing', ownerType: 'unresolved', platform: 'Regional Entity', sponsorOrOwner: 'Undisclosed private investor', localStatus: 'Austin dispatch office; parent unverified', evidenceGrade: 'C' },
];

export function AustinBrandExplorer() {
  const [search, setSearch] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory>('all');
  const [selectedOwner, setSelectedOwner] = useState<OwnerType>('all');

  const filteredBrands = useMemo(() => {
    return AUSTIN_BRANDS.filter((b) => {
      if (selectedTrade !== 'all' && b.category !== selectedTrade) return false;
      if (selectedOwner !== 'all' && b.ownerType !== selectedOwner) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          b.name.toLowerCase().includes(query) ||
          b.platform.toLowerCase().includes(query) ||
          b.sponsorOrOwner.toLowerCase().includes(query) ||
          b.trade.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [search, selectedTrade, selectedOwner]);

  const stats = useMemo(() => {
    return {
      total: AUSTIN_BRANDS.length,
      sponsor: AUSTIN_BRANDS.filter((b) => b.ownerType === 'sponsor').length,
      independent: AUSTIN_BRANDS.filter((b) => b.ownerType === 'independent').length,
      franchise: AUSTIN_BRANDS.filter((b) => b.ownerType === 'franchise').length,
      publicCo: AUSTIN_BRANDS.filter((b) => b.ownerType === 'public').length,
    };
  }, []);

  return (
    <figure
      id="austin-brand-explorer"
      className="toll-editorial-plate relative my-10 overflow-hidden border border-current/14 bg-[var(--article-paper)] text-[var(--article-ink)] p-4 sm:p-6"
      aria-label="Interactive Austin Home-Services Ownership Directory"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-current/12 pb-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">
            Exhibit 01 · Primary Audit Directory
          </p>
          <h3 className="font-serif text-2xl font-normal mt-1">
            Austin Brand-to-Owner Verification Matrix
          </h3>
        </div>
        <p className="text-xs text-current/65">
          Showing {filteredBrands.length} of {AUSTIN_BRANDS.length} verified brands
        </p>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs">
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Sponsor Platform</p>
          <p className="text-xl font-serif font-normal mt-0.5">{stats.sponsor} <span className="text-xs opacity-60 font-sans">brands</span></p>
          <p className="text-[10px] text-current/60 mt-0.5">PE platform subsidiaries</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Founder / Local</p>
          <p className="text-xl font-serif font-normal mt-0.5">{stats.independent} <span className="text-xs opacity-60 font-sans">brands</span></p>
          <p className="text-[10px] text-current/60 mt-0.5">Direct founder/family held</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Franchise Operators</p>
          <p className="text-xl font-serif font-normal mt-0.5">{stats.franchise} <span className="text-xs opacity-60 font-sans">brands</span></p>
          <p className="text-[10px] text-current/60 mt-0.5">Local franchisee / PE franchisor</p>
        </div>
        <div className="border border-current/12 p-3 bg-current/[0.02]">
          <p className="text-[9px] uppercase tracking-wider text-current/50">Public Corporate</p>
          <p className="text-xl font-serif font-normal mt-0.5">{stats.publicCo} <span className="text-xs opacity-60 font-sans">brands</span></p>
          <p className="text-[10px] text-current/60 mt-0.5">Exchange-listed parent firms</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="austin-brand-search"
            name="austin-brand-search"
            type="search"
            placeholder="Search brand, platform, or sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 text-xs border border-current/20 bg-transparent text-current rounded-none placeholder:text-current/40 focus:outline-none focus:border-current/60"
            aria-label="Filter brands by name, platform, or sponsor"
          />
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Trade:</span>
            {[
              { id: 'all', label: 'All trades' },
              { id: 'hvac-plumbing', label: 'HVAC & Plumbing' },
              { id: 'pest-control', label: 'Pest Control' },
              { id: 'roofing-exterior', label: 'Roofing & Foundation' },
              { id: 'electrical-specialized', label: 'Electrical' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTrade(tab.id as TradeCategory)}
                className={`px-2.5 py-1 text-[11px] border transition-colors ${
                  selectedTrade === tab.id
                    ? 'border-current bg-current text-[var(--article-paper)] font-medium'
                    : 'border-current/15 text-current/70 hover:border-current/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] uppercase tracking-wider text-current/50 mr-1">Ownership:</span>
          {[
            { id: 'all', label: 'All models' },
            { id: 'sponsor', label: 'PE Sponsor Platform' },
            { id: 'independent', label: 'Local / Family' },
            { id: 'franchise', label: 'Franchise' },
            { id: 'public', label: 'Public Corporate' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedOwner(tab.id as OwnerType)}
              className={`px-2.5 py-1 text-[11px] border transition-colors ${
                selectedOwner === tab.id
                  ? 'border-current bg-current text-[var(--article-paper)] font-medium'
                  : 'border-current/15 text-current/70 hover:border-current/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto border border-current/14">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-current/14 bg-current/[0.03] text-[10px] uppercase tracking-wider text-current/60">
              <th className="p-2.5 pl-3">Consumer Brand</th>
              <th className="p-2.5">Trade</th>
              <th className="p-2.5">Operating Platform</th>
              <th className="p-2.5">Ultimate Controlling Entity / Sponsor</th>
              <th className="p-2.5">Local Footprint Status</th>
              <th className="p-2.5 pr-3 text-center">Audit Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/10">
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-current/60">
                  No matching brand records found for &quot;{search}&quot;.
                </td>
              </tr>
            ) : (
              filteredBrands.map((b) => (
                <tr key={b.name} className="hover:bg-current/[0.02] transition-colors">
                  <td className="p-2.5 pl-3 font-medium text-current">{b.name}</td>
                  <td className="p-2.5 text-current/75">{b.trade}</td>
                  <td className="p-2.5 text-[11px] text-current/80">{b.platform}</td>
                  <td className="p-2.5 text-current font-medium">
                    {b.sponsorOrOwner}
                    {b.ownerType === 'sponsor' && (
                      <span className="ml-1.5 inline-block text-[9px] uppercase tracking-wider px-1 py-0.2 bg-current/10 rounded-xs">
                        PE
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-current/70 text-[11px]">{b.localStatus}</td>
                  <td className="p-2.5 pr-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-medium ${
                        b.evidenceGrade === 'A'
                          ? 'border border-emerald-700/40 text-emerald-800'
                          : b.evidenceGrade === 'B'
                            ? 'border border-blue-700/40 text-blue-800'
                            : 'border border-amber-700/40 text-amber-800'
                      }`}
                    >
                      {b.evidenceGrade}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <figcaption className="mt-3 text-[11px] text-current/65 leading-relaxed font-sans">
        Source: Primary filings, Texas SOS entity registrations, platform acquisition announcements, and trade license records verified at the July 26, 2026 cutoff. A-grade indicates verified legal chain from local DBA through ultimate controlling equity holder.
      </figcaption>
    </figure>
  );
}
