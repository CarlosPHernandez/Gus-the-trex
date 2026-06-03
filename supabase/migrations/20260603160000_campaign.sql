-- Gus campaign: real pledges + coalition emails (anon insert, public stats only)

create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  amount_cents integer not null check (amount_cents > 0),
  tier_name text not null,
  display_name text,
  email text,
  source text not null default 'web',
  created_at timestamptz not null default now()
);

create table if not exists public.coalition_members (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint coalition_members_email_unique unique (email)
);

alter table public.pledges enable row level security;
alter table public.coalition_members enable row level security;

create policy "pledges_insert_anon"
  on public.pledges
  for insert
  to anon, authenticated
  with check (true);

create policy "coalition_insert_anon"
  on public.coalition_members
  for insert
  to anon, authenticated
  with check (true);

create or replace function public.get_campaign_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total_cents', coalesce((select sum(amount_cents)::bigint from pledges), 0),
    'pledge_count', coalesce((select count(*)::bigint from pledges), 0),
    'coalition_count', coalesce((select count(*)::bigint from coalition_members), 0)
  );
$$;

revoke all on function public.get_campaign_stats() from public;
grant execute on function public.get_campaign_stats() to anon, authenticated;
