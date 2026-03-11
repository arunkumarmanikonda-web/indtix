# INDTIX — India's Live Event Ticketing Platform

> **World-class ticketing infrastructure on Cloudflare Workers + D1 + Pages**

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/arunkumarmanikonda-web/indtix)

---

## 🚀 Quick Start

```bash
git clone https://github.com/arunkumarmanikonda-web/indtix
cd indtix/webapp
npm install
npm run dev          # → http://localhost:5173
```

---

## 🔐 Demo Login Credentials

| Portal | URL | Email | Password | Role |
|--------|-----|-------|----------|------|
| 🎟️ Fan | `/fan` | `fan@indtix.com` | `Fan@123456` | fan |
| ⚙️ Admin | `/admin` | `admin@indtix.com` | `Admin@123456` | superadmin |
| 🎪 Organiser | `/organiser` | `organiser@indtix.com` | `Org@123456` | organiser |
| 🏟️ Venue | `/venue` | `venue@indtix.com` | `Venue@123456` | venue_manager |
| 📋 Event Mgr | `/event-manager` | `em@indtix.com` | `EM@123456` | event_manager |
| 🎫 Ops | `/ops` | `ops@indtix.com` | `Ops@123456` | ops_admin |

> All portals also support **Email OTP login** (requires SendGrid API key)

---

## 🏗️ Architecture

```
INDTIX Platform
├── src/
│   ├── index.ts          — Main Hono app (4,643 API routes)
│   ├── auth.ts           — PBKDF2 + JWT (HS256) auth
│   ├── auth-routes.ts    — /api/auth/* endpoints
│   ├── cms.ts            — CMS adapters (D1/Contentful/Sanity)
│   ├── db.ts             — D1 database abstraction
│   ├── middleware.ts     — Security headers, rate limiting, RBAC
│   ├── razorpay.ts       — Razorpay payment gateway
│   ├── email.ts          — SendGrid OTP + transactional emails
│   ├── turnstile.ts      — Cloudflare Turnstile CAPTCHA
│   ├── images.ts         — Cloudflare Images CDN
│   └── api-client.ts     — Frontend IX API client (auto token refresh)
├── public/
│   ├── fan.html          — Fan portal (586 KB, 280 API calls)
│   ├── admin.html        — Admin portal (651 KB, 427 API calls)
│   ├── organiser.html    — Organiser portal (529 KB, 264 API calls)
│   ├── venue.html        — Venue portal (367 KB, 197 API calls)
│   ├── event-manager.html — Event manager portal (401 KB, 219 API calls)
│   ├── ops.html          — Ops portal (370 KB, 236 API calls)
│   └── portals.html      — Demo access hub
├── db/
│   ├── schema.sql        — 24-table D1 schema
│   └── seed.sql          — Demo seed data
├── tests/
│   └── e2e.spec.ts       — 50 Playwright E2E tests (12 suites)
└── scripts/
    └── setup-production.sh — One-command production setup
```

---

## ☁️ Production Deployment (8 Steps)

### Option A: Automated (run the setup script)
```bash
bash scripts/setup-production.sh
```

### Option B: Manual Step-by-Step

#### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/yourusername/indtix.git
git push -u origin main
```

#### Step 2: Create D1 Database
```bash
npx wrangler d1 create INDTIX_DB
# → Copy database_id into wrangler.jsonc

npx wrangler d1 execute INDTIX_DB --file=db/schema.sql
npx wrangler d1 execute INDTIX_DB --file=db/seed.sql
```

#### Step 3: Create KV Namespace (OTP + Cache)
```bash
npx wrangler kv namespace create CACHE
# → Copy id into wrangler.jsonc → kv_namespaces[0].id
```

#### Step 4: Set JWT Secret
```bash
# Generate a strong secret:
openssl rand -hex 32

