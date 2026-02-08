-- Row level security for authenticated users. Run after schema.sql.

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.negotiations enable row level security;
alter table public.offers enable row level security;
alter table public.transactions enable row level security;

-- Profiles: read/update own; insert own (signup).
create policy "profiles_select_own"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own"
  on public.profiles for insert with check (auth.uid() = id);

-- Listings: anyone can read active; farmer can read own all; farmer can insert/update/delete own.
create policy "listings_select_active_or_own"
  on public.listings for select
  using (status = 'active' or farmer_id = auth.uid());
create policy "listings_insert_farmer"
  on public.listings for insert with check (farmer_id = auth.uid());
create policy "listings_update_farmer"
  on public.listings for update using (farmer_id = auth.uid());
create policy "listings_delete_farmer"
  on public.listings for delete using (farmer_id = auth.uid());

-- Negotiations: participant can select; buyer can insert; participant can update.
create policy "negotiations_select_participant"
  on public.negotiations for select
  using (
    buyer_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid())
  );
create policy "negotiations_insert_buyer"
  on public.negotiations for insert with check (buyer_id = auth.uid());
create policy "negotiations_update_participant"
  on public.negotiations for update
  using (
    buyer_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid())
  );

-- Offers: participant can select and insert.
create policy "offers_select_participant"
  on public.offers for select
  using (
    exists (
      select 1 from public.negotiations n
      join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );
create policy "offers_insert_participant"
  on public.offers for insert
  with check (
    exists (
      select 1 from public.negotiations n
      join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );

-- Transactions: buyer or farmer can read only.
create policy "transactions_select_party"
  on public.transactions for select
  using (buyer_id = auth.uid() or farmer_id = auth.uid());
