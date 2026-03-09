# INDTIX Platform — v27.0.0 (Phase 27: Enterprise B2B, White-Label & Marketplace)

## Project Overview
- **Name**: INDTIX — India's Live Event Ticketing Platform
- **Version**: v27.0.0 (Phase 27)
- **Goal**: End-to-end live event platform with **1,459 API endpoints** across 6 portals
- **Company**: Oye Imagine Private Limited | GSTIN: 27AABCO1234A1Z5
- **QA Score**: 68/68 tests — **100%** ✅
- **Total Phases**: 27 | **Total Endpoints**: 1,459

## Live URLs (v27)
- **Production (Latest)**: https://41cb8640.indtix.pages.dev
- **Fan Portal**: https://41cb8640.indtix.pages.dev/fan
- **Organiser Portal**: https://41cb8640.indtix.pages.dev/organiser
- **Admin Portal**: https://41cb8640.indtix.pages.dev/admin
- **Venue Portal**: https://41cb8640.indtix.pages.dev/venue
- **Event Manager**: https://41cb8640.indtix.pages.dev/event-manager
- **Ops Portal**: https://41cb8640.indtix.pages.dev/ops
- **v27 Health**: https://41cb8640.indtix.pages.dev/api/v27/health
- **v26 Health**: https://41cb8640.indtix.pages.dev/api/v26/health
- **v25 Health**: https://41cb8640.indtix.pages.dev/api/v25/health

## Phase 27 — New Features (90 new endpoints)

### White-Label Reseller Platform (12 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Reseller Directory | `GET /api/admin/white-label/resellers` | 42 resellers (Platinum/Gold/Silver tiers) |
| Reseller Detail | `GET /api/admin/white-label/resellers/:id` | Config, API keys, billing, performance |
| Create Reseller | `POST /api/admin/white-label/resellers` | Onboard new white-label partner |
| Update Config | `PUT /api/admin/white-label/resellers/:id/config` | Branding, domain, permissions |
| Revenue Report | `GET /api/admin/white-label/revenue` | ₹2.21 Cr/month fees, tier breakdown |
| Brand Assets | `GET /api/admin/white-label/brand-assets/:id` | Logo, banner, email assets review |
| Upload Assets | `POST /api/admin/white-label/brand-assets/:id` | Submit brand assets for review |
| SLA Dashboard | `GET /api/admin/white-label/sla` | 99.9%/99.8%/99.5% uptime by tier |
| Onboarding Flow | `GET /api/admin/white-label/onboarding` | 5-step pipeline, avg 14 days |
| Organiser WL Portal | `GET /api/organiser/white-label/portal` | Organiser's white-label portal stats |

### B2B Corporate Ticketing (8 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Corporate Directory | `GET /api/organiser/b2b/corporates` | 284 corporates, ₹18.4 Cr B2B GMV |
| Corporate Detail | `GET /api/organiser/b2b/corporates/:id` | Contract, usage, billing |
| Generate Quote | `POST /api/organiser/b2b/corporate-quote` | Bulk pricing with GST breakdown |
| Bulk Orders | `GET /api/organiser/b2b/bulk-orders` | 1,284 bulk orders tracked |
| Bulk Allocate | `POST /api/organiser/b2b/bulk-allocate` | Send tickets to corporate employees |
| Admin B2B Dashboard | `GET /api/admin/b2b/dashboard` | ₹184 Cr total GMV, sector breakdown |
| Contract Management | `GET /api/admin/b2b/contracts` | 218 active, 12 expiring in 30d |
| Contract Renew | `POST /api/admin/b2b/contracts/:id/renew` | One-click contract renewal |
| B2B Invoices | `GET /api/organiser/b2b/invoices` | NET-30 invoicing, overdue alerts |

### API Marketplace & Developer Hub (5 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| API Products | `GET /api/admin/api-marketplace/products` | 24 published APIs, ₹28.4 L/month |
| Developer Directory | `GET /api/admin/api-marketplace/developers` | 8,420 devs, SDK downloads |
| Usage Analytics | `GET /api/admin/api-marketplace/usage` | 4.2 Cr calls/month, 0.2% error rate |
| Publish Product | `POST /api/admin/api-marketplace/products/:id/publish` | Publish API to marketplace |
| API Gateway Config | `GET /api/ops/api-gateway/config` | Rate limits, auth, caching, DDoS |
| Gateway Logs | `GET /api/ops/api-gateway/logs` | Real-time error & rate-limit logs |

### Multi-Tenant Venue Networks (5 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Network Venues | `GET /api/venue/network/venues` | 284 venues, 48 cities, 76% utilisation |
| Network Analytics | `GET /api/venue/network/analytics` | ₹8.4 Cr MRR, +52% YoY |
| Benchmarks | `GET /api/venue/network/benchmarks` | Yield & fill rate by category & city |
| Join Network | `POST /api/venue/network/venues/:id/join` | Application & onboarding flow |
| Shared Inventory | `GET /api/venue/network/shared-inventory` | Equipment pool (lighting, sound, barriers) |

### Talent Agency Portal (5 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Agency Directory | `GET /api/event-manager/talent/agencies` | 284 agencies, 842 active deals |
| Agency Roster | `GET /api/event-manager/talent/agencies/:id/roster` | Artists with fees & riders |
| Booking Request | `POST /api/event-manager/talent/booking-request` | Send request to agency |
| Talent Contracts | `GET /api/event-manager/talent/contracts` | 128 contracts, advance tracking |
| Artist Availability | `GET /api/event-manager/talent/availability/:id` | Calendar, advance days, blackouts |

