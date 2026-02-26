# AgriTrust â€” Backend Architecture and Documentation

This document describes the backend design for AgriTrust, a negotiation-focused agricultural marketplace. The backend is implemented using **Supabase** as a Backend-as-a-Service (BaaS) platform. The frontend is a React SPA that consumes Supabase APIs directly; there is no custom application server.

---

## Backend Overview

### Role of Supabase

Supabase provides the core backend capabilities: **PostgreSQL** for persistence, **Authentication service** for identity, **Row Level Security (RLS)** for authorization, and **auto-generated REST and Realtime APIs** over the database. The frontend talks to Supabase via the official `@supabase/supabase-js` client using the project URL and the anon (public) key. Authenticated requests carry a JWT; RLS policies restrict which rows each user can read or write.

Supabase is treated as the **backend platform**, not as a thin wrapper. Design decisionsâ€”schema, constraints, and policiesâ€”are made with the same rigor as for a custom server. The main difference is that business rules are enforced in the database and in Supabase-specific features (Auth, RLS, Realtime) rather than in application server code.

### Why Supabase Over a Custom Backend

| Criterion | Supabase | Custom backend (e.g. Node + PostgreSQL) |
|-----------|----------|----------------------------------------|
| **Delivery scope** | Single platform for auth, DB, and API | Multiple services to build and operate |
| **Auth** | Built-in (email/password, magic link, etc.) with JWTs | Custom implementation or integration of a third-party auth service |
| **Authorization** | RLS enforces per-row access in the database | Middleware + application logic; risk of bypass if a route is missed |
| **API surface** | Auto-generated from schema; Realtime subscriptions | Hand-written REST or GraphQL; realtime requires extra work |
| **Operational burden** | Supabase hosts DB and APIs; backups and scaling managed | Self-host or use separate DB + app hosting |

For a capstone project with a working frontend and limited time, Supabase allows the team to focus on **data model**, **security policies**, and **frontend integration** instead of standing up and securing a custom server. The tradeoff is less flexibility in custom middleware or non-PostgreSQL integrations; complex business logic that does not fit naturally into SQL or triggers may require Edge Functions or an external service later.

### High-Level Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Frontend (React SPA)                                            â”‚
â”‚  - Auth: Authentication service (signInWithPassword, signUp, session)     â”‚
â”‚  - Data: Supabase client (from(), insert(), update(), select())   â”‚
â”‚  - Realtime: subscribe() for negotiation updates                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                               â”‚ HTTPS (anon key + JWT)
                               â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Supabase                                                        â”‚
â”‚  - Auth: JWT issuance, session management                         â”‚
â”‚  - PostgREST: REST API over PostgreSQL                            â”‚
â”‚  - Realtime: Broadcast changes on tables                         â”‚
â”‚  - PostgreSQL: Tables, RLS, triggers, functions                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

There is no intermediary API server. All â€œbackendâ€ behaviour is implemented by Supabase and by database objects (tables, RLS policies, triggers, and optional functions).

---

## Authentication and Authorization

### Authentication Flow (Authentication service)

1. **Sign up**  
   User submits email, password, and (in AgriTrust) role (farmer/buyer) and optional profile fields. The frontend calls `supabase.auth.signUp()`. Supabase creates the auth user and returns a session; the frontend then inserts or updates a row in `profiles` with `id = auth.uid()` and the chosen role.

2. **Sign in**  
   User submits email and password; frontend calls `supabase.auth.signInWithPassword()`. Supabase returns a session (access token JWT, refresh token). The client stores the session; subsequent requests to Supabase include the JWT in the `Authorization` header.

3. **Session persistence and refresh**  
   The Supabase client handles token refresh. Protected routes check `supabase.auth.getSession()` or listen to `onAuthStateChange`; if there is no session, the user is redirected to the sign-in page.

4. **Sign out**  
   Frontend calls `supabase.auth.signOut()`. The client clears the local session; the JWT is no longer valid for future requests.

