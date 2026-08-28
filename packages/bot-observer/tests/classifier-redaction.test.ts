import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyUserAgent } from '../classifier.ts';
import {
  extractQueryParameterNames,
  redactPath,
  redactReferrerOrigin,
  redactSensitiveText,
} from '../redact.ts';

test('a spoofable registry token stays a claimed, unverified identity', () => {
  const result = classifyUserAgent(
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  );

  assert.equal(result.observedClass, 'self_identified_bot');
  assert.equal(result.claimedBotId, 'google-googlebot');
  assert.equal(result.claimedOperator, 'Google');
  assert.equal(result.purpose, 'traditional_search');
  assert.equal(result.verificationStatus, 'unverified');
  assert.deepEqual(result.matchedRuleIds, ['ua_token:googlebot']);
});

test('missing and malformed user agents do not acquire an operator identity', () => {
  for (const userAgent of [null, undefined, '', '   ']) {
    const result = classifyUserAgent(userAgent);
    assert.equal(result.observedClass, 'suspected_automation');
    assert.equal(result.claimedBotId, null);
    assert.equal(result.claimedOperator, null);
    assert.equal(result.purpose, 'generic_automation');
    assert.equal(result.verificationStatus, 'unverified');
    assert.deepEqual(result.matchedRuleIds, ['signal:missing-user-agent']);
  }
});

test('OpenAI actors remain separated by purpose', () => {
  const cases = [
    ['OAI-SearchBot/1.0', 'openai-oai-searchbot', 'ai_search'],
    ['GPTBot/1.2', 'openai-gptbot', 'model_training'],
    ['ChatGPT-User/1.0', 'openai-chatgpt-user', 'user_agent_fetch'],
  ] as const;

  for (const [userAgent, expectedId, expectedPurpose] of cases) {
    const result = classifyUserAgent(userAgent);
    assert.equal(result.claimedOperator, 'OpenAI');
    assert.equal(result.claimedBotId, expectedId);
    assert.equal(result.purpose, expectedPurpose);
    assert.equal(result.verificationStatus, 'unverified');
  }
});

test('Anthropic actors remain separated by purpose', () => {
  const cases = [
    ['Claude-SearchBot/1.0', 'anthropic-claude-searchbot', 'ai_search'],
    ['ClaudeBot/1.0', 'anthropic-claudebot', 'model_training'],
    ['Claude-User/1.0', 'anthropic-claude-user', 'user_agent_fetch'],
  ] as const;

  for (const [userAgent, expectedId, expectedPurpose] of cases) {
    const result = classifyUserAgent(userAgent);
    assert.equal(result.claimedOperator, 'Anthropic');
    assert.equal(result.claimedBotId, expectedId);
    assert.equal(result.purpose, expectedPurpose);
  }
});

test('isbot fallback identifies only self-declared bot behavior', () => {
  const result = classifyUserAgent(
    'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
  );

  assert.equal(result.observedClass, 'self_identified_bot');
  assert.equal(result.claimedBotId, null);
  assert.equal(result.claimedBotName, null);
  assert.equal(result.claimedOperator, null);
  assert.equal(result.purpose, 'unknown');
  assert.equal(result.verificationStatus, 'unverified');
  assert.deepEqual(result.matchedRuleIds, ['fallback:isbot']);
});

test('an ordinary browser remains ordinary and unclaimed', () => {
  const result = classifyUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
      + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36',
  );

  assert.equal(result.observedClass, 'ordinary_browser');
  assert.equal(result.claimedBotId, null);
  assert.equal(result.claimedOperator, null);
  assert.equal(result.purpose, 'unknown');
  assert.equal(result.verificationStatus, 'unverified');
});

test('automation-shaped clients are suspected without claiming an operator', () => {
  const result = classifyUserAgent('python-requests/2.32.4');

  assert.equal(result.observedClass, 'suspected_automation');
  assert.equal(result.claimedBotId, null);
  assert.equal(result.claimedOperator, null);
  assert.equal(result.purpose, 'generic_automation');
  assert.deepEqual(result.matchedRuleIds, ['signal:python-requests']);
});

test('query redaction retains bounded, sorted names and drops every value', () => {
  const longName = 'n'.repeat(140);
  const url = new URL(
    `https://sulayman-bowles.dev/research?email=person%40example.com`
      + `&token=secret-value&email=duplicate&${longName}=private`,
  );

  const names = extractQueryParameterNames(url);

  assert.deepEqual(names, [':token', 'email', 'token']);
  assert.equal(JSON.stringify(names).includes('person@example.com'), false);
  assert.equal(JSON.stringify(names).includes('secret-value'), false);
  assert.equal(JSON.stringify(names).includes('duplicate'), false);
});

test('referrer redaction keeps only a normalized origin', () => {
  assert.equal(
    redactReferrerOrigin(
      'https://user:password@Example.com/private/path?email=person@example.com#fragment',
    ),
    'https://example.com',
  );
  assert.equal(redactReferrerOrigin('not a URL'), null);
  assert.equal(redactReferrerOrigin('javascript:alert(1)'), null);
  assert.equal(redactReferrerOrigin(null), null);
});

test('path and user-agent redaction remove embedded identifiers', () => {
  assert.equal(
    redactPath('/people/person@example.com/550e8400-e29b-41d4-a716-446655440000/123456789'),
    '/people/:email/:id/:id',
  );
  assert.equal(
    redactSensitiveText(`ResearchBot contact=person@example.com token=${'a'.repeat(60)}`, 1024),
    'ResearchBot contact=:email token=:token',
  );
});
