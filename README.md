# INDTIX — India's Premier Event Ticketing Platform

> *Experience More. Your Ticket to Unforgettable. Because FOMO is Real.*

## Project Overview

**INDTIX** is a full-stack, multi-portal event ticketing platform built as a District-by-Zomato hybrid — combining festival/event ticketing with a youthful, cheeky brand identity targeting India's live-entertainment generation.

- **Version**: 19.0.0
- **Phase**: 19 (Production-Ready)
- **API Endpoints**: 760+
- **QA Score**: 100% (69/69 tests passing)
- **Platform**: Cloudflare Pages + Workers + Hono TypeScript

---

## Live URLs

| Portal | Path | Description |
|--------|------|-------------|
| Fan / Customer | `/fan` | Event discovery, booking, wallet, loyalty |
| Organiser | `/organiser` | Event creation, analytics, KYC, settlements |
| Venue | `/venue` | Venue management, bookings, occupancy |
| Event Manager | `/event-manager` | Real-time check-in, capacity, ops |
| Super Admin | `/admin` | GMV, KYC queue, fraud, BI dashboard |
| On-Ground Ops | `/ops` | QR scan, vendor mgmt, alerts |
| Brand | `/brand` | Brand assets, voice & tone, micro-copy |
| Architecture | `/architecture-spec` | Full technical spec |
| Developer | `/developer` | API docs, schema, tech stack |

---

## Core Features (Phase 19)

### ✅ Completed
- **Multi-portal architecture** — 6 distinct portals with role-specific UX
- **KYC Workflow** — Auto-approve fans/individuals; manual queue for organisers/venues/businesses
- **Seat Map Engine** — Zone-based + numbered seat selection with admin editor and real-time hold timer
- **Add-on Engine** — F&B, merchandise (with sizing), experience upgrades, cart management
- **Checkout & Payment** — Razorpay/UPI integration, GST breakdowns (CGST/SGST/IGST), PDF invoices
- **Transactional Comms** — WhatsApp (Twilio), Email (SendGrid), per-event chatbot FAQ
- **AI Layer** — Fraud scoring, price optimisation, personalised recommendations, conversational chat
- **Loyalty & Gamification** — Points, tiers (Bronze→Platinum), badges, challenges, leaderboard
- **RBAC** — Deep role-based access control (fan/organiser/admin/ops/venue/em)
- **Analytics & BI** — Revenue funnels, audience insights, GMV dashboards
- **Brand Assets** — Logo concepts, taglines, voice & tone, micro-copy style guide

### 🏗 Architecture
- **Runtime**: Cloudflare Workers (edge-global)
- **Framework**: Hono v4 + TypeScript
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Storage**: Cloudflare D1 (SQLite), KV, R2
- **Auth**: JWT + OTP + Social (Google/Apple)
- **Payments**: Razorpay + Stripe
- **Comms**: Twilio (WhatsApp) + SendGrid (Email)

---

## API Surface

| Category | Endpoints |
|----------|-----------|
| Auth & Fan | ~80 |
| Events & Discovery | ~60 |
| Booking & Seat Map | ~70 |
| KYC & Verification | ~30 |
| Payments & GST | ~40 |
| Communications | ~25 |
| Organiser Portal | ~80 |
| Admin & BI | ~100 |
| Venue Portal | ~40 |
| Event Manager | ~35 |
| Ops Portal | ~30 |
| AI / ML | ~25 |
| Loyalty | ~25 |
| RBAC & Security | ~20 |
| Reports & Export | ~30 |
| **Total** | **760+** |

---

## Data Architecture

### Core Models
- **User** — fan, organiser, venue, em, admin, ops
- **Event** — multi-zone, add-ons, artists, FAQs, policies
- **Booking** — tickets, add-ons, GST invoice, QR code
- **KYC** — entity type, documents, status, reviewer audit trail
- **Seat Map** — zones, rows, seats, hold status, timer
- **Loyalty** — points, tiers, badges, challenges

### Storage Services
- **Cloudflare D1** — All relational data (users, events, bookings, KYC)
- **Cloudflare KV** — Sessions, rate limits, promo codes, config
- **Cloudflare R2** — Ticket PDFs, GST invoices, KYC documents, media

---

## User Guide (Quick Start)

1. **Fan** → Visit `/fan` → Browse events → Select seats → Add F&B/merch → Checkout → Download e-ticket
2. **Organiser** → Visit `/organiser` → Submit KYC → Create event → Set up seat map & add-ons → Go live → Track analytics
3. **Admin** → Visit `/admin` → Review KYC queue → Approve/reject → Monitor GMV, fraud alerts, GST reports
4. **Ops** → Visit `/ops` → Select event → Scan QR codes → Monitor crowd density & vendor sales

---

## Brand Identity

| Element | Value |
|---------|-------|
| **Primary Tagline** | Experience More. |
| **Secondary** | Your Ticket to Unforgettable. |
| **Tone** | Cheeky, youthful, bold — like your best friend who knows every secret gig in town |
| **Primary Color** | #FF3366 (Hot Pink) |
| **Secondary** | #1A1A2E (Deep Navy) |
| **Accent** | #FFD700 (Gold) |
| **Fonts** | Space Grotesk (headings), Inter (body) |

---

## Deployment

| Item | Value |
|------|-------|
| **Platform** | Cloudflare Pages |
| **Build command** | `npm run build` |
| **Output** | `dist/` |
| **Worker size** | ~406 KB |
| **Status** | ✅ Active |
| **Company** | Oye Imagine Private Limited |
| **GSTIN** | 27AABCO1234A1Z5 |

---

## Development

```bash
npm install          # Install dependencies
npm run build        # Build for production
npm run dev:sandbox  # Run locally (port 3000)
```

**Last Updated**: March 2026 — Phase 19
