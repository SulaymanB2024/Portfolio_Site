import { isbot } from 'isbot';
import { CLASSIFIER_VERSION, type ClassificationResult } from './event-schema.js';
import { BOT_REGISTRY_VERSION, matchRegistryRule } from './registry.js';

const AUTOMATION_SIGNALS: ReadonlyArray<{ ruleId: string; pattern: RegExp }> = [
  { ruleId: 'signal:headless-chrome', pattern: /headlesschrome/i },
  { ruleId: 'signal:python-requests', pattern: /python-requests/i },
  { ruleId: 'signal:python-urllib', pattern: /python-urllib/i },
  { ruleId: 'signal:curl', pattern: /(?:^|\s)curl\//i },
  { ruleId: 'signal:wget', pattern: /wget\//i },
  { ruleId: 'signal:go-http-client', pattern: /go-http-client/i },
  { ruleId: 'signal:httpx', pattern: /(?:^|\s)httpx\//i },
  { ruleId: 'signal:playwright', pattern: /playwright/i },
];

export function classifyUserAgent(userAgentInput: string | null | undefined): ClassificationResult {
  const userAgent = (userAgentInput ?? '').trim();
  const registryRule = matchRegistryRule(userAgent);

  if (registryRule) {
    return {
      observedClass: 'self_identified_bot',
      claimedBotId: registryRule.claimedBotId,
      claimedBotName: registryRule.claimedBotName,
      claimedOperator: registryRule.claimedOperator,
      purpose: registryRule.purpose,
      confidence: registryRule.confidence,
      verificationStatus: 'unverified',
      matchedRuleIds: [registryRule.ruleId],
      classifierVersion: CLASSIFIER_VERSION,
      registryVersion: BOT_REGISTRY_VERSION,
    };
  }

  if (userAgent.length === 0) {
    return {
      observedClass: 'suspected_automation',
      claimedBotId: null,
      claimedBotName: null,
      claimedOperator: null,
      purpose: 'generic_automation',
      confidence: 0.72,
      verificationStatus: 'unverified',
      matchedRuleIds: ['signal:missing-user-agent'],
      classifierVersion: CLASSIFIER_VERSION,
      registryVersion: BOT_REGISTRY_VERSION,
    };
  }

  const automationMatches = AUTOMATION_SIGNALS.filter(({ pattern }) => pattern.test(userAgent));
  if (automationMatches.length > 0) {
    return {
      observedClass: 'suspected_automation',
      claimedBotId: null,
      claimedBotName: null,
      claimedOperator: null,
      purpose: 'generic_automation',
      confidence: 0.76,
      verificationStatus: 'unverified',
      matchedRuleIds: automationMatches.map(({ ruleId }) => ruleId),
      classifierVersion: CLASSIFIER_VERSION,
      registryVersion: BOT_REGISTRY_VERSION,
    };
  }

  if (isbot(userAgent)) {
    return {
      observedClass: 'self_identified_bot',
      claimedBotId: null,
      claimedBotName: null,
      claimedOperator: null,
      purpose: 'unknown',
      confidence: 0.62,
      verificationStatus: 'unverified',
      matchedRuleIds: ['fallback:isbot'],
      classifierVersion: CLASSIFIER_VERSION,
      registryVersion: BOT_REGISTRY_VERSION,
    };
  }

  return {
    observedClass: 'ordinary_browser',
    claimedBotId: null,
    claimedBotName: null,
    claimedOperator: null,
    purpose: 'unknown',
    confidence: 0.7,
    verificationStatus: 'unverified',
    matchedRuleIds: [],
    classifierVersion: CLASSIFIER_VERSION,
    registryVersion: BOT_REGISTRY_VERSION,
  };
}
