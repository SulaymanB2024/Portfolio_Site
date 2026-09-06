import {
  DATA_CENTER_ARTICLE_DATE,
  DATA_CENTER_ARTICLE_DESCRIPTION,
  DATA_CENTER_ARTICLE_DISPLAY_TITLE,
  DATA_CENTER_ARTICLE_HERO_TITLE,
  DATA_CENTER_ARTICLE_IMAGE,
  DATA_CENTER_ARTICLE_READ_TIME,
  DATA_CENTER_ARTICLE_SEO_TITLE,
  DATA_CENTER_ARTICLE_SLUG,
  DATA_CENTER_ARTICLE_TITLE,
  DATA_CENTER_ARTICLE_UPDATED,
  DATA_CENTER_ARTICLE_WORD_COUNT,
} from './dataCenterInfrastructureArticleMeta';

export type DataCenterArticleBlock =
  | { kind: 'markdown'; markdown: string }
  | { kind: 'table'; tableId: string };

export type DataCenterArticleSection = {
  id: string;
  title: string;
  blocks: readonly DataCenterArticleBlock[];
};

export type DataCenterArticleTable = {
  id: string;
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  note: string;
};

export type DataCenterArticleSource = {
  id: string;
  label: string;
  note: string;
  hrefs: string[];
};

export type DataCenterArticleFactGap = { title: string; items: string[] };
export type DataCenterArticleFaq = { question: string; answer: string };

export {
  DATA_CENTER_ARTICLE_DATE,
  DATA_CENTER_ARTICLE_DESCRIPTION,
  DATA_CENTER_ARTICLE_DISPLAY_TITLE,
  DATA_CENTER_ARTICLE_HERO_TITLE,
  DATA_CENTER_ARTICLE_IMAGE,
  DATA_CENTER_ARTICLE_READ_TIME,
  DATA_CENTER_ARTICLE_SEO_TITLE,
  DATA_CENTER_ARTICLE_SLUG,
  DATA_CENTER_ARTICLE_TITLE,
  DATA_CENTER_ARTICLE_UPDATED,
  DATA_CENTER_ARTICLE_WORD_COUNT,
};

export const DATA_CENTER_ARTICLE_LEDE_MARKDOWN = `Meta owns 20 percent of the venture developing its Hyperion data-center campus in Louisiana. That number sounds like a clean transfer of risk: an outside investor owns the other 80 percent, so most of the economics must have moved with the equity. Meta's own filing tells a different story.

At December 31, 2025, Meta reported **$45.95 billion of maximum exposure** to the venture. The total included its equity carrying value, lease commitments, expected future funding, and the maximum threshold under a declining residual-value guarantee. Meta also remained the future tenant, construction manager, property manager, minority investor, and a source of contingent support. The ownership percentage described title. It did not describe first loss.[S1](#source-s1)[S2](#source-s2)

That distinction is the key to hyperscale data-center finance. A campus may look like a building project, but the building is only one layer of what investors buy. The financeable object also contains site control, a legally deliverable power path, a tenant commitment, completion support, acceptance tests, rent, lender controls, and a recovery case if the tenant leaves.

Those layers do not arrive together. They accumulate. Each one narrows a different risk and invites a different kind of capital. The result is less a moment when concrete becomes infrastructure than a process by which contracts manufacture an infrastructure security.` as const;

