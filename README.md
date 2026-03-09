# INDTIX Platform — v23.0.0

## Project Overview
- **Name**: INDTIX — India's Live Event Platform
- **Version**: v23.0.0 (Phase 23)
- **Goal**: End-to-end live event ticketing platform with 1,099 API endpoints across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 389/389 tests — 100% ✅

## Live URLs
- **Production (Cloudflare)**: https://51c60788.indtix.pages.dev
- **Fan Portal**: https://51c60788.indtix.pages.dev/fan
- **Organiser Portal**: https://51c60788.indtix.pages.dev/organiser
- **Admin Portal**: https://51c60788.indtix.pages.dev/admin
- **Venue Portal**: https://51c60788.indtix.pages.dev/venue
- **Event Manager**: https://51c60788.indtix.pages.dev/event-manager
- **Ops Portal**: https://51c60788.indtix.pages.dev/ops
- **Brand Guide**: https://51c60788.indtix.pages.dev/brand
- **API Health**: https://51c60788.indtix.pages.dev/api/health
- **v23 Health**: https://51c60788.indtix.pages.dev/api/v23/health
- **v22 Health**: https://51c60788.indtix.pages.dev/api/v22/health
- **v21 Health**: https://51c60788.indtix.pages.dev/api/v21/health

## Phase 23 New Features (90 new endpoints → 1,099 total)

### Fan Portal — Community & Discovery Layer
- **Discover Feed**: Trending events personalised by city with interest counts and badges
- **Nearby Events**: Location-aware events within configurable radius (km)
- **Squad Goals**: Create friend squads, group-vote on events, send invite emails
- **Taste Match**: ML genre-affinity scoring with top-4 matched events (match %)
- **Moments (Photo Wall)**: Upload/browse fan photos+videos per event with likes
- **Fan Challenges**: Multi-step gamified challenges (Globe Trotter, Genre Hopper, Review Guru)
- **Event Reviews**: Star ratings + text reviews with helpful votes; validation enforced
- **Waitlist+**: Smart waitlist with auto-buy, max-price ceiling, live position tracker

### Organiser Portal — Growth Intelligence
- **Conversion Funnel**: Page views → Checkout → Booked funnel with drop-off insight
- **Flash Sale Manager**: Create time-limited discounts, push notifications, delete/end
- **Waitlist Analytics**: Conversion rates, avg response time, bulk-offer send
- **Growth Score**: Organiser health KPI (sell-through, fan retention, review score, NPS)

### Admin Portal — Platform Intelligence
- **ML Model Registry**: Production model inventory (accuracy, last trained, predictions/day) + retrain trigger
- **Trust Score Engine**: User trust distribution, flagged accounts, block/flag actions
- **Geo Analytics**: City-level GMV, users, events, MoM growth + opportunity zones
- **Advanced User Segments**: 6 behavioural segments with avg LTV + campaign launcher
- **Platform Health Score**: 8-pillar composite score (API, Payments, Search, Fraud, NPS…)
- **Churn Predictor**: At-risk users, 30d churn rate, LTV at risk + intervention workflow
- **Price Optimiser**: AI-driven price recommendations with expected lift + apply action
- **Ops Budget**: Monthly budget vs spend by service with utilisation %

### Venue Portal — Intelligent Spaces
- **Crowd Flow Monitor**: Real-time in-venue count, entry rate/min, per-zone density
- **Vendor Performance**: Sales, ratings, complaints per food/bar vendor with status
- **Accessibility Audit**: Checklist (ramps, toilets, hearing loops, Braille) with pass/warn/fail
- **Sustainability Dashboard**: Energy, carbon, recycling %, EV bays, solar initiatives
- **Space Utilisation**: Revenue/sqm, density %, efficiency rating per zone + upsell insight

### Event Manager — Live Safety & Comms
- **Crowd Safety Monitor**: Zone-level density + risk level + emergency disperse broadcast
- **Incident Log**: Live incident tracking (medical/crowd/security) with status management
- **Staff Broadcast**: Multi-channel (all/security/medical) staff comms with recipient count
- **Exit Flow Manager**: Per-gate queue, exit rate/min, wait times with slow-gate alert

### Ops Portal — Business Intelligence
- **Unit Economics**: CAC, LTV, LTV:CAC ratio, per-booking P&L with MoM trends
- **Infra Spend**: Service-level budget vs spend tracking (Workers, D1, SendGrid, etc.)
- **Tax Dashboard**: GST/TDS totals, quarterly breakdown, compliance score
- **Partner Health**: Uptime, latency, incident count + health score per integration
- **Release Tracker**: Version history with status (live/staging/dev) + promote to prod
- **Capacity Planning**: Current RPS capacity vs upcoming event demand with readiness
- **Security Events**: SSL grade, threats blocked, IP blocks, recent event feed

