-- Fix: Show agreed deals as completed and fix trigger for new ones.
-- Run in Supabase SQL Editor if transactions are stuck as "pending".

-- 1) Mark all existing pending transactions as completed (deal was agreed)
update public.transactions set status = 'completed' where status = 'pending';

-- 2) Ensure new transactions are created as completed (update the trigger)
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

  update public.listings
  set total_quantity = coalesce(total_quantity, v_remaining),
      remaining_quantity = greatest(0, coalesce(remaining_quantity, v_remaining) - v_agreed_qty),
      status = case when (coalesce(remaining_quantity, v_remaining) - v_agreed_qty) <= 0 then 'sold' else status end
  where id = new.listing_id;

  return new;
end;
$$;
