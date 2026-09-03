import type { InvestmentMemo } from './articleModels';

export const US_TOLL_ROAD_ARTICLE_SLUG = 'who-owns-us-toll-roads';
export const US_TOLL_ROAD_ARTICLE_PATH = `/markets/${US_TOLL_ROAD_ARTICLE_SLUG}`;

export const US_TOLL_ROAD_ARTICLE: InvestmentMemo = {
  kind: "investment-memo",
  slug: "who-owns-us-toll-roads",
  number: "03",
  category: "INFRASTRUCTURE OWNERSHIP",
  title: "Who Owns 25 of America’s Major Toll Roads?",
  seoTitle: "Who Owns America’s Toll Roads? 25 Major Systems Explained",
  subtitle: "Public authorities, private concessions, buybacks, and the companies behind them.",
  seoDescription: "A current 25-facility sample separating public title, toll operators, private concessions, equity owners, revenue rights, buybacks, and contract end dates.",
  artwork: {
    kind: "image",
    heroSrc: "/images/research/us-toll-road-ownership-stack.svg",
    socialSrc: "/images/social/og-research.png",
    alt: "Editorial ownership-stack diagram separating public title, concession rights, operations, billing, capital and toll revenue.",
    label: "National toll-road ownership / A01",
    caption: "A toll-road brand can hide separate title, operating, billing, equity, debt, revenue and reversion layers.",
    objectPosition: "center"
  },
  date: "2026.09.02",
  dateModified: "2026.09.02",
  readTime: "18 MIN",
  author: "SULAYMAN BOWLES",
  thesis: "Most roads in this 25-facility sample remain publicly titled and publicly financed, but the operator, billing system, concessionaire, toll-revenue claimant, equity owner, lender and residual owner can all be different entities.",
  conclusion: {
    title: "Ask which right is owned",
    content: "Do not ask whether a toll road is simply public or private. Ask who holds legal title, operates the lanes, sends the bill, receives the toll revenue, bears demand risk, owns and finances the project company, and receives the asset at expiry. One layer can change while the road name stays the same."
  },
  conviction: "STRUCTURAL",
  horizon: "2026 OWNERSHIP SAMPLE",
  allocation: "EDUCATIONAL RESEARCH",
  risks: "The sample is intentionally not a national census. Several rows leave narrow fields unresolved, including billing subcontractors, instrument-level debt, complete fund cap tables, and agreement-level handback dates.",
  formula: "road ownership = title + contract rights + operations + billing + toll revenue + equity + debt + reversion",
  formulaLabel: "Layered Toll-Road Ownership Frame",
  valuationFrame: "Finite contractual rights, toll cash flow, traffic risk, debt service, lifecycle obligations, public sharing, and residual value at handback.",
  recommendationBoundary: "Educational infrastructure ownership research. The 25-row sample is not a count of every U.S. toll facility, a legal opinion, an asset appraisal, or an investment recommendation.",
  metrics: [
    {
      label: "Facilities / systems",
      value: "25"
    },
    {
      label: "States",
      value: "16"
    },
    {
      label: "Confidence",
      value: "13 CONFIRMED / 12 STRONG"
    },
    {
      label: "Evidence cutoff",
      value: "SEPT. 2, 2026"
    }
  ],
  resources: [
    {
      label: "Complete 25-facility ownership dataset",
      href: "/research/us-toll-road-ownership-2026.csv",
      description: "Full ownership stack, revenue rights, contract model, term, confidence, sources and unresolved fields.",
      format: "CSV"
    },
    {
      label: "Private, hybrid and returned-to-public subset",
      href: "/research/us-toll-road-private-hybrid-2026.csv",
      description: "Ten records where private title, concession rights, availability payments or a public takeover materially change the structure.",
      format: "CSV"
    },
    {
      label: "Source ledger",
      href: "/research/us-toll-road-source-ledger-2026.csv",
      description: "Thirty-nine source records with claim supported, source type, evidence date and limitation.",
      format: "CSV"
    }
  ],
  sources: [
    {
      label: "FHWA national toll-facility discovery inventory",
      href: "https://www.fhwa.dot.gov/policyinformation/tollpage/page00.cfm",
      lastVerified: "2026.09.02"
    },
    {
      label: "E-470 2025 annual report",
      href: "https://e470.com/app/uploads/2026/06/E470-Annual-Report-2025-Digital-Final.pdf",
      lastVerified: "2026.09.02"
    },
    {
      label: "E-470 tolling FAQ",
      href: "https://www.e-470.com/how-tolling-works/faqs/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Pennsylvania Turnpike Commission investor relations",
      href: "https://www.paturnpike.com/about-us/investor-relations",
      lastVerified: "2026.09.02"
    },
    {
      label: "Illinois Tollway authority overview",
      href: "https://www.illinoistollway.com/about",
      lastVerified: "2026.09.02"
    },
    {
      label: "Florida’s Turnpike Enterprise",
      href: "https://floridasturnpike.com/about/",
      lastVerified: "2026.09.02"
    },
    {
      label: "New Jersey Turnpike Authority",
      href: "https://www.njta.com/about",
      lastVerified: "2026.09.02"
    },
    {
      label: "New York State Thruway Authority overview",
      href: "https://www.thruway.ny.gov/about/index.html",
      lastVerified: "2026.09.02"
    },
    {
      label: "Ohio Turnpike and Infrastructure Commission",
      href: "https://www.ohioturnpike.org/about-us",
      lastVerified: "2026.09.02"
    },
    {
      label: "Maine Turnpike Authority overview",
      href: "https://www.maineturnpike.com/About-MTA/Overview.aspx",
      lastVerified: "2026.09.02"
    },
    {
      label: "Oklahoma Turnpike Authority / PIKEPASS",
      href: "https://www.pikepass.com/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Maryland Transportation Authority overview",
      href: "https://mdta.maryland.gov/About/About_MDTA.html",
      lastVerified: "2026.09.02"
    },
    {
      label: "Central Florida Expressway Authority",
      href: "https://www.cfxway.com/agency-information/",
      lastVerified: "2026.09.02"
    },
    {
      label: "North Texas Tollway Authority",
      href: "https://www.ntta.org/about-us",
      lastVerified: "2026.09.02"
    },
    {
      label: "Harris County Toll Road Authority",
      href: "https://www.hctra.org/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Bay Area Toll Authority",
      href: "https://mtc.ca.gov/about-mtc/authorities/bay-area-toll-authority-bata",
      lastVerified: "2026.09.02"
    },
    {
      label: "Caltrans toll operations",
      href: "https://dot.ca.gov/programs/toll-operations",
      lastVerified: "2026.09.02"
    },
    {
      label: "Massachusetts Turnpike overview",
      href: "https://www.mass.gov/info-details/massachusetts-turnpike",
      lastVerified: "2026.09.02"
    },
    {
      label: "91 Express Lanes history and agency role",
      href: "https://www.91expresslanes.com/about-us/",
      lastVerified: "2026.09.02"
    },
    {
      label: "SANDAG South Bay Expressway / SR 125",
      href: "https://www.sandag.org/projects-and-programs/roads-and-highways/sr-125-toll-road",
      lastVerified: "2026.09.02"
    },
    {
      label: "TxDOT SH 288 transition to public control",
      href: "https://www.txdot.gov/about/newsroom/statewide/sh288-toll-lanes-transition-public-ownership.html",
      lastVerified: "2026.09.02"
    },
    {
      label: "Texas Transportation Commission SH 288 action",
      href: "https://www.txdot.gov/content/dam/docs/commission/2024/0730/minutes.pdf",
      lastVerified: "2026.09.02"
    },
    {
      label: "FHWA Chicago Skyway project profile",
      href: "https://www.fhwa.dot.gov/ipd/project_profiles/il_chicago_skyway.aspx",
      lastVerified: "2026.09.02"
    },
    {
      label: "City of Chicago Skyway transaction records",
      href: "https://www.chicago.gov/city/en/depts/fin/supp_info/public_private_partnerships/chicago_skyway.html",
      lastVerified: "2026.09.02"
    },
    {
      label: "Atlas Arteria Chicago Skyway portfolio disclosure",
      href: "https://www.atlasarteria.com/portfolio/chicago-skyway",
      lastVerified: "2026.09.02"
    },
    {
      label: "FHWA Indiana Toll Road project profile",
      href: "https://www.fhwa.dot.gov/ipd/project_profiles/in_indiana_toll_road.aspx",
      lastVerified: "2026.09.02"
    },
    {
      label: "Indiana Finance Authority toll-road record",
      href: "https://www.in.gov/ifa/indiana-toll-road/",
      lastVerified: "2026.09.02"
    },
    {
      label: "IFM Investors Indiana Toll Road portfolio disclosure",
      href: "https://www.ifminvestors.com/en-us/about-us/our-investments/infrastructure/indiana-toll-road/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Dulles Greenway operating company",
      href: "https://www.dullesgreenway.com/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Atlas Arteria Dulles Greenway disclosure",
      href: "https://www.atlasarteria.com/portfolio/dulles-greenway",
      lastVerified: "2026.09.02"
    },
    {
      label: "VDOT 495 Express Lanes project",
      href: "https://www.vdot.virginia.gov/projects/northern-virginia-district/495-express-lanes/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Transurban 495 Express Lanes",
      href: "https://www.transurban.com/roads-and-projects/495-express-lanes",
      lastVerified: "2026.09.02"
    },
    {
      label: "VDOT Elizabeth River Tunnels",
      href: "https://www.vdot.virginia.gov/projects/hampton-roads-district/elizabeth-river-tunnels/",
      lastVerified: "2026.09.02"
    },
    {
      label: "Abertis Elizabeth River Crossings disclosure",
      href: "https://www.abertis.com/en/our-business/roads/elizabeth-river-crossings",
      lastVerified: "2026.09.02"
    },
    {
      label: "NCDOT I-77 Express Lanes",
      href: "https://www.ncdot.gov/projects/i-77-express-lanes/Pages/default.aspx",
      lastVerified: "2026.09.02"
    },
    {
      label: "Ferrovial I-77 Express",
      href: "https://www.ferrovial.com/en/business/highways/i-77-express/",
      lastVerified: "2026.09.02"
    },
    {
      label: "FHWA I-595 project profile",
      href: "https://www.fhwa.dot.gov/ipd/project_profiles/fl_i595.aspx",
      lastVerified: "2026.09.02"
    },
    {
      label: "I-595 Express project documents",
      href: "https://www.595express.info/documents.shtm",
      lastVerified: "2026.09.02"
    },
    {
      label: "Deeper Texas toll-road ownership investigation",
      href: "/markets/who-owns-texas-toll-roads",
      lastVerified: "2026.09.02"
    }
  ],
  content: [
    "A driver normally encounters one road name and one toll bill. The legal structure can contain half a dozen different parties. A state may own the pavement. A public authority may issue the debt. A private concessionaire may operate the lanes and receive the toll revenue. A separate company may process the payment. Infrastructure funds, pension plans, or public shareholders may own the concessionaire. At the end of the contract, the road may return to government control.",
    "This article maps those layers for 25 major toll roads and systems across 16 states. The sample was selected to represent materially different structures, not to estimate the ownership of every toll facility in the United States. It includes conventional public authorities, public systems with divided responsibilities, roads bought back from private operators, long-term revenue-risk concessions, one privately titled road, and an availability-payment project where the private company does not receive the toll revenue.",
    "The downloadable dataset keeps legal title, public sponsorship, operations, billing, concession rights, immediate and ultimate parents, disclosed equity, toll revenue, demand risk, debt, revenue sharing, contract term, reversion, sources, confidence, and unresolved questions in separate fields."
  ],
  sections: [
    {
      id: "quick-answer",
      title: "The quick answer",
      paragraphs: [
        "Most facilities in this sample remain public at the asset and revenue level. Fourteen are conventional public toll systems in which a government authority or transportation department holds the facility, operates or controls it, receives the toll revenue, bears demand risk, and issues the debt. One more, the San Francisco Bay Area’s state-owned toll bridges, is fully public but divides responsibilities among the State of California, Caltrans, and the Bay Area Toll Authority.",
        "Three facilities returned to public control after private development or concession trouble. Five retain public title but place traffic and toll-revenue risk with a private concessionaire. Dulles Greenway is privately titled. I-595 Express uses private delivery and long-term maintenance while Florida DOT keeps the toll revenue and demand risk.",
        "Those categories cannot be collapsed into public or private without losing the answer."
      ],
      table: {
        caption: "Ownership structures represented in the 25-facility sample",
        columns: [
          "Structure",
          "Rows",
          "What the label means"
        ],
        rows: [
          [
            "Conventional public authority",
            "14",
            "Public entity controls the asset and toll economics"
          ],
          [
            "Divided public responsibility",
            "1",
            "Public title, operations and revenue administration sit with different public entities"
          ],
          [
            "Returned to public control",
            "3",
            "A public agency bought or terminated the prior private interest"
          ],
          [
            "Public title / private revenue-risk concession",
            "5",
            "Government keeps title; project company receives toll revenue for a fixed term"
          ],
          [
            "Privately titled facility",
            "1",
            "Private project entity owns and operates the road under public regulation"
          ],
          [
            "Public revenue / availability-payment DBFOM",
            "1",
            "Private company delivers and maintains; public agency keeps toll revenue and demand risk"
          ]
        ]
      },
      figures: [
        {
          src: "/images/research/us-toll-road-structure-counts.svg",
          alt: "Bar chart showing the six ownership structures represented in the 25-facility toll-road sample.",
          label: "Structural sample / 01",
          caption: "Counts describe this selected evidence sample, not every U.S. toll facility.",
          width: 1800,
          height: 1200
        }
      ]
    },
    {
      id: "facility-lookup",
      title: "The 25-facility lookup",
      paragraphs: [
        "The lookup gives the highest defensible current answer for each selected road or system. “Same” in ordinary discussions is often wrong: title, operations and toll revenue can sit with different parties. The downloadable CSV carries the broader stack, sources and unresolved fields."
      ],
      table: {
        caption: "Who holds title, operates and receives toll revenue across the sample",
        columns: [
          "Facility or system",
          "State",
          "Legal title or highest defensible owner",
          "Operator / concessionaire",
          "Toll-revenue claimant",
          "Current structure",
          "Confidence"
        ],
        rows: [
          [
            "E-470",
            "Colorado",
            "E-470 Public Highway Authority",
            "E-470 Public Highway Authority",
            "E-470 Public Highway Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Pennsylvania Turnpike System",
            "Pennsylvania",
            "Pennsylvania Turnpike Commission",
            "Pennsylvania Turnpike Commission",
            "Pennsylvania Turnpike Commission",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Illinois Tollway System",
            "Illinois",
            "Illinois State Toll Highway Authority",
            "Illinois Tollway",
            "Illinois Tollway",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Florida’s Turnpike System",
            "Florida",
            "State of Florida",
            "Florida’s Turnpike Enterprise",
            "Florida’s Turnpike Enterprise / FDOT",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "New Jersey Turnpike and Garden State Parkway",
            "New Jersey",
            "New Jersey Turnpike Authority",
            "New Jersey Turnpike Authority",
            "New Jersey Turnpike Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "New York State Thruway",
            "New York",
            "New York State Thruway Authority",
            "New York State Thruway Authority",
            "New York State Thruway Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Ohio Turnpike",
            "Ohio",
            "Ohio Turnpike and Infrastructure Commission",
            "Ohio Turnpike and Infrastructure Commission",
            "Ohio Turnpike and Infrastructure Commission",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Maine Turnpike",
            "Maine",
            "Maine Turnpike Authority",
            "Maine Turnpike Authority",
            "Maine Turnpike Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Oklahoma Turnpike Authority System",
            "Oklahoma",
            "Oklahoma Turnpike Authority",
            "Oklahoma Turnpike Authority",
            "Oklahoma Turnpike Authority",
            "Conventional public authority",
            "Strong"
          ],
          [
            "Maryland Transportation Authority Toll Facilities",
            "Maryland",
            "Maryland Transportation Authority",
            "Maryland Transportation Authority",
            "Maryland Transportation Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Central Florida Expressway System",
            "Florida",
            "Central Florida Expressway Authority",
            "Central Florida Expressway Authority",
            "Central Florida Expressway Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "North Texas Tollway Authority System",
            "Texas",
            "North Texas Tollway Authority",
            "North Texas Tollway Authority",
            "North Texas Tollway Authority",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "Harris County Toll Road Authority System",
            "Texas",
            "Harris County",
            "Harris County Toll Road Authority",
            "Harris County toll-road system",
            "Conventional public authority",
            "Strong"
          ],
          [
            "Bay Area State-Owned Toll Bridges",
            "California",
            "State of California",
            "Caltrans operates and maintains",
            "Bay Area Toll Authority administers toll revenue",
            "Divided public responsibility",
            "Confirmed"
          ],
          [
            "Massachusetts Turnpike",
            "Massachusetts",
            "Commonwealth of Massachusetts",
            "MassDOT",
            "MassDOT",
            "Conventional public authority",
            "Confirmed"
          ],
          [
            "91 Express Lanes, Orange County",
            "California",
            "State highway corridor; OCTA holds the toll franchise and toll operations",
            "Orange County Transportation Authority",
            "Orange County Transportation Authority",
            "Returned to public control",
            "Strong"
          ],
          [
            "South Bay Expressway / SR 125",
            "California",
            "State-route corridor; SANDAG controls the acquired toll-road interest",
            "SANDAG",
            "SANDAG",
            "Returned to public control",
            "Strong"
          ],
          [
            "SH 288 Managed Lanes",
            "Texas",
            "State of Texas",
            "Texas Transportation Finance Corporation under TxDOT control; HCTRA involved in toll operations",
            "Public entities under the post-termination structure",
            "Returned to public control",
            "Strong"
          ],
          [
            "Chicago Skyway",
            "Illinois",
            "City of Chicago",
            "Skyway Concession Company LLC",
            "Skyway Concession Company during the lease",
            "Public title / private revenue-risk concession",
            "Strong"
          ],
          [
            "Indiana Toll Road",
            "Indiana",
            "State of Indiana / Indiana Finance Authority",
            "ITR Concession Company LLC",
            "ITR Concession Company during the lease",
            "Public title / private revenue-risk concession",
            "Strong"
          ],
          [
            "Dulles Greenway",
            "Virginia",
            "Toll Road Investors Partnership II, L.P.",
            "Toll Road Investors Partnership II",
            "Toll Road Investors Partnership II",
            "Privately titled facility",
            "Strong"
          ],
          [
            "495 Express Lanes",
            "Virginia",
            "Commonwealth of Virginia",
            "Capital Beltway Express LLC, a Transurban company",
            "Capital Beltway Express LLC under the concession",
            "Public title / private revenue-risk concession",
            "Strong"
          ],
          [
            "Elizabeth River Crossings",
            "Virginia",
            "Commonwealth of Virginia",
            "Elizabeth River Crossings project company",
            "Project company under the concession",
            "Public title / private revenue-risk concession",
            "Strong"
          ],
          [
            "I-77 Express Lanes",
            "North Carolina",
            "State of North Carolina",
            "I-77 Mobility Partners LLC",
            "I-77 Mobility Partners under the concession",
            "Public title / private revenue-risk concession",
            "Strong"
          ],
          [
            "I-595 Express",
            "Florida",
            "State of Florida",
            "I-595 Express LLC performs DBFOM obligations; FDOT controls tolling equipment",
            "Florida Department of Transportation",
            "Public toll revenue / private availability-payment DBFOM",
            "Strong"
          ]
        ]
      },
      figures: [
        {
          src: "/images/research/us-toll-road-state-coverage.svg",
          alt: "Grid listing the 16 states in the structural toll-road sample and the number of selected records in each.",
          label: "Geographic coverage / 02",
          caption: "Selection follows structural variety and evidence quality; it is not proportional to each state’s toll mileage.",
          width: 1800,
          height: 1200
        }
      ]
    },
    {
      id: "ownership-stack",
      title: "What a toll-road “owner” can mean",
      paragraphs: [
        "The physical titleholder owns the real property, highway interest, bridge, or statutory franchise. That does not necessarily identify the company receiving the tolls.",
        "The public sponsor is the government or authority that approved, developed, or oversees the facility. It may retain title even under a century-long lease. The operator runs traffic systems, incident response, customer service and maintenance. An operator can be a contractor with no equity and no toll-revenue right.",
        "The billing provider processes transponders, license plates, invoices, interoperability and collections. E-ZPass, FasTrak, SunPass, TollTag and similar systems describe payment networks. They are not answers to who owns the road.",
        "The concessionaire or project company holds contractual rights and obligations. In a revenue-risk concession it generally receives toll revenue and bears demand risk. In an availability-payment DBFOM, the public agency may keep all toll revenue and pay the private company based on whether the road is available and meets performance standards.",
        "Equity investors own the project company. Debt providers finance it. The residual owner receives the road or operating rights when a lease expires. Each layer can change without every other layer changing with it."
      ],
      table: {
        caption: "Eight roles that should not be collapsed into one ownership field",
        columns: [
          "Layer",
          "What it controls",
          "Common source of confusion"
        ],
        rows: [
          [
            "Legal titleholder",
            "Owns the physical facility, property interest or statutory franchise",
            "May remain public during a long private concession"
          ],
          [
            "Public sponsor",
            "Approves, oversees or regulates the facility",
            "Can differ from the operator and revenue claimant"
          ],
          [
            "Operator",
            "Runs traffic systems, incident response and day-to-day road functions",
            "A contractor can operate without owning equity or toll rights"
          ],
          [
            "Billing provider",
            "Processes transponders, plates, invoices and interoperability",
            "The name on the statement may not receive the economics"
          ],
          [
            "Concessionaire",
            "Holds contractual operating, maintenance or revenue rights",
            "Rights are bounded by the agreement and usually end"
          ],
          [
            "Equity owners",
            "Own the project company or holding vehicle",
            "They may be funds, pension plans or listed companies"
          ],
          [
            "Debt providers",
            "Finance the authority or project company",
            "A revenue pledge is not legal title"
          ],
          [
            "Residual owner",
            "Receives the facility or rights at expiry",
            "Handback standards can matter as much as the original transfer"
          ]
        ]
      },
      figures: [
        {
          src: "/images/research/us-toll-road-ownership-stack.svg",
          alt: "Layered diagram separating public title, concession rights, operations, billing, equity, debt, toll revenue and reversion.",
          label: "Ownership stack / 03",
          caption: "A concession-company sale can change the equity owner while public title and the expiry date remain intact.",
          width: 1800,
          height: 1200
        }
      ]
    },
    {
      id: "public-authorities",
      title: "The conventional public-authority model",
      paragraphs: [
        "E-470 is the cleanest case in the sample. The E-470 Public Highway Authority holds the public facility, operates it, administers ExpressToll, receives the toll revenue, bears traffic risk, and issues toll-revenue bonds. Several public jurisdictions govern the authority. Contractors may perform work, but there is no private concession sitting between the authority and the toll economics.",
        "The Pennsylvania Turnpike, Illinois Tollway, New Jersey Turnpike Authority, New York State Thruway, Ohio Turnpike, Maine Turnpike, Oklahoma Turnpike Authority, Maryland Transportation Authority, Central Florida Expressway Authority, North Texas Tollway Authority, and Massachusetts Turnpike follow variations of this public model.",
        "Public does not mean debt-free. These entities can issue new bonds, refinance, pool revenue across facilities, build extensions, maintain reserves, and fund capital programs. The continuing toll is tied to the authority’s legal and financial system, not necessarily to whether the original pavement cost has been recovered."
      ]
    },
    {
      id: "divided-public-roles",
      title: "Public ownership can still be split among agencies",
      paragraphs: [
        "The Bay Area toll bridges show why even an entirely public road can resist one-word ownership labels. The State of California owns the seven state-owned toll bridges. Caltrans operates and maintains them. The Bay Area Toll Authority administers toll revenues and finances bridge work and regional transportation obligations. FasTrak manages the payment interface.",
        "None of those facts makes FasTrak the bridge owner. Nor does Caltrans’ operating role mean it alone controls every dollar collected. The correct answer is a public ownership stack with divided statutory responsibilities."
      ]
    },
    {
      id: "public-buybacks",
      title: "When governments buy back or take over toll roads",
      paragraphs: [
        "The 91 Express Lanes began as a privately developed express-lane franchise. The Orange County Transportation Authority purchased the private franchise in 2003 and now runs the Orange County toll-lane business. The facility is a useful reminder that a road built under a private model does not stay private forever.",
        "South Bay Expressway followed a more distressed path. The private concession entered bankruptcy. SANDAG acquired the toll-road interest in 2011 and moved the facility into regional public control. The underlying state-route relationship and financing remain more complex than a simple deed purchase, but the current toll economics are public rather than private-equity economics.",
        "Texas SH 288 changed more recently. TxDOT terminated the private concession and shifted the managed lanes into public control on October 8, 2024. The Texas Transportation Finance Corporation now carries a public operating and financing role under TxDOT oversight, with HCTRA involved in toll operations. Describing SH 288 today as a privately owned toll road would carry a pre-2024 structure forward after it ended."
      ],
      table: {
        caption: "Three routes back to public control",
        columns: [
          "Facility",
          "State",
          "Transition",
          "Current operator",
          "Current revenue claimant",
          "Open field"
        ],
        rows: [
          [
            "91 Express Lanes, Orange County",
            "California",
            "Public purchase completed 2003",
            "Orange County Transportation Authority",
            "Orange County Transportation Authority",
            "Underlying highway title, franchise interest and current financing should not be collapsed into one deed-style owner."
          ],
          [
            "South Bay Expressway / SR 125",
            "California",
            "SANDAG acquisition completed 2011",
            "SANDAG",
            "SANDAG",
            "The underlying state-route, franchise and financing interests are more complex than a simple title transfer."
          ],
          [
            "SH 288 Managed Lanes",
            "Texas",
            "Public transition effective 2024-10-08",
            "Texas Transportation Finance Corporation under TxDOT control; HCTRA involved in toll operations",
            "Public entities under the post-termination structure",
            "The precise ongoing split among TxDOT, TTFC and HCTRA remains a row-level operating and financing question."
          ]
        ]
      }
    },
    {
      id: "private-concessions",
      title: "The long private revenue-risk concessions",
      paragraphs: [
        "Chicago Skyway is publicly owned in the residual sense and privately controlled economically during the lease. The City of Chicago retained title while granting Skyway Concession Company a 99-year operating lease. Atlas Arteria reports a 66.67 percent interest and Ontario Teachers’ Pension Plan 33.33 percent. The concession company receives toll revenue and bears commercial risk until the scheduled January 2104 reversion.",
        "The Indiana Toll Road uses a related model. Indiana retains the public asset while ITR Concession Company holds a 75-year lease through 2081. The original concessionaire entered bankruptcy, but the lease continued after a 2015 sale to an IFM Investors-managed vehicle. IFM’s current portfolio disclosure reports a 72.9 percent fund stake; the remainder and current instrument-level debt remain unresolved rather than being manufactured into a complete cap table.",
        "Virginia’s 495 Express Lanes and Elizabeth River Crossings, plus North Carolina’s I-77 Express Lanes, are expansion-era public-private partnerships. The states retain public title. Private project companies finance, improve, operate, maintain, and collect tolls under long contracts. Their investors bear traffic and revenue risk, subject to rate rules, compensation provisions, performance standards, and public oversight."
      ],
      table: {
        caption: "Current private-title, revenue-risk and availability-payment structures in the sample",
        columns: [
          "Facility",
          "State",
          "Structure",
          "Public title / sponsor",
          "Private project entity",
          "Ultimate disclosed parent",
          "Revenue claimant",
          "Expiry / reversion",
          "Confidence"
        ],
        rows: [
          [
            "Chicago Skyway",
            "Illinois",
            "Public title / private revenue-risk concession",
            "City of Chicago",
            "Skyway Concession Company LLC",
            "Joint control through Atlas Arteria and Ontario Teachers’ Pension Plan",
            "Skyway Concession Company during the lease",
            "January 2104; contractual reversion to the City",
            "Strong"
          ],
          [
            "Indiana Toll Road",
            "Indiana",
            "Public title / private revenue-risk concession",
            "State of Indiana / Indiana Finance Authority",
            "ITR Concession Company LLC",
            "Infrastructure capital managed by IFM Investors",
            "ITR Concession Company during the lease",
            "2081; scheduled return of concession rights to the public side",
            "Strong"
          ],
          [
            "Dulles Greenway",
            "Virginia",
            "Privately titled facility",
            "Toll Road Investors Partnership II, L.P.",
            "Toll Road Investors Partnership II",
            "Atlas Arteria",
            "Toll Road Investors Partnership II",
            "No conventional public concession expiry identified",
            "Strong"
          ],
          [
            "495 Express Lanes",
            "Virginia",
            "Public title / private revenue-risk concession",
            "Commonwealth of Virginia",
            "Capital Beltway Express LLC",
            "Transurban Group",
            "Capital Beltway Express LLC under the concession",
            "Long concession; precise handback date remains in agreement records",
            "Strong"
          ],
          [
            "Elizabeth River Crossings",
            "Virginia",
            "Public title / private revenue-risk concession",
            "Commonwealth of Virginia",
            "Elizabeth River Crossings OpCo / project company",
            "Abertis and Manulife Investment Management",
            "Project company under the concession",
            "Scheduled into 2070 under the 58-year agreement",
            "Strong"
          ],
          [
            "I-77 Express Lanes",
            "North Carolina",
            "Public title / private revenue-risk concession",
            "State of North Carolina",
            "I-77 Mobility Partners LLC",
            "Ferrovial / Cintra",
            "I-77 Mobility Partners under the concession",
            "50-year concession scheduled through the late 2060s",
            "Strong"
          ],
          [
            "I-595 Express",
            "Florida",
            "Public toll revenue / private availability-payment DBFOM",
            "State of Florida",
            "I-595 Express LLC",
            "ACS Group and TIAA-related capital in the original project structure",
            "Florida Department of Transportation",
            "35-year contractual term; exact handback date requires agreement confirmation",
            "Strong"
          ]
        ]
      }
    },
    {
      id: "private-title",
      title: "The privately titled exception",
      paragraphs: [
        "Dulles Greenway is not merely a public road with a private operating lease. Toll Road Investors Partnership II owns and operates the facility under Virginia’s Highway Corporation Act and State Corporation Commission regulation. Atlas Arteria reports a 100 percent economic interest.",
        "The Commonwealth regulates the facility and its toll applications, but the private project entity holds the road ownership interest. This is one reason claims such as “all U.S. toll roads are publicly owned” are inaccurate. It is also why the existence of a government regulator does not itself prove public title."
      ]
    },
    {
      id: "availability-payments",
      title: "Private delivery without private toll revenue",
      paragraphs: [
        "I-595 Express is the control case for availability payments. Florida DOT retained the tolling equipment, toll revenue, and demand risk. I-595 Express, LLC financed and delivered the corridor improvements and assumed long-term operational and lifecycle obligations. FDOT pays the project company based on availability and performance rather than handing it the toll receipts.",
        "A casual database might call I-595 privately owned because a private consortium financed and operates major elements of the corridor. That would be wrong. The more accurate description is public toll revenue with a private availability-payment DBFOM."
      ]
    },
    {
      id: "ultimate-owners",
      title: "Who ultimately owns the private concessionaires?",
      paragraphs: [
        "The private side is rarely one operating company. The project company usually sits under holding companies, funds, and co-investment vehicles.",
        "Chicago Skyway’s disclosed equity reaches Atlas Arteria, a publicly traded infrastructure owner, and Ontario Teachers’ Pension Plan, a Canadian pension investor. Indiana Toll Road sits within IFM Investors-managed infrastructure capital. Dulles Greenway sits under Atlas Arteria. Elizabeth River Crossings sits under Abertis and Manulife. The 495 Express Lanes sit within Transurban’s Virginia portfolio. I-77 Mobility Partners sits within Ferrovial’s Cintra-led concession structure.",
        "Foreign-headquartered or foreign-managed capital does not change the public sponsor’s contract rights, regulatory authority, or residual title. It is a factual part of the equity chain, not evidence of misconduct. The useful question is what the investor owns: project-company equity, lease rights, toll revenue during a term, or the underlying road itself."
      ]
    },
    {
      id: "expiry-and-reversion",
      title: "What happens when a concession expires?",
      paragraphs: [
        "The answer comes from the agreement. A conventional long-term lease normally requires the concessionaire to return the facility or its operating rights to the public owner in a prescribed condition. Chicago Skyway’s lease runs to January 2104. Indiana Toll Road’s lease is scheduled through 2081. The Virginia and North Carolina agreements have their own handback dates and performance obligations.",
        "An availability-payment project also has a contractual handback, but the public agency never surrendered the toll revenue in the first place.",
        "Expiry is not the only path. A government can negotiate a purchase, terminate for default or convenience under contractual rules, acquire a project through bankruptcy, or refinance the public system. The 91 Express Lanes, South Bay Expressway, and SH 288 demonstrate three different routes back to public control."
      ]
    },
    {
      id: "limits",
      title: "What this sample does not prove",
      paragraphs: [
        "The 25 rows are not a complete FHWA inventory. They cannot answer what percentage of all U.S. toll facilities is privately controlled, how many lane-miles sit under concessions, or what share of national toll revenue reaches private investors.",
        "The sample does not show whether public or private facilities charge more. Rate comparisons require traffic mix, time-of-day pricing, vehicle classes, construction cost, lane miles, inflation, contract formulas, competing routes, and service levels.",
        "Ownership alone does not establish efficiency, maintenance quality, congestion relief, safety, or fairness. Those are separate empirical questions.",
        "The sample does establish that the phrase privately owned toll road covers several materially different structures. Some roads retain public title but private revenue rights. Some have private delivery but public revenue. Some were once private and are now public. A small number hold private title. Many are ordinary public authorities with contractors that have no ownership interest."
      ]
    },
    {
      id: "method",
      title: "Method, confidence and correction protocol",
      paragraphs: [
        "The sample was selected for structural variety, scale, geographic spread, public interest, and the availability of current primary evidence. It covers 25 facilities or systems in California, Colorado, Florida, Illinois, Indiana, Maine, Maryland, Massachusetts, New Jersey, New York, North Carolina, Ohio, Oklahoma, Pennsylvania, Texas, and Virginia.",
        "FHWA’s national toll-facility inventory was used for discovery and inventory references. Its general report describes facilities as of January 1, 2023, so it was not treated as proof of September 2026 ownership. Current authority reports, government project profiles, concession records, corporate portfolio pages, transaction announcements, regulator pages, and financial materials were used to refresh each row.",
        "Confirmed means the current public structure is directly established by primary authority records and does not depend on an unresolved private chain. Strong means the core title, operator, revenue, risk, parent, or transaction structure is supported, but one narrower field such as a billing subcontractor, complete equity split, exact handback date, or instrument-level debt remains open. Thirteen rows are Confirmed and twelve Strong.",
        "A correction should identify the record ID, disputed field, replacement value, effective date, and a dated primary source. Material changes should be applied to the CSV, article lookup, source ledger, visual data, and revision date together."
      ],
      bullets: [
        "Current billing subcontractors and instrument-level debt remain unresolved for several public systems.",
        "The full current equity split above Indiana Toll Road is not reconstructed beyond IFM’s disclosed fund stake.",
        "I-595’s original equity structure is documented, but current continuation and the exact handback date need refreshed agreement-level confirmation.",
        "Dulles Greenway’s exact title language and authorization term should continue to be checked against Virginia orders.",
        "The 91 Express Lanes, South Bay Expressway, and SH 288 retain open questions about underlying title, franchise terms, and current operating allocations."
      ]
    },
    {
      id: "faq",
      title: "Questions readers ask",
      paragraphs: [
        "Are U.S. toll roads privately owned? Some are, but the sample’s dominant structure is public title and public toll economics. Several publicly titled roads grant private companies long operating and revenue rights, while Dulles Greenway is a privately titled exception.",
        "Does an E-ZPass, FasTrak, SunPass, or TollTag bill identify the owner? No. The payment network or billing agency may process money for a different titleholder or revenue claimant.",
        "Do bondholders own toll roads? Normally no. They finance an authority or project company and may have a pledge of toll revenue and contractual remedies. That is different from legal title and operating control.",
        "Can foreign investors own U.S. toll-road interests? Yes. Foreign-listed companies and pension investors own equity in several concessionaires. On a publicly titled facility, they generally own the project company’s contractual rights rather than the government’s underlying road.",
        "What happens when a concession ends? The agreement typically requires operating rights and improvements to return to the public sponsor subject to handback standards. Governments can also buy out or terminate a concession earlier under contractual and financing rules."
      ]
    }
  ],
  indexable: true
};
