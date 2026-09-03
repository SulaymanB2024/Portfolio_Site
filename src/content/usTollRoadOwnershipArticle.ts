import type { InvestmentMemo } from './articleModels';

export const US_TOLL_ROAD_OWNERSHIP_ARTICLE_SLUG = 'who-owns-us-toll-roads';
export const US_TOLL_ROAD_OWNERSHIP_ARTICLE_PATH = `/markets/${US_TOLL_ROAD_OWNERSHIP_ARTICLE_SLUG}`;
export const US_TOLL_ROAD_STATE_OVERVIEW_CSV_PATH = '/research/us-toll-road-state-overview-2026.csv';
export const US_TOLL_ROAD_PRIVATE_HYBRID_CSV_PATH = '/research/us-toll-road-private-hybrid-2026.csv';
export const US_TOLL_ROAD_SOURCE_LEDGER_CSV_PATH = '/research/us-toll-road-source-ledger-2026.csv';
export const US_TOLL_ROAD_METHODOLOGY_PATH = '/research/us-toll-road-ownership-methodology-2026.md';

export const US_TOLL_STATE_OVERVIEW = [
  {
    "jurisdiction": "Alabama",
    "code": "AL",
    "pattern": "Mixed",
    "note": "Public roads coexist with privately titled toll bridges operated through the American Roads portfolio."
  },
  {
    "jurisdiction": "Alaska",
    "code": "AK",
    "pattern": "Public",
    "note": "The state controls the tolled Anton Anderson Memorial Tunnel access system."
  },
  {
    "jurisdiction": "Arizona",
    "code": "AZ",
    "pattern": "No current material toll-road system",
    "note": "Proposed tolling and managed-lane concepts are outside the current operating universe."
  },
  {
    "jurisdiction": "Arkansas",
    "code": "AR",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "California",
    "code": "CA",
    "pattern": "Public",
    "note": "State and regional agencies control current toll bridges and express lanes; former private concessions such as SR 125 are now public."
  },
  {
    "jurisdiction": "Colorado",
    "code": "CO",
    "pattern": "Mixed",
    "note": "E-470 is a public authority; Northwest Parkway is under a long traffic-risk concession; US 36 uses a separate availability-payment structure."
  },
  {
    "jurisdiction": "Connecticut",
    "code": "CT",
    "pattern": "No current material toll-road system",
    "note": "Historic turnpike tolls are not current facilities."
  },
  {
    "jurisdiction": "Delaware",
    "code": "DE",
    "pattern": "Public",
    "note": "DelDOT and the Delaware River and Bay Authority control the principal tolled facilities."
  },
  {
    "jurisdiction": "District of Columbia",
    "code": "DC",
    "pattern": "No current material toll-road system",
    "note": "Parking and prospective congestion charges are outside this road-and-bridge universe."
  },
  {
    "jurisdiction": "Florida",
    "code": "FL",
    "pattern": "Public plus availability P3",
    "note": "Florida’s Turnpike Enterprise and regional public authorities receive toll revenue; I-595 and I-4 use availability-payment contracts."
  },
  {
    "jurisdiction": "Georgia",
    "code": "GA",
    "pattern": "Public",
    "note": "The State Road and Tollway Authority and GDOT control current tolled managed lanes."
  },
  {
    "jurisdiction": "Hawaii",
    "code": "HI",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Idaho",
    "code": "ID",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Illinois",
    "code": "IL",
    "pattern": "Mixed",
    "note": "Illinois Tollway is public; Chicago Skyway is leased through 2104; Houbolt Road Extension is privately financed and operated."
  },
  {
    "jurisdiction": "Indiana",
    "code": "IN",
    "pattern": "Mixed",
    "note": "The state retains the Indiana Toll Road asset while a private concessionaire holds long operating and toll rights; Cline Avenue Bridge is privately controlled; East End Crossing is an availability P3."
  },
  {
    "jurisdiction": "Iowa",
    "code": "IA",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Kansas",
    "code": "KS",
    "pattern": "Public",
    "note": "Kansas Turnpike Authority controls the turnpike system and its toll revenue."
  },
  {
    "jurisdiction": "Kentucky",
    "code": "KY",
    "pattern": "Public plus availability P3",
    "note": "Public bridge sponsors receive RiverLink toll revenue; the East End Crossing is maintained under a long P3."
  },
  {
    "jurisdiction": "Louisiana",
    "code": "LA",
    "pattern": "Public plus availability P3",
    "note": "Public bridge and highway sponsors dominate; Belle Chasse uses a long-term private delivery and maintenance structure."
  },
  {
    "jurisdiction": "Maine",
    "code": "ME",
    "pattern": "Public",
    "note": "Maine Turnpike Authority controls the turnpike system."
  },
  {
    "jurisdiction": "Maryland",
    "code": "MD",
    "pattern": "Public",
    "note": "Maryland Transportation Authority owns and operates the major toll roads, bridges, and tunnels."
  },
  {
    "jurisdiction": "Massachusetts",
    "code": "MA",
    "pattern": "Public",
    "note": "MassDOT controls the Massachusetts Turnpike and related tolling."
  },
  {
    "jurisdiction": "Michigan",
    "code": "MI",
    "pattern": "Mixed",
    "note": "Public international and regional crossings coexist with the privately owned Ambassador Bridge and private bridge structures in Bay City. Grosse Ile’s former private toll bridge became township-owned in 2025."
  },
  {
    "jurisdiction": "Minnesota",
    "code": "MN",
    "pattern": "Mixed",
    "note": "Public managed lanes coexist with the privately held Fort Frances–International Falls international bridge structure."
  },
  {
    "jurisdiction": "Mississippi",
    "code": "MS",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Missouri",
    "code": "MO",
    "pattern": "No current material toll-road system",
    "note": "The former Lake of the Ozarks Community Bridge toll is treated as historical, not current."
  },
  {
    "jurisdiction": "Montana",
    "code": "MT",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Nebraska",
    "code": "NE",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Nevada",
    "code": "NV",
    "pattern": "No current material toll-road system",
    "note": "Current high-occupancy or managed lanes without an operating toll were excluded."
  },
  {
    "jurisdiction": "New Hampshire",
    "code": "NH",
    "pattern": "Public",
    "note": "New Hampshire DOT controls the turnpike system."
  },
  {
    "jurisdiction": "New Jersey",
    "code": "NJ",
    "pattern": "Public plus availability P3",
    "note": "New Jersey Turnpike Authority and other public agencies dominate; Goethals Bridge has a private design-build-finance-maintain partner but Port Authority toll revenue remains public."
  },
  {
    "jurisdiction": "New Mexico",
    "code": "NM",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "New York",
    "code": "NY",
    "pattern": "Public plus availability P3",
    "note": "Public authorities control the principal toll roads, bridges, and tunnels; Goethals Bridge uses an availability-payment P3."
  },
  {
    "jurisdiction": "North Carolina",
    "code": "NC",
    "pattern": "Mixed",
    "note": "The North Carolina Turnpike Authority controls its toll roads; I-77 Express is a traffic-risk concession."
  },
  {
    "jurisdiction": "North Dakota",
    "code": "ND",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Ohio",
    "code": "OH",
    "pattern": "Mixed",
    "note": "Ohio Turnpike is public; several Ohio River private toll bridges create a mixed ownership pattern."
  },
  {
    "jurisdiction": "Oklahoma",
    "code": "OK",
    "pattern": "Public",
    "note": "Oklahoma Turnpike Authority controls the turnpike network and toll revenues."
  },
  {
    "jurisdiction": "Oregon",
    "code": "OR",
    "pattern": "Public",
    "note": "Public port, county, and transportation entities control the current tolled bridge facilities in the universe."
  },
  {
    "jurisdiction": "Pennsylvania",
    "code": "PA",
    "pattern": "Mixed",
    "note": "Pennsylvania Turnpike Commission controls the turnpike; Dingmans Ferry Bridge remains privately owned."
  },
  {
    "jurisdiction": "Rhode Island",
    "code": "RI",
    "pattern": "Public",
    "note": "Rhode Island Turnpike and Bridge Authority controls the principal tolled bridges."
  },
  {
    "jurisdiction": "South Carolina",
    "code": "SC",
    "pattern": "Nonprofit concession / mixed",
    "note": "Southern Connector is operated by a nonprofit concessionaire with project debt and toll-revenue rights rather than conventional shareholder equity."
  },
  {
    "jurisdiction": "South Dakota",
    "code": "SD",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Tennessee",
    "code": "TN",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Texas",
    "code": "TX",
    "pattern": "Mixed",
    "note": "State, regional mobility authorities, counties, and NTTA control many roads; long traffic-risk concessions and privately held international bridges create a separate private layer."
  },
  {
    "jurisdiction": "Utah",
    "code": "UT",
    "pattern": "Public",
    "note": "UDOT controls current tolled express-lane operations."
  },
  {
    "jurisdiction": "Vermont",
    "code": "VT",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Virginia",
    "code": "VA",
    "pattern": "Mixed",
    "note": "Public facilities coexist with the privately titled Dulles Greenway and several long traffic-risk concessions."
  },
  {
    "jurisdiction": "Washington",
    "code": "WA",
    "pattern": "Public",
    "note": "Washington State DOT and public bridge entities control the current tolled facilities."
  },
  {
    "jurisdiction": "West Virginia",
    "code": "WV",
    "pattern": "Mixed",
    "note": "West Virginia Parkways Authority is public; privately controlled Ohio River bridges form a separate group."
  },
  {
    "jurisdiction": "Wisconsin",
    "code": "WI",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  },
  {
    "jurisdiction": "Wyoming",
    "code": "WY",
    "pattern": "No current material toll-road system",
    "note": "No operating facility met the inclusion test."
  }
] as const;

