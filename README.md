# INDTIX Platform — v76.0.0 (Phase 76: Customer Experience, CRM & Fan Loyalty)

## Project Overview
- **Name**: INDTIX — India's Premier Live Event Ticketing & Experience Platform
- **Version**: v76.0.0
- **Current Phase**: Phase 76 — Customer Experience, CRM & Fan Loyalty Platform
- **Total API Endpoints**: 5,869 (4,642 route handlers across 76 phases)
- **Source Lines**: ~32,151 (src/index.ts)
- **Portals**: 6 (Admin, Organiser, Venue, Event Manager, Ops, Fan)

## Live URLs
- **Production (Latest)**: https://6acd5ae2.indtix.pages.dev
- **Production (Stable)**: https://indtix.pages.dev
- **Health Check**: https://6acd5ae2.indtix.pages.dev/api/health
- **Admin Portal**: https://6acd5ae2.indtix.pages.dev/admin
- **Fan Portal**: https://6acd5ae2.indtix.pages.dev/fan
- **Organiser Portal**: https://6acd5ae2.indtix.pages.dev/organiser
- **Venue Portal**: https://6acd5ae2.indtix.pages.dev/venue
- **Event Manager Portal**: https://6acd5ae2.indtix.pages.dev/event-manager
- **Ops Portal**: https://6acd5ae2.indtix.pages.dev/ops
- **API Portals Index**: https://6acd5ae2.indtix.pages.dev/portals.html

## Platform Architecture
- **Runtime**: Cloudflare Workers (Edge, global)
- **Framework**: Hono v4
- **Frontend**: Vanilla JS + Tailwind CSS + Chart.js (CDN)
- **Portal Fix**: `/public/static/portal-fix.js` v6.1 — universal panel wiring for all 6 portals
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Bundle**: ~1,540 KB _worker.js

---

## Portal Panel Counts (v76.0.0)
| Portal | Total Panels | Phase 66+ Panels | Default Panel |
|--------|-------------|-----------------|---------------|
| Admin | 65 | 32 | panel-dashboard |
| Organiser | 50 | 28 | panel-dashboard |
| Venue | 40 | 27 | panel-dashboard |
| Event Manager | 39 | 22 | panel-dashboard |
| Ops | 13 | 13 | ops-scanner |
| Fan | 14 | 14 | panel-p26-fan |

---

## Phase History

| Phase | Theme | New Endpoints | Cumulative |
|-------|-------|---------------|------------|
| 1–23  | Core Platform, Trust & Ops | ~1,279 | 1,279 |
| 24 | Monetisation, Personalisation & Ops Excellence | 90 | 1,369 |
| 25 | Platform Intelligence & Scale | 90 | 1,459 |
| 26 | QA Fixes + Social Commerce | 90 | 1,549 |
| 27 | Immersive Experiences & Web3 | 90 | 1,639 |
| 28 | Global Expansion & Localisation | 90 | 1,729 |
| 29 | Next-Gen Revenue, Sustainability & Global Scale | 90 | 1,819 |
| 30 | AI Autonomy, Quantum-Ready & Platform Singularity | 90 | 1,909 |
| 31 | Hyper-Scale India & Bharat Expansion | 90 | 1,999 |
| 32 | International Expansion (SEA / MENA / UK) | 90 | 2,089 |
| 33 | Deep India Vernacular & Cultural Layer | 90 | 2,179 |
| 34 | Enterprise B2B & Corporate Events | 90 | 2,269 |
| 35 | Next-Gen Payments & FinTech | 90 | 2,359 |
| 36 | AR/VR Hybrid Events | 90 | 2,449 |
| 37 | Advanced Security & Compliance | 90 | 2,539 |
| 38 | Influencer & Creator Economy | 90 | 2,629 |
| 39 | Hyperlocal Discovery & Micro-Events | 90 | 2,719 |
| 40 | Live Streaming & Virtual Events | 90 | 2,809 |
| 41 | Advanced Analytics & BI | 90 | 2,899 |
| 42 | Partnership Ecosystem & White-Label | 90 | 2,989 |
| 43 | Sustainability & Green Events | 90 | 3,079 |
| 44 | Venue Tech & Smart Infrastructure | 90 | 3,169 |
| 45 | Artist & Talent Management | 90 | 3,259 |
| 46 | Fan Engagement & Community | 90 | 3,349 |
| 47 | Supply Chain & Logistics | 90 | 3,439 |
| 48 | Legal, Risk & Insurance | 90 | 3,529 |
| 49 | Advanced Personalisation Engine | 90 | 3,619 |
| 50 | Platform Maturity & DevOps | 90 | 3,709 |
| 51–65 | Extended Modules (Regional, Compliance, BI) | 1,350 | 5,059 |
| 66 | Creator Economy & Social Commerce | 90 | 5,149 |
| 67 | Green Events & Sustainability 2.0 | 90 | 5,239 |
| 68 | Accessibility & Inclusion | 90 | 5,329 |
| 69 | AI Intelligence & Automation | 90 | 5,419 |
| 70 | Blockchain & Web3 | 90 | 5,509 |
| 71 | Live Streaming & Hybrid Events 2.0 | 90 | 5,599 |
| 72 | Sports Events, Stadium Tech & Fantasy Gaming | 90 | 5,689 |
| 73 | Food, Beverage, Hospitality & Concessions | 90 | 5,779 |
| 74 | Travel, Transport, Accommodation & Logistics | 45 | 5,824 |
| 75 | Ticketing Technology, Marketplace & Secondary Market | 45 | 5,869 |
| **76** | **Customer Experience, CRM & Fan Loyalty** | **90** | **5,869** |