### Affiliate & Influencer Commerce (4 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Affiliate Directory | `GET /api/organiser/affiliates` | 8,420 affiliates, ₹1.84 Cr commissions |
| Affiliate Performance | `GET /api/organiser/affiliates/:id/performance` | Clicks, conversions, GMV, payout |
| Invite Affiliate | `POST /api/organiser/affiliates/invite` | Generate invite link with commission |
| Fan Referral Stats | `GET /api/fan/referral/my-stats` | Personal referral code & earnings |
| Referral Leaderboard | `GET /api/fan/referral/leaderboard` | Top 5 with prizes (₹50K grand prize) |

### NFT Collectibles & Digital Ownership (5 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| My Collection | `GET /api/fan/nft/my-collection` | NFTs with rarity, value, perks |
| NFT Marketplace | `GET /api/fan/nft/marketplace` | ₹4.2 Cr secondary volume, 6,284 listings |
| Mint NFT | `POST /api/fan/nft/mint` | Mint on Polygon (~₹28 gas) |
| Transfer NFT | `POST /api/fan/nft/transfer` | P2P NFT transfer with 2.5% fee |
| Upcoming Drops | `GET /api/fan/nft/drops/upcoming` | Whitelist, supply, price, countdown |

### Analytics Marketplace (2 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Marketplace Products | `GET /api/admin/analytics-marketplace/products` | 14 published products, ₹1.84 Cr revenue |
| My Subscriptions | `GET /api/organiser/analytics-marketplace/my-subscriptions` | Active plans, usage, insights |

### Smart Contract Ticketing / Web3 (4 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Smart Contracts | `GET /api/ops/web3/smart-contracts` | TicketNFT, RevenueShare, PromoNFT on Polygon |
| Transactions | `GET /api/ops/web3/transactions` | 8.42 L total txns, 42 failed |
| Deploy Contract | `POST /api/ops/web3/deploy-contract` | Deploy new smart contract |
| Web3 Dashboard | `GET /api/admin/web3/dashboard` | Royalties, wallet stats, top NFT events |

### Global Expansion & Localisation (6 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Market Overview | `GET /api/admin/global/markets` | 8 active (India, UAE, SG, UK...) |
| Localisation | `GET /api/admin/global/localisation` | 18 languages, 12 currencies |
| Compliance | `GET /api/admin/global/compliance` | PCI-DSS, GDPR, UAE laws by market |
| Currency Rates | `GET /api/admin/global/currency-rates` | Real-time FX via Razorpay FX |
| Global Infra | `GET /api/ops/global/infrastructure` | 47 CDN regions, data residency |
| Tax Config | `GET /api/admin/global/tax-config` | GST/VAT rates by market |

### Marketplace Cross-Platform (2 endpoints)
| Feature | Endpoint | Description |
|---------|----------|-------------|
| Ecosystem Summary | `GET /api/admin/marketplace/summary` | ₹44.8 Cr ecosystem GMV, 17.2K partners |
| Marketplace Health | `GET /api/admin/marketplace/health` | 6/6 services healthy |

## Platform Architecture
```
INDTIX v27 — Cloudflare Edge Platform
├── Frontend: 6 HTML portals (Hono SSR + Tailwind CDN)
├── Backend: Hono TypeScript Workers (1,459 endpoints)
├── Storage: Cloudflare D1 (SQLite), KV, R2
├── Blockchain: Polygon PoS (TicketNFT, RevenueShare, PromoNFT)
├── CDN: Cloudflare Stream (live video) + 47 global regions
├── AI/ML: INDTIX-Rec-v3, FraudShield-v4, PriceBrain-v3
├── B2B: White-Label Engine, Corporate Portal, API Gateway
└── Payments: Multi-currency, UPI, Cards, Crypto (Polygon)
```

## Complete Phase History
| Phase | Version | Endpoints | Theme |
|-------|---------|-----------|-------|
| Phase 21 | v21.0.0 | 919 | Core Platform |
| Phase 22 | v22.0.0 | 1,009 | Analytics & Growth |
| Phase 23 | v23.0.0 | 1,099 | Operations |
| Phase 24 | v24.0.0 | 1,189 | Intelligence Suite |
| Phase 25 | v25.0.0 | 1,279 | Platform Intelligence & Scale |
| Phase 26 | v26.0.0 | 1,369 | Real-Time Social Commerce |
| **Phase 27** | **v27.0.0** | **1,459** | **Enterprise B2B & Marketplace** |

## File Statistics (v27)
| File | Lines |
|------|-------|
| src/index.ts | 16,858 |
| public/admin.html | 4,887 |
| public/fan.html | 5,719 |
| public/organiser.html | 4,562 |
| public/venue.html | 2,626 |
| public/event-manager.html | 2,903 |
| public/ops.html | 2,781 |
| **Total** | **40,336** |

## Tech Stack
- **Runtime**: Cloudflare Workers (Edge)
- **Framework**: Hono v4 (TypeScript)
- **Frontend**: Vanilla JS + Tailwind CSS CDN + Font Awesome
- **Build**: Vite + @hono/vite-cloudflare-pages
- **Blockchain**: Polygon PoS (ERC-721, ERC-20, ERC-1155)
- **Infra**: Cloudflare Pages, D1, KV, R2, Stream
- **Worker Size**: 587 KB

## Deployment
- **Platform**: Cloudflare Pages
- **Project**: `indtix`
- **Status**: ✅ Active (v27.0.0)
- **Last Deployed**: 2026-03-09
- **Next Phase**: v28.0.0 — Immersive Experiences & Metaverse (planned 2026-04-01)
