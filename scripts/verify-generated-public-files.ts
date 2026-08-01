import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildSitemapXml,
  buildTexasTollOwnershipCsv,
} from '../src/seo/generatedPublicFiles';
import {
  assertSeoAuthorityContract,
  buildRobotsText,
} from '../src/seo/machineReadableAuthority';
import { SEO_ROUTES } from '../src/seo/routes';

const expectedFiles = [
  ['public/robots.txt', buildRobotsText()],
  ['public/llms.txt', buildLlmsText()],
  ['public/sitemap.xml', buildSitemapXml()],
  ['public/research/article-research-briefs.json', buildArticleResearchBriefsJson()],
  ['public/research/authority-assets.json', buildAuthorityAssetsJson()],
  ['public/research/texas-toll-road-ownership-2026.csv', buildTexasTollOwnershipCsv()],
] as const;

assertSeoAuthorityContract(SEO_ROUTES);

const staleFiles: string[] = [];

for (const [relativePath, expected] of expectedFiles) {
  const actual = await fs.readFile(path.resolve(process.cwd(), relativePath), 'utf8');
  if (actual !== expected) {
    staleFiles.push(relativePath);
  }
}

if (staleFiles.length > 0) {
  const robotsRemediation = staleFiles.includes('public/robots.txt')
    ? ' Synchronize public/robots.txt with buildRobotsText(); generate:public does not own that file.'
    : '';
  throw new Error(`Generated public files are stale: ${staleFiles.join(', ')}. Run npm run generate:public for generated outputs.${robotsRemediation}`);
}

const indexableCount = SEO_ROUTES.filter((route) => route.includeInSitemap).length;
const noindexCount = SEO_ROUTES.length - indexableCount;
console.log(`Generated public files match typed sources; ${indexableCount} indexable routes and ${noindexCount} explicit noindex routes satisfy the authority contract.`);
