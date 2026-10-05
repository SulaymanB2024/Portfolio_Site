import type { WorkDocument } from './work-document'

const atlasRevision = 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-/blob/ef3bad25ea0f43f7b4a854fa56c74af5a50fc8db'

/** Retained article bodies, code-derived records, and pinned source revisions. */
export const caseNarratives: Record<string, WorkDocument> = {
  atlas: {
    role: 'Founder · Product & engineering',
    deck: 'A local website crawler and evidence console.',
    summary: 'I built Atlas’s crawler, evidence model, review workflow, and interface through VOID. Runs are stored in SQLite, with page, link, finding, and measurement exports.',
    chapters: [
      {
        id: 'study-section-1',
        label: 'Crawler & records',
        title: 'The crawl and its retained record',
        body: [
          'Atlas normalizes URLs, deduplicates requests, handles robots and sitemaps, and records a bounded crawl. A failed fetch stays distinguishable from a successfully fetched page with no extractable content. Run limits remain part of the context when reviewing coverage.',
          'The Python console combines raw HTML extraction, optional browser rendering, link-graph calculations, and provider collection. Reviewers can filter local runs, compare them, inspect findings, and export reports. The shipped local workflow does not include distributed crawling, hosted delivery, rank tracking, or GA4 integration.'
        ],
        table: {
          caption: 'Selected outputs documented by the implementation',
          columns: ['Output', 'Retained material'],
          rows: [
            ['audit.sqlite', 'Runs, captured page state, and related audit records.'],
            ['pages.csv / links.csv', 'Page observations and the links used by graph analysis.'],
            ['issues.csv / scores.csv', 'Findings and scoring outputs for review.'],
            ['run_events.csv / report.md', 'Collection events and the readable audit report.']
          ],
          note: 'These are implementation output names. The downloadable July example below is a separate retained source sample.'
        }
      },
      {
        id: 'study-section-2',
        label: 'Versioned cache',
        title: 'Reusing content without freezing its interpretation',
        body: [
          'Incremental crawling separates unchanged page bytes from unchanged extracted facts. A 304 can reuse valid cached artifacts; an unchanged 200 can skip parsing when the matching artifact is still valid.',
          'The artifact identity includes the content hash, artifact type, and version token. Changing extractor, schema, or scoring versions forces parsing even if the page body has not changed. Otherwise a faster crawl could silently preserve an old interpretation.'
        ],
        table: {
          caption: 'Cases covered by the pinned incremental tests',
          columns: ['Response', 'Artifact state', 'Parser action'],
          rows: [
            ['304 Not Modified', 'Matching cached artifact', 'Reuse the cached result.'],
            ['200; same body hash', 'Matching artifact and version', 'Skip redundant parsing.'],
            ['200; same body hash', 'Extractor, schema, or scoring version changed', 'Parse again for the new version.']
          ]
        },
        links: [{ label: 'Incremental-crawl tests', href: `${atlasRevision}/tests/test_incremental_crawl.py`, description: 'The inspected source cases behind this cache policy.' }]
      },
      {
        id: 'study-section-3',
        label: 'Source & render',
        title: 'Source facts and effective page facts',
        body: [
          'The retained July 16 sample compares two successful responses. The static page contains ten quote cards; the JavaScript page contains no source quote cards but embeds ten runtime records. Both retain pagination addresses and lack a source canonical. That evidence calls for a render check before judging visible content.',
          'A separate implementation test exercises an empty raw H1 and an incorrect raw canonical. Rendering supplies one effective H1 and a corrected canonical. Atlas keeps the raw-only findings while avoiding missing-H1, thin-content, and canonical-mismatch findings against the effective page.'
        ],
        artifact: 'atlas',
        links: [
          {
            label: 'Rendered-page tests',
            href: `${atlasRevision}/tests/test_js_render_pipeline.py`,
            description: 'Raw-only findings and effective facts at the pinned implementation revision.'
          }
        ]
      },
      {
        id: 'study-section-4',
        label: 'Findings & gaps',
        title: 'Recording collection gaps beside the findings',
        body: [
          'A source observation and a severity assignment are different records. The sample’s absent canonical is retained without an assigned defect or severity. Effective links feed the graph; missing depth remains unknown.',
          'Optional measurement providers have explicit availability states, including skipped collection when a key is absent. A provider gap must not become a bad website score. The report needs the page state, rule version, and collection limits beside the recommendation so a reviewer can see which evidence was actually available.'
        ],
        links: [
          {
            label: 'Provider reconciliation tests',
            href: `${atlasRevision}/tests/test_provider_reconcile.py`,
            description: 'The pinned handling of missing credentials and partial provider evidence.'
          }
        ]
      },
      {
        id: 'study-section-5',
        label: 'Source material',
        title: 'Code, captures, and the full study',
        body: [
          'The repository documents the local console and its current implementation. The July source captures provide a small reproducible reading example; they are not client traffic, a fresh browser-render measurement, or evidence of search gains.'
        ],
        links: [
          { label: 'Atlas implementation', href: `${atlasRevision}/README.md`, description: 'Pinned README covering collection, run comparison, exports, providers, and scope.' },
          {
            label: 'Retained source sample · JSON',
            href: './research/atlas-open-corpus-run-2026-07-16.json',
            description: 'Both July 16, 2026 captures with observations and source identity.',
            download: true
          },
          {
            label: 'Source observations · CSV',
            href: './research/atlas-open-corpus-run-2026-07-16.csv',
            description: 'The retained comparison in a tabular format.',
            download: true
          },
          { label: 'Building Atlas', href: '#/writing/atlas-building-an-evidence-console', description: 'The full authored study of capture, findings, and the improvement cycle.' }
        ]
      }
    ],
    links: []
  },
  payrollpro: {
    role: 'Team lead · Three-person team',
    deck: 'Confidential transfers and payroll batch state on Solana.',
    summary:
      'I led the three-person PayrollPro team at the June 2025 OnionDAO Hackathon. The prototype combined Token-2022 confidential-transfer mechanics, shared treasury authorization, and an inspectable payroll record.',
    chapters: [
      {
        id: 'study-section-1',
        label: 'Team build',
        title: 'Three requirements in the payroll prototype',
        body: [
          'The build brought together confidential payment amounts, multisig treasury control, and payroll state that could be reviewed. These are separate requirements: transfer privacy does not determine who authorizes a payment or how a scheduled batch can change.',
          'Our teammate’s public recap describes private salary payments, Token-2022, multisig wallets, Solana Pay, and QR payouts. The retained code-derived record gives a narrower view of the batch logic and transfer entry points, including the unfinished paths.'
        ],
        table: {
          caption: 'The requirements combined in the team build',
          columns: ['Concern', 'Implementation area'],
          rows: [
            ['Payment amounts', 'Token-2022 confidential-transfer mechanics.'],
            ['Treasury authorization', 'Shared control through multisig wallets.'],
            ['Payroll record', 'Batch identity, Merkle root, release timestamp, total amount, and frozen state.']
          ]
        }
      },
      {
        id: 'study-section-2',
        label: 'Batch operations',
        title: 'The batch definition and its state guards',
        body: [
          'Scheduling records five fields: batch ID, Merkle root, release timestamp, total amount, and frozen=true. An amendment can replace the root while frozen. Thaw requires the release time to pass before clearing that flag.',
          'Cancellation emits the batch ID and amount. The retained record does not describe a refund or extra cancellation guard. These operations describe possible changes to batch state, rather than four executed transactions in chronological order.'
        ],
        artifact: 'payroll'
      },
      {
        id: 'study-section-3',
        label: 'Transfer paths',
        title: 'Transfer instructions and the unfinished test',
        body: [
          'The program exposes confidential deposit, transfer, and withdrawal, plus reserve deposit and redemption. Batch scheduling defines the payroll state; those instructions are the separate value-transfer entry points.',
          'The source marks confidential mint and burn behavior as simplified. The payroll test contains TODOs and does not build or submit end-to-end transactions. Those are concrete gaps in the prototype: the state summary is not a completed payout receipt or a production test result.'
        ],
        table: {
          caption: 'What the retained program record establishes',
          columns: ['Area', 'Recorded behavior'],
          rows: [
            ['Confidential balances', 'Deposit, transfer, and withdrawal entry points.'],
            ['Reserve balances', 'Deposit and redemption paths.'],
            ['Mint / burn', 'Explicitly simplified confidential behavior.'],
            ['Payroll test', 'Skeleton with TODOs; no end-to-end transaction submission.']
          ]
        }
      },
      {
        id: 'study-section-4',
        label: 'Source material',
        title: 'The prototype record and team recap',
        body: [
          'The structured state record summarizes authored program revision 9d38b02 and its implementation limits. The full local application repository is not published through this packet. The cookbook fork is inspectable related reference code.',
          'The résumé records first place, and the teammate recap corroborates a win. The retained packet does not include an organizer placement record.'
        ],
        links: [
          {
            label: 'Payroll state record · JSON',
            href: './research/payrollpro-system-record.json',
            description: 'Batch fields, operation guards, transfer paths, and the code-derived source basis.',
            download: true
          },
          {
            label: 'Aayush Baniya’s team recap',
            href: 'https://www.linkedin.com/posts/aayush-baniya-a30551223_hackathon-web3-solana-activity-7346138271741071361-0JZz',
            description: 'The team, product, technical stack, and hackathon result.'
          },
          {
            label: 'Confidential-transfer cookbook',
            href: 'https://github.com/SulaymanB2024/OnionDAO-Project',
            description: 'Related Token-2022 recipes; this fork is not the complete PayrollPro application.'
          }
        ]
      }
    ],
    links: []
  },
  viralbench: {
    role: 'Code audit · Evaluation design',
    deck: 'An audit of a marketing agent and a proposed improvement harness.',
    summary:
      'I inspected ViralBench’s research, image-generation, preview, and draft workflow, then designed a separate trace, replay, and evaluation process for making bounded engineering changes.',
    chapters: [
      {
        id: 'study-section-1',
        label: 'Code audit',
        title: 'What the standalone agent actually does',
        body: [
          'The audited agent has five tools, an 18-round limit, a six-call research budget, labeled visual references, and ten loaded reflection notes. The pinned standalone configuration uses one account and AUTO_QUEUE=false, leaving a draft for review.',
          'I traced how information moves from research into image generation, preview, publishing checks, saved snapshots, and later reflection. The existing agent is ViralBench’s work. My contribution is the code audit and the proposed engineering harness.'
        ],
        table: {
          caption: 'Selected findings from the pinned code',
          columns: ['Finding', 'Consequence'],
          rows: [
            ['Preview shows at most six slides', 'A longer final payload can contain slides the agent has not reviewed.'],
            ['Publish checks are not tied to a full-preview receipt', 'Nonempty slides, caption, and usable URLs pass checks without proving the final payload was previewed.'],
            ['Snapshot omits the complete tool and artifact trace', 'The retained state cannot fully reconstruct the decisions behind the post.'],
            ['Metrics use caption-prefix matching', 'Without stable public post identity, outcomes can be assigned to the wrong draft.'],
            ['Same-round actions use Promise.all', 'An image action cannot reliably consume a label created by a simultaneous dependent action.']
          ]
        }
      },
      {
        id: 'study-section-2',
        label: 'Preview gate',
        title: 'A preview receipt tied to the final payload',
        body: [
          'One proposed experiment fixes the preview boundary: render every slide, issue a receipt tied to the exact final payload, and reject a changed or incompletely previewed payload. The experiment would retain the patch, regression case, manifest, and validation record.',
          'A trace recorder would keep research responses, generated media, tool calls, preview results, and draft identity. Codex could use that evidence to propose a small patch. A separate evaluator and release controller would decide whether the change passes and can advance.'
        ],
        artifact: 'viral',
        note: 'The improvement harness and preview receipt are an engineering design, not a deployed service or a measured experiment.'
      },
      {
        id: 'study-section-3',
        label: 'Replay cases',
        title: 'Reproducing failures before a live trial',
        body: [
          'Replay would freeze the research responses, media, account state, render responses, and publishing mocks for a task. That makes it possible to inspect whether a patch handles the same conditions without spending another live post on a known failure.',
          'The proposed fixtures include duplicate generated images, missing final slides, tool timeouts, absent draft-review URLs, delayed metrics, and ambiguous caption matching. Reflection notes would retain supporting and contrary evidence and an expiration condition, rather than accumulating ten unqualified narrative lessons.'
        ],
        table: {
          caption: 'Proposed replay checks',
          columns: ['Fixture', 'Check'],
          rows: [
            ['Seven-slide final post', 'All seven slides must appear in the preview receipt.'],
            ['Payload edited after preview', 'The prior receipt must not authorize the changed draft.'],
            ['Tool timeout or missing draft URL', 'Retain the failure and prevent an unreviewable handoff.'],
            ['Two posts with similar captions', 'Require stable post identity before attaching performance metrics.']
          ]
        }
      },
      {
        id: 'study-section-5',
        label: 'Live evaluation',
        title: 'Separating replay correctness from external performance',
        body: [
          'Replay answers whether the system handles retained conditions correctly. A live trial answers a different question: whether a change improves external performance under current distribution conditions.',
          'The proposed live design pairs baseline and treatment by account, publishing slot, and time, fixes measurement windows in advance, and retains raw outcomes. It treats outliers and distribution noise explicitly. No causal lift or completed trial is reported.',
          'Codex’s editable scope would exclude raw traces, primary metrics, credentials, release rules, and publishing policy. The recorder, evaluator, and release controller keep their own responsibilities, so the engineering agent cannot rewrite the evidence used to judge its patch.'
        ]
      },
      {
        id: 'study-section-4',
        label: 'Source material',
        title: 'The audit and the inspected revision',
        body: [
          'The full study contains eight audit findings, a proposed trace model, preview-gate experiment, replay design, and live-evaluation plan. Its handoff identifiers and thresholds are illustrative design examples.'
        ],
        links: [
          {
            label: 'ViralBench + Codex engineering study',
            href: '#/writing/viralbench-codex-agent-harness',
            description: 'The authored audit and complete proposed experiment workflow.'
          },
          {
            label: 'Audited marketing agent',
            href: 'https://github.com/JibranK12345/Viral-Bench/blob/5f5f57e251023ceb37961c0fc2c808f67ceb71eb/marketing-agent.ts',
            description: 'Pinned source for the tool limits, preview behavior, checks, snapshots, and action concurrency.'
          }
        ]
      }
    ],
    links: []
  }
}
