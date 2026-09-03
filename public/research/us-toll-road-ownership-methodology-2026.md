# U.S. Toll-Road Ownership Methodology and Data Dictionary

**Article:** Who Owns America’s Toll Roads? Public Agencies, Private Concessions, and the Companies Behind Them  
**Canonical path:** `https://sulayman-bowles.dev/markets/who-owns-us-toll-roads`  
**Evidence cutoff:** September 2, 2026  
**Dataset edition:** Web publication v1.0

## What this release contains

The public web edition contains:

- 51 state and District of Columbia overview records.
- 33 material private-title, traffic-risk, availability-payment, long-term O&M, and nonprofit-concession records.
- A source ledger built from current government, authority, concessionaire, operator, and infrastructure-owner pages.
- A dated correction protocol.

It is a material-system ownership reference. It is not represented as a complete facility-level census of every toll plaza, short local bridge, individual managed-lane segment, billing subcontract, debt series, or minority fund investor in the United States.

## Inclusion rule

Include current toll roads, tolled bridges, tolled tunnels, and recurring publicly accessible priced managed lanes that materially answer who holds title, long-term control, toll revenue, equity, debt, or reversion rights.

A private or hybrid record is material when at least one of these tests is met:

1. A private entity holds physical or legal title.
2. A concessionaire or lessee has a multi-decade operating or toll-revenue right.
3. A private project company performs a long design-build-finance-operate-maintain or availability-payment scope on a tolled facility.
4. A nonprofit project entity holds a concession and toll-revenue rights.
5. The ownership structure is a recurring subject of public ownership claims or materially changes the state-level classification.

## Exclusions

Exclude parking, ferries, event tolls, ordinary city cordon charges, planned or unopened facilities, inactive toll facilities, HOV-only lanes without a toll, private roads closed to general traffic, and short service contracts that do not change title, long-term control, or toll economics.

## Grouping rule

Public facilities can share one row when the legal titleholder, public sponsor, operator, revenue claimant, and financing or pledge structure are materially the same. A private concession, privately titled facility, cross-jurisdiction crossing, nonprofit concession, availability-payment project, or facility with a distinct revenue pledge should remain separate.

## Ownership classifications

- **Public:** Public title, statutory control, and toll-revenue claim remain with a government, authority, county, city, or public corporation. Outsourced construction, maintenance, or billing does not change this category.
- **Mixed:** A jurisdiction has both material public facilities and at least one current private-title, traffic-risk, nonprofit, or comparable private-revenue structure.
- **Public plus availability P3:** Public title and toll economics remain public, while a private project company performs a long delivery, operating, or maintenance scope and receives availability or performance payments.
- **Private-title facility:** A private corporation holds the physical facility or the controlling property/franchise interest, subject to public regulation.
- **Public-title traffic-risk concession:** Government retains the underlying asset while a project company receives time-limited operating and toll-revenue rights and bears traffic risk.
- **Nonprofit/distressed concession:** A nonprofit project entity receives toll revenue under concession and bond documents, without conventional shareholder equity.
- **No current material toll-road system:** No current operating facility met this release’s inclusion test.

## Ownership stack

For every material structure, keep these questions separate:

1. Who holds physical or legal title?
2. Which public body sponsors or regulates the facility?
3. Who operates the road day to day?
4. Who maintains it?
5. Who processes tags, invoices, and violations?
6. Which project company holds the lease or concession?
7. Who owns that company?
8. Which entity is legally entitled to toll revenue?
9. Which lenders or bond issuers hold senior claims?
10. What public revenue-sharing obligations apply?
11. When does the contract expire?
12. Who receives the asset or operating rights at handback?

## Confidence scale

- **Confirmed:** A current primary public record or first-party corporate record resolves the core title, sponsor, operator or concessionaire, revenue claimant, and term with no material conflict.
- **Strong:** The core structure is resolved, but a non-core detail such as a minority stake, billing vendor, maintenance subcontractor, or amendment-level date remains incomplete.
- **Probable:** Official or first-party evidence supports the classification, but a controlling title or upstream ownership link is incomplete.
- **Unresolved:** A material current ownership or shareholder link cannot be responsibly completed from public records.

## Data dictionary

| Field | Definition |
| --- | --- |
| `jurisdiction` | State or District of Columbia represented in the overview. |
| `code` | Two-letter postal code used for map joins. |
| `pattern` | Dominant current ownership category for the material-system reference. |
| `note` | Main public system or material private/hybrid exception. |
| `facility` | Facility, grouped bridge portfolio, managed-lane project, or toll system. |
| `states` | State, states, or international jurisdictions served. |
| `structure` | Private-title, public-title traffic-risk, availability-payment/O&M, nonprofit/distressed, or comparable classification. |
| `public` | Government, authority, or regulator retaining title, sponsorship, or defined public rights. |
| `private_role` | What the private or nonprofit entity actually controls, operates, maintains, finances, or receives. |
| `term` | Contract duration, expiry, reversion, or absence of a standard public handback. |
| `confidence` | Confirmed, Strong, Probable, or Unresolved based on the current evidence chain. |
| `primary_source` | Principal official or first-party source used for the web-edition row. |

## Interpretation limits

Do not use this release to calculate one national percentage of toll roads that are privately owned without first defining the denominator. Counts by branded system, individual facility, centerline mile, lane-mile, traffic, toll revenue, or asset value answer different questions.

A billing provider is not automatically the owner. A maintenance contractor is not automatically the concessionaire. A lender is not automatically an equity owner. A foreign pension institution holding a minority interest in a concession company is not the same as foreign title to a public road.

## Correction protocol

A correction request should identify the facility, disputed field, proposed replacement, and a dated primary source such as a government record, concession amendment, audited filing, transaction notice, or current owner disclosure.

A change to titleholder, concessionaire, ultimate owner, toll-revenue claimant, contract term, or state category should trigger a dated article and dataset revision. Missing links remain Strong, Probable, or Unresolved until the controlling evidence is available.
