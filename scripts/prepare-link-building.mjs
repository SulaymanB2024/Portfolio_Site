import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_URL = 'https://sulayman-bowles.dev';
const TODAY = '2026-06-25';

const paths = {
  playbook: 'docs/link-building/authority-playbook.md',
  templates: 'docs/link-building/outreach-templates.md',
  tracker: 'docs/link-building/prospect-tracker.csv',
  liveEvidence: 'docs/link-building/live-prospect-evidence.csv',
  ownedProfileUpdates: 'docs/link-building/owned-profile-updates.md',
  launchQueue: 'docs/link-building/launch-queue.csv',
  launchDrafts: 'docs/link-building/generated-launch-drafts.md',
  outcomeLog: 'docs/link-building/outreach-outcome-log.csv',
  packets: 'docs/link-building/generated-outreach-packets.md',
  audit: 'docs/link-building/completion-audit.md',
  publishManifest: 'docs/link-building/publish-manifest.json',
  publishReadiness: 'docs/link-building/publish-readiness.md',
  githubRepoAudit: 'docs/link-building/github-owned-repo-opportunities.csv',
  assets: 'public/research/authority-assets.json',
  crawlerSources: 'public/research/ai-search-crawler-policy-sources.csv',
  austinBenchmarkTargets: 'docs/link-building/austin-benchmark-targets.csv',
  austinBenchmarkCsv: 'public/research/austin-crawlability-benchmark-pilot.csv',
  austinBenchmarkSummary: 'public/research/austin-crawlability-benchmark-summary.json',
  austinBenchmarkReport: 'docs/link-building/austin-crawlability-benchmark.md',
  externalCheckScript: 'scripts/check-link-building-external.mjs',
  scopeCheckScript: 'scripts/check-link-building-publish-scope.mjs',
  exportScript: 'scripts/export-link-building-publish.mjs',
  liveCheckScript: 'scripts/check-link-building-live.mjs',
  llms: 'public/llms.txt',
  sitemap: 'public/sitemap.xml',
};

const requiredTrackerColumns = [
  'status',
  'priority',
  'segment',
  'prospect_name',
  'prospect_url',
  'target_page',
  'asset',
  'angle',
  'next_action',
  'outcome',
  'notes',
];

const requiredSourceColumns = ['source_name', 'source_url', 'source_type', 'used_for', 'claim_boundary'];
const requiredEvidenceColumns = [
  'verified_at',
  'prospect_name',
  'source_url',
  'contact_or_submission_url',
  'fit_status',
  'evidence',
  'next_action',
  'risk_boundary',
];
const requiredLaunchQueueColumns = [
  'queue_status',
  'priority',
  'prospect_name',
  'action_type',
  'contact_or_submission_url',
  'target_page',
  'approval_required',
  'send_ready',
  'reason',
  'owner_action',
];
const requiredAustinBenchmarkColumns = [
  'sample_id',
  'display_name',
  'homepage_url',
  'segment',
  'final_url',
  'homepage_status',
  'homepage_fetch_result',
  'https_final',
  'title_present',
  'meta_description_present',
  'canonical_present',
  'h1_present',
  'jsonld_present',
  'robots_status',
  'robots_fetch_result',
  'robots_sitemap_count',
  'sitemap_checked_url',
  'sitemap_status',
  'sitemap_fetch_result',
  'observed_signal_count',
  'measurement_note',
  'measured_at',
];
const requiredOutcomeColumns = [
  'prospect_name',
  'action_type',
  'target_page',
  'submitted_at',
  'submitted_by',
  'status',
  'linked_url',
  'anchor_text',
  'follow_state',
  'verification_source',
  'verified_at',
  'notes',
];
const requiredGithubRepoAuditColumns = [
  'checked_at',
  'repo_name',
  'repo_url',
  'pushed_at',
  'public_state',
  'fit_status',
  'target_page',
  'evidence',
  'next_action',
  'risk_boundary',
];
const allowedStatuses = new Set(['owned', 'research', 'ready', 'sent', 'won', 'lost', 'blocked']);
const allowedOutcomeStatuses = new Set(['not_started', 'drafted', 'submitted', 'accepted', 'rejected', 'published', 'verified']);
const allowedQueueStatuses = new Set([
  'ready_for_owner',
  'ready_after_login',
  'ready_after_review',
  'ready_after_publish',
  'ready_if_non_promotional',
  'verified_done',
  'gated',
  'wait_for_benchmark',
  'membership_gated',
  'research_only',
  'opportunity_if_eligible',
]);

