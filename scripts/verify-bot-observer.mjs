#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const failures = [];
const passes = [];

function pass(message) {
  passes.push(message);
}

function fail(message) {
  failures.push(message);
}

function requireFile(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`missing required file: ${relativePath}`);
    return '';
  }

  pass(`found ${relativePath}`);
  return readFileSync(absolutePath, 'utf8');
}

function requirePattern(source, pattern, message) {
  if (pattern.test(source)) {
    pass(message);
  } else {
    fail(message);
  }
}

function forbidPattern(source, pattern, message) {
  if (pattern.test(source)) {
    fail(message);
  } else {
    pass(message);
  }
}

const sharedFiles = [
  'packages/bot-observer/classifier.ts',
  'packages/bot-observer/registry.ts',
  'packages/bot-observer/redact.ts',
  'packages/bot-observer/event-schema.ts',
  'packages/bot-observer/signer.ts',
  'packages/bot-observer/middleware-adapter.ts',
  'packages/bot-observer/verification-types.ts',
];

const sharedSources = new Map(
  sharedFiles.map((relativePath) => [relativePath, requireFile(relativePath)]),
);

const classifier = sharedSources.get('packages/bot-observer/classifier.ts') ?? '';
const registry = sharedSources.get('packages/bot-observer/registry.ts') ?? '';
const eventSchema = sharedSources.get('packages/bot-observer/event-schema.ts') ?? '';
const signer = sharedSources.get('packages/bot-observer/signer.ts') ?? '';
const middlewareAdapter =
  sharedSources.get('packages/bot-observer/middleware-adapter.ts') ?? '';

