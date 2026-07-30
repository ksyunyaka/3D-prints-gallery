-- 3D Prints gallery — database schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.prints (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text not null default '',
  year        text not null default '',
  tags        text[] not null default '{}',
  material    text not null default '',
  source_name text not null default '',
  source_url  text,
  stl_url     text,
  images      text[] not null default '{}',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists prints_created_at_idx on public.prints (created_at desc);
create index if not exists prints_tags_idx on public.prints using gin (tags);

-- Keep updated_at honest.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists prints_set_updated_at on public.prints;
create trigger prints_set_updated_at
  before update on public.prints
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
--   Visitors (anon) can read published prints only.
--   Signed-in users (you) can read everything and write.
-- ---------------------------------------------------------------------------

alter table public.prints enable row level security;

-- RLS policies only take effect on top of ordinary table grants — the SQL
-- editor doesn't hand these out automatically the way the table-creation UI
-- does, so without them every request gets a bare "permission denied".
grant usage on schema public to anon, authenticated;
grant select on public.prints to anon, authenticated;
grant insert, update, delete on public.prints to authenticated;

drop policy if exists "Published prints are readable by anyone" on public.prints;
create policy "Published prints are readable by anyone"
  on public.prints for select
  to anon
  using (published = true);

drop policy if exists "Signed-in users can read all prints" on public.prints;
create policy "Signed-in users can read all prints"
  on public.prints for select
  to authenticated
  using (true);

drop policy if exists "Signed-in users can insert prints" on public.prints;
create policy "Signed-in users can insert prints"
  on public.prints for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in users can update prints" on public.prints;
create policy "Signed-in users can update prints"
  on public.prints for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Signed-in users can delete prints" on public.prints;
create policy "Signed-in users can delete prints"
  on public.prints for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for print photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('print-images', 'print-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Print images are publicly readable" on storage.objects;
create policy "Print images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'print-images');

drop policy if exists "Signed-in users can upload print images" on storage.objects;
create policy "Signed-in users can upload print images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'print-images');

drop policy if exists "Signed-in users can update print images" on storage.objects;
create policy "Signed-in users can update print images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'print-images')
  with check (bucket_id = 'print-images');

drop policy if exists "Signed-in users can delete print images" on storage.objects;
create policy "Signed-in users can delete print images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'print-images');
