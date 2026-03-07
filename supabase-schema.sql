-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- This creates the tables needed for nibble account data storage

-- Profiles table (dietary profiles per user)
create table if not exists user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  profile_id text not null,
  name text not null,
  preset_id text,
  color text default '#D4A039',
  avoid_list jsonb default '[]'::jsonb,
  custom_restrictions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, profile_id)
);

-- Search history
create table if not exists search_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  dish text not null,
  result jsonb not null,
  searched_at timestamptz default now()
);

-- Favourites
create table if not exists favourites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  dish_name text not null,
  created_at timestamptz default now(),
  unique(user_id, dish_name)
);

-- Custom diets
create table if not exists custom_diets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  diet_id text not null,
  name text not null,
  avoid_list jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, diet_id)
);

-- Active profile tracking
create table if not exists user_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  active_profile_id text default 'default',
  updated_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table user_profiles enable row level security;
alter table search_history enable row level security;
alter table favourites enable row level security;
alter table custom_diets enable row level security;
alter table user_settings enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can manage own profiles" on user_profiles
  for all using (auth.uid() = user_id);

create policy "Users can manage own search history" on search_history
  for all using (auth.uid() = user_id);

create policy "Users can manage own favourites" on favourites
  for all using (auth.uid() = user_id);

create policy "Users can manage own custom diets" on custom_diets
  for all using (auth.uid() = user_id);

create policy "Users can manage own settings" on user_settings
  for all using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists idx_user_profiles_user_id on user_profiles(user_id);
create index if not exists idx_search_history_user_id on search_history(user_id, searched_at desc);
create index if not exists idx_favourites_user_id on favourites(user_id);
create index if not exists idx_custom_diets_user_id on custom_diets(user_id);
