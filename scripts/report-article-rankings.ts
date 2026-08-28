import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  ARTICLE_RANKING_DEADLINE,
  ARTICLE_SEARCH_TARGETS,
  ARTICLE_TOP_TEN_MAX_POSITION,
  ARTICLE_TOP_TEN_MIN_IMPRESSIONS,
  ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS,
} from '../src/seo/articleSearchTargets';

type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type SearchAnalyticsResponse = {
  rows?: SearchAnalyticsRow[];
};

type ArticleMetric = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
};

type RankingStatus = 'unseen' | 'provisional' | 'progressing' | 'top10' | 'sustained';

type HistorySnapshot = {
  start: string;
  end: string;
  recordedAt: string;
  gates: Record<string, boolean>;
};

type RankingHistory = {
  version: 1;
  snapshots: HistorySnapshot[];
};

const SITE_URL = process.env.GSC_SITE_URL?.trim() || 'sc-domain:sulayman-bowles.dev';
const OUTPUT_DIR = path.resolve('output/seo');
const HISTORY_PATH = path.join(OUTPUT_DIR, 'article-ranking-history.json');

function parseArgs() {
  const args = process.argv.slice(2);
  const valueAfter = (flag: string) => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  const start = valueAfter('--start');
  const end = valueAfter('--end');
  if (!start || !end || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    throw new Error('Usage: npm run report:article-rankings -- --start YYYY-MM-DD --end YYYY-MM-DD');
  }
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf()) || startDate > endDate) {
    throw new Error('The report date range is invalid.');
  }
  return { start, end, startDate, endDate };
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date: Date, days: number) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

function inclusiveDays(start: Date, end: Date) {
  return Math.round((end.valueOf() - start.valueOf()) / 86_400_000) + 1;
}

function getAccessToken() {
  const environmentToken = process.env.GSC_ACCESS_TOKEN?.trim()
    || process.env.GOOGLE_OAUTH_ACCESS_TOKEN?.trim();
  if (environmentToken) return environmentToken;
  try {
    return execFileSync('gcloud', ['auth', 'application-default', 'print-access-token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    throw new Error(
      'Search Console authentication is unavailable. Refresh Application Default Credentials with Search Console read scope; credentials must stay outside the repository.',
    );
  }
}

function getQuotaProject() {
  if (process.env.GOOGLE_CLOUD_QUOTA_PROJECT?.trim()) {
    return process.env.GOOGLE_CLOUD_QUOTA_PROJECT.trim();
  }
  try {
    const adc = JSON.parse(
      readFileSync(path.join(os.homedir(), '.config/gcloud/application_default_credentials.json'), 'utf8'),
    ) as { quota_project_id?: string };
    return adc.quota_project_id?.trim();
  } catch {
    return undefined;
  }
}

async function querySearchConsole(
  startDate: string,
  endDate: string,
  token: string,
  quotaProject: string | undefined,
) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(quotaProject ? { 'x-goog-user-project': quotaProject } : {}),
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['page', 'query'],
      type: 'web',
      aggregationType: 'byPage',
      rowLimit: 25_000,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    const reason = response.status === 401 || response.status === 403
      ? ' Refresh OAuth credentials with Search Console read scope.'
      : '';
    throw new Error(`Search Console query failed (${response.status}).${reason} ${body.slice(0, 240)}`);
  }
  return await response.json() as SearchAnalyticsResponse;
}

function canonicalPath(page: string) {
  try {
    const parsed = new URL(page);
    return parsed.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return page.replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '') || '/';
  }
}

function metricsFor(rows: SearchAnalyticsRow[], articlePath: string, primaryQuery: string): ArticleMetric {
  const query = primaryQuery.trim().toLowerCase();
  const matches = rows.filter((row) =>
    canonicalPath(row.keys?.[0] ?? '') === articlePath
    && (row.keys?.[1] ?? '').trim().toLowerCase() === query);
  const impressions = matches.reduce((sum, row) => sum + (row.impressions ?? 0), 0);
  const clicks = matches.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
  const weightedPosition = impressions > 0
    ? matches.reduce((sum, row) => sum + (row.position ?? 0) * (row.impressions ?? 0), 0) / impressions
    : null;
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: weightedPosition,
  };
}

function meetsGate(metric: ArticleMetric) {
  return metric.impressions >= ARTICLE_TOP_TEN_MIN_IMPRESSIONS
    && metric.position !== null
    && metric.position <= ARTICLE_TOP_TEN_MAX_POSITION;
}

function dateDiffDays(left: string, right: string) {
  return Math.round(
    (new Date(`${left}T00:00:00Z`).valueOf() - new Date(`${right}T00:00:00Z`).valueOf()) / 86_400_000,
  );
}

function isSustained(
  articlePath: string,
  current: HistorySnapshot,
  history: RankingHistory,
  rangeDays: number,
) {
  if (rangeDays !== 28 || !current.gates[articlePath]) return false;
  const candidates = [...history.snapshots, current]
    .filter((snapshot) => snapshot.gates[articlePath] && inclusiveDays(
      new Date(`${snapshot.start}T00:00:00Z`),
      new Date(`${snapshot.end}T00:00:00Z`),
    ) === 28)
    .sort((a, b) => a.end.localeCompare(b.end));
  const finalSnapshots = candidates.slice(-ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS);
  return finalSnapshots.length === ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS
    && finalSnapshots.every((snapshot, index) =>
      index === 0 || dateDiffDays(snapshot.end, finalSnapshots[index - 1].end) === 7);
}

