# INDTIX Platform — v21.0.0

## Project Overview
- **Name**: INDTIX — India's Live Event Platform
- **Version**: v21.0.0 (Phase 21)
- **Goal**: End-to-end live event ticketing platform with 924 API endpoints across 6 portals + brand & architecture specs
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 149/149 tests — 100% ✅

## Live URLs
- **Production (Cloudflare)**: https://e4595ca5.indtix.pages.dev
- **Fan Portal**: https://e4595ca5.indtix.pages.dev/fan
- **Organiser Portal**: https://e4595ca5.indtix.pages.dev/organiser
- **Admin Portal**: https://e4595ca5.indtix.pages.dev/admin
- **Venue Portal**: https://e4595ca5.indtix.pages.dev/venue
- **Event Manager**: https://e4595ca5.indtix.pages.dev/event-manager
- **Ops Portal**: https://e4595ca5.indtix.pages.dev/ops
- **Brand Guide**: https://e4595ca5.indtix.pages.dev/brand
- **API Health**: https://e4595ca5.indtix.pages.dev/api/health
- **v21 Health**: https://e4595ca5.indtix.pages.dev/api/v21/health

## Phase 21 New Features (82 new endpoints → 924 total)

### Fan Portal — Mobile-first UX Overhaul
- Bottom navigation bar with 5 tabs (Home / Search / My Tickets / Rewards / Profile)
- Swipeable event carousels with momentum scrolling
- Interactive seat-map with tier colour coding and live availability
- **Loyalty Programme Panel**: points balance, tier badge (Bronze→Silver→Gold→Platinum), badges showcase, rewards catalogue with redemption flow
- **Carbon-Offset Tracker**: per-event footprint estimate + one-click offset purchase
- AI Recommendation Carousel (collaborative filtering v3)
- Real-time notification badge with unread count
- **Ticket-Transfer UI**: initiate transfer with OTP confirmation
- Social-share mini-cards (WhatsApp / Instagram Stories / copy link)
- Enhanced ARIA labels and keyboard navigation throughout

### Organiser Portal — Advanced Event Management
- **5-Step Creation Wizard** (draft → review → publish) with progress indicator
- **Dynamic Pricing Dashboard**: demand curve visualisation, surge rule editor
- **Volunteer / Staff Tab**: assign roles, QR badge export
- **Sponsor Management**: tiered tiers (Title / Gold / Silver / Bronze), activation tracking
- **Post-Event Survey Builder**: drag-and-drop questions, response analytics
- **Bulk CSV Attendee Import**: server-side validation with row-level error reporting
- **Revenue Waterfall Chart**: gross → net breakdown by channel
- **RFM Audience Segmentation**: Champions, Loyal, At-Risk, Lost cohorts

### Admin Portal — Platform Intelligence
- **City-Level Fraud Heatmap**: choropleth map, top fraud cities, suspicious booking count
- **Pricing Override Panel**: per-event or platform-wide price floor/ceiling with audit log
- **Automated Refund Rules Engine**: trigger conditions, auto-approve thresholds
- **GST Reconciliation Dashboard**: month-wise CGST / SGST / IGST breakdown, export
- **Organiser Performance Scorecard**: revenue, fulfilment rate, dispute rate, NPS
- **Live Log-Stream Health Terminal**: last 20 log lines, severity badges, auto-scroll
- **Webhook Manager**: add endpoints, select events, test fire, toggle active/inactive
- **White-Label SaaS Configurator**: create tenants, custom branding, domain mapping

### Venue Portal — Smart Venue Operations
- **Drag-and-Drop Floor-Plan Editor**: add / move / resize zones, export JSON
- **Footfall Heatmap** with time slider (hourly / daily granularity)
- **Revenue-per-sqm Analytics**: zone-level table + bar chart
- **Vendor Management**: add vendors, assign zones, track GMV
- **Smart Queue Estimator**: per-gate wait time with staffing recommendations
- **Multi-Event Calendar**: monthly view with booking status indicators
- **Parking Zone Occupancy**: real-time occupancy %, EV slot tracking, reservation flow
- **3D-Style Digital Twin Preview**: simplified bird's-eye 3D rendering of venue zones

### Event Manager Portal — Live Event Dashboard
- **Animated Live Attendee Counter**: simulated WebSocket updates every 3 s
- **Staff Productivity Leaderboard**: tasks completed, NPS score, response time ranking
- **Multi-Level Emergency Alerts**: L1 (Info) → L3 (Critical) with broadcast to all staff
- **F&B Sales & Inventory Alerts**: item-level sales, low-stock warnings
- **Real-Time Weather Widget**: temp, humidity, wind, 3-hour forecast, impact score
- **Lost & Found Module**: log items with QR codes, claimant matching
- **Vendor Invoice Tracker**: outstanding / paid status, approve / dispute workflow
- **Auto-Generated Post-Event Debrief**: NPS, revenue summary, top issues, PDF export

