/** Public project copy. No private source material or operating configuration belongs here. */
export interface WorkStudy {
  slug: string;
  legacyId: string;
  number: string;
  name: string;
  discipline: string;
  status: string;
  period: string;
  headline: [string, string];
  description: string;
  role: string;
  medium: string;
  premise: string;
  chapters: { title: string; paragraphs: string[] }[];
  decisions: { choice: string; reason: string }[];
  result: string;
  scope: string;
  links: { label: string; href: string; note: string }[];
  related: string[];
  visual: 'discovery' | 'dither' | 'payroll' | 'thesis' | 'mandate' | 'solver' | 'ingestion' | 'operator';
  visualLabel: string;
  visualCaption: string;
  observations: { label: string; text: string }[];
}

export const WORK_STUDIES_UPDATED = '2026-09-15';
export const WORK_STUDIES: WorkStudy[] = [
  {
    slug: 'internshipdeadlines', legacyId: 'internshipdeadlines', number: 'I',
    name: 'InternshipDeadlines', discipline: 'Product / Recruiting', status: 'Live product', period: '2026 — ongoing',
    headline: ['Find the role.', 'Know the next step.'],
    description: 'An internship discovery product that combines source-backed role discovery, deadline context, comparison, and application planning in one student workflow.',
    role: 'Founder & product owner', medium: 'Discovery product · Source-backed catalog · Editorial systems',
    premise: 'Finding an internship should not require rebuilding the same spreadsheet every time a new recruiting cycle opens.',
    chapters: [
      { title: 'The work starts after search.', paragraphs: [
        'A promising job title is only the beginning. A student still has to work out whether the role fits, what the employer requires, when to apply, and which details need another check. Those decisions usually get scattered across tabs, saved links, and notes.',
        'I built InternshipDeadlines around that whole sequence, rather than treating a larger list of links as the finished product. The site brings discovery, shortlisting, comparison, deadlines, and preparation resources into one place.'
      ] },
      { title: 'Give each decision a place.', paragraphs: [
        'Search and filters help students narrow the field. Saved roles and notes preserve the shortlist in the browser. Comparison puts options beside one another. Published deadlines, RSS, and calendar feeds help turn a promising role into a next action.',
        'The public methodology keeps the complete collected-posting set separate from the roles students should treat as available to apply. Older, closed, and unconfirmed records can remain searchable; source evidence and current availability are handled separately. That distinction preserves useful history without presenting every retained record as a current vacancy.'
      ] },
      { title: 'Do not manufacture certainty.', paragraphs: [
        'A collected posting is not automatically an open vacancy. A missing deadline is not permission to invent urgency. A temporary problem checking a source cannot establish that a job closed; closure or withdrawal must be confirmed, or a published deadline must pass. Freshness is treated as evidence to maintain, not a label to assume.',
        'Behind the student surface, the production site serves validated catalog releases rather than publishing directly from a collection pass. Acquisition, validation, and publication keep separate authority boundaries, so a partial scan, stale source, or missing field cannot quietly become a public fact.'
      ] }
    ],
    decisions: [
      { choice: 'A workflow, not just a directory', reason: 'Search, saved roles, comparison, and planning support different stages of the same decision.' },
      { choice: 'Collected is not necessarily open', reason: 'Historical, closed, and unconfirmed records remain useful, but availability has to follow current source evidence.' },
      { choice: 'Unknown deadlines stay unknown', reason: 'Source gaps should prompt a check, not become invented application dates.' },
      { choice: 'Local shortlist storage', reason: 'The current product keeps saved roles and private notes in the student’s browser.' }
    ],
    result: 'A live student-facing product with a source-backed catalog, availability-aware search, comparison, saved roles, deadline views, RSS and calendar feeds, tools, and application guides.',
    scope: 'The public product demonstrates the workflow and current listing methodology, not placement outcomes or traffic growth. The complete collection is not a count of open applications. The production site is supplied by validated catalog releases; private acquisition evidence, source-policy records, credentials, and operating configuration remain outside the public product.',
    links: [
      { label: 'Visit InternshipDeadlines', href: 'https://internshipdeadlines.com/', note: 'Explore the live product, current catalog, decision tools, and student workflow.' },
      { label: 'Read how listings work', href: 'https://internshipdeadlines.com/methodology', note: 'Public definitions for collected records, availability, deadlines, missing fields, feeds, and shortlist privacy.' }
    ],
    related: ['internship-aggregator-engine', '1-800-operator'], visual: 'discovery',
    visualLabel: 'A decision, not another open tab', visualCaption: 'Product workflow study. The panels explain the experience; they are not live employer records.',
    observations: [
      { label: 'Find', text: 'Start with role, company, or location. Narrow the field before reading every posting.' },
      { label: 'Verify', text: 'Treat source evidence, freshness, and open status as separate checks rather than assumptions attached to a collected record.' },
      { label: 'Act', text: 'Keep a shortlist and next step. Check the employer’s current posting before applying.' }
    ]
  },
  {
    slug: 'project-delta', legacyId: 'project-delta', number: 'II',
    name: 'Project Delta', discipline: 'Graphics / Engineering', status: 'Implemented · evolving', period: '2026 — ongoing',
    headline: ['Light, reduced', 'to a pattern.'],
    description: 'A reusable Three.js dithering effect and an engineering lab for testing what happens when a visual idea has to survive motion, devices, and repeatable measurement.',
    role: 'Shader systems & evaluation', medium: 'Three.js · React Three Fiber · GLSL',
    premise: 'A compelling frame is a starting point. A visual system also has to hold together when the camera moves and the hardware changes.',
    chapters: [
      { title: 'Make the effect a system.', paragraphs: [
        'Project Delta began with a strong visual language: scenes reduced to light, texture, and deliberate patterns. The engineering problem was to turn that treatment into a reusable post-processing effect instead of a one-off image.',
        'The system supports ordered and procedural patterns, palette mapping, tone controls, and presets. A React Three Fiber playground makes the parameters inspectable, while the reusable effect keeps the rendering logic separate from the demonstration scene.'
      ] },
      { title: 'Coordinates change the picture.', paragraphs: [
        'A pattern attached to the screen behaves differently from one attached to an object. Camera movement can expose sliding texture, unstable ownership, and edges that looked fine in a still image.',
        'My work extends into object-space anchors, multi-subject ownership, and the tradeoff between exact visible-pixel ownership and a cheaper proximity fallback. The goal is control over the effect’s behavior, not simply a longer list of visual settings.'
      ] },
      { title: 'Test the image and the cost.', paragraphs: [
        'The repository pairs browser load tests with deterministic visual captures. The checks inspect rendering states, runtime errors, overflow, image differences, and timing. Perceptual tolerances distinguish an intended visual change from a regression.',
        'CPU and GPU measurements depend on the environment. An unavailable timer query does not mean an effect is free. Keeping that gap visible is more useful than attaching an unsupported performance claim to a beautiful screenshot.'
      ] }
    ],
    decisions: [
      { choice: 'Reusable effect, separate playground', reason: 'The shader can be evaluated independently of the scene used to demonstrate it.' },
      { choice: 'Object-space pattern anchoring', reason: 'Coordinate choice becomes an explicit design decision rather than an accidental artifact of camera motion.' },
      { choice: 'Perceptual and timing checks', reason: 'A rendering change has to be considered both as an image and as work done by the machine.' }
    ],
    result: 'A reusable dithering system, a parameter playground, and browser-based visual and performance test tooling.',
    scope: 'The illustration on this page is a lightweight ordered-dither study, not the Three.js runtime or a benchmark capture. Original scene and asset credits remain with the technical implementation. Performance claims require a named device and test environment.',
    links: [
      { label: 'Read the shader testing article', href: 'https://sulayman-bowles.tech/articles/testing-a-dithering-shader', note: 'The public engineering record behind the test approach.' },
      { label: 'Explore the technical site', href: 'https://sulayman-bowles.tech/', note: 'Related graphics and systems writing.' }
    ],
    related: ['jane-street-puzzle', 'internship-aggregator-engine'], visual: 'dither',
    visualLabel: 'A study in ordered light', visualCaption: 'Illustrative Bayer-threshold field generated for this page. Change the grain to inspect the texture; no GPU performance is being measured.',
    observations: [
      { label: 'Fine', text: 'Fine grain preserves more of the tonal field. This lightweight illustration is not a live shader benchmark.' },
      { label: 'Medium', text: 'Coarser grain makes the pattern visible as part of the image rather than a hidden rendering detail.' },
      { label: 'Coarse', text: 'At large grain sizes, silhouette and tonal structure have to carry the image.' }
    ]
  },
  {
    slug: 'payrollpro', legacyId: 'payrollpro', number: 'III',
    name: 'PayrollPro', discipline: 'Payments / Hackathon', status: '1st place · OnionDAO', period: 'June 2025 · Chicago',
    headline: ['Private payroll.', 'Accountable treasury.'],
    description: 'A Solana payroll prototype that treats salary privacy, payment approval, and treasury control as parts of the same operating problem.',
    role: 'Team lead · three-person team', medium: 'Solana · Confidential transfers · Multisig',
    premise: 'An employer needs to account for payroll without publishing every employee’s compensation to the world.',
    chapters: [
      { title: 'Privacy is not the whole brief.', paragraphs: [
        'Public blockchains make money movement inspectable. That is useful for some forms of accountability and a poor default for salary information. But hiding an amount does not answer who can approve a payment or how a treasury stays under control.',
        'PayrollPro joined those questions in one prototype. I led a three-person team at the OnionDAO Hackathon, framing the payroll problem and coordinating the work across payment flows, confidential-transfer patterns, and treasury controls.'
      ] },
      { title: 'Build around the payment lifecycle.', paragraphs: [
        'The prototype explored confidential salary payments, multisig approval, and payout flows using Solana tooling. A teammate’s public recap describes Token-2022 confidential transfers, multisig wallets, Solana Pay, and QR payouts.',
        'The useful design unit was the payroll batch: prepare the obligation, apply the required authority, and release the payment through a controlled flow. Privacy belongs alongside authorization, not in place of it.'
      ] },
      { title: 'Finish a coherent prototype.', paragraphs: [
        'A hackathon forces a choice between breadth and a convincing end-to-end idea. We focused on a payroll system whose parts made sense together: private compensation, controlled treasury access, and a clear payment experience.',
        'The team took first place. The next engineering step would be hardening the financial paths and adding end-to-end tests, not treating a competition prototype as production payroll infrastructure.'
      ] }
    ],
    decisions: [
      { choice: 'Privacy plus approval', reason: 'Confidential transfers address visibility; multisig controls address authority. Neither replaces the other.' },
      { choice: 'A payroll lifecycle', reason: 'Preparation, authorization, and release form a clearer operating model than disconnected payment features.' }
    ],
    result: 'First place at the OnionDAO Hackathon, with a three-person team and a working payroll prototype.',
    scope: 'Placement and leadership follow my project record, with the team and win corroborated by a teammate recap. The prototype is not an audited custody service or production-ready payroll system. The linked source archive includes upstream confidential-transfer examples, not solely original PayrollPro code.',
    links: [
      { label: 'Read the PayrollPro dossier', href: 'https://sulayman-bowles.tech/competitions/oniondao-payrollpro', note: 'Technical scope, team contribution, and the public recap reference.' },
      { label: 'Inspect the source archive', href: 'https://github.com/SulaymanB2024/OnionDAO-Project', note: 'Includes upstream Solana confidential-transfer examples; retain their attribution.' }
    ],
    related: ['no-limit-artemis', 'mandatearc'], visual: 'payroll',
    visualLabel: 'Separate visibility from authority', visualCaption: 'Conceptual payroll flow. Salary amounts and wallet information are intentionally absent.',
    observations: [
      { label: 'Prepare', text: 'Describe the payroll obligation without making private salary information the public interface.' },
      { label: 'Authorize', text: 'Apply treasury approval controls before release. Privacy does not grant spending authority.' },
      { label: 'Release', text: 'Make the payout flow understandable without claiming the prototype has production hardening.' }
    ]
  },
  {
    slug: 'no-limit-artemis', legacyId: 'no-limit-artemis', number: 'IV',
    name: 'No Limit × Artemis', discipline: 'Investment / Research', status: 'Research prize', period: 'March 2026 · Penn Blockchain Conference',
    headline: ['Token design is', 'capital structure.'],
    description: 'A MetaDAO investment thesis connecting ownership, treasury authority, decision markets, incentives, valuation, and execution risk.',
    role: 'Research & thesis author', medium: 'MetaDAO thesis · Investment pitch',
    premise: 'Before asking what a token is worth, ask what it lets its holder own, control, or influence.',
    chapters: [
      { title: 'Start with the economic rights.', paragraphs: [
        'The researchathon entry examined MetaDAO as a capital-formation system, not simply a governance narrative. The useful questions were about ownership, treasury control, launch mechanics, investor protections, and the incentives faced by founders.',
        'I built the research frame and pitch around those relationships. Public token data and protocol material were inputs to the analysis, rather than substitutes for an investment argument.'
      ] },
      { title: 'Connect governance to valuation.', paragraphs: [
        'Futarchy and decision markets matter to an investor only in relation to the decisions they influence. The thesis considered how ownership, treasury authority, and market-based decision mechanisms fit together.',
        'Valuation logic sat alongside market structure and execution planning. A compelling mechanism does not eliminate liquidity constraints, weak incentives, or the risk that an attractive design works differently in practice.'
      ] },
      { title: 'Make the thesis answerable.', paragraphs: [
        'The deliverable compressed the research into a MetaDAO pitch and digital-asset thesis for the No Limit Holdings × Artemis Researchathon at Penn Blockchain Conference. It received the Crypto Investment Research Prize.',
        'The lasting work is the analytical frame: trace rights, locate control, test incentives, and carry execution risk into the valuation discussion. A historical thesis should be refreshed before it is used to make a current market decision.'
      ] }
    ],
    decisions: [
      { choice: 'Ownership before narrative', reason: 'Identify the economic and decision rights instead of treating governance language as a valuation argument.' },
      { choice: 'Execution travels with the thesis', reason: 'Liquidity, incentives, and implementation risk belong beside the upside case.' }
    ],
    result: 'A MetaDAO pitch and digital-asset investment thesis; Crypto Investment Research Prize at the March 2026 researchathon.',
    scope: 'The award follows my competition record. The linked public dossier is an authored research record, not the original full pitch deck or an organizer result archive. No current target price, trading position, or recommendation is published here.',
    links: [
      { label: 'Read the research dossier', href: 'https://sulayman-bowles.tech/competitions/no-limit-artemis-researchathon', note: 'The historical MetaDAO research scope and source boundaries.' }
    ],
    related: ['payrollpro', 'mandatearc'], visual: 'thesis',
    visualLabel: 'Read the structure beneath the token', visualCaption: 'An analytical map of the thesis, not a price model or a statement of current protocol terms.',
    observations: [
      { label: 'Rights', text: 'What is owned? Which economic claims or protections does the instrument provide?' },
      { label: 'Control', text: 'Who can move the treasury, change the rules, and execute a decision?' },
      { label: 'Incentives', text: 'Where do founder, holder, and market-participant incentives agree—and where can they diverge?' }
    ]
  },
  {
    slug: 'mandatearc', legacyId: 'mandatearc', number: 'V',
    name: 'MandateArc', discipline: 'Enterprise / AI data', status: 'Live public product', period: '2026 — ongoing',
    headline: ['Qualify the opportunity.', 'Keep the data in place.'],
    description: 'An enterprise workflow-data origination product that qualifies buyer needs, ownership, and data rights before anyone transfers underlying records.',
    role: 'Product & systems builder', medium: 'Qualification workflows · Local decision tools',
    premise: 'A first conversation about enterprise data should establish whether there is a credible opportunity, not become an uncontrolled data transfer.',
    chapters: [
      { title: 'The first mile needs a product.', paragraphs: [
        'Enterprise workflow histories can be interesting inputs for AI, but the first conversation is full of unresolved questions. What does the buyer need? Who has authority over the material? What use is contemplated? What can the owner safely describe?',
        'MandateArc gives that conversation structure. I built distinct paths for data owners and buyers, with qualification based on business-level metadata rather than raw record intake.'
      ] },
      { title: 'Translate interest into a mandate.', paragraphs: [
        'The live public build separates twenty industry playbooks from six evidence jobs, then routes owners and buyers into different preparation tools. The owner path asks for sixteen business-metadata fields; the buyer path asks for twenty-four mandate criteria. Neither path requests a file or automatically submits the brief over the network.',
        'Procurement, RFP, diligence, and licensing surfaces make the next questions concrete without collapsing them into one form. A 28-point procurement checklist, a 40-requirement RFP ledger, and a 32-label diligence dossier are decision aids; they do not establish rights, demand, acceptance, or a transaction.'
      ] },
      { title: 'Put authority before custody.', paragraphs: [
        'The product’s central choice is to separate qualification from acquisition. A promising description does not establish the right to share a dataset, and a completed form does not complete legal or commercial diligence.',
        'That boundary shapes the interface, the content architecture, and the operating workflow. The public product can make the opportunity easier to evaluate while leaving the underlying records under the owner’s control.'
      ] }
    ],
    decisions: [
      { choice: 'Metadata-only qualification', reason: 'Describe the opportunity without creating a repository of sensitive enterprise records.' },
      { choice: 'Separate owner and buyer briefs', reason: 'A supply description and a purchase mandate answer different questions.' },
      { choice: 'Deliberate handoff', reason: 'Preparation is not consent to transfer data or activate outreach.' }
    ],
    result: 'A live public product with separate owner and buyer workflows, twenty industry playbooks, six evidence-job routes, local qualification tools, and explicit no-data-custody boundaries.',
    scope: 'The linked product is live and publicly inspectable. Private research, buyer and owner opportunities, operating procedures, and underlying records remain private. This case does not claim completed data transactions, current buyer mandates, accepted scope, revenue, or legal sufficiency.',
    links: [
      { label: 'Explore MandateArc', href: 'https://mandatearc.vercel.app/', note: 'Inspect the live public product, owner and buyer routes, evidence map, and no-data-custody boundary.' },
      { label: 'Review the origination process', href: 'https://mandatearc.vercel.app/how-it-works/', note: 'Four public stages from metadata description through a consented handoff, with explicit stop conditions.' }
    ], related: ['internship-aggregator-engine', '1-800-operator'], visual: 'mandate',
    visualLabel: 'The boundary is part of the product', visualCaption: 'High-level product boundary. No buyer, data owner, dataset, or confidential opportunity is represented.',
    observations: [
      { label: 'Owner', text: 'Describe workflow history and authority using business-level metadata, not underlying records.' },
      { label: 'Buyer', text: 'State the intended evidence need, use, and acceptance criteria before evaluating a source.' },
      { label: 'Handoff', text: 'A qualified brief opens a deliberate next conversation. It is not permission to transfer data.' }
    ]
  },
  {
    slug: 'jane-street-puzzle', legacyId: 'jane-street-puzzle', number: 'VI',
    name: 'Jane Street Puzzle Solver', discipline: 'Algorithms / Constraint solving', status: 'Solver & verifier', period: 'July 2026',
    headline: ['One path.', 'Every rule checked.'],
    description: 'An exact-search Python solver for a three-dimensional knight puzzle, paired with an independent verifier and machine-readable audit tables.',
    role: 'Solver author', medium: 'Python · Exact search · Independent verification',
    premise: 'Finding a plausible answer and proving that it follows every rule are different jobs.',
    chapters: [
      { title: 'Turn the puzzle into constraints.', paragraphs: [
        'The July 2026 Jane Street puzzle combined schedule interpretation, three-dimensional knight moves, regional tower placement, and score arithmetic. A valid route had to satisfy all of them, including the no-repeat rule and the final stopping condition.',
        'I treated it as an exact reconstruction problem. The search tests schedule interpretations against the arithmetic, then joins path segments between forced clue moves while enforcing the geometric and regional constraints.'
      ] },
      { title: 'Do not let the search grade itself.', paragraphs: [
        'A solver can produce a convincing-looking result while repeating an error in its own assumptions. I wrote a separate plain-Python verifier to recompute legality and scoring from the board, tower placements, schedule, and path coordinates.',
        'The repository also generates a machine-readable solution, a path table, a clue audit, and unvisited-neighbor sums. Those outputs make the answer inspectable without asking a reader to trust a search log.'
      ] },
      { title: 'Leave a reproducible record.', paragraphs: [
        'The retained solution records K = 7, a 54-move path, and a final answer of 33,609. The implementation uses the Python standard library; the search, verification, and artifact-writing responsibilities are separate.',
        'The useful result is the complete chain: a constraint model, an exact search, a second check, and outputs that explain what was checked. The solver record is distinct from Jane Street’s own publication of correct submissions.'
      ] }
    ],
    decisions: [
      { choice: 'Exact reconstruction', reason: 'Forced clues and scoring arithmetic constrain the search instead of relying on a sequence of guesses.' },
      { choice: 'Independent verifier', reason: 'Recheck the proposed path outside the search procedure.' },
      { choice: 'Inspectable outputs', reason: 'The path table and clue audit expose the work behind the final number.' }
    ],
    result: 'A retained solver package recording K = 7, a 54-move path, the answer 33,609, and separate verification artifacts.',
    scope: 'The numerical result is drawn from the retained solver repository. The public dossier does not embed the original code or establish official leaderboard confirmation. No claim of a fresh execution or independent organizer verification is made by this page.',
    links: [
      { label: 'Read the solver dossier', href: 'https://sulayman-bowles.tech/competitions/jane-street-puzzle-leaderboard', note: 'Public account of the constraint model and verification approach.' }
    ],
    related: ['project-delta', 'internship-aggregator-engine'], visual: 'solver',
    visualLabel: 'The answer is the last line', visualCaption: 'Recorded outputs from the solver package. This display does not execute the original solver.',
    observations: [
      { label: 'Geometry', text: 'Check three-dimensional knight legality, regional tower placement, and the no-repeat rule.' },
      { label: 'Arithmetic', text: 'Recompute the scoring schedule, clue scores, and unvisited-neighbor sums.' },
      { label: 'Verification', text: 'Run a separate check of the proposed path rather than treating search completion as proof.' }
    ]
  },
  {
    slug: 'internship-aggregator-engine', legacyId: 'internship-aggregator-engine', number: 'VII',
    name: 'Internship Aggregator Engine', discipline: 'Data / Infrastructure', status: 'Implemented · private', period: '2026 — ongoing',
    headline: ['A missing listing', 'is not a closed role.'],
    description: 'An evidence-first internship ingestion system that keeps raw observations, scan completeness, canonical identity, and publication authority separate.',
    role: 'System architect & builder', medium: 'TypeScript · PostgreSQL · ATS adapters',
    premise: 'The hardest failure in a job aggregator is not a broken request. It is a broken request that looks like valid new information.',
    chapters: [
      { title: 'Make incomplete scans harmless.', paragraphs: [
        'An employer feed can stop halfway through pagination, time out after several successful pages, or return an implausible empty result. If a collector treats that partial view as the complete source, still-open roles can be marked missing or closed even though the system never observed a complete board.',
        'I built the engine around an atomic scan-commit boundary. Pages and seen-record identities are staged under a monotonic scan generation, but presence and absence change only after the page graph is complete and every required page succeeded. Failed or partial scans leave prior presence unchanged; suspicious zero-result scans are quarantined instead of mass-closing jobs.'
      ] },
      { title: 'Keep evidence and identity reversible.', paragraphs: [
        'Versioned adapters cover Greenhouse, Lever, Ashby, and generic JSON-LD. Raw response bytes are content-addressed by hash, while each fetch attempt retains its own snapshot and body-free audit. Field-level provenance survives normalization, so a current canonical value can still be traced back to the observation and deterministic rule that produced it.',
        'A vendor requisition ID is evidence, not unconditional identity. Source occurrence, canonical job, and job family remain separate records; incompatible title or location facts can create a reviewable duplicate state instead of an automatic merge. Identity decisions are immutable and supersedable, which makes a mistaken match correctable without deleting the underlying observations.'
      ] },
      { title: 'Separate authority, then test the whole state machine.', paragraphs: [
        'The system gives each boundary less authority than the whole pipeline. Adapters transform supplied bytes but cannot fetch. The fetch gateway cannot declare source presence. Canonical projection writes job facts and transactional outbox events, while a separate idempotent projector rebuilds search documents. The public API serves only publication-eligible jobs whose exact serving source still has a current redistribution decision, through a source-safe listing contract that withholds acquisition evidence and direct destinations.',
        'A deterministic offline harness drives fixtures through capture, parsing, scan finalization, freshness transitions, outbox projection, search, API, and server rendering. Live acquisition is a separate, bounded opt-in that fails closed when required source-policy evidence is absent or stale. The architecture remains a PostgreSQL-backed modular monolith: distributed infrastructure is deferred until a measured threshold or failure mode justifies the added system.'
      ] }
    ],
    decisions: [
      { choice: 'Commit only complete scans', reason: 'A transport or pagination failure must not turn into a false closure signal.' },
      { choice: 'Quarantine suspicious zero-result scans', reason: 'An established source suddenly returning nothing is evidence of uncertainty before it is evidence that every role disappeared.' },
      { choice: 'Reversible canonical identity', reason: 'A mistaken duplicate decision should be correctable without losing the original observations or provenance.' },
      { choice: 'Source-safe publication boundary', reason: 'Public listing responses should expose approved job facts without leaking acquisition evidence, private workflow state, or source destinations.' },
      { choice: 'Modular monolith before distributed infrastructure', reason: 'Keep transactional invariants in one authoritative PostgreSQL system until a measured bottleneck justifies another platform boundary.' }
    ],
    result: 'An implemented private engine with versioned ATS adapters, immutable provenance, atomic scan semantics, reversible canonical identity, fenced workers, transactional outbox projection, source-safe listing APIs, and deterministic offline end-to-end verification.',
    scope: 'Offline fixtures and synthetic capacity tooling are not production throughput or verified internship coverage. This page does not assert that the engine is the deployed InternshipDeadlines backend. Live acquisition in the project is separately bounded and opt-in; source-policy records, acquisition data, runtime credentials, and worker configuration remain private.',
    links: [], related: ['internshipdeadlines', 'mandatearc'], visual: 'ingestion',
    visualLabel: 'The point at which absence becomes evidence', visualCaption: 'Simplified scan-state model. It explains one invariant, not the full private implementation.',
    observations: [
      { label: 'Observe', text: 'Retain the fetched evidence, attempt state, and field provenance without assuming that a source enumeration completed.' },
      { label: 'Quarantine', text: 'A partial, failed, stale, or suspiciously empty scan cannot establish absence; uncertainty remains explicit instead of becoming a bulk state change.' },
      { label: 'Commit', text: 'Only a complete, current scan generation can atomically support presence or absence and the downstream canonical event.' }
    ]
  },
  {
    slug: '1-800-operator', legacyId: '1-800-operator', number: 'VIII',
    name: '1-800-Operator', discipline: 'AI / Marketing intelligence', status: 'Private system · active', period: '2026 — ongoing',
    headline: ['Research before', 'the next creative.'],
    description: 'A private marketing-intelligence workspace that turns retained examples into grounded content briefs while keeping research, generation, spending, and publishing separate.',
    role: 'Marketing systems builder', medium: 'SQLite · Research workflows · Agent tooling',
    premise: 'An agent’s confident explanation of a trend is not the same thing as a retained example you can inspect.',
    chapters: [
      { title: 'Give the research a memory.', paragraphs: [
        'Short-form creative research moves quickly. Examples get saved in one place, notes in another, and the reason a particular hook seemed useful disappears between research and production.',
        '1-800-Operator provides a working record for that process. Retained examples can be searched and used to support content briefs. The initial research includes scan-and-value resale content, where a compelling hook still needs a defensible claim.'
      ] },
      { title: 'Separate the jobs inside the agent.', paragraphs: [
        'Research, interpretation, creative preparation, and publication are different actions with different consequences. I built the workspace so an agent can see the available work, prepare artifacts, and report where it has stopped.',
        'The high-level system includes a searchable evidence store, grounded briefs, review packages, run records, and reproducibility checks. Provider calls, paid work, and publishing are treated as explicit capabilities rather than quietly bundled into a single command.'
      ] },
      { title: 'Make progress inspectable.', paragraphs: [
        'An autonomous workflow is useful when a person can tell what it produced, what it used, and which action still needs review. A completed local package is not the same as a posted campaign.',
        'That distinction keeps the system practical: creative research can advance without inventing audience results, crossing a publishing boundary, or disguising unavailable capabilities as completed work.'
      ] }
    ],
    decisions: [
      { choice: 'Retained examples before briefs', reason: 'A creative recommendation should have a research basis that can be revisited.' },
      { choice: 'Preparation is not publication', reason: 'Rendering an artifact does not authorize a post or establish campaign results.' },
      { choice: 'Bounded agent capabilities', reason: 'Research, provider use, spend, and publishing need distinct controls.' }
    ],
    result: 'A private, agent-oriented marketing-intelligence workspace with searchable research, brief preparation, review artifacts, and durable run records.',
    scope: 'Only this system-level summary is public. Implementation, provider configuration, operating procedures, internal examples, and campaign data remain private. The page does not claim fully autonomous publishing or attributable campaign growth.',
    links: [], related: ['internshipdeadlines', 'mandatearc'], visual: 'operator',
    visualLabel: 'Keep the source attached to the idea', visualCaption: 'Sanitized workflow study. The abstract research cards do not reproduce saved media or campaign data.',
    observations: [
      { label: 'Observe', text: 'Retain a research example and distinguish what was observed from what was inferred.' },
      { label: 'Prepare', text: 'Use the research to prepare a grounded brief and a reviewable creative package.' },
      { label: 'Review', text: 'A person can inspect the output and the next boundary before spending or publishing.' }
    ]
  }
];

export function workStudyPath(study: Pick<WorkStudy, 'slug'>) { return `/work/${study.slug}`; }
export function findWorkStudy(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return WORK_STUDIES.find(study => workStudyPath(study) === clean);
}