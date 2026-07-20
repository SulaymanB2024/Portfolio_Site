import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildProgrammaticSeoIndexJson,
  buildSitemapXml,
} from '../src/seo/generatedPublicFiles';

const publicDir = path.resolve(process.cwd(), 'public');

await Promise.all([
  fs.writeFile(path.join(publicDir, 'llms.txt'), buildLlmsText()),
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml()),
  fs.writeFile(path.join(publicDir, 'research', 'article-research-briefs.json'), buildArticleResearchBriefsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'authority-assets.json'), buildAuthorityAssetsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'technical-seo-reference-index.json'), buildProgrammaticSeoIndexJson()),
]);
