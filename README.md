# INDTIX — India's Live Event Platform v8.0

## Project Overview
- **Platform**: INDTIX — Full-stack live events ticketing & management platform
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **Phase**: 8 (Current) — **20/20 Production QA (100%)** + **67/67 local QA (100%)**
- **Version**: 8.0.0
- **API Version**: v8
- **Total Endpoints**: 185 (across 9 portals)
- **Codebase**: ~18,000+ lines (src/index.ts + 9 portal HTML files + public assets)

---

## Production URLs
| Resource | URL |
|---|---|
| **Production** | https://b5560f96.indtix.pages.dev |
| **Fan Portal** | https://b5560f96.indtix.pages.dev/fan |
| **Organiser Portal** | https://b5560f96.indtix.pages.dev/organiser |
| **Venue Portal** | https://b5560f96.indtix.pages.dev/venue |
| **Event Manager** | https://b5560f96.indtix.pages.dev/event-manager |
| **Admin Portal** | https://b5560f96.indtix.pages.dev/admin |
| **Ops Portal** | https://b5560f96.indtix.pages.dev/ops |
| **Brand Portal** | https://b5560f96.indtix.pages.dev/brand |
| **Developer Portal** | https://b5560f96.indtix.pages.dev/developer |
| **Architecture** | https://b5560f96.indtix.pages.dev/architecture-spec |
| **Health API** | https://b5560f96.indtix.pages.dev/api/health |

---

## QA Score History
| Phase | Tests | Passed | Status |
|---|---|---|---|
| Phase 3 | 63 | 63 | ✅ 100% |
| Phase 4 | 63 | 63 | ✅ 100% |
| Phase 5 | 151 | 151 | ✅ 100% |
| Phase 6 | 157 | 157 | ✅ 100% |
| Phase 7 | 44 prod + 126 local | 170 | ✅ 100% |
| **Phase 8** | **20 prod + 67 local** | **87** | ✅ **100%** |

---

## Phase 7 Audit Findings & Fixes (26 total)

### New Endpoints Added
| Endpoint | Description |
|---|---|
| `GET /api/bookings` | List all bookings (admin/organiser) |
| `GET /api/whitelabel/provision` | List white-label instances |
| `POST /api/admin/users/export` | POST alias for export (was GET only) |

### Response-Key Mismatches Fixed
| Endpoint | Fixed Keys Added |
|---|---|
| `GET /api/events/:id` | `ticket_tiers` (alias for `tiers`) |
| `GET /api/payments/gst-report` | `total_gst`, `cgst`, `sgst`, `igst`, `taxable_value` (top-level) |
| `POST /api/events/:id/clone` | `new_event_id` alias for `event_id` |
| `POST /api/scan/verify` | Accepts `qr_data` field (was only `qr_code`) |
| `GET /api/scan/stats/:id` | `total_tickets_sold` (was `total_scanned` only) |
| `GET /api/admin/bi/dashboard` | `dau`, `gmv_today` at top-level |
| `GET /api/admin/gst/monthly` | `month` key at top-level |
| `GET /api/admin/forecast` | `forecasts` array (alias for `forecast`) |
| `GET /api/organiser/analytics/v2` | `summary` object |
| `GET /api/organiser/revenue/breakdown` | `gross`, `organiser_net` at top-level |
| `GET /api/organiser/revenue/chart` | `chart` object |
| `GET /api/organiser/forecast` | `forecasts` alias for `forecast` |
| `GET /api/venue/dashboard` | `total_bookings` count |
| `GET /api/affiliate/stats/:id` | `total_clicks`, `conversions`, `total_commission` at top-level |
| `POST /api/ai/forecast` | `predictions` object |
| `GET /api/merch/order/:id` | `id` at top-level (was `order_id` only) |
| `GET /api/kyc/:id` | `status` at top-level |
| `POST /api/developer/keys` | `api_key` at top-level |
| `GET /api/gst/report` | `taxable_value`, `total_gst` at top-level |
| `GET /api/reports/summary` | `summary` object |
| `POST /api/tickets/:id/transfer` | Returns `error` key (non-transferable policy) |
| `GET /api/event-manager/dashboard` | `events` array |

### PWA & Static Asset Fixes
- Fixed favicon returning 200 (SVG route in Hono)
- Fixed `sw.js` routing (excluded from worker, served as static)
- Fixed SW cache list — removed `/fan.html` redirect (308) to prevent 404 errors
- Added `manifest.json` with proper PWA metadata

---

## API Endpoint Categories (185 total)

### Core Events (21)
- `GET /api/events` — List with city/category/search filter + pagination
- `GET /api/events/:id` — Full detail with tiers, addons, policies, ticket_tiers
- `GET /api/events/:id/seatmap` — Zone-based seating with GA/PREM/VIP/ACCESSIBLE
- `GET /api/events/:id/tiers` — Pricing tiers
- `GET /api/events/:id/addons` — Combo meals, merch, parking
- `GET /api/events/:id/availability` — Real-time capacity
- `GET /api/events/:id/faq` — Event FAQs
- `GET /api/events/:id/reviews` — Event reviews
- `GET /api/events/:id/related` — Related events
- `POST /api/events/:id/waitlist` — Join waitlist
- `GET /api/events/:id/waitlist` — Waitlist status
- `POST /api/events/:id/clone` — Duplicate event (returns new_event_id)
- `POST /api/events/:id/emergency` — Emergency broadcast
- `GET /api/events/:id/checkin-live` — Live check-in rate
- `GET /api/events/:id/checkin-stats` — Gate-by-gate stats
- `GET /api/events/:id/social` — Social mentions & sentiment
- `GET /api/events/:id/sponsors` — Event sponsorships
- `GET /api/events/:id/incidents` — Event incidents
- `POST /api/events` — Create event
- `PUT /api/events/:id` — Update event
- `GET /api/trending` — Trending events

