-- AgriTrust database schema
-- Run this in your Supabase SQL editor to create the core tables.

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('farmer', 'buyer')),
  name text not null,
  location text,
  joined timestamptz not null default now(),
  completed_transactions int not null default 0,
  rating numeric(2,1)
);

-- Produce listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  produce text not null,
  variety text not null,
  quantity text not null,
  unit text not null,
  quality text,
  location text not null,
  price_per_unit numeric not null,
  market_low numeric not null,
  market_high numeric not null,
  market_median numeric not null,
  available_from date not null,
  available_until date not null,
  description text,
  status text not null default 'active' check (status in ('active','in_negotiation','sold')),
  created_at timestamptz not null default now()
);

-- Negotiations between a buyer and a listing
create table if not exists public.negotiations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','agreed','declined','expired')),
  system_guidance numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(listing_id, buyer_id)
);

-- Offers within a negotiation
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  from_role text not null check (from_role in ('farmer', 'buyer')),
  price numeric not null,
  note text,
  created_at timestamptz not null default now()
);

-- Finalised transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid references public.negotiations(id),
  listing_id uuid references public.listings(id),
  buyer_id uuid not null references public.profiles(id),
  farmer_id uuid not null references public.profiles(id),
  produce text not null,
  quantity text not null,
  agreed_price numeric not null,
  date date not null default current_date,
  status text not null default 'pending' check (status in ('completed','disputed','pending'))
);

