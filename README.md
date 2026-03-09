# INDTIX Platform — v22.0.0

## Project Overview
- **Name**: INDTIX — India's Live Event Platform
- **Version**: v22.0.0 (Phase 22)
- **Goal**: End-to-end live event ticketing platform with 1,009 API endpoints across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 174/174 tests — 100% ✅

## Live URLs
- **Production (Cloudflare)**: https://b6908330.indtix.pages.dev
- **Fan Portal**: https://b6908330.indtix.pages.dev/fan
- **Organiser Portal**: https://b6908330.indtix.pages.dev/organiser
- **Admin Portal**: https://b6908330.indtix.pages.dev/admin
- **Venue Portal**: https://b6908330.indtix.pages.dev/venue
- **Event Manager**: https://b6908330.indtix.pages.dev/event-manager
- **Ops Portal**: https://b6908330.indtix.pages.dev/ops
- **Brand Guide**: https://b6908330.indtix.pages.dev/brand
- **API Health**: https://b6908330.indtix.pages.dev/api/health
- **v22 Health**: https://b6908330.indtix.pages.dev/api/v22/health
- **v21 Health**: https://b6908330.indtix.pages.dev/api/v21/health

## Phase 22 New Features (85 new endpoints → 1,009 total)

### Fan Portal — Super-Fan Social Layer
- **Fan Clubs**: Create/join/leave artist-specific fan clubs; club feed with member activity
- **Artist Follow**: Follow/unfollow artists with notification bell alerts
- **Live Event Chat**: Simulated real-time chat wall during events
- **Poll Voting**: Setlist prediction polls + pre-event fan preference surveys
- **Merch Store**: Browse & add-to-cart artist/event merchandise with checkout flow
- **AR Ticket Wallet**: QR code with augmented-reality frame overlay preview
- **Gamified Check-in**: XP + confetti animation on event check-in
- **Event Countdown**: Live countdown timer to event start
- **Carbon Tracker Integration**: Per-event carbon footprint with offset progress

### Organiser Portal — Revenue Intelligence
- **Affiliate Link Builder**: Generate UTM-tagged affiliate URLs with custom payout %
- **Upsell Engine Config**: Configure cross-sell rules (GA upgrade, F&B bundle, parking)
- **Multi-Currency Payout Settings**: Select payout currency (INR, USD, EUR, GBP, AED)
- **Co-Organiser Revenue Split Slider**: Define % splits per co-organiser with approval workflow
- **Early-Bird Countdown Widget**: Time-pressure urgency banner on event page
- **Presale Access Code Generator**: Batch-generate codes with tier assignment + CSV download
- **Media Kit Builder**: Download logo pack, generate AI press release, export full kit ZIP
- **Post-Event Video Highlight Uploader**: Upload/manage highlight reels with view stats

### Admin Portal — Trust & Compliance
- **AI Content Moderation Queue**: Auto-flagged event descriptions/artist bios with approve/reject
- **DPDP Compliance Centre**: DSAR request management, consent log, erasure workflow
- **Organiser Payout Ledger**: Full ledger with bulk-approve and individual approval
- **Bulk Refund Processor**: CSV booking IDs → mass refund with batch ID tracking
- **Platform A/B Test Manager**: Create/track experiments with conversion metrics
- **Dark-Pattern Audit Panel**: Automated scan with violation/warning classification + resolve flow
- **API Rate-Limit Manager**: Per-tier (Enterprise/Business/Starter) limit configuration
- **SLA Dashboard**: Uptime %, latency, breach count, commitment matrix

### Venue Portal — Smart Infrastructure
- **IoT Sensor Dashboard**: Real-time temp/humidity/crowd-density per zone with status alerts
- **Energy Usage Monitor**: kWh today + cost + savings % + zone breakdown
- **Catering Forecast AI**: PAX-driven demand forecast per menu category
- **Multi-Zone Sound/Lighting Control**: Zone-level dB and light % setter
- **Maintenance Ticket System**: Create/resolve maintenance tickets with priority levels

### Event Manager — Day-of Operations
- **Wristband NFC Scan Log**: Real-time scan feed with valid/flagged/duplicate tagging
- **Gate Throughput Speedometer**: Scans/min per gate + queue length indicator
- **VIP Concierge Queue**: Request management with priority + fulfilment workflow
- **Real-Time Social Sentiment Wall**: Mention count, sentiment score, top tweets
- **Live Merchandise Sales Dashboard**: Item-level sales + revenue in real time
- **Artist Rider Tracker**: Rider requirement checklist with ready/pending status
- **Press/Photographer Credential Manager**: Badge issuance with org/type tracking

