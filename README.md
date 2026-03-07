# INDTIX Platform v5.0 — Phase 3

**India's most comprehensive event ticketing & management ecosystem** — 11 portals, 86 API endpoints, 79+ live fetch() integrations, full Phase 3 features live in production.

---

## 🌐 Live URLs

| Environment | URL |
|---|---|
| **Production (latest)** | https://e190c411.indtix.pages.dev |
| **Fan Portal** | https://e190c411.indtix.pages.dev/fan |
| **Organiser Portal** | https://e190c411.indtix.pages.dev/organiser |
| **Venue Portal** | https://e190c411.indtix.pages.dev/venue |
| **Event Manager Portal** | https://e190c411.indtix.pages.dev/event-manager |
| **Admin / ERP** | https://e190c411.indtix.pages.dev/admin |
| **Ops / POS** | https://e190c411.indtix.pages.dev/ops |
| **Developer Portal** | https://e190c411.indtix.pages.dev/developer |
| **API Health** | https://e190c411.indtix.pages.dev/api/health |

---

## ✅ Phase 3 — Completed Features (v5.0)

### 🎫 Fan Portal (`public/fan.html`) — Phase 3 Additions
| Feature | Details |
|---|---|
| **Fan Club / Artist Subscriptions** | Browse 6 fan clubs (Arijit Singh, Diljit Dosanjh, etc.), join for ₹499-₹1,999/yr, get early access & merch drops |
| **Livestream Ticketing** | Virtual/hybrid event streaming — 4 events with HD/4K tiers (₹199-₹799), chat, watch party |
| **Post-Event Merch Store** | 6 merchandise products (tees, hoodies, caps, collectibles), filter by category, cart & checkout |
| **Fan Club Account Tab** | Account panel "Fan Clubs" tab shows active memberships with tier badges |
| **Developer Portal Link** | Added to portals section with `⚡` icon |

### 👔 Organiser Portal (`public/organiser.html`) — Phase 3 Additions
| Feature | Details |
|---|---|
| **Sponsor Activation Panel** | 6 active sponsors (Jägermeister, boAt, CRED, Swiggy, etc.), value ₹24.5L, ROI metrics per sponsor, activation checklist |
| **AI Demand Forecast Panel** | Run AI forecast (14-day horizon), sales velocity chart, demand signals (search volume, social, weather), audience segmentation, dynamic pricing recommendations |
| **Chart.js** | Added for AI forecast sales velocity chart |

### ⚙️ Admin ERP (`public/admin.html`) — Phase 3 Additions
| Feature | Details |
|---|---|
| **Sponsor Platform panel** | Platform-wide sponsor directory (₹2.8Cr total), category breakdown, performance reporting |
| **White-Label SaaS panel** | 14 active venue instances, provisioning form, tier management (Starter ₹4,999/Pro ₹14,999/Enterprise ₹49,999) |
| **Developer API panel** | API key management, top endpoints by usage, 482 keys issued, 2.4M calls/month |

### ⚡ Developer Portal (`public/developer.html`) — NEW PORTAL
| Section | Details |
|---|---|
| **Overview** | Platform stats (86 endpoints, 2.4M calls/mo, 99.8% uptime), use cases, pricing plans |
| **Quick Start** | 3-step guide with cURL, fetch(), and full response examples |
| **Authentication** | JWT Bearer token docs, login + OTP flows, security best practices |
| **API Reference** | Full reference for Events, Bookings, Search, Venue, Organiser, Payments/GST, Webhooks |
| **Live API Console** | Interactive console — select method+endpoint, send real requests, see responses with timing |
| **API Key Generator** | Request free/pro/enterprise test keys via `/api/developer/keys` |
| **SDKs & Libraries** | JS SDK example, Postman collection, OpenAPI spec download |
| **API Status** | Real-time uptime bar (30 days), latency metrics, all-systems-operational |

### 🔌 Backend (`src/index.ts`) — Phase 3 API Endpoints
| Endpoint | Description |
|---|---|
| `GET /api/fanclubs` | List 6 fan clubs with artist details, member counts, tier pricing |
| `POST /api/fanclubs/:id/join` | Join fan club with tier selection |
| `GET /api/fanclubs/memberships/:user_id` | User's active fan club memberships |
| `GET /api/livestreams` | List virtual/hybrid events with stream URLs |
| `POST /api/livestreams/:id/purchase` | Purchase livestream access (HD/4K) |
| `GET /api/merch` | List merchandise products with categories |
| `POST /api/merch/order` | Place merch order with shipping |
| `GET /api/events/:id/sponsors` | Get sponsors for an event |
| `POST /api/sponsors` | Register new sponsor deal |
| `PUT /api/sponsors/:id/metrics` | Update sponsor ROI/performance metrics |
| `POST /api/organiser/forecast` | AI demand forecast (horizon_days, confidence, pricing recommendations) |
| `GET /api/organiser/analytics/trend` | Sales trend data (7/14/30 day) |
| `GET /api/developer/endpoints` | List all API endpoints with metadata |
| `POST /api/developer/keys` | Issue test API key |
| `POST /api/whitelabel/provision` | Provision white-label venue SaaS instance |
| `GET /developer` | Redirect to developer portal |

