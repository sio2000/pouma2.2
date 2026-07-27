-- ============================================================================
-- The Pouma Academy — Workshop Marketing System
-- Migration 0001: workshops + workshop_registrations
-- ----------------------------------------------------------------------------
-- Apply with the Supabase CLI:   supabase db push
-- or paste into the Supabase Studio SQL editor and run.
--
-- All application access happens server-side with the SERVICE ROLE key, which
-- bypasses RLS. RLS is enabled with NO public policies, so the tables are
-- locked down by default (the anon key cannot read or write them).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── workshops ───────────────────────────────────────────────────────────────
create table if not exists public.workshops (
  id               uuid primary key default gen_random_uuid(),
  title            text        not null,
  subtitle         text,
  description      text        not null default '',
  banner_url       text,
  slug             text        not null,
  date             date        not null,            -- workshop day (Europe/Athens)
  "time"           text        not null,            -- HH:mm, Europe/Athens local time
  duration_minutes integer     not null default 120 check (duration_minutes > 0),
  active           boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- One workshop per slug (drives the /workshop/{slug} route).
create unique index if not exists workshops_slug_key on public.workshops (lower(slug));
-- Fast lookups for "active upcoming" listings and the popup.
create index if not exists workshops_active_date_idx on public.workshops (active, date);

-- ── workshop_registrations ───────────────────────────────────────────────────
create table if not exists public.workshop_registrations (
  id              uuid primary key default gen_random_uuid(),
  workshop_id     uuid        not null references public.workshops (id) on delete cascade,
  first_name      text        not null,
  last_name       text        not null,
  email           text        not null,
  phone           text        not null,
  comment         text,
  consent_given   boolean     not null default false,
  consent_at      timestamptz,
  email_status    text        not null default 'pending'
                    check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  email_sent_at   timestamptz,
  created_at      timestamptz not null default now()
);

-- Relationship lookups + chronological participant lists.
create index if not exists workshop_registrations_workshop_idx
  on public.workshop_registrations (workshop_id, created_at desc);

-- Duplicate protection: the same email may register only once per workshop
-- (case-insensitive). Inserts that violate this raise SQLSTATE 23505.
create unique index if not exists workshop_registrations_unique_email
  on public.workshop_registrations (workshop_id, lower(email));

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_workshop_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workshops_set_updated_at on public.workshops;
create trigger workshops_set_updated_at
  before update on public.workshops
  for each row execute function public.set_workshop_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Enabled with no policies → only the service role (server) can touch the data.
alter table public.workshops              enable row level security;
alter table public.workshop_registrations enable row level security;

-- If you ever want to read active workshops directly with the anon key from the
-- browser, uncomment the policy below. The app does NOT need it (reads go
-- through the server API), so it stays disabled for a secure-by-default setup.
--
-- create policy "anon can read active workshops"
--   on public.workshops for select
--   to anon
--   using (active = true);
