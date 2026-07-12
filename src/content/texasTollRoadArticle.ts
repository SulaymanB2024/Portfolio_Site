export type TexasTollArticleBlock =
  | { kind: 'markdown'; markdown: string }
  | { kind: 'table'; tableId: string };
export type TexasTollArticleSection = { id: string; title: string; blocks: TexasTollArticleBlock[] };
export type TexasTollArticleTable = {
  id: string;
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  note: string;
};
export type TexasTollArticleSource = { id: string; label: string; note: string; hrefs: string[] };
export type TexasTollArticleFactGap = { title: string; items: string[] };
export type TexasTollArticleFaq = { question: string; answer: string };

export {
  TEXAS_TOLL_ARTICLE_DATE,
  TEXAS_TOLL_ARTICLE_DESCRIPTION,
  TEXAS_TOLL_ARTICLE_DISPLAY_TITLE,
  TEXAS_TOLL_ARTICLE_IMAGE,
  TEXAS_TOLL_ARTICLE_READ_TIME,
  TEXAS_TOLL_ARTICLE_SEO_TITLE,
  TEXAS_TOLL_ARTICLE_SLUG,
  TEXAS_TOLL_ARTICLE_TITLE,
  TEXAS_TOLL_ARTICLE_UPDATED,
  TEXAS_TOLL_ARTICLE_WORD_COUNT,
} from './texasTollRoadArticleMeta';

export const TEXAS_TOLL_ARTICLE_LEDE_MARKDOWN = "On October 8, 2024, the Texas Department of Transportation paid **$1,731,730,721** to end the private concession for the SH 288 managed lanes south of downtown Houston. Texas did not need to buy the highway’s land. The state already owned the corridor. What it bought back was a package of contractual rights: roughly 43 years of remaining toll revenue, the obligation and authority to operate the managed lanes, and the private company’s economic claim on the project. The payment first retired project debt. Whatever remained belonged to the shareholders.[S1](#source-s1)[S2](#source-s2)[S3](#source-s3)\n\nThe result depended on where an investor stood in the capital stack. Bondholders and the federal TIFIA lender were repaid. The state gained control of a road it had always legally owned. Abertis, the European toll-road operator that had paid about **$1.53 billion for 56.76%** of the concession company less than a year earlier, received **$642.4 million** and recorded a **€775.9 million pre-tax loss**. A transaction could therefore be a clean debt takeout, a political victory, and an equity disaster at the same time.[S4](#source-s4)[S5](#source-s5)\n\nThat is the ownership puzzle. A toll road can have a public titleholder, a private revenue claimant, pension and infrastructure-fund shareholders, secured creditors with veto rights, a separate billing agent, and a government that receives the facility at the end. Calling all of those parties “owners” hides more than it explains.\n\nTexas is a useful place to separate them. It has large public toll networks, state-run project systems, county and regional authorities, three mature private managed-lane concessions in Dallas–Fort Worth, a greenfield concession that went through Chapter 11, and a Houston concession that the state terminated. The same state contains most of the financing structures an infrastructure investor is likely to encounter." as const;

