const SITE_URL = 'https://sulayman-bowles.dev';

const requiredChecks = [
  {
    id: 'research-hub',
    url: `${SITE_URL}/research`,
    type: 'html',
    requiredText: [
      'Research Notes',
      'Selected Notes',
      'Crawler Policy Comes Before Visibility',
      'Research Notes | Sulayman Bowles',
    ],
  },
  {
    id: 'authority-assets-json',
    url: `${SITE_URL}/research/authority-assets.json`,
    type: 'json',
    validateJson(value) {
      return {
        ok:
          value?.canonical_host === SITE_URL &&
          Array.isArray(value.assets) &&
          value.assets.length >= 12 &&
          value.assets.some((asset) => asset.url === `${SITE_URL}/research`) &&
          Array.isArray(value.limits) &&
          value.limits.some((limit) => limit.includes('Domain Rating movement')),
        detail: {
          canonical_host: value?.canonical_host,
          asset_count: Array.isArray(value?.assets) ? value.assets.length : null,
          has_research_hub: Array.isArray(value?.assets)
            ? value.assets.some((asset) => asset.url === `${SITE_URL}/research`)
            : false,
        },
      };
    },
  },
  {
    id: 'llms-research-references',
    url: `${SITE_URL}/llms.txt`,
    type: 'text',
    requiredText: [
      `${SITE_URL}/research`,
      `${SITE_URL}/research/authority-assets.json`,
      `${SITE_URL}/research/ai-search-crawler-policy-sources.csv`,
      `${SITE_URL}/research/austin-crawlability-benchmark-pilot.csv`,
      'They do not prove backlinks, Ahrefs Domain Rating movement',
    ],
  },
  {
    id: 'sitemap-research-route',
    url: `${SITE_URL}/sitemap.xml`,
    type: 'xml',
    requiredText: [`<loc>${SITE_URL}/research</loc>`],
  },
  {
    id: 'crawler-policy-source-table',
    url: `${SITE_URL}/research/ai-search-crawler-policy-sources.csv`,
    type: 'csv',
    requiredText: ['source_name,source_url,source_type,used_for,claim_boundary', 'Ahrefs Domain Rating'],
  },
  {
    id: 'austin-benchmark-csv',
    url: `${SITE_URL}/research/austin-crawlability-benchmark-pilot.csv`,
    type: 'csv',
    requiredText: ['sample_id,display_name,homepage_url,segment', 'measurement_note,measured_at'],
  },
  {
    id: 'austin-benchmark-summary',
    url: `${SITE_URL}/research/austin-crawlability-benchmark-summary.json`,
    type: 'json',
    validateJson(value) {
      return {
        ok:
          value?.generated_at === '2026-06-25' &&
          value?.sample_size >= 10 &&
          Array.isArray(value.limits) &&
          value.limits.some((limit) => limit.includes('measurement gaps')),
        detail: {
          generated_at: value?.generated_at,
          sample_size: value?.sample_size,
          limits: Array.isArray(value?.limits) ? value.limits.length : null,
        },
      };
    },
  },
];

function isOkStatus(status) {
  return status >= 200 && status < 400;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/json,text/plain,*/*',
      'user-agent': 'SulaymanBowlesAuthorityPackLiveCheck/1.0',
    },
    redirect: 'follow',
  });
  const body = await response.text();
  return {
    url,
    finalUrl: response.url,
    status: response.status,
    okStatus: isOkStatus(response.status),
    contentType: response.headers.get('content-type') ?? '',
    body,
  };
}

function checkRequiredText(body, requiredText) {
  const missing = requiredText.filter((text) => !body.includes(text));
  return {
    ok: missing.length === 0,
    missing,
  };
}

async function runCheck(check) {
  const fetched = await fetchText(check.url);
  const result = {
    id: check.id,
    url: check.url,
    finalUrl: fetched.finalUrl,
    status: fetched.status,
    okStatus: fetched.okStatus,
    contentType: fetched.contentType,
    ok: false,
    detail: {},
  };

  if (!fetched.okStatus) {
    result.detail = { error: `HTTP status ${fetched.status}` };
    return result;
  }

  if (check.requiredText) {
    const textResult = checkRequiredText(fetched.body, check.requiredText);
    result.ok = textResult.ok;
    result.detail = {
      missing_text: textResult.missing,
      body_bytes: Buffer.byteLength(fetched.body, 'utf8'),
    };
    return result;
  }

  if (check.validateJson) {
    try {
      const parsed = JSON.parse(fetched.body);
      const jsonResult = check.validateJson(parsed);
      result.ok = Boolean(jsonResult.ok);
      result.detail = jsonResult.detail;
      return result;
    } catch (error) {
      result.detail = { error: `Invalid JSON: ${error.message}` };
      return result;
    }
  }

  result.ok = true;
  return result;
}

async function main() {
  const results = await Promise.all(requiredChecks.map((check) => runCheck(check)));
  const failed = results.filter((result) => !result.ok);
  const output = {
    ok: failed.length === 0,
    checked_at: new Date().toISOString(),
    canonical_host: SITE_URL,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  };

  console.log(JSON.stringify(output, null, 2));

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
