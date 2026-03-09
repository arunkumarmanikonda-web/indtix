# INDTIX Platform — v24.0.0 (Portal Fix)

## Project Overview
- **Name**: INDTIX — India's Live Event Platform
- **Version**: v24.0.0 (Phase 24 + Portal Navigation Fix)
- **Goal**: End-to-end live event ticketing platform with **1,189 API endpoints** across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 286/286 tests — 100% ✅
- **Portal Nav Fix**: All 6 portals fully wired — every sidebar/nav button functional ✅

## Live URLs
- **Production (Latest)**: https://6177fc84.indtix.pages.dev
- **Fan Portal**: https://6177fc84.indtix.pages.dev/fan
- **Organiser Portal**: https://6177fc84.indtix.pages.dev/organiser
- **Admin Portal**: https://6177fc84.indtix.pages.dev/admin
- **Venue Portal**: https://6177fc84.indtix.pages.dev/venue
- **Event Manager**: https://6177fc84.indtix.pages.dev/event-manager
- **Ops Portal**: https://6177fc84.indtix.pages.dev/ops
- **Brand Guide**: https://6177fc84.indtix.pages.dev/brand
- **API Health**: https://6177fc84.indtix.pages.dev/api/health
- **v24 Health**: https://6177fc84.indtix.pages.dev/api/v24/health
- **v23 Health**: https://6177fc84.indtix.pages.dev/api/v23/health
- **v22 Health**: https://6177fc84.indtix.pages.dev/api/v22/health
- **v21 Health**: https://6177fc84.indtix.pages.dev/api/v21/health

