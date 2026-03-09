# INDTIX Platform — v25.0.0 (Phase 25: Platform Intelligence & Scale)

## Project Overview
- **Name**: INDTIX — India's Live Event Ticketing Platform
- **Version**: v25.0.0 (Phase 25)
- **Goal**: End-to-end live event platform with **1,279 API endpoints** across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 165/165 tests — 100% ✅
- **Duplicate Route Fix**: 118 duplicate routes resolved using smart dedup (ordering-aware)

## Live URLs
- **Production (Latest)**: https://93a4ed1c.indtix.pages.dev
- **Fan Portal**: https://93a4ed1c.indtix.pages.dev/fan
- **Organiser Portal**: https://93a4ed1c.indtix.pages.dev/organiser
- **Admin Portal**: https://93a4ed1c.indtix.pages.dev/admin
- **Venue Portal**: https://93a4ed1c.indtix.pages.dev/venue
- **Event Manager**: https://93a4ed1c.indtix.pages.dev/event-manager
- **Ops Portal**: https://93a4ed1c.indtix.pages.dev/ops
- **Brand Guide**: https://93a4ed1c.indtix.pages.dev/brand
- **API Health**: https://93a4ed1c.indtix.pages.dev/api/health
- **v25 Health**: https://93a4ed1c.indtix.pages.dev/api/v25/health
- **v24 Health**: https://93a4ed1c.indtix.pages.dev/api/v24/health
- **v23 Health**: https://93a4ed1c.indtix.pages.dev/api/v23/health
- **v22 Health**: https://93a4ed1c.indtix.pages.dev/api/v22/health
- **v21 Health**: https://93a4ed1c.indtix.pages.dev/api/v21/health

## Phase 25 — New Features (90 endpoints)

### Fan Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 🔥 Hype Meter | `GET /api/fan/events/:id/hype-meter` | Real-time social hype score (viral coeff, trending) |
| 🤖 AI Event Summary | `GET /api/fan/events/:id/ai-summary` | AI-generated personalised event summaries |
| 💳 Split Payment | `GET /api/fan/split-payment/:id` | Split ticket cost with up to 4 friends |
| ✈️ Travel Bundles | `GET /api/fan/events/:id/travel-bundles` | Hotel + train/flight + ticket combos |
| 🏆 Fan Leaderboard | `GET /api/fan/leaderboard` | XP-based fan ranking system |
| ⬆️ Waitlist Upgrade | `GET /api/fan/bookings/:id/waitlist-upgrade` | Smart seat upgrade offers |
| 📸 Memory Book | `GET /api/fan/memory-book/:event_id` | Concert photo/setlist memory archive + NFT |
| 🎤 Virtual Fanmeet | `GET /api/fan/events/:id/virtual-fanmeet` | 5-min virtual artist meet slots |

### Organiser Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 📊 Revenue Forecast | `GET /api/organiser/revenue-forecast/:id` | 30/60/90d AI revenue predictions |
| ⬆️ Seat Upsell | `GET /api/organiser/seat-upgrade-upsell/:id` | Automated upgrade campaign engine |
| 📈 Post-Event ROI | `GET /api/organiser/events/:id/post-event-deep-dive` | Detailed post-event analytics |
| 🤝 Sponsor ROI | `GET /api/organiser/sponsor-roi-calculator/:id` | Per-sponsor ROI attribution |
| 💱 Multi-Currency | `GET /api/organiser/payouts` | Multi-currency settlement support |
| 📰 Press Release | `GET /api/organiser/press-release-gen/:id` | AI-generated press releases |
| 👥 Segment Export | `GET /api/organiser/segment-export/:id` | Attendee segment CSV/API exports |
| 🔥 Heat Seating | `GET /api/organiser/heat-seating/:id` | Real-time seat occupancy heatmap |

### Admin Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 🤖 AI Anomaly Feed | `GET /api/admin/ai-anomaly-feed` | ML-powered platform anomaly detection |
| 📋 SLA Contracts | `GET /api/admin/sla-contracts` | Enterprise SLA contract manager |
| 📊 Revenue Attribution | `GET /api/admin/revenue-attribution` | Multi-touch revenue attribution |
| 🗺️ Tax Nexus | `GET /api/admin/tax-nexus` | State-wise GST compliance dashboard |
| ⭐ Influencer Prog | `GET /api/admin/influencer-programme` | Influencer tier management |
| 📝 Changelog | `GET /api/admin/changelog` | Platform changelog publisher |
| 💳 API Billing | `GET /api/admin/api-usage-billing` | Per-client API usage billing |

