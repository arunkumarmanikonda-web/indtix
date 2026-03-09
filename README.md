# INDTIX Platform — v26.0.0 (Phase 26: Real-Time Social Commerce)

## Project Overview
- **Name**: INDTIX — India's Live Event Ticketing Platform
- **Version**: v26.0.0 (Phase 26)
- **Goal**: End-to-end live event platform with **1,369 API endpoints** across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 127/128 tests (302→200 redirect correct for home) ✅
- **Total Phases**: 26 | **Total Endpoints**: 1,369

## Live URLs (v26)
- **Production (Latest)**: https://ebdd9404.indtix.pages.dev
- **Fan Portal**: https://ebdd9404.indtix.pages.dev/fan
- **Organiser Portal**: https://ebdd9404.indtix.pages.dev/organiser
- **Admin Portal**: https://ebdd9404.indtix.pages.dev/admin
- **Venue Portal**: https://ebdd9404.indtix.pages.dev/venue
- **Event Manager**: https://ebdd9404.indtix.pages.dev/event-manager
- **Ops Portal**: https://ebdd9404.indtix.pages.dev/ops
- **v26 Health**: https://ebdd9404.indtix.pages.dev/api/v26/health
- **v25 Health**: https://ebdd9404.indtix.pages.dev/api/v25/health
- **v24 Health**: https://ebdd9404.indtix.pages.dev/api/v24/health

## Phase 26 — New Features (90 new endpoints)

### Fan Portal — Social Commerce & Personalisation
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Fan Clubs | `GET /api/fan/clubs` | Join artist fan clubs with perks & exclusive content |
| Fan Club Feed | `GET /api/fan/clubs/:id/feed` | Exclusive posts, polls, merch drops |
| Social Gifting | `GET /api/fan/gifts/catalog` | Gift tickets, VIP upgrades, experiences |
| Send Gift | `POST /api/fan/gifts/send` | Send gift to a friend |
| Group Challenges | `GET /api/fan/challenges` | XP badges, progress tracking |
| Buddy Booking | `GET /api/fan/buddy-booking` | Group booking with invite system |
| Flash Sales | `GET /api/fan/flash-sales` | Time-limited discounted tickets |
| AI Personalisation | `GET /api/fan/ai-recommendations` | INDTIX-Rec-v3 personalized recommendations |
| Smart Notifications | `GET /api/fan/notifications/preferences` | AI-timed multi-channel notifications |
| Carbon Footprint | `GET /api/fan/carbon-footprint` | Track & offset event carbon emissions |
| AR Event Preview | `GET /api/fan/events/:id/ar-preview` | 3D AR venue preview before booking |
| Crypto Tickets | `GET /api/fan/crypto-tickets` | NFT tickets on Polygon/ETH/Solana |
| Loyalty Tiers v2 | `GET /api/fan/loyalty/tiers` | Fan → Super Fan → VIP Fan → Legend |
| Leaderboard v2 | `GET /api/fan/leaderboard/v2` | Social XP leaderboard with badges |

### Organiser Portal — Growth Engine
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Tour Manager | `GET /api/organiser/tours` | Multi-city tour planning & management |
| Dynamic Pricing v2 | `GET /api/organiser/dynamic-pricing/v2` | PriceBrain-v3 AI pricing rules |
| Talent Marketplace | `GET /api/organiser/talent-marketplace` | 2,840 verified artists, booking enquiry |
| Merch Drops | `GET /api/organiser/merch-drops` | Limited edition merch countdown sales |
| Gamification | `GET /api/organiser/gamification` | Fan engagement campaigns with ROI tracking |
| Sponsor Live | `GET /api/organiser/:event_id/sponsor-live` | Real-time sponsor activation metrics |

### Admin Portal — Platform Intelligence
| Feature | Endpoint | Description |
|---------|----------|-------------|
| AI Rec Engine | `GET /api/admin/ai-personalisation` | INDTIX-Rec-v3 metrics, A/B tests |
| Live Commerce | `GET /api/admin/livestream-commerce` | Stream GMV, buy rates, engagement |
| Sustainability | `GET /api/admin/sustainability` | Carbon footprint, SDG score, initiatives |
| Accessibility AI | `GET /api/admin/accessibility-ai` | AccessAI-v2 coverage & insights |
| FraudShield v4 | `GET /api/admin/fraud/prevention-v2` | 98.7% accuracy, ₹42L loss prevented |
| Revenue Attribution v2 | `GET /api/admin/revenue-attribution/v2` | Multi-touch ROAS 12.4x |
| Changelog v2 | `GET /api/admin/platform-changelog/v2` | Full release history & roadmap |

