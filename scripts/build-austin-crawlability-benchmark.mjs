import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RUN_DATE = process.env.AUSTIN_TECHNICAL_ACCESS_DATE ?? new Date().toISOString().slice(0, 10);
const USER_AGENT = 'SulaymanBowlesAustinTechnicalAccessPilot/2.0 (+https://sulayman-bowles.dev/austin-technical-seo)';
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
    'homepage_request_result',
    'homepage_response_2xx_or_3xx',
    'homepage_content_evidence_state',
    'included_in_homepage_content_aggregate',
    'https_final',
    'title_present',
    'meta_description_present',
    'canonical_present',
    'h1_present',
    'jsonld_present',
    'robots_status',
    'robots_request_result',
    'robots_response_2xx_or_3xx',
    'robots_sitemap_count',
    'sitemap_checked_url',
    'sitemap_status',
    'sitemap_request_result',
    'sitemap_response_2xx_or_3xx',
    'successful_check_count',
    'successful_check_total',
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
    return { ...result, requestResult: 'completed' };
  } catch (error) {
    return {
      status: '',
      url,
      text: '',
      requestResult: error?.name === 'TimeoutError' ? 'timeout' : 'network_error',
    };
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

function responseIs2xxOr3xx(result) {
  return result.requestResult === 'completed'
    && Number(result.status) >= 200
    && Number(result.status) < 400;
}

function normalizedHostname(url) {
  return new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
}

function selectSitemapUrl(target, sitemapUrls, origin) {
  if (target.sample_id === 'self') {
    // The first declared sitemap uses a legacy host. Prefer the declaration on the current site.
    const targetHostname = normalizedHostname(target.homepage_url);
    const sameSiteSitemap = sitemapUrls.find((url) => {
      try {
        return normalizedHostname(url) === targetHostname;
      } catch {
        return false;
      }
    });

    if (sameSiteSitemap) {
      return sameSiteSitemap;
    }
  }

  return sitemapUrls[0] ?? `${origin}/sitemap.xml`;
}

function homepageEvidenceState(homepage, html) {
  if (homepage.requestResult !== 'completed') {
    return `measurement_gap_${homepage.requestResult}`;
  }
  if (homepage.status === 403 || homepage.status === 429) {
    return 'measurement_gap_access_limited';
  }
  if (/captcha|access denied|cf-chl|cloudflare|security checkpoint/i.test(html)) {
    return 'measurement_gap_possible_access_challenge_or_interstitial';
  }
  if (!responseIs2xxOr3xx(homepage)) {
    return `measurement_gap_http_${homepage.status || 'unknown'}`;
  }
  return 'confirmed_public_surface';
}

function addEndpointMeasurementNote(notes, label, result) {
  if (result.requestResult !== 'completed') {
    notes.push(`${label}_${result.requestResult}`);
  } else if (!responseIs2xxOr3xx(result)) {
    notes.push(`${label}_http_${result.status || 'unknown'}`);
  }
}

function measurementNote(homepageState, robots, sitemap) {
  const notes = [];
  if (homepageState !== 'confirmed_public_surface') {
    notes.push(homepageState);
  }
  addEndpointMeasurementNote(notes, 'robots', robots);
  addEndpointMeasurementNote(notes, 'sitemap', sitemap);
  return notes.length ? notes.join(';') : 'no_measurement_gap_observed';
}

async function measureTarget(target) {
  const homepage = await safeFetch(target.homepage_url);
  const finalUrl = homepage.url || target.homepage_url;
  const origin = originFor(finalUrl);
  const robotsUrl = `${origin}/robots.txt`;
  const robots = await safeFetch(robotsUrl);
  const sitemapUrls = responseIs2xxOr3xx(robots) ? sitemapUrlsFromRobots(robots.text) : [];
  const sitemapUrl = selectSitemapUrl(target, sitemapUrls, origin);
  const sitemap = await safeFetch(sitemapUrl);
  const html = homepage.text ?? '';
  const homepageState = homepageEvidenceState(homepage, html);
  const includeHomepageContent = homepageState === 'confirmed_public_surface';
  const checks = {
    https_final: finalUrl.startsWith('https://'),
    title_present: hasTitle(html),
    meta_description_present: hasMetaDescription(html),
    canonical_present: hasCanonical(html),
    h1_present: hasH1(html),
    jsonld_present: hasJsonLd(html),
  };
  const successfulCheckCount = includeHomepageContent
    ? Object.values(checks).filter(Boolean).length
      + (responseIs2xxOr3xx(robots) ? 1 : 0)
      + (responseIs2xxOr3xx(sitemap) ? 1 : 0)
    : '';

  return {
    sample_id: target.sample_id,
    display_name: target.display_name,
    homepage_url: target.homepage_url,
    segment: target.segment,
    final_url: finalUrl,
    homepage_status: homepage.status,
    homepage_request_result: homepage.requestResult,
    homepage_response_2xx_or_3xx: responseIs2xxOr3xx(homepage),
    homepage_content_evidence_state: homepageState,
    included_in_homepage_content_aggregate: includeHomepageContent,
    https_final: checks.https_final,
    title_present: includeHomepageContent ? checks.title_present : '',
    meta_description_present: includeHomepageContent ? checks.meta_description_present : '',
    canonical_present: includeHomepageContent ? checks.canonical_present : '',
    h1_present: includeHomepageContent ? checks.h1_present : '',
    jsonld_present: includeHomepageContent ? checks.jsonld_present : '',
    robots_status: robots.status,
    robots_request_result: robots.requestResult,
    robots_response_2xx_or_3xx: responseIs2xxOr3xx(robots),
    robots_sitemap_count: sitemapUrls.length,
    sitemap_checked_url: sitemapUrl,
    sitemap_status: sitemap.status,
    sitemap_request_result: sitemap.requestResult,
    sitemap_response_2xx_or_3xx: responseIs2xxOr3xx(sitemap),
    successful_check_count: successfulCheckCount,
    successful_check_total: includeHomepageContent ? 8 : '',
    measurement_note: measurementNote(homepageState, robots, sitemap),
    measured_at: RUN_DATE,
  };
}

function count(rows, predicate) {
  return rows.filter(predicate).length;
}

function buildSummary(rows) {
  const sampleSize = rows.length;
  const homepageContentRows = rows.filter((row) => row.included_in_homepage_content_aggregate === true);
  const aggregate = {
    sample_size: sampleSize,
    homepage_requests_completed: count(rows, (row) => row.homepage_request_result === 'completed'),
    homepage_responses_2xx_or_3xx: count(rows, (row) => row.homepage_response_2xx_or_3xx === true),
    homepage_content_aggregate_eligible: homepageContentRows.length,
    homepage_access_measurement_gaps: sampleSize - homepageContentRows.length,
    https_final: count(rows, (row) => row.https_final === true),
    title_present_among_eligible: count(homepageContentRows, (row) => row.title_present === true),
    meta_description_present_among_eligible: count(homepageContentRows, (row) => row.meta_description_present === true),
    canonical_present_among_eligible: count(homepageContentRows, (row) => row.canonical_present === true),
    h1_present_among_eligible: count(homepageContentRows, (row) => row.h1_present === true),
    jsonld_present_among_eligible: count(homepageContentRows, (row) => row.jsonld_present === true),
    robots_requests_completed: count(rows, (row) => row.robots_request_result === 'completed'),
    robots_responses_2xx_or_3xx: count(rows, (row) => row.robots_response_2xx_or_3xx === true),
    robots_declared_sitemap: count(rows, (row) => Number(row.robots_sitemap_count) > 0),
    sitemap_requests_completed: count(rows, (row) => row.sitemap_request_result === 'completed'),
    sitemap_responses_2xx_or_3xx: count(rows, (row) => row.sitemap_response_2xx_or_3xx === true),
    rows_with_measurement_gaps: count(rows, (row) => row.measurement_note !== 'no_measurement_gap_observed'),
  };

  return {
    generated_at: RUN_DATE,
    sample_type: 'Austin public-site technical access pilot',
    sample_size: sampleSize,
    public_csv: 'https://sulayman-bowles.dev/research/austin-crawlability-benchmark-pilot.csv',
    methodology: [
      'Bounded one-request public fetch of each homepage.',
      'One public robots.txt fetch per final origin.',
      'One sitemap fetch using a robots.txt sitemap URL when available, otherwise /sitemap.xml.',
      'Request completion is recorded separately from whether the HTTP response was 2xx or 3xx.',
      'Challenge or interstitial responses are measurement gaps and are excluded from homepage content-presence aggregates.',
      'The successful check count covers eight fixed presence/availability checks for eligible rows; it is not a quality score or SEO diagnosis.',
    ],
    claim_boundaries: [
      'This pilot is not representative of all Austin companies.',
      'This is a technical-access snapshot, not evidence of local search performance or content health.',
      'Rows do not claim rankings, traffic movement, revenue impact, or AI citations.',
      'Access-limited, timed-out, or challenged fetches are measurement gaps, not negative findings.',
      'The pilot should be used as a public-data conversation starter only after review.',
    ],
    aggregate_denominators: {
      request_response_and_endpoint_checks: sampleSize,
      homepage_content_presence_checks: homepageContentRows.length,
    },
    aggregate,
  };
}

function percentage(value, total) {
  return total === 0 ? '0%' : `${Math.round((value / total) * 100)}%`;
}

function buildReport(summary, rows) {
  const aggregateRows = Object.entries(summary.aggregate)
    .filter(([key]) => key !== 'sample_size')
    .map(([key, value]) => {
      const denominator = key.endsWith('_among_eligible')
        ? summary.aggregate_denominators.homepage_content_presence_checks
        : summary.aggregate_denominators.request_response_and_endpoint_checks;
      return `| ${key} | ${value} | ${denominator} | ${percentage(value, denominator)} |`;
    })
    .join('\n');

  return `# Austin Technical Access Pilot

Generated: ${RUN_DATE}

This bounded public-request pilot records technical access and source availability for a sample of Austin-area technology and business websites. It is not a local-performance benchmark or a content-health audit.

## Public Assets

- CSV: \`public/research/austin-crawlability-benchmark-pilot.csv\`
- Summary JSON: \`public/research/austin-crawlability-benchmark-summary.json\`

## Claim Boundaries

${summary.claim_boundaries.map((item) => `- ${item}`).join('\n')}

## Methodology

${summary.methodology.map((item) => `- ${item}`).join('\n')}

## Aggregate Technical-Access Checks

| Check | Count | Denominator | Share |
| --- | ---: | ---: | ---: |
${aggregateRows}

## Sample

| Site | Segment | Homepage request | Homepage response | Content evidence state | Successful fixed checks | Measurement note |
| --- | --- | --- | --- | --- | ---: | --- |
${rows.map((row) => `| ${row.display_name} | ${row.segment} | ${row.homepage_request_result} | ${row.homepage_status || 'n/a'} | ${row.homepage_content_evidence_state} | ${row.successful_check_count === '' ? 'excluded' : `${row.successful_check_count}/${row.successful_check_total}`} | ${row.measurement_note} |`).join('\n')}

## Pitch Use

Use this only after review and only to discuss aggregate technical-access patterns. It must not be presented as local-performance proof or used to call individual companies broken, unhealthy, or ranking poorly.
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
