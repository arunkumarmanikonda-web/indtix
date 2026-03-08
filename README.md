# INDTIX — India's Live Events Platform

## Project Overview
- **Platform**: INDTIX — Full-stack live events & ticketing platform
- **Company**: Oye Imagine Private Limited
- **Version**: 18.0.0 (Phase 18)
- **Phase**: 18 (Advanced Analytics, AI Recommendations, Loyalty/Gamification, PWA, Webhooks, i18n)
- **Total Endpoints**: 680 API endpoints
- **QA Score**: 100% (117/117 tests passed)
- **Build Size**: 353.55 kB (Cloudflare Workers SSR)

## Live URLs
- **Production**: https://indtix.pages.dev
- **Latest Deploy**: https://e9d802fb.indtix.pages.dev
- **API Health**: https://e9d802fb.indtix.pages.dev/api/health

## Portals
| Portal | URL | Description |
|--------|-----|-------------|
| Fan | /fan | Book tickets, manage wishlist, loyalty points |
| Organiser | /organiser | Create/manage events, analytics, settlements |
| Venue | /venue | Floor plans, bookings, maintenance |
| Event Manager | /event-manager | Run sheets, tasks, live metrics, incidents |
| Ops/POS | /ops | Real-time dashboard, wristbands, POS terminal |
| Admin | /admin | Platform management, approvals, compliance |
| Brand/Sponsor | /brand | Campaign analytics, ROI reports |
| Developer | /developer | API keys, SDK docs, changelog |
| Architecture | /architecture-spec | System design documentation |

## Phase 18 New Features (v18.0.0)
### 1. Advanced Analytics API (6 endpoints)
- `GET /api/analytics/overview` — Revenue, tickets, conversion rate (30d)
- `GET /api/analytics/funnel` — Booking conversion funnel with drop-off insights
- `GET /api/analytics/revenue/breakdown` — Revenue split by category
- `GET /api/analytics/heatmap` — Booking time heatmap by day/hour
- `GET /api/analytics/cohort` — User retention cohort analysis
- `GET /api/analytics/geo` — Geographic booking distribution by city

### 2. AI / ML Endpoints (6 endpoints)
- `GET /api/ai/recommendations/events` — Personalized event recommendations (CF v2)
- `POST /api/ai/recommendations/personalise` — Update user preferences
- `GET /api/ai/price-optimisation/:event_id` — AI-driven ticket pricing suggestions
- `GET /api/ai/fraud-score/:booking_id` — Real-time fraud risk scoring
- `POST /api/ai/chatbot` — AI support chatbot
- `GET /api/ai/demand-forecast/:event_id` — Demand forecast curve

### 3. Loyalty & Gamification (5 endpoints)
- `GET /api/loyalty/profile/:user_id` — Tier, points, badges, referrals
- `POST /api/loyalty/redeem` — Redeem points for discounts
- `GET /api/loyalty/leaderboard` — Monthly leaderboard
- `POST /api/loyalty/points/earn` — Earn points for actions
- `GET /api/loyalty/challenges` — Active challenges with progress

### 4. PWA / Mobile Enhancements (4 endpoints)
- `POST /api/pwa/push/subscribe` — Web push notification subscription
- `POST /api/pwa/push/send` — Send push notification
- `GET /api/pwa/offline/sync` — Offline sync resource manifest
- `GET /api/pwa/app-config` — Feature flags, theme, maintenance mode

### 5. Webhook Management (5 endpoints)
- `GET /api/webhooks` — List registered webhooks
- `POST /api/webhooks` — Register new webhook
- `PUT /api/webhooks/:id` — Update webhook
- `DELETE /api/webhooks/:id` — Delete webhook
- `POST /api/webhooks/:id/test` — Test webhook delivery

### 6. Bulk Operations (5 endpoints)
- `POST /api/admin/bulk/approve-events` — Bulk approve events
- `POST /api/admin/bulk/process-settlements` — Bulk process settlements
- `POST /api/admin/bulk/send-notifications` — Bulk push notifications
- `POST /api/organiser/bulk/tickets/generate` — Bulk ticket generation
- `POST /api/organiser/bulk/email/attendees` — Bulk email to attendees