export const DATA_CENTER_ARTICLE_SECTIONS: readonly DataCenterArticleSection[] = [
  {
    id: 'there-is-no-conversion-date',
    title: 'I. There is no conversion date',
    blocks: [
      {
        kind: 'markdown',
        markdown: `Ask when a data center becomes infrastructure and the answer depends on who is asking.

A land investor may recognize the asset as soon as a transferable site and a credible power position make one parcel scarcer than another. A construction lender may wait for a signed lease, funded equity, a completion guarantee, and an executable utility path. A permanent lender usually wants live power, an accepted facility, rent in force, and enough lease term or amortization to survive a refinancing. An infrastructure fund may apply its own mandate test: contracted yield, barriers to entry, control rights, and target return. A hyperscaler can call the same campus strategic infrastructure years before any third-party investor would finance it without recourse.

None of those investors is necessarily using the word incorrectly. They are underwriting different objects. Early capital underwrites the probability that land becomes a powered site. Construction capital underwrites delivery of a tenant-specific obligation. Operating capital underwrites lease cash flow and property recovery. Securitization turns those claims into a standardized investment product.

The sequence matters because progress can be mistaken for completion. A queue position can create option value without creating firm service. A lease can be signed while payment remains conditional on delivery. A debt deal can close while proceeds sit in escrow. A building can be complete but unaccepted. A rent-producing facility can still have a short lease, a concentrated tenant, or a technical design that is expensive to reuse.

The closest common crossover for long-duration permanent capital is therefore not groundbreaking, construction completion, or securitization. It is the combination of **deliverable power, tenant acceptance, operating payments, durable credit support, and a credible residual or amortization case**. Securitization does not create those conditions. It records and distributes them.

This is why the useful unit of analysis is an asset state rather than a ceremonial date. A project can cross several thresholds, stop between them, or move backward when a contract, permit, design, or tenant fails. The interactive model below treats the campus as ten successive risk objects instead of one building moving through a generic development timeline.`
      }
    ]
  },
  {
    id: 'power-is-an-option-until-it-can-be-delivered',
    title: 'II. Power is an option until it can be delivered',
    blocks: [
      {
        kind: 'markdown',
        markdown: `“Secured power” is one of the most dangerous phrases in data-center development because it compresses a long chain of rights and obligations into two words.

A load concept is not a utility obligation. A submitted request is not a completed study. A queue position is not necessarily transferable. A studied project may still face an unaffordable network upgrade. A signed service agreement may remain subject to regulatory approval, collateral, construction, generation, or transmission work. Even an energized site can face curtailment, ramp limits, price resets, or insufficient capacity for the next phase.

Applied Digital's Polaris Forge 2 financing shows why the distinctions matter. The company closed **$2.15 billion of 6.75 percent senior secured notes on March 10, 2026**, but deposited the gross proceeds into escrow. The money could not enter the project accounts until an energy-services condition was satisfied. Applied reported that the condition cleared and the funds were released on June 17—99 days after the note sale.[S6](#source-s6)[S7](#source-s7)[S8](#source-s8)

Financial close was therefore not the power-risk transfer. The financing documents themselves separated a committed security from usable construction capital. Noteholders were protected by escrow and a mandatory-redemption mechanism; Applied still carried the project, transaction cost, and schedule exposure until the power document became executable.

The Cumulus/Susquehanna campus supplies the opposite lesson. AWS owned a data-center campus beside Talen's Susquehanna nuclear plant. The parties had a sophisticated commercial relationship and generation was physically adjacent. FERC still rejected the amended interconnection agreement intended to support expanded co-located load. Talen and AWS later replaced the expected structure with a front-of-meter power-purchase agreement that ramps toward as much as 1,920 MW through 2042.[S9](#source-s9)[S10](#source-s10)[S11](#source-s11)

The campus did not become worthless. The power thesis changed. AWS retained the real estate, Talen retained the plant, and a new contract preserved the relationship. But the episode proves that proximity to generation is not the same thing as a legally deliverable operating model.

Power risk also moves among parties rather than disappearing. Network upgrades may be funded by customer contributions or minimum bills. A developer can bear delay until rent begins. A tenant bears lost compute output. A lender bears interest carry. A utility may retain limited liability under a tariff while shared assets enter a regulated rate base. Policy change can reopen any private allocation.

The correct question is never simply “How many megawatts?” It is: **which power state, under what agreement, at what price, on what schedule, with which remedies, and who pays if the state regresses?**`
      }
    ]
  },
  {
    id: 'the-lease-has-two-lives',
    title: 'III. The lease has two lives',
    blocks: [
      {
        kind: 'markdown',
        markdown: `A 15-year headline lease can look like infrastructure offtake. That description is only useful after the conditions beneath the term are separated.

Before commencement, the developer is promising to deliver a highly specified product: a certain number of megawatts, at defined halls, with cooling, redundancy, reliability, and delivery dates that match the tenant's compute plan. A signed tenant may have credits, extensions, rejection rights, or no-fee termination if those conditions are missed. Cash flow is prospective, not operating.

After commencement, the same agreement can become much stronger. A filed CoreWeave lease for Applied Digital's Polaris Forge 1 permits a convenience termination only after the tenant pays an early-termination amount equal to **100 percent of the scheduled base rent for the remaining term**, while amounts through the termination date remain due. The filed agreement also shows why the headline cannot stand alone: commencement mechanics, delivery requirements, credits, and other remedies determine whether the obligation ever reaches that operating state.[S4](#source-s4)

The lease therefore has two economic lives. Before acceptance, it is partly a specification and an option on delivery. After acceptance, it can resemble take-or-pay capacity. The transition may occur hall by hall rather than campus-wide.

Credit support matters just as much as term. A lease signed by a thin special-purpose tenant is not the same claim as one supported by a parent guarantee, letter of credit, termination payment, or residual-value guarantee. Applied later disclosed springing CoreWeave guarantees and a $50 million letter of credit for selected obligations. Hyperion's four-year initial property leases sit beside renewal options and an approximately $28 billion declining residual-value-guarantee threshold. Those supports compensate for risks the rent line does not solve by itself.[S1](#source-s1)[S5](#source-s5)

Calling every long data-center lease “take-or-pay” erases the asymmetry lenders care about most. The disciplined reading asks five questions: When must payment begin? What must the landlord deliver first? Can the tenant terminate or shrink before commencement? What does the tenant owe after termination? And which entity guarantees the promise?

Only after those questions are answered can a lease be classified as strong contracted offtake, a credit-supported lease, a conventional lease, a commitment with material options, a capacity reservation, or merely a demand signal.`
      }
    ]
  },
  {
    id: 'what-lenders-actually-finance',
    title: 'IV. What lenders actually finance',
    blocks: [
      {
        kind: 'markdown',
        markdown: `The physical plant is never irrelevant. Land, electrical systems, cooling, fiber, security, and a building capable of carrying dense equipment all support recovery. But the object being financed changes by stage.

During construction, lenders mainly finance the completion of a tenant-specific obligation. Their protections are not limited to a mortgage. They use first liens, controlled accounts, funded reserves, equity-before-debt mechanics, completion guarantees, construction budgets, draw tests, lease conditions, and power milestones. The property is collateral; the expected source of repayment is the sponsor's ability to deliver and the tenant's obligation to pay once delivery succeeds.

Hyperion makes the corporate-support layer unusually visible. A four-year initial property term would be weak support for a campus with a multidecade physical life. Meta's leases, expected future funding, management roles, minority equity, and declining residual guarantee change the credit. Remove Meta and the same buildings would not support the same financing proposition.

Polaris Forge 2 makes the tenant-credit channel visible. The indenture names the Oracle group, traps cash until the energy-services condition is met, and directs certain lease-termination proceeds toward note redemption unless a qualifying replacement tenant enters. The legal security remains project debt. Economically, tenant identity and exit payments are central to leverage.[S6](#source-s6)

DataBank's ATL4 sequence shows what changes at stabilization. In 2023, DataBank announced $188 million of equity and a $345 million construction loan for a fully leased, single-tenant Atlanta facility. In 2025, ATL4 joined two other operating facilities in a **$1.1 billion master-trust securitization**. DataBank said the assets were almost entirely leased and the transaction drew 38 unique investors.[S12](#source-s12)[S13](#source-s13)

The takeout did not prove that the buildings had become “pure infrastructure.” It proved that completed, rent-producing properties could be packaged for a broader and lower-return investor base. Fitch's data-center securitization criteria still examine property cash flow, cap rates, tenant concentration, technology age, re-leasing, and liquidation value. S&P describes digital-infrastructure credit as capable of falling under ABS, CMBS, corporate, or project-finance frameworks depending on the vehicle.[S14](#source-s14)[S15](#source-s15)

The simplest underwriting equation is therefore:

> **Financeable value = contracted cash-flow value + power and scarcity value + adaptable property value − completion, concentration, obsolescence, and refinancing haircuts.**

The first term can dominate while a strong tenant is paying. The last terms become decisive at rollover or distress. That is when the building reappears as something more than collateral shorthand.`
      },
      { kind: 'table', tableId: 'case-underwriting-map' }
    ]
  },
  {
    id: 'the-shadow-capital-stack',
    title: 'V. The shadow capital stack',
    blocks: [
      {
        kind: 'markdown',
        markdown: `A conventional capital-stack diagram usually shows common equity, preferred equity, construction debt, and permanent debt. That picture can be legally accurate and economically incomplete.

Data-center projects are also funded by promises. A sponsor completion guarantee can substitute for equity that has not yet been drawn. A tenant parent guarantee can replace the credit of a thin lease entity. A termination payment can protect debt when a tenant exits. A residual-value guarantee can shift tail risk back to a hyperscaler. Utility contributions, minimum bills, and customer collateral can finance infrastructure outside the property company.

Other support lowers cost instead of supplying a repayable dollar. Tax exemptions, site preparation, public roads, water, sewer, and regulated utility investment can determine whether a site clears its return threshold. Equipment finance funds the servers and sometimes parts of the cooling distribution on a much shorter technology cycle. Vendor terms reduce peak cash need. Development, construction-management, and property-management fees can let a sponsor earn before common equity succeeds.

Those items belong in one economic map because they answer the same question: who supplies cash, absorbs a defined loss, or reduces the cost that funded debt and equity would otherwise bear?

They should not be collapsed into one number. **Invested capital** expects a financial return. **Contingent support** pays only after a trigger. **Cost reduction** improves project economics without a conventional claim. **Cost shifting** can place part of the burden on a utility system or public balance sheet. The distinctions keep a tax abatement from being mislabeled as equity and keep a guarantee from being mistaken for cash already at risk.

The map also reveals why outside capital does not automatically mean outside risk. A joint venture can move legal ownership and funded capex while a tenant retains the lease, future funding, management, completion, and residual obligations. A construction loan can move cash into a project while returning cost overrun to the sponsor. ABS can distribute tenant and property risk while trapping cash away from equity when coverage weakens.

The right way to describe “risk transfer” is a loss schedule, not an ownership percentage. For each adverse event—late power, construction overrun, failed acceptance, tenant termination, lease expiry, technical retrofit—the analysis should name the first bearer, the contractual backstop, the conditions on that backstop, and where loss returns after the protection expires.`
      }
    ]
  },
  {
    id: 'what-is-left-when-the-tenant-leaves',
    title: 'VI. What is left when the tenant leaves?',
    blocks: [
      {
        kind: 'markdown',
        markdown: `“The powered shell is reusable” sounds conservative because it points to physical collateral. In practice, residual value is a stack of components with different lives.

The lease and tenant credit are usually the most valuable elements during term, but they disappear or weaken at expiry. Firm, transferable power and interconnection rights may be the scarcest enduring attribute. Fiber routes, network density, permits, security, and campus position can remain useful. Electrical topology, backup generation, and cooling plant retain value only if the next tenant can use or economically adapt them. The shell and civil works are reusable only if height, loading, divisibility, and layout fit a new design. Land is the floor, not necessarily the investment case.

The tenant's GPUs and servers are normally outside landlord collateral and turn over rapidly. That separation reduces direct hardware risk. It does not immunize the landlord. Extreme rack density, proprietary liquid-cooling loops, voltage choices, emissions limits, water constraints, or a single-tenant topology can narrow the next-user pool and raise retrofit cost.

The public record contains real counterevidence to blanket durability. Meta recorded **$1.34 billion of abandonment charges for data-center construction in progress in 2022**, plus impairment on data-center and leasehold-improvement assets, after shifting to a next-generation design. Digital Realty has warned that tenant-specific improvements can become obsolete and require modification or discounted rent to re-lease. Fitch applies technology-age and marketability haircuts even in permanent securitizations.[S14](#source-s14)[S17](#source-s17)[S18](#source-s18)

Those facts do not mean a powered shell has no residual value. They mean “residual value” is not one line item. A useful recovery analysis tests rack density, cooling modularity, electrical topology, fiber, security, divisibility, water, permit durability, campus scale, and the transferability of power rights.

The strongest defensible statement is narrower than the sales pitch: **the durable asset is often the right to operate a high-capacity, connected, and permitted load at a specific location, plus the portion of the plant that another user can adapt at reasonable cost.** The lease can be most of the value during term. The power position can dominate after expiry. The shell alone may be a minority of both.`
      }
    ]
  },
  {
    id: 'conversion-can-run-backward',
    title: 'VII. Conversion can run backward',
    blocks: [
      {
        kind: 'markdown',
        markdown: `Infrastructure finance is often narrated as a one-way de-risking process. The failure cases show a reversible system.

Cumulus retained land, structures, an adjacent nuclear plant, AWS ownership, and a commercial relationship after the expected interconnection structure failed. The parties rebuilt the power contract. Value survived, but in different layers.

Meta's 2022 design pivot stranded construction in progress without a tenant default, permit reversal, or utility failure. The hyperscaler itself changed the technical target. Corporate balance-sheet capacity allowed it to absorb the charge and redirect capital; the built work did not preserve carrying value merely because it was concrete and electrical plant.

At Zeewolde in the Netherlands, municipal approval did not create durable national political permission. Meta paused the proposed campus after political opposition and a national policy response. In Chile, an environmental tribunal partially annulled and suspended approval for a proposed data center because the record did not adequately address aquifer and climate effects; a shift toward air cooling illustrated how technical design and permit bankability can be the same problem.[S20](#source-s20)

Polaris Forge 2 is a more constructive counterexample. Escrow protected investors when the power document was not yet executable. If the condition had failed, noteholders had a redemption path, but Applied would still have borne transaction cost, delay, and project carry. Protection worked without making the underlying development risk disappear.

These cases support four rules. Failure is often a **state regression**, not a zero-value event. The party bearing loss changes with timing. Contract protection can preserve one claimant while the project remains delayed. And the announced campus budget is rarely the correct loss denominator because it may include unbuilt phases, tenant equipment, or future expansion.

A serious article should therefore ask what survives: land, permits, power rights, reusable plant, a lease claim, an escrow balance, a termination payment, a sponsor guarantee, or a restructured commercial relationship. “The project failed” is an event description, not a recovery analysis.`
      },
      { kind: 'table', tableId: 'state-regression-cases' }
    ]
  },
  {
    id: 'infrastructure-is-also-a-financial-label',
    title: 'VIII. Infrastructure is also a financial label',
    blocks: [
      {
        kind: 'markdown',
        markdown: `The same data center can be described as infrastructure, specialized real estate, project finance, corporate credit, or structured credit without changing one physical component.

Each label answers a different question. An infrastructure fund sees scarce inputs, high barriers, mission-critical service, and contracted yield. A real-estate investor sees rent, cap rates, replacement cost, re-leasing, and capital expenditure. A private-credit fund sees liens, covenants, completion support, and a takeout path. A rating agency chooses a methodology based on the collateral and vehicle. A hyperscaler sees strategic compute capacity.

The QTS acquisition makes the overlap explicit. Blackstone Infrastructure Partners, Blackstone Real Estate Income Trust, and Blackstone Property Partners all participated in the same roughly $10 billion acquisition. The platform fit infrastructure and real-estate mandates at once.[S19](#source-s19)

That overlap is not a reason to reject the word. It is a reason to use it as a conclusion with criteria. Long physical life, essential service, scarce or regulated inputs, contracted revenue, inflation or cost pass-through, high barriers to entry, low demand volatility, durable political support, low re-leasing risk, and financing eligibility are separate attributes. A data center can satisfy some and fail others.

The label matters because it changes the capital provider, return target, leverage, valuation method, and recovery assumptions. It can also conceal the thing doing the work. A four-year lease plus a residual guarantee is not the same risk as a 20-year unconditional lease. A utility queue position is not the same asset as operating firm service. A master-trust note can be an infrastructure security while its rating case still looks like specialized commercial real estate.

The question is not whether data centers “really are” infrastructure in the abstract. It is which characteristics are present, which party depends on them, and which protections remain after the marketing category is removed.`
      }
    ]
  },
  {
    id: 'the-answer-for-permanent-capital',
    title: 'IX. The answer for permanent capital',
    blocks: [
      {
        kind: 'markdown',
        markdown: `A data center first becomes an infrastructure **development position** when site control and a credible, transferable power pathway create scarce rights. It becomes an infrastructure **construction credit** when a strong tenant commitment, funded equity, completion support, and executable power contracts make delivery financeable. It becomes an infrastructure **cash-flow asset** when the facility is powered, accepted, and producing rent or minimum payments. It becomes an infrastructure **investment product** when permanent capital can model the remaining lease, tenant credit, amortization, and residual value without relying mainly on future development success.

Those are related states, not synonyms.

The concise answer to the headline question is this:

> **A data center becomes an infrastructure asset for permanent capital when the primary repayment risk is no longer whether it can be built and powered, but whether its contracted operating cash flow and residual rights will endure.**

That definition keeps the physical plant in view without treating it as self-explanatory. It recognizes that power, contract, and credit can manufacture lower-risk cash flow while preserving the possibility of regression. It also explains why two identical shells can support different leverage: one may have live power, an accepted investment-grade tenant, and a transferable design; the other may have a queue position, a conditional lease, and no deep re-leasing market.

For readers evaluating a transaction, the practical work begins after the label. Map the legal owners. Map the money. Mark the exact power state. Read the commencement and termination provisions. Separate funded capital from guarantees and public support. Identify which systems belong to the landlord and which belong to the tenant. Model the residual by component. Then ask which adverse event returns loss to the sponsor, tenant, utility, ratepayer, lender, or equity owner.

The building is visible. The infrastructure security is the complete bundle of rights, obligations, systems, and recovery paths around it.`
      }
    ]
  }
] as const;

