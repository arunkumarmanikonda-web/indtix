# INDTIX — India's Live Event Platform

**The complete multi-role event ticketing and management platform, fully implemented and running on Cloudflare Pages + Hono.**

---

## 🔗 Live URLs (Sandbox)

| Portal | URL |
|--------|-----|
| 🎫 Fan Portal | `/fan` |
| 🎪 Organiser | `/organiser` |
| 🏟️ Venue | `/venue` |
| 🎬 Event Manager | `/event-manager` |
| 👑 Super Admin / ERP | `/admin` |
| 📱 On-Ground Ops / POS | `/ops` |
| 🏗️ Architecture | `/architecture` |
| 🗂️ **Portal Hub** | `/portals` |
| ❤️ API Health | `/api/health` |

---

## ✅ Completed Features

### Fan Portal (`/fan`)
- Event discovery with search, city picker, and category filters
- Upcoming events grid with pricing, venue, and date
- Seat map builder with zone selection and checkout flow
- Login / Signup modal (OTP / Social)
- Wishlist, AI concierge chatbot
- Smooth animations, particle effects

### Organiser Portal (`/organiser`)
- Event creation form with full metadata
- Ticket tier builder (Early Bird, GA, VIP, Platinum)
- Seat map configuration
- Add-Ons & Merchandise management
- Real-time revenue dashboard & analytics
- Attendee management, check-in config
- Marketing tools (promo codes, email campaigns)
- KYC submission, GST invoice downloads
- Settlement tracking with T+7 cycle

### Venue Portal (`/venue`)
- Availability calendar with bookings, blocked dates, enquiries
- Zone capacity configuration (Main Arena, VIP, F&B, Parking)
- Floor plan builder (visual drag-layout)
- Pricing tiers (Evening, Day, Full Day, Half Day) + add-on packages
- Booking management with hire fee tracking
- GST invoices with GSTIN
- Staff access management, incident reports
- Document & NOC status tracker, amenity selector

### Event Manager Portal (`/event-manager`)
- Live ops dashboard (check-in counter, incidents, LED control)
- Run sheet with minute-by-minute event schedule
- Task manager with priority levels
- Live check-in monitor (gate-by-gate progress)
- POS overview (terminal status, top sellers)
- F&B order tracker (counter queues, live revenue)
- Push announcement composer (WhatsApp / Push / SMS / In-App)
- Post-event report with downloadable assets
- Attendee feedback (NPS, category ratings, comments)
- Team management, task checklist, incident log

### Super Admin / ERP Portal (`/admin`)
- Platform dashboard (GMV, tickets sold, organisers, venues)
- System health monitor (12 services, incident history)
- Organiser approvals, venue approvals, event approvals
- KYC review queue (GST/PAN/Bank verification)
- Settlements & payouts (T+7, TDS deduction)
- Refund management (approve/investigate)
- GST Engine (GSTR-1/3B, category breakdown, filing schedule)
- User management with fraud detection
- Promotions & coupons creator
- Notifications hub (6 template types, all channels)
- RBAC (9 roles with permission matrix)
- Revenue mix chart, BI/AI analytics, security centre, audit logs, CMS, platform config

### On-Ground Ops / POS Portal (`/ops`)
- QR scanner with audio beep feedback (valid/duplicate/invalid)
- Manual entry mode
- Full POS terminal (F&B + merchandise cart)
- Wristband NFC manager
- Live entry stats (gate-by-gate, POS summary)
- Scan log (real-time rolling feed)

### Portal Hub (`/portals`)
- Single landing page with all 7 portal cards
- Live API endpoint tester
- Platform stats band (uptime, GMV, DAU)
- Architecture card link

---

## 📊 Data Architecture

- **Data Models**: Events, Orders, Tickets, Users, Venues, Organisers, Settlements, GST Invoices, Incidents
- **Storage**: Cloudflare D1 (SQLite) for relational data, KV for sessions/cache, R2 for assets
- **Payment**: Razorpay / PayU / Stripe (international)
- **Notifications**: WhatsApp Business API, AWS SES (email), Twilio (SMS), FCM (push)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers (Edge) |
| Framework | Hono v4 (TypeScript) |
| Frontend | Vanilla JS + Tailwind (CDN) + FontAwesome |
| Build | Vite v6 |
| Database | Cloudflare D1 (SQLite) |
| KV Cache | Cloudflare KV |
| Storage | Cloudflare R2 |
| Dev Server | Wrangler Pages Dev + PM2 |

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Platform health check |
| GET | `/api/events` | Event listings with metadata |
| GET | `/api/cities` | Supported Indian cities |
| POST | `/api/book` | Create ticket booking |

---

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.ts          # Hono router (49 lines)
├── public/
│   ├── fan.html          # Fan portal       (~700 lines)
│   ├── organiser.html    # Organiser portal (~880 lines)
│   ├── venue.html        # Venue portal     (~652 lines)
│   ├── event-manager.html# Event Mgr portal (~740 lines)
│   ├── admin.html        # Super Admin / ERP (~684 lines)
│   ├── ops.html          # On-Ground Ops    (~481 lines)
│   ├── architecture.html # Architecture     (~382 lines)
│   └── portals.html      # Portal Hub       (~350 lines)
├── ecosystem.config.cjs  # PM2 config
├── wrangler.jsonc        # Cloudflare config
├── vite.config.ts        # Vite/Hono build config
└── package.json
```

---

## 🌐 Deployment

- **Platform**: Cloudflare Pages + Workers
- **Status**: ✅ Running (Sandbox)
- **Build**: `npm run build` → `dist/` (25.56 kB worker)
- **Start**: `pm2 start ecosystem.config.cjs`
- **Deploy**: `npm run deploy` (requires `CLOUDFLARE_API_TOKEN`)

---

## 👤 User Guide

1. **Fans** → Visit `/fan` to browse events, select seats, and book tickets
2. **Organisers** → Visit `/organiser` to create events and manage ticketing
3. **Venue Owners** → Visit `/venue` to manage availability and bookings
4. **Event Managers** → Visit `/event-manager` for live event operations
5. **Administrators** → Visit `/admin` for full platform control
6. **Ground Staff** → Visit `/ops` for QR scanning and POS operations
7. **Overview** → Visit `/portals` for the portal navigation hub

---

*© 2025 Oye Imagine Pvt Ltd · Built on Cloudflare Edge · GSTIN: 27AABCO1234A1Z5*
