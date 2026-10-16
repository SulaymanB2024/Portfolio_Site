import type { WorkDocument } from './work-document'
import { workContributions } from './work-curation.ts'

const atlasRevision = 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-/blob/ef3bad25ea0f43f7b4a854fa56c74af5a50fc8db'

/** Retained article bodies, code-derived records, and pinned source revisions. */
export const caseNarratives: Record<string, WorkDocument> = {
  atlas: {
    role: 'Founder · Product & engineering',
    deck: 'A Python and SQLite website audit console.',
    summary: workContributions.atlas.summary,
    chapters: [
      {
        id: 'study-section-1',
        label: 'Crawler & records',
        title: 'A crawl with a reviewable record',
        body: [
          'I built the Python crawler and local console around retained page state. URL normalization, deduplication, robots, and sitemaps feed a bounded run; SQLite keeps the records, and CSV/Markdown exports carry pages, links, findings, measurements, and collection events into review. A failed fetch remains distinct from a successful page with no extractable content.'
        ],
      },
      {
        id: 'study-section-2',
        label: 'Versioned cache',
        title: 'Cache bytes without freezing meaning',
        body: [
          'An unchanged response can reuse cached work only while its artifact version is valid. Content hash, artifact type, and extractor/schema/scoring versions form the identity. A 304 can reuse a matching artifact; the same bytes must be parsed again when the interpretation changes.'
        ],
        links: [{ label: 'Incremental-crawl tests', href: `${atlasRevision}/tests/test_incremental_crawl.py`, description: 'The inspected source cases behind this cache policy.' }]
      },
      {
        id: 'study-section-3',
        label: 'Source & render',
        title: 'A 200 response is not the whole page',
        body: [
          'The retained July 16, 2026 sample contains two successful responses with different evidence. Ten quote cards exist in static HTML; the JavaScript page embeds ten records but no source quote cards. The latter needs a render check before judging visible content. The implementation separately retains raw-only findings while using effective rendered facts for page conclusions.'
        ],
        table: {
          caption: 'Retained source captures · Quotes to Scrape',
          columns: ['Capture', 'HTML quote cards', 'Embedded records'],
          rows: [
            ['Static HTML', '10', 'Not recorded'],
            ['JavaScript source', '0', '10']
          ],
          note: 'Saved HTML from July 16, 2026; not a fresh crawl, rendered-page measurement, or search-performance result.'
        },
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
        title: 'Keep missing evidence visible',
        body: [
          'A collection gap must not become a bad website score. Provider states record skipped or partial collection, while findings retain page state and rule versions. The sample’s absent canonical is an observation without an assigned severity. This separation makes a recommendation traceable to the evidence actually collected.'
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
        title: 'Code and retained captures',
        body: [
          'The public repository documents the shipped local workflow. The pinned tests and July source sample establish inspectable behavior; hosted delivery, distributed crawling, rank tracking, and traffic gains are outside this case study.'
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
    deck: 'Private salary payments with shared treasury approval.',
    summary: 'I led a three-person team building confidential payroll on Solana, combining private transfer mechanics, shared treasury approval, and inspectable batch state.',
    chapters: [
      {
        id: 'study-section-1',
        label: 'Team build',
        title: 'Privacy, approval, and a payroll record',
        body: [
          'The prototype separates three jobs: keep payment amounts confidential, require shared treasury approval, and retain an inspectable payroll batch. I coordinated the three-person build around those boundaries, using Token-2022 confidential-transfer mechanics and multisig treasury control.'
        ],
      },
      {
        id: 'study-section-2',
        label: 'Batch operations',
        title: 'The batch and its state guards',
        body: [
          'A scheduled batch records its ID, Merkle root, release timestamp, total amount, and frozen state. The important constraint is when that definition can change. These are code-derived operations, not a sequence of executed payment receipts.'
        ],
        table: {
          caption: 'Recorded payroll operations · program revision 9d38b02',
          columns: ['Operation', 'Recorded condition or effect'],
          rows: [
            ['Schedule', 'Set the batch definition and frozen=true.'],
            ['Amend', 'Replace the Merkle root while the batch is frozen.'],
            ['Thaw', 'Require the release time to pass, then clear frozen.'],
            ['Cancel', 'Emit the batch ID and amount; no refund is established.']
          ]
        }
      },
      {
        id: 'study-section-3',
        label: 'Transfer paths',
        title: 'What the prototype establishes',
        body: [
          'The program exposes confidential deposit, transfer, and withdrawal, plus reserve deposit and redemption. Confidential mint and burn are simplified, and the payroll test remains a skeleton with end-to-end TODOs. The retained state record makes those implementation limits inspectable.'
        ],
      },
      {
        id: 'study-section-4',
        label: 'Source material',
        title: 'The build and its public evidence',
        body: [
          'Our teammate’s recap names the team and corroborates its win at the June 2025 OnionDAO Hackathon. The structured record summarizes program revision 9d38b02; the cookbook fork provides related Token-2022 reference code. The complete application and an organizer placement record are outside the retained public packet.'
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
    deck: 'Making a marketing agent’s drafts and engineering changes reviewable.',
    summary: 'I audited ViralBench’s marketing agent and proposed a trace, replay, and independent-review harness for making its engineering changes verifiable.',
    chapters: [
      {
        id: 'study-section-1',
        label: 'Code audit',
        title: 'The audit’s useful findings',
        body: [
          'I traced ViralBench’s research, image generation, preview, draft checks, saved snapshots, and reflection. The preview stops at six slides, yet a longer payload can pass checks. Snapshots omit the complete artifact trace, and caption-prefix matching can attach outcomes to the wrong draft. The existing agent is ViralBench’s work; my contribution is the audit and proposed harness.'
        ],
      },
      {
        id: 'study-section-2',
        label: 'Preview gate',
        title: 'Tie review to the final payload',
        body: [
          'The proposed preview gate renders every slide and issues a receipt tied to the exact final payload. A changed or incompletely previewed draft must fail that gate. Trace recording would retain research responses, generated media, tool calls, and draft identity so a separate evaluator can judge a bounded engineering change.'
        ],
      },
      {
        id: 'study-section-3',
        label: 'Replay cases',
        title: 'Replay the failure before a live trial',
        body: [
          'Replay freezes the research, media, account state, renderer responses, and publishing mocks. Proposed cases cover an unreviewed seventh slide, a payload changed after preview, tool timeouts, missing draft-review URLs, and ambiguous post identity. A patch must handle the retained conditions before entering a controlled live trial.'
        ],
      },
      {
        id: 'study-section-5',
        label: 'Live evaluation',
        title: 'Evaluation outside the proposing agent',
        body: [
          'The live design pairs baseline and treatment by account, slot, and time, fixes measurement windows, and keeps raw outcomes with independent evaluation and release controls. The engineering agent’s scope excludes primary metrics, traces, credentials, and release policy. This is a published design; no completed live trial or causal lift is reported.'
        ]
      },
      {
        id: 'study-section-4',
        label: 'Source material',
        title: 'The inspected revision and full proposal',
        body: [
          'The July 2026 engineering study contains eight audit findings, the trace model, preview-gate experiment, and replay/evaluation plan. The pinned agent source supports the audit; the handoff thresholds are illustrative design examples.'
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
