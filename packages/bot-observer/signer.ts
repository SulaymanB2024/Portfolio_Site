const encoder = new TextEncoder();

interface SignatureInput {
  siteId: string;
  timestamp: string;
  nonce: string;
  body: string;
  secret: string;
}

interface VerificationInput extends SignatureInput {
  signature: string;
}

export interface SignedDeliveryConfig {
  collectorUrl: string;
  siteId: string;
  secret: string;
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) return null;
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(44, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage,
  );
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return toHex(new Uint8Array(digest));
}

export async function collectorSigningInput(
  siteId: string,
  timestamp: string,
  nonce: string,
  body: string,
): Promise<string> {
  return `${siteId}.${timestamp}.${nonce}.${await sha256Hex(body)}`;
}

export async function signCollectorRequest(input: SignatureInput): Promise<string> {
  const key = await hmacKey(input.secret, ['sign']);
  const message = await collectorSigningInput(input.siteId, input.timestamp, input.nonce, input.body);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return `v1=${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyCollectorSignature(input: VerificationInput): Promise<boolean> {
  if (!input.signature.startsWith('v1=')) return false;
  const signature = fromBase64Url(input.signature.slice(3));
  if (!signature) return false;
  const key = await hmacKey(input.secret, ['verify']);
  const message = await collectorSigningInput(input.siteId, input.timestamp, input.nonce, input.body);
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(message));
}

export async function sendSignedEvent(event: unknown, config: SignedDeliveryConfig): Promise<number> {
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const signature = await signCollectorRequest({
    siteId: config.siteId,
    timestamp,
    nonce,
    body,
    secret: config.secret,
  });

  const response = await fetch(config.collectorUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-bot-log-site-id': config.siteId,
      'x-bot-log-timestamp': timestamp,
      'x-bot-log-nonce': nonce,
      'x-bot-log-signature': signature,
    },
    body,
    signal: AbortSignal.timeout(3_000),
  });
  return response.status;
}
