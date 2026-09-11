import assert from 'node:assert/strict';
import test from 'node:test';
import { isNavItemActive } from './siteNavigation';

test('nested paths activate their actual parent section', () => {
  assert.ok(isNavItemActive('/atlas/sample-crawl', '/atlas'));
  assert.ok(isNavItemActive('/research/technical-seo/issues/noindex', '/research'));
  assert.ok(isNavItemActive('/resume/?print=1', '/resume'));
  assert.ok(isNavItemActive('/markets/who-owns-texas-toll-roads', '/research'));
  assert.ok(isNavItemActive('/markets', '/research'));
});
test('navigation does not confuse prefixes, external URLs, or hash targets', () => {
  assert.equal(isNavItemActive('/atlas-other', '/atlas'), false);
  assert.equal(isNavItemActive('/research', '/'), false);
  assert.equal(isNavItemActive('/research', 'https://example.org/research'), false);
  assert.equal(isNavItemActive('/research', '//example.org/research'), false);
  assert.equal(isNavItemActive('/about#other', '/about#music'), false);
  assert.ok(isNavItemActive('/about#music', '/about#music'));
});
