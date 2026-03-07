# INDTIX — India's Next-Gen Live Event Platform

**Version:** 5.0 · **Phase:** Phase 5 Complete · **QA:** 151/151 ✅  
**Live:** https://49766cb9.indtix.pages.dev  
**Stack:** Hono + Cloudflare Workers + TypeScript · Edge-global deployment

---

## Platform Overview

INDTIX is a comprehensive ticketing and event management platform for India's live events ecosystem. It supports 11 portals, 151 API endpoints, covering the complete event lifecycle — from discovery to check-in.

**Company:** Oye Imagine Private Limited  
**GSTIN:** 27AABCO1234A1Z5  
**Tech:** Hono 4.x · Cloudflare Workers · Cloudflare Pages · TypeScript

---

## Portals (11)

| Portal | Path | Description |
|--------|------|-------------|
| Fan | `/fan` | Ticket discovery, booking, wallet, fan clubs |
| Organiser | `/organiser` | Event management, analytics, settlements |
| Venue | `/venue` | Venue calendar, bookings, KYC |
| Event Manager | `/event-manager` | Live ops, wristbands, staff coordination |
| Admin | `/admin` | Platform control, KYC queue, fraud, BI |
| Ops | `/ops` | Real-time gate operations, scan stats, incidents |
| Brand | `/brand` | Sponsorship campaigns, analytics |
| Developer | `/developer` | API keys, webhooks, usage |
| Architecture Spec | `/architecture-spec` | System architecture documentation |
| Portals Hub | `/portals` | Portal directory |
| Architecture | `/architecture` | Architecture overview |

---

## API Summary (151 endpoints)

### Core Events
- `GET /api/events` — List with city/category/q/pagination filters
- `GET /api/events/:id` — Event detail with tiers, addons, description
- `GET /api/events/:id/tiers` — Ticket tier availability
- `GET /api/events/:id/seatmap` — Zone-based seat map (`sections`, `zones`, `seats`)
- `GET /api/events/:id/addons` — Combo meals, parking, merch add-ons
- `GET /api/events/:id/faq` — AI-generated FAQ + POST custom FAQ
- `GET /api/events/:id/waitlist` — Waitlist entries
- `GET /api/events/:id/checkin-stats` — Gate-by-gate check-in totals
- `GET /api/events/:id/checkin-live` — Live feed + `rate` per min
- `GET /api/events/:id/availability` — Tier availability snapshot
- `GET /api/events/:id/social` — Social sentiment, hashtag, top posts
- `GET /api/events/:id/incidents` — Incidents for event
- `GET /api/events/:id/sponsors` — Sponsor list for event
- `POST /api/events/:id/clone` → 201 `{ event, cloned_event_id }`
- `POST /api/events/:id/emergency` → 200 `{ status, emergency_id }`
- `GET /api/cities` · `GET /api/categories` · `GET /api/venues`
- `GET /api/search?q=` · `GET /api/trending` · `GET /api/recommendations/:user_id`

### Auth
- `POST /api/auth/signup` → 200 `{ user_id, verify_required }`
- `POST /api/auth/login` → 200 `{ token, user }` (accepts email+password OR email+otp)
- `POST /api/auth/verify-otp` → 200 `{ token }`
- `POST /api/auth/refresh` → 200 `{ token }`
- `POST /api/auth/logout` → 200 `{ success }`

### Bookings
- `POST /api/bookings` → 201 `{ booking_id }` (accepts tickets[] OR tier+quantity)
- `GET /api/bookings/:id` · `GET /api/bookings/user/:user_id`
- `POST /api/bookings/:id/cancel` → 200 `{ success, refund_pct }`
- `POST /api/bookings/bulk` → 201 `{ booking_id, bulk_booking }`

### Payments
- `GET /api/payments/analytics` — Revenue breakdown, daily series
- `GET /api/payments/settlements` — Settlement list with `settlements[]`
- `GET /api/payments/gst-report` — `{ total_gst, period, gstr1, gstr3b }`
- `POST /api/payments/refund` → 200 `{ refund_id }`
- `GET /api/gst/invoice/:booking_id` → `{ invoice_number, invoice{} }`
- `GET /api/gst/report` — Annual GST summary