function resolve(relativePath) {
  return path.resolve(ROOT, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(resolve(relativePath), 'utf8');
}

function write(relativePath, value) {
  fs.mkdirSync(path.dirname(resolve(relativePath)), { recursive: true });
  fs.writeFileSync(resolve(relativePath), value);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function fileExists(relativePath) {
  return fs.existsSync(resolve(relativePath));
}

function parseCsvLine(line) {
  const cells = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(value);
      value = '';
    } else {
      value += char;
    }
  }

  cells.push(value);
  return cells;
}

function parseCsv(relativePath) {
  const lines = read(relativePath)
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const columns = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line, index) => {
    const cells = parseCsvLine(line);
    assert(cells.length === columns.length, `${relativePath}:${index + 2} has ${cells.length} cells, expected ${columns.length}`);
    return Object.fromEntries(columns.map((column, cellIndex) => [column, cells[cellIndex] ?? '']));
  });

  return { columns, rows };
}

function compareColumns(actual, expected, label) {
  assert(actual.join('|') === expected.join('|'), `${label} columns changed: ${actual.join(', ')}`);
}

function markdownTable(rows) {
  const headers = ['Priority', 'Prospect', 'Segment', 'Target', 'Asset', 'Next action'];
  const values = rows.map((row) => [
    row.priority,
    row.prospect_name,
    row.segment,
    row.target_page,
    row.asset,
    row.next_action,
  ]);

  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...values.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`),
  ].join('\n');
}

function templateFor(row) {
  if (row.segment.includes('existing-mention') || row.asset.includes('Identity reconciliation')) {
    return 'Profile / Existing Mention Reclamation';
  }
  if (row.asset.includes('Atlas') || row.target_page.includes('/atlas')) {
    return 'Atlas Evidence Pack';
  }
  if (row.segment.includes('local-austin') || row.target_page.includes('/austin-technical-seo')) {
    return 'Austin Crawlability Benchmark';
  }
  if (row.target_page.includes('/case-studies/technical-seo-audit')) {
    return 'Collaboration / Case Study';
  }
  return 'AI Crawler Policy Resource';
}

function evidenceFor(row, liveEvidence) {
  return liveEvidence.rows.find((item) => item.prospect_name === row.prospect_name);
}

function buildPacket(row, index, liveEvidence) {
  const evidence = evidenceFor(row, liveEvidence);
  const evidenceBlock = evidence
    ? `- Live evidence: ${evidence.evidence}
- Source checked: ${evidence.source_url}
- Contact/submission path: ${evidence.contact_or_submission_url}
- Fit status: ${evidence.fit_status}
- Evidence-based next action: ${evidence.next_action}
- Evidence boundary: ${evidence.risk_boundary}
`
    : '- Live evidence: Not yet verified in `docs/link-building/live-prospect-evidence.csv`.\n';

  return `## Packet ${index + 1}: ${row.prospect_name}

- Status: ${row.status}
- Priority: ${row.priority}
- Segment: ${row.segment}
- Prospect URL: ${row.prospect_url}
- Target page: ${row.target_page}
- Asset: ${row.asset}
- Angle: ${row.angle}
- Next action: ${row.next_action}
- Template: ${templateFor(row)}
${evidenceBlock}- Send status: not sent.
- Approval note: send manually only after confirming fit, contact path, and account permission.
- Claim boundary: do not imply rankings, traffic, revenue, AI citations, or DR movement.
`;
}

function draftForQueueRow(row) {
  if (row.prospect_name === 'Search Engine Land') {
    return {
      subject: 'Source-backed AI crawler policy reference',
      body: `Hi Search Engine Land team,

I put together a source-backed reference on AI-search crawler policy, robots directives, IndexNow, and source-page clarity:

https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy

The companion source map is here:

https://sulayman-bowles.dev/research/ai-search-crawler-policy-sources.csv

The piece is intentionally conservative. It treats crawler access as a discovery condition, not a ranking, indexing, AI-citation, or DR guarantee. If you are collecting expert sources around AI search crawl policy, search-vs-training crawler distinctions, or public source-page hygiene, it may be useful as a reference.

Best,
Sulayman`,
    };
  }

  if (row.prospect_name === 'SEOFOMO') {
    return {
      subject: 'AI-search crawler policy source map',
      body: `Suggested SEOFOMO submission:

Title: AI search crawler policy: source-backed map of search, training, and user-requested retrieval agents

URL: https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy

Description: A conservative technical reference on AI-search crawler policy, robots directives, IndexNow, canonical source pages, and claim boundaries. Includes a source map at https://sulayman-bowles.dev/research/ai-search-crawler-policy-sources.csv. It does not claim rankings, AI citations, or visibility guarantees.`,
    };
  }

  if (row.prospect_name === 'OpenAI developer community') {
    return {
      subject: 'AI crawler policy and source-page clarity',
      body: `Draft discussion post:

I wrote a source-backed reference on AI-search crawler policy and public source-page clarity:

https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy

The practical distinction I wanted to make is between search crawlers, training crawlers, and user-requested retrieval agents. The post also covers robots directives, IndexNow, canonical URLs, and why crawler access is only a discovery condition, not a ranking or citation guarantee.

Source map:
https://sulayman-bowles.dev/research/ai-search-crawler-policy-sources.csv

Interested in feedback on whether the crawler/source-page framing is clear for developers maintaining public docs or project sites.`,
    };
  }

  if (row.prospect_name === 'Austin Business Journal') {
    return {
      subject: 'Austin crawlability benchmark pilot',
      body: `Hi Austin Business Journal team,

I built a small public benchmark looking at crawlability signals across 12 Austin-area technology and business websites:

https://sulayman-bowles.dev/research/austin-crawlability-benchmark-pilot.csv

Summary:
https://sulayman-bowles.dev/research/austin-crawlability-benchmark-summary.json

The local context page is here:
https://sulayman-bowles.dev/austin-technical-seo

The benchmark is intentionally bounded: public homepage, robots.txt, and sitemap checks only. It does not claim rankings, traffic, revenue impact, AI citations, or site health, and access-limited/challenged fetches are treated as measurement gaps rather than negative findings.

If you are covering Austin companies' public web infrastructure or AI-search readiness, I can share the methodology and explain the aggregate patterns without naming-and-shaming individual sites.

Best,
Sulayman`,
    };
  }

  if (row.prospect_name === 'Search Engine Journal') {
    return {
      subject: 'Expert source on AI crawler policy',
      body: `Hi SEJ team,

I know contributor access is editorially gated, so this is a source note rather than a guest-post request.

I published a conservative reference on AI-search crawler policy, source-page clarity, robots directives, and IndexNow:

https://sulayman-bowles.dev/research/ai-crawlers/ai-search-crawler-policy

Source map:
https://sulayman-bowles.dev/research/ai-search-crawler-policy-sources.csv

The piece avoids ranking, traffic, DR, or AI-citation claims and focuses on public technical signals. If you need a source or quote around search-vs-training crawler distinctions or public site readiness for AI retrieval, I am happy to help.

Best,
Sulayman`,
    };
  }

  return {
    subject: row.owner_action,
    body: `Action: ${row.owner_action}

Target: ${row.target_page}
Contact or submission URL: ${row.contact_or_submission_url}

Review boundary: ${row.reason}

Do not send or apply without account access and approval.`,
  };
}

