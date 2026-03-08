# IndTix — India's Premier Event Ticketing Platform

## Project Overview
- **Name**: IndTix
- **Version**: 17.0.0
- **Phase**: 17 (Current)
- **Goal**: Full-stack event ticketing platform serving fans, organisers, venues, event managers, ops/POS staff, admins, brand sponsors, and developers
- **Tech Stack**: Hono + TypeScript + Cloudflare Workers + TailwindCSS (CDN)

## 🌐 URLs
- **Production**: https://indtix.pages.dev
- **Latest Deploy**: https://409f7729.indtix.pages.dev
- **API Health**: https://indtix.pages.dev/api/health
- **API Version**: https://indtix.pages.dev/api/version

## 📊 Platform Stats
| Metric | Value |
|--------|-------|
| API Endpoints | 500+ |
| QA Coverage | 111/111 (100%) |
| Portals | 9 |
| Build Size | 321 kB |
| Uptime | 99.97% |

## 🎯 Portals
| Portal | URL | Description |
|--------|-----|-------------|
| Fan | /fan | Browse events, buy tickets, wishlist, wallet |
| Admin | /admin | Platform management, KYC, approvals, RBAC |
| Organiser | /organiser | Event creation, analytics, settlements |
| Venue | /venue | Venue management, LED, GST, floor plans |
| Event Manager | /event-manager | Runsheet, incidents, team, announcements |
| Ops/POS | /ops | Ticket scanning, POS payments, shift reports |
| Brand | /brand | Campaign analytics, sponsor ROI |
| Developer | /developer | API keys, webhooks, documentation |
| Portals Hub | /portals | Navigation hub for all portals |

## 🔌 Key API Endpoints

### Core
- `GET /api/health` — Platform health (phase, version, status)
- `GET /api/version` — Version info (v17, 500 endpoints)
- `GET /api/stats` — Public platform statistics
- `GET /api/events` — Events listing with filters
- `GET /api/events/categories` — Event categories
- `GET /api/events/search?q=` — Full-text search with pagination
- `GET /api/search?q=&type=` — Global search across all content

### Auth
- `POST /api/auth/login` — Login with phone
- `POST /api/auth/signup` — Signup (phone or email)
- `POST /api/auth/verify-otp` — OTP verification
- `GET /api/auth/me` — Current user profile

### Fan Portal
- `GET /api/fan/profile` — Fan profile
- `GET /api/fan/tickets` — My tickets with QR codes
- `GET/POST /api/fan/wishlist` — Wishlist management
- `POST /api/fan/livestream/purchase` — Buy livestream access
- `POST /api/fanclubs/join` — Join fan club
- `GET /api/fan/notifications` — Notification centre
- `GET /api/referral/link` — Referral link & earnings
- `GET /api/wallet/balance` — Wallet balance
- `GET /api/events/:id/carbon` — Carbon footprint info

### Bookings
- `POST /api/bookings/create` — Create booking
- `POST /api/bookings/group` — Group booking with discount
- `GET /api/bookings/:id/qr` — QR code for ticket
- `GET /api/bookings/:id/calendar` — Add to calendar (iCal/Google)

### Organiser
- `GET /api/organiser/events` — My events
- `POST /api/organiser/events/create` — Create new event
- `GET /api/organiser/events/:id/analytics` — Event analytics
- `POST /api/organiser/events/:id/duplicate` — Duplicate event
- `GET/PUT /api/organiser/seatmap/:id` — Seat map config
- `GET /api/organiser/settlements` — Settlement reports
- `GET /api/organiser/performance` — Organiser performance stats

### Venue
- `GET /api/venue/profile` — Venue profile
- `GET /api/venue/gst/invoices` — GST invoice list
- `GET /api/venue/led/status` — LED panel status
- `POST /api/venue/led/control` — Control LED zones
- `GET /api/venue/v1/floorplan` — Floor plan zones

### Event Manager
- `GET /api/event-manager/runsheet/:id` — Run sheet
- `POST /api/event-manager/runsheet/:id/item` — Add item
- `GET /api/event-manager/incidents` — Incident log
- `GET /api/event-manager/team` — Team members
- `GET /api/event-manager/tasks` — Task list

