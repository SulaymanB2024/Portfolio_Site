import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLivePage, type FetchedPage } from './live-indexability';
const expected = { path: '/guide', title: 'A & B', description: 'An "example"', h1: 'Guide' };
const response: FetchedPage = {
  status: 200, contentType: 'text/html; charset=utf-8', robotsHeader: '',
  html: `<html><head><title>A &amp; B</title><meta content='An &quot;example&quot;' name='description'><link href='https://sulayman-bowles.dev/guide' rel='canonical'><meta content='index,follow' name='robots'><script type="application/ld+json">{"name":"A > B"}</script></head><body><section data-public-document="ready"><main class="seo-static-crawl-content"><h1>Guide</h1></main></section></body></html>`,
};
test('HTTP document checks accept attribute order and quoted entities', () => assert.deepEqual(checkLivePage(response, expected), []));
test('successful HTML does not override an HTTP noindex or agent-specific exclusion', () => {
  for (const robotsHeader of ['noindex', 'GOOGLEBOT: NOINDEX, nofollow', 'none', 'otherbot: noindex']) assert.ok(checkLivePage({ ...response, robotsHeader }, expected).includes('HTTP crawler-exclusion header'));
});
test('HTML googlebot and generic exclusions remain restrictive', () => {
  for (const meta of ["<meta content='NOINDEX' name='googlebot'>", '<META NAME="robots" CONTENT="none">']) assert.ok(checkLivePage({ ...response, html: response.html.replace('</head>', meta + '</head>') }, expected).includes('HTML robots exclusion'));
});
test('redirects, non-HTML, stale releases and duplicate canonicals cannot pass', () => {
  assert.ok(checkLivePage({ ...response, status: 308 }, expected).length);
  assert.ok(checkLivePage({ ...response, contentType: 'text/plain' }, expected).length);
  assert.ok(checkLivePage({ ...response, html: response.html.replace('data-public-document="ready"', '') }, expected).length);
  assert.ok(checkLivePage({ ...response, html: response.html.replace('</head>', '<link rel="canonical" href="https://example.com"></head>') }, expected).length);
});
