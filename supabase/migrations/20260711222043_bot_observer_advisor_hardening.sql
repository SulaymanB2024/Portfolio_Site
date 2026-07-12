-- Supabase's project-level RLS event-trigger helper does not need direct API-role execution.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

-- Covers the site_id foreign key independently of the composite rollup primary key.
create index daily_bot_rollups_site_id_idx on bot_internal.daily_bot_rollups (site_id);