### Wallet & Loyalty
- `GET /api/wallet/:user_id` → `{ balance, transactions }`
- `POST /api/wallet/add` → 200 `{ balance }`
- `POST /api/wallet/redeem` → 200 `{ success }`
- `GET /api/loyalty/:user_id` · `POST /api/loyalty/redeem`

### Promos
- `GET /api/promos` — All active promos
- `GET /api/promos/catalog` — Promo catalog (resolved before `:code`)
- `GET /api/promos/:code` — Single promo detail
- `POST /api/promo/validate` → 200 `{ discount, final_price }`
- `POST /api/promos/bulk-create` → 200 `{ created, codes }`
- `GET /api/promos/analytics` — Top codes, redemption stats

### Organiser
- `POST /api/organiser/register` → 201 `{ organiser_id, organiser{} }`
- `GET /api/organiser/dashboard` — KPIs, live events, revenue
- `GET /api/organiser/events` — Event list with revenue/status
- `GET /api/organiser/analytics` — `{ total_revenue, analytics{} }`
- `GET /api/organiser/analytics/v2` — `{ metrics{}, real_time{}, audience{} }`
- `GET /api/organiser/revenue/breakdown` — Tier/day breakdown
- `GET /api/organiser/audience` — `{ total, demographics{} }`
- `GET|POST /api/organiser/team` — Team members
- `GET /api/organiser/settlements` — Settlement history
- `POST /api/organiser/coupons/distribute` — 200 `{ created, coupon_code }`
- `GET|POST /api/organiser/forecast` — ML-based demand forecast

### Admin
- `GET /api/admin/stats` — `{ total_users, platform{} }`
- `GET /api/admin/users` — Paginated user list
- `GET /api/admin/users/export` — 200 `{ export{} }`
- `POST /api/admin/users/:id/block`
- `GET|POST /api/admin/config`
- `GET /api/admin/kyc/queue` — `{ queue[], pending[] }`
- `GET /api/admin/fraud/alerts` — `{ alerts[] }`
- `GET /api/admin/bi/dashboard` — `{ metrics{}, realtime{} }`
- `GET /api/admin/events/pending` · `GET /api/admin/events/queue`
- `POST /api/admin/events/:id/approve` → 200
- `POST /api/admin/events/:id/reject` → 200
- `GET /api/admin/gst/monthly` — `{ months[], gstr1{} }`
- `GET /api/admin/notifications` · `POST /api/admin/notifications/:id/read`
- `GET /api/admin/reports/revenue` — `{ gmv, top_events }`
- `GET /api/admin/audit` — Audit log
- `GET /api/admin/system/health` — Component uptime
- `GET /api/admin/experiments`

### Ops & Scan
- `GET /api/ops/dashboard?event_id=e1` — `{ total_checkins, gates, revenue }`
- `GET /api/scan/stats/:event_id` — `{ checked_in, scan_rate }`
- `POST /api/scan/verify` — QR validation `{ result, booking{} }`
- `GET /api/incidents` · `POST /api/incidents` → 201 `{ incident_id }`
- `PUT /api/incidents/:id`
- `GET /api/wristbands/event/:event_id` — `{ wristbands{} }`
- `GET /api/wristbands/status` — `{ status, total_issued, zones{} }`
- `POST /api/wristbands/issue` → 201 `{ wristband_id }`
- `POST /api/wristbands/led/command` · `GET /api/wristbands/led/presets`
- `GET /api/pos/sessions` · `POST /api/pos/sale` → 201 `{ transaction_id }`

### Fan Clubs
- `GET /api/fanclubs` — `{ clubs[], fanclubs[] }`
- `POST /api/fanclubs/:id/join` → 200 `{ membership{} }`
- `GET /api/fanclubs/memberships/:user_id`

### Sponsors
- `GET /api/sponsors` · `POST /api/sponsors` → 201 `{ id }`
- `GET /api/sponsors/:id` · `GET /api/sponsors/:id/metrics`

