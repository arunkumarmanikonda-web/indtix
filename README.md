# INDTIX — India's Live Event Platform

## Project Overview
- **Name**: INDTIX
- **Goal**: Full-stack multi-portal event ticketing & management platform
- **Company**: Oye Imagine Private Limited (GSTIN: 27AABCO1234A1Z5)
- **Phase**: 11.0 (Production)
- **QA Score**: 57/57 tests passing ✅ | 0 console errors across all 9 portals

## Live URLs
| Portal | URL |
|--------|-----|
| 🎵 Fan Portal | https://indtix.pages.dev/fan |
| 🎪 Organiser Portal | https://indtix.pages.dev/organiser |
| 🏟️ Venue Portal | https://indtix.pages.dev/venue |
| 🎛️ Event Manager | https://indtix.pages.dev/event-manager |
| 🔐 Admin / ERP | https://indtix.pages.dev/admin |
| 📱 On-Ground Ops/POS | https://indtix.pages.dev/ops |
| 📣 Brand Portal | https://indtix.pages.dev/brand |
| 👩‍💻 Developer Portal | https://indtix.pages.dev/developer |
| 🗂️ Portals Index | https://indtix.pages.dev/portals |

- **Production canonical**: https://indtix.pages.dev
- **Root `/`** now redirects to Fan portal (was 404 — fixed Phase 10.3)
- **API Health**: https://indtix.pages.dev/api/health
- **API Version**: https://indtix.pages.dev/api/version

## Platform Features

### Fan Portal (`/fan`)
- Event discovery with city / category / price / date filters
- Seat map booking with zone selection & promo codes
- Fan clubs, live streams, merchandise store
- Wallet (INDY Credits), notifications, loyalty rewards
- GST invoice download (wired to `/api/gst/invoice/:booking_id`)
- Booking history (wired to `/api/bookings/user/:user_id`)
- AI-powered event discovery chat
- PWA (installable), Service Worker v5.1, push notifications
- Event reviews, related events, carbon footprint, add-ons

### Organiser Portal (`/organiser`)
- Event creation & management (dynamic `activeOrgEventId` — no hardcoded e1)
- Revenue analytics, live check-in monitor
- Team management, promo code generator
- Sponsor activation (dynamic event ID)
- AI demand forecast (dynamic event ID)
- Attendee feedback, bulk ticket allocation

### Venue Portal (`/venue`)
- Floor plan builder (interactive zone editor)
- Document status & NOC management
- Booking calendar & availability management
- Staff access management
- Incident log with real-form logging
- GST invoices, pricing & packages

### Event Manager (`/event-manager`)
- Live event dashboard with real-time check-in stats
- Dynamic event selector (no hardcoded `e1`)
- Run sheet / timeline management
- Wristband / LED band control

### Admin / ERP (`/admin`)
- Platform-wide KPIs & BI dashboard (Chart.js)
- User management, content moderation
- Event approve/reject (wired to API)
- Revenue split calculator, platform config

### Ops / POS (`/ops`)
- Gate scanner & QR code validation (dynamic `opsEventId`)
- POS terminal management (dynamic event)
- Crowd monitoring, medical/security alerts

### Brand Portal (`/brand`)
- Campaign management & analytics
- Audience insights with age_groups breakdown
- ROI tracker with total_invested metric
- Sponsor management + metrics API

### Developer Portal (`/developer`)
- Full API reference (263 endpoints)
- Webhook management, API key generation
- Rate limit monitor, error logs

## API Summary
- **Total endpoints**: 263
- **API version**: v11
- **Phase**: 11
- **Base URL**: `https://indtix.pages.dev/api/`

