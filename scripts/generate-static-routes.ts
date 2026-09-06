import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ARTICLE_ROUTE_METADATA } from '../src/content/articleRouteMetadata';
import { ALL_ARTICLES, getArticleAliases, getArticlePath } from '../src/content/articleRegistry';
import { buildRouteStaticHtml, buildSitemapStaticHtml } from '../src/seo/staticContent';
import { getArticleSearchTarget } from '../src/seo/articleSearchTargets';
import { buildSitemapXml } from '../src/seo/generatedPublicFiles';
import { robotsForSeoPortfolioRoute } from '../src/seo/portfolioRoutes';
import { getCanonicalRoutes, getRouteTone, NOT_FOUND_ROUTE, SEO_ROUTES, type SeoRoute } from '../src/seo/routes';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '../src/seo/site';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const FONT_CSS = await fs.readFile(path.resolve(process.cwd(), 'public/fonts/fonts.css'), 'utf8');

function verifyArticleRouteMetadata() {
  const expected = ALL_ARTICLES.map((article) => ({
    kind: article.kind,
    path: getArticlePath(article),
    aliases: getArticleAliases(article),
    title: article.title,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    date: article.date,
    dateModified: article.dateModified ?? article.date,
    indexable: article.indexable !== false,
    staticSummary: `${getArticleSearchTarget(getArticlePath(article))?.directAnswer ?? ''} ${article.content[0]}`.trim(),
    image: article.artwork.kind === 'image' ? article.artwork.socialSrc : '/images/social/og-research.png',
  }));

  if (JSON.stringify(ARTICLE_ROUTE_METADATA) !== JSON.stringify(expected)) {
    throw new Error(
      'src/content/articleRouteMetadata.ts is out of sync with the full article registry. Run npm run generate:article-routes before building.',
    );
  }
}

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
  const canonicalUrl = route.portfolioRoute?.canonical ?? absoluteUrl(route.path);
  const imageUrl = absoluteUrl(route.image ?? DEFAULT_OG_IMAGE);
  const ogType = route.pageType === 'article' ? 'article' : 'website';
  const robots = route.portfolioRoute
    ? robotsForSeoPortfolioRoute(route.portfolioRoute)
    : 'noindex,follow';
  const canonicalTag = route.path === '/404'
    ? ''
    : `<link rel="canonical" href="${canonicalUrl}" />`;
  const ogUrlTag = route.path === '/404'
    ? ''
    : `<meta property="og:url" content="${canonicalUrl}" />`;
  const dark = getRouteTone(route.path) === 'dark';
  const staticBackground = dark ? '#080807' : '#f4f4f0';
  const staticForeground = dark ? '#f4f4f0' : '#080807';

  return `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style data-local-fonts="true">${FONT_CSS}</style>
    <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#f1efe8" />
    <link rel="alternate" type="text/plain" title="LLMs text" href="/llms.txt" />
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    ${canonicalTag}
    <meta name="robots" content="${robots}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="${ogType}" />
    ${ogUrlTag}
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">${escapeJsonForHtml(route.jsonLd ?? {})}</script>
    <style>
      #seo-static-summary .seo-static-client-shell {
        display: none;
      }
      .js-pending #seo-static-summary {
        min-height: 100svh;
        overflow: hidden;
        padding: 0;
      }
      .js-pending #seo-static-summary .seo-static-crawl-content {
        display: none;
      }
      .js-pending #seo-static-summary .seo-static-client-shell {
        --shell-bg: ${staticBackground};
        --shell-fg: ${staticForeground};
        --shell-muted: color-mix(in srgb, var(--shell-fg) 64%, transparent);
        --shell-line: color-mix(in srgb, var(--shell-fg) 16%, transparent);
        position: relative;
        display: grid;
        min-height: 100svh;
        grid-template-rows: auto 1fr;
        overflow: hidden;
        background:
          linear-gradient(var(--shell-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--shell-line) 1px, transparent 1px),
          var(--shell-bg);
        background-size: 25vw 25vw;
        color: var(--shell-fg);
        font-family: var(--font-sans, Inter, ui-sans-serif, system-ui, sans-serif);
      }
      .js-pending #seo-static-summary .seo-static-client-shell::before,
      .js-pending #seo-static-summary .seo-static-client-shell::after {
        position: absolute;
        z-index: 2;
        width: 1rem;
        height: 1rem;
        border-color: var(--shell-line);
        content: "";
        pointer-events: none;
      }
      .js-pending #seo-static-summary .seo-static-client-shell::before {
        top: 6.5rem;
        left: 1rem;
        border-top: 1px solid;
        border-left: 1px solid;
      }
      .js-pending #seo-static-summary .seo-static-client-shell::after {
        right: 1rem;
        bottom: 1rem;
        border-right: 1px solid;
        border-bottom: 1px solid;
      }
      #seo-static-summary .seo-static-shell-header {
        position: relative;
        z-index: 3;
        display: grid;
        min-height: 4.5rem;
        grid-template-columns: minmax(0, 1fr) auto;
        border-bottom: 1px solid var(--shell-line);
        background: color-mix(in srgb, var(--shell-bg) 92%, transparent);
      }
      #seo-static-summary .seo-static-shell-brand {
        display: grid;
        min-width: 0;
        align-content: center;
        gap: 0.45rem;
        padding: 0.9rem 1rem;
        color: inherit;
        text-decoration: none;
      }
      #seo-static-summary .seo-static-shell-brand strong {
        overflow: hidden;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.32em;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #seo-static-summary .seo-static-shell-brand small {
        overflow: hidden;
        color: var(--shell-muted);
        font-family: var(--font-serif, "Cormorant Garamond", ui-serif, Georgia, serif);
        font-size: 0.82rem;
        font-style: italic;
        line-height: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #seo-static-summary .seo-static-shell-index {
        display: inline-flex;
        min-width: 4.875rem;
        align-items: center;
        justify-content: center;
        border-left: 1px solid var(--shell-line);
        color: var(--shell-muted);
        font-size: 0.58rem;
        letter-spacing: 0.22em;
        text-decoration: none;
      }
      #seo-static-summary .seo-static-shell-nav {
        display: none;
      }
      #seo-static-summary .seo-static-shell-stage {
        position: relative;
        z-index: 1;
        display: grid;
        width: min(100%, 92rem);
        align-content: center;
        justify-self: center;
        padding: 5.5rem 1rem 3rem;
      }
      #seo-static-summary .seo-static-shell-eyebrow {
        margin: 0 0 2rem;
        color: var(--shell-muted);
        font-size: 0.6rem;
        letter-spacing: 0.34em;
        text-transform: uppercase;
      }
      #seo-static-summary .seo-static-shell-heading {
        max-width: 13ch;
        font-family: var(--font-serif, "Cormorant Garamond", ui-serif, Georgia, serif);
        font-size: clamp(3.15rem, 13vw, 8rem);
        font-style: italic;
        font-weight: 300;
        line-height: 0.86;
        text-wrap: balance;
      }
      #seo-static-summary .seo-static-client-shell[data-section="research-article"] .seo-static-shell-heading {
        max-width: 18ch;
        font-size: clamp(2.8rem, 10vw, 6.75rem);
      }
      #seo-static-summary .seo-static-shell-description {
        max-width: 42rem;
        margin: 2rem 0 0;
        color: var(--shell-muted);
        font-size: 0.9rem;
        line-height: 1.75;
      }
      #seo-static-summary .seo-static-shell-status {
        display: flex;
        max-width: 42rem;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 2.5rem;
        border-top: 1px solid var(--shell-line);
        padding-top: 0.85rem;
        color: var(--shell-muted);
        font-size: 0.56rem;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }
      #seo-static-summary .seo-static-shell-status::after {
        width: 2.5rem;
        height: 1px;
        background: currentColor;
        content: "";
      }
      @media (min-width: 768px) {
        #seo-static-summary .seo-static-shell-header {
          min-height: 5.125rem;
          grid-template-columns: minmax(16.5rem, 0.72fr) minmax(0, 1.28fr);
        }
        #seo-static-summary .seo-static-shell-brand {
          border-right: 1px solid var(--shell-line);
          padding-inline: 2rem;
        }
        #seo-static-summary .seo-static-shell-brand small {
          font-size: 0.92rem;
        }
        #seo-static-summary .seo-static-shell-index {
          display: none;
        }
        #seo-static-summary .seo-static-shell-nav {
          display: flex;
          min-width: 0;
          align-items: stretch;
          justify-content: flex-end;
        }
        #seo-static-summary .seo-static-shell-nav a {
          display: inline-flex;
          min-width: 0;
          align-items: center;
          padding: 0 0.8rem;
          color: var(--shell-muted);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-decoration: none;
        }
        #seo-static-summary .seo-static-shell-stage {
          padding: 6rem 2.5rem 4rem;
        }
        #seo-static-summary .seo-static-shell-heading {
          font-size: clamp(5rem, 9vw, 9rem);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #seo-static-summary .seo-static-shell-status::after {
          width: 1.5rem;
        }
      }
      #seo-static-summary {
        box-sizing: border-box;
        min-height: 100vh;
        padding: 2rem;
        background: var(--color-${dark ? 'ink' : 'canvas'}, ${staticBackground});
        color: var(--color-${dark ? 'canvas' : 'ink'}, ${staticForeground});
        font-family: var(--font-sans, Inter, ui-sans-serif, system-ui, sans-serif);
      }
      #seo-static-summary .seo-static-brand {
        display: grid;
        gap: 0.45rem;
        margin-bottom: clamp(3rem, 8vw, 7rem);
        border-bottom: 1px solid color-mix(in srgb, currentColor 16%, transparent);
        padding-bottom: 1.25rem;
        color: inherit;
        text-decoration: none;
      }
      #seo-static-summary .seo-static-brand span {
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.3em;
      }
      #seo-static-summary .seo-static-brand small {
        font-family: var(--font-serif, "Cormorant Garamond", ui-serif, Georgia, serif);
        font-size: 0.82rem;
        font-style: italic;
        font-weight: 400;
        line-height: 1.15;
        opacity: 0.72;
      }
      #seo-static-summary h1 {
        max-width: 70rem;
        margin: 0 0 1rem;
        font-family: var(--font-serif, "Cormorant Garamond", ui-serif, Georgia, serif);
        font-size: 3rem;
        font-weight: 300;
        line-height: 0.9;
      }
      @media (min-width: 768px) {
        #seo-static-summary {
          padding: 4rem;
        }
        #seo-static-summary h1 {
          font-size: 5.5rem;
        }
      }
      @media (min-width: 1200px) {
        #seo-static-summary {
          padding: 6rem;
        }
        #seo-static-summary h1 {
          font-size: 8rem;
        }
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
        border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
        padding: 0.65rem;
        text-align: left;
        vertical-align: top;
      }
      #seo-static-summary th {
        background: color-mix(in srgb, currentColor 8%, transparent);
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      #seo-static-summary figure {
        margin: 1.5rem 0 2rem;
      }
      #seo-static-summary figcaption {
        margin-bottom: 0.75rem;
        line-height: 1.6;
      }
      #seo-static-summary pre {
        overflow-x: auto;
        padding: 1rem;
        border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
        background: color-mix(in srgb, currentColor 5%, transparent);
        font-size: 0.78rem;
        line-height: 1.6;
        white-space: pre;
      }
      .app-mounted #seo-static-summary {
        display: none;
      }
    </style>
    <noscript>
      <style>
        html.js-pending #seo-static-summary {
          overflow: visible;
          padding: 2rem;
        }
        html.js-pending #seo-static-summary .seo-static-client-shell {
          display: none;
        }
        html.js-pending #seo-static-summary .seo-static-crawl-content {
          display: block;
        }
        @media (min-width: 768px) {
          html.js-pending #seo-static-summary {
            padding: 4rem;
          }
        }
        @media (min-width: 1200px) {
          html.js-pending #seo-static-summary {
            padding: 6rem;
          }
        }
      </style>
    </noscript>
    ${assetTags}
  </head>`;
}