function validatePack() {
  for (const relativePath of Object.values(paths)) {
    if (relativePath === paths.packets || relativePath === paths.launchDrafts || relativePath === paths.audit) {
      continue;
    }
    assert(fileExists(relativePath), `missing required file: ${relativePath}`);
  }

  const authorityAssets = JSON.parse(read(paths.assets));
  assert(authorityAssets.generated_at === TODAY, 'authority asset index generated_at must match current pack date');
  assert(authorityAssets.canonical_host === SITE_URL, 'authority asset index canonical_host mismatch');
  assert(Array.isArray(authorityAssets.claim_boundaries) && authorityAssets.claim_boundaries.length >= 4, 'authority asset index needs claim boundaries');
  assert(Array.isArray(authorityAssets.assets) && authorityAssets.assets.length >= 8, 'authority asset index needs at least 8 assets');

  const assetUrls = new Set(authorityAssets.assets.map((asset) => asset.url));
  assert(assetUrls.has(`${SITE_URL}/research`), 'authority asset index missing research hub');
  for (const asset of authorityAssets.assets) {
    assert(asset.name && asset.url && asset.type && asset.preferred_anchor && asset.pitch_angle, `incomplete authority asset: ${asset.name ?? asset.url}`);
    assert(asset.url.startsWith(SITE_URL), `authority asset must be on canonical host: ${asset.url}`);
  }

  const tracker = parseCsv(paths.tracker);
  compareColumns(tracker.columns, requiredTrackerColumns, paths.tracker);
  assert(tracker.rows.length >= 40, 'prospect tracker should keep at least 40 rows');
  assert(
    tracker.rows.some((row) => row.prospect_name === 'GitHub profile' && ['owned', 'won'].includes(row.status)),
    'tracker missing GitHub profile owned or won action',
  );
  assert(tracker.rows.some((row) => row.prospect_name === 'LinkedIn profile' && row.status === 'owned'), 'tracker missing LinkedIn profile owned action');
  assert(tracker.rows.some((row) => row.target_page.includes('/research/ai-crawlers/ai-search-crawler-policy')), 'tracker missing AI crawler policy prospects');
  assert(tracker.rows.some((row) => row.target_page.includes('/atlas/sample-crawl')), 'tracker missing Atlas sample crawl prospects');
  assert(tracker.rows.some((row) => row.target_page.includes('/austin-technical-seo')), 'tracker missing Austin technical SEO prospects');

  for (const row of tracker.rows) {
    assert(allowedStatuses.has(row.status), `unsupported tracker status: ${row.status}`);
    assert(Number.isInteger(Number(row.priority)) && Number(row.priority) >= 1 && Number(row.priority) <= 3, `bad priority for ${row.prospect_name}`);
    assert(row.prospect_name && row.prospect_url && row.target_page && row.asset && row.angle && row.next_action, `incomplete tracker row: ${row.prospect_name}`);
    if (row.target_page.startsWith(SITE_URL) && row.target_page !== `${SITE_URL}/`) {
      assert(assetUrls.has(row.target_page) || row.target_page.includes('/method'), `target page not represented by authority assets: ${row.target_page}`);
    }
  }

  const crawlerSources = parseCsv(paths.crawlerSources);
  compareColumns(crawlerSources.columns, requiredSourceColumns, paths.crawlerSources);
  assert(crawlerSources.rows.length >= 10, 'crawler policy source map should have at least 10 sources');
  assert(crawlerSources.rows.every((row) => row.source_url.startsWith('https://')), 'crawler policy source map URLs must be HTTPS');
  assert(crawlerSources.rows.some((row) => row.source_name.includes('Google Search spam policies')), 'source map missing Google spam policy source');
  assert(crawlerSources.rows.some((row) => row.source_name.includes('Ahrefs Domain Rating')), 'source map missing Ahrefs DR source');

  const austinBenchmark = parseCsv(paths.austinBenchmarkCsv);
  compareColumns(austinBenchmark.columns, requiredAustinBenchmarkColumns, paths.austinBenchmarkCsv);
  assert(austinBenchmark.rows.length >= 10, 'Austin benchmark should keep at least 10 measured rows');
  assert(austinBenchmark.rows.every((row) => row.homepage_fetch_result), 'Austin benchmark rows need homepage fetch results');
  assert(austinBenchmark.rows.every((row) => row.measurement_note), 'Austin benchmark rows need measurement notes');
  const austinSummary = JSON.parse(read(paths.austinBenchmarkSummary));
  assert(austinSummary.generated_at === TODAY, 'Austin benchmark summary generated_at must match pack date');
  assert(austinSummary.sample_size === austinBenchmark.rows.length, 'Austin benchmark summary sample size must match CSV rows');
  assert(Array.isArray(austinSummary.claim_boundaries) && austinSummary.claim_boundaries.length >= 4, 'Austin benchmark summary needs claim boundaries');
  assert(read(paths.austinBenchmarkReport).includes('Austin Crawlability Benchmark Pilot'), 'Austin benchmark report missing title');

  const liveEvidence = parseCsv(paths.liveEvidence);
  compareColumns(liveEvidence.columns, requiredEvidenceColumns, paths.liveEvidence);
  assert(liveEvidence.rows.length >= 10, 'live prospect evidence should cover at least 10 priority checks');
  assert(liveEvidence.rows.every((row) => row.source_url.startsWith('https://')), 'live evidence source URLs must be HTTPS');
  assert(liveEvidence.rows.every((row) => row.contact_or_submission_url.startsWith('https://')), 'live evidence contact/submission URLs must be HTTPS');
  for (const prospectName of ['Search Engine Land', 'SEOFOMO', 'Austin Chamber', 'Austin Business Journal', 'OpenAI developer community']) {
    assert(liveEvidence.rows.some((row) => row.prospect_name === prospectName), `live evidence missing ${prospectName}`);
  }

  const launchQueue = parseCsv(paths.launchQueue);
  compareColumns(launchQueue.columns, requiredLaunchQueueColumns, paths.launchQueue);
  assert(launchQueue.rows.length >= 12, 'launch queue should include at least 12 priority actions');
  assert(launchQueue.rows.every((row) => allowedQueueStatuses.has(row.queue_status)), 'launch queue has unsupported status');
  assert(launchQueue.rows.every((row) => row.approval_required === 'yes'), 'launch queue actions must require approval');
  assert(launchQueue.rows.every((row) => row.send_ready === 'no'), 'launch queue must not mark unsent outreach as send_ready');
  for (const prospectName of ['GitHub profile', 'LinkedIn profile', 'SEOFOMO', 'Search Engine Land', 'Austin Business Journal']) {
    assert(launchQueue.rows.some((row) => row.prospect_name === prospectName), `launch queue missing ${prospectName}`);
  }

  const outcomeLog = parseCsv(paths.outcomeLog);
  compareColumns(outcomeLog.columns, requiredOutcomeColumns, paths.outcomeLog);
  assert(outcomeLog.rows.length >= 10, 'outcome log should include at least 10 tracked external actions');
  assert(outcomeLog.rows.every((row) => allowedOutcomeStatuses.has(row.status)), 'outcome log has unsupported status');
  assert(outcomeLog.rows.every((row) => row.status === 'not_started' || row.submitted_at), 'submitted outcome rows need submitted_at');
  assert(outcomeLog.rows.every((row) => row.status !== 'verified' || (row.linked_url && row.verification_source && row.verified_at)), 'verified outcome rows need linked_url, verification_source, and verified_at');

  const githubRepoAudit = parseCsv(paths.githubRepoAudit);
  compareColumns(githubRepoAudit.columns, requiredGithubRepoAuditColumns, paths.githubRepoAudit);
  assert(githubRepoAudit.rows.length >= 12, 'GitHub repo opportunity audit should classify long-tail owned repos');
  assert(githubRepoAudit.rows.every((row) => row.repo_url.startsWith('https://github.com/SulaymanB2024/')), 'GitHub repo audit URLs must stay on the owned account');
  assert(githubRepoAudit.rows.every((row) => row.evidence && row.next_action && row.risk_boundary), 'GitHub repo audit rows need evidence, next action, and risk boundary');
  assert(
    githubRepoAudit.rows.some((row) => row.repo_name === '5-Race-the-Case-Competition' && row.fit_status === 'verified_owned_repo_metadata'),
    'GitHub repo audit missing verified Race-the-Case metadata link',
  );

  const profileUpdates = read(paths.ownedProfileUpdates);
  for (const requiredText of ['GitHub Profile', 'LinkedIn', 'Thick-Scraper-VOID- Repository', 'Claim Boundary']) {
    assert(profileUpdates.includes(requiredText), `owned profile updates missing ${requiredText}`);
  }

  const llms = read(paths.llms);
  assert(llms.includes(`${SITE_URL}/research`), 'llms.txt missing research asset hub');
  assert(llms.includes(`${SITE_URL}/research/authority-assets.json`), 'llms.txt missing authority asset index');
  assert(llms.includes(`${SITE_URL}/research/ai-search-crawler-policy-sources.csv`), 'llms.txt missing crawler policy source map');
  assert(llms.includes(`${SITE_URL}/research/austin-crawlability-benchmark-pilot.csv`), 'llms.txt missing Austin benchmark CSV');
  assert(llms.includes(`${SITE_URL}/research/austin-crawlability-benchmark-summary.json`), 'llms.txt missing Austin benchmark summary');
  assert(llms.includes('They do not prove backlinks, Ahrefs Domain Rating movement, rankings, traffic, site health, revenue impact, or AI answer citations.'), 'llms.txt missing authority claim boundary');

  const sitemap = read(paths.sitemap);
  assert(sitemap.includes(`<loc>${SITE_URL}/research</loc>`), 'sitemap missing research asset hub');

  return { authorityAssets, tracker, crawlerSources, liveEvidence, launchQueue, outcomeLog, austinBenchmark, githubRepoAudit };
}

