/** Checks the actual HTTP document, not Google's stored index. No network in this module. */
export type ExpectedPage = { path: string; title: string; description: string; h1: string };
export type FetchedPage = { status: number; contentType: string; robotsHeader: string; html: string };
const origin = 'https://sulayman-bowles.dev';

function decode(text: string) {
  const entities: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (full, entity: string) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? full;
    const code = parseInt(entity.slice(entity[1].toLowerCase() === 'x' ? 2 : 1), entity[1].toLowerCase() === 'x' ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : full;
  });
}
function attributes(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4])]));
}
const text = (html: string) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

export function checkLivePage(response: FetchedPage, expected: ExpectedPage) {
  const errors: string[] = [];
  const check = (condition: boolean, error: string) => { if (!condition) errors.push(error); };
  check(response.status === 200, `Expected direct HTTP 200; received ${response.status}`);
  check(/^text\/html(?:;|$)/i.test(response.contentType), `Expected HTML; received ${response.contentType}`);
  const html = response.html.replace(/<!--[\s\S]*?-->/g, '');
  const head = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const meta = [...head.matchAll(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map((m) => attributes(m[0]));
  const links = [...head.matchAll(/<link\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map((m) => attributes(m[0]));
  const descriptions = meta.filter((m) => m.name?.toLowerCase() === 'description');
  const canonicals = links.filter((m) => m.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const robots = meta.filter((m) => ['robots', 'googlebot'].includes(m.name?.toLowerCase()));
  const title = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => text(m[1]));
  const h1 = [...html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  check(title.length === 1 && title[0] === expected.title, 'Title differs from published source');
  check(descriptions.length === 1 && descriptions[0].content === expected.description, 'Description differs from published source');
  check(canonicals.length === 1 && canonicals[0].href === origin + expected.path, 'Canonical differs from published source');
  check(h1.length === 1 && h1[0] === expected.h1, 'Initial-document H1 differs from published source');
  check(!robots.some((m) => /(?:^|[,\s])(?:noindex|none)(?:$|[,\s])/i.test(m.content ?? '')), 'HTML robots exclusion');
  // Any agent-specific header exclusion needs review; do not silently ignore it as generic index,follow.
  check(!/(?:^|[,:\s])(?:noindex|none)(?:$|[,\s])/i.test(response.robotsHeader), 'HTTP crawler-exclusion header');
  check(html.includes('data-public-document="ready"'), 'Readable initial-document release marker missing');
  check(/<main\b[^>]*class="seo-static-crawl-content"/.test(html), 'Initial content landmark missing');
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  check(schemas.length > 0, 'JSON-LD missing');
  for (const match of schemas) { try { JSON.parse(match[1]); } catch { errors.push('Invalid JSON-LD'); } }
  return errors;
}
