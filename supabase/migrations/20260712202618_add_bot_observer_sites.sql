-- Register the two additional sites without embedding their Vault credentials.
insert into bot_internal.sites (site_id, display_name, allowed_hosts, enabled)
values
  (
    'sulayman-bowles-tech',
    'sulayman-bowles.tech',
    array['sulayman-bowles.tech', 'www.sulayman-bowles.tech', '*.vercel.app'],
    true
  ),
  (
    'void-agency-com',
    'void-agency.com',
    array['void-agency.com', 'www.void-agency.com', '*.vercel.app'],
    true
  )
on conflict (site_id) do update
set display_name = excluded.display_name,
    allowed_hosts = excluded.allowed_hosts,
    enabled = excluded.enabled,
    updated_at = now();

insert into bot_internal.important_pages (site_id, path, label, active)
values
  ('sulayman-bowles-tech', '/', 'Home', true),
  ('sulayman-bowles-tech', '/competitions', 'Competitions', true),
  ('sulayman-bowles-tech', '/markets', 'Markets', true),
  ('sulayman-bowles-tech', '/contact', 'Contact', true),
  ('sulayman-bowles-tech', '/projects/project-delta', 'Project Delta', true),
  ('sulayman-bowles-tech', '/projects/atlas-engine', 'Atlas Engine', true),
  ('sulayman-bowles-tech', '/articles/atlas-evidence-system', 'Atlas evidence system', true),
  ('sulayman-bowles-tech', '/robots.txt', 'Robots', true),
  ('sulayman-bowles-tech', '/sitemap.xml', 'Sitemap', true),
  ('sulayman-bowles-tech', '/llms.txt', 'LLMs', true),
  ('void-agency-com', '/', 'Home', true),
  ('void-agency-com', '/smbs', 'SMB services', true),
  ('void-agency-com', '/services/ai-development-automation', 'AI development and automation', true),
  ('void-agency-com', '/services/website-development', 'Website development', true),
  ('void-agency-com', '/services/technical-seo-ai-search-visibility', 'Technical SEO and AI search', true),
  ('void-agency-com', '/services/measurement-data-systems', 'Measurement and data systems', true),
  ('void-agency-com', '/insights', 'Insights', true),
  ('void-agency-com', '/case-studies/visibility-diagnostic', 'Visibility diagnostic', true),
  ('void-agency-com', '/robots.txt', 'Robots', true),
  ('void-agency-com', '/sitemap.xml', 'Sitemap', true),
  ('void-agency-com', '/llms.txt', 'LLMs', true)
on conflict (site_id, path) do update
set label = excluded.label,
    active = excluded.active;