requirePattern(classifier, /from\s+['"]isbot['"]/, 'classifier uses isbot only as a fallback');
requirePattern(
  `${classifier}\n${registry}`,
  /registryVersion|REGISTRY_VERSION/,
  'classifier or registry carries an explicit registry version',
);
forbidPattern(
  `${classifier}\n${registry}`,
  /\bfetch\s*\(/,
  'classifier and registry perform no request-path network lookup',
);
requirePattern(
  eventSchema,
  /unknown|strict|allowed/i,
  'event schema contains an explicit unknown-field policy',
);
requirePattern(
  eventSchema,
  /eventSchemaVersion/,
  'event schema matches the deployed eventSchemaVersion wire contract',
);
forbidPattern(
  eventSchema,
  /collectorVersion\s*:/,
  'collector version cannot be supplied by the requester',
);
requirePattern(
  middlewareAdapter,
  /GET[\s\S]*HEAD|HEAD[\s\S]*GET/,
  'route adapter explicitly bounds observation to GET and HEAD',
);
requirePattern(
  middlewareAdapter,
  /_next|assets|api/,
  'route adapter explicitly excludes framework assets and API routes',
);

const middleware = requireFile('middleware.ts');
const middlewareContract = `${middleware}\n${middlewareAdapter}`;
requirePattern(middleware, /waitUntil\s*\(/, 'middleware dispatches collector delivery with waitUntil');
requirePattern(
  middlewareContract,
  /BOT_OBSERVER_ENABLED/,
  'middleware requires an explicit server-side enable flag',
);
requirePattern(
  middlewareContract,
  /BOT_OBSERVER_COLLECTOR_URL/,
  'middleware reads the collector URL from server environment',
);
requirePattern(
  middlewareContract,
  /BOT_OBSERVER_SITE_ID/,
  'middleware reads the site ID from server environment',
);
requirePattern(
  middlewareContract,
  /BOT_OBSERVER_HMAC_SECRET/,
  'middleware reads the HMAC secret from server environment',
);
forbidPattern(
  middleware,
  /authorization\s*[:=]|cookie\s*[:=]/i,
  'middleware does not construct Authorization or Cookie event fields',
);

const vercelConfigSource = requireFile('vercel.json');
try {
  const vercelConfig = JSON.parse(vercelConfigSource);
  if (vercelConfig.framework === 'vite' && vercelConfig.outputDirectory === 'dist') {
    pass('Vercel uses the current Vite build path required for Routing Middleware');
  } else {
    fail('Vercel must use framework=vite and outputDirectory=dist');
  }
  if ('builds' in vercelConfig) {
    fail('Vercel legacy builds configuration must stay removed so Routing Middleware is emitted');
  } else {
    pass('Vercel legacy builds configuration is absent');
  }
} catch {
  fail('vercel.json must contain valid JSON');
}

const collector = requireFile('supabase/functions/bot-event-collector/index.ts');
for (const header of [
  'x-bot-log-site-id',
  'x-bot-log-timestamp',
  'x-bot-log-nonce',
  'x-bot-log-signature',
]) {
  requirePattern(collector, new RegExp(header, 'i'), `collector checks ${header}`);
}
requirePattern(
  collector,
  /BOT_OBSERVER_SITE_CREDENTIALS/,
  'collector preserves the environment credential fallback',
);
requirePattern(
  collector,
  /vault\.decrypted_secrets/,
  'collector loads hosted per-site HMAC credentials from Supabase Vault',
);
requirePattern(collector, /SUPABASE_DB_URL/, 'collector uses a server-side database URL');
requirePattern(
  collector,
  /32_768|32768/,
  'collector enforces the deployed 32 KiB request-body ceiling',
);
requirePattern(
  collector,
  /allowedHosts|allowed_hosts/,
  'collector validates the event host against site configuration',
);
requirePattern(
  collector,
  /transaction\.array/,
  'collector encodes text arrays with the native Postgres array parameter type',
);
forbidPattern(
  collector,
  /jsonb_array_elements_text/,
  'collector does not double-encode text arrays as scalar JSON',
);
requirePattern(
  `${collector}\n${signer}`,
  /timingSafeEqual|subtle\.verify|constant/i,
  'collector delegates to constant-time cryptographic HMAC verification',
);

const migrationsDirectory = resolve(root, 'supabase/migrations');
let migration = '';
if (!existsSync(migrationsDirectory)) {
  fail('missing required directory: supabase/migrations');
} else {
  const migrationNames = readdirSync(migrationsDirectory)
    .filter((name) => name.endsWith('.sql'))
    .sort();
  const requiredMigrationNames = [
    '20260711221900_bot_observer_initial.sql',
    '20260711222043_bot_observer_advisor_hardening.sql',
    '20260712193843_bot_observer_vault_credentials.sql',
  ];
  const invalidMigrationNames = migrationNames.filter(
    (name) => !/^\d{14}_[a-z0-9_]+\.sql$/.test(name),
  );
  const migrationVersions = migrationNames.map((name) => name.slice(0, 14));
  const duplicateVersions = migrationVersions.filter(
    (version, index) => migrationVersions.indexOf(version) !== index,
  );
  const requiredMigrationIndexes = requiredMigrationNames.map((name) =>
    migrationNames.indexOf(name),
  );
  const hasRequiredMigrations = requiredMigrationIndexes.every((index) => index >= 0);
  const requiredMigrationsAreOrdered = requiredMigrationIndexes.every(
    (index, position) => position === 0 || index > requiredMigrationIndexes[position - 1],
  );

  if (
    invalidMigrationNames.length > 0 ||
    duplicateVersions.length > 0 ||
    !hasRequiredMigrations ||
    !requiredMigrationsAreOrdered
  ) {
    fail(`invalid migration ledger: ${migrationNames.join(', ')}`);
  } else {
    pass('migration ledger preserves the required baseline and valid additive migrations');
  }

  migration = migrationNames
    .map((name) => readFileSync(resolve(migrationsDirectory, name), 'utf8'))
    .join('\n');
}

for (const objectName of [
  'bot_internal',
  'sites',
  'important_pages',
  'bot_events',
  'ingest_nonces',
  'bot_verifications',
  'bot_registry',
  'daily_bot_rollups',
  'bot_activity_daily',
  'bot_activity_by_operator',
  'bot_activity_by_purpose',
  'top_bot_requested_pages',
  'refresh_daily_bot_rollups',
  'enforce_retention',
  'hmac_secret_id',
]) {
  requirePattern(migration, new RegExp(`\\b${objectName}\\b`, 'i'), `migration defines ${objectName}`);
}
requirePattern(
  migration,
  /revoke\s+all[\s\S]*(anon|authenticated)|(anon|authenticated)[\s\S]*revoke\s+all/i,
  'migration explicitly revokes public API roles',
);
requirePattern(
  migration,
  /nonce_hash/i,
  'migration stores a nonce hash rather than a reusable raw nonce',
);
forbidPattern(
  migration,
  /grant\s+[^;]*(anon|authenticated)/i,
  'migration never grants private observer objects to anon or authenticated',
);

const supabaseConfig = requireFile('supabase/config.toml');
forbidPattern(
  supabaseConfig.match(/schemas\s*=\s*\[[^\]]*\]/)?.[0] ?? '',
  /bot_internal/,
  'bot_internal is absent from Supabase Data API schemas',
);

console.log(`bot-observer structural verification: ${passes.length} passed, ${failures.length} failed`);
for (const message of passes) {
  console.log(`PASS ${message}`);
}
for (const message of failures) {
  console.error(`FAIL ${message}`);
}

if (failures.length > 0) {
  process.exitCode = 1;
}