---

## Phase 76 — Customer Experience, CRM & Fan Loyalty (v76.0.0)

### Key Metrics
- **28.4M** fans profiled | **2,840** data points per fan
- **284 AI** segments | **₹284 Cr** LTV impact
- **NPS 88** | **94.2%** AI accuracy | **+42% YoY** growth

### 10 New Modules (90 Endpoints)
1. **Fan CRM & 360° Profile** — `/api/v76/fan-crm/*`
2. **Customer Journey Orchestration** — `/api/v76/journey/*`
3. **Loyalty & Rewards 2.0** — `/api/v76/loyalty-v2/*`
4. **Personalisation Engine** — `/api/v76/personalisation/*`
5. **Sentiment Analysis** — `/api/v76/sentiment/*`
6. **Retention & Churn Prevention** — `/api/v76/retention/*`
7. **Omnichannel Communication** — `/api/v76/omnichannel/*`
8. **Fan Community & Social** — `/api/v76/fan-community/*`
9. **CX Analytics & Benchmarking** — `/api/v76/cx-analytics/*`
10. **Lifetime Value Maximisation** — `/api/v76/ltv/*`

---

## Frontend Portal System

### portal-fix.js v6.1 (Universal Portal Fix)
Located at `/public/static/portal-fix.js`. Key features:
- **coreShowPanel()** — Unified panel switching for all 6 portals
- **buildPhaseModulesFAB()** — Floating "📋" button for phase 66-76 navigation
- **addLatestPhaseNavButtons()** — Sidebar injection for admin/organiser/venue/em/ops portals
- **injectOrphanNav()** — Auto-detects and wires orphan panels without nav buttons
- **Anti-FOUC** — CSS injected in `<head>` to hide panels before JS activates them
- **Error suppression** — Catches null-reference errors from auto-loaders

### Panel CSS Architecture
```css
.panel { display: none !important; }
.panel.active { display: block !important; }
```
Inline `style="display:none"` removed from all panel divs — CSS `!important` rules handle visibility.

---

## API Structure

### Base Paths by Version
- `v1–v23`: Core platform (ticketing, payments, venues, users, etc.)
- `v24–v50`: Intelligence, personalisation, enterprise features
- `v51–v65`: Regional, compliance, advanced BI
- `v66–v76`: Latest phases (creator economy through CX/CRM)

### Key Endpoints
```
GET  /api/health                          — Platform health & version
GET  /api/v76/fan-crm/profile            — Fan 360° profile
GET  /api/v76/loyalty-v2/overview        — Loyalty programme overview
POST /api/v76/personalisation/recommend  — AI event recommendations
GET  /api/v75/secondary-market/overview  — Secondary market stats
GET  /api/v70/nft-tickets/overview       — NFT ticketing
GET  /api/v69/ai-recommendations/overview — AI recommendations
```

---

## Development

### Local Development
```bash
npm run build
pm2 start ecosystem.config.cjs
# Server at http://localhost:3000
```

### Deploy to Production
```bash
npm run build
npx wrangler pages deploy dist --project-name indtix
```

### Key Scripts
```bash
npm run build          # Vite build → dist/
npm run dev:sandbox    # wrangler pages dev
git add . && git commit -m "message"
```

---

## Deployment Status
- **Platform**: Cloudflare Pages
- **Project Name**: `indtix`
- **Status**: ✅ Active
- **Last Deployed**: Phase 76 — v76.0.0
- **Bundle Size**: ~1,540 KB (_worker.js)
- **Build Warnings**: Duplicate key `industry_avg` fixed in v76.0.1

---

## Tech Stack
- **Backend**: Hono v4 + TypeScript on Cloudflare Workers
- **Frontend**: Vanilla JS, Tailwind CSS (CDN), Chart.js (CDN), Font Awesome (CDN)
- **Build**: Vite 5 + @hono/vite-cloudflare-pages
- **Deploy**: Wrangler 3 → Cloudflare Pages
- **Dev Server**: wrangler pages dev (PM2 managed in sandbox)