function writePackets(tracker, liveEvidence) {
  const priorityRows = tracker.rows
    .filter((row) => row.priority === '1')
    .slice(0, 18);

  const packets = `# Generated Link-Building Outreach Packets

Generated: ${TODAY}

These packets are generated from \`${paths.tracker}\`. They are not sent mail. Review each prospect manually before outreach.

${markdownTable(priorityRows)}

${priorityRows.map((row, index) => buildPacket(row, index, liveEvidence)).join('\n')}
`;

  write(paths.packets, packets);
}

function writeLaunchDrafts(launchQueue) {
  const draftRows = launchQueue.rows.filter((row) =>
    ['ready_after_login', 'ready_after_review', 'ready_after_publish', 'ready_if_non_promotional', 'gated'].includes(row.queue_status),
  );

  const body = `# Generated Launch Drafts

Generated: ${TODAY}

These drafts are approval-ready payloads for the launch queue. They are not sent messages and should not be posted without account access, fit review, and approval.

${draftRows
  .map((row, index) => {
    const draft = draftForQueueRow(row);
    return `## Draft ${index + 1}: ${row.prospect_name}

- Queue status: ${row.queue_status}
- Action type: ${row.action_type}
- Contact/submission URL: ${row.contact_or_submission_url}
- Target page: ${row.target_page}
- Approval required: ${row.approval_required}
- Send ready now: ${row.send_ready}
- Boundary: ${row.reason}

Subject:

\`\`\`text
${draft.subject}
\`\`\`

Body:

\`\`\`text
${draft.body}
\`\`\`
`;
  })
  .join('\n')}