### Ops Portal — Command & Control
- **Live Multi-Event Overview Grid**: active events with live KPIs
- **SLA Breach Table**: breach timer, escalation owner, incident type
- **City-Map Staff Deployment Pins**: city-level staff count, last-seen, status
- **Integration Health Dashboard**: Razorpay, AWS SES, FCM status + latency
- **Automated Incident Playbook Runner**: pre-defined step-by-step runbooks
- **City Revenue Leaderboard**: top-10 cities by GMV with trend spark-lines
- **API Gateway Metrics**: requests/min, p95 latency, error rate
- **Infra Cost Analytics**: breakdown by service, trend vs last month

### Backend New API Groups (src/index.ts — 924 total)
| Group | Key Endpoints |
|-------|--------------|
| Loyalty | GET /api/loyalty/profile, POST /api/loyalty/redeem, GET /api/loyalty/leaderboard |
| Notifications | GET /api/notifications, POST /api/notifications/mark-read, POST /api/notifications/bulk |
| Ticket Transfer | POST /api/ticket-transfer/initiate, POST /api/ticket-transfer/confirm |
| Carbon Tracker | GET /api/fan/carbon-tracker, GET /api/fan/carbon-leaderboard |
| Organiser Wizard | POST /api/organiser/wizard/draft, POST /api/organiser/wizard/publish |
| Dynamic Pricing | GET/POST /api/organiser/pricing-rules |
| Volunteers | GET/POST /api/organiser/volunteers |
| Surveys | POST /api/organiser/surveys, GET /api/organiser/surveys/:id/responses |
| Bulk Import | POST /api/organiser/import/attendees |
| RFM Segments | GET /api/organiser/rfm-segments |
| Fraud Heatmap | GET /api/admin/fraud-heatmap |
| Pricing Override | GET/POST /api/admin/pricing-override |
| Refund Rules | GET/POST /api/admin/refund-rules |
| GST Reconciliation | GET /api/admin/gst-reconciliation |
| Scorecards | GET /api/admin/organiser-scorecard |
| Webhooks | GET/POST/DELETE /api/admin/webhooks |
| White-Label | GET/POST /api/admin/whitelabel |
| Floor Plan | GET/POST /api/venue/:id/floorplan |
| Footfall | GET /api/venue/:id/footfall-heatmap |
| Revenue per sqm | GET /api/venue/:id/revenue-per-sqm |
| Vendor Mgmt | GET/POST /api/venue/:id/vendors |
| Queue Estimator | GET /api/venue/:id/queue-estimator |
| Parking | GET /api/venue/:id/parking-zones |
| Attendee Counter | GET /api/events/:id/live-attendees |
| Staff Productivity | GET /api/events/:id/staff-productivity |
| Emergency Alerts | POST /api/events/:id/emergency-alert |
| F&B Sales | GET /api/events/:id/fnb-sales |
| Weather Widget | GET /api/events/:id/weather |
| Lost & Found | GET/POST /api/events/:id/lost-found |
| Vendor Invoices | GET /api/events/:id/vendor-invoices |
| Post-Event Debrief | GET /api/events/:id/debrief |
| Multi-Event Overview | GET /api/ops/events-overview |
| SLA Breaches | GET /api/ops/sla-breaches |
| Staff Map | GET /api/ops/staff-map |
| Integration Health | GET /api/ops/integration-health |
| Playbooks | GET/POST /api/ops/playbooks |
| City Revenue | GET /api/ops/city-revenue |
| API Metrics | GET /api/ops/api-metrics |
| Cost Analytics | GET /api/ops/cost-analytics |
| + ~30 supporting | search autocomplete, multi-currency, GDPR export, partner API keys, SaaS tenants, AI recs, accessibility, bulk notifications |

## Architecture
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: HTML5 + Tailwind CSS + Font Awesome + Chart.js
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Worker Size**: ~473 KB

## API Surface (924 endpoints)
| Category | Endpoints |
|----------|-----------|
| Auth & Users | ~85 |
| Events & Discovery | ~75 |
| Booking Engine | ~80 |
| KYC Workflow | ~30 |
| Seat Map & Add-ons | ~40 |
| Checkout & Payments | ~50 |
| Communications | ~45 |
| Organiser Portal | ~105 |
| Admin Portal | ~130 |
| Venue Portal | ~55 |
| Event Manager | ~50 |
| Ops Portal | ~50 |
| Analytics & BI | ~40 |
| AI/ML Layer | ~25 |
| Loyalty & Gamification | ~30 |
| Fanclubs & Social | ~20 |
| RBAC & Security | ~15 |
| Reports & Exports | ~20 |
| **Total** | **924** |