export const DATA_CENTER_ARTICLE_TABLES: readonly DataCenterArticleTable[] = [
  {
    id: 'case-underwriting-map',
    caption: 'Table 1. What the major transactions actually underwrite',
    columns: ['Case', 'Construction-stage object', 'Support beyond the shell', 'Permanent-state object', 'Main unresolved risk'],
    rows: [
      ['Hyperion', 'Meta-supported campus delivery', 'Leases, future funding, management roles, declining residual guarantee', 'Future rent plus campus property and power systems', 'Utility execution, short initial property terms, residual value after support declines'],
      ['Polaris Forge 1', 'Delivery of CoreWeave-specific halls', 'Applied completion support, lease remedies, later guarantees and LOC', 'Post-commencement rent and project collateral', 'Tenant concentration, late delivery, AI-specific re-leasing'],
      ['Polaris Forge 2', 'Oracle-backed 200 MW build', 'Escrow, completion guarantee, termination-payment waterfall, power counterparties', 'Rent after service commencement and controlled project cash flow', 'Construction, power delivery, tenant concentration, refinancing'],
      ['DataBank ATL4', 'Fully leased single-tenant facility', 'Sponsor equity, bank construction syndicate, operating platform', 'Portfolio lease cash flow and property recovery in master trust', 'Private lease terms, rollover, technology and balloon risk'],
      ['Cumulus / AWS', 'Campus plus expected nuclear-delivery structure', 'AWS purchase, Talen generation, staged consideration', 'Front-of-meter PPA and AWS-owned campus', 'Transmission, regulatory treatment, ramp timing and market charges']
    ],
    note: 'The legal collateral package and the economic source of repayment are related but not identical. Public documents leave some lease, utility, and recovery terms unresolved.'
  },
  {
    id: 'state-regression-cases',
    caption: 'Table 2. How a project moves backward without becoming worthless',
    columns: ['Case', 'State lost', 'What survived', 'Who remained exposed', 'Lesson'],
    rows: [
      ['Cumulus / Susquehanna', 'Expected expanded co-located power structure', 'Campus, nuclear plant, counterparties, revised PPA', 'AWS and Talen through delay and restructuring', 'Physical adjacency does not secure the regulatory delivery path.'],
      ['Meta 2022 design pivot', 'Construction-in-progress aligned to an older design', 'Some land, utility work, and generic plant may have remained', 'Meta shareholders', 'Tenant hardware separation does not immunize base-building design.'],
      ['Zeewolde', 'Political durability after local approval', 'Land and planning work', 'Meta and public planning bodies', 'Entitlement can regress through national politics.'],
      ['Cerrillos, Chile', 'Environmental approval', 'Land, grid concept, redesign option', 'Project owner and reviewing agencies', 'Cooling and water assumptions are bankability inputs.'],
      ['Polaris Forge 2 escrow', 'Immediate access to debt proceeds', 'Lease, site, development work, protected note principal', 'Applied until the power condition cleared', 'Investor protection can work while project risk remains.']
    ],
    note: 'Failure analysis should separate the lost state from the assets, rights, and claims that survive.'
  }
] as const;

