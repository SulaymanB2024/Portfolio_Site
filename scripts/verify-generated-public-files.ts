import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildProgrammaticSeoIndexJson,
  buildSitemapXml,
  buildTexasTollOwnershipCsv,
  buildUsTollRoadMethodologyMarkdown,
  buildUsTollRoadPrivateHybridCsv,
  buildUsTollRoadSourceLedgerCsv,
  buildUsTollRoadStateOverviewCsv,
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
  ['public/research/technical-seo-reference-index.json', buildProgrammaticSeoIndexJson()],
  ['public/research/texas-toll-road-ownership-2026.csv', buildTexasTollOwnershipCsv()],
  ['public/research/us-toll-road-state-overview-2026.csv', buildUsTollRoadStateOverviewCsv()],
  ['public/research/us-toll-road-private-hybrid-2026.csv', buildUsTollRoadPrivateHybridCsv()],
  ['public/research/us-toll-road-source-ledger-2026.csv', buildUsTollRoadSourceLedgerCsv()],
  ['public/research/us-toll-road-ownership-methodology-2026.md', buildUsTollRoadMethodologyMarkdown()],
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
