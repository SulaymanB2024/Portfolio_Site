import { promises as fs } from 'node:fs';
import path from 'node:path';

import { buildLlmsText, buildSitemapXml } from '../src/seo/generatedPublicFiles';

const publicDir = path.resolve(process.cwd(), 'public');

await Promise.all([
  fs.writeFile(path.join(publicDir, 'llms.txt'), buildLlmsText()),
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml()),
]);