No custom token issuance or password storage is implemented; Authentication service is the single source of truth for identity and session validity.

### Authorization Model (Roles and RLS)

Authorization is **role-based** and **row-level**:

- **Role**  
  Stored in `profiles.role` as `farmer` or `buyer`, set at sign-up (or by an admin flow) and used in RLS policies. The frontend can read `profiles` for the current user to show role-specific UI (e.g. â€œMy listingsâ€ for farmers, â€œStart negotiationâ€ for buyers).

- **Row Level Security**  
  Every table that holds user-specific or role-sensitive data has RLS enabled. Policies use `auth.uid()` and, where needed, `profiles.role` (via a join or helper function) to allow:
  - **Listings:** Farmers can insert/update/delete their own; buyers (and unauthenticated if desired) can only read active listings.
  - **Negotiations:** Only the participating farmer and buyer can read/write; offers are constrained by negotiation membership.
  - **Transactions:** Read by farmer and buyer; creation typically via a trigger or Edge Function when a negotiation is agreed.

Example policy concepts (details in Database Design):

- `profiles`: users can read/update only their own row.
- `listings`: farmer can CRUD own; others can SELECT where status is active (or similar).
- `negotiations`: participant (buyer or farmer) can SELECT/INSERT/UPDATE as appropriate.
- `offers`: only participants of the parent negotiation can INSERT; SELECT by negotiation participant.
- `transactions`: SELECT for buyer or farmer; INSERT restricted (e.g. via trigger or function).

This keeps authorization logic in one place (the database) and prevents the frontend from bypassing rules by calling the API with a different user context.

---

## Database Design

### Entity Relationship Summary

- **profiles** â€” One per auth user; extends Authentication service with `role`, `name`, `location`, and optional stats (e.g. `completed_transactions`, `rating`). Referenced by all other user-scoped tables.
- **listings** â€” Produce listings created by farmers; reference `profiles(farmer_id)`; include produce details, quantity, unit, quality, location, price, availability window, and status (`active`, `in_negotiation`, `sold`).
- **negotiations** â€” One per buyerâ€“listing pair (or per listing when only one active negotiation is allowed); reference `listings` and buyer/farmer from `profiles`; status (`active`, `agreed`, `declined`, `expired`); optional `system_guidance` (numeric) for price guidance.
- **offers** â€” One row per offer in a negotiation; reference `negotiations`; `from_role` (farmer/buyer), `price`, `note`, `created_at`.
- **transactions** â€” Record of agreed deals; reference negotiation or listing and buyer/farmer; agreed price, quantity, date, status (`completed`, `disputed`, `pending`).
- **market_reference_prices** (optional) â€” Reference data for produce type (e.g. 30-day low/high/median) used to compute or display â€œsystem guidanceâ€ in the UI.

### Tables, Relationships, and Constraints

- **profiles**  
  - `id` UUID PK, matches `auth.users.id` (FK to auth if desired).  
  - `role` text CHECK (`role IN ('farmer','buyer')`), NOT NULL.  
  - `name`, `location` text; `joined` timestamptz; `completed_transactions` int default 0; `rating` numeric(2,1).  
  - Unique on `id`.

- **listings**  
  - `id` UUID PK; `farmer_id` UUID NOT NULL FK â†’ `profiles(id)`.  
  - `produce`, `variety`, `quantity`, `unit`, `quality`, `location` text; `price_per_unit`, `market_low`, `market_high`, `market_median` numeric; `available_from`, `available_until` date; `description` text; `status` text CHECK (`status IN ('active','in_negotiation','sold')`); `created_at` timestamptz.  
  - Indexes on `farmer_id`, `status`, `created_at` (and optionally `produce`, `location`) for marketplace queries.

