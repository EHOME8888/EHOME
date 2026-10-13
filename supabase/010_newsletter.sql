-- supabase/010_newsletter.sql
-- Marketing newsletter: double opt-in with a real unsubscribe.
--
-- WHICH PROJECT TO RUN THIS IN
-- The code reads NEWSLETTER_SUPABASE_URL / NEWSLETTER_SUPABASE_SERVICE_KEY,
-- deliberately separate from the portal's variables. Run this in a SEPARATE
-- Supabase project from the one holding client documents. The marketing site
-- is a different, more exposed deployment, and the service-role key bypasses
-- RLS entirely -- a marketing-site compromise must not reach passport scans.
-- Pointing it at the client-data project is possible but is a conscious
-- decision to widen that blast radius.

create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  status          text not null default 'pending',   -- pending | confirmed | unsubscribed
  token           text not null unique,              -- confirm + unsubscribe, emailed only
  -- proof of consent, per the Privacy Notice: marketing runs on consent
  consent_text    text,                              -- the exact wording agreed to
  consent_locale  text,                              -- 'en' | 'zh'
  requested_at    timestamptz not null default now(),
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;

-- No policies. Nothing reaches this table through the public API; every access
-- is server-side with the service role, from app/api/newsletter/*. RLS is on so
-- that an accidentally-shared anon key still reads and writes nothing.

create index if not exists newsletter_token_idx on public.newsletter_subscribers (token);
create index if not exists newsletter_status_idx on public.newsletter_subscribers (status);

------------------------------------------------------------------------------
-- verification
------------------------------------------------------------------------------
-- expect zero rows readable with the anon key:
--   select * from public.newsletter_subscribers;   -- as anon -> permission denied / empty
--
-- confirmed subscribers only:
--   select email, confirmed_at from public.newsletter_subscribers
--    where status = 'confirmed' order by confirmed_at desc;