### Venue Portal — Smart Operations
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Live Crowd Heatmap | `GET /api/venue/:id/crowd-heatmap/live` | Zone density, overflow alerts, 30s refresh |
| Smart Parking | `GET /api/venue/:id/parking` | 4 zones, EV chargers, capacity prediction |
| Energy AI | `GET /api/venue/:id/energy` | Solar, grid, AI optimization suggestions |
| Concessions AI | `GET /api/venue/:id/concessions/ai-forecast` | Demand forecast per item, revenue projection |

### Event Manager — Live Show Command
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Live Stream | `GET /api/event-manager/:id/livestream` | 4K HDR, viewers, CDN health, monetisation |
| Go Live | `POST /api/event-manager/:id/livestream/go-live` | Start RTMP stream |
| Polls v2 | `GET /api/event-manager/:id/polls/v2` | Multi-type polls with live results |
| Greenroom | `GET /api/event-manager/:id/greenroom` | Artist status, rider, team management |
| Merch Live | `GET /api/event-manager/:id/merch-inventory` | Real-time inventory, revenue, alerts |

### Ops Portal — Platform Intelligence
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Real-time Monitor | `GET /api/ops/realtime-monitoring` | 4-region health, service status |
| Security Centre | `GET /api/ops/security-centre` | WAF, threats, vulnerabilities, SSL |
| Cost Optimisation | `GET /api/ops/cost-optimisation` | ₹84K savings found, per-service breakdown |
| Feature Flags | `GET /api/ops/feature-flags` | 84 flags, toggle with rollout % |
| Data Pipeline | `GET /api/ops/data-pipeline` | 8 pipelines, lag, throughput |
| Disaster Recovery | `GET /api/ops/disaster-recovery` | RTO 12m, RPO 3m, backups |
| Compliance | `GET /api/ops/compliance` | PCI-DSS v4, ISO 27001, GDPR — 94/100 |

### Cross-Platform
| Feature | Endpoint | Description |
|---------|----------|-------------|
| AI Event Summary v2 | `GET /api/ai/event-summary/v2/:id` | GPT-EventBrain-v2 press-ready summaries |
| Hype Meter v2 | `GET /api/events/:id/hype-meter/v2` | 4-signal composite score + sellout prediction |
| Live Commerce Feed | `GET /api/events/:id/live-commerce` | Real-time merch/ticket flash deals |
| Accessibility Config | `GET /api/accessibility/config` | WCAG AA, captions, ISL, screen reader |
| API Analytics | `GET /api/platform/api-analytics` | 284M req/week, SDK adoption |

## Platform Architecture
```
INDTIX v26 — Cloudflare Edge Platform
├── Frontend: 6 HTML portals (Hono SSR + Tailwind CDN)
├── Backend: Hono TypeScript Workers (1,369 endpoints)
├── Storage: Cloudflare D1 (SQLite), KV, R2
├── CDN: Cloudflare Stream (live video)
├── AI/ML: INDTIX-Rec-v3, FraudShield-v4, AccessAI-v2
└── Payments: Multi-currency, UPI, Cards, Crypto (Polygon/ETH/SOL)
```

## Complete Phase History
| Phase | Version | Endpoints | Theme |
|-------|---------|-----------|-------|
| Phase 21 | v21.0.0 | 919 | Core Platform |
| Phase 22 | v22.0.0 | 1,009 | Analytics & Growth |
| Phase 23 | v23.0.0 | 1,099 | Operations |
| Phase 24 | v24.0.0 | 1,189 | Intelligence Suite |
| Phase 25 | v25.0.0 | 1,279 | Platform Intelligence & Scale |
| **Phase 26** | **v26.0.0** | **1,369** | **Real-Time Social Commerce** |

## Tech Stack
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: Vanilla JS + Tailwind CSS CDN + Font Awesome
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Infra**: Cloudflare Pages, D1, KV, R2, Stream
- **Worker Size**: 557 KB (gzipped ~145 KB)

## Deployment
- **Platform**: Cloudflare Pages
- **Project**: `indtix`
- **Status**: ✅ Active (v26.0.0)
- **Last Deployed**: 2026-03-09
- **Next Phase**: v27.0.0 — Immersive Experiences & Web3 (planned 2026-04-01)