- **negotiations**  
  - `id` UUID PK; `listing_id` UUID NOT NULL FK â†’ `listings(id)`; `buyer_id` UUID NOT NULL FK â†’ `profiles(id)`; farmer implied by `listings.farmer_id`.  
  - `status` text CHECK (`status IN ('active','agreed','declined','expired')`); `system_guidance` numeric; `created_at`, `updated_at` timestamptz.  
  - Unique constraint on `(listing_id, buyer_id)` or business rule â€œone active negotiation per listingâ€ enforced in policy or trigger.

- **offers**  
  - `id` UUID PK; `negotiation_id` UUID NOT NULL FK â†’ `negotiations(id)`; `from_role` text CHECK (`from_role IN ('farmer','buyer')`); `price` numeric NOT NULL; `note` text; `created_at` timestamptz.  
  - Index on `negotiation_id` for â€œoffer historyâ€ queries.

- **transactions**  
  - `id` UUID PK; `listing_id` UUID FK â†’ `listings(id)`; `negotiation_id` UUID FK â†’ `negotiations(id)`; `buyer_id`, `farmer_id` UUID FK â†’ `profiles(id)`; `produce`, `quantity` text; `agreed_price` numeric; `date` date; `status` text CHECK (`status IN ('completed','disputed','pending')`).  
  - Ensures traceability and supports â€œtransaction historyâ€ views for both roles.

### Example SQL: Table Creation and RLS

The following is illustrative SQL for table creation and Row Level Security. It assumes a `profiles` table synced with Auth (e.g. via trigger on `auth.users`).

```sql
-- Profiles (extend auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('farmer', 'buyer')),
  name text not null,
  location text,
  joined timestamptz not null default now(),
  completed_transactions int not null default 0,
  rating numeric(2,1) default null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Listings
create table public.listings (
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

alter table public.listings enable row level security;

create policy "Anyone can read active listings"
  on public.listings for select
  using (status = 'active' or farmer_id = auth.uid());

create policy "Farmers can insert own listings"
  on public.listings for insert
  with check (farmer_id = auth.uid());

create policy "Farmers can update own listings"
  on public.listings for update
  using (farmer_id = auth.uid());

create policy "Farmers can delete own listings"
  on public.listings for delete
  using (farmer_id = auth.uid());

-- Negotiations
create table public.negotiations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'agreed', 'declined', 'expired')),
  system_guidance numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(listing_id, buyer_id)
);

alter table public.negotiations enable row level security;

create policy "Participants can read negotiation"
  on public.negotiations for select
  using (
    buyer_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid())
  );

create policy "Buyers can create negotiation"
  on public.negotiations for insert
  with check (buyer_id = auth.uid());

create policy "Participants can update negotiation"
  on public.negotiations for update
  using (
    buyer_id = auth.uid()
    or exists (select 1 from public.listings l where l.id = listing_id and l.farmer_id = auth.uid())
  );

-- Offers
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid not null references public.negotiations(id) on delete cascade,
  from_role text not null check (from_role in ('farmer', 'buyer')),
  price numeric not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.offers enable row level security;

create policy "Participants can read offers"
  on public.offers for select
  using (
    exists (
      select 1 from public.negotiations n
      left join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id
      and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );

create policy "Participants can insert offers"
  on public.offers for insert
  with check (
    exists (
      select 1 from public.negotiations n
      left join public.listings l on l.id = n.listing_id
      where n.id = negotiation_id
      and (n.buyer_id = auth.uid() or l.farmer_id = auth.uid())
    )
  );

-- Transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  negotiation_id uuid references public.negotiations(id),
  listing_id uuid references public.listings(id),
  buyer_id uuid not null references public.profiles(id),
  farmer_id uuid not null references public.profiles(id),
  produce text not null,
  quantity text not null,
  agreed_price numeric not null,
  date date not null default current_date,
  status text not null default 'pending' check (status in ('completed', 'disputed', 'pending'))
);

alter table public.transactions enable row level security;

create policy "Parties can read own transactions"
  on public.transactions for select
  using (buyer_id = auth.uid() or farmer_id = auth.uid());
```