`;

  write(paths.launchDrafts, body);
}

function writeAudit({ authorityAssets, tracker, crawlerSources, liveEvidence, launchQueue, outcomeLog, austinBenchmark, githubRepoAudit }) {
  const doneRows = [
    ['Authority playbook', paths.playbook, 'done in repo'],
    ['Outreach templates', paths.templates, 'done in repo'],
    ['Prospect tracker', paths.tracker, `${tracker.rows.length} rows`],
    ['Live priority prospect evidence', paths.liveEvidence, `${liveEvidence.rows.length} verified source checks`],
    ['Owned profile update drafts', paths.ownedProfileUpdates, 'copy-ready, not applied externally'],
    ['Approval-gated launch queue', paths.launchQueue, 'ready/gated/research actions separated'],
    ['Generated launch drafts', paths.launchDrafts, `${launchQueue.rows.filter((row) => ['ready_after_login', 'ready_after_review', 'ready_after_publish', 'ready_if_non_promotional', 'gated'].includes(row.queue_status)).length} draft payloads`],
    ['Outreach outcome log', paths.outcomeLog, `${outcomeLog.rows.length} tracked external actions`],
    ['GitHub owned repo opportunity audit', paths.githubRepoAudit, `${githubRepoAudit.rows.length} long-tail repos classified`],
    ['Authority asset index', paths.assets, `${authorityAssets.assets.length} assets`],
    ['Crawler policy source map', paths.crawlerSources, `${crawlerSources.rows.length} sources`],
    ['Austin crawlability benchmark', `${paths.austinBenchmarkCsv} and ${paths.austinBenchmarkSummary}`, `${austinBenchmark.rows.length} measured rows`],
    ['Publish manifest', paths.publishManifest, 'defines the link-building-only file scope'],
    ['Publish readiness handoff', paths.publishReadiness, 'documents current deploy/scope blockers'],
    ['Authority pack validator/generator', 'scripts/prepare-link-building.mjs and npm run linkbuilding:prepare', 'done in repo'],
    ['External placement verifier', `${paths.externalCheckScript} and npm run linkbuilding:external-check`, 'checks verified public placements and reports pending blockers'],
    ['Publish scope verifier', `${paths.scopeCheckScript} and npm run linkbuilding:scope-check`, 'guards against shipping unrelated dirty files'],
    ['Publish export helper', `${paths.exportScript} and npm run linkbuilding:export-publish`, 'exports manifest files for a clean worktree'],
    ['Live deployment verifier', `${paths.liveCheckScript} and npm run linkbuilding:live-check`, 'ready; must pass after deployment'],
    ['Generated outreach packets', paths.packets, 'ready for review'],
  ];

  const externalRows = [
    ['Owned profile edits', 'GitHub, LinkedIn, Devpost, Medium/Substack, Kaggle where applicable', 'requires account access'],
    ['Manual outreach sends', 'Prospects in tracker with approved fit', 'requires approval and sender account'],
    ['Publication decisions', 'Newsletters, resource pages, communities, local publications', 'external editorial control'],
    ['Verified links', 'Ahrefs, GSC, Bing, and manual checks after crawl', 'requires time after publication'],
    ['DR movement', 'Ahrefs after new referring domains are discovered', 'third-party metric, not guaranteed'],
  ];

  const formatRows = (rows) => [
    '| Item | Evidence / scope | Status |',
    '| --- | --- | --- |',
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');

  const audit = `# Link-Building Completion Audit

