import assert from 'node:assert/strict';
import test from 'node:test';

import { validateBotEvent } from '../event-schema.ts';
import {
  createBotEvent,
  getBotObserverRuntimeConfig,
  routeClassForRequest,
  shouldObserveRequest,
  type BotObserverRuntimeConfig,
} from '../middleware-adapter.ts';
import {
  sha256Hex,
  signCollectorRequest,
  verifyCollectorSignature,
} from '../signer.ts';

const runtimeConfig: BotObserverRuntimeConfig = {
  collectorUrl: 'https://example.supabase.co/functions/v1/bot-event-collector',
  siteId: 'sulayman-bowles-dev',
  secret: 'test-secret-that-is-at-least-32-characters-long',
  environment: 'preview',
  deploymentId: 'preview-deployment',
  commitSha: '0123456789abcdef',
};

function request(path: string, init: RequestInit = {}): Request {
  return new Request(`https://sulayman-bowles.dev${path}`, init);
}

test('route selection includes only useful public GET and HEAD resources', () => {
  const cases = [
    ['/', {}, 'document'],
    ['/about', { method: 'HEAD' }, 'document'],
    ['/work', { headers: { accept: 'text/html' } }, 'document'],
    ['/robots.txt', {}, 'robots'],
    ['/llms.txt', {}, 'llms'],
    ['/sitemap.xml', {}, 'sitemap'],
    ['/sitemap-articles.xml', {}, 'sitemap'],
    ['/Sulayman_Bowles_Resume.pdf', {}, 'public_pdf'],
    ['/research/authority-assets.json', {}, 'machine_readable'],
    ['/feed.xml', {}, 'machine_readable'],
    ['/important.txt', {}, 'machine_readable'],
  ] as const;

  for (const [path, init, expected] of cases) {
    const candidate = request(path, init);
    assert.equal(routeClassForRequest(candidate), expected, path);
    assert.equal(shouldObserveRequest(candidate), true, path);
  }
});

test('route selection excludes APIs, health checks, assets, and non-read methods', () => {
  const cases = [
    ['/', { method: 'POST' }],
    ['/contact', { method: 'PUT' }],
    ['/api/contact', {}],
    ['/api', {}],
    ['/_next/static/app.js', {}],
    ['/assets/app.js', {}],
    ['/fonts/site.woff2', {}],
    ['/health', {}],
    ['/healthz', {}],
    ['/favicon.svg', {}],
    ['/image.png', {}],
    ['/styles.css', {}],
    ['/bundle.js', {}],
    ['/source.js.map', {}],
    ['/archive.zip', { headers: { accept: 'application/zip' } }],
  ] as const;

  for (const [path, init] of cases) {
    const candidate = request(path, init);
    assert.equal(routeClassForRequest(candidate), null, path);
    assert.equal(shouldObserveRequest(candidate), false, path);
  }
});

test('runtime configuration is explicitly enabled and fails closed', () => {
  const valid = {
    BOT_OBSERVER_ENABLED: 'true',
    BOT_OBSERVER_COLLECTOR_URL: runtimeConfig.collectorUrl,
    BOT_OBSERVER_SITE_ID: runtimeConfig.siteId,
    BOT_OBSERVER_HMAC_SECRET: runtimeConfig.secret,
    VERCEL_ENV: 'preview',
    VERCEL_DEPLOYMENT_ID: runtimeConfig.deploymentId ?? undefined,
    VERCEL_GIT_COMMIT_SHA: runtimeConfig.commitSha ?? undefined,
  };

  assert.deepEqual(getBotObserverRuntimeConfig(valid), runtimeConfig);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_ENABLED: 'TRUE' }), null);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_ENABLED: 'false' }), null);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_COLLECTOR_URL: undefined }), null);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_COLLECTOR_URL: 'http://collector.test' }), null);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_SITE_ID: '../other-site' }), null);
  assert.equal(getBotObserverRuntimeConfig({ ...valid, BOT_OBSERVER_HMAC_SECRET: 'too-short' }), null);
});