Profile creation on sign-up can be done by the frontend (with an RLS policy allowing insert when `auth.uid() = id`) or by a database trigger on `auth.users` that inserts a row into `profiles` with default role; the frontend can then update role and name if needed.

---

## Server-Side Logic and APIs

### Enforcing Business Logic Without a Traditional Server

Business rules are enforced in the database and in Supabase features so that the frontend cannot bypass them:

1. **Row Level Security**  
   All mutable tables are protected by RLS. Even if the frontend sends a request with a different userâ€™s ID, Supabase uses the JWTâ€™s `auth.uid()` and the policy predicates; unauthorised rows are never returned or updated.

2. **Constraints**  
   CHECK constraints on `status` and `role` columns, NOT NULL on required fields, and foreign keys ensure referential integrity and valid state values. Invalid data is rejected by PostgreSQL.

3. **Triggers (optional)**  
   - On `negotiations.status` changing to `agreed`, a trigger can create a row in `transactions` and set the listingâ€™s status to `sold`.  
   - `updated_at` on `negotiations` can be maintained with a trigger.  
   - Profile stats (e.g. `completed_transactions`) can be updated via trigger when a transaction is inserted or its status becomes `completed`.

4. **Computed or reference data**  
   â€œSystem guidanceâ€ can be: (a) stored in `negotiations.system_guidance` and set by the frontend from a read of `market_reference_prices` or an Edge Function; or (b) computed in a database function and exposed via a view or RPC. Either way, the backend (DB or Edge Function) is the source of truth; the frontend only displays it.

5. **Supabase Realtime**  
   The frontend can subscribe to `negotiations` and `offers` (with RLS applied) so that when the other party adds an offer or updates the negotiation, the UI updates without polling. This keeps the â€œnegotiation roomâ€ in sync.

There is no separate API server; â€œserver-sideâ€ logic is exactly this combination of RLS, constraints, triggers, and optional Edge Functions or views.

### Example API Usage from the Frontend

The following snippets show how the existing frontend patterns map to Supabase client calls. The frontend would replace mock data with these.

**Authentication (sign in, sign up, session)**

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// Sign up: create auth user then upsert profile with role
async function signUp(email: string, password: string, role: 'farmer' | 'buyer', name: string, location: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw authError;
  if (!authData.user) return;
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    role,
    name,
    location,
    joined: new Date().toISOString(),
  });
  if (profileError) throw profileError;
}

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

// Get current session / user
const { data: { session } } = await supabase.auth.getSession();
const userId = session?.user?.id;
```

**Read: marketplace listings (public, filtered)**

```ts
const { data: listings, error } = await supabase
  .from('listings')
  .select(`
    id, produce, variety, quantity, unit, quality, location, price_per_unit,
    market_low, market_high, market_median, available_from, available_until,
    description, status, created_at,
    farmer:profiles!farmer_id(id, name, rating, completed_transactions)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

**Read: single listing (for detail page)**

```ts
const { data: listing, error } = await supabase
  .from('listings')
  .select(`
    *, farmer:profiles!farmer_id(id, name, rating, completed_transactions)
  `)
  .eq('id', listingId)
  .single();
```

**Insert: create negotiation (buyer)**

```ts
const { data: negotiation, error } = await supabase
  .from('negotiations')
  .insert({
    listing_id: listingId,
    buyer_id: session.user.id,
    status: 'active',
    system_guidance: marketMedianFromReference, // from market_reference_prices or computed
  })
  .select()
  .single();
```

**Insert: add offer (farmer or buyer)**

```ts
const { data: offer, error } = await supabase
  .from('offers')
  .insert({
    negotiation_id: negotiationId,
    from_role: currentUserRole, // 'farmer' | 'buyer' from profiles
    price: parseFloat(newPrice),
    note: newNote.trim() || null,
  })
  .select()
  .single();
```

**Update: listing status (e.g. in_negotiation when negotiation starts)**

```ts
await supabase
  .from('listings')
  .update({ status: 'in_negotiation' })
  .eq('id', listingId);
```

**Update: negotiation status (e.g. agree / decline)**

```ts
await supabase
  .from('negotiations')
  .update({ status: 'agreed', updated_at: new Date().toISOString() })
  .eq('id', negotiationId);
```

**Protected read: my transactions (farmer or buyer)**

```ts
const { data: transactions, error } = await supabase
  .from('transactions')
  .select(`
    id, produce, quantity, agreed_price, date, status,
    buyer:profiles!buyer_id(id, name),
    farmer:profiles!farmer_id(id, name)
  `)
  .or(`buyer_id.eq.${userId},farmer_id.eq.${userId}`)
  .order('date', { ascending: false });
```

**Realtime: subscribe to offers for a negotiation**

```ts
const channel = supabase
  .channel(`negotiation:${negotiationId}`)
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'offers', filter: `negotiation_id=eq.${negotiationId}` },
    (payload) => {
      setOffers((prev) => [...prev, payload.new]);
    }
  )
  .subscribe();
