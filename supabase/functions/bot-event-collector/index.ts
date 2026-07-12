import postgres from 'npm:postgres@3.4.9';
import { validateBotEvent, type BotEvent } from '../../../packages/bot-observer/event-schema.ts';
import { sha256Hex, verifyCollectorSignature } from '../../../packages/bot-observer/signer.ts';

const COLLECTOR_VERSION = '2026-07-12.1';
const MAX_BODY_BYTES = 32_768;
const MAX_CLOCK_SKEW_SECONDS = 300;
const SITE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,63}$/u;
const NONCE_PATTERN = /^[A-Za-z0-9_-]{16,128}$/u;
const SIGNATURE_PATTERN = /^v1=([A-Za-z0-9_-]{40,128})$/u;

interface SiteCredential {
  secret: string;
  allowedHosts: string[];
  enabled?: boolean;
}

interface CredentialRow {
  secret: string;
  allowed_hosts: string[];
  enabled: boolean;
}

type CredentialMap = Record<string, SiteCredential>;

class BodyTooLargeError extends Error {}
class ReplayError extends Error {}

let databaseClient: ReturnType<typeof postgres> | null = null;

function jsonResponse(status: number, code: string): Response {
  return Response.json(
    { error: code },
    {
      status,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
      },
    },
  );
}

function loadEnvironmentCredentials(): CredentialMap | null {
  const raw = Deno.env.get('BOT_OBSERVER_SITE_CREDENTIALS');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;

    for (const [siteId, candidate] of Object.entries(parsed as Record<string, unknown>)) {
      if (!SITE_ID_PATTERN.test(siteId) || typeof candidate !== 'object' || candidate === null || Array.isArray(candidate)) {
        return null;
      }
      const credential = candidate as Record<string, unknown>;
      if (typeof credential.secret !== 'string' || credential.secret.length < 32) return null;
      if (!Array.isArray(credential.allowedHosts) || !credential.allowedHosts.every((host) => typeof host === 'string')) {
        return null;
      }
      if (credential.enabled !== undefined && typeof credential.enabled !== 'boolean') return null;
    }

    return parsed as CredentialMap;
  } catch {
    return null;
  }
}

function getDatabaseClient(): ReturnType<typeof postgres> | null {
  if (databaseClient) return databaseClient;
  const databaseUrl = Deno.env.get('SUPABASE_DB_URL');
  if (!databaseUrl) return null;
  databaseClient = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 5,
    idle_timeout: 20,
  });
  return databaseClient;
}

async function loadSiteCredential(siteId: string): Promise<SiteCredential | null> {
  const environmentCredential = loadEnvironmentCredentials()?.[siteId];
  if (environmentCredential) return environmentCredential;

  const sql = getDatabaseClient();
  if (!sql) return null;

  const rows = await sql<CredentialRow[]>`
    select
      secret.decrypted_secret as secret,
      site.allowed_hosts,
      site.enabled
    from bot_internal.sites as site
    join vault.decrypted_secrets as secret
      on secret.id = site.hmac_secret_id
    where site.site_id = ${siteId}
    limit 1
  `;
  const credential = rows[0];
  if (
    !credential ||
    typeof credential.secret !== 'string' ||
    credential.secret.length < 32 ||
    !Array.isArray(credential.allowed_hosts) ||
    !credential.allowed_hosts.every((host) => typeof host === 'string')
  ) {
    return null;
  }

  return {
    secret: credential.secret,
    allowedHosts: credential.allowed_hosts,
    enabled: credential.enabled,
  };
}

function hostAllowed(host: string, allowedHosts: string[]): boolean {
  const normalizedHost = host.toLowerCase();
  return allowedHosts.some((allowedHost) => {
    const normalizedAllowed = allowedHost.toLowerCase();
    if (normalizedAllowed.startsWith('*.')) {
      const suffix = normalizedAllowed.slice(1);
      return normalizedHost.endsWith(suffix) && normalizedHost.length > suffix.length;
    }
    return normalizedHost === normalizedAllowed;
  });
}

async function readBodyWithLimit(request: Request): Promise<string> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) throw new BodyTooLargeError();
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalLength += value.byteLength;
    if (totalLength > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(combined);
}