export const US_TOLL_PRIVATE_HYBRID_ROWS = [
  {
    "facility": "American Roads Alabama portfolio",
    "states": "Alabama",
    "structure": "Private-title facilities",
    "public": "State and local permitting bodies; no single public toll owner",
    "private_role": "American Roads operates the included bridge companies; the disclosed ownership chain runs through DIF-managed infrastructure vehicles.",
    "term": "Private title; no general concession reversion",
    "confidence": "Strong",
    "primary_source": "https://americanroads.com/"
  },
  {
    "facility": "Northwest Parkway",
    "states": "Colorado",
    "structure": "Public-title traffic-risk concession",
    "public": "Northwest Parkway Public Highway Authority",
    "private_role": "Northwest Parkway LLC holds long operating and toll-revenue rights under the concession.",
    "term": "99-year concession, 2007–2106",
    "confidence": "Strong",
    "primary_source": "https://www.nwpky.com/"
  },
  {
    "facility": "US 36 Express Lanes P3",
    "states": "Colorado",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Colorado DOT and High Performance Transportation Enterprise",
    "private_role": "Plenary Roads Denver performs defined long-term operating and maintenance functions; public entities retain the core toll-policy and revenue role.",
    "term": "Long-term P3; public toll rights retained",
    "confidence": "Strong",
    "primary_source": "https://www.codot.gov/programs/high-performance-transportation-enterprise-hpte/projects/us-36-express-lanes"
  },
  {
    "facility": "I-595 Express",
    "states": "Florida",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Florida Department of Transportation",
    "private_role": "I-595 Express LLC financed, rebuilt, operates, and maintains the corridor; FDOT sets toll policy and retains toll revenue and traffic risk.",
    "term": "35-year DBFOM agreement",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/fl_i595.aspx"
  },
  {
    "facility": "I-4 Ultimate",
    "states": "Florida",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Florida Department of Transportation",
    "private_role": "I-4 Mobility Partners delivered and maintains the project under performance payments; the public side retains toll policy and express-lane revenue.",
    "term": "40-year DBFOM agreement",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/fl_i4.aspx"
  },
  {
    "facility": "Chicago Skyway",
    "states": "Illinois",
    "structure": "Public-title traffic-risk concession",
    "public": "City of Chicago",
    "private_role": "Skyway Concession Company operates and receives toll revenue; Atlas Arteria owns 66.67% and Ontario Teachers’ Pension Plan owns 33.33%.",
    "term": "99-year lease, 2005–2104",
    "confidence": "Confirmed",
    "primary_source": "https://www.chicago.gov/city/en/depts/fin/supp_info/public_private_partnerships/chicago_skyway.html"
  },
  {
    "facility": "Houbolt Road Extension toll bridge",
    "states": "Illinois",
    "structure": "Private-title or privately controlled facility",
    "public": "Public permitting and connecting-road agencies",
    "private_role": "United Bridge Partners’ project company controls the toll bridge and revenue stream.",
    "term": "Project/private title; no ordinary public-concession reversion identified",
    "confidence": "Strong",
    "primary_source": "https://unitedbridgepartners.com/portfolio/houbolt-road-extension/"
  },
  {
    "facility": "Indiana Toll Road",
    "states": "Indiana",
    "structure": "Public-title traffic-risk concession",
    "public": "Indiana Finance Authority / State of Indiana",
    "private_role": "ITR Concession Company operates and receives toll revenue; ownership is held through IFM-managed infrastructure investment vehicles.",
    "term": "75-year lease, 2006–2081",
    "confidence": "Strong",
    "primary_source": "https://www.in.gov/ifa/indiana-toll-road/"
  },
  {
    "facility": "Ohio River Bridges East End Crossing",
    "states": "Indiana / Kentucky",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Indiana Finance Authority and Kentucky public partners",
    "private_role": "WVB East End Partners designed, financed, built, operates, and maintains the crossing; RiverLink toll receipts remain public-system revenue.",
    "term": "Long-term availability-payment agreement",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/in_east_end_crossing.aspx"
  },
  {
    "facility": "Cline Avenue Bridge",
    "states": "Indiana",
    "structure": "Private-title or privately controlled facility",
    "public": "Public road agencies regulate connections",
    "private_role": "United Bridge Partners’ bridge company operates the crossing and receives toll revenue.",
    "term": "No fixed public reversion identified",
    "confidence": "Strong",
    "primary_source": "https://unitedbridgepartners.com/portfolio/cline-avenue-bridge/"
  },
  {
    "facility": "Belle Chasse Bridge and Tunnel replacement P3",
    "states": "Louisiana",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Louisiana Department of Transportation and Development",
    "private_role": "A private project company financed and delivered the replacement crossing and performs long-term maintenance; the public side retains the underlying asset role.",
    "term": "Long-term agreement; public title retained",
    "confidence": "Strong",
    "primary_source": "https://www.transportation.gov/buildamerica/projects/belle-chasse-bridge-tunnel-replacement"
  },
  {
    "facility": "Ambassador Bridge",
    "states": "Michigan / Ontario",
    "structure": "Private-title facility",
    "public": "United States and Canadian border regulators",
    "private_role": "Detroit International Bridge Company and Canadian Transit Company form the private operating structure associated with the Moroun family.",
    "term": "Private title; no scheduled public reversion",
    "confidence": "Strong",
    "primary_source": "https://www.ambassadorbridge.com/"
  },
  {
    "facility": "Bay City Liberty and Independence bridges",
    "states": "Michigan",
    "structure": "Long private bridge agreement",
    "public": "City of Bay City retains defined public rights",
    "private_role": "United Bridge Partners controls rehabilitation, operation, and toll economics through the governing bridge agreement.",
    "term": "Long-term agreement; handback governed by city contract",
    "confidence": "Strong",
    "primary_source": "https://www.baycitybridgepartners.com/"
  },
  {
    "facility": "Fort Frances–International Falls Bridge",
    "states": "Minnesota / Ontario",
    "structure": "Private-title facility",
    "public": "United States and Canadian border regulators",
    "private_role": "Aazhogan Limited Partnership acquired the bridge interests in 2022 and operates the crossing.",
    "term": "Private ownership; no ordinary concession expiry identified",
    "confidence": "Strong",
    "primary_source": "https://fortfrancesbridge.com/"
  },
  {
    "facility": "I-77 Express Lanes",
    "states": "North Carolina",
    "structure": "Public-title traffic-risk concession",
    "public": "North Carolina Department of Transportation",
    "private_role": "I-77 Mobility Partners operates the express lanes and receives toll revenue; Ferrovial/Cintra is the controlling disclosed sponsor.",
    "term": "50-year concession scheduled into the late 2060s",
    "confidence": "Strong",
    "primary_source": "https://www.ncdot.gov/projects/i-77-express-lanes/Pages/default.aspx"
  },
  {
    "facility": "Newell Toll Bridge",
    "states": "Ohio / West Virginia",
    "structure": "Private-title facility",
    "public": "State and federal bridge regulators",
    "private_role": "United Bridge Partners’ project company owns or controls the bridge and toll revenue.",
    "term": "Private title; no scheduled public reversion identified",
    "confidence": "Strong",
    "primary_source": "https://unitedbridgepartners.com/portfolio/newell-toll-bridge/"
  },
  {
    "facility": "Parkersburg Memorial Bridge",
    "states": "Ohio / West Virginia",
    "structure": "Private-title or privately controlled facility",
    "public": "Local and state public parties retain defined regulatory rights",
    "private_role": "United Bridge Partners acquired the operating bridge company and toll economics.",
    "term": "Private/current project ownership",
    "confidence": "Strong",
    "primary_source": "https://unitedbridgepartners.com/portfolio/parkersburg-memorial-bridge/"
  },
  {
    "facility": "Dingmans Ferry Bridge",
    "states": "Pennsylvania / New Jersey",
    "structure": "Private-title facility",
    "public": "Federal and state regulators",
    "private_role": "Dingmans Choice and Delaware Bridge Company owns and operates the crossing; the complete shareholder chain is not publicly disclosed.",
    "term": "Private title; no scheduled public reversion",
    "confidence": "Probable",
    "primary_source": "https://dingmansbridge.com/"
  },
  {
    "facility": "Southern Connector",
    "states": "South Carolina",
    "structure": "Nonprofit/distressed concession",
    "public": "South Carolina Department of Transportation",
    "private_role": "Connector 2000 Association, a nonprofit project entity, operates the road and applies toll revenue under bond and concession documents; there is no conventional shareholder distribution layer.",
    "term": "Concession and handback governed by project documents",
    "confidence": "Strong",
    "primary_source": "https://www.southernconnector.com/"
  },
  {
    "facility": "SH 130 Segments 5 and 6",
    "states": "Texas",
    "structure": "Public-title traffic-risk concession",
    "public": "Texas Department of Transportation",
    "private_role": "SH 130 Concession Company operates and receives toll revenue. The project company emerged from bankruptcy; the complete current upstream ownership chain remains unresolved.",
    "term": "50-year concession; scheduled through 2062",
    "confidence": "Unresolved",
    "primary_source": "https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html"
  },
  {
    "facility": "North Tarrant Express Segments 1 and 2",
    "states": "Texas",
    "structure": "Public-title traffic-risk concession",
    "public": "Texas Department of Transportation",
    "private_role": "NTE Mobility Partners operates the managed lanes and receives toll revenue; Ferrovial/Cintra leads the disclosed consortium with institutional co-investors.",
    "term": "Comprehensive development agreement through 2061",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant.aspx"
  },
  {
    "facility": "North Tarrant Express 35W",
    "states": "Texas",
    "structure": "Public-title traffic-risk concession",
    "public": "Texas Department of Transportation",
    "private_role": "A related NTE project company operates and receives toll revenue under a separate agreement; Ferrovial/Cintra leads the private consortium.",
    "term": "Comprehensive development agreement through 2061",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant_3a3b.aspx"
  },
  {
    "facility": "LBJ Express",
    "states": "Texas",
    "structure": "Public-title traffic-risk concession",
    "public": "Texas Department of Transportation",
    "private_role": "LBJ Infrastructure Group operates the managed lanes and receives toll revenue; Ferrovial/Cintra and institutional partners own the concession company.",
    "term": "Comprehensive development agreement through 2061",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_lbj_express.aspx"
  },
  {
    "facility": "Progreso International Bridge",
    "states": "Texas / Mexico",
    "structure": "Private-title or franchise facility",
    "public": "United States and Mexican border regulators",
    "private_role": "A private bridge company owns or controls the United States facility and toll revenue; the full current shareholder chain remains unresolved.",
    "term": "Private title or franchise structure",
    "confidence": "Unresolved",
    "primary_source": "https://progresointernationalbridge.com/"
  },
  {
    "facility": "Brownsville & Matamoros Bridge",
    "states": "Texas / Mexico",
    "structure": "Private or joint corporate bridge structure",
    "public": "United States and Mexican border regulators",
    "private_role": "Brownsville & Matamoros Bridge Company operates the crossing; the complete current shareholder chain is not sufficiently clear in public records.",
    "term": "Corporate bridge ownership; franchise terms require further primary documentation",
    "confidence": "Unresolved",
    "primary_source": "https://www.bmbridge.com/"
  },
  {
    "facility": "Dulles Greenway",
    "states": "Virginia",
    "structure": "Private-title facility",
    "public": "Virginia State Corporation Commission regulates tolls; state agencies regulate connections",
    "private_role": "Toll Road Investors Partnership II owns and operates the road; Atlas Arteria controls the disclosed equity chain.",
    "term": "Private title under Virginia law; no conventional concession reversion",
    "confidence": "Confirmed",
    "primary_source": "https://www.atlasarteria.com/portfolio/dulles-greenway/"
  },
  {
    "facility": "Pocahontas Parkway",
    "states": "Virginia",
    "structure": "Public-title traffic-risk concession",
    "public": "Virginia Department of Transportation",
    "private_role": "A private project company operates and receives toll revenue; Globalvia is the current disclosed ultimate infrastructure owner after restructuring.",
    "term": "99-year agreement, 2006–2105",
    "confidence": "Strong",
    "primary_source": "https://www.vdot.virginia.gov/projects/richmond-district/pocahontas-parkway/"
  },
  {
    "facility": "Elizabeth River Crossings",
    "states": "Virginia",
    "structure": "Public-title traffic-risk concession",
    "public": "Virginia Department of Transportation",
    "private_role": "Elizabeth River Crossings operates the tunnel system and receives toll revenue; Abertis controls the current concessionaire.",
    "term": "58-year agreement beginning in 2012; scheduled into 2070",
    "confidence": "Strong",
    "primary_source": "https://www.vdot.virginia.gov/projects/hampton-roads-district/elizabeth-river-tunnels/"
  },
  {
    "facility": "495 Express Lanes",
    "states": "Virginia",
    "structure": "Public-title traffic-risk concession",
    "public": "Virginia Department of Transportation",
    "private_role": "Transurban’s project company operates the lanes and receives toll revenue under the comprehensive agreement.",
    "term": "Long concession scheduled into the 2080s",
    "confidence": "Strong",
    "primary_source": "https://www.vdot.virginia.gov/projects/northern-virginia-district/495-express-lanes/"
  },
  {
    "facility": "95 / 395 Express Lanes",
    "states": "Virginia",
    "structure": "Public-title traffic-risk concession",
    "public": "Virginia Department of Transportation",
    "private_role": "Transurban-controlled project companies operate the lanes and receive toll revenue; later extensions retain contract-specific terms.",
    "term": "Long concession scheduled into the 2080s",
    "confidence": "Strong",
    "primary_source": "https://www.vdot.virginia.gov/projects/northern-virginia-district/95-express-lanes/"
  },
  {
    "facility": "I-66 Express Lanes Outside the Beltway",
    "states": "Virginia",
    "structure": "Public-title traffic-risk concession",
    "public": "Virginia Department of Transportation",
    "private_role": "I-66 Express Mobility Partners operates the lanes and receives toll revenue; Ferrovial/Cintra leads the consortium with institutional partners.",
    "term": "50-year concession",
    "confidence": "Confirmed",
    "primary_source": "https://www.vdot.virginia.gov/projects/northern-virginia-district/transform-66-outside-the-beltway/"
  },
  {
    "facility": "South Norfolk Jordan Bridge",
    "states": "Virginia",
    "structure": "Private-title or privately controlled facility",
    "public": "State and local transportation regulators",
    "private_role": "United Bridge Partners’ project company operates the bridge and claims toll revenue.",
    "term": "Project/private title; no standard public-concession expiry identified",
    "confidence": "Strong",
    "primary_source": "https://unitedbridgepartners.com/portfolio/south-norfolk-jordan-bridge/"
  },
  {
    "facility": "Goethals Bridge",
    "states": "New York / New Jersey",
    "structure": "Public-title availability-payment/O&M P3",
    "public": "Port Authority of New York and New Jersey",
    "private_role": "NYNJ Link designed, financed, built, and maintains the replacement bridge under performance payments; the Port Authority owns the crossing and keeps toll revenue.",
    "term": "40-year P3 framework",
    "confidence": "Confirmed",
    "primary_source": "https://www.fhwa.dot.gov/ipd/project_profiles/ny_goethals_bridge.aspx"
  }
] as const;