## Data Models
- **User**: id, name, email, phone, role, kyc_status, wallet_balance, loyalty_points, tier
- **Event**: id, name, venue, date, tiers[], addons[], pricing_model, capacity, carbon_footprint
- **Booking**: id, user_id, event_id, tickets[], total, status, payment, qr_code, transfer_status
- **KYC**: id, entity_type, status, documents[], ocr_data, trust_score
- **SeatMap**: id, event_id, zones[], total_capacity, holds[]
- **LoyaltyProfile**: user_id, points, tier, badges[], rewards[], history[], referrals
- **FloorPlan**: venue_id, zones[], updated_at, plan_id
- **Incident Playbook**: id, name, trigger, steps[], last_run, run_id
- **SLA Breach**: id, event_id, type, severity, escalation_owner, timer

## User Guide

### Fan Portal (/fan)
1. Browse events by city/category; swipe carousel for AI recommendations
2. Open event → select seat tier → checkout (UPI/card/wallet)
3. **Loyalty**: Account → Rewards → view points, badges, redeem rewards
4. **Carbon**: Account → Carbon Tracker → offset your event footprint
5. **Transfer ticket**: My Tickets → Transfer → enter recipient email + OTP verify
6. Group booking: "Group (5+)" for 5–15% discount
7. Notifications bell → real-time updates on bookings, waitlist, offers

### Organiser Portal (/organiser)
1. **Create Event**: Event Wizard → 5 steps (details / tiers / media / pricing / publish)
2. Dynamic Pricing → set demand-based surge rules
3. Volunteer / Staff → assign roles, generate QR badges
4. Sponsors → add sponsors with tier levels, track activation
5. Survey Builder → post-event NPS + custom questions
6. Bulk Import → upload CSV of attendees for pre-sold tickets
7. Revenue Waterfall → see gross-to-net breakdown
8. RFM Segments → identify Champions, Loyal, At-Risk cohorts

### Admin Portal (/admin)
1. Fraud Heatmap → city-level fraud monitoring
2. Pricing Override → set floor/ceiling prices with audit trail
3. Refund Rules → automate refund approvals
4. GST Reconciliation → monthly tax summary export
5. Organiser Scorecard → performance KPIs per organiser
6. Webhooks → configure and test webhook endpoints
7. White-Label → create and manage SaaS tenant instances

### Venue Portal (/venue)
1. Floor Plan Editor → drag zones, save layout
2. Footfall Heatmap → hourly crowd density analysis
3. Revenue per sqm → identify high/low performing zones
4. Vendor Management → assign vendors to zones
5. Queue Estimator → live wait times per gate
6. Parking → real-time zone occupancy + EV tracking

### Event Manager Portal (/event-manager)
1. Live Attendee Counter → real-time attendance vs capacity
2. Staff Leaderboard → productivity rankings
3. Emergency Alert → L1/L2/L3 broadcast to all staff
4. F&B Sales → item-level sales + inventory alerts
5. Weather → impact score and forecast
6. Lost & Found → log and match lost items
7. Vendor Invoices → approve / dispute vendor charges

### Ops Portal (/ops)
1. Multi-Event Grid → all live events with KPIs
2. SLA Breaches → escalation owner + timer
3. Staff Map → city-level deployment view
4. Integration Health → Razorpay / SES / FCM status
5. Playbook Runner → execute incident response steps
6. City Revenue Leaderboard → top 10 cities by GMV

## Deployment
- **Platform**: Cloudflare Pages (project: `indtix`)
- **Build Command**: `npm run build`
- **Output**: `dist/` directory
- **Status**: ✅ Active (Phase 21)
- **Last Deployed**: March 2026
- **Deployed URL**: https://e4595ca5.indtix.pages.dev

## Development
```bash
npm run build                                              # Build for production
pm2 start ecosystem.config.cjs                            # Start local server (port 3000)
curl localhost:3000/api/v21/health                        # Health check
python3 /tmp/qa_phase21.py                                # Run 149-test QA suite
npx wrangler pages deploy dist --project-name indtix      # Deploy to Cloudflare
```

## Phase History
| Phase | Version | Endpoints | QA Tests |
|-------|---------|-----------|----------|
| Phase 1–10 | v10.0.0 | 420 | 80/80 |
| Phase 11–15 | v15.0.0 | 580 | 90/90 |
| Phase 16–20 | v20.0.0 | 842 | 110/110 |
| **Phase 21** | **v21.0.0** | **924** | **149/149** |
