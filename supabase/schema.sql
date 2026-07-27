create extension if not exists "pgcrypto";

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text not null default '',
  icon text not null default '✦',
  accent text not null default '#b8f25a',
  screenshots text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apps enable row level security;

create policy "Public can read apps"
  on public.apps for select
  using (true);

create policy "Authenticated users can manage apps"
  on public.apps for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists apps_updated_at on public.apps;
create trigger apps_updated_at before update on public.apps
for each row execute procedure public.set_updated_at();
