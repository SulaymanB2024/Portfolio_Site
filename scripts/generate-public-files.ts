import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildArticleResearchBriefsJson,
  buildAuthorityAssetsJson,
  buildLlmsText,
  buildProgrammaticSeoIndexJson,
  buildSitemapXml,
  buildTexasTollOwnershipCsv,
} from '../src/seo/generatedPublicFiles';

const publicDir = path.resolve(process.cwd(), 'public');
const texasTollWorkbookPartsDir = path.resolve(
  process.cwd(),
  'src',
  'content',
  'texasTollFinanceWorkbook',
);
const texasTollWorkbookSha256 = '6f257e189ad4505cc5f3d847b0ddb81db57743bb5f1e800a862fa3813dd09290';

async function buildTexasTollFinanceWorkbook() {
  const partNames = Array.from(
    { length: 8 },
    (_, index) => `part-${index.toString().padStart(2, '0')}.b64`,
  );
  const parts = await Promise.all(
    partNames.map((partName) => fs.readFile(path.join(texasTollWorkbookPartsDir, partName), 'utf8')),
  );
  const workbook = Buffer.from(parts.join(''), 'base64');
  const actualSha256 = createHash('sha256').update(workbook).digest('hex');

  if (actualSha256 !== texasTollWorkbookSha256) {
    throw new Error(
      `Texas toll-road workbook checksum mismatch: expected ${texasTollWorkbookSha256}, got ${actualSha256}`,
    );
  }

  return workbook;
}

const texasTollFinanceWorkbook = await buildTexasTollFinanceWorkbook();

await Promise.all([
  fs.writeFile(path.join(publicDir, 'llms.txt'), buildLlmsText()),
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml()),
  fs.writeFile(path.join(publicDir, 'research', 'article-research-briefs.json'), buildArticleResearchBriefsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'authority-assets.json'), buildAuthorityAssetsJson()),
  fs.writeFile(path.join(publicDir, 'research', 'technical-seo-reference-index.json'), buildProgrammaticSeoIndexJson()),
  fs.writeFile(path.join(publicDir, 'research', 'texas-toll-road-ownership-2026.csv'), buildTexasTollOwnershipCsv()),
  fs.writeFile(
    path.join(publicDir, 'research', 'texas-toll-road-finance-2025.xlsx'),
    texasTollFinanceWorkbook,
  ),
]);
