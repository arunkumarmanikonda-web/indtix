# INDTIX — India's Next-Gen Live Event Platform

> **Your Ticket to Unforgettable.** — By Oye Imagine Private Limited

---

## 🚀 Production URLs

| Portal | URL | Description |
|--------|-----|-------------|
| **Portal Hub** | https://0f3c4d6d.indtix.pages.dev/portals | All portals navigation |
| **Fan Portal** | https://0f3c4d6d.indtix.pages.dev/fan | Public event discovery & booking |
| **Organiser Portal** | https://0f3c4d6d.indtix.pages.dev/organiser | Event creation & management |
| **Venue Portal** | https://0f3c4d6d.indtix.pages.dev/venue | Venue management dashboard |
| **Event Manager** | https://0f3c4d6d.indtix.pages.dev/event-manager | Live event operations |
| **Super Admin ERP** | https://0f3c4d6d.indtix.pages.dev/admin | Full platform control |
| **Ops / POS** | https://0f3c4d6d.indtix.pages.dev/ops | On-ground QR scanner & POS |
| **Brand System** | https://0f3c4d6d.indtix.pages.dev/brand | INDTIX brand guidelines v2.0 |
| **Architecture Spec** | https://0f3c4d6d.indtix.pages.dev/architecture-spec | Full technical blueprint |
| **System Architecture** | https://0f3c4d6d.indtix.pages.dev/architecture | Interactive architecture diagram |
| **Alias** | https://indtix.pages.dev | Production alias |

---

## 📊 Platform Stats (v2.0)

- **10 portals** served on Cloudflare's global edge (175 PoPs)
- **8,047 HTML lines** across all portal files
- **35.87 KB** Cloudflare Worker bundle
- **16 API endpoints** (REST JSON, all returning 200 OK)
- **5 git commits** on `main` branch
- All routes verified: `200 OK` on Cloudflare Pages

---

## ✅ Completed Features

### Fan Portal (`/fan` — 1,298 lines)
- Event discovery grid with search, filters (category, city)
- Interactive seat map (GA, Premium, VIP, Accessible zones)
- 10-min seat reservation timer
- Add-ons pre-order (F&B Combo, Merch T-Shirt, Parking)
- Full checkout flow with UPI/Card/NetBanking/Wallet/EMI/BNPL
- GST-inclusive pricing with invoice display
- OTP + Social (Google/Facebook) auth modals
- City picker (12 Indian cities)
- My Account panel (bookings, wishlist, wallet, refunds)
- Refund/cancellation flow with reason selector
- INDY AI chatbot (event recommendations, FAQ, booking help)
- Booking confirmation with QR code + ticket PDF
- Promo code support (FEST20, MUSIC10, FIRST100)
- Toast notifications, particle hero animation

### Organiser Portal (`/organiser` — 1,058 lines)
- Multi-step event creation wizard
- Ticket tier builder (GA, Premium, VIP, Accessible)
- Interactive seat map builder
- Add-ons & F&B configuration
- Real-time revenue analytics & charts
- KYC onboarding with document upload
- Settlement management (T+7 payout)
- GST invoice management
- Attendee list with export
- Marketing tools (promo codes, email campaigns)
- WhatsApp/email notification settings
- LED band configuration panel
- Team/RBAC delegation
- Brand/CRM panel

### Venue Portal (`/venue` — 651 lines)
- Availability calendar
- Zone capacity management
- Floor plan builder
- Pricing tiers (weekday/weekend/festival)
- Booking enquiries with approval workflow
- Staff access management
- GST invoice generation (GSTIN: 27AABCO1234A1Z5)
- Incident reporting
- Revenue dashboard

### Event Manager Portal (`/event-manager` — 739 lines)
- Live event operations command centre
- Run sheet & timeline management
- Task manager with priority levels
- Real-time gate-by-gate check-in monitor
- POS overview
- F&B & merchandise tracking
- Announcements push (WhatsApp/SMS)
- Incident log
- Wristband/LED band management
- Post-event report builder

### Super Admin ERP (`/admin` — 940 lines — 25 panels)
- Platform dashboard (GMV ₹4.2 Cr, 124.5K tickets, 84.2K DAU)
- System health monitor
- Organiser/venue/event approvals queue
- KYC review & compliance
- Finance ERP (revenue, settlements, refunds)
- GST engine (IGST/CGST+SGST auto-split)
- CMS (banners, FAQs, homepage content)
- User management + fraud detection
- BI & AI analytics dashboard
- RBAC (9 roles, permission matrix)
- Security centre + audit logs
- Platform config
- Support desk, city/category manager
- Compliance/legal, partner CRM, risk/fraud queue
- HR-lite team management

### Ops / POS Portal (`/ops` — 481 lines)
- QR code scanner with audio (beep) + visual feedback
- Manual ticket entry fallback
- Valid/Invalid/Duplicate scan result panels
- Full POS terminal (merchandise, F&B)
- NFC wristband manager + LED band control
- Live entry stats (Checked-In: 2,841 / Remaining: 1,359 / 68%)
- Gate-wise entry tracking (Gate 1 892/1000 89%)
- Scan log with timestamp

