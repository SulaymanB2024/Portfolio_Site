import assert from 'node:assert/strict';
import test from 'node:test';

import { trailingSlashRedirectUrl } from '../canonical-url.ts';

test('trailing slash redirects preserve the rest of the request URL', () => {
  assert.equal(
    trailingSlashRedirectUrl('https://sulayman-bowles.dev/about/?utm_source=test'),
    'https://sulayman-bowles.dev/about?utm_source=test',
  );
  assert.equal(
    trailingSlashRedirectUrl('https://sulayman-bowles.dev/research/ai-crawlers///'),
    'https://sulayman-bowles.dev/research/ai-crawlers',
  );
});

test('canonical and reserved paths do not redirect', () => {
  assert.equal(trailingSlashRedirectUrl('https://sulayman-bowles.dev/'), null);
  assert.equal(trailingSlashRedirectUrl('https://sulayman-bowles.dev/about'), null);
  assert.equal(
    trailingSlashRedirectUrl('https://sulayman-bowles.dev/.well-known/security.txt/'),
    null,
  );
});