export const US_TOLL_ROAD_METHODOLOGY_MARKDOWN = "# U.S. Toll-Road Ownership Methodology and Data Dictionary\n\n**Article:** Who Owns America’s Toll Roads? Public Agencies, Private Concessions, and the Companies Behind Them  \n**Canonical path:** `https://sulayman-bowles.dev/markets/who-owns-us-toll-roads`  \n**Evidence cutoff:** September 2, 2026  \n**Dataset edition:** Web publication v1.0\n\n## What this release contains\n\nThe public web edition contains:\n\n- 51 state and District of Columbia overview records.\n- 33 material private-title, traffic-risk, availability-payment, long-term O&M, and nonprofit-concession records.\n- A source ledger built from current government, authority, concessionaire, operator, and infrastructure-owner pages.\n- A dated correction protocol.\n\nIt is a material-system ownership reference. It is not represented as a complete facility-level census of every toll plaza, short local bridge, individual managed-lane segment, billing subcontract, debt series, or minority fund investor in the United States.\n\n## Inclusion rule\n\nInclude current toll roads, tolled bridges, tolled tunnels, and recurring publicly accessible priced managed lanes that materially answer who holds title, long-term control, toll revenue, equity, debt, or reversion rights.\n\nA private or hybrid record is material when at least one of these tests is met:\n\n1. A private entity holds physical or legal title.\n2. A concessionaire or lessee has a multi-decade operating or toll-revenue right.\n3. A private project company performs a long design-build-finance-operate-maintain or availability-payment scope on a tolled facility.\n4. A nonprofit project entity holds a concession and toll-revenue rights.\n5. The ownership structure is a recurring subject of public ownership claims or materially changes the state-level classification.\n\n## Exclusions\n\nExclude parking, ferries, event tolls, ordinary city cordon charges, planned or unopened facilities, inactive toll facilities, HOV-only lanes without a toll, private roads closed to general traffic, and short service contracts that do not change title, long-term control, or toll economics.\n\n## Grouping rule\n\nPublic facilities can share one row when the legal titleholder, public sponsor, operator, revenue claimant, and financing or pledge structure are materially the same. A private concession, privately titled facility, cross-jurisdiction crossing, nonprofit concession, availability-payment project, or facility with a distinct revenue pledge should remain separate.\n\n## Ownership classifications\n\n- **Public:** Public title, statutory control, and toll-revenue claim remain with a government, authority, county, city, or public corporation. Outsourced construction, maintenance, or billing does not change this category.\n- **Mixed:** A jurisdiction has both material public facilities and at least one current private-title, traffic-risk, nonprofit, or comparable private-revenue structure.\n- **Public plus availability P3:** Public title and toll economics remain public, while a private project company performs a long delivery, operating, or maintenance scope and receives availability or performance payments.\n- **Private-title facility:** A private corporation holds the physical facility or the controlling property/franchise interest, subject to public regulation.\n- **Public-title traffic-risk concession:** Government retains the underlying asset while a project company receives time-limited operating and toll-revenue rights and bears traffic risk.\n- **Nonprofit/distressed concession:** A nonprofit project entity receives toll revenue under concession and bond documents, without conventional shareholder equity.\n- **No current material toll-road system:** No current operating facility met this release’s inclusion test.\n\n## Ownership stack\n\nFor every material structure, keep these questions separate:\n\n1. Who holds physical or legal title?\n2. Which public body sponsors or regulates the facility?\n3. Who operates the road day to day?\n4. Who maintains it?\n5. Who processes tags, invoices, and violations?\n6. Which project company holds the lease or concession?\n7. Who owns that company?\n8. Which entity is legally entitled to toll revenue?\n9. Which lenders or bond issuers hold senior claims?\n10. What public revenue-sharing obligations apply?\n11. When does the contract expire?\n12. Who receives the asset or operating rights at handback?\n\n## Confidence scale\n\n- **Confirmed:** A current primary public record or first-party corporate record resolves the core title, sponsor, operator or concessionaire, revenue claimant, and term with no material conflict.\n- **Strong:** The core structure is resolved, but a non-core detail such as a minority stake, billing vendor, maintenance subcontractor, or amendment-level date remains incomplete.\n- **Probable:** Official or first-party evidence supports the classification, but a controlling title or upstream ownership link is incomplete.\n- **Unresolved:** A material current ownership or shareholder link cannot be responsibly completed from public records.\n\n## Data dictionary\n\n| Field | Definition |\n| --- | --- |\n| `jurisdiction` | State or District of Columbia represented in the overview. |\n| `code` | Two-letter postal code used for map joins. |\n| `pattern` | Dominant current ownership category for the material-system reference. |\n| `note` | Main public system or material private/hybrid exception. |\n| `facility` | Facility, grouped bridge portfolio, managed-lane project, or toll system. |\n| `states` | State, states, or international jurisdictions served. |\n| `structure` | Private-title, public-title traffic-risk, availability-payment/O&M, nonprofit/distressed, or comparable classification. |\n| `public` | Government, authority, or regulator retaining title, sponsorship, or defined public rights. |\n| `private_role` | What the private or nonprofit entity actually controls, operates, maintains, finances, or receives. |\n| `term` | Contract duration, expiry, reversion, or absence of a standard public handback. |\n| `confidence` | Confirmed, Strong, Probable, or Unresolved based on the current evidence chain. |\n| `primary_source` | Principal official or first-party source used for the web-edition row. |\n\n## Interpretation limits\n\nDo not use this release to calculate one national percentage of toll roads that are privately owned without first defining the denominator. Counts by branded system, individual facility, centerline mile, lane-mile, traffic, toll revenue, or asset value answer different questions.\n\nA billing provider is not automatically the owner. A maintenance contractor is not automatically the concessionaire. A lender is not automatically an equity owner. A foreign pension institution holding a minority interest in a concession company is not the same as foreign title to a public road.\n\n## Correction protocol\n\nA correction request should identify the facility, disputed field, proposed replacement, and a dated primary source such as a government record, concession amendment, audited filing, transaction notice, or current owner disclosure.\n\nA change to titleholder, concessionaire, ultimate owner, toll-revenue claimant, contract term, or state category should trigger a dated article and dataset revision. Missing links remain Strong, Probable, or Unresolved until the controlling evidence is available.\n" as const;

