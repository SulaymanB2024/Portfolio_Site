import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizePortfolioMeasurementId,
  resolvePortfolioSite,
  sanitizePortfolioPath,
  sanitizePortfolioReferrer,
} from './portfolioAnalytics';

test('portfolio measurement ids fail closed', () => {
  assert.equal(normalizePortfolioMeasurementId('g-abc12345'), 'G-ABC12345');
  assert.equal(normalizePortfolioMeasurementId(''), null);
  assert.equal(normalizePortfolioMeasurementId('UA-123'), null);
  assert.equal(normalizePortfolioMeasurementId('G-ABC<script>'), null);
});

test('only the four exact production hosts resolve', () => {
  assert.equal(resolvePortfolioSite('sulayman-bowles.dev'), 'sulayman_bowles_dev');
  assert.equal(resolvePortfolioSite('www.void-agency.com'), 'void_agency');
  assert.equal(resolvePortfolioSite('preview.sulayman-bowles.dev'), null);
  assert.equal(resolvePortfolioSite('localhost'), null);
});

test('page paths and referrers discard query strings and fragments', () => {
  assert.equal(sanitizePortfolioPath('/research/example?email=private@example.com#answer'), '/research/example');
  assert.equal(
    sanitizePortfolioReferrer('https://sulayman-bowles.tech/competitions/example?token=private'),
    'https://sulayman-bowles.tech/competitions/example',
  );
  assert.equal(
    sanitizePortfolioReferrer('https://www.google.com/search?q=private'),
    'https://www.google.com/',
  );
});