## Portal Navigation Fix (applied after Phase 24)
### Root Causes Fixed
| Portal | Issue | Fix Applied |
|--------|-------|-------------|
| **Admin** | No base `showPanel()` — ALL 40+ nav clicks did nothing | Added base `showPanel()` before all overrides; removed duplicate static sidebar items |
| **Admin** | Phase 24 Intelligence Suite floating outside any panel | Wrapped in `panel-p24-intelligence`; added sidebar link |
| **Organiser** | Missing `panel-dynamic-pricing` — crash on click | Built full Dynamic Pricing panel with rules UI |
| **Organiser** | Phase 24 Growth Suite floating outside any panel | Wrapped in `panel-p24-growth-suite`; added sidebar link |
| **Venue** | Phase 24 Smart Venue floating outside any panel | Wrapped in `panel-p24-smart-venue`; added sidebar link |
| **Event Manager** | Phase 24 Live Event Ops floating outside any panel | Wrapped in `panel-p24-event-ops`; added sidebar link |
| **Ops** | Phase 23/24 nav buttons injected into `.sidebar` (doesn't exist) | Fixed to inject into `.ops-nav`; buttons now visible in nav bar |
| **Fan** | Phase 24 hub button tried to add to `.fan-bottom-nav` (wrong class) | Fixed to `.bottom-nav`; P24 hub accessible |

## Phase 24 New Features (90 new endpoints → 1,189 total)
*Monetisation, Personalisation & Operational Excellence*

### Fan Portal — Personalised Experience Layer (8 new)
- **AI Event Planner**: Budget-aware event calendar with ML match scores and AI notes
- **Group Booking Flow**: Squad booking with discount tiers (5–20 members, up to 20% off)
- **Loyalty Auctions**: Bid on backstage passes, meet & greets using loyalty points
- **Live Score / Set Tracker**: Real-time setlist with crowd energy, next-act countdown, vote for next song
- **Accessibility Preferences**: Hearing loop, wheelchair, dietary settings, best entrance routing
- **Digital Collectibles (NFT-lite)**: Mint event attendance badges; rarity tiers Common→Epic
- **Referral Dashboard**: Code sharing, friend tracking, milestone rewards up to 12,000 pts
- **Mood-Based Discovery**: energetic/chill/emotional/adventurous filter → matched events

### Organiser Portal — Revenue & Relationship Tools (7 new)
- **Smart Pricing Wizard**: Elasticity-aware price suggestions with tier breakdown and upside estimate
- **Bundle Creator**: Ticket+Hotel+Merch combos with saving amounts and best-seller tracking
- **Co-Marketing Hub**: Partner cross-promos (Swiggy, Ola) with ROI, reach, and revenue attribution
- **Organiser Wallet**: Balance, pending settlements, transaction log, instant withdrawal
- **Event Cloning**: Deep-copy event structure for recurring shows (date/price editable)
- **Attendee CRM**: Segmented contacts (48k), top spender list, campaign send (email/SMS/WhatsApp)
- **Post-Event Analytics Deep Dive**: Attendance, NPS (72), social sentiment, complaint triage, next-event forecast

### Admin Portal — Intelligence & Governance (7 new)
- **Revenue Intelligence Suite**: Q1 GMV ₹4.84B, take-rate 10%, top cities/categories, AI forecast
- **Compliance Autopilot**: DPDP, PCI-DSS, GST, RBI frameworks; auto-resolved 14 issues/30d
- **Partner Marketplace**: 48 partners, featured integrations (Razorpay, MSG91, Clevertap)
- **Content Calendar**: Scheduled/draft campaigns across push/email/SMS/social/WhatsApp
- **Platform Changelog**: Version history v21→v24 with endpoint counts and breaking-change log
- **Audit Log Explorer**: Timestamped actor/action/resource log with CSV export
- **Predictive Support Triage**: Bot deflection 74.8%, surge prediction, top-3 issue auto-resolve rates

### Venue Portal — Smart Operations (5 new)
- **Digital Twin Dashboard**: Live zone occupancy, temp, humidity, noise dB, power draw
- **Smart Parking Manager**: 2,400-space multi-zone tracker with EV charging and pre-booking
- **Multi-Event Calendar**: Upcoming events with utilisation %, blackout dates, next available slot
- **Emergency Drill Tracker**: Compliance status, drill history, scheduling, staff scores
- **Supplier Contracts**: Procurement tracker with SLA vs actual, contract values, expiry alerts

### Event Manager — Live Show Command (6 new)
- **Live Polling Engine**: Real-time audience polls with vote counts and participation rate
- **Setlist Manager**: Act schedule with live/upcoming/completed status, stage manager info
- **Photo Wall Moderation**: 94.8% auto-moderated, flag queue, approve/reject per photo
- **Volunteer Coordinator**: Shift management (180 volunteers), WhatsApp broadcast, rating
- **Lost & Found Digital**: Log found items, public search URL, claimant tracking
- **Weather Command**: Live conditions + 4-point forecast + rain contingency plan

### Ops Portal — Platform Reliability (6 new)
- **Cost Optimiser**: ₹46K/month savings via CDN TTL, D1 indexes, batch webhooks, R2 cold tier
- **Feature Flag Manager**: 6 flags with rollout %, segment targeting, toggle UI
- **Load Test Results**: Latest test: 1,240 RPS peak, P95 48ms, 0.08% error rate ✅
- **DR Runbook**: 4 scenarios with RTO/RPO, last tested dates, initiate-test endpoint
- **API Deprecation Tracker**: Sunset calendar, active usage warnings, replacement mapping
- **Billing Reconciliation**: CF invoice vs internal model (3.3% variance), per-service line items

## API Surface (1,189 endpoints)
| Domain | Count |
|---|---|
| Auth & KYC | ~115 |
| Events & Booking | ~155 |
| Payments & Refunds | ~130 |
| Fan Portal | ~155 |
| Organiser Portal | ~155 |
| Admin Portal | ~165 |
| Venue Portal | ~90 |
| Event Manager | ~80 |
| Ops Portal | ~80 |
| Analytics & AI/ML | ~64 |
| **Total** | **~1,189** |

## Version History
| Phase | Version | Endpoints | QA | Theme |
|---|---|---|---|---|
| 24 | v24.0.0 | 1,189 (+90) | 286/286 ✅ | Monetisation, Personalisation & Operational Excellence |
| 23 | v23.0.0 | 1,099 (+90) | 389/389 ✅ | Community, Discovery & Platform Intelligence |
| 22 | v22.0.0 | 1,009 (+85) | 174/174 ✅ | Fan Experience & Compliance |
| 21 | v21.0.0 | 924 (+82) | 149/149 ✅ | Loyalty, Ops & Venue Intelligence |

## Architecture
- **Runtime**: Cloudflare Workers (edge-global)
- **Framework**: Hono v4 + TypeScript
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Worker Size**: 545.96 KB
- **Portals**: 6 (Fan, Organiser, Admin, Venue, Event Manager, Ops)
- **Deployment**: Cloudflare Pages (`npx wrangler pages deploy dist --project-name indtix`)

## Quick Start
```bash
# Local development
npm install
npm run build
pm2 start ecosystem.config.cjs

# Deploy to production
npm run build
npx wrangler pages deploy dist --project-name indtix
```

## Key Endpoints
```
GET  /api/health              → Platform health (v24.0.0, 1189 endpoints)
GET  /api/v24/health          → Phase 24 health check
GET  /api/fan/ai-planner      → AI event planner
GET  /api/fan/loyalty-auctions → Loyalty point auctions
GET  /api/organiser/wallet    → Organiser settlement wallet
POST /api/organiser/events/clone → Clone an event
GET  /api/admin/revenue-intelligence → Revenue intelligence suite
GET  /api/admin/compliance-autopilot → Compliance dashboard
GET  /api/venue/:id/digital-twin → Live venue digital twin
GET  /api/events/:id/polls/live  → Live polling engine
GET  /api/ops/cost-optimiser  → Cost optimisation recommendations
GET  /api/ops/feature-flags   → Feature flag management
```

---
*INDTIX v24.0.0 — Phase 24 Complete | 2026-03-09*
