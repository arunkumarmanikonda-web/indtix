# INDTIX Platform — v20.0.0

## Project Overview
- **Name**: INDTIX — India's Live Event Platform
- **Version**: v20.0.0 (Phase 20)
- **Goal**: End-to-end live event ticketing platform with 842 API endpoints across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 110/110 tests — 100% ✅

## Live URLs
- **Production (Cloudflare)**: https://12c4352c.indtix.pages.dev
- **Fan Portal**: https://12c4352c.indtix.pages.dev/fan
- **Organiser Portal**: https://12c4352c.indtix.pages.dev/organiser
- **Admin Portal**: https://12c4352c.indtix.pages.dev/admin
- **Venue Portal**: https://12c4352c.indtix.pages.dev/venue
- **Event Manager**: https://12c4352c.indtix.pages.dev/event-manager
- **Ops Portal**: https://12c4352c.indtix.pages.dev/ops
- **Brand Guide**: https://12c4352c.indtix.pages.dev/brand
- **API Health**: https://12c4352c.indtix.pages.dev/api/health
- **v20 Health**: https://12c4352c.indtix.pages.dev/api/v20/health
- **Sandbox**: https://3000-iq6s3w0eyyf60ds461kuz-c07dda5e.sandbox.novita.ai

## Phase 20 New Features (82 new endpoints)

### Group Booking
- POST /api/bookings/group — Group booking with 10-15% discount for 5+ people
- GET /api/bookings/group/:id — Get group booking details
- Frontend: Modal-based group booking flow in fan portal

### Waitlist System
- POST /api/events/:id/waitlist — Join waitlist for sold-out events
- GET /api/events/:id/waitlist — Get waitlist info (position, total waiting)
- DELETE /api/events/:id/waitlist — Leave waitlist
- GET/POST /api/organiser/waitlist — Manage waitlists with notify-all

### Dynamic Pricing Engine
- GET /api/events/:id/pricing — Live pricing with surge indicators
- POST /api/organiser/events/:id/pricing — Set pricing model
- GET/POST /api/admin/pricing/rules — Manage surge/early-bird rules
- Frontend: Dynamic pricing display modal in fan portal

### Dispute Management
- POST /api/disputes — Create dispute
- GET /api/disputes — List disputes (filter by status)
- POST /api/admin/disputes/:id/resolve — Resolve with refund/reject

### Tax Configuration
- GET/PUT /api/admin/tax/config — GST rates by category, GSTIN, invoice prefix
- POST /api/admin/tax/gst-invoice — Generate GST invoice

### Feature Flags
- GET /api/admin/feature-flags — 8 platform feature flags
- PUT /api/admin/feature-flags/:key — Toggle flag with rollout %
- POST /api/admin/feature-flags — Create new flag

### Platform Operations
- GET/PUT /api/admin/platform/fees — Convenience fee, gateway fee, commission
- GET/POST/PUT /api/admin/templates — WhatsApp/Email/Push templates
- GET/POST /api/admin/exports — Data export scheduler (CSV/XLSX/PDF)

### Ticket Transfer
- POST /api/bookings/:id/transfer — Peer-to-peer ticket transfer
- GET /api/bookings/:id/transfer — Transfer eligibility check

### Seat Map Editor (Organiser)
- POST/PUT /api/organiser/events/:id/seatmap — Create/update seat map with zones

### Add-on Builder (Organiser)
- POST/GET /api/organiser/events/:id/addons — Create and list event add-ons
- GET/POST/DELETE /api/organiser/events/:id/discounts — Discount code management

### Event Management
- POST /api/organiser/events/:id/duplicate — Clone event
- POST/GET /api/organiser/events/:id/co-organisers — Co-organiser invites
- GET/POST/DELETE /api/organiser/blacklist — Buyer blacklist management

### KYC & Fraud
- GET /api/admin/kyc/documents/:kyc_id — Document preview with OCR data
- POST /api/kyc/upload-document — OCR-verified document upload
- GET/POST/PUT /api/admin/fraud/rules — Fraud rule builder
- POST /api/admin/settlements/:id/hold|release — Settlement controls

### Venue Operations
- POST /api/venue/kyc — Venue KYC submission
- PUT /api/venue/:id/capacity — Capacity configuration
- POST /api/venue/:id/layout — Floor plan upload
- POST /api/venue/:id/vendors — Vendor assignment
- PUT /api/venue/:id/parking — Parking configuration

### Event Operations
- POST/GET /api/events/:id/incidents — Incident reporting & tracking
- POST/GET /api/events/:id/staff — Staff assignment & management
- POST /api/events/:id/announcements — Broadcast to all attendees
- POST /api/events/:id/lost-found — Lost & Found registry