function buildStaticBrand() {
  return `<a class="seo-static-brand" href="/" aria-label="Sulayman Bowles home">
        <span>SULAYMAN BOWLES</span>
        <small>Technical SEO · AI Systems · Finance Research</small>
      </a>`;
}

function routeShellLabel(route: SeoRoute) {
  if (route.section === 'research-article') return 'Research / evidence reader';
  if (route.section === 'project') return 'Project / inspectable system';
  if (route.section === 'service' || route.section === 'local-service') return 'Technical SEO / bounded engagement';
  if (route.section === 'research') return 'Research / public archive';
  if (route.section === 'work') return 'Selected work / public artifacts';
  if (route.section === 'contact') return 'Direct contact / brief intake';
  if (route.section === 'about' || route.section === 'resume') return 'Profile / current record';
  if (route.section === 'home') return 'Sulayman Bowles / public record';
  return 'Route / public record';
}

function buildClientShell(route: SeoRoute) {
  const navLinks = [
    ['Work', '/work'],
    ['Atlas', '/atlas'],
    ['Research', '/research'],
    ['About', '/about'],
    ['Resume', '/resume'],
    ['Contact', '/contact'],
  ];
  const displayHeading = route.displayH1 ?? route.h1;

  return `<div class="seo-static-client-shell" data-section="${route.section}" aria-label="Loading ${escapeHtml(displayHeading)}" aria-busy="true">
      <header class="seo-static-shell-header">
        <a class="seo-static-shell-brand" href="/" aria-label="Sulayman Bowles home">
          <strong>SULAYMAN BOWLES</strong>
          <small>Technical SEO · AI Systems · Finance Research</small>
        </a>
        <a class="seo-static-shell-index" href="/sitemap">INDEX&nbsp;&nbsp;+</a>
        <nav class="seo-static-shell-nav" aria-label="Primary navigation">
          ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('\n          ')}
        </nav>
      </header>
      <div class="seo-static-shell-stage">
        <p class="seo-static-shell-eyebrow">${escapeHtml(routeShellLabel(route))}</p>
        <div class="seo-static-shell-heading" role="heading" aria-level="1">${escapeHtml(displayHeading)}</div>
        <p class="seo-static-shell-description">${escapeHtml(route.description)}</p>
        <div class="seo-static-shell-status" role="status">Opening the current route</div>
      </div>
    </div>`;
}

