# INDTIX — India's Live Event Platform v6.0

## Project Overview
- **Platform**: INDTIX — Full-stack live events ticketing & management platform
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **Phase**: 6 (Current) — 157/157 QA Pass
- **Version**: 6.0.0
- **API Version**: v6
- **Total Endpoints**: 157 (across 9 portals)
- **Codebase**: ~16,500 lines (src/index.ts + 9 portal HTML files)

---

## Production URLs
| Resource | URL |
|---|---|
| **Production** | https://4224b873.indtix.pages.dev |
| **Fan Portal** | https://4224b873.indtix.pages.dev/fan |
| **Organiser Portal** | https://4224b873.indtix.pages.dev/organiser |
| **Venue Portal** | https://4224b873.indtix.pages.dev/venue |
| **Event Manager** | https://4224b873.indtix.pages.dev/event-manager |
| **Admin Portal** | https://4224b873.indtix.pages.dev/admin |
| **Ops Portal** | https://4224b873.indtix.pages.dev/ops |
| **Brand Portal** | https://4224b873.indtix.pages.dev/brand |
| **Developer Portal** | https://4224b873.indtix.pages.dev/developer |
| **Architecture** | https://4224b873.indtix.pages.dev/architecture-spec |
| **Health API** | https://4224b873.indtix.pages.dev/api/health |

---

## QA Score History
| Phase | Tests | Passed | Status |
|---|---|---|---|
| Phase 3 | 63 | 63 | ✅ 100% |
| Phase 4 | 63 | 63 | ✅ 100% |
| Phase 5 | 151 | 151 | ✅ 100% |
| **Phase 6** | **157** | **157** | ✅ **100%** |

---

## Phase 6 Audit Findings & Fixes (60 total)

### Response-Key Mismatches Fixed
| Module | Fixed Keys |
|---|---|
| Events | `total` in list, unwrapped `event` detail, `booking_limits`, `capacity` |
| Auth | `otp_sent` in signup, clone returns 200 |
| Bookings | `total`, `payment_url`, `booking_id`, `refund_pct`, `refund_amount` |
| Scan | `valid`, `attendee` at top-level, `total_scanned` in scan stats |
| Admin | `gmv_this_month`, `venues`, `pending_approvals`, `events` in queue, `format` in export |
| Payments | `total_revenue`, `total_transactions`, `invoice_no`, `total_amount` |
| Promos | `discount_amount`, `code/type/value` in promo-by-code, analytics keys |
| Notifications | `status` in send, `channels` in prefs |
| Organiser | `age_groups`, `gender`, `predicted_sellout_pct`, `member` in team-POST |
| Venue | `upcoming_bookings`, `calendar`, `venues` in availability |
| Ops | `events`, `incidents`, `wristbands` in dashboard |
| POS | `order_id`, `total` at top, return 200 |
| Wristbands | `issued`, `total_issued`, `zones` |
| Fan Clubs | Return 201 on join |
| Livestream | `access_id`, `stream_url` |
| Merch | `total`, `order_id`, `status` |
| Sponsors | `sponsor_id`, `metrics` |
| Affiliate | Register 200, payout 201+`status` |
| Brand | `impressions`, `campaign_id`, `total_impressions`, `roi` |
| Developer | Keys 200, webhooks `webhook_id`, `usage` key |
| Trending | `events` key |
| Announcements | `announcement_id` |

---

## API Endpoint Categories (157 total)

### Core Events (19)
- `GET /api/events` — List with city/category/search filter + pagination
- `GET /api/events/:id` — Full detail with tiers, addons, policies
- `GET /api/events/:id/seatmap` — Zone-based seating with GA/PREM/VIP/ACCESSIBLE
- `GET /api/events/:id/tiers` — Pricing tiers with booking_limits
- `GET /api/events/:id/addons` — Combo meals, merch, parking
- `GET /api/events/:id/availability` — Real-time capacity
- `GET /api/events/:id/faq` — Chatbot FAQs
- `POST /api/events/:id/waitlist` — Join waitlist
- `GET /api/events/:id/waitlist` — Waitlist status
- `POST /api/events/:id/clone` — Duplicate event
- `POST /api/events/:id/emergency` — Emergency broadcast
- `GET /api/events/:id/checkin-live` — Live check-in rate
- `GET /api/events/:id/checkin-stats` — Gate-by-gate stats
- `GET /api/events/:id/social` — Social mentions & sentiment
- `GET /api/events/:id/sponsors` — Event sponsorships
- `GET /api/events/:id/incidents` — Event incidents
- `POST /api/events` — Create event
- `PUT /api/events/:id` — Update event
- `GET /api/trending` — Trending events

