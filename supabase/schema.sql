-- AgriTrust schema: tables, relationships, constraints, indexes, triggers.
-- Run after Supabase project exists. Policies are in policies.sql.

-- Extends auth.users; one row per user.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('farmer', 'buyer')),
  name text not null,
  location text,
  joined timestamptz not null default now(),
  completed_transactions int not null default 0,
  rating numeric(3,1) default null
);

-- Produce listings created by farmers.
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
  status text not null default 'active' check (status in ('active', 'in_negotiation', 'sold')),
  created_at timestamptz not null default now()
);

create index if not exists idx_listings_farmer_id on public.listings(farmer_id);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_created_at on public.listings(created_at desc);
create index if not exists idx_listings_produce on public.listings(produce);
create index if not exists idx_listings_location on public.listings(location);

-- One negotiation per (listing, buyer) pair.
create table if not exists public.negotiations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'agreed', 'declined', 'expired')),
  system_guidance numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(listing_id, buyer_id)
);

create index if not exists idx_negotiations_listing_id on public.negotiations(listing_id);
create index if not exists idx_negotiations_buyer_id on public.negotiations(buyer_id);
create index if not exists idx_negotiations_status on public.negotiations(status);

-- One row per offer in a negotiation.
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  from_role text not null check (from_role in ('farmer', 'buyer')),
  price numeric not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_negotiation_id on public.offers(negotiation_id);

-- Record of agreed deal; created by trigger when negotiation becomes agreed.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid references public.negotiations(id),
  listing_id uuid references public.listings(id),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  farmer_id uuid not null references public.profiles(id) on delete restrict,
  produce text not null,
  quantity text not null,
  agreed_price numeric not null,
  date date not null default current_date,
  status text not null default 'pending' check (status in ('completed', 'disputed', 'pending'))
);

create index if not exists idx_transactions_buyer_id on public.transactions(buyer_id);
create index if not exists idx_transactions_farmer_id on public.transactions(farmer_id);
create index if not exists idx_transactions_date on public.transactions(date desc);

-- Optional: reference prices per produce for system guidance.
create table if not exists public.market_reference_prices (
  id uuid primary key default gen_random_uuid(),
  produce text not null,
  market_low numeric not null,
  market_high numeric not null,
  market_median numeric not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_market_reference_prices_produce on public.market_reference_prices(produce);

-- Trigger: keep negotiations.updated_at in sync.
create or replace function public.set_negotiation_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_negotiations_updated_at on public.negotiations;
create trigger trigger_negotiations_updated_at
  before update on public.negotiations
  for each row execute function public.set_negotiation_updated_at();

-- Trigger: on negotiation status -> agreed, create transaction and set listing to sold.
create or replace function public.on_negotiation_agreed()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_listing public.listings%rowtype;
begin
  if new.status <> 'agreed' or old.status = 'agreed' then
    return new;
  end if;
  select * into v_listing from public.listings where id = new.listing_id;
  insert into public.transactions (
    negotiation_id, listing_id, buyer_id, farmer_id,
    produce, quantity, agreed_price, date, status
  ) values (
    new.id, new.listing_id, new.buyer_id, v_listing.farmer_id,
    v_listing.produce || ' — ' || v_listing.variety,
    v_listing.quantity || ' ' || v_listing.unit,
    coalesce((select price from public.offers where negotiation_id = new.id order by created_at desc limit 1), v_listing.price_per_unit),
    current_date,
    'pending'
  );
  update public.listings set status = 'sold' where id = new.listing_id;
  return new;
end;
$$;

drop trigger if exists trigger_negotiation_agreed on public.negotiations;
create trigger trigger_negotiation_agreed
  after update on public.negotiations
  for each row execute function public.on_negotiation_agreed();
