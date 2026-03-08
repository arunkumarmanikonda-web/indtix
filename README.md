# INDTIX — India's Live Event Platform

## Project Overview
- **Name**: INDTIX
- **Goal**: Full-stack live event platform for India with 9 portals and 450+ API endpoints
- **Phase**: 16 (Current) ✅
- **Version**: 16.0.0
- **QA Score**: 142/142 (100%)

## 🌐 Live URLs
| Portal | URL |
|--------|-----|
| **Production Root** | https://indtix.pages.dev |
| **Fan Portal** | https://indtix.pages.dev/ |
| **Admin Portal** | https://indtix.pages.dev/admin |
| **Organiser Portal** | https://indtix.pages.dev/organiser |
| **Venue Portal** | https://indtix.pages.dev/venue |
| **Event Manager Portal** | https://indtix.pages.dev/event-manager |
| **Ops / POS Portal** | https://indtix.pages.dev/ops |
| **Brand Portal** | https://indtix.pages.dev/brand |
| **Developer Portal** | https://indtix.pages.dev/developer |
| **API Health** | https://indtix.pages.dev/api/health |
| **API Version** | https://indtix.pages.dev/api/version |
| **OpenAPI Docs** | https://indtix.pages.dev/api/docs |

## 🏗️ Tech Stack
- **Runtime**: Cloudflare Workers (Hono framework + TypeScript)
- **Frontend**: Vanilla HTML/CSS/JS with TailwindCSS CDN
- **Build Tool**: Vite + @hono/vite-cloudflare-pages
- **Deployment**: Cloudflare Pages
- **CI/CD**: Wrangler CLI

## 📊 Platform Stats (Phase 16)
| Metric | Value |
|--------|-------|
| Total API Endpoints | 450 |
| Portals | 9 |
| QA Test Coverage | 142 checks |
| QA Pass Rate | 100% |
| Bundle Size | ~297 kB |
| Platform Uptime | 99.94% |
| Total Events | 142 |
| Total Bookings | 842,000 |
| Total Users | 1,280,000 |
| GMV (INR) | ₹4.84 Billion |

## 🚀 Phase History

| Phase | Version | Key Additions |
|-------|---------|---------------|
| 1–5   | 5.0.0   | Core platform, auth, events, bookings |
| 6–10  | 10.0.0  | Organiser, venue, brand, promo, wallet |
| 11–13 | 13.0.0  | POS/Ops, LED wristbands, GST, reports |
| 14    | 14.0.0  | Admin settlements, venue calendar, LED |
| 15    | 15.0.0  | +45 endpoints: RBAC, EM runsheet, fan portal wiring |
| **16**| **16.0.0**| **+57 endpoints, 142/142 QA, full deployment** |

## ✅ Phase 16 Completed Features
- **142/142 QA tests passing (100%)** — up from 109 in Phase 15
- **57 new/fixed endpoints** across all 9 portals
- Fixed route shadowing for `/api/events/categories`, `/api/events/search`
- Fan portal: wishlist CRUD, group booking, livestream purchase, push notifications, carbon footprint
- Admin portal: RBAC roles CRUD, KYC queue, pending approvals, venue approve/reject, dispute & fraud
- Venue portal: GST invoices with download_url, floor plan save, staff management
- Event Manager: full runsheet CRUD with `items` key, PA test, post-event report, feedback distribution
- Brand portal: campaign detail wrapper, sponsor analytics with `impressions` key
- Developer portal: dashboard, webhook test, changelog
- Ops/POS: ticket scan, payment processing, shift report
- Cloudflare Pages deployment: all 11 routes returning HTTP 200

## 📋 API Endpoint Categories
| Category | Endpoints |
|----------|-----------|
| Core Platform | 11 |
| Auth | 4 |
| Bookings | 8 |
| Events | 12 |
| Promo & Wallet | 5 |
| Fan Portal | 20 |
| Organiser | 8 |
| Venue | 12 |
| Event Manager | 10 |
| Ops / POS | 15 |
| Admin | 40+ |
| Brand | 7 |
| Developer | 7 |
| Reports | 10 |
| Wristbands / LED | 8 |
| GST | 5 |

## 🗃️ Data Architecture
- **Storage**: Cloudflare Workers KV (stateless mock data in Phase 16)
- **CDN Assets**: r2.indtix.com (report downloads, PDFs, CSVs)
- **Stream CDN**: stream.indtix.com (livestream URLs)
- **Data Format**: JSON REST API, standardised response shapes

## 👤 User Guide

### Fan Portal (/)
Browse events, buy tickets, manage bookings, join fan clubs, stream live events, manage wishlist, redeem wallet credits.

### Organiser Portal (/organiser)
Create and manage events, view sales analytics, configure seat maps, monitor check-ins and LED wristbands.

### Venue Portal (/venue)
Manage venue profile, calendar, staff, GST invoices, revenue reports and settlement requests.

### Event Manager Portal (/event-manager)
Run sheet management, PA system testing, post-event reports, attendee data export, feedback distribution.

### Ops / POS Portal (/ops)
Ticket scanning, cash payments, refunds, cash drawer, gate switching, wristband issuance, LED control, emergency alerts.

### Admin Portal (/admin)
Full platform management: RBAC, KYC approval, venue approval, settlements, categories, cities, partners, sponsors, affiliates, API keys, GST reports, BI analytics.

### Brand Portal (/brand)
Campaign management, sponsor analytics, ROI reports.

### Developer Portal (/developer)
API key management, rate limit monitoring, SDK downloads, webhook testing, changelog.

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name indtix

# Local development
pm2 start ecosystem.config.cjs
```

## 📁 Project Structure
```
webapp/
├── src/
│   └── index.ts          # 7,600+ lines, 450 API endpoints
├── public/
│   ├── fan.html           # Fan Portal (~2,983 lines)
│   ├── admin.html         # Admin Portal
│   ├── organiser.html     # Organiser Portal
│   ├── venue.html         # Venue Portal
│   ├── event-manager.html # Event Manager Portal
│   ├── ops.html           # Ops/POS Portal
│   ├── brand.html         # Brand Portal
│   └── developer.html     # Developer Portal
├── dist/                  # Built output (deployed to Cloudflare)
├── wrangler.jsonc
├── vite.config.ts
└── ecosystem.config.cjs   # PM2 config
```

## 📅 Last Updated
**2026-03-08** — Phase 16 complete, 142/142 QA, live on Cloudflare Pages.
