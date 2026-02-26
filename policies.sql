-- AgriTrust Row Level Security (RLS) policies
-- Run after schema.sql in your Supabase SQL editor.

-- Enable RLS on all user-scoped tables
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.negotiations enable row level security;
alter table public.offers enable row level security;
alter table public.transactions enable row level security;

-- Profiles: each user can see and update only their own row
create policy if not exists "select own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy if not exists "update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Allow profile creation on sign-up (id must match auth.uid())
create policy if not exists "insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Listings: anyone can read active listings; farmers manage their own
create policy if not exists "read listings"
  on public.listings
  for select
  using (status = 'active' or farmer_id = auth.uid());

create policy if not exists "insert own listings"
  on public.listings
  for insert
  with check (farmer_id = auth.uid());

create policy if not exists "update own listings"
  on public.listings
  for update
  using (farmer_id = auth.uid());

create policy if not exists "delete own listings"
  on public.listings
  for delete
  using (farmer_id = auth.uid());

-- Negotiations: only the buyer and listing farmer can see or change them
create policy if not exists "participants select negotiation"
  on public.negotiations
  for select
  using (
    buyer_id = auth.uid()
    or exists (
      select 1
      from public.listings l
      where l.id = listing_id
      and l.farmer_id = auth.uid()
    )
  );

create policy if not exists "buyer insert negotiation"
  on public.negotiations
  for insert
  with check (buyer_id = auth.uid());

create policy if not exists "participants update negotiation"
  on public.negotiations
  for update
  using (
    buyer_id = auth.uid()
    or exists (
      select 1
      from public.listings l
      where l.id = listing_id
      and l.farmer_id = auth.uid()
    )
  );

-- Offers: only negotiation participants can read or insert
create policy if not exists "participants select offers"
  on public.offers
  for select
  using (
    exists (
      select 1
      from public.negotiations n
      join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id
      and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );

create policy if not exists "participants insert offers"
  on public.offers
  for insert
  with check (
    exists (
      select 1
      from public.negotiations n
      join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id
      and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );

-- Transactions: only parties on the record can see them
create policy if not exists "parties select transactions"
  on public.transactions
  for select
  using (buyer_id = auth.uid() or farmer_id = auth.uid());