async function insertEvent(event: BotEvent, nonceHash: string): Promise<void> {
  const sql = getDatabaseClient();
  if (!sql) throw new Error('database_unavailable');

  await sql.begin(async (transaction) => {
    const nonceRows = await transaction`
      insert into bot_internal.ingest_nonces (site_id, nonce_hash)
      values (${event.siteId}, ${nonceHash})
      on conflict do nothing
      returning nonce_hash
    `;
    if (nonceRows.length === 0) throw new ReplayError();

    await transaction`
      insert into bot_internal.bot_events (
        event_id, occurred_at, site_id, environment, deployment_id, commit_sha,
        host, path, route_class, method, query_parameter_names,
        redacted_referrer_origin, user_agent, observed_class, claimed_bot_id,
        claimed_bot_name, claimed_operator, purpose, confidence, matched_rule_ids,
        classifier_version, registry_version, verification_status,
        verification_method, verified_at, country, region, asn, ip_hash_rotating,
        ja3_digest, ja4_digest, signature_present, signature_agent,
        signature_key_id, signature_verification_status, signature_verified_at, event_schema_version,
        collector_version
      ) values (
        ${event.eventId}::uuid, ${event.occurredAt}::timestamptz, ${event.siteId},
        ${event.environment}, ${event.deploymentId}, ${event.commitSha},
        ${event.host}, ${event.path}, ${event.routeClass}, ${event.method},
        ${transaction.array(event.queryParameterNames, 25)}::text[],
        ${event.redactedReferrerOrigin}, ${event.userAgent}, ${event.observedClass},
        ${event.claimedBotId}, ${event.claimedBotName}, ${event.claimedOperator},
        ${event.purpose}, ${event.confidence},
        ${transaction.array(event.matchedRuleIds, 25)}::text[],
        ${event.classifierVersion}, ${event.registryVersion}, ${event.verificationStatus},
        ${event.verificationMethod}, ${event.verifiedAt}::timestamptz, ${event.country},
        ${event.region}, ${event.asn}, ${event.ipHashRotating}, ${event.ja3Digest},
        ${event.ja4Digest}, ${event.signaturePresent}, ${event.signatureAgent},
        ${event.signatureKeyId}, ${event.signatureVerificationStatus},
        ${event.signatureVerifiedAt}::timestamptz, ${event.eventSchemaVersion}, ${COLLECTOR_VERSION}
      )
    `;
  });
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return jsonResponse(405, 'method_not_allowed');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse(415, 'unsupported_media_type');
  }

  const siteId = request.headers.get('x-bot-log-site-id') ?? '';
  const timestamp = request.headers.get('x-bot-log-timestamp') ?? '';
  const nonce = request.headers.get('x-bot-log-nonce') ?? '';
  const signatureHeader = request.headers.get('x-bot-log-signature') ?? '';
  const signatureMatch = signatureHeader.match(SIGNATURE_PATTERN);
  if (!SITE_ID_PATTERN.test(siteId)) {
    return jsonResponse(401, 'invalid_signature');
  }
  if (!/^\d{10}$/u.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) {
    return jsonResponse(401, 'stale_request');
  }
  if (!NONCE_PATTERN.test(nonce) || !signatureMatch) return jsonResponse(401, 'invalid_signature');

  let credential: SiteCredential | null;
  try {
    credential = await loadSiteCredential(siteId);
  } catch {
    console.error('[bot-observer] collector credential lookup failed');
    return jsonResponse(503, 'collector_unavailable');
  }
  if (!credential) return jsonResponse(503, 'collector_not_configured');
  if (credential.enabled === false) return jsonResponse(401, 'invalid_signature');

  let body: string;
  try {
    body = await readBodyWithLimit(request);
  } catch (error) {
    if (error instanceof BodyTooLargeError) return jsonResponse(413, 'payload_too_large');
    return jsonResponse(400, 'invalid_body');
  }

  const signatureValid = await verifyCollectorSignature({
    secret: credential.secret,
    siteId,
    timestamp,
    nonce,
    body,
    signature: signatureHeader,
  });
  if (!signatureValid) return jsonResponse(401, 'invalid_signature');

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(body);
  } catch {
    return jsonResponse(400, 'invalid_json');
  }

  const validation = validateBotEvent(parsedBody);
  if (!validation.ok) return jsonResponse(422, 'invalid_event');
  const event = validation.event;
  if (event.siteId !== siteId || !hostAllowed(event.host, credential.allowedHosts)) {
    return jsonResponse(403, 'site_mismatch');
  }
  if (Math.abs(Date.parse(event.occurredAt) / 1000 - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) {
    return jsonResponse(422, 'invalid_event_time');
  }

  try {
    const nonceHash = await sha256Hex(`${siteId}.${nonce}`);
    await insertEvent(event, nonceHash);
    return new Response(null, {
      status: 202,
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    const databaseCode = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '';
    if (error instanceof ReplayError || databaseCode === '23505') return jsonResponse(409, 'replay_rejected');
    console.error('[bot-observer] collector database insert failed');
    return jsonResponse(503, 'collector_unavailable');
  }
});