export const TEXAS_TOLL_ARTICLE_SECTIONS = [
  {
    "id": "a-road-can-have-seven-different-owners",
    "title": "I. A road can have seven different owners",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "Consider the **North Tarrant Express**, a 13.3-mile managed-lane concession on I-820 and SH 121/183 in the Dallas–Fort Worth area. Asking “Who owns it?” produces seven answers.\n\n**1. Physical ownership.** The State of Texas owns the highway and right-of-way. The concession company did not buy a strip of Texas real estate. It received contractual rights within a state highway corridor.\n\n**2. Statutory control.** The Texas Transportation Commission and TxDOT retain the public powers surrounding the facility: enforcement of the concession, oversight of safety and standards, approval rights over specified actions, and the ability to exercise contractual remedies. A concession is broad, but it is not sovereignty.\n\n**3. Revenue rights.** NTE Mobility Partners, LLC is entitled to the managed-lane toll economics through 2061, subject to operating costs, debt service, revenue sharing, contractual restrictions, and handback requirements. That right, rather than the pavement, is the core investable asset.\n\n**4. Equity ownership.** As of Ferrovial’s May 2026 fact book, a Ferrovial/Cintra affiliate held **62.97%** and a Meridiam affiliate held **37.03%**. Those percentages refer to the concession business, not 62.97% and 37.03% slices of a public highway.[S6](#source-s6)\n\n**5. Debt control.** At December 2025, NTE reported about **$1.60 billion** of project debt. Its bond documents restrict distributions if debt-service coverage falls below stated thresholds. Creditors hold liens on project revenues and contractual protections that can become more important than shareholder voting rights during distress. They do not own the roadway, but they can control what equity is allowed to take out of it.[S6](#source-s6)\n\n**6. Operations.** The project company is responsible for operating and maintaining the managed lanes. Toll billing is handled through the North Texas Tollway Authority’s collection platform; under the disclosed arrangement, TxDOT remits amounts to the concession project within two to three business days. That shifts much of the tag and collection risk away from the private operator even though traffic risk remains with the project.[S6](#source-s6)\n\n**7. Residual ownership.** When the concession ends, the contractual toll and operating rights expire and the asset remains with the state, subject to the agreement’s handback condition. Equity owns a wasting legal interest. There is no perpetual terminal value after 2061.\n\nThis layered model prevents three common errors. Debt is not equity ownership, even when lenders have strong remedies. An operator is not necessarily the economic owner, especially when billing, maintenance, and management are divided among contractors. And a “private toll road” may be a publicly owned highway carrying a time-limited private claim on cash flow.\n\nA concession company can still be extremely valuable. The distinction is legal, not semantic. The asset being bought and sold is a bundle of rights: the ability to charge, the formula governing rates, protection against certain competing actions, control of operating decisions, access to the roadway, and the remaining time before those rights disappear."
      }
    ]
  },
  {
    "id": "how-a-toll-road-turns-traffic-into-equity-cash",
    "title": "II. How a toll road turns traffic into equity cash",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "The first line of a toll-road model is simple:\n\n```text\n\\text{Gross toll revenue} = \\text{traffic volume} \\times \\text{average toll paid}\n```\n\nThe simplicity ends there. “Traffic” may mean transactions, trips, axles, or vehicle miles. The average toll changes by entry and exit point, time of day, vehicle class, occupancy status, tag status, and congestion. Billed revenue is not collected revenue. A road can post rapid top-line growth while producing little distributable cash.\n\nA simplified waterfall looks like this:\n\n```text\nBilled tolls\n  – HOV discounts, exemptions, leakage, and unpaid bills\n  – collection and customer-service costs\n= collected toll revenue\n  – routine operations and maintenance\n  – major maintenance and lifecycle capital spending\n= cash available before financing\n  – interest and scheduled principal\n  – required debt-service and maintenance reserves\n  – government revenue sharing\n  – taxes, where applicable\n= cash available for equity distributions\n```\n\nEach line has its own economic driver.\n\n**Traffic volume** responds to population, employment, trip patterns, freight, fuel prices, remote work, and the quality of free alternatives. A metropolitan area can grow while a road disappoints because the corridor is in the wrong place, ramps do not match origins and destinations, or development arrives later than forecast.\n\n**Average toll** reflects more than posted price. On a fixed schedule, it moves with trip length, vehicle mix, and periodic rate decisions. On a managed lane, software may reprice every few minutes to preserve speed. The product being sold is then not just access. It is a higher probability of arriving on time.\n\n**Collection quality** matters. A customer with a valid electronic tag is cheaper and more likely to pay than a mailed invoice. Administrative fees can improve recovery but create political resistance. The DFW concessions are unusual because NTTA handles billing and the project companies receive rapid public remittance. Their margins therefore should not be treated as a universal benchmark for toll roads that bear their own violation and collection risk.\n\n**Operating costs** are usually modest relative to revenue once an electronic system is mature. That is part of the institutional appeal. But low routine expense can obscure large, uneven capital obligations. Pavement rehabilitation, bridge work, software replacement, gantry systems, drainage, and mandatory lane additions arrive in blocks rather than smooth annual amounts.\n\nThe North Tarrant Express shows the difference. In 2025 it reported **$323 million of revenue** and **$278 million of adjusted EBITDA**, an 86.1% margin. LBJ Express reported **$244 million** and **$202 million**, an 82.8% margin. NTE 35W reported **$368 million** and **$294 million**, a 79.9% margin. Calculated revenue per transaction was about **$8.73**, **$5.30**, and **$7.08**, respectively. These are sponsor-reported adjusted EBITDA figures, not audited cash available for debt service, and they benefit from the collection arrangement.[S6](#source-s6)\n\nThe debt burden changes the interpretation. Reported 2025 net debt was about **5.3 times adjusted EBITDA at NTE**, **10.1 times at LBJ**, and **5.6 times at NTE 35W**. LBJ can therefore have a high operating margin and still be the most financially sensitive of the three. Interest, principal, reserve requirements, and refinancing terms sit between EBITDA and the shareholder.[S6](#source-s6)\n\nRevenue sharing also matters. The DFW agreements use progressive formulas that can transfer up to 75% of revenue above specified bands to TxDOT. During 2025, disclosed government-sharing amounts included **$26.4 million at NTE 35W** and **$8.1 million at NTE**, plus separate sharing of refinancing gains and the LBJ “Wishbone” extension. Strong performance does not flow one-for-one to equity.[S6](#source-s6)\n\nNor does a mature road become maintenance-free. NTE’s mandatory capacity improvement was triggered in 2023. The project disclosed roughly **$355 million** of works, financed partly with a **$414 million** private activity bond issue; construction was 67% complete at year-end 2025. An investor valuing the road on current EBITDA without the contractual expansion would overstate equity value.[S6](#source-s6)\n\n### Pricing power is conditional\n\nThe DFW managed lanes reprice as often as every five minutes. For 2026, the disclosed “soft cap” was **$1.156 per mile**, indexed to CPI-U. Rates can exceed it under mandatory congestion conditions, with the system designed around a 50 mph service target. Heavy vehicles face multipliers. Qualifying high-occupancy vehicles receive discounts that are reimbursed under public arrangements.[S6](#source-s6)\n\nThis looks like utility pricing power, but it is not unlimited. The demand curve still exists:\n\n```text\n\\text{Revenue} = \\text{toll price} \\times \\text{paid traffic}\n```\n\nA higher rate raises revenue only if the lost volume is small enough. At peak congestion, the purpose of a managed-lane price may be to restrain demand so the lane remains fast. At off-peak times, a high toll can simply empty the road. Political tolerance creates another ceiling even when the contract permits more.\n\nSH 130 uses a different framework. Its concession ties annual toll escalation to nominal Texas gross state product per capita and does not require reductions when that measure falls. The former SH 288 contract combined dynamic pricing with annual parameters: a minimum increase equal to the greater of 2% or CPI, and a cap equal to the greater of 3% or nominal Texas GSP per capita. These clauses can provide inflation protection, but only if drivers continue to pay.[S13](#source-s13)[S4](#source-s4)\n\n### Leverage makes the equity behave like an option\n\nSuppose a concession is worth 100 and carries 70 of debt. Equity is 30. A 10% decline in enterprise value reduces equity to 20, a 33% loss. A 20% increase raises equity to 50, a 67% gain. The road’s physical condition can be unchanged while the equity value moves sharply.\n\nThe timing is harsher in greenfield projects. Debt service begins before traffic has fully matured. A forecast miss in year three can be fatal even if the corridor becomes valuable in year fifteen. A well-seasoned public system can absorb that ramp-up through network revenue; a stand-alone concession may not have the time or liquidity.\n\nConcession life adds another constraint. A road with 35 years remaining is not equivalent to one with 70 years. Every year that passes removes a year of cash flow. A valuation can include a handback payment only if the contract actually provides one. It cannot append a perpetual terminal value to a right that legally expires.\n\n### Why institutions still want the exposure\n\nInfrastructure funds and pension plans value duration, barriers to entry, and the prospect of inflation-linked prices. Insurers and bond investors value long-dated contractual debt service. Banks finance construction and refinancing. Sovereign and pension capital often enters through funds or co-investments. Distressed-debt funds wait for forecasts to fail, buy loans below par, and convert creditor rights into equity.\n\nThe attraction is strongest when a corridor is already built, traffic is proven, the toll formula is explicit, major maintenance is funded, and the concession has decades left. The weaknesses are the mirror image: forecast error, political rate pressure, free-road expansion, high leverage, lumpy rehabilitation, and a contract that can be terminated or expires sooner than the model assumes.\n\nGovernments use concessions for their own reasons. A private consortium can supply equity, construction execution, and balance-sheet capacity; it can accept cost, schedule, traffic, and lifecycle risks that a public agency does not want. The structure can advance a road earlier. SH 130’s federal project record says TxDOT estimated the P3 delivered Segments 5–6 about 20 years sooner than conventional funding would have allowed.[S11](#source-s11)\n\nBut “private finance” is rarely pure private capital. NTE and LBJ used federal TIFIA loans, tax-advantaged private activity bonds, and substantial public funds. Private equity requires a higher return than public tax-exempt debt. A concession is financially sensible only when the value of acceleration, risk transfer, and operating incentives exceeds that extra cost and the rigidity of a multi-decade contract."
      }
    ]
  },
  {
    "id": "the-texas-ownership-map",
    "title": "III. The Texas ownership map",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "The material Texas market is best understood by system, not by counting every signed highway as a separate company. NTTA’s roads support one pledged network. CTRMA separates its system from the non-system MoPac Express facility. TxDOT’s Central Texas Turnpike System pools SH 130 Segments 1–4, SH 45 North, SH 45 Southeast, and Loop 1. Treating each component as an independent business would double-count revenue and ignore cross-collateralized debt."
      },
      {
        "kind": "table",
        "tableId": "table-1-texas-toll-road-ownership-map"
      },
      {
        "kind": "table",
        "tableId": "table-2-private-concession-comparison"
      },
      {
        "kind": "markdown",
        "markdown": "### Public systems are businesses without shareholders\n\nNTTA is the largest clear example. Its nine-member board has two appointees from each of Collin, Dallas, Denton, and Tarrant counties, plus one gubernatorial appointee. The system includes the Dallas North Tollway, President George Bush Turnpike, Sam Rayburn Tollway, Chisholm Trail Parkway, 360 Tollway, and smaller facilities. In 2025 it recorded **961.0 million transactions**, **$1.253 billion of toll revenue net of bad debt**, **$1.105 billion of net revenue available for debt service**, and **$675.7 million of debt service**, for calculated coverage of **1.64 times**. Long-term debt was **$8.519 billion**.[S15](#source-s15)[S16](#source-s16)\n\nThose figures belong to the system, not to eight separate stand-alone companies. Revenue pledges let mature roads support newer ones. That lowers ramp-up risk and can improve borrowing terms, but it makes individual-road returns harder to see.\n\nHCTRA is a Harris County enterprise fund governed through Commissioners Court rather than a shareholder board. For the fiscal year ended September 30, 2025, it reported **$1.028 billion of toll revenue**, **$484.9 million of operating income after $115.5 million of depreciation**, and **$2.759 billion of bond principal**. Its reported revenue-bond coverage was **5.10 times**. It also transferred **$398.6 million** out under transportation-law restrictions, showing how public toll cash can finance broader mobility purposes rather than dividends.[S17](#source-s17)\n\nCTRMA is an independent regional authority. The governor appoints its chair; Travis and Williamson counties each appoint three board members. Its system includes 183A, 290, 71, 45SW, and 183, while MoPac Express is treated as a non-system facility. In fiscal 2025, consolidated toll revenue was **$276.4 million** and principal on notes, bonds, and other obligations was about **$2.448 billion**. The pledged system reported **2.28 times** debt-service coverage.[S18](#source-s18)\n\nTxDOT’s own systems operate at another layer. In fiscal 2025, the Central Texas Turnpike System reported **$337.6 million** of operating revenue and **$160.3 million** of debt service. The Grand Parkway System reported **$393.3 million** and **$175.4 million**, respectively. I-35E managed lanes and SH 249 are separately financed state projects. Other TxDOT toll lanes, including portions of the DFW Connector, I-30, LBJ East, and Midtown Express, were reported as non-financed projects.[S21](#source-s21)\n\nFort Bend County’s two public authorities demonstrate that “public debt” also needs qualification. FBCTRA had **$68.5 million** of fiscal 2025 toll revenue and **$526.9 million** of outstanding bond principal; its capital structure includes revenue debt and tax-supported obligations. The separate Grand Parkway authority reported **$45.8 million** of toll revenue and **$160.0 million** of principal, using state right-of-way under a right-of-use arrangement.[S19](#source-s19)[S20](#source-s20)\n\nPublic toll debt is therefore not uniformly taxpayer-backed or uniformly isolated. NTTA relies on system revenue rather than legislative appropriations. HCTRA’s senior and first-lien bonds are toll-backed, while legacy tax bonds also carry ad valorem support. Fort Bend has used tax-supported structures. Grand Parkway bonds are issued through a state component corporation with their own pledged revenues and support mechanisms. The bond documents, not the word “public,” determine recourse.\n\nCould a public authority sell one road? In theory, Texas can authorize new concessions or asset transfers. In practice, a road pledged to system debt cannot be removed cleanly without satisfying release tests, obtaining required consents, or defeasing debt. The economics of a mature road may already support bonds issued for the rest of the network. A sale would therefore be a financing reorganization and a political act, not a simple asset disposal."
      }
    ]
  },
  {
    "id": "sh-130-the-danger-of-believing-the-traffic-model",
    "title": "IV. SH 130: the danger of believing the traffic model",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "SH 130 Segments 5–6 is the cleanest Texas example of an infrastructure asset surviving while its original equity does not.\n\nTxDOT signed the concession agreement in March 2007. The 41-mile southern extension opened in October 2012, with service beginning in November, under a 50-year design-build-finance-operate-maintain concession. Texas retained title. The concession company received toll rights, shared specified revenue with TxDOT, and assumed the project’s operating and financing obligations.[S10](#source-s10)[S11](#source-s11)\n\nThe original project cost was **$1.328 billion**. Funding included **$685.8 million of senior bank loans**, a **$430 million TIFIA loan**, **$209.8 million of private equity**, and **$2.3 million of interest income**. Cintra held 65% of the original venture and Zachry 35%. The federal loan was subordinate to the senior banks but senior to equity. That order became decisive.[S11](#source-s11)[S12](#source-s12)\n\nThe investment thesis appeared intuitive. I-35 between Austin and San Antonio was congested. SH 130 offered an 85 mph bypass, freight capacity, and a growing regional economy. The problem was that a forecast of corridor congestion is not the same as a forecast of paid demand on a particular alignment.\n\nFederal reviews found toll revenue more than **60% below original forecasts** in the early operating period. Many drivers and truckers stayed on free I-35. The project exhausted its liquidity facility, negotiated payment relief, and entered Chapter 11 in March 2016.[S12](#source-s12)\n\nThe documents establish the forecast miss; they do not support a single-cause story. Several mechanisms fit the observed result. SH 130 sat east of many origins and destinations, so some users had to drive farther to reach it. A high speed limit reduces travel time only if access and exit points match the trip. Truckers compare the toll with fuel, schedule reliability, company policy, and the chance that I-35 traffic will be manageable. Development near a greenfield corridor can take longer than a debt model allows. A free alternative with miserable traffic can still win if the driver’s value of time is below the toll.\n\nThe financing left little room for that learning curve. A Kentucky Public Pensions Authority investment memorandum later described the failure as a combination of optimistic traffic, excessive leverage, and an adverse interest-rate swap, with construction defects adding cost and litigation. Those are secondary investment-review statements, but they match the capital structure’s vulnerability.[S13](#source-s13)\n\nIn bankruptcy, the pavement did not disappear. Drivers continued using the road. TxDOT remained the titleholder. What changed was the ownership of the concession company and the priority of financial claims.\n\nStrategic Value Partners had bought debt from European banks at a discount. The confirmed reorganization became effective on June 28, 2017. The original Cintra and Zachry equity was eliminated. U.S. DOT states explicitly that it received **subordinated debt and equity interests** in the reorganized borrower. The more granular 2Q 2024 diligence in the supplied investment report attributes approximately **65%** to SVP-controlled vehicles, **32%** to U.S. DOT / Build America, and **4%** to other holders; the rounded figures sum to 101%.[S11](#source-s11)[S13](#source-s13)\n\nThat answers the narrow ownership question: **the federal government became a true equity holder as part of a creditor recovery, while also retaining a subordinated debt interest.** Its percentage is not merely shorthand for the unpaid TIFIA loan. The exact holding vehicle, voting rights, distribution waterfall, and transfer restrictions are not fully disclosed in the public sources reviewed, so “federal minority equity interest received through restructuring” is safer than presenting the dated estimate as ordinary common stock with standard governance rights.\n\nThe reorganized company emerged with **$260 million of new financing**, according to its current corporate history, and says it has invested more than **$160 million** in roadway improvements. It reported **14.4 million transactions in 2025**, traffic growth of 86% since 2019, and heavy-truck growth of nearly 130%. The 2024 pension memorandum said revenue and EBITDA roughly doubled from 2019 to 2023, with an EBITDA margin near 83% and free-cash-flow conversion around 89% to 91%. The operating data are useful, but much of the recent financial detail originates from the company or an investment sponsor rather than audited public statements.[S13](#source-s13)[S14](#source-s14)\n\nSH 130 may now be a better road investment than it was at opening. That does not vindicate the original equity. SVP bought into a lower basis after debt impairment, construction remediation, years of regional growth, and a reset capital structure. A 2024 continuation-vehicle proposal sought **$1.45 billion** and contemplated holding the asset beyond the life of SVP’s original fund. That demonstrates a plausible secondary-market route, not proof of a completed 2026 sale or current valuation.[S13](#source-s13)\n\nA future acquisition would be an equity purchase in the concession company, subject to TxDOT and financing consents. The federal minority stake adds negotiation complexity. A proposed 20-year concession extension mentioned in the pension memorandum is upside only if Texas grants it; it cannot be capitalized as though already contractual. Current project debt and audited cash available for debt service were not located. Those omissions matter more to valuation than the road’s recent traffic headline."
      }
    ]
  },
  {
    "id": "sh-288-the-value-of-a-termination-clause",
    "title": "V. SH 288: the value of a termination clause",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "SH 288 presents the opposite sequence. Traffic and operating margins were strong enough to attract a major brownfield investor, but the government exercised an option that ended the private equity story.\n\nTxDOT executed the comprehensive development agreement in March 2016 with Blueridge Transportation Group. The project added four managed lanes over 10.3 miles, rebuilt major interchange components, and placed operation and maintenance obligations on the concessionaire. Substantial completion occurred in November 2020. The contractual term ran to March 2068.[S1](#source-s1)[S3](#source-s3)\n\nThe reported project cost was **$1.0635 billion**. Financing included **$298.6 million of private activity bonds**, a **$357.0 million TIFIA loan**, **$14.9 million of capitalized TIFIA interest**, **$17.1 million of public funds for the Texas Medical Center connection**, and **$375.3 million of developer and third-party equity**. Original participants included ACS Infrastructure, InfraRed, Shikun & Binui, Northleaf, Clal, and Star America.[S3](#source-s3)\n\nBy late 2023 the cap table had consolidated. Abertis acquired **56.76%** for about **$1.53 billion**; ACS retained **43.24%** through ACS SH288 Holdings, LLC. The acquisition presentation reported 2023 pro forma revenue of **$90 million**, adjusted EBITDA of **$66 million**, and gross debt of **$654 million** at December 31, 2022. The lanes used dynamic pricing, with contractual annual parameters tied to CPI and Texas nominal GSP per capita.[S4](#source-s4)\n\nThe state’s power sat in Section 31 of the agreement: termination for convenience. In July 2024 the Texas Transportation Commission determined that exercising the right was in TxDOT’s interest. The concession ended on October 8. Control reverted to TxDOT, and the Texas Transportation Finance Corporation was authorized to develop and operate the project. The state funded the **$1.7317 billion** payment through a State Highway Fund loan, later refinanced with roughly $1.7 billion of TTFC toll-revenue and refunding bonds.[S1](#source-s1)[S2](#source-s2)[S22](#source-s22)\n\nThe federal project record specifies the waterfall: termination proceeds first repaid all outstanding debt, including TIFIA, and the balance was available to shareholders. The TIFIA loan was repaid in full on the termination date. Abertis reported receiving **$642.365 million** and recording a **€775.857 million pre-tax loss**, or **€581.892 million after tax**.[S3](#source-s3)[S5](#source-s5)\n\nSeveral valuation comparisons are possible, but each needs a warning label.\n\n* **Implied equity value at Abertis entry:** $1.53 billion divided by 56.76% equals approximately **$2.70 billion** for 100% of the equity. Adding the separately reported $654 million of gross debt produces an indicative enterprise value of **$3.35 billion**. This mixes a late-2023 transaction price with debt measured at year-end 2022, so it is a rough inference, not a closing balance sheet.\n* **Termination payment multiples:** $1.7317 billion equals **19.2 times** 2023 pro forma revenue and **26.2 times** adjusted EBITDA. Those are gross transaction multiples because the payment covered debt and equity; they are not equity multiples.\n* **Estimated gross equity pool:** subtracting approximately $650 million of debt from the payment leaves about **$1.08 billion** before fees, reserves, hedges, working-capital adjustments, and other claims. The actual shareholder distributions need the closing statement.\n* **Value per remaining concession year:** the payment divided by approximately 43.4 remaining years is **$39.9 million per year**. This is descriptive, not a valuation method; early cash flow is worth more than late cash flow.\n* **Payment versus original equity:** the state’s gross payment was about **4.6 times** the original $375.3 million equity contribution. That does not mean the original sponsors earned 4.6 times. Debt was repaid first, ownership changed, capital may have been added or distributed, and the money was invested over years.\n\nThe cleanest evidence of stakeholder outcome is Abertis’s own loss. The company bought a controlling interest at a valuation well above the later contractual payment. Creditors were protected by the termination waterfall. Earlier sellers may have crystallized gains. Texas paid a large amount but gained decades of revenue and rate control. “Windfall” or “loss” depends on whose cash flows are being measured.\n\nFor fiscal 2025, TxDOT reported **$107.35 million of SH 288 operating revenue**, **$11.36 million of operating expense**, and **$2.73 million of maintenance expense**, excluding the later bond refinancing treatment. TxDOT has said public control should permit lower tolls and slower escalation than under the former concession. HCTRA supports billing and account functions; TTFC holds the public operating and revenue mandate.[S21](#source-s21)[S22](#source-s22)\n\nSH 288 is not a clean precedent for buying NTE, LBJ, NTE 35W, or SH 130. Its termination formula, toll parameters, debt package, remaining term, and corridor economics were specific to its agreement. A DFW buyout would require the rights and compensation language in the relevant CDA, plus treatment of revenue-sharing and mandatory-capacity obligations. SH 130 has a different greenfield history and a federal equity holder. SH 288 proves that government optionality can be highly valuable. It does not supply a universal multiple."
      }
    ]
  },
  {
    "id": "public-authority-or-private-concession",
    "title": "VI. Public authority or private concession?",
    "blocks": [
      {
        "kind": "table",
        "tableId": "table-3-public-versus-private-toll-road-economics"
      },
      {
        "kind": "markdown",
        "markdown": "Public authorities possess a financing advantage that is easy to understate. Tax-exempt bonds, no private-equity return requirement, indefinite life, governmental powers, and network pledges can lower the annual revenue needed to support a road. A strong existing system can carry a weak new segment until development catches up.\n\nThat same pooling can weaken investment discipline. A board may approve expansion because the network can finance it, even if the new road’s stand-alone return is poor. Excess revenue can migrate to broader transportation programs. Political rate decisions may delay needed increases. Individual asset performance can disappear inside a system total.\n\nPrivate concessions make the asset return more visible. Equity has a basis, a contractual term, a distribution test, and a measurable loss if traffic fails. Construction and operating obligations can be enforced. Management has a direct incentive to price, maintain, and market the asset efficiently.\n\nYet private structure does not prove private operating superiority. The DFW projects receive collection support through public systems. Their financing relies on federal credit and tax-advantaged bonds. Their required equity return raises the cost of capital. Contract negotiation, monitoring, refinancing sharing, and termination provisions add expense. A higher EBITDA margin can reflect risk allocation rather than better collection productivity.\n\nThe efficiency test is therefore counterfactual: could the public sponsor have delivered the same road, at the same time, with the same lifecycle discipline, for a lower risk-adjusted cost? A public authority with unused debt capacity and competent operations may be cheaper. A constrained agency facing construction, schedule, and demand uncertainty may rationally pay more for transfer. The answer depends on the project, not ideology.\n\nA toll road also resists a single asset-class label. It resembles **real estate** because location is permanent. It resembles a **utility** because substitutes are limited and prices may be indexed. It resembles a **bond** because cash flows can be long-dated and debt-heavy. It remains an **operating business** because demand, service quality, incidents, billing, maintenance, and political relations determine the residual. The finite concession term keeps it from being any one of those cleanly."
      }
    ]
  },
  {
    "id": "what-makes-a-texas-toll-road-valuable",
    "title": "VII. What makes a Texas toll road valuable?",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "Texas supplies favorable macro conditions. The Census Bureau estimated **31.71 million residents** on July 1, 2025, up **8.8%** from the April 2020 base. Dallas–Fort Worth reached roughly **8.5 million**, up about 11% over that period, with substantial growth in outer counties. Houston and DFW posted some of the country’s largest one-year metropolitan population gains in 2023–24.[S23](#source-s23)\n\nThe state’s activity centers are dispersed. Jobs, homes, airports, warehouses, ports, and industrial sites are separated by long road trips. Transit is limited for many suburb-to-suburb routes. Texas also moves enormous freight volumes: the state freight plan reported roughly 4 billion tons in 2019 and projects more than 8 billion by 2050. Congestion data show that most of Texas’s worst bottlenecks remain concentrated in the four largest metropolitan areas.[S24](#source-s24)[S25](#source-s25)\n\nThose conditions make a toll option useful. They do not rescue a badly placed road.\n\nThe relevant unit is the trip, not the state. An investor needs to know where drivers start, where they exit, whether the toll lane connects through the bottleneck, and how many minutes it saves at the time they travel. Ramp placement can matter more than regional population. A prosperous commuter may pay $12 to avoid an uncertain delay before a flight or medical appointment; the same driver may refuse $3 on a quiet weekend. A trucking fleet may value reliability but reject a toll that cannot be recovered from the shipper.\n\nFree-road capacity is the most obvious substitute. Widening a parallel highway can reduce toll demand, though construction disruption can temporarily increase it. Contractual protection against competing facilities is never absolute; governments preserve rights to improve their networks. SH 130’s agreement, for example, contained a competing-facilities zone but excluded I-35 and projects already in regional plans.[S12](#source-s12)\n\nRemote work can reduce five-day commuting and flatten peaks. It can also make the remaining peak more irregular, increasing the value of reliability on specific days. Fuel prices raise the full cost of a longer bypass. Residential development can create traffic, but only after homes are occupied and connected to useful interchanges. Freight growth helps only if vehicle classes are permitted and the corridor matches logistics routes."
      },
      {
        "kind": "table",
        "tableId": "table-4-what-determines-toll-road-equity-value"
      }
    ]
  },
  {
    "id": "can-an-investor-actually-buy-one",
    "title": "VIII. Can an investor actually buy one?",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "A good road is not automatically an investable opportunity. Access may be unavailable, the price may capitalize all growth, or the only instrument may be a low-yield bond. The relevant Texas routes differ sharply.\n\nTable 2, presented with the ownership map above, supplies the comparable contract and capital-structure facts for the five principal concessions.\n\n**NTE** offers a seasoned corridor, strong reported cash flow, and about 35 years of term. Cumulative project distributions through 2025 were about **$1.172 billion**, 2.75 times original project equity before considering timing, additional capital, taxes, or residual value. The mandatory-capacity program and government sharing reduce free upside. A buyer would most plausibly enter through a sale by Meridiam, a sponsor-level transaction, or project bonds; Ferrovial’s listed shares provide diluted exposure across a much larger portfolio.[S6](#source-s6)\n\n**LBJ** has an attractive urban bottleneck and 2025 adjusted EBITDA of $202 million, but its roughly **10.1 times** net-debt-to-EBITDA ratio leaves less room for error. Cumulative distributions of $952 million exceeded original equity in nominal dollars, yet that statistic says little about today’s entry price. APG- or Meridiam-managed interests could theoretically trade in the secondary market. There is no evidence at the cutoff that they are offered for sale.[S6](#source-s6)\n\n**NTE 35W** produced the highest 2025 revenue of the three DFW concessions, $368 million, and has benefited from staged expansion. It also paid the largest disclosed 2025 revenue share. Its practical acquisition routes resemble LBJ’s: sponsor stakes, infrastructure-fund or pension secondaries, project bonds, or a recapitalization. The main valuation question is how much growth remains after sharing and future corridor obligations.[S6](#source-s6)\n\n**SH 130** is the more specialized opportunity. It has become a freight and reliability asset after a failed greenfield ramp-up. SVP’s continuation-vehicle process shows that institutional secondary capital can access it, but the exact 2026 debt, distributions, and cap table are not public. The U.S. government’s minority interest and any TxDOT transfer consent narrow the buyer universe. Upside comes from traffic, freight, adjacent development, and a possible extension; downside comes from repeating the original mistake by capitalizing those possibilities before they are contractual or realized.\n\n**SH 288** no longer offers concession equity. A financial investor can consider TTFC toll-revenue bonds, service contracts, or indirect exposure through firms operating for the state. Those instruments have different economics. A bondholder receives contracted debt service, not the residual toll upside that Abertis expected.\n\nPublic systems are investable mainly through municipal securities. NTTA, HCTRA, CTRMA, TxDOT systems, and Fort Bend issuers offer debt exposure with varying pledges, coverage, tax support, and maturities. TIFIA itself is a federal direct-loan program rather than a readily purchased equity route. Distressed investors usually need a project-specific loan or bond that can be acquired below par and carries restructuring rights, as SH 130’s history illustrates.\n\nPrice remains the dividing line. A concession with proven traffic, inflation-linked rates, and 35 years left can be a poor investment at a 4% equity yield and a good one after a forced deleveraging. A publicly run road can be economically efficient yet offer only a bond with limited upside. “Investable” means there is an accessible security whose price compensates for traffic, leverage, maintenance, contract, and political risk. It does not mean the road looks busy."
      }
    ]
  },
  {
    "id": "closing",
    "title": "Closing: ownership is a stack of claims",
    "blocks": [
      {
        "kind": "markdown",
        "markdown": "Texas usually owns the pavement beneath its major toll concessions. That fact does not tell a driver where the toll payment goes or an investor who bears the loss.\n\nThe cash may belong first to a project company, then to employees and contractors, then to reserve accounts, bondholders, a federal lender, and the state under a sharing formula. Equity receives what remains. During distress, creditors can become the equity. During a government buyout, lenders can be paid in full while a recent shareholder loses most of its investment. At expiration, the contractual claim disappears and the state keeps the road.\n\nSH 130 remained open when its original equity was destroyed. SH 288 cost Texas $1.7 billion to reclaim even though Texas already held title. Those outcomes are not contradictions. They are what happens when physical ownership, statutory authority, revenue rights, debt control, operations, and residual ownership sit with different parties."
      }
    ]
  }
] as const;

