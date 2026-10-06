import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const HOST = 'sulayman-bowles.dev';
const SITE_URL = `https://${HOST}`;
const KEY = '831c8d8efafea91f80fd661d0390f52d';
const KEY_FILE = `${KEY}.txt`;
const KEY_LOCATION = `${SITE_URL}/${KEY_FILE}`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? 'https://api.indexnow.org/indexnow';

function uniqueUrls(values) {
  return Array.from(new Set(values));
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1].trim());
}

export function validateUrlList(urls) {
  if (!urls.length || urls.length > 10_000) throw new Error('IndexNow requires 1–10,000 URLs.');
  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== SITE_URL || url.username || url.password || url.search || url.hash) {
      throw new Error(`IndexNow URL must use a canonical HTTPS path on ${HOST}: ${value}`);
    }
  }
}

async function readTextFile(relativePath) {
  return readFile(path.resolve(process.cwd(), relativePath), 'utf8');
}

async function readHostedKey() {
  const value = (await readTextFile(path.join('public', KEY_FILE))).trim();
  if (value !== KEY) {
    throw new Error(`IndexNow key file does not match ${KEY_FILE}`);
  }
}

async function readDefaultUrlList() {
  // The checked-in sitemap is a historical input. Submit the current build's
  // canonical URLs, never retired redirects from the old research catalog.
  const sitemapXml = await readTextFile(path.join('dist', 'sitemap.xml'));
  const sitemapUrls = extractSitemapUrls(sitemapXml);

  return uniqueUrls([
    ...sitemapUrls,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/llms-full.txt`,
    `${SITE_URL}/machine/profile.json`,
    `${SITE_URL}/machine/references.json`,
  ]);
}

async function main() {
  await readHostedKey();

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const explicitUrls = args.filter((arg) => arg !== '--dry-run');
  const urlList = uniqueUrls(explicitUrls.length > 0 ? explicitUrls : await readDefaultUrlList());
  validateUrlList(urlList);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          endpoint: ENDPOINT,
          submitted: urlList.length,
          keyLocation: KEY_LOCATION,
          urls: urlList,
        },
        null,
        2,
      ),
    );
    return;
  }

  const hostedKey = await fetch(KEY_LOCATION, { redirect: 'error', signal: AbortSignal.timeout(15_000) });
  if (!hostedKey.ok || (await hostedKey.text()).trim() !== KEY) {
    throw new Error('Production IndexNow ownership file is missing or mismatched.');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    signal: AbortSignal.timeout(30_000),
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  const body = await response.text();
  const result = {
    endpoint: ENDPOINT,
    status: response.status,
    statusText: response.statusText,
    submitted: urlList.length,
    keyLocation: KEY_LOCATION,
    urls: urlList,
    body: body.trim(),
  };

  console.log(JSON.stringify(result, null, 2));

  if (response.status !== 200 && response.status !== 202) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
