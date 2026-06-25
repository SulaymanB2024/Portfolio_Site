import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RUN_DATE = '2026-06-25';
const USER_AGENT = 'SulaymanBowlesAustinBenchmark/1.0 (+https://sulayman-bowles.dev/austin-technical-seo)';
const TIMEOUT_MS = 12000;

const paths = {
  targets: 'docs/link-building/austin-benchmark-targets.csv',
  csv: 'public/research/austin-crawlability-benchmark-pilot.csv',
  summary: 'public/research/austin-crawlability-benchmark-summary.json',
  report: 'docs/link-building/austin-crawlability-benchmark.md',
};

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
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
}

function csvValue(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function writeCsv(relativePath, rows) {
  const headers = [
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
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
  ].join('\n');
  write(relativePath, `${csv}\n`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7',
    },
  });
  const text = await response.text();
  return { status: response.status, url: response.url, text };
}

async function safeFetch(url) {
  try {
    const result = await fetchText(url);
    return { ...result, fetchResult: 'ok' };
  } catch (error) {
    return { status: '', url, text: '', fetchResult: error?.name === 'TimeoutError' ? 'timeout' : 'error' };
  }
}

function originFor(url) {
  return new URL(url).origin;
}

function hasMetaDescription(html) {
  return /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)
    || /<meta\b[^>]*content=["'][^"']+["'][^>]*name=["']description["'][^>]*>/i.test(html);
}