### Auth (5)
`login` · `signup` · `verify-otp` · `refresh` · `logout`

### Bookings (7)
`create` · `get` · `user bookings` · `bulk` · `cancel` · `scan/verify` · `scan/stats`

### Organiser (14)
`register` · `dashboard` · `analytics` · `analytics/v2` · `analytics/trend` · `audience` · `revenue/breakdown` · `events` · `settlements` · `team (GET/POST)` · `forecast (GET/POST)` · `coupons/distribute`

### Venue (4)
`register` · `dashboard` · `calendar` · `availability`

### Admin (20)
`stats` · `bi/dashboard` · `gst/monthly` · `kyc/queue` · `fraud/alerts` · `events/queue` · `events/pending` · `events/approve` · `events/reject` · `users` · `users/export` · `users/block` · `notifications` · `notifications/read` · `system/health` · `config (GET/POST)` · `reports/revenue` · `audit` · `experiments`

### Payments (6)
`refund` · `analytics` · `settlements` · `gst-report` · `gst/invoice` · `gst/report`

### Promos (7)
`list` · `catalog` · `by-code` · `validate` · `create` · `bulk-create` · `analytics`

### KYC & Settlements (4)
`kyc/submit` · `kyc/:id` · `settlements` · `settlements/process`

### Notifications (5)
`send` · `list` · `mark-read` · `preferences GET` · `preferences PUT`

### User & Loyalty (12)
`user profile` · `user profile v2` · `update profile` · `notif-prefs GET/PUT` · `loyalty points` · `loyalty redeem` · `wallet balance` · `wallet redeem` · `wallet add` · `referral` · `ticket transfer`

### Wristbands (5)
`issue` · `status` · `by-event` · `LED command` · `LED presets`

### POS & Ops (6)
`pos/sale` · `pos/sessions` · `ops/dashboard` · `incidents list/create/update`

### Fan Clubs (3)
`list` · `join` · `memberships`

### Live & Merch (5)
`livestreams` · `purchase` · `merch list` · `merch order` · `merch order get`

### Sponsors (5)
`list` · `create` · `detail` · `metrics GET/PUT`

### Affiliate (4)
`register` · `dashboard` · `stats` · `payout`

### AI (3)
`chat` · `forecast` · `recommendations`

### Brand (4)
`dashboard` · `campaigns list` · `create campaign` · `analytics`

### Developer (6)
`endpoints` · `keys GET/POST` · `usage` · `webhooks GET/POST`

### Search & Discovery (6)
`search` · `cities` · `categories` · `venues` · `trending` · `recommendations`

### Misc (5)
`whitelabel/provision` · `announcements list/create/by-event` · `status`

---

## Data Architecture
- **Event Data**: 8 seeded live events (Sunburn, NH7, Zakir Hussain, IPL, Diljit, TEDx, Comedy Central, Lollapalooza)
- **Storage**: Cloudflare Workers edge-global (in-memory simulation for demo)
- **Auth**: Token-based (Bearer tok_* format)
- **GST**: CGST+SGST (intra-state) / IGST (inter-state), HSN 9996 (events) + 9984 (platform fees)
- **Payments**: UPI 60% / Card 25% / Net Banking 10% / Wallet 5%

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

---

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active
- **Build Size**: ~153 kB (worker bundle)
- **Cold Start**: <5ms (edge-global)
- **Last Deployed**: Phase 6 (2026-03-07)

## Development
```bash
npm run build          # Build for production
pm2 start ecosystem.config.cjs  # Start dev server on :3000
npm run db:migrate:local        # (if D1 enabled)
```

## Next Development Phase (Phase 7 Candidates)
1. **Real-time Features**: WebSocket-based live check-in dashboard
2. **D1 Database**: Persistent data storage with Cloudflare D1
3. **Stripe/Razorpay Integration**: Real payment gateway via API routes
4. **Multi-tenant Auth**: JWT-based org/venue/admin role separation
5. **Event Search**: Full-text search with Cloudflare Workers AI
6. **Analytics Dashboard**: Real-time Chart.js dashboards in portals
7. **WhatsApp Integration**: Twilio/Meta WhatsApp Business API for notifications
8. **Image Upload**: R2 bucket integration for event banners/media
