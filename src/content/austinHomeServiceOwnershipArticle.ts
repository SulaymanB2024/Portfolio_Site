import type { ResearchArticle } from './articleModels';

export const AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_SLUG =
  'who-owns-austin-home-service-companies';
export const AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_PATH =
  `/research/financial-systems/${AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_SLUG}`;

export const AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_SLUG,
  number: '20',
  category: 'FINANCIAL SYSTEMS',
  title: 'Who Owns Austin’s Home-Service Companies?',
  seoTitle: 'Who Owns Austin Home-Service Companies?',
  subtitle:
    'A verified map of the parent companies, private-equity sponsors, public corporations, franchises, and local operators behind 67 home-service brands advertising across Austin.',
  seoDescription:
    'Who owns Austin home-service companies? Explore 67 HVAC, plumbing, roofing, foundation, and pest-control brands by parent, sponsor, franchise, and local owner.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/austin-home-services-ownership-reader-hero.jpg',
    socialSrc: '/images/research/austin-home-services-ownership-social.jpg',
    alt: 'Monochrome editorial map connecting Austin houses and service vehicles to layered company, platform, and investment-firm nodes.',
    label: 'Austin home services / brand-to-owner map',
    caption:
      'The name on a truck can sit several layers below the legal entity, operating platform, and investor that ultimately controls the business.',
    objectPosition: '50% 50%',
  },
  date: '2026.07.26',
  lastVerified: '2026.07.26',
  readTime: '18 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'Austin homeowners encounter dozens of apparently separate home-service brands, but the public record connects many of them to a smaller set of platforms, sponsors, public companies, and franchise systems. The same record also shows why “locally managed,” “family founded,” and “locally owned” cannot be treated as synonyms.',
  evidenceBoundary:
    'This is a July 26, 2026 snapshot of 67 active consumer-facing brand records reconstructed from a larger audit package. Brand counts are not revenue, customer, job, permit, or market share. An A or B rating means the current ownership structure is supported well enough for publication; C and D records preserve partial or unresolved evidence. Sponsor investments, sale processes, franchise operators, legal entities, and consumer brands are kept separate. Ownership can change after the cutoff, and no claim here attributes price, service, or employment outcomes to an ownership type.',
  metrics: [
    { label: 'Active brands', value: '67' },
    { label: 'A/B ownership records', value: '48' },
    { label: 'Sponsor-backed brands', value: '14' },
    { label: 'Source records', value: '130' },
  ],
  resources: [
    {
      label: 'Complete publication package',
      href: '/research/austin-home-service-ownership-publication-package.zip',
      description:
        'Article, datasets, graph files, interactive tools, source ledger, methods, correction system, scripts, and QA records.',
      format: 'ZIP',
    },
    {
      label: 'Austin ownership brand table',
      href: '/research/austin-home-service-ownership-2026.csv',
      description:
        'The normalized brand-level table behind the 67-brand snapshot, including owner type, chain, evidence rating, and Austin footprint.',
      format: 'CSV',
    },
    {
      label: 'Machine-readable ownership dataset',
      href: '/research/austin-home-service-ownership-2026.json',
      description:
        'Brands, entities, relationships, transactions, evidence references, conflicts, and unresolved records in JSON.',
      format: 'JSON',
    },
    {
      label: 'Full article in Markdown',
      href: '/research/austin-home-service-ownership-article.md',
      description:
        'The complete 4,255-word source-linked article from the audited publication package.',
      format: 'MD',
    },
    {
      label: 'Formatted ownership report',
      href: '/research/austin-home-service-ownership-report.docx',
      description:
        'The complete formatted publication report, including findings, source register, methods, and publication assets.',
      format: 'DOCX',
    },
  ],
  content: [
    'Search for an Austin plumber, air-conditioning technician, roofer, foundation specialist, or pest-control company and the result can look intensely local: a familiar name, an Austin phone number, a decades-old founding story, and technicians dispatched from a nearby office. The legal and financial chain behind that name may be much larger. Radiant appears as an Austin brand inside T3 Services Group, which is a Riverside Company investment. Stan’s sits inside Master Trades Group, an L Catterton investment. Fox Service Company, Precision Heating & Air, and Daniel’s Plumbing & Air remain distinct customer-facing names while tracing to Southern Home Services and Gryphon Investors.',
    'That does not make the local identity fictitious. A company can keep its name, employees, managers, licenses, and service area after a transaction. Fox describes itself as locally managed and operated; Southern’s transaction history places Fox inside a larger platform. Both statements can be true. The ownership question is therefore not whether a company feels local. It is which brand the customer sees, which legal entity performs the work, which platform coordinates the business, and who holds the controlling or minority financial interest.',
    'The audited publication universe contains 67 active Austin-facing brands across four sectors. Thirty-two are classified as founder, family, or locally owned; 14 belong to sponsor-backed platforms; four are public-company brands; five are local franchise operators; 11 are private businesses whose controlling owner remains unresolved; and one—Alta Pest Control—is founder-controlled with a documented minority investment. Those are shares of researched brand records, not shares of the Austin market.',
  ],
  sections: [
    {
      id: 'ownership-map',
      title: 'The ownership map',
      paragraphs: [
        'The map starts with the consumer-facing brand because that is the unit a homeowner encounters. It then follows separately sourced edges through a DBA or operating entity, an immediate parent, a regional or national platform, a holding company, and an ultimate controller or investor. A franchise edge is not a parent-subsidiary edge. A minority investment is not a buyout. A platform can be locally managed while its equity is held elsewhere.',
        'Fourteen brand records in the July snapshot belong to sponsor-backed platforms. The table below summarizes the most visible chains and preserves uncertainty where a percentage or pending transaction was not established. The downloadable dataset contains the full 67-brand table, dated evidence IDs, and unresolved fields.',
      ],
      table: {
        caption: 'Selected current sponsor-backed Austin-facing ownership chains',
        columns: ['Consumer brand', 'Operating platform', 'Ultimate owner or sponsor', 'Published relationship', 'Rating'],
        rows: [
          ['Abacus Plumbing, Air Conditioning & Electrical', 'Wrench Group, LLC', 'Leonard Green & Partners and management; TSG Consumer Partners and Oak Hill minority', 'Wholly owned Wrench subsidiary; investor interests separately described', 'A'],
          ['Aptive Environmental', 'Aptive Environmental', 'Citation Capital; management retains a significant interest', 'Citation majority; management minority', 'A'],
          ['ARS/Rescue Rooter Austin', 'American Residential Services, LLC', 'GI Partners; Charlesbank and management retain interests', 'GI lead/majority; sale process reported in March 2026', 'A'],
          ['Austin Air Conditioning', 'SAS Service Partners', 'Storr Group', 'Storr-backed platform; seller rollover documented', 'A'],
          ['Daniel’s Plumbing & Air Conditioning', 'Southern Home Services', 'Gryphon Investors through North American Essential Home Services', 'Gryphon majority; management minority at holding-company level', 'A'],
          ['Fox Service Company', 'Southern Home Services', 'Gryphon Investors through North American Essential Home Services', 'Acquired brand; current locally managed wording retained', 'A'],
          ['Goettl Air Conditioning & Plumbing', 'Goettl Air Conditioning & Plumbing', 'Cortec Group', 'Sponsor investment; control percentage not publicly specified', 'B'],
          ['Groundworks', 'Groundworks Companies, LLC', 'KKR; Cortec retains minority positions', 'KKR controlling investment; Cortec retained interests; Foundation Support Specialists retained as a historical record', 'A'],
          ['Ja-Mar Roofing & Sheet Metal', 'Roofing Services Solutions', 'Dunes Point Capital', 'Acquired by sponsor-backed roofing platform', 'A'],
          ['Precision Heating & Air', 'Southern Home Services', 'Gryphon Investors through North American Essential Home Services', 'Acquired brand inside the Austin cluster', 'A'],
          ['Radiant Plumbing, Air Conditioning & Electrical', 'T3 Services Group', 'The Riverside Company', 'Current T3 partner and Riverside investment; percentage undisclosed', 'A'],
          ['Roger’s Plumbing', 'SAS Service Partners', 'Storr Group', 'Platform partnership; founder joined platform', 'A'],
          ['Service Wizard Heating & Air Conditioning', 'Champions Group Holdings', 'Sponsor transfer unresolved at cutoff', 'Platform acquisition verified; Blackstone transaction announced but not treated as closed', 'B'],
          ['Stan’s Heating, Air, Plumbing & Electrical', 'The Master Trades Group', 'L Catterton', 'Master Trades acquisition; L Catterton current investment', 'A'],
        ],
      },
    },
    {
      id: 'what-the-counts-show',
      title: 'What the 67-brand count does—and does not—show',
      paragraphs: [
        'The 67 active records divide into 26 HVAC, plumbing, and electrical brands; nine roofing and exterior brands; 12 foundation-repair brands; and 20 pest-control brands. Forty-eight of the 67 have an A or B current-ownership structure and are not classified as unresolved. Eleven retain an established customer-facing name after an acquisition or platform transaction.',
        'The largest classification remains founder, family, or local ownership: 32 brands, or 47.8% of the researched universe. Sponsor-backed platforms account for 14 records, or 20.9%. Public-company ownership accounts for four, local franchise operators five, unresolved private control 11, and a founder-controlled company with a minority investor one. The denominator is the 67 qualifying brand records, including unresolved records; percentages may differ slightly because of rounding.',
        'These numbers measure representation in a deliberately constructed census, not economic concentration. A one-truck local business and a multi-state platform brand each count once. Reviews, search rank, permits, licenses, locations, or advertising visibility can describe footprint, but none independently measures revenue or customers. The dataset therefore does not calculate market share, rank companies by size, or infer that an owner type caused a price or service outcome.',
      ],
      table: {
        caption: 'Ownership classification across the 67 active brand records',
        columns: ['Classification', 'Brands', 'Share', 'Interpretation boundary'],
        rows: [
          ['Founder, family, or local ownership', '32', '47.8%', 'Includes current self-reported local claims with evidence ratings; exact cap tables are not always public'],
          ['Sponsor-backed platform', '14', '20.9%', 'Control and minority interests are described separately where disclosed'],
          ['Public-company owned', '4', '6.0%', 'Consumer brand ultimately traces to a listed corporate parent'],
          ['Local franchise operator', '5', '7.5%', 'Local franchisee is separate from the franchisor and its investor'],
          ['Private, controlling owner unresolved', '11', '16.4%', 'Active operator verified; current controller not established well enough for publication'],
          ['Minority-invested, founder-controlled', '1', '1.5%', 'Alta’s Trivest relationship is a non-control minority investment'],
        ],
      },
    },
    {
      id: 'mechanical-trades',
      title: 'HVAC, plumbing, and electrical: retained names inside larger platforms',
      paragraphs: [
        'The mechanical trades contain the clearest multi-brand clusters. Southern Home Services bought Fox Service Company and Precision Heating & Air in 2020 and Daniel’s Plumbing & Air in 2022. Gryphon Investors announced a majority investment in Southern’s holding structure in 2021 while management retained a meaningful interest. A homeowner can therefore encounter three Austin-facing names that compete for attention while the ownership chain converges above them.',
        'Radiant provides another layered example. Riverside announced its investment in the Austin company in 2021, and T3 Services Group now lists Radiant as an Austin partner. The current evidence supports the chain from Radiant to T3 to Riverside; it does not disclose an ownership percentage that would justify inventing a more precise label.',
        'Stan’s changed hands in March 2024 when Treaty Oak Equity announced its sale to Master Trades Group. L Catterton lists Master Trades—formerly LTP Home Services Group—as a current investment. The retained Stan’s name and its Austin operating history are part of the consumer identity; Master Trades and L Catterton describe the current platform and financial layers.',
        'Abacus’s own privacy material calls the company a wholly owned subsidiary of Wrench Group. Investor reporting around Wrench describes Leonard Green and management as the majority interests and TSG Consumer Partners and Oak Hill as significant minority investors. Those are different claims at different layers: Wrench owns the brand company; multiple investors hold interests in Wrench.',
        'ARS/Rescue Rooter illustrates the need for a dated cutoff. GI Partners lists American Residential Services as a current portfolio company and lead investment dating to October 2020. Reuters reported on March 23, 2026 that the company was exploring a sale, with Charlesbank and management still invested. A process is not a completed sale. The July snapshot therefore keeps GI as the current lead owner and labels the process as reported, not closed.',
      ],
    },
    {
      id: 'roofing-foundation-pest',
      title: 'Roofing, foundation repair, and pest control follow different patterns',
      paragraphs: [
        'In roofing, Ja-Mar Roofing & Sheet Metal was acquired in April 2025 by Roofing Services Solutions, a Dunes Point Capital portfolio company. Ja-Mar remains an active retained Austin-facing brand. The transaction record supplies the ownership layer even though the company’s local name, staff, and operating history remain part of the customer experience.',
        'Foundation repair is less uniformly consolidated in the published universe. Groundworks acquired Foundation Support Specialists in 2022. KKR announced a significant Groundworks investment in 2023 while Cortec remained a shareholder. Other Austin-facing foundation companies are documented as family or locally owned, while several active operators remain unresolved because current legal control could not be established from satisfactory sources. Preserving “unresolved” is more accurate than treating the absence of an acquisition release as proof of independence.',
        'Pest control contains almost every ownership form in one sector. HomeTeam Pest Defense and Orkin trace to Rollins. Terminix traces through Rentokil North America to Rentokil Initial plc. Aptive is a Citation Capital majority investment with management retaining a significant interest. Alta accepted a non-control Trivest investment while its founders retained operational and financial control. Aire Serv and other franchise systems require a further split: the local franchisee owns or operates the local business under a contract, while a separate parent can own the franchisor.',
        'This variety matters because “private-equity backed” is not one legal relationship. It can mean majority control of a platform, a minority growth investment, a sponsor at the franchisor level, or a transaction announced but not yet closed. The public map uses different edge types for each instead of collapsing them into one label.',
      ],
    },
    {
      id: 'meaning-of-local',
      title: 'What “local” actually means',
      paragraphs: [
        'Locally owned describes equity control. Locally managed describes who runs day-to-day operations. Locally operated can describe employees, dispatch, licenses, and service delivery. Family founded is historical. Founder led describes an operating role. Franchise owned identifies the local franchisee, not the franchisor. A company may satisfy several of these descriptions at once.',
        'Fox is the cleanest example. Its current website says the company is locally managed and operated. Southern’s acquisition history and Gryphon’s investment record place it within a larger sponsored platform. The statements answer different questions. Calling the local claim false would overreach; translating it into local equity ownership would also be wrong.',
        'Founders can remain after selling control, roll equity into the buyer, sit on a board, or continue as president. None of those facts alone establishes continuing control. Conversely, a minority investor can provide growth capital without becoming the controlling owner. Alta’s Trivest announcement explicitly describes a non-control investment and continued founder control, so the map does not label Alta as bought out.',
        'Franchises create another common error. The franchisor licenses a name and operating system. The local franchisee is a separate business whose owner may be local. If a private-equity firm owns the franchisor, that does not automatically mean it owns the franchisee. The dataset preserves both the franchise relationship and the local-operator evidence where available.',
      ],
      bullets: [
        'Do not infer equity ownership from “locally managed” or “locally operated.”',
        'Do not infer independence from silence or from the absence of an acquisition announcement.',
        'Do not treat a franchise contract as a parent-subsidiary relationship.',
        'Do not turn a minority investment into a control claim.',
        'Do not report an announced sale as completed until closing is documented.',
      ],
    },
    {
      id: 'methodology',
      title: 'How ownership was verified',
      paragraphs: [
        'The source hierarchy begins with current government records, securities filings, sponsor portfolio pages, buyer and seller announcements, legal and privacy terms, official platform brand pages, and licensing records. Adviser, lender, and law-firm announcements provide transaction corroboration. Reuters, established local reporting, and reputable trade publications provide independent context. Directories, review sites, job postings, social platforms, and shared website infrastructure are leads rather than final proof.',
        'An A or verified claim normally requires two independent sources including a primary source, or a definitive current government or securities filing. A B or strongly supported claim can rely on one current primary source with no credible contrary evidence. C records are partial or probable and retain explicit limitations. D records are unresolved because the evidence is stale, conflicting, ambiguous, or insufficient.',
        'Every acquisition was tested for a later sale, recapitalization, merger, sponsor investment, or pending process. Dates were compared because an old acquisition release proves ownership at closing, not at the current cutoff. Syndicated versions of one press release were treated as one source group. Conflicts were preserved rather than silently selecting the preferred answer.',
        'The full package documents 75 brand records including historical or excluded rows, 170 entities, 102 sourced ownership and operating relationships, 29 transactions, 130 evidence records, 75 footprint records, 20 conflicts, and 25 unresolved research questions. It also contains the reproducibility scripts and QA evidence used to reconcile denominators, graph endpoints, source references, JSON, interactive assets, and the formatted report.',
      ],
    },
    {
      id: 'limitations-corrections',
      title: 'Limits, corrections, and the next verification date',
      paragraphs: [
        'The census is broad but not a state registry of every company capable of taking an Austin job. It includes brands with a current office, dedicated service-area evidence, applicable permit or licensing evidence, or active dispatch and advertising across the defined Austin metro. It excludes lead-generation sites, directories, manufacturers, purely commercial contractors, inactive listings, and companies whose only Austin connection is an unverified directory entry.',
        'Private-company cap tables are often unavailable. A current company statement can support a family or local classification without revealing each shareholder. Where legal entity evidence established the operator but not the controller, the record remains unresolved. Paid filings, direct company confirmation, or a future transaction announcement may change that status.',
        'Corrections should identify the brand, disputed field, effective date, current source, and whether the proposed change concerns a consumer name, legal entity, platform, investor, franchisee, or local operating status. The article and downloadable package are dated so a correction can update the relevant edge without rewriting historical transactions. ARS’s reported 2026 sale process is the practical warning: a statement can be correct at publication and stale soon afterward.',
      ],
    },
    {
      id: 'ownership-faq',
      title: 'Austin home-service ownership FAQ',
      paragraphs: [
        'Do private-equity firms own most Austin home-service brands? Not in this 67-brand census. Fourteen records, or 20.9%, are classified as sponsor-backed platforms. Another record has a documented non-control minority investor. The largest classification is founder, family, or local ownership, but the census is a brand count rather than market share.',
        'Does a local name mean the company is locally owned? No. A retained name can coexist with platform ownership, and locally managed or operated does not establish equity ownership. The ownership chain and the operating claim need separate evidence.',
        'Are franchises owned by their national brand? Usually not. A local franchisee operates under a contract with the franchisor. The franchisor’s parent or sponsor is a separate layer and should not be presented as the direct owner of the local franchisee without evidence.',
        'Can this map compare prices or service quality? No. Ownership records do not establish causal effects on price, service, employment, or customer outcomes. Those questions require comparable data and a research design built for them.',
      ],
    },
  ],
  sources: [
    {
      label: 'T3 Services Group — current partner brands, including Radiant Austin',
      href: 'https://t3servicesgroup.com/partners/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'The Riverside Company — T3 Services Group portfolio entry',
      href: 'https://www.riversidecompany.com/investment-portfolio/t3-services-group',
      lastVerified: '2026.07.26',
    },
    {
      label: 'The Riverside Company — investment in Radiant Plumbing & Air Conditioning',
      href: 'https://www.riversidecompany.com/currents/riverside-s-latest-investment-is-a-royal-flush',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Treaty Oak Equity — sale of Stan’s to Master Trades Group',
      href: 'https://www.businesswire.com/news/home/20240329645925/en/Treaty-Oak-Equity-Sells-Stans-Home-Services-Holdings-to-The-Master-Trades-Group',
      lastVerified: '2026.07.26',
    },
    {
      label: 'L Catterton — current Master Trades Group investment',
      href: 'https://www.lcatterton.com/investments.html',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Southern Home Services — acquisition of Daniel’s Plumbing & Air',
      href: 'https://www.southernhomeservices.com/blog/2022/april/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Gryphon Investors — majority investment in Southern and NAEHS',
      href: 'https://www.gryphon-inv.com/news/gryphon-investors-completes-majority-investment-in-southern-hvac-and-announces-new-home-services-holding-company/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Fox Service Company — locally managed and operated statement',
      href: 'https://www.foxservice.com/about-us/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Abacus — Wrench Group subsidiary disclosure',
      href: 'https://www.abacusplumbing.com/privacy-policy/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'GI Partners — current American Residential Services portfolio entry',
      href: 'https://www.gipartners.com/private-equity/portfolio/american-residential-services',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Reuters — reported ARS sale exploration, March 23, 2026',
      href: 'https://www.tradingview.com/news/reuters.com%2C2026%3Anewsml_L6N4071F9%3A0-american-residential-services-explores-3-5-billion-plus-sale-sources-say/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Dunes Point Capital — Roofing Services Solutions acquisition of Ja-Mar',
      href: 'https://www.dunespointcapital.com/news/roofing-services-solutions-acquires-ja-mar-roofing-sheet-metal/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Groundworks — KKR strategic investment with Cortec retained',
      href: 'https://www.groundworks.com/resources/kkr-makes-significant-investment-in-groundworks/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Citation Capital — majority investment in Aptive Environmental',
      href: 'https://www.citationcapital.com/news/citation-capital-invests-in-aptive-environmental',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Trivest Partners — minority investment in Alta Pest Control',
      href: 'https://www.trivest.com/news/trivest-partners-announces-investment-in-alta-pest-control/',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Brookfield Infrastructure — completed Enercare and Service Experts acquisition',
      href: 'https://bip.brookfield.com/press-releases/bip/brookfield-infrastructure-completes-c43-billion-acquisition-enercare-inc',
      lastVerified: '2026.07.26',
    },
    {
      label: 'KKR — completed acquisition of Neighborly',
      href: 'https://www.kkr.com/newsroom/news/news-details/2021/kkr-completes-acquisition-neighborly',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Rollins — current brand portfolio including Orkin and HomeTeam',
      href: 'https://www.rollins.com/about-us/brands/default.aspx',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Rentokil Initial — completed Terminix acquisition',
      href: 'https://www.rentokil-initial.com/media/news-releases/news-2022/terminix_completion.aspx',
      lastVerified: '2026.07.26',
    },
    {
      label: 'City of Austin Open Data — issued construction permits',
      href: 'https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Texas Department of Agriculture — structural pest-control license reports',
      href: 'https://texasagriculture.gov/Regulatory-Programs/Pesticides/Structural-Pest-Control-Service/Structural-Pest-Control-Reports-Current-Licenses',
      lastVerified: '2026.07.26',
    },
    {
      label: 'Texas State Board of Plumbing Examiners — licensee lists',
      href: 'https://tsbpe.texas.gov/free-licensee-list/',
      lastVerified: '2026.07.26',
    },
  ],
};
