# INDTIX — India's Next-Gen Live Event Platform

> **Phase 4 Complete** · 9 portals · 63/63 QA pass (production) · Deployed on Cloudflare Pages

---

## 🌐 Live URLs

| Resource | URL |
|---|---|
| **Production (latest)** | https://bda006a6.indtix.pages.dev |
| **Fan Portal** | https://bda006a6.indtix.pages.dev/fan.html |
| **Organiser Portal** | https://bda006a6.indtix.pages.dev/organiser.html |
| **Admin Portal** | https://bda006a6.indtix.pages.dev/admin.html |
| **Ops Portal** | https://bda006a6.indtix.pages.dev/ops.html |
| **Venue Portal** | https://bda006a6.indtix.pages.dev/venue.html |
| **Event Manager** | https://bda006a6.indtix.pages.dev/event-manager.html |
| **Brand Portal** | https://bda006a6.indtix.pages.dev/brand.html |
| **Developer Portal** | https://bda006a6.indtix.pages.dev/developer.html |
| **API Health** | https://bda006a6.indtix.pages.dev/api/health |
| **Platform Status** | https://bda006a6.indtix.pages.dev/api/status |
| **Portals Index** | https://bda006a6.indtix.pages.dev/portals.html |

---

## 🏗️ Project Overview

**INDTIX** is a full-stack, multi-portal event ticketing and operations platform for India, built by Oye Imagine Private Limited. It covers the entire lifecycle of live events — from fan discovery and booking, to organiser management, venue operations, ops control, and developer integrations.

### Company
- **Name**: Oye Imagine Private Limited  
- **GSTIN**: 27AABCO1234A1Z5  
- **Platform Fee**: 10% + 18% GST  
- **Settlement Cycle**: T+7 business days

---

## ✅ Completed Features (All 4 Phases)

### Phase 1 — Core Platform
- Fan portal: event discovery, search, filtering by city/category/price
- Organiser portal: event creation, team management, KYC submission
- Admin portal: user management, event approval/rejection
- Venue portal: venue registration, availability calendar
- Basic booking flow with QR ticket generation

### Phase 2 — Deep API Wiring
- Full booking engine: GA/Premium/VIP tiers, addons (transport/food/merchandise)
- Payment flow: Razorpay/Stripe/UPI integration
- Scan & Verify: QR code validation at gates
- POS system: point-of-sale for merch/F&B at events
- WhatsApp + Email notifications via SendGrid
- GST invoice generation (GSTIN compliant)
- AI Chat assistant (INDY bot)

### Phase 3 — Advanced Features
- Fan Clubs: join, memberships, exclusive content
- Livestream: virtual tickets, purchase, access
- Merch Store: browse, order, tracking
- Sponsor Activation: sponsorship deals, LED branding, metrics
- White-label SaaS provisioning for venues
- Developer API: API keys, webhooks, docs
- AI demand forecast with Chart.js
- Affiliate/referral tracking system

### Phase 4 — Production Grade
- **PWA Support**: manifest.json + service worker (offline-first)
- **SEO**: Open Graph, Twitter Cards, JSON-LD structured data on all portals
- **Chart.js Analytics v2**: Deep organiser analytics (revenue by tier/month/city, traffic sources, conversion funnel)
- **Payment Analytics Dashboard**: Admin + organiser with daily/30d/90d breakdowns, gateway health
- **Real-time Notifications Hub**: SSE-based notification centre in fan portal
- **Fan Wallet Upgrade**: Live API-powered INDY Credits with referral tracking
- **Admin Incidents Module**: Real-time incident tracking, severity levels, resolution workflow
- **Ops Dashboard**: Live metrics, gate status, F&B revenue, POS sessions
- **63/63 QA tests passing** on production Cloudflare deployment

---

## 🔌 API Reference

### Base URL
```
https://bda006a6.indtix.pages.dev
```

### Core Endpoints (63 tested)

#### Events
| Method | Path | Description |
|---|---|---|
| GET | `/api/events` | List events (filter: city, category, q, page, limit) |
| GET | `/api/events/:id` | Event detail + ticket tiers |
| GET | `/api/events/:id/faq` | Event FAQs |
| POST | `/api/events/:id/faq` | AI-answered FAQ |
| GET | `/api/events/:id/waitlist` | Waitlist entries |
| GET | `/api/events/:id/sponsors` | Event sponsors |

#### Bookings
| Method | Path | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking (returns QR + PDF) |
| GET | `/api/bookings/user/:user_id` | User's booking history |
| POST | `/api/bookings/bulk` | Bulk/corporate bookings |
| POST | `/api/bookings/:id/cancel` | Cancel + refund (tiered policy) |

#### Payments
| Method | Path | Description |
|---|---|---|
| GET | `/api/payments/analytics` | Payment analytics (7d/30d/90d) |
| POST | `/api/payments/refund` | Initiate refund |
| POST | `/api/promo/validate` | Validate promo code |
| GET | `/api/promos/:code` | Promo code details |

#### Wallet
| Method | Path | Description |
|---|---|---|
| GET | `/api/wallet/:user_id` | INDY Credits balance + history |
| POST | `/api/wallet/redeem` | Redeem wallet credits |
| POST | `/api/wallet/add` | Add credits (admin/referral) |

#### Scan & Wristbands
| Method | Path | Description |
|---|---|---|
| POST | `/api/scan/verify` | QR/barcode gate verification |
| POST | `/api/wristbands/issue` | Issue NFC wristband |
| POST | `/api/wristbands/led/command` | LED wristband colour command |