function buildFallback(route: SeoRoute) {
  const staticHtml = route.path === '/sitemap' ? buildSitemapStaticHtml(getCanonicalRoutes()) : route.staticHtml ?? buildRouteStaticHtml(route);

  if (staticHtml) {
    return `<section id="seo-static-summary" aria-label="Static route content">
      ${buildClientShell(route)}
      <main class="seo-static-crawl-content">
        ${buildStaticBrand()}
${staticHtml}
      </main>
    </section>`;
  }

  if (route.staticHtml) {
    return `<section id="seo-static-summary" aria-label="Static route summary">
      ${buildClientShell(route)}
      <main class="seo-static-crawl-content">
        ${buildStaticBrand()}
${route.staticHtml}
      </main>
    </section>`;
  }

  const navLinks = [
    ['Home', '/'],
    ['About', '/about'],
    ['Resume', '/resume'],
    ['Atlas', '/atlas'],
    ['VOID audit kit', 'https://www.void-agency.com/tools/technical-seo-audit-checklist'],
    ['Markets', '/markets'],
  ];

  return `<section id="seo-static-summary" aria-label="Static route summary">
      ${buildClientShell(route)}
      <main class="seo-static-crawl-content">
        ${buildStaticBrand()}
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.staticSummary)}</p>
        <nav aria-label="Primary static links">
          ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('\n          ')}
        </nav>
      </main>
    </section>`;
}