export const TEXAS_TOLL_ARTICLE_TABLES = [
  {
    "id": "table-1-texas-toll-road-ownership-map",
    "caption": "Table 1. Texas toll-road ownership map",
    "columns": [
      "Facility or system",
      "Region",
      "Physical owner",
      "Toll-revenue owner",
      "Concessionaire",
      "Current direct equity owners",
      "Ownership percentages",
      "Ultimate owners",
      "Concession expiration",
      "Current status",
      "Evidence date"
    ],
    "rows": [
      [
        "North Texas Tollway System (NTTA)",
        "DFW",
        "NTTA; Sam Rayburn Tollway is a right-to-use state asset",
        "NTTA system",
        "None",
        "Not applicable",
        "Public authority",
        "No shareholders",
        "None; SRT use right ends 2058",
        "Operating public, system-pledged network",
        "FY ended Dec. 31, 2025; board data 2026"
      ],
      [
        "Harris County Toll Road Authority",
        "Houston",
        "Harris County",
        "HCTRA enterprise fund",
        "None",
        "Not applicable",
        "County enterprise",
        "Harris County",
        "None",
        "Operating public system",
        "FY ended Sept. 30, 2025"
      ],
      [
        "Central Texas Regional Mobility Authority system",
        "Austin",
        "CTRMA / applicable public right-of-way owners",
        "CTRMA system; MoPac Express is non-system",
        "None",
        "Not applicable",
        "Independent public authority",
        "No shareholders",
        "None",
        "Operating; system and non-system pledges separated",
        "FY ended June 30, 2025"
      ],
      [
        "Central Texas Turnpike System",
        "Austin",
        "State of Texas / TxDOT",
        "CTTS",
        "None",
        "Not applicable",
        "State system",
        "State of Texas",
        "None; final debt maturity 2042",
        "Operating public system",
        "FY ended Aug. 31, 2025"
      ],
      [
        "Grand Parkway System / GPTC",
        "Houston region",
        "State of Texas / TxDOT",
        "Grand Parkway Transportation Corporation system",
        "None",
        "Not applicable",
        "TxDOT component corporation",
        "State public structure",
        "None; final debt maturity 2053",
        "Operating public, system-pledged network",
        "FY ended Aug. 31, 2025"
      ],
      [
        "TxDOT I-35E managed lanes",
        "DFW",
        "State of Texas / TxDOT",
        "TxDOT project",
        "None",
        "Not applicable",
        "State project",
        "State of Texas",
        "None; final debt maturity 2052",
        "Operating publicly",
        "FY ended Aug. 31, 2025"
      ],
      [
        "TxDOT SH 249 System",
        "Houston / Montgomery–Grimes",
        "State of Texas / TxDOT",
        "TxDOT system",
        "None",
        "Not applicable",
        "State system",
        "State of Texas",
        "None; final debt maturity 2057",
        "Operating publicly",
        "FY ended Aug. 31, 2025"
      ],
      [
        "Fort Bend County Toll Road Authority",
        "Fort Bend County",
        "Fort Bend County public structure",
        "FBCTRA",
        "None",
        "Not applicable",
        "County component unit",
        "Fort Bend County",
        "None",
        "Operating public system",
        "FY ended Sept. 30, 2025"
      ],
      [
        "Fort Bend Grand Parkway Toll Road Authority, Segment D",
        "Fort Bend County",
        "State/TxDOT right-of-way; authority right of use",
        "FBGPTRA",
        "None",
        "Not applicable",
        "County component unit",
        "Fort Bend County",
        "No private concession",
        "Operating public facility",
        "FY ended Sept. 30, 2025"
      ],
      [
        "North Tarrant Express",
        "DFW",
        "State of Texas / TxDOT",
        "NTE Mobility Partners, LLC, subject to sharing and debt",
        "NTE Mobility Partners, LLC",
        "Ferrovial/Cintra affiliate; Meridiam affiliate",
        "62.97%; 37.03%",
        "Ferrovial SE; Meridiam-managed funds",
        "2061",
        "Operating private concession on public road",
        "May 2026 — confirmed percentages"
      ],
      [
        "LBJ Express",
        "DFW",
        "State of Texas / TxDOT",
        "LBJ Infrastructure Group, LLC, subject to sharing and debt",
        "LBJ Infrastructure Group, LLC",
        "Ferrovial/Cintra affiliate; APG affiliate; Meridiam affiliate",
        "54.60%; 28.33%; 17.07%",
        "Ferrovial SE; APG-managed pension capital; Meridiam-managed funds",
        "2061",
        "Operating private concession on public road",
        "May 2026 — confirmed percentages"
      ],
      [
        "NTE 35W",
        "DFW",
        "State of Texas / TxDOT",
        "NTE Mobility Partners Segments 3, LLC, subject to sharing and debt",
        "NTE Mobility Partners Segments 3, LLC",
        "Ferrovial/Cintra affiliate; APG affiliate; Meridiam affiliate",
        "53.67%; 28.84%; 17.49%",
        "Ferrovial SE; APG-managed pension capital; Meridiam-managed funds",
        "2061",
        "Operating private concession on public road",
        "May 2026 — confirmed percentages"
      ],
      [
        "SH 130 Segments 5–6",
        "Austin–San Antonio corridor",
        "State of Texas / TxDOT",
        "SH 130 Concession Company, after sharing and debt",
        "SH 130 Concession Company, LLC",
        "SVP-controlled vehicle; U.S. DOT / Build America interest",
        "Approx. 65% SVP; 32% U.S. DOT; 4% other (2Q 2024; rounded)",
        "Strategic Value Partners funds and investors; U.S. federal government",
        "2062",
        "Operating post-bankruptcy concession",
        "Exact percentages 2Q 2024; majority/minority structure reconfirmed July 2026"
      ],
      [
        "Former SH 288 managed-lane concession",
        "Houston",
        "State of Texas / TxDOT",
        "Texas Transportation Finance Corporation / public structure",
        "None since Oct. 8, 2024",
        "None",
        "Public",
        "State of Texas structure",
        "Private term ended; original expiry March 2068",
        "Publicly controlled after termination; HCTRA supports billing",
        "July 2026; FY2025 financial reporting"
      ]
    ],
    "note": "Ownership labels refer to the economic and legal layer stated in each column. They do not convert a project-company percentage into ownership of state land. Sources: S1, S6, S10–S22."
  },
  {
    "id": "table-2-private-concession-comparison",
    "caption": "Table 2. Private-concession comparison",
    "columns": [
      "Project",
      "Original project cost",
      "Opening date",
      "Concession length / remaining term",
      "Toll structure",
      "Major debt sources",
      "Current ownership",
      "Financial turning point",
      "Current investment relevance"
    ],
    "rows": [
      [
        "SH 130 Segments 5–6",
        "$1.328bn",
        "Oct./Nov. 2012",
        "50 years to 2062; about 36 years remain",
        "Scheduled tolls; annual escalation linked to nominal Texas GSP per capita; vehicle classes",
        "Originally $685.8m senior banks and $430m TIFIA; $260m new financing disclosed at emergence; current debt unavailable",
        "SVP-controlled majority; U.S. DOT minority; dated estimate 65% / 32% / 4% other (2Q 2024; rounded)",
        "2016 Chapter 11; 2017 debt-to-equity restructuring",
        "Possible concession-company secondary, continuation vehicle, or refinancing; federal stake and limited disclosure complicate access"
      ],
      [
        "North Tarrant Express",
        "$2.122bn",
        "Oct. 4, 2014",
        "52 years, 2009–2061; about 35 years remain",
        "Dynamic, five-minute repricing; CPI-linked soft cap and congestion exception",
        "PABs, TIFIA at inception, public funds; $1.600bn debt at Dec. 2025",
        "Ferrovial 62.97%; Meridiam 37.03%",
        "Traffic maturation and mandatory capacity expansion",
        "Exposure through sponsor equity, fund secondary, or project bonds; strong cash flow offset by capex and sharing"
      ],
      [
        "LBJ Express",
        "$2.645bn",
        "Fully open Sept. 2015",
        "52 years, 2009–2061; about 35 years remain",
        "Dynamic managed lanes; HOV discounts; CPI-linked framework",
        "PABs and TIFIA; $2.038bn debt at Dec. 2025",
        "Ferrovial 54.60%; APG 28.33%; Meridiam 17.07%",
        "Successful ramp-up but high leverage; Wishbone expansion",
        "Potential sponsor or pension secondary and project debt; main constraint is roughly 10.1x net debt/EBITDA"
      ],
      [
        "NTE 35W",
        "About $2.327bn across 3A/3B/3C packages",
        "Stages in 2016, 2018, and 2023",
        "2013–2061; about 35 years remain",
        "Dynamic managed lanes with speed target and sharing bands",
        "PABs, TIFIA, bank facilities; $1.598bn debt at Dec. 2025",
        "Ferrovial 53.67%; APG 28.84%; Meridiam 17.49%",
        "Segment additions, rapid growth, and rising revenue sharing",
        "Large operating scale and sponsor/fund routes; value constrained by sharing, leverage, and future corridor obligations"
      ],
      [
        "Former SH 288 concession",
        "$1.0635bn",
        "Nov. 2020",
        "52 years to March 2068; private term ended with 43.4 years left",
        "Dynamic; annual minimum and cap linked to CPI and Texas nominal GSP per capita",
        "$298.6m PABs and $357m TIFIA plus capitalized interest; repaid at termination",
        "Public since Oct. 8, 2024; immediately prior: Abertis 56.76%, ACS 43.24%",
        "$1.7317bn TxDOT termination",
        "No private concession equity remains; possible exposure through TTFC bonds or operating procurements"
      ]
    ],
    "note": "Remaining terms are approximate at the July 11, 2026 research cutoff. Costs may combine differently scoped construction packages; NTE 35W is explicitly aggregated across 3A, 3B, and 3C. Sources: S3, S6–S13."
  },
  {
    "id": "table-3-public-versus-private-toll-road-economics",
    "caption": "Table 3. Public versus private toll-road economics",
    "columns": [
      "Issue",
      "Public toll system",
      "Private concession"
    ],
    "rows": [
      [
        "Physical asset owner",
        "Public authority, county, or state",
        "Usually still the state or public sponsor"
      ],
      [
        "Toll-revenue recipient",
        "Public enterprise or pledged system",
        "Project company for a finite term, after contractual sharing"
      ],
      [
        "Capital provider",
        "Revenue-bond investors; sometimes tax-supported debt and public funds",
        "Equity sponsors, PAB investors, banks, TIFIA, and public contributions"
      ],
      [
        "Cost of debt",
        "Often tax-exempt and lower-return",
        "Can use tax-exempt PABs and TIFIA, but typically carries more structural risk"
      ],
      [
        "Equity requirement",
        "No private equity return; retained net revenue acts as public capital",
        "Explicit at-risk equity with a higher required return"
      ],
      [
        "Traffic risk",
        "Pooled across system where revenues are cross-pledged",
        "Usually concentrated in the project company"
      ],
      [
        "Toll-setting flexibility",
        "Board or agency controlled; often more directly political",
        "Contract formula may permit automatic or dynamic changes, still politically exposed"
      ],
      [
        "Financial transparency",
        "Audited public statements and bond disclosure; stand-alone road data may be limited",
        "Contract is often public; operating financials, cap tables, and debt can be selective"
      ],
      [
        "Ability to distribute cash",
        "No dividends; cash retained, transferred for authorized purposes, or used on network",
        "Distributions after O&M, capex, debt tests, reserves, sharing, and tax"
      ],
      [
        "Concession expiry",
        "None",
        "Equity rights expire; handback obligations apply"
      ],
      [
        "Bankruptcy consequences",
        "Debt restructuring affects public credit and system finance",
        "Equity can be wiped out and debt converted while the road stays open"
      ],
      [
        "Incentive to maximize revenue",
        "Balanced against policy, network, and affordability goals",
        "Direct, but constrained by contract, demand elasticity, and political response"
      ]
    ],
    "note": ""
  },
  {
    "id": "table-4-what-determines-toll-road-equity-value",
    "caption": "Table 4. What determines toll-road equity value?",
    "columns": [
      "Driver",
      "Directional effect on equity",
      "Mechanism",
      "Constraint or nonlinearity"
    ],
    "rows": [
      [
        "Traffic growth",
        "Positive",
        "More paid transactions spread fixed costs",
        "Can trigger revenue sharing, capacity capex, or congestion controls"
      ],
      [
        "Toll growth",
        "Positive if demand holds",
        "Raises revenue per trip",
        "Elasticity and political resistance can reduce volume"
      ],
      [
        "Inflation",
        "Often positive for revenue",
        "Indexed tolls can rise",
        "O&M, maintenance, and interest costs may also rise"
      ],
      [
        "Operating costs",
        "Negative",
        "Reduce cash before debt",
        "Collection-risk allocation can shift costs to a public entity"
      ],
      [
        "Major maintenance",
        "Negative near term",
        "Consumes cash or requires new debt",
        "Deferral can damage handback condition and long-term value"
      ],
      [
        "Leverage",
        "Raises upside and downside",
        "Smaller equity base magnifies value changes",
        "Covenants can stop distributions before insolvency"
      ],
      [
        "Interest rates",
        "Usually negative when higher",
        "Increase refinancing cost and discount rate",
        "Fixed-rate debt and inflation-linked tolls provide partial protection"
      ],
      [
        "Remaining concession life",
        "Positive when longer",
        "Adds years of distributable cash flow",
        "No value beyond legal expiry absent a granted extension"
      ],
      [
        "Political intervention",
        "Usually negative for private equity",
        "Can constrain rates, change exemptions, or trigger buyout",
        "A contractual termination payment may protect creditors or create value"
      ],
      [
        "Competing road capacity",
        "Usually negative",
        "Reduces time savings and paid demand",
        "Construction disruption can help toll traffic temporarily"
      ]
    ],
    "note": ""
  }
] as const;