function classify(metric: ArticleMetric, sustained: boolean): RankingStatus {
  if (metric.impressions === 0) return 'unseen';
  if (metric.impressions < ARTICLE_TOP_TEN_MIN_IMPRESSIONS) return 'provisional';
  if (metric.position === null || metric.position > ARTICLE_TOP_TEN_MAX_POSITION) return 'progressing';
  return sustained ? 'sustained' : 'top10';
}

async function readHistory(): Promise<RankingHistory> {
  try {
    const parsed = JSON.parse(await fs.readFile(HISTORY_PATH, 'utf8')) as RankingHistory;
    return parsed.version === 1 && Array.isArray(parsed.snapshots) ? parsed : { version: 1, snapshots: [] };
  } catch {
    return { version: 1, snapshots: [] };
  }
}

function csvCell(value: string | number | null) {
  const text = value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const { start, end, startDate, endDate } = parseArgs();
const rangeDays = inclusiveDays(startDate, endDate);
const previousEndDate = shiftDays(startDate, -1);
const previousStartDate = shiftDays(previousEndDate, -(rangeDays - 1));
const previousStart = isoDate(previousStartDate);
const previousEnd = isoDate(previousEndDate);
const token = getAccessToken();
const quotaProject = getQuotaProject();
const [currentResponse, previousResponse, history] = await Promise.all([
  querySearchConsole(start, end, token, quotaProject),
  querySearchConsole(previousStart, previousEnd, token, quotaProject),
  readHistory(),
]);

const currentMetrics = new Map(
  ARTICLE_SEARCH_TARGETS.map((target) => [
    target.path,
    metricsFor(currentResponse.rows ?? [], target.path, target.primaryQuery),
  ]),
);
const currentSnapshot: HistorySnapshot = {
  start,
  end,
  recordedAt: new Date().toISOString(),
  gates: Object.fromEntries(
    ARTICLE_SEARCH_TARGETS.map((target) => [target.path, meetsGate(currentMetrics.get(target.path)!)]),
  ),
};

const rows = ARTICLE_SEARCH_TARGETS.map((target) => {
  const current = currentMetrics.get(target.path)!;
  const previous = metricsFor(previousResponse.rows ?? [], target.path, target.primaryQuery);
  const sustained = isSustained(target.path, currentSnapshot, history, rangeDays);
  return {
    path: target.path,
    primaryQuery: target.primaryQuery,
    cohort: target.cohort,
    status: classify(current, sustained),
    clicks: current.clicks,
    impressions: current.impressions,
    ctr: current.ctr,
    position: current.position,
    previousClicks: previous.clicks,
    previousImpressions: previous.impressions,
    previousCtr: previous.ctr,
    previousPosition: previous.position,
    clickDelta: current.clicks - previous.clicks,
    impressionDelta: current.impressions - previous.impressions,
    positionDelta: current.position === null || previous.position === null
      ? null
      : previous.position - current.position,
  };
});

const report = {
  generatedAt: currentSnapshot.recordedAt,
  source: 'Google Search Console Search Analytics API',
  property: SITE_URL,
  dimensions: ['page', 'query'],
  currentPeriod: { start, end, days: rangeDays },
  previousPeriod: { start: previousStart, end: previousEnd, days: rangeDays },
  gate: {
    deadline: ARTICLE_RANKING_DEADLINE,
    maximumPosition: ARTICLE_TOP_TEN_MAX_POSITION,
    minimumImpressions: ARTICLE_TOP_TEN_MIN_IMPRESSIONS,
    consecutiveWeeklySnapshots: ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS,
  },
  summary: Object.fromEntries(
    (['unseen', 'provisional', 'progressing', 'top10', 'sustained'] as RankingStatus[])
      .map((status) => [status, rows.filter((row) => row.status === status).length]),
  ),
  rows,
};

const csvHeader = [
  'path', 'primary_query', 'cohort', 'status', 'clicks', 'impressions', 'ctr',
  'position', 'previous_clicks', 'previous_impressions', 'previous_ctr',
  'previous_position', 'click_delta', 'impression_delta', 'position_improvement',
];
const csvRows = rows.map((row) => [
  row.path,
  row.primaryQuery,
  row.cohort,
  row.status,
  row.clicks,
  row.impressions,
  row.ctr.toFixed(6),
  row.position === null ? null : row.position.toFixed(2),
  row.previousClicks,
  row.previousImpressions,
  row.previousCtr.toFixed(6),
  row.previousPosition === null ? null : row.previousPosition.toFixed(2),
  row.clickDelta,
  row.impressionDelta,
  row.positionDelta === null ? null : row.positionDelta.toFixed(2),
]);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(OUTPUT_DIR, `article-rankings-${end}.json`), `${JSON.stringify(report, null, 2)}\n`),
  fs.writeFile(
    path.join(OUTPUT_DIR, `article-rankings-${end}.csv`),
    `${[csvHeader, ...csvRows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`,
  ),
  fs.writeFile(
    HISTORY_PATH,
    `${JSON.stringify({
      version: 1,
      snapshots: [
        ...history.snapshots.filter((snapshot) => snapshot.end !== end),
        currentSnapshot,
      ].sort((a, b) => a.end.localeCompare(b.end)),
    } satisfies RankingHistory, null, 2)}\n`,
  ),
]);

console.log(
  `Wrote page/query ranking reports for ${rows.length} articles to output/seo/ (${start} through ${end}; previous ${previousStart} through ${previousEnd}).`,
);