### Venue Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 🌡️ HVAC Dashboard | `GET /api/venue/:id/hvac-dashboard` | Climate + air quality per zone |
| 🔧 Maintenance AI | `GET /api/venue/:id/preventive-maintenance` | Predictive equipment maintenance |
| ♿ Accessibility | `GET /api/venue/:id/accessibility-compliance` | ADA/RPWD compliance tracker |
| 🛡️ Event Insurance | `GET /api/venue/:id/event-insurance` | Coverage manager + claims |
| 🍕 Concessions | `GET /api/venue/:id/concession-revenue` | F&B revenue by zone |
| 👔 Staff Scorecard | `GET /api/venue/:id/staff-scorecard` | Staff performance metrics |
| 🔥 Crowd Heatmap | `GET /api/venue/:id/crowd-heatmap-live` | Live crowd density tracking |

### Event Manager Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 📋 AI Cue Sheet | `GET /api/event-manager/:id/ai-cue-sheet` | AI-generated master run-of-show |
| 📡 Broadcast RTMP | `GET /api/event-manager/:id/broadcast-integration` | Live stream management |
| 👕 Merch Inventory | `GET /api/event-manager/:id/merch-inventory` | Real-time stock tracking |
| 🎤 Greenroom Mgr | `GET /api/event-manager/:id/greenroom` | Artist hospitality management |
| 📜 Artist Rider | `GET /api/event-manager/:id/artist-rider` | Technical rider fulfilment tracker |
| 💬 Live Captions | `GET /api/event-manager/:id/live-captions` | Multi-language live transcription |
| 🤝 Sponsor Track | `GET /api/event-manager/:id/sponsor-activations` | Sponsor activation ROI tracker |
| 📈 Post-Show | `GET /api/event-manager/:id/postshow-analytics` | Full event analytics report |

### Ops Portal
| Feature | Endpoint | Description |
|---------|----------|-------------|
| 💥 Chaos Engineering | `GET /api/ops/chaos-engineering` | Gremlin-style resilience tests |
| 📈 Capacity Scaler | `GET /api/ops/capacity-autoscaler` | Auto-scaling event log |
| 🎯 SLO Burn Rate | `GET /api/ops/slo-burn-rate` | Error budget consumption tracker |
| 📖 Post-Mortems | `GET /api/ops/incident-postmortems` | Incident review database |
| 🎟️ Cost/Ticket | `GET /api/ops/cost-per-ticket` | Infrastructure cost attribution |
| 🌐 CDN Perf | `GET /api/ops/cdn-performance` | Cloudflare edge performance |
| 🗄️ DB Health | `GET /api/ops/db-health` | D1 + KV health monitor |

## Architecture
- **Backend**: Hono (TypeScript) on Cloudflare Workers
- **Frontend**: Vanilla JS + TailwindCSS CDN across 6 HTML portals
- **Storage**: Cloudflare D1 (SQLite) + KV Namespace + R2
- **CI/CD**: Wrangler Pages deploy → Cloudflare edge network

## Data Architecture
- **Data Models**: Events, Bookings, Users, Organisations, Venues, Tickets, Settlements, KYC, Promos, Loyalty, Referrals
- **Storage Services**: Cloudflare D1 (relational), KV (sessions/cache), R2 (assets/media)
- **API Total**: 1,279 endpoints across 25 phases

## Deployment
- **Platform**: Cloudflare Pages (Workers runtime)
- **Status**: ✅ Active
- **Last Deployed**: 2026-03-09
- **Tech Stack**: Hono v4 + TypeScript 5 + Vite 6 + Wrangler 3

## Previous Versions
- v24.0.0: Revenue Intelligence, Compliance Autopilot, Partner Marketplace (1,189 endpoints)
- v23.0.0: Platform maturity, legal/compliance (1,099 endpoints)
- v22.0.0: Scale features (1,009 endpoints)
- v21.0.0: Phase 21 core (919 endpoints)
</content>
</invoke>