export const TEXAS_TOLL_ARTICLE_SOURCES = [
  {
    "id": "s1",
    "label": "TxDOT, SH 288 Managed Lanes — executed agreements and termination page",
    "note": "(primary; current through 2026). Establishes CDA execution, October 8, 2024 termination, reversion of control, and TTFC authorization.",
    "hrefs": [
      "https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh288-toll-lanes/executed-agreements.html"
    ]
  },
  {
    "id": "s2",
    "label": "Texas Transportation Commission, July 30, 2024 minutes and July 31, 2025 minute order",
    "note": "(primary). Establishes termination-for-convenience authority, the exact $1,731,730,721 payment, and State Highway Fund loan.",
    "hrefs": [
      "https://www.txdot.gov/content/dam/docs/commission/2024/0730/minutes.pdf",
      "https://www.txdot.gov/content/dam/docs/commission/2025/0731/8.pdf"
    ]
  },
  {
    "id": "s3",
    "label": "U.S. DOT Build America Bureau, SH 288 project profile",
    "note": "(primary federal financing record). Project cost, original financing, participants, completion, termination waterfall, and TIFIA repayment.",
    "hrefs": [
      "https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project"
    ]
  },
  {
    "id": "s4",
    "label": "Abertis, “Puerto Rico and SH288 acquisitions,” October 18, 2023",
    "note": "(sponsor transaction presentation). Acquisition price and stake, pro forma revenue/EBITDA, gross debt, toll formula, and expiry.",
    "hrefs": [
      "https://www.abertis.com/filemanager/media-resource/download/3933/"
    ]
  },
  {
    "id": "s5",
    "label": "Abertis Infraestructuras annual accounts, 2025",
    "note": "(audited company filing). SH 288 proceeds received and recorded loss.",
    "hrefs": [
      "https://www.abertis.com/filemanager/media-resource/download/4220/"
    ]
  },
  {
    "id": "s6",
    "label": "Ferrovial Fact Book, May 2026, filed with the SEC",
    "note": "(current sponsor disclosure). DFW ownership percentages, concession terms, toll framework, 2025 operating figures, debt, distributions, sharing, and expansion.",
    "hrefs": [
      "https://www.sec.gov/Archives/edgar/data/1468522/000162828026032618/ferrovial-factbook2026_s.htm"
    ]
  },
  {
    "id": "s7",
    "label": "FHWA project profile, North Tarrant Express",
    "note": "(primary federal project record). Original cost, financing, term, opening, and original partners.",
    "hrefs": [
      "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant.aspx"
    ]
  },
  {
    "id": "s8",
    "label": "FHWA project profile, LBJ Express",
    "note": "(primary federal project record). Original cost, financing, toll collection, term, and opening.",
    "hrefs": [
      "https://www.fhwa.dot.gov/ipd/project_profiles/tx_lbj_express.aspx"
    ]
  },
  {
    "id": "s9",
    "label": "FHWA project profile, NTE 35W",
    "note": "(primary federal project record). Segment costs, financing, term, construction dates, and dynamic-pricing objective.",
    "hrefs": [
      "https://www.fhwa.dot.gov/ipd/project_profiles/tx_north_tarrant_3a3b.aspx"
    ]
  },
  {
    "id": "s10",
    "label": "TxDOT, SH 130 Segments 5–6 executed agreements",
    "note": "(primary). Facility concession agreement and supporting documents.",
    "hrefs": [
      "https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html"
    ]
  },
  {
    "id": "s11",
    "label": "U.S. DOT Build America Bureau, SH 130 Segments 5–6 project profile",
    "note": "(primary federal financing record). Cost, capital structure, concession, bankruptcy, and U.S. DOT debt and equity recovery.",
    "hrefs": [
      "https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6"
    ]
  },
  {
    "id": "s12",
    "label": "FHWA, Report on Highway Public-Private Partnership Concessions in the United States, 2016",
    "note": "(federal analytical report). Original sponsor percentages, revenue-sharing and toll clauses, early forecast shortfall, liquidity stress, and bankruptcy context.",
    "hrefs": [
      "https://rosap.ntl.bts.gov/view/dot/64188/dot_64188_DS1.pdf"
    ]
  },
  {
    "id": "s13",
    "label": "Kentucky Public Pensions Authority, Project Spurs investment recommendation, September 6, 2024",
    "note": "(public pension investment memorandum; sponsor-derived underlying data). SH 130 65/35 ownership, continuation vehicle, performance, toll escalation, concession term, and restructuring narrative.",
    "hrefs": [
      "https://www.kyret.ky.gov/About/Meeting-Calendar/Materials/September%206%202024%20KRS%20Investment%20Committee%20Meeting%20Materials.pdf"
    ]
  },
  {
    "id": "s14",
    "label": "SH 130 Concession Company, current company history and FAQs",
    "note": "(company source, updated through July 2026). State title, majority/minority ownership description, 2025 transactions, improvements, and current operations.",
    "hrefs": [
      "https://mysh130.com/about/company/"
    ]
  },
  {
    "id": "s15",
    "label": "NTTA 2025 Annual Comprehensive Financial Report",
    "note": "(audited public-system statement). Traffic, revenue, debt, coverage, pledged system, and system assets.",
    "hrefs": [
      "https://www.ntta.org/sites/default/files/2026-06/06-25-2026_Digital-Annual-Report_2025.pdf"
    ]
  },
  {
    "id": "s16",
    "label": "NTTA Board of Directors and system pages",
    "note": "(primary governance source). Appointment structure and facilities.",
    "hrefs": [
      "https://www.ntta.org/about-us/board-of-directors"
    ]
  },
  {
    "id": "s17",
    "label": "Harris County 2025 Annual Comprehensive Financial Report",
    "note": "(audited county statement). HCTRA revenue, expenses, debt, coverage, cash flow, and transfers.",
    "hrefs": [
      "https://auditor.harriscountytx.gov/portals/auditor/documents/ACFRs/HC%20Final%209-30-25.pdf"
    ]
  },
  {
    "id": "s18",
    "label": "CTRMA 2025 Annual Comprehensive Financial Report and governance page",
    "note": "(audited authority statement). System composition, revenue, debt, coverage, and board appointments.",
    "hrefs": [
      "https://www.mobilityauthority.com/wp-content/uploads/2025/11/FY-2025-CTRMA-Annual-Comprehensive-Financial-Report-revised_LR.pdf"
    ]
  },
  {
    "id": "s19",
    "label": "Fort Bend County Toll Road Authority FY2025 Annual Financial Report",
    "note": "(audited public authority statement). Revenue, debt, governance, and tax-supported obligations.",
    "hrefs": [
      "https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBCTRA.pdf"
    ]
  },
  {
    "id": "s20",
    "label": "Fort Bend Grand Parkway Toll Road Authority FY2025 Annual Financial Report",
    "note": "(audited public authority statement). Right of use, revenue, debt, and county component-unit status.",
    "hrefs": [
      "https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBGPTRA.pdf"
    ]
  },
  {
    "id": "s21",
    "label": "TxDOT HB 803 Report, FY2025",
    "note": "(primary state project reporting). Revenue, operating expenses, maintenance, debt service, maturities, SH 288 transition, and non-financed facilities.",
    "hrefs": [
      "https://www.txdot.gov/content/dam/docs/division/gov/hb-803-report-fy-2025.pdf"
    ]
  },
  {
    "id": "s22",
    "label": "TxDOT 2025 Popular Annual Financial Report",
    "note": "(primary state financial summary). Toll-system net position and SH 288 funding/refunding context.",
    "hrefs": [
      "https://www.txdot.gov/content/dam/docs/division/fin/pafr/2025-popular-annual-financial-report.pdf"
    ]
  },
  {
    "id": "s23",
    "label": "U.S. Census Bureau, Texas QuickFacts and metropolitan population analyses, 2024–25",
    "note": "(primary demographic data). State, DFW, Houston, Austin, and exurban growth.",
    "hrefs": [
      "https://www.census.gov/quickfacts/fact/table/TX/PST045225",
      "https://www.census.gov/library/stories/2026/05/major-city-outer-edge-growth.html",
      "https://www.census.gov/library/stories/2025/04/metro-area-trends.html"
    ]
  },
  {
    "id": "s24",
    "label": "Texas A&M Transportation Institute, 2025 Texas’ 100 Most Congested Road Sections",
    "note": "(research institute report using 2024 data). Congestion and truck-delay evidence.",
    "hrefs": [
      "https://static.tti.tamu.edu/tti.tamu.edu/documents/TTI-2025-1.pdf"
    ]
  },
  {
    "id": "s25",
    "label": "TxDOT Texas Freight Mobility Plan and port/freight statistics",
    "note": "(primary state planning data). Freight tonnage, growth outlook, ports, and trade corridors.",
    "hrefs": [
      "https://www.txdot.gov/projects/planning/freight-planning.html",
      "https://ftp.txdot.gov/pub/txdot/move-texas-freight/resources/texas-delivers-2050.pdf"
    ]
  }
] as const;

