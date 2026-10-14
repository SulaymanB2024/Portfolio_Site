import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const assets = join(root, 'public/research-assets/kalshi-valuation-2026');
const { assumptions, valuation, valueCase, reverseScale } = await import(pathToFileURL(join(assets, 'model.mjs')).href);
const close = (actual, expected) => assert(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
const result = valuation();
close(result.weightedEv, 28.532927994839607);
close(result.weightedEquity, 29.532927994839607);
const expected = { Restricted: 2.613160497892958, Base: 26.406006237067196, Breakout: 58.70653900733108 };
for (const c of result.cases) {
  close(c.ev, expected[c.name]);
  assert.equal(c.rows.length, 10);
  for (const row of c.rows) {
    close(row.fcf, row.nopat - row.reinvestment);
    close(row.nopat, row.ebit - Math.max(row.ebit, 0) * assumptions.tax_rate);
    assert(row.reinvestment >= 0);
  }
  close(c.ev, c.rows.reduce((sum, row) => sum + row.pv, 0) + c.pvStub + c.pvTerminal);
  close(c.equity, c.ev + 1);
}
close(valueCase('Base', { scale: reverseScale(40) }).equity, 40);
close(valueCase('Base', { scale: reverseScale(40) }).rows[4].revenue, 13.245045232027016);
close(valueCase('Base', { shock: -0.0025 }).equity, 23.150712151937554);
assert(valueCase('Base', { discount: .14 }).ev < valueCase('Base', { discount: .12 }).ev);
assert.throws(() => valueCase('Base', { discount: .03, growth: .03 }));
assert.throws(() => valueCase('unknown'));
assert.deepEqual(JSON.parse(readFileSync(join(assets, 'assumptions.json'), 'utf8')), assumptions);

// Cross-check the independently generated Python CSV, not just headline values.
const csv = readFileSync(join(assets, 'forecast.csv'), 'utf8').trim().split(/\r?\n/);
const headers = csv.shift().split(',');
assert.equal(csv.length, 30);
for (const line of csv) {
  const record = Object.fromEntries(line.split(',').map((cell, i) => [headers[i], cell]));
  const row = result.cases.find(c => c.name === record.case).rows.find(r => r.year === Number(record.year));
  for (const field of ['revenue', 'ebit', 'nopat', 'reinvestment', 'fcf', 'pv']) close(row[field], Number(record[field]));
  close(row.margin, Number(record.ebit_margin));
}

const articlePath = 'src/personal/editorial/data/articles/kalshi-40-billion-question.json';
const bytes = readFileSync(join(root, articlePath));
const article = JSON.parse(bytes);
const record = JSON.parse(readFileSync(join(root, 'docs/article-publications.json'), 'utf8')).records.find(r => r.slug === article.slug);
assert.equal(createHash('sha256').update(bytes).digest('hex'), record.articleSha256);
assert.equal(article.readTime, '20 MIN');
assert.equal(article.sources.length, 17);
assert.equal(article.sections.length, 12);
assert.equal(new Set(article.sections.map(s => s.id)).size, 12);
const sourceIds = new Set(article.sources.map(s => `source-${s.id.toLowerCase()}`));
assert.equal(sourceIds.size, 17);
for (const match of JSON.stringify(article).matchAll(/#(source-[\w-]+)/g)) assert(sourceIds.has(match[1]));
for (const resource of article.resources) assert(existsSync(join(root, 'public', resource.href)), resource.href);
for (const section of article.sections) for (const figure of section.figures || []) {
  const svg = readFileSync(join(root, 'public', figure.src), 'utf8');
  assert(svg.includes('<title') && svg.includes('<desc'));
  assert(figure.alt && figure.caption && figure.width > 0 && figure.height > 0);
}
const image = readFileSync(join(root, 'public', article.image));
assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(image.readUInt32BE(16), 1200);
assert.equal(image.readUInt32BE(20), 630);
const catalog = JSON.parse(readFileSync(join(root, 'src/personal/editorial/data/catalog.json'), 'utf8'));
const summary = catalog.find(a => a.slug === article.slug);
for (const key of ['title', 'displayTitle', 'path', 'subtitle', 'date', 'dateModified', 'readTime', 'seoTitle', 'seoDescription', 'image']) assert.equal(summary[key], article[key], key);
console.log('Kalshi: three valuations, 30 Python/JS forecast rows, reverse valuation, sensitivities, source anchors, assets and publication identity passed.');