function injectFallback(html: string, route: SeoRoute) {
  return html.replace(/<div id="root"><\/div>/, `${buildFallback(route)}\n    <div id="root"></div>`);
}

function replaceHead(html: string, route: SeoRoute, assetTags: string) {
  return html.replace(/<head[^>]*>[\s\S]*?<\/head>/i, buildHead(route, assetTags));
}

function verifyStaticFallback(routeHtml: string, routePath: string) {
  if (!routeHtml.includes('<main class="seo-static-crawl-content">')) {
    throw new Error(`${routePath}: generated static fallback is missing its semantic main landmark`);
  }
  if (!/<h1\b/i.test(routeHtml)) {
    throw new Error(`${routePath}: generated static fallback is missing its H1`);
  }
}

async function writeRouteHtml(template: string, assetTags: string, route: SeoRoute) {
  const outputPath = routeOutputPath(route);
  const routeHtml = replaceHead(injectFallback(template, route), route, assetTags);
  verifyStaticFallback(routeHtml, route.path);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, routeHtml);

  if (route.path !== '/') {
    const cleanUrlFallbackPath = path.join(DIST_DIR, `${route.path.slice(1)}.html`);
    await fs.mkdir(path.dirname(cleanUrlFallbackPath), { recursive: true });
    await fs.writeFile(cleanUrlFallbackPath, routeHtml);
  }
}

async function writeNotFoundHtml(template: string, assetTags: string) {
  const routeHtml = replaceHead(injectFallback(template, NOT_FOUND_ROUTE), NOT_FOUND_ROUTE, assetTags);
  verifyStaticFallback(routeHtml, '404');
  await fs.writeFile(path.join(DIST_DIR, '404.html'), routeHtml);
}

async function writeSitemap() {
  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), buildSitemapXml());
}

async function main() {
  verifyArticleRouteMetadata();

  const templatePath = path.join(DIST_DIR, 'index.html');
  const template = await fs.readFile(templatePath, 'utf8');
  const assetTags = extractAssetTags(extractHead(template));

  await Promise.all([
    ...SEO_ROUTES.filter((route) => route.includeInSitemap || route.generateStatic).map((route) => writeRouteHtml(template, assetTags, route)),
    writeNotFoundHtml(template, assetTags),
  ]);
  await writeSitemap();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
