import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildProgrammaticSeoIndexJson,
  buildSeoPortfolioRoutesJson,
  buildSeoRedirectsJson,
  buildSitemapXml,
  buildTexasTollOwnershipCsv,
  buildTexasTollOwnershipJson,
} from '../src/seo/generatedPublicFiles';

const publicDir = path.resolve(process.cwd(), 'public');

await Promise.all([
  fs.writeFile(path.join(publicDir, 'llms.txt'), buildLlmsText()),
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml()),
  fs.writeFile(path.join(publicDir, 'research', 'article-research-briefs.json'), buildArticleResearchBriefsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'authority-assets.json'), buildAuthorityAssetsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'technical-seo-reference-index.json'), buildProgrammaticSeoIndexJson()),
  fs.writeFile(path.join(publicDir, 'research', 'seo-portfolio-routes-v1.json'), buildSeoPortfolioRoutesJson()),
  fs.writeFile(path.join(publicDir, 'research', 'seo-redirects-v1.json'), buildSeoRedirectsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'texas-toll-road-ownership-2026.csv'), buildTexasTollOwnershipCsv()),
  fs.writeFile(path.join(publicDir, 'research', 'texas-toll-road-ownership-2026.json'), buildTexasTollOwnershipJson()),
]);
