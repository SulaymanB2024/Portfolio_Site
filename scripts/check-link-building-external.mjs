import fs from 'node:fs';

const SITE_URL = 'https://sulayman-bowles.dev';
const OUTCOME_LOG = 'docs/link-building/outreach-outcome-log.csv';

function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(field);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])),
  );
}

function rawReadmeUrl(githubUrl) {
  const match = githubUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }
  return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/main/README.md`;
}

function containsExpectedTarget(text, row) {
  if (text.includes(row.target_page)) {
    return true;
  }

  const target = new URL(row.target_page);
  if (target.pathname === '/' && text.includes(SITE_URL)) {
    return true;
  }

  return text.includes(target.hostname) && text.includes(target.pathname);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,text/plain,application/json,*/*',
      'user-agent': 'SulaymanBowlesExternalLinkCheck/1.0',
    },
    redirect: 'follow',
  });
  const body = await response.text();
  return {
    url,
    finalUrl: response.url,
    status: response.status,
    okStatus: response.status >= 200 && response.status < 400,
    contentType: response.headers.get('content-type') ?? '',
    body,
  };
}

async function checkVerifiedRow(row) {
  if (row.follow_state === 'topic_metadata_not_direct_backlink') {
    const fetched = await fetchText(row.linked_url);
    return {
      prospect_name: row.prospect_name,
      linked_url: row.linked_url,
      target_page: row.target_page,
      check_type: 'status_only_metadata_surface',
      ok: fetched.okStatus,
      status: fetched.status,
      finalUrl: fetched.finalUrl,
      detail: fetched.okStatus
        ? 'Metadata discovery surface is reachable; this is not a direct backlink check.'
        : `HTTP status ${fetched.status}`,
    };
  }

  const urlsToCheck = [];
  if (row.follow_state === 'github_metadata_and_readme_nofollow') {
    const rawUrl = rawReadmeUrl(row.linked_url);
    if (rawUrl) {
      urlsToCheck.push({ url: rawUrl, check_type: 'raw_github_readme' });
    }
  }

  urlsToCheck.push({ url: row.linked_url, check_type: 'linked_url' });

  const attempts = [];
  for (const candidate of urlsToCheck) {
    try {
      const fetched = await fetchText(candidate.url);
      const hasExpectedTarget = fetched.okStatus && containsExpectedTarget(fetched.body, row);
      attempts.push({
        check_type: candidate.check_type,
        url: candidate.url,
        finalUrl: fetched.finalUrl,
        status: fetched.status,
        okStatus: fetched.okStatus,
        hasExpectedTarget,
      });
      if (hasExpectedTarget) {
        return {
          prospect_name: row.prospect_name,
          linked_url: row.linked_url,
          target_page: row.target_page,
          check_type: candidate.check_type,
          ok: true,
          status: fetched.status,
          finalUrl: fetched.finalUrl,
          detail: 'Expected canonical target was found.',
          attempts,
        };
      }
    } catch (error) {
      attempts.push({
        check_type: candidate.check_type,
        url: candidate.url,
        okStatus: false,
        hasExpectedTarget: false,
        error: error.message,
      });
    }
  }

  return {
    prospect_name: row.prospect_name,
    linked_url: row.linked_url,
    target_page: row.target_page,
    ok: false,
    detail: 'No checked public surface contained the expected canonical target.',
    attempts,
  };
}

async function main() {
  const rows = parseCsv(fs.readFileSync(OUTCOME_LOG, 'utf8'));
  const verifiedRows = rows.filter((row) => row.status === 'verified');
  const pendingRows = rows.filter((row) => row.status !== 'verified');

  const checked = [];
  for (const row of verifiedRows) {
    checked.push(await checkVerifiedRow(row));
  }

  const failed = checked.filter((result) => !result.ok);
  const output = {
    ok: failed.length === 0,
    checked_at: new Date().toISOString(),
    verified_rows: verifiedRows.length,
    checked_verified_rows: checked.length,
    failed_verified_rows: failed.length,
    pending_rows: pendingRows.map((row) => ({
      prospect_name: row.prospect_name,
      action_type: row.action_type,
      target_page: row.target_page,
      blocker: row.notes,
    })),
    results: checked,
  };

  console.log(JSON.stringify(output, null, 2));

  if (!output.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