### Auth (6)
`login` · `signup` · `verify-otp` · `refresh` · `logout` · `verify`

### Bookings (8)
`list all` · `create` · `get` · `user bookings` · `bulk` · `cancel` · `scan/verify (accepts qr_data)` · `scan/stats`

### Organiser (15)
`register` · `dashboard` · `analytics` · `analytics/v2 (summary)` · `analytics/trend` · `audience` · `revenue/breakdown (gross)` · `revenue/chart (chart)` · `events` · `settlements` · `team (GET/POST)` · `forecast (GET/POST, forecasts)` · `coupons/distribute` · `audience`

### Venue (5)
`register` · `dashboard (total_bookings)` · `calendar` · `availability` · `enquiry`

### Admin (21)
`stats` · `bi/dashboard (dau,gmv_today)` · `gst/monthly (month)` · `kyc/queue` · `fraud/alerts` · `events/queue` · `events/pending` · `events/approve` · `events/reject` · `users` · `users/export (GET+POST)` · `users/block` · `system/health` · `platform/health` · `config (POST)` · `forecast (forecasts)` · `notifications` · `bi`

### Payments (7)
`refund` · `analytics` · `settlements` · `gst-report (total_gst)` · `gst/invoice` · `gst/report (taxable_value)` · `reports/summary (summary)`

### Promos (7)
`list` · `catalog` · `by-code` · `validate` · `create` · `bulk-create` · `analytics`

### KYC & Settlements (4)
`kyc/submit` · `kyc/:id (status)` · `settlements` · `settlements/process`

### Notifications (5)
`send` · `list` · `mark-read` · `count` · `preferences GET` · `preferences PUT`

### User & Loyalty (12)
`user profile` · `update profile` · `notif-prefs` · `wallet balance` · `wallet add` · `wallet redeem` · `referral` · `ticket transfer (error key)`

### Wristbands (5)
`issue` · `status` · `by-event` · `LED command` · `LED presets`

### POS & Ops (6)
`pos/sale` · `pos/sessions` · `ops/dashboard` · `incidents list/create/update`

### Fan Clubs (3)
`list` · `join` · `memberships`

### Live & Merch (5)
`livestreams` · `purchase` · `merch list` · `merch order` · `merch order get (id)`

### Sponsors (5)
`list` · `create` · `detail` · `metrics GET/PUT`

### Affiliate (5)
`register` · `dashboard` · `stats` · `stats/:id (total_clicks)` · `payout`

### AI (3)
`chat` · `forecast (predictions)` · `recommendations`

### Brand (4)
`dashboard` · `campaigns list` · `create campaign` · `analytics`

### Developer (6)
`endpoints` · `keys GET/POST (api_key)` · `usage` · `webhooks GET/POST`

### Search & Discovery (6)
`search` · `cities` · `categories` · `venues` · `trending` · `recommendations`

### Misc (6)
`whitelabel/provision (GET+POST)` · `announcements list/create/by-event` · `status` · `reports/summary`

---

## Browser Console Status (All Portals)
| Portal | Errors | Warnings | Status |
|---|---|---|---|
| Fan Portal | 0 errors | DOM password field warnings (cosmetic) | ✅ Clean |
| Organiser Portal | 0 errors | 1 color format warning (cosmetic) | ✅ Clean |
| Admin Portal | 0 | 0 | ✅ Clean |
| Venue Portal | 0 | 0 | ✅ Clean |
| Event Manager | 0 | 0 | ✅ Clean |
| Brand Portal | 0 | 1 Tailwind CDN warning (cosmetic) | ✅ Clean |
| Developer Portal | 0 | 0 | ✅ Clean |
| Ops Portal | 0 | 0 | ✅ Clean |

---

## Data Architecture
- **Event Data**: 8 seeded live events (Sunburn, NH7, Zakir Hussain, IPL, Diljit, TEDx, Comedy Central, Lollapalooza)
- **Storage**: Cloudflare Workers edge-global (in-memory simulation for demo)
- **Auth**: Token-based (Bearer tok_* format)
- **GST**: CGST+SGST (intra-state) / IGST (inter-state), 18% rate
- **Payments**: UPI 55% / Card 23% / Net Banking 10% / Wallet 12%
- **PWA**: Service worker with offline support, manifest.json

---

## Tech Stack
| Layer | Technology |
|---|---|
| Backend | Hono Framework + Cloudflare Workers |
| Runtime | TypeScript (ES2020) |
| Build | Vite + @hono/vite-cloudflare-pages |
| CDN | Cloudflare Pages (edge-global) |
| Frontend | Vanilla JS + TailwindCSS (CDN) + Chart.js |
| Dev Server | Wrangler Pages Dev + PM2 |
| PWA | Service Worker v4 + Web App Manifest |

---

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Build Size**: ~155 kB (worker bundle)
- **Cold Start**: <5ms (edge-global)
- **Last Deployed**: Phase 7 (2026-03-07) — https://b5560f96.indtix.pages.dev

## Development
```bash
npm run build          # Build for production
pm2 start ecosystem.config.cjs  # Start dev server on :3000
```

## Phase 8 Candidates (Next)
1. **Real-time Features**: WebSocket-based live check-in dashboard
2. **D1 Database**: Persistent data storage with Cloudflare D1
3. **Stripe/Razorpay Integration**: Real payment gateway via API routes
4. **Multi-tenant Auth**: JWT-based org/venue/admin role separation
5. **Event Search**: Full-text search with Cloudflare Workers AI
6. **WhatsApp Integration**: Meta WhatsApp Business API
7. **Image Upload**: R2 bucket integration for event banners/media
8. **Push Notifications**: Web Push API via service worker