export const US_TOLL_ROAD_OWNERSHIP_ARTICLE = {
  kind: 'investment-memo',
  slug: US_TOLL_ROAD_OWNERSHIP_ARTICLE_SLUG,
  number: '03',
  category: 'INFRASTRUCTURE OWNERSHIP',
  title: "Who Owns America’s Toll Roads? Public Agencies, Private Concessions, and the Companies Behind Them",
  seoTitle: "Who Owns America’s Toll Roads? 50-State Guide",
  subtitle: "A state-by-state ownership map separating public title, private concessions, operators, billing agencies, debt, equity, toll revenue, and reversion rights.",
  seoDescription: "A 50-state guide to who owns, operates, finances, and receives revenue from U.S. toll roads, including private concessions, P3s, debt, and reversion rights.",
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Ownership stack / national reference',
    note: 'Public title, contractual control, toll revenue, financing, and reversion shown as separate claims.',
  },
  date: '2026.09.02',
  dateModified: '2026.09.02',
  readTime: '28 MIN',
  author: 'SULAYMAN BOWLES',
  thesis: "Most material U.S. toll systems are publicly titled and send toll revenue to a public authority, transportation department, county, city, or public corporation. A smaller but consequential group is privately titled or controlled through long concessions. The legal owner of the pavement, the operator, the billing agency, the toll-revenue claimant, the project-company shareholders, the lenders, and the future reversion beneficiary can all be different entities.",
  conclusion: {
    title: 'The contract owns the economics',
    content: "Most U.S. toll systems remain publicly titled, but contracts can move operations, toll revenue, financing risk, and residual equity to private or nonprofit vehicles for decades. A reliable ownership answer names the right being discussed, the entity holding it, and the date on which that answer was verified.",
  },
  conviction: 'SOURCE-LED',
  horizon: '2026 OWNERSHIP MAP',
  allocation: 'EDUCATIONAL RESEARCH',
  risks: "Ownership chains and contract terms can change through sales, amendments, refinancings, bankruptcy, government buyouts, and toll removal. State categories describe material structures, not every lane, plaza, vendor, or shareholder.",
  formula: "ownership stack = legal title + control rights + revenue claim + equity + debt + reversion",
  formulaLabel: 'Toll-Road Ownership Stack',
  valuationFrame: 'Legal title, contract term, toll-revenue entitlement, debt priority, equity ownership, public sharing, and handback rights.',
  recommendationBoundary: "Public-record infrastructure research, not legal, investment, municipal-bond, tax, procurement, or toll-policy advice. The release is a dated material-system reference and does not claim an exhaustive census of every U.S. toll facility.",
  metrics: [
    { label: 'Jurisdictions', value: String(US_TOLL_STATE_OVERVIEW.length) },
    { label: 'Private / hybrid records', value: String(US_TOLL_PRIVATE_HYBRID_ROWS.length) },
    { label: 'Ownership layers', value: '08' },
    { label: 'Evidence cutoff', value: 'SEP 2, 2026' },
  ],
  content: [
  "Most material U.S. toll systems are publicly titled and send toll revenue to a public authority, transportation department, county, city, or public corporation. A smaller but consequential group is privately titled or controlled through long concessions. The legal owner of the pavement, the operator, the billing agency, the toll-revenue claimant, the project-company shareholders, the lenders, and the future reversion beneficiary can all be different entities.",
  "Chicago Skyway shows why one-word answers fail. The City of Chicago retained the public asset while Skyway Concession Company received a 99-year lease beginning in 2005. The concessionaire operates the road and receives toll revenue under the agreement; Atlas Arteria and Ontario Teachers’ Pension Plan own the concession company; project lenders finance it; and the operating rights are scheduled to return at the end of the lease in 2104.",
  "This article is a dated material-system reference, not a claim that every toll plaza, short bridge, managed-lane segment, or local billing contract in the United States has been exhaustively inventoried. It covers all 50 states and the District of Columbia, then separately identifies 33 material private-title, traffic-risk, availability-payment, or nonprofit structures that materially change who controls the facility or receives its economics.",
  "The classification is intentionally conservative. Hiring a private construction company, maintenance contractor, or payment processor does not make a public toll road privately owned. A state moves into a mixed or hybrid category only when a current facility has private title, a long contractual control right, a private claim on toll revenue, a nonprofit concession, or an availability-payment project that materially changes long-term operation and maintenance."
],
  sections: [
    {
      id: "state-by-state-lookup",
      title: "State-by-state toll-road ownership lookup",
      paragraphs: [
  "The table gives the dominant current ownership pattern for each jurisdiction. It does not count every lane, gantry, or bridge. “Mixed” means at least one material private-title, traffic-risk, nonprofit, or comparable private-revenue structure exists alongside public facilities. “Public plus availability P3” means the public side keeps title and toll economics while a private project company performs a long design, finance, construction, operating, or maintenance scope.",
  "States shown as having no current material toll-road system can still have toll proposals, historic turnpikes, non-tolled HOV lanes, parking charges, ferries, or isolated private-access roads. Those sit outside this road-and-bridge universe."
],
      table: {
        caption: 'Current state and District of Columbia ownership pattern',
        columns: ['Jurisdiction', 'Current pattern', 'Main public system or private exception'],
        rows: US_TOLL_STATE_OVERVIEW.map((row) => [row.jurisdiction, row.pattern, row.note]),
      },
    },
    {
      id: "ownership-stack",
      title: "How toll-road ownership actually works",
      paragraphs: [
  "A toll-road brand can conceal eight separate legal and economic layers. Legal title identifies the government, authority, or private corporation that owns the physical facility. The public sponsor may retain police power, safety oversight, toll-setting approval, performance remedies, and the right to receive the road back. A concessionaire or lessee holds a contract-defined package of operating, maintenance, financing, and sometimes toll-revenue rights.",
  "The day-to-day operator can be the concessionaire, an affiliate, or a third-party contractor. A separate billing provider may run tags, invoices, customer service, violation processing, and interoperability. That provider can appear on the driver’s statement without owning the facility or keeping the underlying toll proceeds.",
  "Equity owners sit above the project company. They can be listed toll-road companies, infrastructure funds, pension plans, sovereign-linked investors, family shareholders, or nonprofit entities. Their interests can change through a sale or restructuring while the public concession remains in force. Debt sits beside equity rather than beneath the word “owner”: bondholders and lenders may have revenue liens, covenants, reserves, and step-in remedies, but they do not normally hold title to the asphalt.",
  "The legally entitled revenue claimant receives toll proceeds before the contractual waterfall applies. Revenue can first fund collection, operations, maintenance, debt service, reserves, required capital work, taxes, and public revenue sharing. Equity receives only the residual allowed by the agreement and financing documents. At expiry, a public-title concession normally reverts under handback standards; a privately titled bridge may have no scheduled public reversion."
],
      bullets: [
  "Legal titleholder: owns the physical facility or underlying real-property interest.",
  "Public sponsor: exercises statutory authority, oversight, approval, and reversion rights.",
  "Concessionaire or lessee: holds contract-defined control for a fixed term.",
  "Operator and maintenance contractor: performs road operations and asset upkeep.",
  "Billing provider: processes tags, invoices, customer service, or enforcement.",
  "Equity owners and ultimate parent: own the project company, not necessarily the road.",
  "Debt issuer and lenders: finance the system and hold pledged-revenue protections.",
  "Revenue claimant and reversion beneficiary: receives the current economics and the future handback."
],
    },
    {
      id: "private-and-hybrid-structures",
      title: "The material private and hybrid structures",
      paragraphs: [
  "The table separates four forms of private involvement. A private-title facility is closest to ordinary corporate ownership, although public regulation still applies. A public-title traffic-risk concession gives a project company long operating and toll-revenue rights while the government retains the underlying asset. An availability-payment or long-term O&M P3 pays a private company for availability and performance while the public agency keeps toll revenue or traffic risk. A nonprofit or distressed concession directs revenue through a project and bond structure without conventional shareholder equity.",
  "Putting these structures in one list is useful only when the distinctions remain visible. The private participant’s exact role, term, and revenue entitlement matter more than the presence of a familiar infrastructure-company name."
],
      table: {
        caption: 'Material private-title, traffic-risk, availability-payment, and nonprofit structures',
        columns: ['Facility', 'State(s)', 'Structure', 'Public title or sponsor', 'Private role and current chain', 'Term or reversion'],
        rows: US_TOLL_PRIVATE_HYBRID_ROWS.map((row) => [
          row.facility,
          row.states,
          row.structure,
          row.public,
          row.private_role,
          row.term,
        ]),
      },
    },
    {
      id: "ultimate-owners",
      title: "Who ultimately owns the concessionaires",
      paragraphs: [
  "The name on a toll-road sign is often a special-purpose project company. Chicago Skyway’s project company sits beneath Atlas Arteria, an Australian-listed toll-road investor, and Ontario Teachers’ Pension Plan, a Canadian pension institution. The City of Chicago remains the public titleholder and future reversion beneficiary.",
  "The Indiana Toll Road concession company is held through investment vehicles managed by IFM Investors. IFM is owned by Australian pension funds, but that fact describes an investment chain above the concessionaire, not a transfer of the State of Indiana’s physical road title.",
  "Ferrovial’s Cintra platform leads project companies on I-77 in North Carolina, several North Texas managed-lane concessions, and I-66 in Virginia. The minority investors, lenders, public sponsors, revenue-sharing formulas, and expiry dates differ by project. Treating every Cintra-linked road as one ownership stack would erase those differences.",
  "Transurban controls project companies for Virginia’s 495 and 95/395 express lanes. Abertis controls Elizabeth River Crossings. Globalvia controls the restructured Pocahontas Parkway concession. United Bridge Partners uses individual bridge companies across several privately titled or long-controlled crossings. The highest supportable parent is not always the final fund investor, and the table stops where public disclosure stops.",
  "“Foreign-owned toll road” is therefore an imprecise category. It can describe a foreign company holding title to a private bridge, a foreign investor owning the concessionaire on a publicly titled road, a pension institution holding a minority project-company stake, or a lender financing the asset. Those positions carry different rights and risks."
],
    },
    {
      id: "five-structures-in-practice",
      title: "Five ownership structures in practice",
      paragraphs: [
  "Chicago Skyway is a public-title, private-economics lease. Chicago received an upfront payment and retained the asset. Skyway Concession Company took over operations, maintenance, and toll-revenue rights for 99 years. The concession company later changed hands without another sale of the road. The lesson is that equity can trade while public title and the 2104 reversion stay fixed.",
  "Dulles Greenway is closer to conventional private ownership. Toll Road Investors Partnership II owns and operates the road under Virginia’s private-highway framework, while the Virginia State Corporation Commission regulates toll applications and state agencies regulate connections. There is no ordinary concession expiry returning the road to VDOT.",
  "Southern Connector is a nonprofit concession. Connector 2000 Association has no conventional private-equity shareholder waiting for dividends. Toll revenue supports operations, maintenance, reserves, and project debt under the concession and bond documents. Calling it simply private would misstate where the cash can go.",
  "I-595 Express is private delivery without private toll-revenue risk. The project company financed, reconstructed, operates, and maintains the corridor under an availability-payment agreement. Florida DOT keeps express-lane toll revenue and traffic risk. A privately maintained road is not automatically a private toll-revenue concession.",
  "Pocahontas Parkway shows what bankruptcy changes and what it does not. Traffic and revenue disappointed, the original financing failed, and the equity chain changed through distress. The concession now runs to Globalvia, while VDOT’s public role and the eventual reversion remain governed by the original agreement and its amendments."
],
    },
    {
      id: "why-governments-use-concessions",
      title: "Why governments use concessions",
      paragraphs: [
  "A concession can exchange future control or revenue rights for an upfront payment, faster construction, private financing, or a long service commitment. Chicago received approximately $1.83 billion from the Skyway lease in 2005. Indiana received approximately $3.8 billion from the Indiana Toll Road lease in 2006. Those transactions accelerated cash to the public side while transferring decades of operating and toll rights.",
  "Traffic-risk concessions can move construction, completion, traffic, revenue, and lifecycle risks to a project company and its investors. That transfer is real only to the extent the contract places the risk on the private side and the project remains solvent. SH 130 and Pocahontas Parkway show that forecast risk can eliminate original equity and force a debt restructuring.",
  "Availability-payment contracts solve a different problem. The public agency keeps demand and toll-revenue risk but pays the project company for making the road available and meeting performance standards. The model can connect design decisions to decades of maintenance, but it creates a long public payment commitment rather than a private claim on toll upside.",
  "Long terms protect capital recovery and can also constrain future governments. Toll formulas, competing-facility clauses, compensation events, refinancing rules, public revenue sharing, termination payments, and handback standards often matter more than the public-private label."
],
    },
    {
      id: "sales-restructurings-and-returns",
      title: "What changes when a road is sold, restructured, or returned",
      paragraphs: [
  "Four different events are often described as a toll-road sale. A government can lease a public asset while keeping title. Investors can sell the concession company while the government contract stays in place. Creditors can take control after bankruptcy, replacing the original equity without taking public title. A government can buy out the private rights, acquire a privately titled facility, or let toll collection end.",
  "Chicago and Indiana are long public-asset leases. Chicago Skyway’s current owners were not the original 2005 consortium. Indiana Toll Road’s concession survived a restructuring and ownership change. SH 130 and Pocahontas Parkway also show creditors and new investors replacing original sponsors while the public agreements continue.",
  "California’s SR 125 became publicly controlled after SANDAG acquired the former private concession. Grosse Ile Township acquired its toll bridge effective April 1, 2025. Missouri’s Lake of the Ozarks Community Bridge left the current toll universe after toll collection ended. Older ownership lists can remain online long after the economics have changed.",
  "An as-of date is therefore part of the answer. A facility name can remain unchanged while the project company, ultimate owner, debt, toll status, or public reversion rights change."
],
    },
    {
      id: "method-boundaries-and-corrections",
      title: "Method, boundaries, and correction protocol",
      paragraphs: [
  "The research began with the latest usable FHWA toll-facility material and state inventories, then resolved material ownership structures using state DOTs, toll authorities, statutes, concession agreements, audited statements, federal project profiles, company disclosures, fund portfolio pages, and restructuring records.",
  "A record represents one materially distinct legal and economic stack. Several public roads can share a system row when the same authority owns and operates them, the same revenue pledge applies, and no facility has a separate concession. Private concessions, privately titled facilities, nonprofit concessions, cross-jurisdiction crossings, and availability-payment projects remain separate.",
  "The current universe includes toll roads, tolled bridges, tolled tunnels, and recurring priced managed lanes open to general traffic. It excludes parking, ferries, event charges, ordinary cordon congestion charges, future or inactive projects, HOV-only lanes without a toll, and private roads closed to general traffic.",
  "Confidence is field-sensitive. Confirmed means current primary or first-party evidence resolves the core title, sponsor, operator or concessionaire, revenue claimant, and term with no material conflict. Strong means the core structure is resolved but a non-core detail remains incomplete. Probable means the classification is supported while a controlling title or upstream ownership link is incomplete. Unresolved means a material current ownership or shareholder link cannot be responsibly completed from public records.",
  "This release should not be used to calculate one national percentage of toll roads that are private. A denominator based on branded systems, individual facilities, centerline miles, lane-miles, traffic, revenue, or asset value will produce different results. The release is an ownership reference, not a market-share estimate.",
  "Corrections should identify the facility, disputed field, proposed replacement, and a dated primary source. A change to titleholder, concessionaire, ultimate parent, revenue claimant, term, or state category should trigger a dated revision to the article and both downloadable tables."
],
    },
    {
      id: "frequently-asked-questions",
      title: "Frequently asked questions",
      paragraphs: [
  "Are U.S. toll roads privately owned? Most material state and regional systems in this review are publicly titled. A smaller set is privately titled or controlled through long contracts.",
  "Does the company sending the bill own the road? Usually not. Toll-tag agencies and back-office vendors can process payments without holding title or the underlying toll economics.",
  "Do bondholders own a toll road? Normally no. They lend to an authority or project company and may hold a toll-revenue pledge and contractual remedies.",
  "Can foreign investors own U.S. toll-road companies? Yes. Foreign public companies, infrastructure funds, and pension institutions hold equity in several concessionaires. On public-title projects, that is normally ownership of the company holding finite contractual rights rather than ownership of the public pavement.",
  "What happens when a concession expires? The operating and revenue rights normally return to the public sponsor under handback standards. Privately titled facilities do not necessarily have a scheduled public reversion."
],
    }
  ],
  resources: [
    {
      label: 'State and DC ownership overview',
      href: US_TOLL_ROAD_STATE_OVERVIEW_CSV_PATH,
      description: 'Map-ready 51-jurisdiction table with ownership pattern and current exception notes.',
      format: 'CSV',
    },
    {
      label: 'Private and hybrid toll structures',
      href: US_TOLL_ROAD_PRIVATE_HYBRID_CSV_PATH,
      description: 'Thirty-three material private-title, traffic-risk, availability-payment, and nonprofit records.',
      format: 'CSV',
    },
    {
      label: 'Claim-level source ledger',
      href: US_TOLL_ROAD_SOURCE_LEDGER_CSV_PATH,
      description: 'Official and first-party sources used for the web edition, with verification dates.',
      format: 'CSV',
    },
    {
      label: 'Methodology and data dictionary',
      href: US_TOLL_ROAD_METHODOLOGY_PATH,
      description: 'Universe, exclusions, grouping rules, classifications, confidence scale, and correction protocol.',
      format: 'MD',
    },
  ],
  sources: [
  {
    "label": "FHWA toll-facility inventory",
    "href": "https://www.fhwa.dot.gov/policyinformation/tollpage/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Chicago Department of Finance — Chicago Skyway public-private partnership",
    "href": "https://www.chicago.gov/city/en/depts/fin/supp_info/public_private_partnerships/chicago_skyway.html",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Atlas Arteria — Chicago Skyway portfolio disclosure",
    "href": "https://www.atlasarteria.com/portfolio/chicago-skyway/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Indiana Finance Authority — Indiana Toll Road",
    "href": "https://www.in.gov/ifa/indiana-toll-road/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "IFM Investors — Indiana Toll Road portfolio disclosure",
    "href": "https://www.ifminvestors.com/en-us/about-us/our-investments/infrastructure/indiana-toll-road/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Virginia State Corporation Commission — Dulles Greenway",
    "href": "https://www.scc.virginia.gov/regulated-industries/transportation/dulles-greenway",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Atlas Arteria — Dulles Greenway portfolio disclosure",
    "href": "https://www.atlasarteria.com/portfolio/dulles-greenway/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "VDOT — Pocahontas Parkway",
    "href": "https://www.vdot.virginia.gov/projects/richmond-district/pocahontas-parkway/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Globalvia — infrastructure portfolio",
    "href": "https://www.globalvia.com/en/our-portfolio/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "VDOT — Elizabeth River Tunnels",
    "href": "https://www.vdot.virginia.gov/projects/hampton-roads-district/elizabeth-river-tunnels/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Abertis — Elizabeth River Crossings",
    "href": "https://www.abertis.com/en/our-business/roads/elizabeth-river-crossings",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "TxDOT — SH 130 executed agreements",
    "href": "https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — SH 130 Segments 5 and 6 project profile",
    "href": "https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — North Tarrant Express project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — LBJ Express project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_lbj_express.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — North Tarrant Express 35W project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant_3a3b.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "VDOT — Transform 66 Outside the Beltway",
    "href": "https://www.vdot.virginia.gov/projects/northern-virginia-district/transform-66-outside-the-beltway/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "E-470 Public Highway Authority",
    "href": "https://www.e-470.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Illinois State Toll Highway Authority",
    "href": "https://www.illinoistollway.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Florida’s Turnpike Enterprise",
    "href": "https://floridasturnpike.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — I-595 Express project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/fl_i595.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — I-4 Ultimate project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/fl_i4.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — Goethals Bridge project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/ny_goethals_bridge.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "FHWA — Ohio River Bridges East End Crossing project profile",
    "href": "https://www.fhwa.dot.gov/ipd/project_profiles/in_east_end_crossing.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Southern Connector / Connector 2000 Association",
    "href": "https://www.southernconnector.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "American Roads portfolio",
    "href": "https://americanroads.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "DIF Capital Partners — American Roads portfolio disclosure",
    "href": "https://www.dif.eu/portfolio/american-roads/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "United Bridge Partners portfolio",
    "href": "https://unitedbridgepartners.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Fort Frances–International Falls Bridge",
    "href": "https://fortfrancesbridge.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Grosse Ile Township — bridge acquisition record",
    "href": "https://www.grosseile.com/",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "North Carolina DOT — I-77 Express Lanes",
    "href": "https://www.ncdot.gov/projects/i-77-express-lanes/Pages/default.aspx",
    "lastVerified": "2026.09.02"
  },
  {
    "label": "Deeper Texas toll-road ownership investigation",
    "href": "/markets/who-owns-texas-toll-roads",
    "lastVerified": "2026.09.02"
  }
],
} satisfies InvestmentMemo;
