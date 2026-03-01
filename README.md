# AgriTrust

> A negotiation-focused agricultural marketplace for smallholder farmers.

**Repository:** [github.com/emmanuelnyadongo/agritrust-connect](https://github.com/emmanuelnyadongo/agritrust-connect)  
**Live app (deployed):** [agritrust-connect-theta.vercel.app](https://agritrust-connect-theta.vercel.app/)

---

## Submission (Attempt 1)

| Item | Link / location |
|------|------------------|
| **Deployed app** | [https://agritrust-connect-theta.vercel.app/](https://agritrust-connect-theta.vercel.app/) |
| **Demo video (≈5 min)** | [View Video Demo](https://www.awesomescreenshot.com/video/49250805?key=8b27c8e6aed4459b93cd1c43f6794d4b) — focus on core functionalities (marketplace, listing, negotiation, transaction, ratings) |
| **Install & run** | See [How to Set Up the Environment and the Project](#how-to-set-up-the-environment-and-the-project) below (step-by-step). |
| **Related files** | See [Related files to the project](#related-files-to-the-project) below. |

---

## ðŸ“¹ Video Demonstration

**Watch the project demonstration video:** [View Video Demo](https://www.awesomescreenshot.com/video/49250805?key=8b27c8e6aed4459b93cd1c43f6794d4b)

The video covers frontend development, backend architecture, database schema, and a live walkthrough of key functionalities.

---

## Description

**AgriTrust** is a B2B web application designed to support fairer price negotiation between smallholder farmers and produce buyers in Zimbabwe.

Most digital agriculture platforms focus on access or aggregation. AgriTrust focuses on **the negotiation moment**â€”introducing data-informed price guidance directly into buyerâ€“farmer discussions while keeping final decisions in human hands.

- The system **does not** fix prices.
- The system **does not** replace intermediaries.
- The system **supports** informed negotiation.

---

## The Problem

Smallholder farmers often negotiate under pressure. Buyers usually have better information about:

- Current market prices
- Demand levels
- Alternative supply sources

Farmers, especially when dealing with perishable goods, are forced to accept unfavourable prices due to information imbalance and urgency.

Existing digital platforms either **centralise pricing authority** or **provide price information outside the transaction flow**. In both cases, farmers remain price takers.

---

## What AgriTrust Does Differently

AgriTrust embeds negotiation support into the transaction itself.

| Instead ofâ€¦ | The system providesâ€¦ |
|-------------|-------------------------|
| Static price lists | Real-time market price ranges |
| Informal off-platform bargaining | Contextual price recommendations |
| â€” | Transparent reasoning behind guidance |

Negotiation remains between people. The system acts as an **evidence layer**.

---

## How to Set Up the Environment and the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### 1. Clone the repository

```bash
git clone https://github.com/emmanuelnyadongo/agritrust-connect.git
cd agritrust-connect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (or set these in your hosting platform for production):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your [Supabase](https://supabase.com) project: **Settings → API**. Run the SQL in `supabase/schema.sql`, `supabase/policies.sql`, and the migrations in `supabase/migrations/` in the Supabase SQL Editor to set up the database.

### 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser. The app uses **Supabase** for authentication, data storage, and real-time updates. See [Backend Architecture](docs/BACKEND.md) for schema, RLS, and API usage.

### 5. (Optional) Build for production

```bash
npm run build
```

Output is in `dist/`. Deploy that folder to any static host (e.g. Vercel); set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host environment.

---

## Related files to the project

| Purpose | Files / folders |
|--------|------------------|
| **Frontend app** | `src/` — `pages/` (Dashboard, Marketplace, ListingDetail, NewListing, NewNegotiation, NegotiationRoom, Transactions, TransactionDetail, Profile, Entry), `components/`, `layouts/`, `hooks/`, `services/`, `utils/` |
| **Backend (Supabase)** | `supabase/schema.sql`, `supabase/policies.sql`, `supabase/migrations/` (001, 002, 003) |
| **API & auth** | `src/services/supabaseService.js` — listings, negotiations, offers, transactions, messages, ratings |
| **Negotiation logic** | `src/utils/negotiationGuidance.ts` — rule-based price guidance |
| **Config** | `package.json`, `vite.config.ts`, `.env` (create from `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) |
| **Docs** | `docs/BACKEND.md` (architecture), `docs/PROPOSAL_REQUIREMENTS_CHECKLIST.md` (research alignment) |

---

## Designs

### Screenshots

Screenshots of the AgriTrust application across mobile, tablet, and desktop views:

#### Desktop Views

<details>
<summary><strong>Authentication & Entry</strong></summary>

**Sign-in Page**
![Sign-in (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083737-af25faac-fb77-4f91-9da3-876e6f1ecaf.png)

The sign-in interface with role selection (Farmer/Buyer), email/password fields, and platform information.

</details>

<details>
<summary><strong>Marketplace</strong></summary>

**Available Produce**
![Marketplace (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083757-98204bbd-84bc-4581-91db-d5ce95d285d2.png)

Browse available produce with search, region filters, and detailed listings showing farmer ratings, quantities, prices, and market ranges.

</details>

<details>
<summary><strong>Negotiations</strong></summary>

**Active Negotiations**
![Active Negotiations (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083816-90f33985-5ba1-4b13-94b0-d5be1c30c8fe.png)

View active negotiations with current prices, system guidance, and offer counts.

</details>

<details>
<summary><strong>Transactions</strong></summary>

**Transaction History**
![Transaction History (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083835-0707e42d-628e-4e90-a10e-877424d4606e.png)

Complete transaction records with dates, produce details, parties, agreed prices, and status indicators.

</details>

<details>
<summary><strong>Profile</strong></summary>

**User Profile**
![Profile (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083847-3d1a5adf-518b-4fe4-ae9b-38ed114ab7bb.png)

User profile showing identity, activity summary, trust score, and consistency indicators.

</details>

<details>
<summary><strong>Dashboard</strong></summary>

**Farmer Dashboard**
![Farmer Dashboard (Desktop)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_083903-7f6bdbc5-a6d7-487f-84f0-250deb331141.png)

Farmer dashboard with market price signals, active listings, negotiations, and recent transaction outcomes.

</details>

#### Mobile & Tablet Views

<details>
<summary><strong>Mobile Authentication</strong></summary>

**Sign-in (Mobile)**
![Sign-in (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084213-7ba419ed-03a8-4870-bef4-c6dc01d196c2.png)

Mobile-optimized sign-in interface with role selection and form fields.

</details>

<details>
<summary><strong>Mobile Marketplace</strong></summary>

**Available Produce (Mobile)**
![Marketplace (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084224-a12e680a-5b6c-470f-9882-c436b7cef93c.png)

Mobile marketplace view with card-based listings, search, and region filters.

</details>

<details>
<summary><strong>Mobile Negotiations</strong></summary>

**Active Negotiations (Mobile)**
![Active Negotiations (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084234-eeb2a001-7128-4898-81e9-8aba71417006.png)

Mobile view of active negotiations with compact card layout.

</details>

<details>
<summary><strong>Mobile Transactions</strong></summary>

**Transaction History (Mobile)**
![Transaction History (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084244-e67af5cf-85a4-4076-8928-bfc4135d3eb4.png)

Mobile transaction history with scrollable card-based layout and status indicators.

</details>

<details>
<summary><strong>Mobile Profile</strong></summary>

**Profile (Mobile)**
![Profile (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084253-202da541-f946-4459-90b9-283877c420ef.png)

Mobile profile view with identity, activity summary, and trust score.

</details>

<details>
<summary><strong>Mobile Dashboard</strong></summary>

**Farmer Dashboard (Mobile)**
![Farmer Dashboard (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084304-430897cd-0d67-4aa6-9dfe-94920de328d0.png)

Mobile dashboard with market signals, listings, and recent outcomes.

**Navigation Sidebar (Mobile)**
![Navigation Sidebar (Mobile)](docs/screenshots/c__Users_HomePC_AppData_Roaming_Cursor_User_workspaceStorage_0e2f7595d2a88199143eada594fa6e70_images_Screenshot_2026-02-09_084315-a6e9ab14-dd1d-4a1d-b89a-60dd89999a98.png)

Mobile navigation drawer with menu items and sign-out option.

</details>

### Additional Design Resources
 
- **Architecture diagram:** See [Backend Architecture](docs/BACKEND.md) for frontend â†” Supabase flow diagram.

---

## Deployment Plan

The app is deployed with a Supabase backend and a static frontend.

| Component        | Approach |
|-----------------|----------|
| **Frontend**    | Build with `npm run build` (output in `dist/`). Deploy to Vercel, Netlify, or any static host. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's environment. |
| **Backend**     | **Supabase** hosts PostgreSQL, Authentication, and Realtime. Run `supabase/schema.sql`, `supabase/policies.sql`, and the scripts in `supabase/migrations/` in your Supabase project (SQL Editor or CLI). No separate application server is used. |
| **Environment** | Production frontend connects to your production Supabase project via the same two environment variables. |

---

## Core Concepts

| Principle | Meaning |
|-----------|---------|
| **Negotiation over automation** | The platform assists decision-making rather than replacing it. |
| **Transparency over optimisation** | Users see why price guidance exists, not just the result. |
| **Agency over control** | Farmers and buyers retain full authority over outcomes. |
| **Trust over growth metrics** | Design prioritises traceability, consistency, and accountability. |

---

## Key Features

### Produce Marketplace

- Structured produce discovery
- Contextual information over visual tiles
- Emphasis on quantity, timing, and location

### Assisted Negotiation Room

- Clear offer history
- Side-by-side price comparison
- System-generated price guidance with explanation
- No chat-style negotiation UI

### Market Price Analytics

- Historical and reference price ranges
- Used to inform, not enforce, negotiation

### Transaction Records

- Traceable and auditable transaction history
- Post-deal messaging and contact details (including phone)
- Optional 1–5 star ratings that update trust scores
- Payment note clarifying that payment is arranged off-platform

### Role-Based Dashboards

- **Farmer:** Listings and negotiations
- **Buyer:** Availability and market context

---

## User Roles

### Farmer

- Create and manage produce listings
- Enter negotiations with buyers
- View price guidance during negotiation
- Review past transaction outcomes

### Buyer

- Discover available produce
- Initiate and participate in negotiations
- View market context during price discussion
- Maintain transaction records

---

## User Flow Overview

1. Farmer posts produce with quantity and availability details.
2. Buyer discovers produce via the marketplace.
3. Buyer initiates negotiation.
4. System provides price guidance based on market data.
5. Users exchange offers.
6. Agreement is reached or negotiation ends.
7. Transaction is recorded for traceability.

The flow avoids forced steps and allows natural movement between actions.

---

## Tech Stack

### Frontend

- **React** · **TypeScript/JavaScript** · **Vite**
- Component-based architecture, mobile-first responsive design
- TanStack Query for data; Supabase client for auth and API

### Backend

- **Supabase**: PostgreSQL database, Authentication, Row Level Security (RLS), Realtime (offers and negotiation updates)
- **Schema**: `profiles`, `listings`, `negotiations`, `offers`, `transactions`, `transaction_messages`, `ratings`, `market_reference_prices`; triggers for transaction creation and profile stats
- Negotiation guidance is computed in the frontend from listing market data (rule-based heuristic)

**Backend architecture and design** are documented in **[docs/BACKEND.md](docs/BACKEND.md)**. A **[proposal requirements checklist](docs/PROPOSAL_REQUIREMENTS_CHECKLIST.md)** maps the implementation to the research objectives.

---

## Project Structure

Main app code lives in `src/`; Supabase schema, policies, and migrations are in `supabase/`.

```
src/
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ navigation/
â”‚   â”œâ”€â”€ listings/
â”‚   â”œâ”€â”€ negotiation/
â”‚   â”œâ”€â”€ analytics/
â”‚   â””â”€â”€ feedback/
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ dashboard/
â”‚   â”œâ”€â”€ marketplace/
â”‚   â”œâ”€â”€ listing-detail/
â”‚   â”œâ”€â”€ negotiation-room/
â”‚   â”œâ”€â”€ transactions/
â”‚   â””â”€â”€ profile/
â”œâ”€â”€ layouts/
â”œâ”€â”€ hooks/
â””â”€â”€ utils/
```

This structure supports modular growth and clean API integration.

---

## Design Principles

- **Calm, non-flashy interface** â€” Green-focused palette without gradients.
- **Asymmetrical layouts** â€” To avoid generic SaaS patterns.
- **Content-driven structure** â€” Rather than marketing sections.

The UI is designed to feel closer to a cooperative or market board than a startup landing page.

---

## Project Status

The application is **fully integrated with Supabase**:

- **Frontend**: React (Vite), role-based dashboards, marketplace, listing creation, negotiation room with real-time offers, transaction history and detail (with messaging and ratings), profile with trust score and phone.
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime). Schema, policies, and migrations are in `supabase/`. Negotiation outcomes, agreed prices, and ratings are stored for pilot evaluation.
- **Pilot evaluation**: Negotiation and transaction data support analysis of outcomes and price variance. **User feedback** is collected via an external form (e.g. survey or interviews) in addition to in-app post-transaction star ratings.

---

## Motivation

This project is part of a **final-year software engineering capstone** and an applied research effort into negotiation support systems in smallholder agriculture.

> The goal is not scale at all costs.  
> The goal is **feasibility**, **fairness**, and **evidence**.