npx wrangler secret put JWT_SECRET
# → Paste the generated secret
```

#### Step 5: Configure Razorpay
```bash
npx wrangler secret put RAZORPAY_KEY_ID       # from dashboard.razorpay.com
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put RAZORPAY_WEBHOOK_SECRET
```
Then in Razorpay Dashboard → Webhooks → Add:
- URL: `https://webapp.pages.dev/api/payments/webhook`
- Events: `payment.captured`, `payment.failed`, `refund.created`

#### Step 6: Configure SendGrid (Email OTP)
```bash
# Get API key from: app.sendgrid.com/settings/api_keys
npx wrangler secret put SENDGRID_API_KEY
```

#### Step 7: Configure Turnstile (CAPTCHA)
```bash
# Create widget at: dash.cloudflare.com → Turnstile
# Add TURNSTILE_SITE_KEY to wrangler.jsonc vars (it's public)
npx wrangler secret put TURNSTILE_SECRET_KEY   # private key
```

#### Step 8: Configure Cloudflare Images
```bash
npx wrangler secret put CF_ACCOUNT_ID          # your CF account ID
npx wrangler secret put CF_IMAGES_API_TOKEN    # CF API token
npx wrangler secret put CF_IMAGES_ACCOUNT_HASH # from CF Images overview
```

#### Deploy
```bash
npm run build
npx wrangler pages deploy dist --project-name=webapp
```

---

## 🔗 Connect GitHub to Cloudflare Pages (Auto-Deploy CI/CD)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub repository: `arunkumarmanikonda-web/indtix`
4. Build settings:
   - **Build command:** `cd webapp && npm run build`
   - **Build output directory:** `webapp/dist`
5. Add GitHub Actions secrets (`Settings → Secrets → Actions`):
   ```
   CF_API_TOKEN    → Cloudflare API token (Pages:Edit permission)
   CF_ACCOUNT_ID   → Your Cloudflare Account ID
   ```
6. Every `git push origin main` → auto-builds and deploys ✨

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email+password |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP → issue JWT |
| GET | `/api/auth/me` | Get current user (requires JWT) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| POST | `/api/payments/webhook` | Razorpay webhook handler |
| GET | `/api/payments/:id` | Get payment status |

### CMS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cms/banners` | Get hero banners |
| GET | `/api/cms/type/:type` | Get content by type (faq, blog...) |
| GET | `/api/cms/content/:slug` | Get content by slug |
| GET | `/api/cms/search` | Search CMS content |

### Images
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/images/config` | Get CF Images config |
| POST | `/api/images/upload` | Upload to Cloudflare Images |
| GET | `/api/images/placeholder/:category` | Get SVG placeholder |

---

## 🧪 Testing

```bash
# Run all 50 E2E tests
npx playwright test

# With HTML report
npx playwright test --reporter=html

# Single test file
npx playwright test tests/e2e.spec.ts

# Test against live deployment
BASE_URL=https://webapp.pages.dev npx playwright test
```

---

## 📊 Audit Scores (v78)

| Category | Score | Details |
|----------|-------|---------|
| Overall | **92.7/100 (A)** | |
| Portals | 98.3/100 | All 6 pass auth, JWT, RBAC |
| Auth System | 95/100 | PBKDF2 + JWT + RBAC |
| Database | 90/100 | 24 tables, schema ready |
| E2E Tests | 100/100 | 50 tests, 12 suites |
| API Routes | 4,643 | GET:3684, POST:905, PUT:38, DELETE:16 |

---

## 🛡️ Security Features

- ✅ PBKDF2 password hashing (100k iterations)
- ✅ HS256 JWT (15min access + 7d refresh)
- ✅ Role-Based Access Control (6 roles)
- ✅ Cloudflare Turnstile CAPTCHA (anti-bot)
- ✅ Rate limiting (Auth: 5/min, API: 120/min)
- ✅ Security headers (CSP, HSTS, X-Frame)
- ✅ CORS whitelist
- ✅ Razorpay webhook HMAC-SHA256 verification
- ✅ SQL injection protection (D1 prepared statements)
- ✅ XSS protection (Content-Type + CSP headers)

---

## 📄 License

MIT © 2026 INDTIX
