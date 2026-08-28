import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { PROGRAMMATIC_SEO_HUBS, PROGRAMMATIC_SEO_PAGES } from '../src/content/programmaticSeo';

type DataState = 'final' | 'all';
type SearchRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };
type Metric = { clicks: number; impressions: number; ctr: number; position: number | null };
type Inspection = {
  path: string;
  verdict: string;
  coverageState: string;
  indexingState: string;
  pageFetchState: string;
  robotsTxtState: string;
  lastCrawlTime: string | null;
  googleCanonical: string | null;
  userCanonical: string | null;
};

const SITE_PROPERTY = process.env.GSC_SITE_URL?.trim() || 'sc-domain:sulayman-bowles.dev';
const CANONICAL_ORIGIN = 'https://sulayman-bowles.dev';
const OUTPUT_DIR = path.resolve('output/seo');
const BRAND_PATTERN = /(?:sulayman(?:\s+bowles)?|bowles|void\s+agency|atlas\s+seo|sulayman-bowles\.dev)/i;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const valueAfter = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const start = valueAfter('--start');
  const end = valueAfter('--end');
  const state = (valueAfter('--state') ?? 'final') as DataState;
  assert(start && end && /^\d{4}-\d{2}-\d{2}$/.test(start) && /^\d{4}-\d{2}-\d{2}$/.test(end), 'Usage: npm run report:pseo-growth -- --start YYYY-MM-DD --end YYYY-MM-DD --state final|all');
  assert(state === 'final' || state === 'all', '--state must be final or all');
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  assert(!Number.isNaN(startDate.valueOf()) && !Number.isNaN(endDate.valueOf()) && startDate <= endDate, 'The report date range is invalid');
  return { start, end, state, startDate, endDate };
}

function getAccessToken() {
  const environmentToken = process.env.GSC_ACCESS_TOKEN?.trim() || process.env.GOOGLE_OAUTH_ACCESS_TOKEN?.trim();
  if (environmentToken) return environmentToken;
  try {
    return execFileSync('gcloud', ['auth', 'application-default', 'print-access-token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    throw new Error('Search Console authentication is unavailable. Refresh Application Default Credentials with Search Console read scope; credentials must stay outside the repository.');
  }
}

function getQuotaProject() {
  if (process.env.GOOGLE_CLOUD_QUOTA_PROJECT?.trim()) return process.env.GOOGLE_CLOUD_QUOTA_PROJECT.trim();
  try {
    const adc = JSON.parse(readFileSync(path.join(os.homedir(), '.config/gcloud/application_default_credentials.json'), 'utf8')) as { quota_project_id?: string };
    return adc.quota_project_id?.trim();
  } catch {
    return undefined;
  }
}

function headers(token: string, quotaProject: string | undefined) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(quotaProject ? { 'x-goog-user-project': quotaProject } : {}),
  };
}

async function querySearchAnalytics(startDate: string, endDate: string, state: DataState, token: string, quotaProject: string | undefined) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_PROPERTY)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers(token, quotaProject),
    body: JSON.stringify({ startDate, endDate, dimensions: ['page', 'query'], type: 'web', aggregationType: 'byPage', dataState: state, rowLimit: 25_000 }),
  });
  if (!response.ok) throw new Error(`Search Console query failed (${response.status}): ${(await response.text()).slice(0, 400)}`);
  return (await response.json() as { rows?: SearchRow[] }).rows ?? [];
}

function canonicalPath(value: string) {
  try { return new URL(value).pathname.replace(/\/+$/, '') || '/'; } catch { return value.replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '') || '/'; }
}

