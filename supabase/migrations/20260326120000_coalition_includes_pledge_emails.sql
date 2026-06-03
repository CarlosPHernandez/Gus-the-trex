-- Count pledge confirmation emails in the public supporter (coalition) tally.

create or replace function public.get_campaign_stats()
returns json
language sql
security definer
set search_path = public
as $$
  with supporter_emails as (
    select lower(trim(email)) as email
    from coalition_members
    where email is not null and trim(email) <> ''
    union
    select lower(trim(email)) as email
    from pledges
    where email is not null and trim(email) <> ''
  )
  select json_build_object(
    'total_cents', coalesce((select sum(amount_cents)::bigint from pledges), 0),
    'pledge_count', coalesce((select count(*)::bigint from pledges), 0),
    'coalition_count', coalesce((select count(*)::bigint from supporter_emails), 0)
  );
$$;

revoke all on function public.get_campaign_stats() from public;
grant execute on function public.get_campaign_stats() to anon, authenticated;