### 7. Multi-language / i18n (2 endpoints)
- `GET /api/i18n/languages` — Supported languages (8 Indian languages)
- `GET /api/i18n/translations/:lang` — Translation strings

### 8. Reporting & Exports (3 endpoints)
- `GET /api/reports/library` — Report catalogue
- `POST /api/reports/schedule` — Schedule recurring reports
- `POST /api/reports/generate` — On-demand report generation

### 9. Compliance & Accessibility (3 endpoints)
- `GET /api/accessibility/audit` — WCAG AA audit results
- `GET /api/compliance/gdpr/data-request/:user_id` — GDPR data export
- `DELETE /api/compliance/gdpr/delete/:user_id` — Right to be forgotten

### 10. Carbon Footprint / Sustainability (2 endpoints)
- `GET /api/sustainability/event/:id` — Event carbon estimate + green score
- `POST /api/sustainability/offset` — Purchase carbon offsets

### 11. Additional New Endpoints (20+ more)
- Event Manager: live-metrics, crowd alerts, report downloads, run-sheet sharing
- Organiser: attendee list, waitlist, settlement history, sale extension
- Venue: occupancy history, maintenance requests, contracts
- Admin: audit log, daily revenue, system metrics, promo bulk-create, feature flag
- Fan: activity feed, upcoming events, event reviews, social friends
- Developer: SDK versions, usage stats, sandbox reset, changelog

## Phase 18 Toast-to-API Migrations
| Portal | Functions Wired | APIs Used |
|--------|----------------|-----------|
| Event Manager | 7 | runsheet/share, tasks, reports/download |
| Venue | 11 (Phase 17) | floorplan, pricing, invoices, amenities |
| Organiser | 7 (Phase 17) | editSequence, launchAds, sendBroadcast, downloadInv |
| Admin | 15+ | All KYC, settlement, risk, config functions |

## API Endpoint Summary (680 total)
| Category | Endpoints |
|----------|-----------|
| Core/Health | 8 |
| Auth | 12 |
| Events & Search | 32 |
| Bookings | 18 |
| Fan Portal | 24 |
| Organiser Portal | 48 |
| Venue Portal | 28 |
| Event Manager | 22 |
| Ops/POS | 18 |
| Admin | 56 |
| Brand/Sponsor | 14 |
| Developer | 24 |
| Analytics (Phase 18) | 6 |
| AI/ML (Phase 18) | 6 |
| Loyalty/Gamification | 8 |
| PWA/Mobile | 4 |
| Webhooks | 5 |
| Bulk Operations | 5 |
| Reports | 8 |
| i18n | 2 |
| Compliance | 3 |
| Sustainability | 2 |
| Platform/Realtime | 12 |
| Payments | 18 |
| Other | 77 |

## Technology Stack
- **Backend**: Hono v4 + TypeScript on Cloudflare Workers
- **Frontend**: HTML5/CSS3/JS with TailwindCSS CDN
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Deploy**: Cloudflare Pages (edge-global)
- **GST**: 18% GST on all ticketing (GSTIN: 27AABCO1234A1Z5)
- **Currency**: INR (Indian Rupees)

## Data Architecture
- **Events**: Mock data with 20+ Indian music/festival events
- **Storage**: Edge-only (stateless API mock responses)
- **Auth**: JWT token simulation
- **Payments**: UPI, card, wallet, POS terminal
- **GST/Compliance**: Full GSTR-1, GSTR-3B reporting

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Region**: Edge Global (India-optimized)
- **Last Deployed**: 2026-03-08
- **Build Size**: 353.55 kB (_worker.js)

## Phase History
| Phase | Version | Endpoints | Key Features |
|-------|---------|-----------|--------------|
| 18 | 18.0.0 | 680 | Analytics, AI, Loyalty, PWA, Webhooks, i18n |
| 17 | 17.0.0 | 500 | Notifications, Search, Real-time Counters |
| 16 | 16.0.0 | 450 | LED Control, POS Terminal, Brand Portal |
| 15 | 15.0.0 | 390 | Full portal wiring, QA suites |