Generated: ${TODAY}

## Completed In This Repository

${formatRows(doneRows)}

## External Work Still Required

${formatRows(externalRows)}

## Verification Commands

\`\`\`bash
npm run linkbuilding:prepare
npm run linkbuilding:scope-check
npm run linkbuilding:external-check
npm run linkbuilding:export-publish
npm run lint
npm run build
npm run linkbuilding:live-check
\`\`\`

## Completion Rule

The in-repository authority pack is ready when local validation passes and the generated files are present. Outreach should not start until \`npm run linkbuilding:live-check\` passes against the deployed canonical host. The full DR/link-building goal is not externally complete until profile edits, outreach sends, editorial placements, verified links, and post-crawl measurement have real evidence in \`${paths.tracker}\`.
`;

  write(paths.audit, audit);
}

function main() {
  const pack = validatePack();
  writePackets(pack.tracker, pack.liveEvidence);
  writeLaunchDrafts(pack.launchQueue);
  writeAudit(pack);
  console.log(
    JSON.stringify(
      {
        ok: true,
        authorityAssets: pack.authorityAssets.assets.length,
        trackerRows: pack.tracker.rows.length,
        liveEvidenceRows: pack.liveEvidence.rows.length,
        launchQueueRows: pack.launchQueue.rows.length,
        outcomeLogRows: pack.outcomeLog.rows.length,
        githubRepoAuditRows: pack.githubRepoAudit.rows.length,
        crawlerPolicySources: pack.crawlerSources.rows.length,
        austinBenchmarkRows: pack.austinBenchmark.rows.length,
        generated: [paths.packets, paths.launchDrafts, paths.audit],
      },
      null,
      2,
    ),
  );
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