### Brand System (`/brand` — 898 lines)
- Logo variants (primary dark, wordmark, light, gradient, black, favicon sizes)
- Full colour palette with usage rules (12 colours)
- Typography scale (Space Grotesk + Inter, 7 levels)
- 12 approved slogans & punchlines
- Voice & tone guide (6 principles with do/don't examples)
- Microcopy library (16 UI copy examples)
- Core UI components (buttons, badges, event card, toasts, inputs, progress)
- Motion system (6 animations with easing specs)
- Do's & Don'ts (9 each)
- INDTIX Manifesto
- Legal disclaimer templates (5 templates: ticket, organiser, email, WhatsApp, event day)
- Iconography guide (Font Awesome 6, 20 platform icons)

### Architecture Spec (`/architecture-spec` — 1,198 lines)
- Executive product vision, mission, 3-year targets
- Information architecture diagram
- Roles & Permissions Matrix (9 roles × 7 permissions)
- Full technology stack (12 categories: frontend, backend, data, comms, AI, security, analytics, payments, search, CMS, observability, DevOps)
- System architecture diagram (4 layers)
- Monolith → Microservices migration strategy
- API Design Specification (22 endpoints with request/response examples)
- Database Schema (12 D1 SQLite tables with field types and relationships)
- 4 key data flows (booking, check-in, refund, settlement)
- BI/Analytics architecture (3 tiers: real-time, operational, strategic)
- Security & Privacy architecture (DPDPA 2023, PCI DSS, anti-fraud)
- AI/ML Roadmap (6 modules across 3 phases)
- DevOps, CI/CD, SLA & monitoring specs
- 3-phase launch plan (MVP → Growth → Enterprise)
- Risk Register (10 risks with mitigations)
- Open Issues & Assumptions

---

## 🔌 API Endpoints (v1.1.0)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Platform health + portal list |
| GET | `/api/events` | Events (filter: city, category, q, page) |
| GET | `/api/events/:id` | Event detail + tiers + add-ons + policies |
| GET | `/api/cities` | Cities with event counts |
| GET | `/api/categories` | Event categories with counts |
| GET | `/api/venues` | Verified venue list |
| GET | `/api/admin/stats` | Platform KPIs + finance metrics |
| POST | `/api/bookings` | Create booking + GST calculation |
| GET | `/api/bookings/:id` | Booking detail + QR |
| POST | `/api/scan/verify` | QR code validation (VALID/DUPLICATE/INVALID) |
| POST | `/api/ai/chat` | INDY AI chatbot |
| POST | `/api/promo/validate` | Promo code validation |
| GET | `/api/gst/invoice/:id` | GST invoice for booking |
| POST | `/api/notifications/send` | Notification dispatch |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Edge Runtime | Cloudflare Workers (175 global PoPs) |
| API Framework | Hono v4 + TypeScript 5 |
| Frontend | Vanilla JS + Tailwind CSS (CDN) + Font Awesome 6 |
| Build Tool | Vite v6 + Wrangler v4 |
| Database | Cloudflare D1 (SQLite) |
| Cache/Sessions | Cloudflare KV |
| File Storage | Cloudflare R2 |
| AI/Embeddings | Cloudflare Workers AI + Vectorize |
| Payments | Razorpay + Cashfree |
| Notifications | WhatsApp Business API + Resend (email) |
| Analytics | Cloudflare Analytics Engine + Mixpanel |

---

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.ts           # Hono API (16 routes, 35.87 KB worker)
├── public/
│   ├── fan.html            # Fan portal (1,298 lines)
│   ├── organiser.html      # Organiser portal (1,058 lines)
│   ├── venue.html          # Venue portal (651 lines)
│   ├── event-manager.html  # Event manager portal (739 lines)
│   ├── admin.html          # Super Admin ERP (940 lines)
│   ├── ops.html            # On-Ground Ops/POS (481 lines)
│   ├── portals.html        # Portal hub (402 lines)
│   ├── architecture.html   # Architecture diagram (382 lines)
│   ├── brand.html          # Brand system (898 lines)
│   └── architecture-spec.html # Tech blueprint (1,198 lines)
├── dist/                   # Build output (Cloudflare Pages)
├── wrangler.jsonc          # Cloudflare configuration
├── vite.config.ts          # Build configuration
├── ecosystem.config.cjs    # PM2 configuration
└── package.json            # Dependencies & scripts
```

---

## 🚀 Deployment

**Platform:** Cloudflare Pages + Workers  
**Project Name:** `indtix`  
**Production Branch:** `main`  
**Status:** ✅ Live  
**Deployed:** 2026-03-07  
**Latest Deployment:** `0f3c4d6d.indtix.pages.dev`

### Commands

```bash
# Local development
npm run build && pm2 start ecosystem.config.cjs

# Deploy to production
npm run build && npx wrangler pages deploy dist --project-name indtix --branch main

# D1 database (when connected)
npm run db:migrate:local    # Apply migrations locally
npm run db:migrate:prod     # Apply to production
```

---

## 🎯 Roadmap

- **Phase 1 (Done):** All 10 portals live on Cloudflare edge
- **Phase 2:** Connect D1 database, integrate Razorpay payment gateway, WhatsApp API
- **Phase 3:** Mobile app (React Native), recommendation engine, wristband NFC hardware
- **Phase 4:** Enterprise white-label, international expansion (UAE, Singapore)

---

## 📋 Data Architecture

| Model | Storage | Notes |
|-------|---------|-------|
| Users, Venues, Events | Cloudflare D1 (SQLite) | Relational data |
| Ticket Tiers, Bookings | Cloudflare D1 | With seat allocation |
| Sessions, Rate Limits | Cloudflare KV | Fast key-value |
| Ticket PDFs, KYC Docs | Cloudflare R2 | Object storage |
| AI Embeddings | Cloudflare Vectorize | INDY chatbot RAG |
| Scan Log, Audit Log | Cloudflare D1 | Immutable append-only |
| GST Invoices | Cloudflare D1 + R2 | With PDF generation |
| Wristbands/NFC | Cloudflare D1 | Physical device registry |

---

## 📜 Legal

**Owner:** Oye Imagine Private Limited  
**GSTIN:** 27AABCO1234A1Z5  
**Trademark:** INDTIX® (registered trademark of Oye Imagine Private Limited)  
© 2025 Oye Imagine Private Limited. All rights reserved.