### Ops Portal — Platform Nerve Centre
- **Global Anomaly Detector**: Z-score alerts (Revenue Spike, Error Rate, CPU Usage)
- **Revenue Forecasting Panel**: 7-day daily forecast chart with confidence score
- **Carrier/Gateway Redundancy Matrix**: Primary + fallback latency per service
- **MTTR Tracker**: Average/P1 MTTR with incident history table
- **On-Call Rotation Schedule**: Current/next/upcoming engineer shifts + PagerDuty paging
- **Automated Post-Incident Report Generator**: Root cause, action items, impact summary
- **Data-Pipeline Health Monitor**: Per-pipeline lag (seconds) + throughput metrics

## Architecture
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: HTML5 + Tailwind CSS + Font Awesome + Chart.js
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Worker Size**: ~496 KB

## API Surface (1,009 endpoints)
| Category | Endpoints |
|----------|-----------|
| Auth & Users | ~85 |
| Events & Discovery | ~75 |
| Booking Engine | ~80 |
| KYC Workflow | ~30 |
| Seat Map & Add-ons | ~40 |
| Checkout & Payments | ~50 |
| Communications | ~45 |
| Organiser Portal | ~120 |
| Admin Portal | ~145 |
| Venue Portal | ~65 |
| Event Manager | ~65 |
| Ops Portal | ~60 |
| Analytics & BI | ~40 |
| AI/ML Layer | ~25 |
| Loyalty & Gamification | ~30 |
| Fan Clubs & Social | ~29 |
| RBAC & Security | ~15 |
| Reports & Exports | ~20 |
| **Total** | **1,009** |

## Phase 22 Backend API Reference
| Group | Key Endpoints |
|-------|--------------|
| Fan Clubs | GET/POST /api/fan/clubs, POST /api/fan/clubs/:id/join |
| Artist Follow | GET /api/fan/artists, POST/DELETE /api/fan/artists/:id/follow |
| Live Chat | GET /api/fan/chat/:event_id, POST /api/fan/chat/send |
| Polls | GET /api/fan/polls, POST /api/fan/polls/vote |
| Fan Merch | GET /api/fan/merch, POST /api/fan/merch/checkout |
| Gamified Check-in | POST /api/fan/checkin |
| Org Affiliates | POST /api/organiser/affiliates/generate, GET /api/organiser/affiliates |
| Upsell | GET/POST /api/organiser/upsell/config |
| Multi-Currency | GET /api/organiser/payouts/currencies, POST /api/organiser/payouts/request |
| Revenue Split | GET/PUT /api/organiser/revenue-split/:event_id |
| Presale Codes | POST/GET /api/organiser/presale/codes |
| Media Kit | POST /api/organiser/media-kit/download|press-release|export |
| Highlights | POST /api/organiser/highlights/upload, GET /api/organiser/highlights/:event_id |
| Content Moderation | GET /api/admin/moderation/queue, POST /api/admin/moderation/:item_id |
| DPDP | GET/POST /api/admin/dpdp/dsar, GET /api/admin/dpdp/consent-log |
| Payout Ledger | GET /api/admin/payouts, POST /api/admin/payouts/bulk-approve |
| Bulk Refunds | POST /api/admin/refunds/bulk |
| A/B Tests | GET/POST /api/admin/ab-tests |
| Dark Patterns | GET /api/admin/dark-patterns, POST audit/resolve |
| Rate Limits | GET /api/admin/rate-limits, PUT /api/admin/rate-limits/:tier |
| SLA Dashboard | GET /api/admin/sla-dashboard |
| IoT Sensors | GET /api/venue/:id/iot-sensors |
| Energy | GET /api/venue/:id/energy |
| Catering Forecast | POST /api/venue/:id/catering-forecast |
| Zone Control | PUT /api/venue/:id/zone-control |
| Maintenance | GET/POST /api/venue/:id/maintenance, POST .../resolve |
| NFC Scans | GET /api/events/:id/nfc-scans |
| Gate Throughput | GET /api/events/:id/gate-throughput |
| VIP Concierge | GET /api/events/:id/vip-concierge, POST .../fulfil |
| Social Sentiment | GET /api/events/:id/social-sentiment |
| Merch Sales | GET /api/events/:id/merch-sales |
| Artist Rider | GET /api/events/:id/artist-rider |
| Press Credentials | GET/POST /api/events/:id/press-credentials |
| Anomaly Detector | GET /api/ops/anomalies |
| Revenue Forecast | GET /api/ops/revenue-forecast |
| Redundancy Matrix | GET /api/ops/redundancy-matrix |
| MTTR | GET /api/ops/mttr |
| On-Call | GET /api/ops/oncall-schedule, POST /api/ops/oncall/page |
| Post-Incident | POST /api/ops/incidents/:id/report |
| Data Pipeline | GET /api/ops/data-pipeline |
| v22 Health | GET /api/v22/health |