function weightedMetric(rows: SearchRow[]): Metric {
  const clicks = rows.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
  const impressions = rows.reduce((sum, row) => sum + (row.impressions ?? 0), 0);
  const position = impressions > 0 ? rows.reduce((sum, row) => sum + (row.position ?? 0) * (row.impressions ?? 0), 0) / impressions : null;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

function shift(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function iso(date: Date) { return date.toISOString().slice(0, 10); }

function familyFor(routePath: string) {
  const page = PROGRAMMATIC_SEO_PAGES.find((candidate) => candidate.path === routePath);
  if (page) return page.family;
  const hub = PROGRAMMATIC_SEO_HUBS.find((candidate) => candidate.path === routePath);
  return hub?.family ?? 'unknown';
}

async function inspectUrl(routePath: string, token: string, quotaProject: string | undefined): Promise<Inspection> {
  const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: headers(token, quotaProject),
    body: JSON.stringify({ inspectionUrl: `${CANONICAL_ORIGIN}${routePath}`, siteUrl: SITE_PROPERTY, languageCode: 'en-US' }),
  });
  if (!response.ok) throw new Error(`${routePath}: URL Inspection failed (${response.status}): ${(await response.text()).slice(0, 240)}`);
  const result = (await response.json() as { inspectionResult?: { indexStatusResult?: Record<string, string> } }).inspectionResult?.indexStatusResult ?? {};
  return {
    path: routePath,
    verdict: result.verdict ?? 'UNKNOWN',
    coverageState: result.coverageState ?? 'UNKNOWN',
    indexingState: result.indexingState ?? 'UNKNOWN',
    pageFetchState: result.pageFetchState ?? 'UNKNOWN',
    robotsTxtState: result.robotsTxtState ?? 'UNKNOWN',
    lastCrawlTime: result.lastCrawlTime ?? null,
    googleCanonical: result.googleCanonical ?? null,
    userCanonical: result.userCanonical ?? null,
  };
}

async function inspectAll(paths: string[], token: string, quotaProject: string | undefined) {
  const results: Inspection[] = [];
  for (let index = 0; index < paths.length; index += 5) {
    results.push(...await Promise.all(paths.slice(index, index + 5).map((routePath) => inspectUrl(routePath, token, quotaProject))));
  }
  return results;
}

