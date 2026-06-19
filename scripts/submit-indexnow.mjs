import { readFile } from 'node:fs/promises';
import path from 'node:path';

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

function validateUrlList(urls) {
  for (const value of urls) {
    const url = new URL(value);
    if (url.hostname !== HOST) {
      throw new Error(`IndexNow URL must belong to ${HOST}: ${value}`);
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
  let sitemapXml;
  try {
    sitemapXml = await readTextFile(path.join('dist', 'sitemap.xml'));
  } catch {
    sitemapXml = await readTextFile(path.join('public', 'sitemap.xml'));
  }

  const sitemapUrls = extractSitemapUrls(sitemapXml);

  return uniqueUrls([
    ...sitemapUrls,
    `${SITE_URL}/Sulayman_Bowles_Resume.pdf`,
    `${SITE_URL}/resume.pdf`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/Sulayman_Bowles_Resume_2025.pdf`,
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

  const response = await fetch(ENDPOINT, {
    method: 'POST',
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