function hasCanonical(html) {
  return /<link\b[^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*href=["'][^"']+["'][^>]*>/i.test(html)
    || /<link\b[^>]*href=["'][^"']+["'][^>]*rel=["'][^"']*\bcanonical\b[^"']*["'][^>]*>/i.test(html);
}

function hasTitle(html) {
  return /<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title>/i.test(html);
}

function hasH1(html) {
  return /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html);
}

function hasJsonLd(html) {
  return /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
}

function sitemapUrlsFromRobots(robotsText) {
  return Array.from(robotsText.matchAll(/^sitemap:\s*(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
}

function measurementNote(homepage, robots, sitemap, html) {
  const notes = [];
  if (homepage.fetchResult !== 'ok') {
    notes.push(`homepage_${homepage.fetchResult}`);
  }
  if (homepage.status === 403 || homepage.status === 429) {
    notes.push('homepage_access_limited');
  }
  if (/captcha|access denied|cf-chl|cloudflare|security checkpoint/i.test(html)) {
    notes.push('possible_bot_challenge_or_interstitial');
  }
  if (robots.fetchResult !== 'ok') {
    notes.push(`robots_${robots.fetchResult}`);
  }
  if (sitemap.fetchResult !== 'ok') {
    notes.push(`sitemap_${sitemap.fetchResult}`);
  }
  return notes.length ? notes.join(';') : 'public_fetch_completed';
}

async function measureTarget(target) {
  const homepage = await safeFetch(target.homepage_url);
  const finalUrl = homepage.url || target.homepage_url;
  const origin = originFor(finalUrl);
  const robotsUrl = `${origin}/robots.txt`;
  const robots = await safeFetch(robotsUrl);
  const sitemapUrls = robots.fetchResult === 'ok' ? sitemapUrlsFromRobots(robots.text) : [];
  const sitemapUrl = sitemapUrls[0] ?? `${origin}/sitemap.xml`;
  const sitemap = await safeFetch(sitemapUrl);
  const html = homepage.text ?? '';
  const checks = {
    https_final: finalUrl.startsWith('https://'),
    title_present: hasTitle(html),
    meta_description_present: hasMetaDescription(html),
    canonical_present: hasCanonical(html),
    h1_present: hasH1(html),
    jsonld_present: hasJsonLd(html),
  };
  const observedSignalCount = Object.values(checks).filter(Boolean).length
    + (robots.fetchResult === 'ok' && Number(robots.status) >= 200 && Number(robots.status) < 400 ? 1 : 0)
    + (sitemap.fetchResult === 'ok' && Number(sitemap.status) >= 200 && Number(sitemap.status) < 400 ? 1 : 0)
    + sitemapUrls.length;

  return {
    sample_id: target.sample_id,
    display_name: target.display_name,
    homepage_url: target.homepage_url,
    segment: target.segment,
    final_url: finalUrl,
    homepage_status: homepage.status,
    homepage_fetch_result: homepage.fetchResult,
    https_final: checks.https_final,
    title_present: checks.title_present,
    meta_description_present: checks.meta_description_present,
    canonical_present: checks.canonical_present,
    h1_present: checks.h1_present,
    jsonld_present: checks.jsonld_present,
    robots_status: robots.status,
    robots_fetch_result: robots.fetchResult,
    robots_sitemap_count: sitemapUrls.length,
    sitemap_checked_url: sitemapUrl,
    sitemap_status: sitemap.status,
    sitemap_fetch_result: sitemap.fetchResult,
    observed_signal_count: observedSignalCount,
    measurement_note: measurementNote(homepage, robots, sitemap, html),
    measured_at: RUN_DATE,
  };
}

function count(rows, predicate) {
  return rows.filter(predicate).length;
}

function buildSummary(rows) {
  const sampleSize = rows.length;
  const aggregate = {
    sample_size: sampleSize,
    homepage_fetch_ok: count(rows, (row) => row.homepage_fetch_result === 'ok'),
    homepage_2xx_or_3xx: count(rows, (row) => Number(row.homepage_status) >= 200 && Number(row.homepage_status) < 400),
    https_final: count(rows, (row) => row.https_final === true),
    title_present: count(rows, (row) => row.title_present === true),
    meta_description_present: count(rows, (row) => row.meta_description_present === true),
    canonical_present: count(rows, (row) => row.canonical_present === true),
    h1_present: count(rows, (row) => row.h1_present === true),
    jsonld_present: count(rows, (row) => row.jsonld_present === true),
    robots_request_completed: count(rows, (row) => row.robots_fetch_result === 'ok'),
    robots_2xx_or_3xx: count(rows, (row) => Number(row.robots_status) >= 200 && Number(row.robots_status) < 400),
    robots_declared_sitemap: count(rows, (row) => Number(row.robots_sitemap_count) > 0),
    sitemap_request_completed: count(rows, (row) => row.sitemap_fetch_result === 'ok'),
    sitemap_2xx_or_3xx: count(rows, (row) => Number(row.sitemap_status) >= 200 && Number(row.sitemap_status) < 400),
    measurement_gaps: count(rows, (row) => row.measurement_note !== 'public_fetch_completed'),
  };

  return {
    generated_at: RUN_DATE,
    sample_type: 'Austin public-site crawlability pilot',
    sample_size: sampleSize,
    public_csv: 'https://sulayman-bowles.dev/research/austin-crawlability-benchmark-pilot.csv',
    methodology: [
      'Bounded one-request public fetch of each homepage.',
      'One public robots.txt fetch per final origin.',
      'One sitemap fetch using the first robots.txt sitemap URL when available, otherwise /sitemap.xml.',
      'Signals are presence/availability checks, not quality scores or SEO diagnoses.',
    ],
    claim_boundaries: [
      'This pilot is not representative of all Austin companies.',
      'Rows do not claim rankings, traffic movement, revenue impact, AI citations, or site health.',
      'Access-limited, timed-out, or challenged fetches are measurement gaps, not negative findings.',
      'The benchmark should be used as a public-data conversation starter before any local media pitch.',
    ],
    aggregate,
  };
}

function percentage(value, total) {
  return total === 0 ? '0%' : `${Math.round((value / total) * 100)}%`;
}

function buildReport(summary, rows) {
  const aggregateRows = Object.entries(summary.aggregate)
    .filter(([key]) => key !== 'sample_size')
    .map(([key, value]) => `| ${key} | ${value} | ${percentage(value, summary.sample_size)} |`)
    .join('\n');

  return `# Austin Crawlability Benchmark Pilot

Generated: ${RUN_DATE}

This pilot measures a bounded public sample of Austin-area technology and business websites. It is intended to create a source-backed local conversation around crawlability, source clarity, and machine-readable public pages.

## Public Assets

- CSV: \`public/research/austin-crawlability-benchmark-pilot.csv\`
- Summary JSON: \`public/research/austin-crawlability-benchmark-summary.json\`

## Claim Boundaries

${summary.claim_boundaries.map((item) => `- ${item}`).join('\n')}

## Methodology

${summary.methodology.map((item) => `- ${item}`).join('\n')}

## Aggregate Signals

| Signal | Count | Share |
| --- | ---: | ---: |
${aggregateRows}

## Sample

| Site | Segment | Homepage status | Signals observed | Measurement note |
| --- | --- | ---: | ---: | --- |
${rows.map((row) => `| ${row.display_name} | ${row.segment} | ${row.homepage_status || 'n/a'} | ${row.observed_signal_count} | ${row.measurement_note} |`).join('\n')}

## Pitch Use

Use this as support for Austin-local outreach only after review. The pitch should discuss aggregate public-web patterns and the need for technical SEO evidence. It should not call out individual companies as broken, unhealthy, or ranking poorly.
`;
}

async function main() {
  const targets = parseCsv(paths.targets);
  const rows = [];

  for (const target of targets) {
    rows.push(await measureTarget(target));
  }

  const summary = buildSummary(rows);
  writeCsv(paths.csv, rows);
  write(paths.summary, `${JSON.stringify(summary, null, 2)}\n`);
  write(paths.report, buildReport(summary, rows));

  console.log(JSON.stringify({ ok: true, rows: rows.length, outputs: [paths.csv, paths.summary, paths.report] }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
