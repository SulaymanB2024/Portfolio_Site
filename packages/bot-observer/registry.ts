import type { BotPurpose } from './event-schema.js';

export const BOT_REGISTRY_VERSION = '2026-07-11';

export interface BotRegistryRule {
  ruleId: string;
  token: string;
  claimedBotId: string;
  claimedBotName: string;
  claimedOperator: string;
  purpose: BotPurpose;
  confidence: number;
  sourceUrl: string;
}

// More specific tokens must appear before their parent tokens. Google-Extended is
// intentionally absent: it is a robots control token, not a distinct HTTP UA.
export const BOT_REGISTRY: readonly BotRegistryRule[] = [
  {
    ruleId: 'ua_token:oai-searchbot', token: 'OAI-SearchBot', claimedBotId: 'openai-oai-searchbot',
    claimedBotName: 'OAI-SearchBot', claimedOperator: 'OpenAI', purpose: 'ai_search', confidence: 0.95,
    sourceUrl: 'https://developers.openai.com/api/docs/bots',
  },
  {
    ruleId: 'ua_token:oai-adsbot', token: 'OAI-AdsBot', claimedBotId: 'openai-oai-adsbot',
    claimedBotName: 'OAI-AdsBot', claimedOperator: 'OpenAI', purpose: 'generic_automation', confidence: 0.95,
    sourceUrl: 'https://developers.openai.com/api/docs/bots',
  },
  {
    ruleId: 'ua_token:chatgpt-user', token: 'ChatGPT-User', claimedBotId: 'openai-chatgpt-user',
    claimedBotName: 'ChatGPT-User', claimedOperator: 'OpenAI', purpose: 'user_agent_fetch', confidence: 0.95,
    sourceUrl: 'https://developers.openai.com/api/docs/bots',
  },
  {
    ruleId: 'ua_token:gptbot', token: 'GPTBot', claimedBotId: 'openai-gptbot',
    claimedBotName: 'GPTBot', claimedOperator: 'OpenAI', purpose: 'model_training', confidence: 0.95,
    sourceUrl: 'https://developers.openai.com/api/docs/bots',
  },
  {
    ruleId: 'ua_token:claude-searchbot', token: 'Claude-SearchBot', claimedBotId: 'anthropic-claude-searchbot',
    claimedBotName: 'Claude-SearchBot', claimedOperator: 'Anthropic', purpose: 'ai_search', confidence: 0.95,
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    ruleId: 'ua_token:claude-user', token: 'Claude-User', claimedBotId: 'anthropic-claude-user',
    claimedBotName: 'Claude-User', claimedOperator: 'Anthropic', purpose: 'user_agent_fetch', confidence: 0.95,
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    ruleId: 'ua_token:claudebot', token: 'ClaudeBot', claimedBotId: 'anthropic-claudebot',
    claimedBotName: 'ClaudeBot', claimedOperator: 'Anthropic', purpose: 'model_training', confidence: 0.95,
    sourceUrl: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    ruleId: 'ua_token:perplexity-user', token: 'Perplexity-User', claimedBotId: 'perplexity-user',
    claimedBotName: 'Perplexity-User', claimedOperator: 'Perplexity', purpose: 'user_agent_fetch', confidence: 0.95,
    sourceUrl: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  },
  {
    ruleId: 'ua_token:perplexitybot', token: 'PerplexityBot', claimedBotId: 'perplexity-bot',
    claimedBotName: 'PerplexityBot', claimedOperator: 'Perplexity', purpose: 'ai_search', confidence: 0.95,
    sourceUrl: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  },
  {
    ruleId: 'ua_token:google-inspection-tool', token: 'Google-InspectionTool', claimedBotId: 'google-inspection-tool',
    claimedBotName: 'Google-InspectionTool', claimedOperator: 'Google', purpose: 'performance_testing', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:google-cloudvertexbot', token: 'Google-CloudVertexBot', claimedBotId: 'google-cloudvertexbot',
    claimedBotName: 'Google-CloudVertexBot', claimedOperator: 'Google', purpose: 'user_agent_fetch', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googleother-image', token: 'GoogleOther-Image', claimedBotId: 'google-other-image',
    claimedBotName: 'GoogleOther-Image', claimedOperator: 'Google', purpose: 'generic_automation', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googleother-video', token: 'GoogleOther-Video', claimedBotId: 'google-other-video',
    claimedBotName: 'GoogleOther-Video', claimedOperator: 'Google', purpose: 'generic_automation', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googleother', token: 'GoogleOther', claimedBotId: 'google-other',
    claimedBotName: 'GoogleOther', claimedOperator: 'Google', purpose: 'generic_automation', confidence: 0.93,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googlebot-image', token: 'Googlebot-Image', claimedBotId: 'google-googlebot-image',
    claimedBotName: 'Googlebot-Image', claimedOperator: 'Google', purpose: 'traditional_search', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googlebot-video', token: 'Googlebot-Video', claimedBotId: 'google-googlebot-video',
    claimedBotName: 'Googlebot-Video', claimedOperator: 'Google', purpose: 'traditional_search', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:storebot-google', token: 'Storebot-Google', claimedBotId: 'google-storebot',
    claimedBotName: 'Storebot-Google', claimedOperator: 'Google', purpose: 'traditional_search', confidence: 0.95,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:googlebot', token: 'Googlebot', claimedBotId: 'google-googlebot',
    claimedBotName: 'Googlebot', claimedOperator: 'Google', purpose: 'traditional_search', confidence: 0.93,
    sourceUrl: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
  },
  {
    ruleId: 'ua_token:bingbot', token: 'bingbot', claimedBotId: 'microsoft-bingbot',
    claimedBotName: 'bingbot', claimedOperator: 'Microsoft', purpose: 'traditional_search', confidence: 0.92,
    sourceUrl: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0',
  },
  {
    ruleId: 'ua_token:applebot', token: 'Applebot', claimedBotId: 'apple-applebot',
    claimedBotName: 'Applebot', claimedOperator: 'Apple', purpose: 'traditional_search', confidence: 0.92,
    sourceUrl: 'https://support.apple.com/en-us/119829',
  },
  {
    ruleId: 'ua_token:ahrefsbot', token: 'AhrefsBot', claimedBotId: 'ahrefs-ahrefsbot',
    claimedBotName: 'AhrefsBot', claimedOperator: 'Ahrefs', purpose: 'seo_intelligence', confidence: 0.92,
    sourceUrl: 'https://ahrefs.com/robot',
  },
  {
    ruleId: 'ua_token:semrushbot', token: 'SemrushBot', claimedBotId: 'semrush-semrushbot',
    claimedBotName: 'SemrushBot', claimedOperator: 'Semrush', purpose: 'seo_intelligence', confidence: 0.92,
    sourceUrl: 'https://www.semrush.com/bot/',
  },
  {
    ruleId: 'ua_token:mj12bot', token: 'MJ12bot', claimedBotId: 'majestic-mj12bot',
    claimedBotName: 'MJ12bot', claimedOperator: 'Majestic', purpose: 'seo_intelligence', confidence: 0.9,
    sourceUrl: 'https://majestic.com/reports/majestic12',
  },
  {
    ruleId: 'ua_token:facebookexternalhit', token: 'facebookexternalhit', claimedBotId: 'meta-facebookexternalhit',
    claimedBotName: 'facebookexternalhit', claimedOperator: 'Meta', purpose: 'social_preview', confidence: 0.9,
    sourceUrl: 'https://developers.facebook.com/docs/sharing/webmasters/web-crawlers',
  },
  {
    ruleId: 'ua_token:twitterbot', token: 'Twitterbot', claimedBotId: 'x-twitterbot',
    claimedBotName: 'Twitterbot', claimedOperator: 'X', purpose: 'social_preview', confidence: 0.9,
    sourceUrl: 'https://developer.x.com/en/docs/x-for-websites/cards/guides/getting-started',
  },
  {
    ruleId: 'ua_token:linkedinbot', token: 'LinkedInBot', claimedBotId: 'linkedin-linkedinbot',
    claimedBotName: 'LinkedInBot', claimedOperator: 'LinkedIn', purpose: 'social_preview', confidence: 0.9,
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a521928',
  },
  {
    ruleId: 'ua_token:slackbot', token: 'Slackbot-LinkExpanding', claimedBotId: 'slack-link-expander',
    claimedBotName: 'Slackbot-LinkExpanding', claimedOperator: 'Slack', purpose: 'social_preview', confidence: 0.9,
    sourceUrl: 'https://api.slack.com/robots',
  },
  {
    ruleId: 'ua_token:discordbot', token: 'Discordbot', claimedBotId: 'discord-link-preview',
    claimedBotName: 'Discordbot', claimedOperator: 'Discord', purpose: 'social_preview', confidence: 0.88,
    sourceUrl: 'https://discord.com',
  },
  {
    ruleId: 'ua_token:uptimerobot', token: 'UptimeRobot', claimedBotId: 'uptimerobot-monitor',
    claimedBotName: 'UptimeRobot', claimedOperator: 'UptimeRobot', purpose: 'monitoring', confidence: 0.9,
    sourceUrl: 'https://uptimerobot.com',
  },
  {
    ruleId: 'ua_token:chrome-lighthouse', token: 'Chrome-Lighthouse', claimedBotId: 'google-lighthouse',
    claimedBotName: 'Chrome-Lighthouse', claimedOperator: 'Google', purpose: 'performance_testing', confidence: 0.92,
    sourceUrl: 'https://developer.chrome.com/docs/lighthouse',
  },
] as const;

export function matchRegistryRule(userAgent: string): BotRegistryRule | null {
  const normalized = userAgent.toLowerCase();
  return BOT_REGISTRY.find((rule) => normalized.includes(rule.token.toLowerCase())) ?? null;
}
