import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  buildPortfolioCtaEvent,
  normalizePortfolioMeasurementId,
  PORTFOLIO_CTA_METADATA,
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

test('CTA events accept only fixed metadata on exact production hosts', () => {
  assert.deepEqual(
    buildPortfolioCtaEvent(
      'resume_download_pdf',
      'sulayman-bowles.dev',
      '/resume?candidate=private#download',
    ),
    {
      cta_id: 'resume_download_pdf',
      cta_surface: 'resume',
      destination: 'resume_pdf',
      destination_kind: 'download',
      page_path: '/resume',
      portfolio_site: 'sulayman_bowles_dev',
    },
  );
  assert.equal(buildPortfolioCtaEvent('private@example.com', 'sulayman-bowles.dev', '/resume'), null);
  assert.equal(buildPortfolioCtaEvent('resume_download_pdf', 'preview.sulayman-bowles.dev', '/resume'), null);
});

test('literal CTA markers resolve to the fixed content-safe registry', () => {
  const sourceFiles = [
    'src/App.tsx',
    'src/pages/ContactPage.tsx',
    'src/pages/ResearchPage.tsx',
    'src/pages/ResumePage.tsx',
    'src/pages/WorkPage.tsx',
  ];
  const markerPattern = /data-portfolio-cta="([a-z0-9_]+)"/g;
  const markers = sourceFiles.flatMap((filePath) =>
    [...fs.readFileSync(filePath, 'utf8').matchAll(markerPattern)].map((match) => match[1]),
  );

  assert.ok(markers.length >= 15);
  markers.forEach((marker) => {
    assert.ok(marker in PORTFOLIO_CTA_METADATA, `unknown CTA marker: ${marker}`);
  });
});