export const TEXAS_TOLL_ARTICLE_FACT_GAPS = [
  {
    "title": "Ownership figures that remain uncertain",
    "items": [
      "**SH 130 exact current cap table:** the supplied report’s 2Q 2024 diligence estimates approximately 65% SVP-controlled vehicles, 32% U.S. DOT / Build America, and 4% other holders; rounding produces 101%. Current company material reconfirms only an SVP-controlled majority and federal minority. Publish the dated estimate only with that rounding and uncertainty.",
      "**SH 130 legal holding vehicles and governance:** the public record reviewed does not identify the exact federal equity vehicle, class of equity, voting provisions, distribution preferences, or transfer rights. The federal Build America page confirms both subordinated debt and equity.",
      "**DFW direct legal holder names:** Ferrovial’s 2026 filing confirms current economic percentages. Exact intermediate legal names for the Meridiam and APG interests were not established from a current shareholder register. Use “affiliate” unless a TxDOT consent record or project cap table is obtained.",
      "**APG ultimate beneficiary:** APG manages pension capital, but the specific pension client behind each project interest was not confirmed. Do not automatically label the stake as ABP-owned.",
      "**Current SH 130 operating subcontractor:** SH 130 Concession Company is contractually responsible. Louis Berger Services was identified after restructuring in the 2024 pension material, but a current 2026 subcontractor appointment was not confirmed."
    ]
  },
  {
    "title": "Financial figures not located",
    "items": [
      "Current SH 130 audited revenue, EBITDA, cash available for debt service, reserve balances, debt principal, interest rate, and maturity schedule.",
      "A complete SH 288 termination closing statement showing debt payoff by class, swap or hedge closeouts, fees, reserves released, and distributions to every shareholder.",
      "Cumulative invested capital and distributions for each original and later SH 288 sponsor, which are needed to calculate stakeholder-level returns.",
      "Stand-alone revenue, maintenance, and debt allocation for every individual road inside NTTA, HCTRA, CTRMA, CTTS, and Grand Parkway system pledges.",
      "Current market prices and trading yields for each project bond. Those change daily and should be refreshed immediately before publication if the article discusses security-level returns."
    ]
  },
  {
    "title": "Documents unavailable or not fully retrievable",
    "items": [
      "The SH 130 Chapter 11 confirmed plan, disclosure statement, and equity-allocation exhibits were listed through the claims agent but were not directly retrievable in the research session. The federal financing record and public pension memorandum were used to establish the restructuring outcome.",
      "Current private shareholder registers, transfer notices, and TxDOT consent documents for the DFW projects and SH 130 were not publicly located.",
      "A fully parsed final official statement for the late-2025 TTFC SH 288 toll-revenue/refunding bonds should be added before publishing detailed debt-service projections."
    ]
  },
  {
    "title": "Calculations based on inference",
    "items": [
      "SH 288’s approximately $2.70 billion implied 100% equity value and $3.35 billion indicative enterprise value at Abertis entry.",
      "SH 288 termination multiples of 19.2x revenue and 26.2x adjusted EBITDA.",
      "SH 288 estimated $1.08 billion gross equity pool after subtracting approximately $650 million of debt, before all closing adjustments.",
      "SH 288 payment of approximately $39.9 million per remaining concession year and 4.6x original project equity. Neither is a return metric.",
      "DFW revenue per transaction, operating margins, net debt/adjusted EBITDA, and cumulative distributions divided by original equity.",
      "Approximate remaining concession lives at the July 11, 2026 cutoff."
    ]
  },
  {
    "title": "Facts suited to a Texas Public Information Act request",
    "items": [
      "Current certified cap tables, direct legal shareholders, and all TxDOT-approved ownership transfers for NTE, LBJ, NTE 35W, and SH 130.",
      "SH 130’s current annual financial statements, debt schedule, TxDOT revenue-share payments, O&M subcontract, and documents defining the U.S. DOT equity interest.",
      "SH 288’s termination-value calculation, final sources-and-uses statement, payment waterfall, equity distributions, and any settlement or release agreements.",
      "TTFC’s current SH 288 traffic, toll-rate, operating, maintenance, reserve, and debt-service model.",
      "Project-level revenue-share and refinancing-gain calculations for the DFW concessions, including the contractual revenue bands used in 2025.",
      "Release tests and consent requirements that would apply if a road were removed from a public system pledge or concessioned."
    ]
  }
] as const;