## Architecture
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: HTML5 + Tailwind CSS + Font Awesome + Chart.js
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Worker Size**: ~515 KB

## API Surface (1,099 endpoints)
| Category | Endpoints |
|----------|-----------|
| Auth & Users | ~85 |
| Events & Discovery | ~80 |
| Booking Engine | ~80 |
| KYC Workflow | ~30 |
| Seat Map & Add-ons | ~40 |
| Checkout & Payments | ~50 |
| Communications | ~45 |
| Organiser Portal | ~130 |
| Admin Portal | ~160 |
| Venue Portal | ~75 |
| Event Manager | ~75 |
| Ops Portal | ~75 |
| Analytics & BI | ~40 |
| AI/ML Layer | ~35 |
| Loyalty & Gamification | ~30 |
| Fan Community & Social | ~45 |
| RBAC & Security | ~15 |
| Reports & Exports | ~20 |
| **Total** | **1,099** |

## Phase 23 Backend API Reference
| Group | Key Endpoints |
|-------|--------------|
| Discover Feed | GET /api/fan/discover?city= |
| Nearby Events | GET /api/fan/nearby |
| Squad Goals | GET/POST /api/fan/squads, POST /api/fan/squads/:id/vote, .../invite |
| Taste Match | GET /api/fan/taste-match?user_id= |
| Moments | GET/POST /api/fan/moments, POST /api/fan/moments/:id/like |
| Challenges | GET /api/fan/challenges, POST /api/fan/challenges/:id/log |
| Reviews | GET/POST /api/fan/reviews |
| Waitlist+ | GET/POST /api/fan/waitlist-plus |
| Conversion Funnel | GET /api/organiser/funnel?event_id= |
| Flash Sales | GET/POST /api/organiser/flash-sales, DELETE /api/organiser/flash-sales/:id |
| Waitlist Analytics | GET /api/organiser/waitlist/analytics, POST .../bulk-offer |
| Growth Score | GET /api/organiser/growth-score?organiser_id= |
| ML Models | GET /api/admin/ml-models, POST /api/admin/ml-models/:id/retrain |
| Trust Scores | GET /api/admin/trust-scores, POST /api/admin/trust-scores/:id/action |
| Geo Analytics | GET /api/admin/geo-analytics |
| User Segments | GET /api/admin/user-segments, POST .../campaign |
| Platform Health | GET /api/admin/platform-health |
| Churn Risk | GET /api/admin/churn-risk, POST .../intervention |
| Price Optimiser | GET /api/admin/price-recommendations, POST .../apply |
| Ops Budget | GET /api/admin/ops-budget |
| Crowd Flow | GET /api/venue/:id/crowd-flow |
| Vendor Performance | GET /api/venue/:id/vendor-performance |
| Accessibility | GET /api/venue/:id/accessibility |
| Sustainability | GET /api/venue/:id/sustainability |
| Space Utilisation | GET /api/venue/:id/space-utilisation |
| Crowd Safety | GET /api/events/:id/crowd-safety, POST .../disperse |
| Incident Log | GET/POST /api/events/:id/incidents |
| Staff Broadcast | POST /api/events/:id/broadcast |
| Exit Flow | GET /api/events/:id/exit-flow |
| Unit Economics | GET /api/ops/unit-economics |
| Infra Spend | GET /api/ops/infra-spend |
| Tax Dashboard | GET /api/ops/tax-dashboard |
| Partner Health | GET /api/ops/partner-health |
| Release Tracker | GET /api/ops/releases, POST /api/ops/releases/:ver/promote |
| Capacity Plan | GET /api/ops/capacity-plan |
| Security Events | GET /api/ops/security-events |
| v23 Health | GET /api/v23/health |

