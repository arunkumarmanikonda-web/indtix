# INDTIX Platform v4.0

**India's most comprehensive event ticketing & management ecosystem** — 10 portals, 77 API endpoints, 52 live fetch() integrations, zero placeholder buttons.

---

## 🌐 Live URLs

| Environment | URL |
|---|---|
| **Production (latest)** | https://1737399e.indtix.pages.dev |
| **Fan Portal** | https://1737399e.indtix.pages.dev/fan |
| **Organiser Portal** | https://1737399e.indtix.pages.dev/organiser |
| **Venue Portal** | https://1737399e.indtix.pages.dev/venue |
| **Event Manager Portal** | https://1737399e.indtix.pages.dev/event-manager |
| **Admin / ERP** | https://1737399e.indtix.pages.dev/admin |
| **Ops / POS** | https://1737399e.indtix.pages.dev/ops |
| **API Health** | https://1737399e.indtix.pages.dev/api/health |

---

## ✅ Phase 4 — Completed Features

### Backend (77 endpoints, `src/index.ts`)
| Phase | New Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/verify-otp` |
| Events | `POST /api/events` (create), `PUT /api/events/:id` (update) |
| Promos | `GET /api/promos`, `POST /api/promos`, `DELETE /api/promos/:code` |
| Config | `GET /api/admin/config`, `POST /api/admin/config` |
| Users | `GET /api/admin/users`, `POST /api/admin/users/:id/block`, `GET /api/admin/users/export` |
| Events Admin | `GET /api/admin/events/queue`, `POST /api/admin/events/:id/approve` |
| Incidents | `POST /api/incidents`, `GET /api/events/:id/incidents` |
| Announcements | `POST /api/announcements` |
| Settlements | `POST /api/settlements/:id/process` |
| GST | `GET /api/gst/invoice/:booking_id` |
| Wallet | `POST /api/wallet/redeem` (fixed), `POST /api/referral/validate` (fixed) |
| LED | `POST /api/wristbands/led/command` (zone-aware, bands_updated) |
| Team | `POST /api/organiser/team` |
| Notifications | `POST /api/notifications/send` |

### Fan Portal (`public/fan.html`) — 17 API calls
- **Auth**: `POST /api/auth/login` + `POST /api/auth/signup` (real API with user state)
- **Social Login**: wired to `/api/auth/login` with provider
- **Event Modal**: async `GET /api/events/:id/tiers` + `GET /api/events/:id/addons` on open
- **Promo**: `POST /api/promo/validate` with local fallback
- **GST Invoice**: `GET /api/gst/invoice/:booking_id` — real invoice data rendered
- **Booking confirm**: saves `window._lastBookingId` for GST invoice
- **Wallet**: `GET /api/wallet/user123` with redeem (`POST /api/wallet/redeem`) and referral (`POST /api/referral/validate`) buttons

### Organiser Portal (`public/organiser.html`) — 8 API calls
- **Create Event**: `POST /api/events` on Submit for Approval
- **Settlement**: `POST /api/settlements/:id/process` with UTR response
- **KYC Status**: `GET /api/kyc/:id` with document-level status display

### Admin Portal (`public/admin.html`) — 12 API calls
- **Promo CRUD**: `POST /api/promos` (create), reads form fields
- **Config Save**: `POST /api/admin/config` with audit log
- **Affiliate Stats**: `GET /api/affiliate/stats` → dynamically renders panel
- **Event Approval Queue**: `GET /api/admin/events/queue` + `POST /api/admin/events/:id/approve`
- **Affiliate Panel**: new sidebar item + HTML panel with stats + add form

### Event Manager Portal (`public/event-manager.html`) — 9 API calls
- **Incident Log**: `POST /api/incidents` with type, location, priority
- **Broadcast Team**: `POST /api/announcements` (team channel)
- **Send Announcement**: `POST /api/announcements` (attendees)
- **LED Commands**: `POST /api/wristbands/led/command` for goLED, activateLEDBand (per zone)
- **Emergency Alert**: `POST /api/announcements` with emergency priority

---

## 📊 Development Summary (All Phases)

| Metric | Value |
|---|---|
| Total lines of code | ~12,000 |
| Backend routes | **77** |
| Frontend fetch() calls | **52** |
| Portals | 10 (fan, organiser, venue, event-manager, admin, ops, brand, portals, architecture, architecture-spec) |
| Placeholder buttons | **0** |
| Production uptime | ✅ Active |

---

## 🗂 Data Models

### Event
`{ id, name, category, city, date, price, sold_pct, venue, image, tiers[], addons[] }`

### Booking
`{ id, event_id, tickets[], addons[], subtotal, gst, platform_fee, total, qr_url, pdf_url }`

### Promo
`{ code, type (percentage|flat), value, max_uses, used, expires, categories[], status }`

### KYC
`{ kyc_id, entity_type, status (pending|under_review|approved|rejected), documents[], notes }`

### Incident
`{ incident_id, type, location, description, priority, status, event_id, created_at }`

### Announcement
`{ announcement_id, message, audience, recipients, channels[], status, sent_at }`

---

## 🔑 Key Promo Codes (live on Fan portal)
| Code | Discount | Type |
|---|---|---|
| `INDY20` | 20% off | All events |
| `FIRST50` | ₹50 off | First booking |
| `SUMMER25` | 25% off | Music only |
| `FEST20` | 20% off | Festivals |

---

## 🚀 Tech Stack
- **Backend**: Hono v4 + TypeScript → Cloudflare Workers
- **Frontend**: Vanilla JS + Tailwind CSS (CDN) + Font Awesome
- **Build**: Vite → `dist/_worker.js` (70.5 KB)
- **Deployment**: Cloudflare Pages (`wrangler pages deploy`)
- **Dev**: wrangler pages dev + PM2

---

## 📅 Deployment History
| Phase | Date | Key Changes |
|---|---|---|
| v1.0 | Mar 2026 | 7 portals, basic structure |
| v2.0 | Mar 2026 | 10 portals, 16 API routes |
| v3.0 | Mar 2026 | Phase 2: API wiring, dedup fix |
| v4.0 | Mar 2026 | Phase 3: Deep API integration, SEO, scanner/POS wiring |
| **v4.1** | **Mar 7 2026** | **Phase 4: Auth, promo CRUD, incidents, announcements, LED, wallet, affiliate, event approval** |
