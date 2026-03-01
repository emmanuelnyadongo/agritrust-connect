-- Migration: post-transaction chat, ratings, partial quantity, contact.
-- Run in Supabase SQL Editor after schema.sql and policies.sql.

-- 1) Contact: optional phone on profiles
alter table public.profiles add column if not exists phone text;

-- 2) Post-transaction messages (buyer–farmer chat)
create table if not exists public.transaction_messages (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_transaction_messages_transaction_id on public.transaction_messages(transaction_id);

-- 3) Ratings: one rating per (transaction, rater, ratee)
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score >= 1 and score <= 5),
  created_at timestamptz not null default now(),
  unique(transaction_id, rater_id, ratee_id)
);
create index if not exists idx_ratings_ratee_id on public.ratings(ratee_id);

-- 4) Partial quantity: listings
alter table public.listings add column if not exists total_quantity numeric;
alter table public.listings add column if not exists remaining_quantity numeric;
-- Backfill from quantity (best-effort: parse first number)
update public.listings
set total_quantity = coalesce(nullif(regexp_replace(quantity, '[^0-9.]', '', 'g'), '')::numeric, 0),
    remaining_quantity = coalesce(nullif(regexp_replace(quantity, '[^0-9.]', '', 'g'), '')::numeric, 0)
where total_quantity is null and quantity is not null;

-- 5) Negotiations: requested quantity (what buyer wants)
alter table public.negotiations add column if not exists requested_quantity numeric;

-- 6) Transactions: numeric quantity for math
alter table public.transactions add column if not exists agreed_quantity numeric;

-- Trigger: when a rating is inserted, recompute ratee's profile.rating
create or replace function public.update_profile_rating_on_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set rating = (
    select round(avg(score)::numeric, 1)
    from public.ratings
    where ratee_id = new.ratee_id
  )
  where id = new.ratee_id;
  return new;
end;
$$;
drop trigger if exists trigger_ratings_update_profile on public.ratings;
create trigger trigger_ratings_update_profile
  after insert on public.ratings
  for each row execute function public.update_profile_rating_on_rating();

-- Trigger: when a transaction is inserted, increment both parties' completed_transactions
create or replace function public.increment_completed_transactions()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set completed_transactions = completed_transactions + 1 where id = new.buyer_id;
  update public.profiles set completed_transactions = completed_transactions + 1 where id = new.farmer_id;
  return new;
end;
$$;
drop trigger if exists trigger_transactions_increment_completed on public.transactions;
create trigger trigger_transactions_increment_completed
  after insert on public.transactions
  for each row execute function public.increment_completed_transactions();

-- Replace on_negotiation_agreed to support partial quantity and set agreed_quantity
create or replace function public.on_negotiation_agreed()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_listing public.listings%rowtype;
  v_agreed_qty numeric;
  v_remaining numeric;
begin
  if new.status <> 'agreed' or old.status = 'agreed' then
    return new;
  end if;
  select * into v_listing from public.listings where id = new.listing_id;

  -- Agreed quantity: requested_quantity if set and ≤ remaining, else full remaining
  v_remaining := coalesce(v_listing.remaining_quantity, nullif(regexp_replace(v_listing.quantity, '[^0-9.]', '', 'g'), '')::numeric, 0);
  v_agreed_qty := coalesce(new.requested_quantity, v_remaining);
  if v_agreed_qty > v_remaining or v_agreed_qty <= 0 then
    v_agreed_qty := v_remaining;
  end if;

  insert into public.transactions (
    negotiation_id, listing_id, buyer_id, farmer_id,
    produce, quantity, agreed_price, date, status, agreed_quantity
  ) values (
    new.id, new.listing_id, new.buyer_id, v_listing.farmer_id,
    v_listing.produce || ' — ' || v_listing.variety,
    v_agreed_qty::text || ' ' || coalesce(v_listing.unit, 'kg'),
    coalesce((select price from public.offers where negotiation_id = new.id order by created_at desc limit 1), v_listing.price_per_unit),
    current_date,
    'completed',
    v_agreed_qty
  );

  -- Decrement remaining; set total if null; mark sold if none left
  update public.listings
  set total_quantity = coalesce(total_quantity, v_remaining),
      remaining_quantity = greatest(0, coalesce(remaining_quantity, v_remaining) - v_agreed_qty),
      status = case when (coalesce(remaining_quantity, v_remaining) - v_agreed_qty) <= 0 then 'sold' else status end
  where id = new.listing_id;

  return new;
end;
$$;
