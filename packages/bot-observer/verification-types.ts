import type { SignatureVerificationStatus, VerificationStatus } from './event-schema.js';

export type VerificationMethod =
  | 'published_ip_range'
  | 'reverse_dns'
  | 'web_bot_auth'
  | 'manual_review';

export interface BotVerificationResult {
  eventId: string;
  status: VerificationStatus;
  method: VerificationMethod;
  checkedAt: string;
  expiresAt: string | null;
  evidenceReference: string | null;
}

export interface SignedBotIdentityResult {
  present: boolean;
  agent: string | null;
  keyId: string | null;
  status: SignatureVerificationStatus;
  verifiedAt: string | null;
}