### Venues
- `POST /api/venue/register` → 201 `{ venue_id, venue{} }`
- `GET /api/venue/dashboard` — `{ upcoming_events, stats{} }`
- `GET /api/venue/availability` — `{ available_dates }`
- `GET /api/venues/:id/calendar` — `{ events[], days[] }`
- `GET /api/event-manager/dashboard` — `{ assigned_events[], checkin_live{} }`

### AI
- `POST /api/ai/chat` → 200 `{ response }`
- `POST /api/ai/forecast` → 200 `{ predicted_attendance, forecast{} }`
- `GET /api/ai/recommendations/:user_id`

### Developer
- `GET|POST /api/developer/keys` — API key management → POST 201 `{ key }`
- `GET /api/developer/webhooks`
- `GET /api/developer/usage` — `{ total_requests, quota }`
- `GET /api/developer/endpoints`

### Brand
- `GET /api/brand/dashboard` — `{ campaigns[], totals{} }`
- `GET|POST /api/brand/campaigns` — POST → 201 `{ id }`
- `GET /api/brand/analytics`

### Affiliate
- `GET /api/affiliate/dashboard` — `{ total_clicks, stats{} }`
- `POST /api/affiliate/register` → 201 `{ affiliate_id, affiliate{} }`
- `GET /api/affiliate/stats/:id`
- `POST /api/affiliate/payout` → 200 `{ payout_id }`

### Misc
- `GET /api/notifications` · `POST /api/notifications/send` → 201 `{ notification_id }`
- `POST /api/notifications/mark-read` · `GET|PUT /api/notifications/preferences`
- `POST /api/kyc/submit` → 201 `{ kyc_id, kyc{} }` · `GET /api/kyc/:id`
- `GET /api/merch` · `POST /api/merch/order` → 201 `{ order_id }`
- `GET /api/merch/order/:id`
- `GET /api/livestreams` · `POST /api/livestreams/:id/purchase` → 200
- `GET /api/settlements` · `POST /api/settlements/:id/process`
- `POST /api/whitelabel/provision` → 200 `{ subdomain, instance{} }`
- `POST /api/referral/validate` · `POST /api/tickets/:id/transfer`
- `GET /api/status` · `GET /api/health`
- `GET /api/announcements` · `POST /api/announcements` → 201 `{ announcement_id }`
- `GET /api/announcements/:event_id`

---

## QA Status

| Phase | Tests | Result |
|-------|-------|--------|
| Phase 5 (current) | 151/151 | ✅ 100% |
| Phase 4 | 114/114 | ✅ 100% |
| Phase 3 | 83/83 | ✅ 100% |

**Coverage:** Core, Auth, Bookings, Scan, Wallet, Promos, Users, Notifications, Organiser, Payments, Admin, Incidents, Ops, Sponsors, Fan Clubs, Venues, AI, Developer, Brand, Affiliate, Announcements, Misc

---

## URLs

| Environment | URL |
|-------------|-----|
| Production | https://49766cb9.indtix.pages.dev |
| Alt | https://main.indtix.pages.dev |
| Health | https://49766cb9.indtix.pages.dev/api/health |
| Fan Portal | https://49766cb9.indtix.pages.dev/fan |
| Admin Portal | https://49766cb9.indtix.pages.dev/admin |
| Developer | https://49766cb9.indtix.pages.dev/developer |

---

## Data Architecture

- **Storage:** In-memory edge data (Cloudflare Workers) — no external DB required for demo
- **Events:** 8 sample events (e1–e8) across Mumbai, Pune, Delhi, Bangalore, Chennai
- **Auth:** Simulated OTP flow — returns token on verify
- **Payments:** GST-compliant (18% CGST+SGST) with Razorpay/Stripe/UPI support
- **QR/Scan:** BK-prefixed codes = valid; DUP-prefixed = duplicate alert
- **Production DB upgrade path:** Cloudflare D1 for relational data, KV for sessions

---

## Deployment

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name indtix

# Local development
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health
```

**Platform:** Cloudflare Pages + Workers  
**Build output:** `dist/_worker.js` (~153 kB)  
**Last deployed:** 2026-03-07  
**Status:** ✅ Operational