## Data Models
- **User**: id, name, email, phone, role, kyc_status, wallet_balance, loyalty_points, tier
- **Event**: id, name, venue, date, tiers[], addons[], pricing_model, capacity, carbon_footprint
- **Booking**: id, user_id, event_id, tickets[], total, status, payment, qr_code, transfer_status
- **Squad**: id, name, members[], current_vote{event, yes, no, pending}, last_event
- **FanReview**: id, event, rating, text, user, helpful, xp_earned, published_at
- **WaitlistEntry**: id, event, position, max_price, auto_buy, status, total_waitlisted
- **FlashSale**: id, event_id, discount_pct, duration_min, tickets_total, claimed, ends_at
- **MLModel**: id, name, type, accuracy, status, last_trained, predictions_per_day
- **TrustScore**: user_id, score, signals[], recommended_action
- **CrowdSafety**: event_id, overall_risk, in_venue, active_alerts, zones[{zone, density_pct, risk}]
- **Incident**: id, type, description, status, response_min, created_at
- **UnitEconomics**: cac, ltv, ltv_cac_ratio, per_booking{avg_value, gross_profit}, trends

## User Guide

### Fan Portal (/fan)
1. **Discover** tab: browse trending events by city; filter by genre
2. **Nearby**: events within 10km; view distance and price
3. **Squads**: create a group → vote on events together → invite friends
4. **Taste Match**: AI matches you to events based on your genre history
5. **Moments**: upload event photos → get likes from other fans
6. **Challenges**: complete multi-event challenges to earn XP and badges
7. **Reviews**: write verified post-event reviews (+100 XP per review)
8. **Waitlist+**: join waitlist with max-price ceiling and optional auto-buy

### Organiser Portal (/organiser)
1. **Funnel Analytics**: see where fans drop off in the booking journey
2. **Flash Sales**: create time-limited discounts with push notifications
3. **Waitlist**: view demand data, send bulk offers to waitlisted fans
4. **Growth Score**: track your organiser health KPIs and tier badge

### Admin Portal (/admin)
1. **ML Models**: view production model accuracy, trigger retraining
2. **Trust Engine**: review flagged accounts, take block/flag actions
3. **Geo Analytics**: explore city-level GMV and growth opportunities
4. **Segments**: launch targeted campaigns to specific user segments
5. **Platform Health**: monitor composite 8-pillar platform health score
6. **Churn Predictor**: identify at-risk users and launch interventions
7. **Price Optimiser**: review AI price suggestions, apply with one click
8. **Ops Budget**: track service spend vs monthly budget

### Venue Portal (/venue)
1. **Crowd Flow**: real-time in-venue count, entry rate, and zone densities
2. **Vendors**: monitor F&B vendor performance and complaint flags
3. **Accessibility**: audit checklist for disability compliance
4. **Sustainability**: track energy, carbon, and recycling metrics
5. **Space Utilisation**: identify under-utilised zones for revenue uplift

### Event Manager Portal (/event-manager)
1. **Crowd Safety**: zone-level density with risk indicators; trigger steward dispersal
2. **Incidents**: log and track live incidents (medical, crowd, security)
3. **Broadcast**: push real-time messages to all or specific staff groups
4. **Exit Flow**: monitor gate queues and wait times for smooth exit management

### Ops Portal (/ops)
1. **Unit Economics**: drill into CAC, LTV, and per-booking P&L
2. **Infra Spend**: service-level cost tracking vs budget
3. **Tax Dashboard**: GST/TDS compliance with quarterly breakdown
4. **Partner Health**: monitor third-party integration uptime and latency
5. **Release Tracker**: manage version rollouts, promote staging to production
6. **Capacity Plan**: pre-event demand planning vs current RPS capacity
7. **Security Events**: threat feed, SSL grade, IP block counts

## Deployment
- **Platform**: Cloudflare Pages (project: `indtix`)
- **Build**: `npm run build` → `dist/`
- **Deploy**: `npx wrangler pages deploy dist --project-name indtix`
- **Status**: ✅ Active
- **Last Updated**: March 2026
- **Tech Stack**: Hono v4 + TypeScript + Tailwind CSS + Vite + Cloudflare Workers

## Development Commands
```bash
npm run build          # Build project
npm run dev:sandbox    # Local dev server (port 3000)
pm2 start ecosystem.config.cjs  # Start with PM2
curl http://localhost:3000/api/v23/health  # Health check
python3 /tmp/qa_phase23.py      # Run Phase 23 QA suite (389 tests)
```

## Version History
| Version | Phase | Endpoints | QA |
|---------|-------|-----------|-----|
| v23.0.0 | Phase 23 | 1,099 | 389/389 ✅ |
| v22.0.0 | Phase 22 | 1,009 | 174/174 ✅ |
| v21.0.0 | Phase 21 | 924 | 149/149 ✅ |
| v20.0.0 | Phase 20 | 842 | 110/110 ✅ |
| v19.0.0 | Phase 19 | 760+ | 100% ✅ |