### Phase 11 — New Endpoints (26 added)
```
GET  /api/events/:id/tiers              — Ticket tier list
GET  /api/events/:id/reviews            — Event reviews & ratings
GET  /api/events/:id/related            — Related events
GET  /api/events/:id/carbon             — Carbon footprint
GET  /api/events/:id/addons             — Upsell add-ons
POST /api/events/:id/remind             — Set event reminder
GET  /api/events/:id/sponsors           — Event sponsors
GET  /api/scan/stats/:event_id          — Scan stats alias
GET  /api/bookings/user/:user_id        — User booking history
POST /api/bookings/:id/refund           — Booking refund
GET  /api/gst/invoice/:booking_id       — GST invoice detail
POST /api/fanclubs/:id/join             — Join fan club
GET  /api/fanclubs/memberships/:user_id — User memberships
POST /api/livestreams/:id/purchase      — Buy stream access
GET  /api/promos/:code                  — Promo code detail (discount_pct)
GET  /api/incidents/:id                 — Incident detail
POST /api/kyc/submit                    — Submit KYC
GET  /api/kyc/:id                       — KYC status
POST /api/settlements/:id/process       — Process settlement
GET  /api/sponsors/:id/metrics          — Sponsor performance metrics
POST /api/admin/events/:id/approve      — Approve event
POST /api/admin/events/:id/reject       — Reject event
GET  /api/payments/analytics            — Payment analytics
GET  /api/wallet                        — Guest wallet
GET  /api/organiser/forecast            — AI forecast alias
```

### All Key Endpoints
```
GET  /api/health                        — Platform health + version
GET  /api/events                        — List events
GET  /api/events/:id                    — Event detail
POST /api/bookings                      — Create booking
POST /api/auth/login                    — Login
POST /api/auth/signup                   — Signup
GET  /api/fanclubs                      — Fan clubs list
GET  /api/livestreams                   — Live streams
GET  /api/merch                         — Merchandise
GET  /api/wallet/:user_id               — Wallet balance
GET  /api/venue/calendar                — Venue calendar
GET  /api/admin/stats                   — Admin KPIs (total_revenue)
GET  /api/organiser/revenue             — Organiser revenue
GET  /api/brand/impressions             — Brand impressions
GET  /api/brand/audience                — Audience (age_groups)
GET  /api/brand/roi                     — ROI (total_invested)
GET  /api/developer/usage               — Dev usage (requests_today)
```

## Phase History
| Phase | Description |
|-------|-------------|
| 1–6 | Core portals: fan, organiser, venue, admin, ops, brand |
| 7 | 185 API endpoints, all portal panels functional |
| 8 | Schema fixes, form validation, console cleanup |
| 9 | Fan portal autocomplete, AI chat, push notifications |
| 10 | 237 endpoints, template literals fixed, 230→237 API growth |
| 10.2 | Full audit: 178 template literal fixes, 6 new APIs, 44/44 QA |
| 10.3 | Root / 404 fix: added `/`, `/index.html`, `/index` to Worker routes |
| **11** | **26 new APIs, 93→0 frontend-backend gaps, 57/57 QA, 263 endpoints** |

## Data Architecture
- **Storage**: In-memory mock data (Cloudflare Workers edge runtime)
- **Auth**: Mock JWT tokens — real D1 + proper auth planned for Phase 12
- **Avatars**: Inline SVG data URIs — no external CDN
- **Images**: Unsplash CDN with `onerror` fallback to gradient placeholders
- **Service Worker**: v5.1 — caches `/fan` + `/manifest.json`

## Deployment
- **Platform**: Cloudflare Pages
- **Project**: `indtix`
- **Branch**: `main`
- **Status**: ✅ Active — v11.0.0
- **Tech Stack**: Hono 4 + TypeScript + Cloudflare Workers
- **Last Deployed**: 2026-03-08
- **Build command**: `npm run build`
- **Output dir**: `dist/`
- **Worker size**: ~203 KB (well within 25 MB limit)

## Phase 12 Roadmap
- 🔜 Real authentication with Cloudflare D1 database
- 🔜 Real booking persistence (D1 + KV)
- 🔜 WebSocket-based live check-in dashboard
- 🔜 Stripe/Razorpay payment integration
- 🔜 SendGrid email notifications
- 🔜 PWA offline mode improvements
- 🔜 Bundle Tailwind CSS (remove CDN dependency)