## Data Models
- **User**: id, name, email, phone, role, kyc_status, wallet_balance, loyalty_points, tier
- **Event**: id, name, venue, date, tiers[], addons[], pricing_model, capacity, carbon_footprint
- **Booking**: id, user_id, event_id, tickets[], total, status, payment, qr_code, transfer_status
- **FanClub**: id, name, artist, members[], feed[], created_by, created_at
- **AffiliateLink**: id, event_id, organiser_id, code, url, commission_pct, clicks, conversions
- **DSAR**: id, user_email, type, status, deadline, processed_at
- **PresaleCode**: code, batch_id, tier, event_id, redeemed, redeemed_by
- **IoTSensor**: type, name, zone, temp, humidity, crowd_density, status
- **Incident**: id, title, severity, duration_min, root_cause, action_items[], resolved_at

## User Guide

### Fan Portal (/fan)
1. Browse events → AI recommendations carousel → seat selection → checkout
2. **Fan Clubs** tab: join artist fan clubs, see member feed, participate in polls
3. **Merch Store**: browse and buy event merchandise
4. **Gamified Check-in**: scan ticket at gate → earn XP + badge confetti
5. **Carbon Tracker**: view per-event footprint, track offset progress
6. **Loyalty**: Account → Rewards → view points, tier (Bronze→Platinum), redeem

### Organiser Portal (/organiser)
1. **Affiliate Links**: generate UTM links with custom payout %, share with influencers
2. **Upsell Engine**: configure which cross-sells to show (parking, F&B, upgrades)
3. **Revenue Split**: set co-organiser % shares before publish
4. **Presale Codes**: batch-generate VIP/early-access codes
5. **Media Kit**: download brand assets, auto-generate press release
6. **Video Highlights**: upload post-event recap videos

### Admin Portal (/admin)
1. **Content Moderation**: review AI-flagged content, approve or reject
2. **DPDP Centre**: manage DSAR requests, view consent records
3. **Payout Ledger**: bulk-approve organiser payouts
4. **Bulk Refunds**: upload booking IDs → mass refund processing
5. **A/B Tests**: create and monitor platform experiments
6. **Dark Pattern Audit**: run scan, resolve identified patterns
7. **Rate Limits**: adjust API quota per tier
8. **SLA Dashboard**: track uptime and latency commitments

### Venue Portal (/venue)
1. **IoT Sensors**: real-time zone temperature, humidity, crowd density
2. **Energy Monitor**: live kWh usage with cost and savings tracking
3. **Catering Forecast**: enter expected PAX → AI forecasts per item demand
4. **Zone Control**: adjust sound dB and lighting % per zone
5. **Maintenance Tickets**: log and resolve infrastructure issues

### Event Manager Portal (/event-manager)
1. **NFC Scan Log**: live feed of attendee entries with status flags
2. **Gate Throughput**: speedometer view of scans/min per gate
3. **VIP Concierge**: manage VIP requests with priority queue
4. **Social Sentiment**: live Twitter/Instagram mention sentiment
5. **Live Merch Sales**: real-time item-level sales dashboard
6. **Artist Rider**: check off rider requirements as fulfilled
7. **Press Credentials**: issue and track press/photographer badges

### Ops Portal (/ops)
1. **Anomaly Detector**: z-score alerts for revenue spikes, error rate spikes
2. **Revenue Forecast**: 7-day projection with confidence band
3. **Redundancy Matrix**: check primary/fallback gateway health
4. **MTTR**: track mean-time-to-resolve across incidents
5. **On-Call**: view current shift, page engineer via PagerDuty
6. **Post-Incident Reports**: auto-generate PIRs with root cause + action items
7. **Data Pipeline Health**: monitor ETL pipeline lag and throughput

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
curl http://localhost:3000/api/v22/health  # Health check
python3 /tmp/qa_phase22.py      # Run Phase 22 QA suite (174 tests)
```

## Version History
| Version | Phase | Endpoints | QA |
|---------|-------|-----------|-----|
| v22.0.0 | Phase 22 | 1,009 | 174/174 ✅ |
| v21.0.0 | Phase 21 | 924 | 149/149 ✅ |
| v20.0.0 | Phase 20 | 842 | 110/110 ✅ |
| v19.0.0 | Phase 19 | 760+ | 100% ✅ |