function csvCell(value: string | number | null) {
  const text = value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const { start, end, state, startDate, endDate } = parseArgs();
const rangeDays = Math.round((endDate.valueOf() - startDate.valueOf()) / 86_400_000) + 1;
const previousEndDate = shift(startDate, -1);
const previousStartDate = shift(previousEndDate, -(rangeDays - 1));
const previousStart = iso(previousStartDate);
const previousEnd = iso(previousEndDate);
const token = getAccessToken();
const quotaProject = getQuotaProject();
const inventoryPaths = [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => item.path);
const inventorySet = new Set(inventoryPaths);
const [currentRaw, previousRaw, inspections] = await Promise.all([
  querySearchAnalytics(start, end, state, token, quotaProject),
  querySearchAnalytics(previousStart, previousEnd, state, token, quotaProject),
  inspectAll(inventoryPaths, token, quotaProject),
]);
const current = currentRaw.filter((row) => inventorySet.has(canonicalPath(row.keys?.[0] ?? '')));
const previous = previousRaw.filter((row) => inventorySet.has(canonicalPath(row.keys?.[0] ?? '')));
const inspectionByPath = new Map(inspections.map((inspection) => [inspection.path, inspection]));

const pageRows = inventoryPaths.map((routePath) => {
  const currentMetric = weightedMetric(current.filter((row) => canonicalPath(row.keys?.[0] ?? '') === routePath));
  const previousMetric = weightedMetric(previous.filter((row) => canonicalPath(row.keys?.[0] ?? '') === routePath));
  return {
    path: routePath,
    family: familyFor(routePath),
    ...currentMetric,
    previousClicks: previousMetric.clicks,
    previousImpressions: previousMetric.impressions,
    previousCtr: previousMetric.ctr,
    previousPosition: previousMetric.position,
    clickDelta: currentMetric.clicks - previousMetric.clicks,
    impressionDelta: currentMetric.impressions - previousMetric.impressions,
    positionImprovement: currentMetric.position === null || previousMetric.position === null ? null : previousMetric.position - currentMetric.position,
    indexation: inspectionByPath.get(routePath),
  };
});

const queryKeys = new Set([...current, ...previous].map((row) => `${canonicalPath(row.keys?.[0] ?? '')}\u0000${row.keys?.[1] ?? ''}`));
const queryRows = [...queryKeys].map((key) => {
  const [routePath, query] = key.split('\u0000');
  const currentMetric = weightedMetric(current.filter((row) => canonicalPath(row.keys?.[0] ?? '') === routePath && (row.keys?.[1] ?? '') === query));
  const previousMetric = weightedMetric(previous.filter((row) => canonicalPath(row.keys?.[0] ?? '') === routePath && (row.keys?.[1] ?? '') === query));
  return {
    path: routePath,
    family: familyFor(routePath),
    query,
    branded: BRAND_PATTERN.test(query),
    ...currentMetric,
    previousClicks: previousMetric.clicks,
    previousImpressions: previousMetric.impressions,
    clickDelta: currentMetric.clicks - previousMetric.clicks,
    impressionDelta: currentMetric.impressions - previousMetric.impressions,
    positionImprovement: currentMetric.position === null || previousMetric.position === null ? null : previousMetric.position - currentMetric.position,
  };
}).sort((left, right) => right.impressions - left.impressions || right.clicks - left.clicks);

const brandRows = current.filter((row) => BRAND_PATTERN.test(row.keys?.[1] ?? ''));
const nonBrandRows = current.filter((row) => !BRAND_PATTERN.test(row.keys?.[1] ?? ''));
const familyRollup = Object.fromEntries((['issue', 'platform', 'checklist', 'all'] as const).map((family) => [family, weightedMetric(current.filter((row) => familyFor(canonicalPath(row.keys?.[0] ?? '')) === family))]));
const report = {
  generatedAt: new Date().toISOString(),
  source: 'Google Search Console Search Analytics API and URL Inspection API',
  property: SITE_PROPERTY,
  dataState: state,
  currentPeriod: { start, end, days: rangeDays },
  previousPeriod: { start: previousStart, end: previousEnd, days: rangeDays },
  scope: { canonicalInventory: inventoryPaths.length, leafPages: PROGRAMMATIC_SEO_PAGES.length, hubs: PROGRAMMATIC_SEO_HUBS.length },
  summary: { total: weightedMetric(current), branded: weightedMetric(brandRows), nonBranded: weightedMetric(nonBrandRows), family: familyRollup },
  indexation: { indexedPass: inspections.filter((item) => item.verdict === 'PASS').length, inspected: inspections.length, rows: inspections },
  pageRows,
  queryRows,
  limits: ['Search Console metrics and URL Inspection describe Google-observed state; they do not request indexing or guarantee rankings and clicks.', 'State all can include fresh partial data; state final excludes incomplete data.'],
};

const csvHeader = ['path', 'family', 'clicks', 'impressions', 'ctr', 'position', 'previous_clicks', 'previous_impressions', 'previous_ctr', 'previous_position', 'click_delta', 'impression_delta', 'position_improvement', 'index_verdict', 'coverage_state', 'last_crawl_time'];
const csvRows = pageRows.map((row) => [row.path, row.family, row.clicks, row.impressions, row.ctr.toFixed(6), row.position?.toFixed(2) ?? null, row.previousClicks, row.previousImpressions, row.previousCtr.toFixed(6), row.previousPosition?.toFixed(2) ?? null, row.clickDelta, row.impressionDelta, row.positionImprovement?.toFixed(2) ?? null, row.indexation?.verdict ?? 'UNKNOWN', row.indexation?.coverageState ?? 'UNKNOWN', row.indexation?.lastCrawlTime ?? null]);
const queryCsvHeader = ['path', 'family', 'query', 'branded', 'clicks', 'impressions', 'ctr', 'position', 'previous_clicks', 'previous_impressions', 'click_delta', 'impression_delta', 'position_improvement'];
const queryCsvRows = queryRows.map((row) => [row.path, row.family, row.query, row.branded ? 'yes' : 'no', row.clicks, row.impressions, row.ctr.toFixed(6), row.position?.toFixed(2) ?? null, row.previousClicks, row.previousImpressions, row.clickDelta, row.impressionDelta, row.positionImprovement?.toFixed(2) ?? null]);
await fs.mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(OUTPUT_DIR, `pseo-growth-${end}-${state}.json`), `${JSON.stringify(report, null, 2)}\n`),
  fs.writeFile(path.join(OUTPUT_DIR, `pseo-growth-${end}-${state}.csv`), `${[csvHeader, ...csvRows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`),
  fs.writeFile(path.join(OUTPUT_DIR, `pseo-growth-${end}-${state}-queries.csv`), `${[queryCsvHeader, ...queryCsvRows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`),
]);
console.log(`Wrote programmatic SEO growth report for ${inventoryPaths.length} URLs to output/seo/ (${start} through ${end}; state ${state}).`);