// Cleanup: channel.unsubscribe();
```

These examples align with the existing UI: marketplace list, listing detail, negotiation room (with offer history and system guidance), transaction history, and role-based â€œmy listingsâ€ / â€œmy negotiationsâ€ (filtering by `farmer_id` or `buyer_id` in the same way the mock uses `currentUser.id`).

---

## Deployment and Infrastructure

### How the Backend is Hosted

- **Backend-as-a-Service platform**  
  The backend uses a BaaS platform (e.g., Supabase) that provides:  
  - PostgreSQL database (hosted);  
  - Auth (hosted);  
  - Auto-generated REST API (e.g., PostgREST);  
  - Realtime (hosted);  
  - Optional: Storage and Edge Functions if needed later.

- **Configuration**  
  Backend configuration involves setting up the database schema and security policies. No custom server is deployed; â€œdeploying the backendâ€ means running migrations (the SQL above) in your database management interface or via a migration tool, and ensuring RLS and triggers are in place.

- **Secrets**  
  Public API keys can be used in the browser as they are restricted by Row Level Security policies. Service role keys or admin credentials must never be exposed in the frontend; it is used only for administrative operations or trusted server-side code if introduced later.

### How the Frontend Connects

- **Build**  
  The frontend is a static React SPA (e.g. Vite build). It is deployed to any static host (Vercel, Netlify, GitHub Pages, or a simple web server).

- **Environment Variables**  
  At build or runtime, the app requires environment variables that specify:
  - Backend service URL (e.g., `VITE_SUPABASE_URL` for Supabase)  
  - Public API key (e.g., `VITE_SUPABASE_ANON_KEY` for Supabase)  

  These are read via `import.meta.env` in Vite and baked into the client. For production, they are set in the hosting platformâ€™s environment and point to the production backend instance.

- **CORS**  
  The backend service should be configured to allow requests from the frontend origin. Most BaaS platforms handle CORS automatically for their hosted services.

- **No backend URL**  
  The frontend does not call a custom backend; all data and auth go to the backend service URL. Thus â€œbackend deploymentâ€ is independent of the frontend; only env vars and migration state need to be kept in sync.

### Summary

| Component | Responsibility |
|-----------|----------------|
| Database (PostgreSQL) | Persistence, constraints, RLS, triggers |
| Auth Service | Identity, sessions, JWTs |
| REST API (e.g., PostgREST) | CRUD operations and protected queries |
| Realtime Service | Live updates for negotiation/offers |
| Frontend | Auth UI, API calls via backend client, Realtime subscriptions |

This document is intended for academic and technical evaluation: it explains the backend architecture, the choice of Supabase, authentication and authorization, the database design with example SQL and RLS, how business logic is enforced without a traditional server, example frontend API usage, and deployment and infrastructure.