test('event creation separates identity evidence and redacts request metadata', () => {
  const observed = request(
    '/ai-information?email=person%40example.com&utm_source=private&utm_source=duplicate',
    {
      method: 'GET',
      headers: {
        accept: 'text/html',
        referer: 'https://example.com/private/path?token=secret#fragment',
        'user-agent': 'OAI-SearchBot/1.0',
        'x-vercel-ip-country': 'us',
        'x-vercel-ip-country-region': 'tx',
        'x-vercel-ip-as-number': '64512',
        signature: 'sig1=:not-yet-verified:',
        cookie: 'session=must-not-appear',
        authorization: 'Bearer must-not-appear',
      },
    },
  );

  const event = createBotEvent(observed, runtimeConfig);

  assert.equal(event.routeClass, 'document');
  assert.equal(event.path, '/ai-information');
  assert.deepEqual(event.queryParameterNames, ['email', 'utm_source']);
  assert.equal(event.redactedReferrerOrigin, 'https://example.com');
  assert.equal(event.observedClass, 'self_identified_bot');
  assert.equal(event.claimedBotId, 'openai-oai-searchbot');
  assert.equal(event.claimedOperator, 'OpenAI');
  assert.equal(event.purpose, 'ai_search');
  assert.equal(event.verificationStatus, 'unverified');
  assert.equal(event.verificationMethod, null);
  assert.equal(event.country, 'US');
  assert.equal(event.region, 'tx');
  assert.equal(event.asn, 64512);
  assert.equal(event.ipHashRotating, null);
  assert.equal(event.ja3Digest, null);
  assert.equal(event.ja4Digest, null);
  assert.equal(event.signaturePresent, true);
  assert.equal(event.signatureVerificationStatus, 'unverified');

  const serialized = JSON.stringify(event);
  for (const sensitiveValue of [
    'person@example.com',
    'private/path',
    'token=secret',
    'session=must-not-appear',
    'Bearer must-not-appear',
  ]) {
    assert.equal(serialized.includes(sensitiveValue), false, sensitiveValue);
  }

  const validation = validateBotEvent(event);
  if ('issues' in validation) assert.fail(validation.issues.join(', '));
  assert.equal(validation.ok, true);
});

test('event creation refuses requests outside the passive route contract', () => {
  assert.throws(
    () => createBotEvent(request('/api/contact'), runtimeConfig),
    /outside the observer route contract/,
  );
});

test('event schema strictly rejects unknown and sensitive fields', () => {
  const baseline = createBotEvent(
    request('/about', { headers: { 'user-agent': 'Mozilla/5.0 Chrome/138 Safari/537.36' } }),
    runtimeConfig,
  );

  assert.equal(validateBotEvent(baseline).ok, true);

  for (const field of [
    'cookie',
    'cookies',
    'authorization',
    'requestBody',
    'requestHeaders',
    'queryString',
    'rawIp',
    'email',
    'unexpected',
  ]) {
    const invalid = { ...baseline, [field]: 'sensitive-value' };
    const result = validateBotEvent(invalid);
    assert.equal(result.ok, false, field);
    if (!result.ok) {
      assert.equal(result.issues.includes('event contains unknown fields'), true, field);
    }
  }
});

test('event schema rejects malformed values instead of coercing them', () => {
  const baseline = createBotEvent(request('/robots.txt'), runtimeConfig);
  const cases = [
    { ...baseline, eventSchemaVersion: '999' },
    { ...baseline, eventId: 'not-a-uuid' },
    { ...baseline, occurredAt: 'not-a-date' },
    { ...baseline, method: 'POST' },
    { ...baseline, confidence: 1.01 },
    { ...baseline, verificationStatus: 'verified-because-ua-said-so' },
    { ...baseline, queryParameterNames: ['x'.repeat(129)] },
  ];

  for (const candidate of cases) {
    assert.equal(validateBotEvent(candidate).ok, false);
  }
});

test('HMAC signature verification detects tampering in every signed component', async () => {
  const input = {
    siteId: runtimeConfig.siteId,
    timestamp: '1783900000',
    nonce: 'fixed_nonce_1234567890',
    body: JSON.stringify({ eventId: '018f57e1-a50f-7c74-8f9e-31083b6e20d0' }),
    secret: runtimeConfig.secret,
  };
  const signature = await signCollectorRequest(input);

  assert.match(signature, /^v1=[A-Za-z0-9_-]{43}$/);
  assert.equal(await verifyCollectorSignature({ ...input, signature }), true);

  const tamperedCases = [
    { ...input, body: `${input.body} `, signature },
    { ...input, siteId: `${input.siteId}-other`, signature },
    { ...input, timestamp: '1783900001', signature },
    { ...input, nonce: `${input.nonce}x`, signature },
    { ...input, secret: `${input.secret}x`, signature },
  ];
  for (const tampered of tamperedCases) {
    assert.equal(await verifyCollectorSignature(tampered), false);
  }

  assert.equal(await verifyCollectorSignature({ ...input, signature: signature.slice(3) }), false);
  assert.equal(await verifyCollectorSignature({ ...input, signature: 'v1=malformed' }), false);
});

test('SHA-256 body digest matches a stable known vector', async () => {
  assert.equal(
    await sha256Hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
});