---

## 📊 Platform Summary

| Metric | v4.1 (Before) | v5.0 (Phase 3) |
|---|---|---|
| Portals | 10 | **11** (+Developer) |
| Backend endpoints | ~70 | **86** |
| Frontend fetch() calls | 52 | **79+** |
| Lines of code | ~12,000 | **~16,000** |
| Worker bundle size | 70.5 kB | **84.96 kB** |
| QA pass rate | 66/66 (100%) | **83/83 (100%)** |

---

## 🎟️ Live Promo Codes (Fan Portal)

| Code | Discount | Category |
|---|---|---|
| `INDY20` | 20% off | All events |
| `FIRST50` | ₹50 off | First booking |
| `SUMMER25` | 25% off | Music events |
| `FEST20` | 20% off | Festivals |

---

## 🏗️ Data Architecture

### Key Models
- **Event** — id, title, date, city, venue, category, price, capacity, sold_pct, status, organiser
- **Booking** — id, event_id, user_id, tickets[], total, payment, promo, gst_invoice
- **FanClub** — id, artist, tier, price, perks[], member_count, join_date
- **Livestream** — id, event_id, title, stream_url, tiers (SD/HD/4K), chat_enabled
- **Merch** — id, name, price, category, sizes[], stock, image
- **Sponsor** — id, event_id, sponsor_name, tier, value, activations[], roi_multiplier
- **Incident** — id, type, location, priority, status, event_id, logged_at
- **Announcement** — id, event_id, message, audience, channel, recipients, delivered
- **WhiteLabel** — id, venue_name, domain, plan, status, features[]

### Storage
- **Cloudflare Workers** — Edge runtime, globally distributed
- **Mock data in-memory** — (D1 SQLite migration planned for Phase 4)
- **Static HTML** — All portals served from `dist/` via Cloudflare Pages CDN

---

## 🗺️ Portal Guide

| Portal | URL | Who Uses It |
|---|---|---|
| Fan | `/fan` | Concert-goers discovering & booking tickets |
| Organiser | `/organiser` | Event promoters managing events, revenue, team |
| Venue | `/venue` | Stadium/venue operators listing spaces |
| Event Manager | `/event-manager` | On-day ops — check-in, LED, incidents, announcements |
| Admin/ERP | `/admin` | INDTIX super-admins — KYC, settlements, fraud, config |
| Ops/POS | `/ops` | Gate staff — QR scanner + food/merch POS |
| Developer | `/developer` | Third-party developers integrating INDTIX API |
| Portals Hub | `/portals` | Overview of all portals |
| Architecture | `/architecture` | System architecture diagram |
| Tech Spec | `/architecture-spec` | Detailed technical specification |
| Brand | `/brand` | Brand guidelines & design tokens |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Hono v4 + TypeScript on Cloudflare Workers |
| Frontend | Vanilla JS + Tailwind CSS (CDN) + Font Awesome |
| Charts | Chart.js (CDN) |
| Build | Vite → `dist/_worker.js` (84.96 kB) |
| Deployment | Cloudflare Pages (wrangler pages deploy) |
| Dev tools | wrangler pages dev + PM2 (port 3000) |

---

## 📦 Deployment History

| Version | Date | Changes |
|---|---|---|
| v1.0 | Mar 2026 | 7 portals, basic structure |
| v2.0 | Mar 2026 | 10 portals, 16 API routes |
| v3.0 | Mar 2026 | Phase 2: API wiring, dedup fix |
| v4.0 | Mar 2026 | Phase 3: deep API integration, SEO, scanner/POS wiring |
| v4.1 | Mar 7 2026 | Phase 4: auth, promo CRUD, incidents, announcements, LED, wallet, affiliate, event approval |
| **v5.0** | **Mar 7 2026** | **Phase 3: Fan Clubs, Livestream, Merch Store, Sponsor Activation, AI Forecasting, Developer Portal** |
