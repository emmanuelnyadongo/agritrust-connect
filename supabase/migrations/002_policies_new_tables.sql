-- RLS for transaction_messages, ratings. Run after 001_post_transaction_ratings_partial.sql.

alter table public.transaction_messages enable row level security;
alter table public.ratings enable row level security;

-- Transaction messages: only buyer or farmer of that transaction can read/insert
create policy "transaction_messages_select_party"
  on public.transaction_messages for select
  using (
    exists (
      select 1 from public.transactions t
      where t.id = transaction_id and (t.buyer_id = auth.uid() or t.farmer_id = auth.uid())
    )
  );
create policy "transaction_messages_insert_party"
  on public.transaction_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.transactions t
      where t.id = transaction_id and (t.buyer_id = auth.uid() or t.farmer_id = auth.uid())
    )
  );

-- Ratings: parties can read ratings for their transactions; can insert own rating for the other party
create policy "ratings_select_party"
  on public.ratings for select
  using (
    exists (
      select 1 from public.transactions t
      where t.id = transaction_id and (t.buyer_id = auth.uid() or t.farmer_id = auth.uid())
    )
  );
create policy "ratings_insert_party"
  on public.ratings for insert
  with check (
    rater_id = auth.uid()
    and ratee_id <> auth.uid()
    and exists (
      select 1 from public.transactions t
      where t.id = transaction_id and (t.buyer_id = auth.uid() or t.farmer_id = auth.uid())
    )
  );
