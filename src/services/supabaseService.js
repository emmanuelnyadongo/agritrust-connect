import { createClient } from '@supabase/supabase-js';

const url = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL
  ? import.meta.env.VITE_SUPABASE_URL
  : process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(url, anonKey);

// --- Auth ---
export async function signUp({ email, password, role, name, location }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw authError;
  if (!authData?.user) return { data: null, error: authError };
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    role,
    name: name || '',
    location: location || null,
  }, { onConflict: 'id' });
  if (profileError) throw profileError;
  return { data: authData, error: null };
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

// --- Profile ---
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Listings ---
const listingSelect = 'id, farmer_id, produce, variety, quantity, unit, quality, location, price_per_unit, market_low, market_high, market_median, available_from, available_until, description, status, created_at, farmer:profiles!farmer_id(id, name, rating, completed_transactions)';

export async function getListings(filters = {}) {
  let q = supabase
    .from('listings')
    .select(listingSelect)
    .order('created_at', { ascending: false });
  if (filters.status) q = q.eq('status', filters.status);
  if (filters.farmerId) q = q.eq('farmer_id', filters.farmerId);
  if (filters.produce) q = q.ilike('produce', `%${filters.produce}%`);
  if (filters.location) q = q.eq('location', filters.location);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getListingById(id) {
  const { data, error } = await supabase
    .from('listings')
    .select(listingSelect)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createListing(row) {
  const { data, error } = await supabase
    .from('listings')
    .insert(row)
    .select(listingSelect)
    .single();
  if (error) throw error;
  return data;
}

export async function updateListing(id, updates) {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select(listingSelect)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteListing(id) {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
}

// --- Negotiations ---
const negotiationSelect =
  'id, listing_id, buyer_id, status, system_guidance, created_at, updated_at,' +
  ' listing:listings(id, produce, variety, quantity, unit, farmer:profiles!farmer_id(id, name)),' +
  ' buyer:profiles!buyer_id(id, name)';

export async function createNegotiation({ listingId, buyerId, systemGuidance }) {
  const { data, error } = await supabase
    .from('negotiations')
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      system_guidance: systemGuidance ?? null,
    })
    .select(negotiationSelect)
    .single();
  if (error) throw error;
  return data;
}

export async function getNegotiationById(id) {
  const { data, error } = await supabase
    .from('negotiations')
    .select(negotiationSelect)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getNegotiationsForUser(userId, role) {
  let q = supabase.from('negotiations').select(negotiationSelect).order('updated_at', { ascending: false });
  if (role === 'farmer') {
    const { data: myListings } = await supabase.from('listings').select('id').eq('farmer_id', userId);
    const ids = (myListings || []).map((l) => l.id);
    if (ids.length === 0) return [];
    q = q.in('listing_id', ids);
  } else {
    q = q.eq('buyer_id', userId);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateNegotiationStatus(id, status) {
  const { data, error } = await supabase
    .from('negotiations')
    .update({ status })
    .eq('id', id)
    .select(negotiationSelect)
    .single();
  if (error) throw error;
  return data;
}

// --- Offers ---
export async function getOffersByNegotiationId(negotiationId) {
  const { data, error } = await supabase
    .from('offers')
    .select('id, negotiation_id, from_role, price, note, created_at')
    .eq('negotiation_id', negotiationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createOffer({ negotiationId, fromRole, price, note }) {
  const { data, error } = await supabase
    .from('offers')
    .insert({
      negotiation_id: negotiationId,
      from_role: fromRole,
      price: Number(price),
      note: note || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- Transactions ---
const transactionSelect = 'id, produce, quantity, agreed_price, date, status, buyer:profiles!buyer_id(id, name), farmer:profiles!farmer_id(id, name)';

export async function getTransactionsForUser(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select(transactionSelect)
    .or(`buyer_id.eq.${userId},farmer_id.eq.${userId}`)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

// --- Realtime ---
export function subscribeToOffers(negotiationId, onInsert) {
  return supabase
    .channel(`offers:${negotiationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'offers', filter: `negotiation_id=eq.${negotiationId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe();
}

export function subscribeToNegotiation(negotiationId, onUpdate) {
  return supabase
    .channel(`negotiation:${negotiationId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'negotiations', filter: `id=eq.${negotiationId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();
}

export { supabase };