#### Organiser
| Method | Path | Description |
|---|---|---|
| GET | `/api/organiser/events` | Organiser's event list |
| GET | `/api/organiser/analytics` | Revenue analytics |
| GET | `/api/organiser/settlements` | Settlement history |
| POST | `/api/organiser/team` | Add team member |

#### Admin
| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/events/:id/approve` | Approve event (201) |
| POST | `/api/admin/events/:id/reject` | Reject event (200) |
| GET | `/api/admin/users` | User management |
| GET | `/api/admin/reports/revenue` | Revenue report |
| GET | `/api/admin/audit` | Audit log |

#### Ops
| Method | Path | Description |
|---|---|---|
| GET | `/api/ops/dashboard` | Live ops metrics |
| GET | `/api/pos/sessions` | POS terminal sessions |
| POST | `/api/pos/sale` | Record POS sale |
| POST | `/api/incidents` | Log incident |
| GET | `/api/incidents` | List incidents |
| POST | `/api/announcements` | Send announcement |
| GET | `/api/announcements` | List announcements |
| GET | `/api/announcements/:id` | Announcement detail |

#### Other
| Method | Path | Description |
|---|---|---|
| GET | `/api/sponsors` | All sponsors |
| POST | `/api/sponsors` | Create sponsor |
| GET | `/api/fanclubs` | Fan clubs list |
| POST | `/api/fanclubs/:id/join` | Join fan club |
| GET | `/api/venues` | Venue list |
| POST | `/api/venue/register` | Register venue |
| GET | `/api/venue/availability` | Venue availability |
| GET | `/api/merch` | Merch store |
| POST | `/api/merch/order` | Place merch order |
| GET | `/api/livestreams` | Livestream list |
| POST | `/api/livestreams/:id/purchase` | Buy livestream access |
| POST | `/api/ai/chat` | AI event assistant |
| GET | `/api/search` | Search events |
| GET | `/api/recommendations/:user_id` | Personalised recommendations |
| POST | `/api/affiliate/register` | Register affiliate |
| GET | `/api/affiliate/stats/:id` | Affiliate stats |
| GET | `/api/gst/invoice/:id` | GST invoice |
| GET | `/api/gst/report` | GST report |
| GET | `/api/developer/keys` | API keys list |
| POST | `/api/developer/keys` | Create API key |
| GET | `/api/developer/webhooks` | Webhooks list |
| GET | `/api/status` | Platform status |
| GET | `/api/health` | Health check |

---

## 📊 Data Architecture

### Data Models
- **Event**: id, name, category, city, date, price, venue, tiers, sold_pct, status
- **Booking**: id, event_id, user_id, tickets[], addons[], subtotal, gst, total, qr_url, pdf_url
- **User/Wallet**: id, balance (INDY Credits), transactions[], referral_code
- **Wristband**: id, booking_id, zone, nfc_id, led_enabled, color
- **Incident**: id, type, location, priority, status, event_id
- **Sponsor**: id, name, tier, event_id, budget, impressions, activation_types
- **Affiliate**: id, name, clicks, conversions, commission

### Storage
- **Runtime**: Cloudflare Workers (edge-global, 0ms cold start)
- **Data**: Mock/seed data in-memory (Cloudflare D1 integration ready)
- **Assets**: Cloudflare CDN (static HTML, SW, manifest)
- **Build**: Vite SSR → `_worker.js` (131 KB gzipped)

---

## 👤 User Guide

### Fan Portal
1. Browse events by city/category or search
2. Click an event to view tiers and availability
3. Book tickets (UPI/Card/Wallet supported)
4. Manage bookings, cancel with tiered refund policy
5. Track INDY Credits wallet + referral earnings
6. Join Fan Clubs for exclusive perks
7. Watch livestreams + buy merch

### Organiser Portal  
1. Create and publish events
2. Set ticket tiers (GA/Premium/VIP) with capacity
3. View real-time analytics (revenue, conversions, cities)
4. Manage team members and KYC documents
5. Track settlements and payouts
6. Send announcements to ticket holders

### Admin Portal
1. Approve/reject organiser events
2. Monitor platform-wide finance (GMV, gateway split)
3. Review audit logs and manage users
4. Access revenue + GST reports
5. Manage promo codes and affiliates

### Ops Portal
1. Monitor live event dashboard (checkins, capacity)
2. Track POS terminal sales
3. Log and resolve incidents
4. Control LED wristband effects
5. Send gate/zone announcements

---

## 🚀 Deployment

| Property | Value |
|---|---|
| **Platform** | Cloudflare Pages |
| **Project** | `indtix` |
| **Status** | ✅ Live |
| **Tech Stack** | Hono + TypeScript + Vite + Cloudflare Workers |
| **Build Output** | `dist/_worker.js` (131 KB) |
| **Portals** | 9 |
| **API Endpoints** | 116+ |
| **QA** | 63/63 production tests passing |
| **Last Deployed** | 2026-03-07 |

### Deploy Command
```bash
npm run build
npx wrangler pages deploy dist --project-name indtix --branch main
```

---

## 🛠️ Development

```bash
# Install
npm install

# Local development
npm run build
pm2 start ecosystem.config.cjs

# Run QA
bash /tmp/prod_qa.sh

# Deploy to production
npx wrangler pages deploy dist --project-name indtix
```

---

*Built with ❤️ by Oye Imagine Pvt Ltd · GSTIN 27AABCO1234A1Z5*
