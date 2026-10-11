-- Surprise Studio — Supabase schema (run once in SQL editor)
-- Images live in a PUBLIC storage bucket named "uploads".

create table if not exists customers (
  username text primary key,
  pass_hash text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz null
);

create table if not exists sites (
  slug text primary key,
  username text not null references customers(username) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz null,
  updated_at timestamptz not null default now()
);

-- Storage: create bucket "uploads" via Dashboard → Storage → New bucket → PUBLIC.
-- Service-role key bypasses RLS, so no storage policies strictly needed for API use.
-- Public read works because the bucket is public.
