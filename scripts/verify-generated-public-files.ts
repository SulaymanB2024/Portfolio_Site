import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildProgrammaticSeoIndexJson,
  buildSitemapXml,
} from '../src/seo/generatedPublicFiles';

const expectedFiles = [
  ['public/llms.txt', buildLlmsText()],
  ['public/sitemap.xml', buildSitemapXml()],
  ['public/research/article-research-briefs.json', buildArticleResearchBriefsJson()],
  ['public/research/authority-assets.json', buildAuthorityAssetsJson()],
  ['public/research/technical-seo-reference-index.json', buildProgrammaticSeoIndexJson()],
] as const;

const staleFiles: string[] = [];

for (const [relativePath, expected] of expectedFiles) {
  const actual = await fs.readFile(path.resolve(process.cwd(), relativePath), 'utf8');
  if (actual !== expected) {
    staleFiles.push(relativePath);
  }
}

if (staleFiles.length > 0) {
  throw new Error(`Generated public files are stale: ${staleFiles.join(', ')}. Run npm run generate:public.`);
}

console.log('Generated public files match their typed sources.');