export const TEXAS_TOLL_ARTICLE_FAQS = [
  {
    "question": "Who owns the toll roads in Texas?",
    "answer": "No single entity owns the statewide network. Texas, counties, or public authorities usually own the roadway or right-of-way. Public systems keep the toll revenue, while a small group of privately financed concessions hold time-limited operating and revenue rights on state-owned corridors."
  },
  {
    "question": "Are Texas toll roads privately owned?",
    "answer": "Most are public systems. The major active private concessions are North Tarrant Express, LBJ Express, NTE 35W, and SH 130 Segments 5–6. Even there, the state generally retains title to the pavement while the concession company owns contractual toll and operating rights for a fixed term."
  },
  {
    "question": "Are Texas toll roads owned by China?",
    "answer": "The reviewed ownership records do not support that claim. Some concession companies have foreign institutional shareholders, including Spain-based Ferrovial and global infrastructure or pension funds, but that is equity in a concession company—not Chinese ownership of Texas highways or land."
  },
  {
    "question": "Is NTTA a private company?",
    "answer": "No. The North Texas Tollway Authority is a public political subdivision governed by county and gubernatorial appointees. It has bondholders, but no shareholders. Its toll revenue supports a pledged public system and debt service."
  },
  {
    "question": "Who owns SH 130?",
    "answer": "Texas owns the roadway. SH 130 Concession Company holds the toll and operating rights for Segments 5–6 through 2062. The safest current description is an SVP-controlled majority with a U.S. DOT minority equity and subordinated-debt interest. The supplied report’s dated 2Q 2024 estimate is approximately 65% / 32% / 4% other, with rounding."
  },
  {
    "question": "Where does Texas toll-road money go?",
    "answer": "Collected tolls first cover collection costs, operations, maintenance, reserves, and debt service. Public systems retain or transfer the remaining surplus under public-law and bond rules. Private concessions may distribute residual cash to equity only after lender tests, lifecycle obligations, and government revenue-sharing requirements are met."
  },
  {
    "question": "How do private toll-road concessions make money?",
    "answer": "They receive a finite contractual right to collect toll revenue, then pay operating costs, maintenance, debt service, reserves, taxes, and any public revenue share. Equity receives the remainder. Traffic error, leverage, expansion obligations, termination rights, and the concession expiry can materially change that residual value."
  },
  {
    "question": "What happened when SH 130 went bankrupt?",
    "answer": "The road stayed open and Texas kept title. The original Cintra and Zachry equity was eliminated, creditors restructured the capital stack, and the federal TIFIA lender received subordinated debt and an equity interest. The case shows that the physical asset can survive while a particular layer of ownership is wiped out."
  }
] as const;
