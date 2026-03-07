# INDTIX — India's Live Event Platform

## Project Overview
- **Name**: INDTIX
- **Goal**: Full-stack multi-portal event ticketing & management platform
- **Company**: Oye Imagine Private Limited (GSTIN: 27AABCO1234A1Z5)
- **Phase**: 10.1 (Production)
- **QA Score**: 51/51 tests passing ✅

## Live URLs
| Portal | URL |
|--------|-----|
| 🎵 Fan Portal | https://2836b6ef.indtix.pages.dev/fan |
| 🎪 Organiser Portal | https://2836b6ef.indtix.pages.dev/organiser |
| 🏟️ Venue Portal | https://2836b6ef.indtix.pages.dev/venue |
| 🎛️ Event Manager | https://2836b6ef.indtix.pages.dev/event-manager |
| 🔐 Admin / ERP | https://2836b6ef.indtix.pages.dev/admin |
| 📱 On-Ground Ops/POS | https://2836b6ef.indtix.pages.dev/ops |
| 📣 Brand Portal | https://2836b6ef.indtix.pages.dev/brand |
| 👩‍💻 Developer Portal | https://2836b6ef.indtix.pages.dev/developer |

- **Production alias**: https://indtix.pages.dev (main branch)
- **API Health**: https://2836b6ef.indtix.pages.dev/api/health

## Platform Features

### Fan Portal (`/fan`)
- Event discovery with city/category/price/date filters
- Seat map booking with zone selection & promo codes
- Fan clubs, live streams, merchandise store
- Wallet (INDY Credits), notifications, loyalty rewards
- GST invoice download, booking history, wishlist
- AI-powered event discovery chat
- PWA (installable), Service Worker v5.1, push notifications

### Organiser Portal (`/organiser`)
- Event creation & management
- Revenue analytics, live check-in monitor
- Team management, promo code generator
- Attendee feedback, bulk ticket allocation

### Venue Portal (`/venue`)
- Floor plan builder (interactive zone editor)
- Document status & NOC management (with upload modals)
- Booking calendar & availability management
- Staff access management (add/edit/remove staff modal)
- Incident log (with real log-new-incident form)
- GST invoices, pricing & packages, revenue reports

### Event Manager (`/event-manager`)
- Live event dashboard with real-time check-in stats
- **Event selector** — switch between any assigned event (no more hardcoded `e1`)
- Run sheet / timeline management
- Wristband / LED band control
- Incident logging, team coordination, announcements
- POS overview, F&B tracker, attendee feedback

### Admin / ERP (`/admin`)
- Platform-wide KPIs & BI dashboard (Chart.js)
- User management, content moderation
- Revenue split calculator, platform config
- Organiser approvals, refund management

### Ops / POS (`/ops`)
- Gate scanner & QR code validation
- POS terminal management
- Crowd monitoring, medical/security alerts

### Brand Portal (`/brand`)
- Campaign management & analytics
- Audience insights with age_groups breakdown
- ROI tracker with total_invested metric
- Sponsor management

### Developer Portal (`/developer`)
- Full API reference (230+ endpoints)
- Webhook management, API key generation
- Rate limit monitor, error logs

## API Summary
- **Total endpoints**: 230
- **API version**: v10
- **Base URL**: `https://2836b6ef.indtix.pages.dev/api/`

### Key Endpoints
```
GET  /api/health                    — Platform health + version
GET  /api/events                    — List events (city, category, price filters)
GET  /api/events/:id                — Event detail
GET  /api/events/:id/tiers          — Ticket tiers
GET  /api/events/:id/checkin-stats  — Check-in stats (total_checked_in included)
POST /api/bookings                  — Create booking
POST /api/auth/login                — Login (returns inline SVG avatar, no CDN)
POST /api/auth/signup               — Signup
POST /api/auth/send-otp             — Send OTP
GET  /api/fanclubs                  — Fan clubs list
GET  /api/livestreams               — Live streams
GET  /api/merch                     — Merchandise
GET  /api/wallet/:user_id           — Wallet balance
GET  /api/venue/calendar            — Venue availability calendar
GET  /api/venue/floorplan           — Floor plan zones
GET  /api/venue/enquiry             — Enquiry list
GET  /api/venue/staff               — Staff list
GET  /api/venue/incidents           — Incident log
GET  /api/brand/audience            — Audience (includes age_groups alias)
GET  /api/brand/roi                 — ROI (includes total_invested alias)
GET  /api/admin/dashboard           — Admin KPIs (includes stats key)
GET  /api/organiser/revenue         — Revenue (includes monthly key)
GET  /api/event-manager/dashboard   — EM dashboard (includes live_count)
GET  /api/developer/apis            — API list (includes endpoints key)
GET  /apple-touch-icon.png          — App icon (inline SVG, no 404)
GET  /sitemap.xml                   — SEO sitemap
GET  /robots.txt                    — Robots policy
```

## Data Architecture
- **Storage**: In-memory mock data (Cloudflare Workers edge runtime)
- **Auth**: Mock JWT tokens — real D1 + proper auth planned for Phase 11
- **Avatars**: Inline SVG data URIs — no external CDN (ui-avatars.com removed)
- **Images**: Unsplash CDN with `onerror` fallback to gradient placeholders
- **Service Worker**: v5.1 — caches `/fan` + `/manifest.json`, no picsum.photos

## Phase 10.1 Changes (Current)
- ✅ Fixed Fan portal wishlist `${w.img}` unevaluated template literal (was causing 404)
- ✅ Fixed Service Worker v5.1: removed `picsum.photos` icon refs → uses `/favicon.ico`
- ✅ Fixed SW offline fallback: `/fan.html` → `/fan`
- ✅ Added `/apple-touch-icon.png`, `/apple-touch-icon-precomposed.png` routes (no 404)
- ✅ Added `/sitemap.xml` and `/robots.txt` routes
- ✅ Fan portal: 0 console errors (was 1 persistent 404)
- ✅ Added `total_checked_in` alias to `/api/events/:id/checkin-stats`
- ✅ Added `live_count` to `/api/event-manager/dashboard`
- ✅ Added GET `/api/venue/enquiry`, `/api/venue/staff`, `/api/venue/incidents`
- ✅ Added `/api/developer/apis` alias endpoint
- ✅ All footer social links functional (LinkedIn, Twitter, Instagram, YouTube, WhatsApp)
- ✅ Event Manager: dynamic event selector (no more hardcoded `e1`)
- ✅ Venue portal: real interactive panels (Floor Plan, Staff modal, Incident form, NOC docs)

## Pending / Phase 11 Roadmap
- 🔜 Real authentication with Cloudflare D1 database
- 🔜 Fill footer content pages (About, Careers, Press, Privacy, Terms)
- 🔜 Optional: Bundle Tailwind CSS (currently uses CDN)
- 🔜 Fan portal "View All" → full events listing page
- 🔜 Clean TODO/FIXME markers in codebase

## Deployment
- **Platform**: Cloudflare Pages
- **Project**: `indtix`
- **Branch**: `main`
- **Status**: ✅ Active
- **Tech Stack**: Hono + TypeScript + Cloudflare Workers
- **Last Deployed**: 2026-03-07
- **Build command**: `npm run build`
- **Output dir**: `dist/`
