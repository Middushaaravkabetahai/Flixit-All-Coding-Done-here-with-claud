-- Flixit schema. Run this in the Supabase SQL editor for a new project.
-- Safe to re-run in full (all statements are idempotent) after pulling
-- later additions, e.g. the Phase 2 swipes table at the bottom.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  style_tags text[] default '{}',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table if not exists public.wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null,
  category text not null,
  color text,
  brand text,
  occasion text not null default 'Casual',
  created_at timestamptz not null default now()
);

-- Phase 3 addition for existing projects that ran this file before occasion
-- tagging existed.
alter table public.wardrobe_items
  add column if not exists occasion text not null default 'Casual';

alter table public.wardrobe_items enable row level security;

create policy "Users can view their own wardrobe items"
  on public.wardrobe_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own wardrobe items"
  on public.wardrobe_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own wardrobe items"
  on public.wardrobe_items for delete
  using (auth.uid() = user_id);

-- Storage bucket for wardrobe photos. Create via Supabase dashboard
-- (Storage > New bucket, name "wardrobe-photos", private) then run:
insert into storage.buckets (id, name, public)
values ('wardrobe-photos', 'wardrobe-photos', false)
on conflict (id) do nothing;

create policy "Users can upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own wardrobe photos"
  on storage.objects for select
  using (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own wardrobe photos"
  on storage.objects for delete
  using (
    bucket_id = 'wardrobe-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Phase 2: Flixnder swipes, used to rank the FYP feed.
-- deal_id references the mock deal catalog (src/data/mockDeals.ts) for now;
-- once real affiliate listings replace it, this can point at a products table.
create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  deal_id text not null,
  category text not null,
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz not null default now()
);

alter table public.swipes enable row level security;

create policy "Users can view their own swipes"
  on public.swipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own swipes"
  on public.swipes for insert
  with check (auth.uid() = user_id);
