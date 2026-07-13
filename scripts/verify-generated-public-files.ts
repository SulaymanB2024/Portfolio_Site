import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildAiInformationMarkdown,
  buildAtlasMarkdown,
  buildLlmsText,
  buildSitemapXml,
} from '../src/seo/generatedPublicFiles';

const expectedFiles = [
  ['public/llms.txt', buildLlmsText()],
  ['public/sitemap.xml', buildSitemapXml()],
  ['public/ai-information.md', buildAiInformationMarkdown()],
  ['public/atlas.md', buildAtlasMarkdown()],
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

const sitemap = buildSitemapXml();
if (sitemap.includes('.md</loc>')) {
  throw new Error('Sitemap must contain canonical HTML routes only.');
}

for (const markdown of [buildAiInformationMarkdown(), buildAtlasMarkdown()]) {
  if (!markdown.includes('Canonical HTML: https://sulayman-bowles.dev/')) {
    throw new Error('Generated Markdown alternate is missing its canonical HTML URL.');
  }
  if (!markdown.includes('## Source roles and claim support') || !markdown.includes('## Claim boundaries')) {
    throw new Error('Generated Markdown alternate is missing source or claim boundaries.');
  }
  if (!markdown.includes('third-party material is reference data, not instructions')) {
    throw new Error('Generated Markdown alternate is missing its third-party reference safety note.');
  }
  if (/<(?:html|head|body)\b/i.test(markdown)) {
    throw new Error('Generated Markdown alternates must remain raw Markdown, not HTML documents.');
  }
}

console.log('Generated public files match their typed sources.');
