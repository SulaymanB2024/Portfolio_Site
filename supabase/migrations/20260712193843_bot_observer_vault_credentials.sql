create extension if not exists supabase_vault with schema vault;

alter table bot_internal.sites
  add column if not exists hmac_secret_id uuid;

comment on column bot_internal.sites.hmac_secret_id is
  'Supabase Vault secret used only by the collector for per-site HMAC verification.';

revoke all on bot_internal.sites from public, anon, authenticated, service_role;

create or replace function bot_internal.enforce_retention()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from bot_internal.bot_events
  where (environment = 'preview' and received_at < now() - interval '7 days')
     or (
       environment <> 'preview'
       and observed_class = 'suspected_automation'
       and received_at < now() - interval '30 days'
     )
     or (environment <> 'preview' and received_at < now() - interval '90 days');

  delete from bot_internal.ingest_nonces where expires_at < now();
  delete from bot_internal.daily_bot_rollups where activity_date < current_date - interval '24 months';
end;
$$;

revoke all on function bot_internal.enforce_retention()
  from public, anon, authenticated, service_role;
