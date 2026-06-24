import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildRouteStaticHtml, buildSitemapStaticHtml } from '../src/seo/staticContent';
import { getCanonicalRoutes, SEO_ROUTES, SITE_LASTMOD, type SeoRoute } from '../src/seo/routes';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '../src/seo/site';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

function extractHead(html: string) {
  return html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
}

function extractAssetTags(head: string) {
  const tags = head.match(/<(?:link|script)\b[^>]*(?:\/assets\/|rel="modulepreload")[^>]*(?:><\/script>|\/?>)/gi) ?? [];
  return Array.from(new Set(tags)).join('\n    ');
}

function routeOutputPath(route: SeoRoute) {
  if (route.path === '/') {
    return path.join(DIST_DIR, 'index.html');
  }

  return path.join(DIST_DIR, route.path.slice(1), 'index.html');
}

function buildHead(route: SeoRoute, assetTags: string) {
  const canonicalUrl = absoluteUrl(route.path);
  const imageUrl = absoluteUrl(route.image ?? DEFAULT_OG_IMAGE);
  const ogType = route.pageType === 'article' ? 'article' : 'website';
  const robots = route.noindex || !route.includeInSitemap ? 'noindex,nofollow' : 'index,follow';

  const staticFallbackScript =
    "document.documentElement.classList.add('js');document.addEventListener('DOMContentLoaded',function(){document.getElementById('seo-static-summary')?.remove();});";

  return `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${staticFallbackScript}</script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${FONT_STYLESHEET}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="text/plain" title="LLMs text" href="/llms.txt" />
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="${robots}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">${escapeJsonForHtml(route.jsonLd ?? {})}</script>
    <style>
      #seo-static-summary {
        box-sizing: border-box;
        min-height: 100vh;
        padding: clamp(2rem, 6vw, 6rem);
        background: #f1efe8;
        color: #080807;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      #seo-static-summary h1 {
        max-width: 70rem;
        margin: 0 0 1rem;
        font-family: "Cormorant Garamond", ui-serif, Georgia, serif;
        font-size: clamp(3rem, 10vw, 8rem);
        font-weight: 300;
        line-height: 0.9;
      }
      #seo-static-summary p {
        max-width: 42rem;
        margin: 0 0 2rem;
        font-size: 1rem;
        line-height: 1.7;
      }
      #seo-static-summary nav {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      #seo-static-summary article {
        max-width: 62rem;
      }
      #seo-static-summary h2 {
        margin: 2.5rem 0 1rem;
        font-size: 1rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      #seo-static-summary h3 {
        margin: 1.5rem 0 0.5rem;
        font-size: 0.85rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      #seo-static-summary ul {
        margin: 0 0 2rem;
        padding-left: 1.25rem;
        line-height: 1.7;
      }
      #seo-static-summary a {
        color: inherit;
      }
      #seo-static-summary table {
        width: 100%;
        margin: 1rem 0 2rem;
        border-collapse: collapse;
        font-size: 0.78rem;
        line-height: 1.5;
      }
      #seo-static-summary th,
      #seo-static-summary td {
        border: 1px solid rgba(8, 8, 7, 0.16);
        padding: 0.65rem;
        text-align: left;
        vertical-align: top;
      }
      #seo-static-summary th {
        background: rgba(8, 8, 7, 0.08);
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .js #seo-static-summary {
        display: none;
      }
    </style>
    ${assetTags}
  </head>`;
}

function buildFallback(route: SeoRoute) {
  const staticHtml = route.path === '/sitemap' ? buildSitemapStaticHtml(getCanonicalRoutes()) : route.staticHtml ?? buildRouteStaticHtml(route);

  if (staticHtml) {
    return `<section id="seo-static-summary" aria-label="Static route content">
${staticHtml}
    </section>`;
  }

  if (route.staticHtml) {
    return `<section id="seo-static-summary" aria-label="Static route summary">
${route.staticHtml}
    </section>`;
  }

  const navLinks = [
    ['Home', '/'],
    ['About', '/about'],
    ['Resume', '/resume'],
    ['Atlas', '/atlas'],
    ['Method', '/method'],
    ['Markets', '/markets'],
    ['AI Information', '/ai-information'],
  ];

  return `<section id="seo-static-summary" aria-label="Static route summary">
      <h1>${escapeHtml(route.h1)}</h1>
      <p>${escapeHtml(route.staticSummary)}</p>
      <nav aria-label="Primary static links">
        ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('\n        ')}
      </nav>
    </section>`;
}

function injectFallback(html: string, route: SeoRoute) {
  return html.replace(/<div id="root"><\/div>/, `${buildFallback(route)}\n    <div id="root"></div>`);
}

function replaceHead(html: string, route: SeoRoute, assetTags: string) {
  return html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, buildHead(route, assetTags));
}

async function writeRouteHtml(template: string, assetTags: string, route: SeoRoute) {
  const outputPath = routeOutputPath(route);
  const routeHtml = replaceHead(injectFallback(template, route), route, assetTags);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, routeHtml);

  if (route.path !== '/') {
    const cleanUrlFallbackPath = path.join(DIST_DIR, `${route.path.slice(1)}.html`);
    await fs.mkdir(path.dirname(cleanUrlFallbackPath), { recursive: true });
    await fs.writeFile(cleanUrlFallbackPath, routeHtml);
  }
}

async function writeSitemap() {
  const urls = getCanonicalRoutes()
    .map(
      (route) => `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <lastmod>${route.lastmod ?? SITE_LASTMOD}</lastmod>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), xml);
}

async function main() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  const template = await fs.readFile(templatePath, 'utf8');
  const assetTags = extractAssetTags(extractHead(template));

  await Promise.all(SEO_ROUTES.filter((route) => route.includeInSitemap || route.generateStatic).map((route) => writeRouteHtml(template, assetTags, route)));
  await writeSitemap();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
