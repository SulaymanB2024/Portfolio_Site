import assert from 'node:assert/strict';
import test from 'node:test';
import { WORK_STUDIES, findWorkStudy, workStudyPath } from './workStudies';
import { renderWorkStudy, renderWorkIndex, workIndexJsonLd, escapeHtml } from './workStudyView';
import { getSeoRoute, getRouteTone, SEO_ROUTES } from '../seo/routes';
import { buildRouteStaticHtml } from '../seo/staticContent';
import { assertSeoAuthorityContract } from '../seo/machineReadableAuthority';

const slugs = ['internshipdeadlines','project-delta','payrollpro','no-limit-artemis','mandatearc','jane-street-puzzle','internship-aggregator-engine','1-800-operator'];
const count = (html: string, pattern: RegExp) => [...html.matchAll(pattern)].length;

test('eight selected projects have unique first-class routes and no private repository links', () => {
  assert.deepEqual(WORK_STUDIES.map(s => s.slug), slugs);
  assert.equal(new Set(WORK_STUDIES.map(s => s.legacyId)).size, 8);
  assert.equal(new Set(WORK_STUDIES.map(s => s.visual)).size, 8);
  for (const study of WORK_STUDIES) {
    const path = workStudyPath(study), route = getSeoRoute(path)!;
    assert.ok(route?.includeInSitemap, path);
    assert.equal(getRouteTone(path), 'light');
    assert.equal(findWorkStudy(path + '/?ref=test#result')?.slug, study.slug);
    assert.ok(study.description.length >= 110 && study.description.length <= 190);
    assert.equal(study.chapters.length, 3);
    assert.equal(study.observations.length, 3);
    assert.ok(study.decisions.length >= 2);
    assert.ok(study.chapters.flatMap(c => c.paragraphs).join(' ').split(/\s+/).length >= 160);
    assert.ok(study.related.every(slug => slugs.includes(slug)));
    assert.ok(study.links.every(link => link.href.startsWith('https://')));
    assert.ok(study.links.every(link => !/github\.com\/SulaymanB2024\/(?:project-delta|Jane-Street-M0|internship-aggregator-engine|1-800-Operator|mandatearc)(?:\/|$)/i.test(link.href)));
    assert.equal(buildRouteStaticHtml(route), renderWorkStudy(study));
  }
  assert.equal(findWorkStudy('/work/not-a-project'), undefined);
  assert.equal(findWorkStudy('/workshop/project-delta'), undefined);
});

test('every case is one semantic document with valid section and control targets', () => {
  for (const study of WORK_STUDIES) {
    const html = renderWorkStudy(study);
    assert.equal(count(html, /<main\b/g), 1, study.slug);
    assert.equal(count(html, /<h1\b/g), 1, study.slug);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, study.slug);
    for (const match of html.matchAll(/(?:href="#|aria-controls=")([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
    assert.equal(count(html, /data-observation-button=/g), 3);
    assert.equal(count(html, /data-observation=/g), 3);
    assert.ok(!/<p[^>]*data-observation=[^>]*\shidden[\s>]/.test(html), 'all observations must be present before enhancement');
    assert.ok(!/<script\b|\bonclick=/i.test(html));
    assert.ok(html.includes('Status &amp; source notes') || html.includes('Status & source notes'));
  }
});

test('the work index links all eight cases and preserves all six earlier works', () => {
  const html = renderWorkIndex();
  assert.equal(count(html, /<h1\b/g), 1);
  assert.equal(count(html, /<main\b/g), 1);
  for (const study of WORK_STUDIES) {
    assert.ok(html.includes(`href="${workStudyPath(study)}"`));
    assert.ok(html.includes(`id="${study.legacyId}"`));
  }
  const list = workIndexJsonLd()['@graph'].find(n => n['@type'] === 'ItemList')!;
  assert.equal(list.numberOfItems, 14);
  assert.ok(html.includes('href="/method"'));
  assert.equal(buildRouteStaticHtml(getSeoRoute('/work')!), html);
});

test('the expanded catalog preserves the canonical identity and indexing contract', () => {
  assertSeoAuthorityContract(SEO_ROUTES);
});

test('authored strings cannot inject markup; boundaries stay specific', () => {
  assert.equal(escapeHtml('<script>"x" & y\'</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&#39;&lt;/script&gt;');
  assert.match(WORK_STUDIES[0].scope, /complete collection is not a count of unique open internships/i);
  assert.match(WORK_STUDIES[0].scope, /KING MAKER supplies validated catalog releases/i);
  assert.match(WORK_STUDIES[5].scope, /not claim.*fresh|not.*rerun|not.*execut/i);
  assert.match(WORK_STUDIES[7].scope, /private|internal/i);
});
