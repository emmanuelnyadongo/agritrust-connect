# AgriTrust

> A negotiation-focused agricultural marketplace for smallholder farmers.

---

## Overview

**AgriTrust** is a B2B web application designed to support fairer price negotiation between smallholder farmers and produce buyers in Zimbabwe.

Most digital agriculture platforms focus on access or aggregation. AgriTrust focuses on **the negotiation moment**—introducing data-informed price guidance directly into buyer–farmer discussions while keeping final decisions in human hands.

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

| Instead of… | The system provides… |
|-------------|-------------------------|
| Static price lists | Real-time market price ranges |
| Informal off-platform bargaining | Contextual price recommendations |
| — | Transparent reasoning behind guidance |

Negotiation remains between people. The system acts as an **evidence layer**.

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
- Designed for accountability rather than engagement

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

- **React** · **JavaScript**
- Component-based architecture
- Mobile-first responsive design

### Backend (Planned)

- **Supabase** · **PostgreSQL**
- Authentication and role management
- Real-time updates
- Serverless functions for analytics and negotiation logic

---

## Project Structure

The frontend is organised to support backend integration later.

```
src/
├── components/
│   ├── navigation/
│   ├── listings/
│   ├── negotiation/
│   ├── analytics/
│   └── feedback/
├── pages/
│   ├── dashboard/
│   ├── marketplace/
│   ├── listing-detail/
│   ├── negotiation-room/
│   ├── transactions/
│   └── profile/
├── layouts/
├── hooks/
└── utils/
```

This structure supports modular growth and clean API integration.

---

## Design Principles

- **Calm, non-flashy interface** — Green-focused palette without gradients.
- **Asymmetrical layouts** — To avoid generic SaaS patterns.
- **Content-driven structure** — Rather than marketing sections.

The UI is designed to feel closer to a cooperative or market board than a startup landing page.

---

## Project Status

This repository currently focuses on:

- Frontend UI and UX design
- Component architecture
- User flow modelling

Backend integration will be added in later phases.

---

## Motivation

This project is part of a **final-year software engineering capstone** and an applied research effort into negotiation support systems in smallholder agriculture.

> The goal is not scale at all costs.  
> The goal is **feasibility**, **fairness**, and **evidence**.