export const DATA_CENTER_ARTICLE_FACT_GAPS: readonly DataCenterArticleFactGap[] = [
  {
    title: 'Private contract terms',
    items: [
      'Full Hyperion debt documents, fee schedules, governance rights, and residual-value mechanics are not public.',
      'Most hyperscale leases do not disclose complete acceptance tests, guarantor scope, bankruptcy treatment, or re-leasing remedies.',
      'The full PF1 utility agreement and many property-level utility remedies remain private.'
    ]
  },
  {
    title: 'Recovery evidence',
    items: [
      'Named re-leasing cases with retrofit capex per MW, downtime, rent change, and transferred power rights remain scarce.',
      'Public ABS summaries rarely expose property-level appraisal, cap-rate, tenant-concentration, and renewal assumptions.',
      'Distressed loan files would test the residual-value thesis more directly than announced and financed successes.'
    ]
  },
  {
    title: 'Public and power cost',
    items: [
      'Powered-land sale premiums and the attrition from announced MW to energized MW are not consistently reported.',
      'Net present value of tax relief, roads, water, utility rate-base investment, and customer protections is incomplete.',
      'Delay damages and rent relief when a building is complete but firm power is late are usually buried in private schedules.'
    ]
  }
] as const;

export const DATA_CENTER_ARTICLE_FAQS: readonly DataCenterArticleFaq[] = [
  {
    question: 'What is the single most important milestone?',
    answer: 'There is no universal one. For permanent cash-flow capital, the closest common crossover is live and legally deliverable power plus tenant acceptance and rent commencement, backed by durable credit and a credible residual or amortization case.'
  },
  {
    question: 'Is a signed hyperscale lease the same as take-or-pay?',
    answer: 'Not automatically. Commencement conditions, delivery remedies, termination rights, minimum payments, and the guarantor determine how offtake-like the lease is. Some agreements become very strong only after the facility is accepted.'
  },
  {
    question: 'Does outside ownership mean the hyperscaler transferred the risk?',
    answer: 'Only the contract schedule can answer that. Outside capital may fund the project and own most of the equity while the hyperscaler retains leases, management, future funding, completion obligations, or residual guarantees.'
  },
  {
    question: 'What is the durable residual asset?',
    answer: 'Usually the transferable right to operate a high-capacity, connected, permitted load at a specific site, plus the electrical, cooling, network, security, and building systems a new user can economically adapt. The shell alone is not a complete recovery case.'
  },
  {
    question: 'Does permanent ABS prove that a facility is infrastructure?',
    answer: 'It proves institutional financeability under a defined structure. Rating analysis can still rely on commercial-real-estate cash flow, property value, cap rates, tenant concentration, obsolescence, and re-leasing assumptions.'
  },
  {
    question: 'What would disprove the article’s thesis?',
    answer: 'A broad record showing unleased powered shells receiving the same leverage as leased assets, queue positions reliably becoming firm service, tenant credit not affecting loan sizing, completion alone producing permanent pricing, and facilities re-leasing without material capex or downtime would materially weaken it.'
  }
] as const;

