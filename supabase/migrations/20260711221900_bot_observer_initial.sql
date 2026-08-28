create extension if not exists pg_cron;

create schema if not exists bot_internal;
comment on schema bot_internal is 'Private bot observation events, verification state, and reporting views.';

revoke all on schema bot_internal from public, anon, authenticated;
alter default privileges in schema bot_internal revoke all on tables from public, anon, authenticated;
alter default privileges in schema bot_internal revoke all on sequences from public, anon, authenticated;
alter default privileges in schema bot_internal revoke all on functions from public, anon, authenticated;

create table bot_internal.sites (
  site_id text primary key check (site_id ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  display_name text not null check (char_length(display_name) between 1 and 128),
  allowed_hosts text[] not null default '{}'::text[],
  enabled boolean not null default true,
  credential_version integer not null default 1 check (credential_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into bot_internal.sites (site_id, display_name, allowed_hosts)
values (
  'sulayman-bowles-dev',
  'sulayman-bowles.dev',
  array['sulayman-bowles.dev', 'www.sulayman-bowles.dev', '*.vercel.app']
)
on conflict (site_id) do update
set display_name = excluded.display_name,
    allowed_hosts = excluded.allowed_hosts,
    updated_at = now();

create table bot_internal.important_pages (
  site_id text not null references bot_internal.sites(site_id) on delete cascade,
  path text not null check (path like '/%' and char_length(path) <= 2048),
  label text not null check (char_length(label) between 1 and 128),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (site_id, path)
);

insert into bot_internal.important_pages (site_id, path, label)
values
  ('sulayman-bowles-dev', '/', 'Home'),
  ('sulayman-bowles-dev', '/ai-information', 'AI information'),
  ('sulayman-bowles-dev', '/research', 'Research'),
  ('sulayman-bowles-dev', '/atlas', 'Atlas'),
  ('sulayman-bowles-dev', '/atlas/sample-crawl', 'Atlas sample crawl'),
  ('sulayman-bowles-dev', '/austin-technical-seo', 'Austin technical SEO'),
  ('sulayman-bowles-dev', '/contact', 'Contact'),
  ('sulayman-bowles-dev', '/robots.txt', 'Robots'),
  ('sulayman-bowles-dev', '/sitemap.xml', 'Sitemap'),
  ('sulayman-bowles-dev', '/llms.txt', 'LLMs')
on conflict (site_id, path) do update
set label = excluded.label,
    active = true;

create table bot_internal.bot_registry (
  registry_version text not null check (char_length(registry_version) between 1 and 64),
  rule_id text not null check (char_length(rule_id) between 1 and 128),
  ua_token text not null check (char_length(ua_token) between 1 and 256),
  claimed_bot_id text not null check (char_length(claimed_bot_id) between 1 and 128),
  claimed_bot_name text not null check (char_length(claimed_bot_name) between 1 and 128),
  claimed_operator text not null check (char_length(claimed_operator) between 1 and 128),
  purpose text not null check (purpose in (
    'traditional_search', 'ai_search', 'model_training', 'user_agent_fetch',
    'seo_intelligence', 'social_preview', 'monitoring', 'security_scanning',
    'performance_testing', 'generic_automation', 'unknown'
  )),
  confidence numeric(4, 3) not null check (confidence between 0 and 1),
  source_url text not null check (source_url like 'https://%' and char_length(source_url) <= 1024),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (registry_version, rule_id)
);

insert into bot_internal.bot_registry (
  registry_version, rule_id, ua_token, claimed_bot_id, claimed_bot_name,
  claimed_operator, purpose, confidence, source_url
)
values
  ('2026-07-11', 'ua_token:oai-searchbot', 'OAI-SearchBot', 'openai-oai-searchbot', 'OAI-SearchBot', 'OpenAI', 'ai_search', 0.95, 'https://developers.openai.com/api/docs/bots'),
  ('2026-07-11', 'ua_token:oai-adsbot', 'OAI-AdsBot', 'openai-oai-adsbot', 'OAI-AdsBot', 'OpenAI', 'generic_automation', 0.95, 'https://developers.openai.com/api/docs/bots'),
  ('2026-07-11', 'ua_token:chatgpt-user', 'ChatGPT-User', 'openai-chatgpt-user', 'ChatGPT-User', 'OpenAI', 'user_agent_fetch', 0.95, 'https://developers.openai.com/api/docs/bots'),
  ('2026-07-11', 'ua_token:gptbot', 'GPTBot', 'openai-gptbot', 'GPTBot', 'OpenAI', 'model_training', 0.95, 'https://developers.openai.com/api/docs/bots'),
  ('2026-07-11', 'ua_token:claude-searchbot', 'Claude-SearchBot', 'anthropic-claude-searchbot', 'Claude-SearchBot', 'Anthropic', 'ai_search', 0.95, 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler'),
  ('2026-07-11', 'ua_token:claude-user', 'Claude-User', 'anthropic-claude-user', 'Claude-User', 'Anthropic', 'user_agent_fetch', 0.95, 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler'),
  ('2026-07-11', 'ua_token:claudebot', 'ClaudeBot', 'anthropic-claudebot', 'ClaudeBot', 'Anthropic', 'model_training', 0.95, 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler'),
  ('2026-07-11', 'ua_token:perplexity-user', 'Perplexity-User', 'perplexity-user', 'Perplexity-User', 'Perplexity', 'user_agent_fetch', 0.95, 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers'),
  ('2026-07-11', 'ua_token:perplexitybot', 'PerplexityBot', 'perplexity-bot', 'PerplexityBot', 'Perplexity', 'ai_search', 0.95, 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers'),
  ('2026-07-11', 'ua_token:google-inspection-tool', 'Google-InspectionTool', 'google-inspection-tool', 'Google-InspectionTool', 'Google', 'performance_testing', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:google-cloudvertexbot', 'Google-CloudVertexBot', 'google-cloudvertexbot', 'Google-CloudVertexBot', 'Google', 'user_agent_fetch', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googleother-image', 'GoogleOther-Image', 'google-other-image', 'GoogleOther-Image', 'Google', 'generic_automation', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googleother-video', 'GoogleOther-Video', 'google-other-video', 'GoogleOther-Video', 'Google', 'generic_automation', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googleother', 'GoogleOther', 'google-other', 'GoogleOther', 'Google', 'generic_automation', 0.93, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googlebot-image', 'Googlebot-Image', 'google-googlebot-image', 'Googlebot-Image', 'Google', 'traditional_search', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googlebot-video', 'Googlebot-Video', 'google-googlebot-video', 'Googlebot-Video', 'Google', 'traditional_search', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:storebot-google', 'Storebot-Google', 'google-storebot', 'Storebot-Google', 'Google', 'traditional_search', 0.95, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:googlebot', 'Googlebot', 'google-googlebot', 'Googlebot', 'Google', 'traditional_search', 0.93, 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers'),
  ('2026-07-11', 'ua_token:bingbot', 'bingbot', 'microsoft-bingbot', 'bingbot', 'Microsoft', 'traditional_search', 0.92, 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0'),
  ('2026-07-11', 'ua_token:applebot', 'Applebot', 'apple-applebot', 'Applebot', 'Apple', 'traditional_search', 0.92, 'https://support.apple.com/en-us/119829'),
  ('2026-07-11', 'ua_token:ahrefsbot', 'AhrefsBot', 'ahrefs-ahrefsbot', 'AhrefsBot', 'Ahrefs', 'seo_intelligence', 0.92, 'https://ahrefs.com/robot'),
  ('2026-07-11', 'ua_token:semrushbot', 'SemrushBot', 'semrush-semrushbot', 'SemrushBot', 'Semrush', 'seo_intelligence', 0.92, 'https://www.semrush.com/bot/'),
  ('2026-07-11', 'ua_token:mj12bot', 'MJ12bot', 'majestic-mj12bot', 'MJ12bot', 'Majestic', 'seo_intelligence', 0.90, 'https://majestic.com/reports/majestic12'),
  ('2026-07-11', 'ua_token:facebookexternalhit', 'facebookexternalhit', 'meta-facebookexternalhit', 'facebookexternalhit', 'Meta', 'social_preview', 0.90, 'https://developers.facebook.com/docs/sharing/webmasters/web-crawlers'),
  ('2026-07-11', 'ua_token:twitterbot', 'Twitterbot', 'x-twitterbot', 'Twitterbot', 'X', 'social_preview', 0.90, 'https://developer.x.com/en/docs/x-for-websites/cards/guides/getting-started'),
  ('2026-07-11', 'ua_token:linkedinbot', 'LinkedInBot', 'linkedin-linkedinbot', 'LinkedInBot', 'LinkedIn', 'social_preview', 0.90, 'https://www.linkedin.com/help/linkedin/answer/a521928'),
  ('2026-07-11', 'ua_token:slackbot', 'Slackbot-LinkExpanding', 'slack-link-expander', 'Slackbot-LinkExpanding', 'Slack', 'social_preview', 0.90, 'https://api.slack.com/robots'),
  ('2026-07-11', 'ua_token:discordbot', 'Discordbot', 'discord-link-preview', 'Discordbot', 'Discord', 'social_preview', 0.88, 'https://discord.com'),
  ('2026-07-11', 'ua_token:uptimerobot', 'UptimeRobot', 'uptimerobot-monitor', 'UptimeRobot', 'UptimeRobot', 'monitoring', 0.90, 'https://uptimerobot.com'),
  ('2026-07-11', 'ua_token:chrome-lighthouse', 'Chrome-Lighthouse', 'google-lighthouse', 'Chrome-Lighthouse', 'Google', 'performance_testing', 0.92, 'https://developer.chrome.com/docs/lighthouse')
on conflict (registry_version, rule_id) do update
set ua_token = excluded.ua_token,
    claimed_bot_id = excluded.claimed_bot_id,
    claimed_bot_name = excluded.claimed_bot_name,
    claimed_operator = excluded.claimed_operator,
    purpose = excluded.purpose,
    confidence = excluded.confidence,
    source_url = excluded.source_url,
    active = true;

create table bot_internal.ingest_nonces (
  site_id text not null references bot_internal.sites(site_id) on delete cascade,
  nonce_hash text not null check (nonce_hash ~ '^[0-9a-f]{64}$'),
  consumed_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  primary key (site_id, nonce_hash),
  check (expires_at > consumed_at)
);

create index ingest_nonces_expires_at_idx on bot_internal.ingest_nonces (expires_at);

create table bot_internal.bot_events (
  event_id uuid primary key,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  site_id text not null references bot_internal.sites(site_id),
  environment text not null check (environment in ('production', 'preview', 'development')),
  deployment_id text check (deployment_id is null or char_length(deployment_id) <= 128),
  commit_sha text check (commit_sha is null or commit_sha ~ '^[0-9a-fA-F]{7,64}$'),
  host text not null check (char_length(host) between 1 and 253),
  path text not null check (path like '/%' and char_length(path) <= 2048),
  route_class text not null check (route_class in ('document', 'robots', 'sitemap', 'llms', 'public_pdf', 'machine_readable')),
  method text not null check (method in ('GET', 'HEAD')),
  query_parameter_names text[] not null default '{}'::text[] check (cardinality(query_parameter_names) <= 64),
  redacted_referrer_origin text check (redacted_referrer_origin is null or char_length(redacted_referrer_origin) <= 512),
  user_agent text not null check (char_length(user_agent) <= 1024),
  observed_class text not null check (observed_class in ('self_identified_bot', 'suspected_automation', 'ordinary_browser')),
  claimed_bot_id text check (claimed_bot_id is null or char_length(claimed_bot_id) <= 128),
  claimed_bot_name text check (claimed_bot_name is null or char_length(claimed_bot_name) <= 128),
  claimed_operator text check (claimed_operator is null or char_length(claimed_operator) <= 128),
  purpose text not null check (purpose in (
    'traditional_search', 'ai_search', 'model_training', 'user_agent_fetch',
    'seo_intelligence', 'social_preview', 'monitoring', 'security_scanning',
    'performance_testing', 'generic_automation', 'unknown'
  )),
  confidence numeric(4, 3) not null check (confidence between 0 and 1),
  matched_rule_ids text[] not null default '{}'::text[] check (cardinality(matched_rule_ids) <= 24),
  classifier_version text not null check (char_length(classifier_version) between 1 and 64),
  registry_version text not null check (char_length(registry_version) between 1 and 64),
  verification_status text not null default 'unverified' check (verification_status in (
    'unverified', 'pending', 'published_ip_match', 'reverse_dns_verified',
    'signed_identity_verified', 'failed'
  )),
  verification_method text check (verification_method is null or char_length(verification_method) <= 64),
  verified_at timestamptz,
  country text check (country is null or country ~ '^[A-Z]{2}$'),
  region text check (region is null or char_length(region) <= 64),
  asn bigint check (asn is null or asn >= 0),
  ip_hash_rotating text check (ip_hash_rotating is null or char_length(ip_hash_rotating) <= 128),
  ja3_digest text check (ja3_digest is null or char_length(ja3_digest) <= 256),
  ja4_digest text check (ja4_digest is null or char_length(ja4_digest) <= 256),
  signature_present boolean not null default false,
  signature_agent text check (signature_agent is null or char_length(signature_agent) <= 256),
  signature_key_id text check (signature_key_id is null or char_length(signature_key_id) <= 256),
  signature_verification_status text not null default 'not_present' check (signature_verification_status in (
    'not_present', 'unverified', 'verified', 'failed', 'unsupported'
  )),
  signature_verified_at timestamptz,
  event_schema_version text not null check (char_length(event_schema_version) between 1 and 32),
  collector_version text not null check (char_length(collector_version) between 1 and 64),
  check (verified_at is null or verification_status <> 'unverified'),
  check (signature_verified_at is null or signature_verification_status = 'verified')
);

create index bot_events_site_occurred_at_idx on bot_internal.bot_events (site_id, occurred_at desc);
create index bot_events_operator_occurred_at_idx on bot_internal.bot_events (claimed_operator, occurred_at desc)
  where claimed_operator is not null;
create index bot_events_purpose_occurred_at_idx on bot_internal.bot_events (purpose, occurred_at desc);
create index bot_events_path_occurred_at_idx on bot_internal.bot_events (site_id, path, occurred_at desc);
create index bot_events_verification_idx on bot_internal.bot_events (verification_status, occurred_at desc)
  where observed_class <> 'ordinary_browser';
create index bot_events_unmatched_idx on bot_internal.bot_events (occurred_at desc)
  where claimed_bot_id is null and observed_class <> 'ordinary_browser';

create table bot_internal.bot_verifications (
  verification_id uuid primary key default gen_random_uuid(),
  event_id uuid not null references bot_internal.bot_events(event_id) on delete cascade,
  status text not null check (status in (
    'pending', 'published_ip_match', 'reverse_dns_verified',
    'signed_identity_verified', 'failed'
  )),
  method text not null check (method in ('published_ip_range', 'reverse_dns', 'web_bot_auth', 'manual_review')),
  evidence_reference text check (evidence_reference is null or char_length(evidence_reference) <= 1024),
  evidence jsonb not null default '{}'::jsonb check (jsonb_typeof(evidence) = 'object'),
  checked_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (event_id, method, checked_at)
);

create index bot_verifications_event_idx on bot_internal.bot_verifications (event_id, checked_at desc);
create index bot_verifications_expires_idx on bot_internal.bot_verifications (expires_at)
  where expires_at is not null;

create table bot_internal.daily_bot_rollups (
  activity_date date not null,
  site_id text not null references bot_internal.sites(site_id) on delete cascade,
  operator_label text not null,
  bot_label text not null,
  purpose text not null,
  verification_status text not null,
  request_count bigint not null check (request_count >= 0),
  distinct_rotating_sources bigint not null default 0 check (distinct_rotating_sources >= 0),
  first_seen timestamptz not null,
  last_seen timestamptz not null,
  refreshed_at timestamptz not null default now(),
  primary key (activity_date, site_id, operator_label, bot_label, purpose, verification_status)
);

alter table bot_internal.sites enable row level security;
alter table bot_internal.important_pages enable row level security;
alter table bot_internal.bot_registry enable row level security;
alter table bot_internal.ingest_nonces enable row level security;
alter table bot_internal.bot_events enable row level security;
alter table bot_internal.bot_verifications enable row level security;
alter table bot_internal.daily_bot_rollups enable row level security;

create view bot_internal.bot_activity_daily
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  count(*) as request_count,
  count(*) filter (where observed_class = 'self_identified_bot') as self_identified_bot_requests,
  count(*) filter (where observed_class = 'suspected_automation') as suspected_automation_requests,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
group by occurred_at::date, site_id;

create view bot_internal.bot_activity_by_operator
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  coalesce(claimed_operator, 'Unattributed') as operator,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
group by occurred_at::date, site_id, coalesce(claimed_operator, 'Unattributed');

create view bot_internal.bot_activity_by_purpose
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  purpose,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
group by occurred_at::date, site_id, purpose;

create view bot_internal.top_bot_requested_pages
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  path as page,
  coalesce(claimed_operator, 'Unattributed') as operator,
  coalesce(claimed_bot_name, 'Unmatched') as bot,
  purpose,
  verification_status as verification,
  count(*) as request_count,
  count(distinct ip_hash_rotating) filter (where ip_hash_rotating is not null) as distinct_rotating_sources,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
where observed_class <> 'ordinary_browser'
group by
  occurred_at::date, site_id, path, coalesce(claimed_operator, 'Unattributed'),
  coalesce(claimed_bot_name, 'Unmatched'), purpose, verification_status;

create view bot_internal.ai_search_activity
with (security_invoker = true) as
select * from bot_internal.top_bot_requested_pages where purpose = 'ai_search';

create view bot_internal.training_crawler_activity
with (security_invoker = true) as
select * from bot_internal.top_bot_requested_pages where purpose = 'model_training';

create view bot_internal.robots_sitemap_llms_activity
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  path,
  route_class,
  coalesce(claimed_operator, 'Unattributed') as operator,
  coalesce(claimed_bot_name, 'Unmatched') as bot,
  verification_status as verification,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
where route_class in ('robots', 'sitemap', 'llms')
group by
  occurred_at::date, site_id, path, route_class,
  coalesce(claimed_operator, 'Unattributed'), coalesce(claimed_bot_name, 'Unmatched'), verification_status;

create view bot_internal.verified_vs_unverified_activity
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  verification_status,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
where observed_class <> 'ordinary_browser'
group by occurred_at::date, site_id, verification_status;

create view bot_internal.suspicious_automation_activity
with (security_invoker = true) as
select
  occurred_at::date as date,
  site_id,
  path,
  user_agent,
  matched_rule_ids,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
where observed_class = 'suspected_automation'
group by occurred_at::date, site_id, path, user_agent, matched_rule_ids;

create view bot_internal.unmatched_bot_user_agents
with (security_invoker = true) as
select
  site_id,
  user_agent,
  observed_class,
  count(*) as request_count,
  min(occurred_at) as first_seen,
  max(occurred_at) as last_seen
from bot_internal.bot_events
where claimed_bot_id is null and observed_class <> 'ordinary_browser'
group by site_id, user_agent, observed_class;

create view bot_internal.important_pages_not_observed
with (security_invoker = true) as
select
  page.site_id,
  page.path,
  page.label,
  max(event.occurred_at) as last_observed_at
from bot_internal.important_pages page
left join bot_internal.bot_events event
  on event.site_id = page.site_id
 and event.path = page.path
 and event.observed_class <> 'ordinary_browser'
where page.active
group by page.site_id, page.path, page.label
having max(event.occurred_at) is null;

create view bot_internal.pending_bot_verifications
with (security_invoker = true) as
select
  event_id,
  occurred_at,
  site_id,
  claimed_bot_id,
  claimed_bot_name,
  claimed_operator,
  signature_present,
  signature_agent,
  signature_key_id
from bot_internal.bot_events
where observed_class = 'self_identified_bot'
  and verification_status = 'unverified';

create or replace function bot_internal.refresh_daily_bot_rollups(
  p_activity_date date default (current_date - 1)
)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into bot_internal.daily_bot_rollups (
    activity_date, site_id, operator_label, bot_label, purpose,
    verification_status, request_count, distinct_rotating_sources,
    first_seen, last_seen, refreshed_at
  )
  select
    p_activity_date,
    site_id,
    coalesce(claimed_operator, 'Unattributed'),
    coalesce(claimed_bot_name, 'Unmatched'),
    purpose,
    verification_status,
    count(*),
    count(distinct ip_hash_rotating) filter (where ip_hash_rotating is not null),
    min(occurred_at),
    max(occurred_at),
    now()
  from bot_internal.bot_events
  where occurred_at >= p_activity_date::timestamptz
    and occurred_at < (p_activity_date + 1)::timestamptz
  group by
    site_id, coalesce(claimed_operator, 'Unattributed'),
    coalesce(claimed_bot_name, 'Unmatched'), purpose, verification_status
  on conflict (activity_date, site_id, operator_label, bot_label, purpose, verification_status)
  do update set
    request_count = excluded.request_count,
    distinct_rotating_sources = excluded.distinct_rotating_sources,
    first_seen = excluded.first_seen,
    last_seen = excluded.last_seen,
    refreshed_at = excluded.refreshed_at;
$$;

create or replace function bot_internal.enforce_retention()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from bot_internal.bot_events
  where (environment = 'preview' and received_at < now() - interval '7 days')
     or (environment <> 'preview' and received_at < now() - interval '90 days');

  delete from bot_internal.ingest_nonces where expires_at < now();
  delete from bot_internal.daily_bot_rollups where activity_date < current_date - interval '24 months';
end;
$$;

revoke all on all tables in schema bot_internal from public, anon, authenticated;
revoke all on all sequences in schema bot_internal from public, anon, authenticated;
revoke all on all functions in schema bot_internal from public, anon, authenticated;

do $$
declare
  existing_job record;
begin
  for existing_job in
    select jobid from cron.job
    where jobname in ('bot-observer-daily-rollup', 'bot-observer-retention')
  loop
    perform cron.unschedule(existing_job.jobid);
  end loop;

  perform cron.schedule(
    'bot-observer-daily-rollup',
    '5 3 * * *',
    'select bot_internal.refresh_daily_bot_rollups(current_date - 1);'
  );
  perform cron.schedule(
    'bot-observer-retention',
    '17 3 * * *',
    'select bot_internal.enforce_retention();'
  );
end;
$$;