### Ops/POS
- `POST /api/pos/scan` — Ticket scan
- `POST /api/pos/payment` — Process payment
- `GET /api/pos/shift/report` — Shift summary
- `GET /api/ops/realtime` — Real-time counters

### Admin
- `GET /api/admin/dashboard` — Admin dashboard (total_revenue, stats)
- `GET /api/admin/pending-approvals` — Approval queue
- `GET /api/admin/rbac/roles` — RBAC role management
- `GET /api/admin/api-keys` — API key management
- `POST /api/admin/notifications/bulk` — Bulk notifications
- `GET /api/admin/gst/report` — GST report

### Brand
- `GET /api/brand/campaigns` — Campaign list
- `GET /api/brand/campaigns/:id` — Campaign details (with campaign wrapper)
- `GET /api/brand/sponsor/:id/analytics` — Sponsor analytics (with impressions)
- `GET /api/brand/roi/export` — ROI export

### Developer
- `GET /api/developer/dashboard` — Dev dashboard (api_calls)
- `GET /api/developer/api-keys` — API key list
- `POST /api/developer/webhook/test` — Test webhook
- `POST /api/developer/snippets/copy` — Copy code snippet

### Reports
- `GET /api/reports` — All reports list
- `GET /api/reports/download/:id` — Download report
- `GET /api/admin/finance/report` — Finance report
- `GET /api/admin/venue/report` — Venue report
- `GET /api/event-manager/report/full` — EM full report

### Notifications & Platform
- `GET /api/notifications` — Notifications centre
- `POST /api/notifications/mark-read` — Mark as read
- `POST /api/notifications/mark-all-read` — Mark all read
- `GET /api/platform/health` — Detailed service health
- `GET /api/realtime/counters` — Real-time platform counters

## 📐 Data Architecture
- **Storage**: Cloudflare Workers KV (in-memory for mock data)
- **Events**: EVENTS_DATA array with full event objects
- **Users**: Mock user profiles for each portal
- **Bookings**: Dynamically generated booking IDs
- **CDN Assets**: All static files via Cloudflare CDN

## 🔄 Phase History
| Phase | Version | Endpoints | Key Features |
|-------|---------|-----------|--------------|
| 14 | 14.0.0 | 280 | Core portals launch |
| 15 | 15.0.0 | 390 | Admin RBAC, Event Manager, Fan wallet |
| 16 | 16.0.0 | 450 | Fan wishlist, livestream, group booking, notifications |
| **17** | **17.0.0** | **500** | **Toast→API wiring, notifications centre, search, real-time counters, 111/111 QA** |

## 📋 Phase 17 Changes
- ✅ Wired all pure-toast functions to real API calls (organiser, ops, developer, event-manager portals)
- ✅ Added Notifications Centre (`/api/notifications`, mark-read, mark-all-read)
- ✅ Added Global Search (`/api/search`) with filters & pagination
- ✅ Added Real-time Counters (`/api/realtime/counters`, `/api/ops/realtime`)
- ✅ Added Platform Health (`/api/platform/health`) with per-service status
- ✅ Fixed 52 missing endpoints (fan profile, venue routes, EM team/tasks/incidents, POS payment, admin pending-approvals, developer dashboard, reports)
- ✅ Fixed key mismatches (views, booking_id, discount_pct, total_revenue, api_calls, venue_name)
- ✅ 111/111 QA checks passing (100%)

## 🚀 Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Branch**: main
- **Last Deploy**: 2026-03-08
- **Deploy Command**: `npm run build && npx wrangler pages deploy dist --project-name indtix`

## 👤 User Guide
1. **Browse Events**: Visit https://indtix.pages.dev → see featured events
2. **Fan Portal**: https://indtix.pages.dev/fan — buy tickets, manage wishlist, join fan clubs
3. **Organiser Portal**: https://indtix.pages.dev/organiser — create & manage events
4. **Admin Portal**: https://indtix.pages.dev/admin — platform administration
5. **Developer Portal**: https://indtix.pages.dev/developer — API keys & webhook testing
6. **All Portals**: https://indtix.pages.dev/portals — navigation hub