export const DATA_CENTER_ARTICLE_SOURCES: readonly DataCenterArticleSource[] = [
  { id: 's1', label: 'Meta Platforms, 2025 Form 10-K', note: 'Filed Hyperion equity, lease commitments, initial four-year terms, residual-value-guarantee threshold, management roles, and $45.95B maximum exposure.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm'] },
  { id: 's2', label: 'Meta / Blue Owl Hyperion joint-venture announcement', note: 'Transaction structure, 80/20 ownership, development scope, contributed assets, and capital formation.', hrefs: ['https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Announces-Joint-Venture-with-Funds-Managed-by-Blue-Owl-Capital-to-Develop-Hyperion-Data-Center/default.aspx'] },
  { id: 's3', label: 'Louisiana Public Service Commission large-load record', note: 'Utility approvals, customer contributions, minimum charges, credit support, and cost-recovery boundaries for the Meta service framework.', hrefs: ['https://lpscpubvalence.lpsc.louisiana.gov/portal/PSC/ViewFile?fileId=nDWn%2Fjuc2%2BA%3D'] },
  { id: 's4', label: 'Applied Digital / CoreWeave filed data-center lease', note: 'Commencement, rent, delivery, force-majeure, and early-termination provisions, including 100% of remaining scheduled base rent for convenience termination.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1144879/000164117225013199/ex10-1.htm'] },
  { id: 's5', label: 'Applied Digital Form 10-Q, quarter ended February 28, 2026', note: 'PF1 financing, completion support, tenant restructuring, springing guarantees, and letter-of-credit disclosure.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1144879/000114487926000030/apld-20260228.htm'] },
  { id: 's6', label: 'APLD ComputeCo 2 senior secured notes indenture', note: 'PF2 collateral, Oracle definitions, power counterparties, escrow condition, controlled accounts, and lease-termination-payment mechanics.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1144879/000149315226009538/ex4-1.htm'] },
  { id: 's7', label: 'Applied Digital PF2 note-closing Form 8-K', note: 'March 10, 2026 note closing, completion guarantee, escrow, and financing terms.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1144879/000149315226009538/form8-k.htm'] },
  { id: 's8', label: 'Applied Digital PF2 escrow-release Form 8-K/A', note: 'June 17, 2026 satisfaction of the energy-services condition and release of note proceeds.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1144879/000149315226028993/form8-ka.htm'] },
  { id: 's9', label: 'FERC order rejecting the amended Susquehanna interconnection agreement', note: 'Primary regulatory record for the failed expanded co-located-load structure.', hrefs: ['https://www.ferc.gov/sites/default/files/2024-11/20241101-3061_ER24-2172-000.pdf'] },
  { id: 's10', label: 'Talen / Amazon expanded nuclear PPA announcement', note: 'Front-of-meter replacement structure, 1,920 MW full contract quantity, ramp, and 2042 term.', hrefs: ['https://ir.talenenergy.com/news-releases/news-release-details/talen-energy-expands-nuclear-energy-relationship-amazon'] },
  { id: 's11', label: 'Talen Energy 2025 Form 10-K', note: 'Cumulus transaction history, revised PPA, transmission reconfiguration, and campus-ownership changes.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1622536/000162253626000025/tln-2025annualreporttoshar.htm'] },
  { id: 's12', label: 'DataBank ATL4 debt and equity financing', note: 'The $345M construction loan, $188M equity raise, and fully leased single-tenant construction-stage facts.', hrefs: ['https://www.databank.com/resources/press-releases/databank-raises-533-million-in-debt-equity-to-finance-new-data-center-developments/'] },
  { id: 's13', label: 'DataBank 2025 hyperscale asset securitization', note: 'The $1.1B master-trust takeout, operating collateral, almost-entirely-leased portfolio, and 38-investor demand.', hrefs: ['https://www.databank.com/resources/press-releases/databank-raises-1-1-billion-in-hyperscale-asset-securitization/'] },
  { id: 's14', label: 'Fitch Ratings, Data Center Securitizations Rating Criteria', note: 'CMBS-derived property framework, tenant concentration, technology age, cap-rate, re-leasing, and liquidation analysis.', hrefs: ['https://assets.fitchratings.com/downloadFile?reportType=report&sfReport=false&slug=structured-finance%2Fdata-center-securitizations-rating-criteria-16-09-2025'] },
  { id: 's15', label: 'S&P Global Ratings, Digital Infrastructure research', note: 'Cross-framework treatment spanning project finance, corporate, ABS, and CMBS depending on transaction form.', hrefs: ['https://www.spglobal.com/ratings/en/research/digital-infrastructure'] },
  { id: 's16', label: 'Moody’s, Credit Risk Insights for Global Data Centers', note: 'Lease-payment and property-credit framing for data-center securitizations.', hrefs: ['https://www.moodys.com/web/en/us/insights/credit-risk/data-centers.html'] },
  { id: 's17', label: 'Meta Platforms, 2022 Form 10-K', note: 'Data-center construction-in-progress abandonment and impairment after a next-generation design pivot.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1326801/000132680123000013/meta-20221231.htm'] },
  { id: 's18', label: 'Digital Realty Trust, 2017 Form 10-K', note: 'Tenant-improvement obsolescence, retrofit, discounted re-leasing, and residual-property risk disclosures.', hrefs: ['https://www.sec.gov/Archives/edgar/data/1297996/000129799618000026/dlr12311710k.htm'] },
  { id: 's19', label: 'Blackstone funds complete acquisition of QTS Realty Trust', note: 'The same platform acquired by infrastructure and real-estate vehicles, illustrating overlapping mandate classifications.', hrefs: ['https://www.blackstone.com/news/press/blackstone-funds-complete-acquisition-of-qts-realty-trust/'] },
  { id: 's20', label: 'Second Environmental Tribunal of Chile, Cerrillos judgment', note: 'Partial annulment and suspension tied to aquifer, climate, and cooling-design analysis.', hrefs: ['https://tribunalambiental.cl/sentencia-r27-270-2020-cerrillos-data-center/'] },
  { id: 's21', label: 'AEP Ohio data-center tariff materials', note: 'A current example of utility credit, minimum-demand, and large-load cost-allocation mechanisms.', hrefs: ['https://www.aepohio.com/company/about/rates/data-center-tariff/'] }
] as const;

export const DATA_CENTER_ARTICLE_IMAGE_CREDIT = {
  label: 'The server room at The National Archives, UK',
  creator: 'The National Archives (UK)',
  created: '26 May 2011',
  license: 'CC BY 3.0',
  source: 'https://commons.wikimedia.org/wiki/File:A_view_of_the_server_room_at_The_National_Archives.jpg',
  licenseHref: 'https://creativecommons.org/licenses/by/3.0/',
} as const;