### Ops Center
- GET /api/ops/events/:id/heatmap — Live crowd density heatmap
- POST /api/ops/emergency/broadcast — Emergency broadcast (all channels)
- POST /api/ops/incidents/:id/escalate — Incident escalation
- GET /api/ops/vendors — Vendor sales dashboard
- POST /api/ops/staff/checkin — Staff check-in with badge

### Fan Features
- POST/GET/DELETE /api/fan/wishlist — Wishlist CRUD
- POST /api/referral/generate — Generate referral code (₹100 reward)
- GET /api/referral/stats/:user_id — Referral dashboard
- POST /api/referral/validate — Validate referral code
- GET/PUT /api/users/:id/notification-preferences — Per-channel notification prefs
- POST /api/pwa/install-event — PWA install tracking
- GET /api/pwa/stats — PWA analytics
- GET /api/events/trending — Trending events (velocity)
- GET /api/events/nearby — Location-based event discovery
- GET /api/events/:id/carbon — Carbon footprint calculator
- POST /api/events/:id/carbon/offset — Purchase carbon offset
- GET /api/platform/accessibility — WCAG-AA accessibility score

## Architecture
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: HTML5 + Tailwind CSS + Font Awesome
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Worker Size**: ~440 KB

## API Surface (842 endpoints)
| Category | Endpoints |
|----------|-----------|
| Auth & Users | ~85 |
| Events & Discovery | ~70 |
| Booking Engine | ~80 |
| KYC Workflow | ~30 |
| Seat Map & Add-ons | ~40 |
| Checkout & Payments | ~50 |
| Communications | ~40 |
| Organiser Portal | ~90 |
| Admin Portal | ~120 |
| Venue Portal | ~40 |
| Event Manager | ~30 |
| Ops Portal | ~30 |
| Analytics & BI | ~40 |
| AI/ML Layer | ~20 |
| Loyalty & Gamification | ~25 |
| Fanclubs & Social | ~20 |
| RBAC & Security | ~15 |
| Reports & Exports | ~17 |
| **Total** | **842** |

## Data Models
- **User**: id, name, email, phone, role (fan/organiser/venue/admin), kyc_status, wallet_balance, loyalty_points
- **Event**: id, name, venue, date, tiers[], addons[], pricing_model, capacity
- **Booking**: id, user_id, event_id, tickets[], total, status, payment, qr_code
- **KYC**: id, entity_type, status, documents[], ocr_data, trust_score
- **SeatMap**: id, event_id, zones[], total_capacity, holds[]
- **Dispute**: id, type, status, booking_id, amount, resolution, timeline[]
- **FeatureFlag**: key, enabled, rollout_pct, description
- **PricingRule**: id, name, trigger, multiplier, status, events_affected

## User Guide

### Fan Portal (/fan)
1. Browse events by city/category
2. Open event → select tickets + add-ons → checkout
3. Group booking: tap "Group (5+)" for 5-15% discount
4. Waitlist: sold-out events show "Join Waitlist" button
5. Account → Wishlist → saved events (synced from API)
6. Live pricing: check "💰 Live Pricing" for surge/discount status
7. PWA: install app from browser for push notifications

### Organiser Portal (/organiser)
1. Create event with tiers, seat map, and add-ons
2. Seat Map Config → visual editor, save to API
3. Waitlist Manager → see & notify waitlisted fans
4. Discount Codes → create promo codes with limits
5. KYC → upload documents for verification

### Admin Portal (/admin)
1. KYC Review Queue → approve/reject with document preview
2. Feature Flags → toggle platform features in real-time
3. Fraud Rule Builder → configure velocity, VPN, card rules
4. Dispute Resolution → resolve with full/partial refund or reject
5. Dynamic Pricing → manage surge and early-bird rules
6. Tax Config → update GST rates by event category
7. Data Exports → schedule CSV/XLSX/PDF exports

## Deployment
- **Platform**: Cloudflare Pages (project: `indtix`)
- **Build Command**: `npm run build`
- **Output**: `dist/` directory
- **Status**: ✅ Active (Phase 20)
- **Last Deployed**: March 2026
- **Deployed URL**: https://12c4352c.indtix.pages.dev

## Development
```bash
npm run build          # Build for production
pm2 start ecosystem.config.cjs  # Start local server
curl localhost:3000/api/health   # Health check
python3 qa_phase20.py            # Run 110-test QA suite
npx wrangler pages deploy dist --project-name indtix  # Deploy
```
