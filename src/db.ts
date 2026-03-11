/**
 * INDTIX — Database Schema & D1 Abstraction Layer
 *
 * Cloudflare D1 (SQLite) schema for INDTIX production.
 * Provides:
 *  - Full SQL migrations (run with `wrangler d1 execute`)
 *  - TypeScript typed query helpers
 *  - Seeding functions for demo data
 *
 * Usage in routes:
 *   import { db } from './db'
 *   const events = await db(c.env).events.list({ city: 'Mumbai' })
 */

// ─── D1 Environment Binding ────────────────────────────────────────────────
export interface D1Env {
  DB?: D1Database              // Cloudflare D1 binding (set in wrangler.jsonc)
  [key: string]: unknown
}

// D1Database interface (CF Workers types)
interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
  exec(query: string): Promise<D1ExecResult>
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run<T = unknown>(): Promise<D1Result<T>>
  all<T = unknown>(): Promise<D1Result<T>>
  raw<T = unknown[]>(): Promise<T[]>
}
interface D1Result<T = unknown> { results: T[]; success: boolean; meta: object }
interface D1ExecResult { count: number; duration: number }

// ─── SQL Schema Migrations ─────────────────────────────────────────────────
export const SCHEMA_SQL = `
-- ════════════════════════════════════════════════════
-- INDTIX D1 Database Schema v1.0
-- Apply with: wrangler d1 execute INDTIX_DB --file=schema.sql
-- ════════════════════════════════════════════════════

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─── Users ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,            -- USR-xxxxxxxx
  email          TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  password_hash  TEXT NOT NULL,               -- PBKDF2 hash
  role           TEXT NOT NULL DEFAULT 'fan', -- fan|organiser|venue_manager|event_manager|ops_admin|superadmin
  badge          TEXT,
  avatar_url     TEXT,
  phone          TEXT,
  org_id         TEXT REFERENCES organisations(id),
  venue_id       TEXT REFERENCES venues(id),
  kyc_status     TEXT NOT NULL DEFAULT 'pending',  -- pending|verified|rejected
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at  INTEGER
);

-- ─── Refresh Tokens ────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,  -- SHA-256 of the refresh token
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  revoked_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ─── Organisations ─────────────────────────────────
CREATE TABLE IF NOT EXISTS organisations (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  owner_id       TEXT NOT NULL REFERENCES users(id),
  gst_number     TEXT,
  pan_number     TEXT,
  bank_account   TEXT,       -- encrypted JSON
  kyc_status     TEXT NOT NULL DEFAULT 'pending',
  plan           TEXT NOT NULL DEFAULT 'starter',  -- starter|growth|enterprise
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ─── Venues ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS venues (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  address        TEXT NOT NULL,
  lat            REAL,
  lng            REAL,
  capacity       INTEGER NOT NULL DEFAULT 0,
  amenities      TEXT,   -- JSON array
  images         TEXT,   -- JSON array of URLs
  owner_id       TEXT REFERENCES users(id),
  org_id         TEXT REFERENCES organisations(id),
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

-- ─── Events ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT,
  category       TEXT NOT NULL,
  subcategory    TEXT,
  city           TEXT NOT NULL,
  venue_id       TEXT REFERENCES venues(id),
  org_id         TEXT REFERENCES organisations(id),
  event_date     TEXT NOT NULL,       -- ISO date
  doors_open     TEXT,
  start_time     TEXT,
  end_time       TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',  -- draft|published|live|ended|cancelled
  image_url      TEXT,
  banner_url     TEXT,
  tags           TEXT,      -- JSON array
  age_restriction TEXT,
  dress_code     TEXT,
  language       TEXT,
  created_by     TEXT REFERENCES users(id),
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  published_at   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_events_city     ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date     ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status   ON events(status);

-- ─── Ticket Tiers ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_tiers (
  id             TEXT PRIMARY KEY,
  event_id       TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,       -- GA | VIP | Premium Standing
  description    TEXT,
  price          REAL NOT NULL,
  total_qty      INTEGER NOT NULL,
  sold_qty       INTEGER NOT NULL DEFAULT 0,
  max_per_order  INTEGER NOT NULL DEFAULT 10,
  sale_starts_at INTEGER,
  sale_ends_at   INTEGER,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_tiers_event ON ticket_tiers(event_id);

-- ─── Bookings ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id              TEXT PRIMARY KEY,      -- BK-XXXXXXXX
  user_id         TEXT NOT NULL REFERENCES users(id),
  event_id        TEXT NOT NULL REFERENCES events(id),
  tier_id         TEXT NOT NULL REFERENCES ticket_tiers(id),
  qty             INTEGER NOT NULL DEFAULT 1,
  unit_price      REAL NOT NULL,
  subtotal        REAL NOT NULL,
  discount        REAL NOT NULL DEFAULT 0,
  gst_amount      REAL NOT NULL DEFAULT 0,
  convenience_fee REAL NOT NULL DEFAULT 0,
  total_amount    REAL NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending|confirmed|cancelled|refunded
  payment_method  TEXT,
  payment_ref     TEXT,
  promo_code      TEXT,
  seats           TEXT,   -- JSON array of seat IDs
  addons          TEXT,   -- JSON array
  qr_code         TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  confirmed_at    INTEGER,
  cancelled_at    INTEGER
);
CREATE INDEX IF NOT EXISTS idx_bookings_user  ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ─── Loyalty / Credits ─────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id            TEXT PRIMARY KEY,
  user_id       TEXT UNIQUE NOT NULL REFERENCES users(id),
  points        INTEGER NOT NULL DEFAULT 0,
  tier          TEXT NOT NULL DEFAULT 'bronze',  -- bronze|silver|gold|platinum|diamond
  lifetime_pts  INTEGER NOT NULL DEFAULT 0,
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ─── Wallet ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallets (
  id          TEXT PRIMARY KEY,
  user_id     TEXT UNIQUE NOT NULL REFERENCES users(id),
  balance     REAL NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'INR',
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  wallet_id   TEXT NOT NULL REFERENCES wallets(id),
  type        TEXT NOT NULL,   -- credit|debit|refund
  amount      REAL NOT NULL,
  description TEXT,
  ref_id      TEXT,            -- booking_id or payment_ref
  balance_after REAL NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_wtx_wallet ON wallet_transactions(wallet_id);

-- ─── Fan Clubs ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS fan_clubs (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  artist_id   TEXT,
  org_id      TEXT REFERENCES organisations(id),
  description TEXT,
  image_url   TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS fan_club_members (
  club_id    TEXT NOT NULL REFERENCES fan_clubs(id),
  user_id    TEXT NOT NULL REFERENCES users(id),
  role       TEXT NOT NULL DEFAULT 'member',  -- member|moderator|admin
  joined_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (club_id, user_id)
);

-- ─── Notifications ─────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id     TEXT NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        TEXT,   -- JSON
  is_read     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

-- ─── CMS Content ───────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_content (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,    -- banner|promo|faq|page|blog
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  metadata    TEXT,             -- JSON
  status      TEXT NOT NULL DEFAULT 'draft',  -- draft|published|archived
  locale      TEXT NOT NULL DEFAULT 'en',
  created_by  TEXT REFERENCES users(id),
  updated_by  TEXT REFERENCES users(id),
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  published_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_cms_type_status ON cms_content(type, status);

-- ─── Promo Codes ───────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id            TEXT PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  type          TEXT NOT NULL DEFAULT 'percentage',  -- percentage|fixed|free_ticket
  value         REAL NOT NULL,
  min_order     REAL NOT NULL DEFAULT 0,
  max_discount  REAL,
  usage_limit   INTEGER,
  used_count    INTEGER NOT NULL DEFAULT 0,
  event_id      TEXT REFERENCES events(id),
  org_id        TEXT REFERENCES organisations(id),
  valid_from    INTEGER,
  valid_until   INTEGER,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ─── Audit Log ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT REFERENCES users(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  old_value   TEXT,   -- JSON
  new_value   TEXT,   -- JSON
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_audit_user     ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created  ON audit_log(created_at);
`

// ─── Seed SQL for demo data ────────────────────────────────────────────────
export const SEED_SQL = `
-- Demo organisations
INSERT OR IGNORE INTO organisations (id, name, slug, owner_id, kyc_status, plan)
VALUES
  ('ORG-001', 'Percept Live', 'percept-live', 'USR-ORG-001', 'verified', 'enterprise'),
  ('ORG-002', 'Only Much Louder', 'only-much-louder', 'USR-ORG-001', 'verified', 'growth');

-- Demo venues
INSERT OR IGNORE INTO venues (id, name, city, state, address, lat, lng, capacity)
VALUES
  ('VEN-001', 'MMRDA Grounds', 'Mumbai', 'Maharashtra', 'Bandra Kurla Complex, Mumbai', 19.0607, 72.8679, 50000),
  ('VEN-002', 'Palace Grounds', 'Bangalore', 'Karnataka', 'Jayamahal Road, Bangalore', 12.9915, 77.5962, 80000),
  ('VEN-003', 'Siri Fort Auditorium', 'Delhi', 'Delhi', 'August Kranti Marg, New Delhi', 28.5494, 77.2143, 2000);

-- Demo events
INSERT OR IGNORE INTO events (id, name, slug, category, city, venue_id, org_id, event_date, status, image_url, created_by)
VALUES
  ('e1', 'Sunburn Arena – Mumbai', 'sunburn-arena-mumbai', 'Music', 'Mumbai', 'VEN-001', 'ORG-001', '2026-04-12', 'published', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'USR-ORG-001'),
  ('e2', 'NH7 Weekender', 'nh7-weekender-2026', 'Festival', 'Pune', 'VEN-001', 'ORG-002', '2026-05-03', 'published', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'USR-ORG-001'),
  ('e3', 'Zakir Hussain Live', 'zakir-hussain-live-delhi', 'Classical', 'Delhi', 'VEN-003', 'ORG-001', '2026-04-20', 'published', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', 'USR-ORG-001'),
  ('e4', 'IPL: MI vs CSK', 'ipl-mi-vs-csk-2026', 'Sports', 'Mumbai', 'VEN-001', 'ORG-001', '2026-04-18', 'published', 'https://images.unsplash.com/photo-1540747913346-19212a4b733d?w=800', 'USR-ORG-001');

-- Demo ticket tiers
INSERT OR IGNORE INTO ticket_tiers (id, event_id, name, price, total_qty, sold_qty, sort_order)
VALUES
  ('TT-001', 'e1', 'General Admission', 1499, 5000, 3600, 1),
  ('TT-002', 'e1', 'Premium Standing',  2999, 1000,  750, 2),
  ('TT-003', 'e1', 'VIP',               4999,  200,  180, 3),
  ('TT-004', 'e2', 'General Admission', 2499, 3000, 1740, 1),
  ('TT-005', 'e3', 'Standard',           999, 2000,  900, 1),
  ('TT-006', 'e4', 'Stand Ticket',       1200, 8000, 7600, 1);

-- Demo CMS content
INSERT OR IGNORE INTO cms_content (id, type, slug, title, body, status, locale)
VALUES
  ('cms-1', 'banner', 'summer-sale-2026', 'Summer Sale — Up to 40% Off!', 'Use code SUMMER40 at checkout', 'published', 'en'),
  ('cms-2', 'faq',    'refund-policy',    'What is your refund policy?',   'Bookings are refundable up to 48 hours before the event.', 'published', 'en'),
  ('cms-3', 'page',   'about-us',         'About INDTIX',                  'India''s most loved live-event ticketing platform.', 'published', 'en');

-- Demo promo codes
INSERT OR IGNORE INTO promo_codes (id, code, type, value, min_order, is_active)
VALUES
  ('promo-1', 'WELCOME10', 'percentage', 10, 500,  1),
  ('promo-2', 'FLAT200',   'fixed',     200, 999,  1),
  ('promo-3', 'SUMMER40',  'percentage', 40, 1999, 1);
`

// ─── Query Helpers ────────────────────────────────────────────────────────

type PaginationOpts = { page?: number; limit?: number }

export function db(env: D1Env) {
  // If no real D1 binding, fall back to in-memory mock store
  const d1 = env?.DB
  if (!d1) return mockDb()

  return {
    // ── Events ──
    events: {
      async list(filters: { city?: string; category?: string; q?: string } & PaginationOpts) {
        const { city, category, q, page = 1, limit = 20 } = filters
        let sql  = 'SELECT e.*, v.name as venue_name FROM events e LEFT JOIN venues v ON e.venue_id = v.id WHERE e.status = ?'
        const params: unknown[] = ['published']
        if (city)     { sql += ' AND e.city = ?';     params.push(city) }
        if (category) { sql += ' AND e.category = ?'; params.push(category) }
        if (q)        { sql += ' AND (e.name LIKE ? OR e.city LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
        sql += ' ORDER BY e.event_date ASC LIMIT ? OFFSET ?'
        params.push(limit, (page - 1) * limit)
        const { results } = await d1.prepare(sql).bind(...params).all()
        return results
      },
      async byId(id: string) {
        return d1.prepare('SELECT * FROM events WHERE id = ?').bind(id).first()
      },
      async count(filters: { city?: string; category?: string }) {
        const { city, category } = filters
        let sql = 'SELECT COUNT(*) as count FROM events WHERE status = ?'
        const params: unknown[] = ['published']
        if (city)     { sql += ' AND city = ?';     params.push(city) }
        if (category) { sql += ' AND category = ?'; params.push(category) }
        const row = await d1.prepare(sql).bind(...params).first<{ count: number }>()
        return row?.count ?? 0
      },
    },

    // ── Users ──
    users: {
      async byEmail(email: string) {
        return d1.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1')
          .bind(email.toLowerCase().trim()).first<any>()
      },
      async byId(id: string) {
        return d1.prepare('SELECT id,email,name,role,badge,avatar_url,org_id,venue_id,kyc_status FROM users WHERE id = ?')
          .bind(id).first<any>()
      },
      async updateLastLogin(id: string) {
        return d1.prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
          .bind(Math.floor(Date.now()/1000), id).run()
      },
    },

    // ── Bookings ──
    bookings: {
      async forUser(userId: string, opts: PaginationOpts = {}) {
        const { page = 1, limit = 20 } = opts
        const { results } = await d1.prepare(
          `SELECT b.*, e.name as event_name, e.image_url, e.event_date, e.city,
                  v.name as venue_name, t.name as tier_name
           FROM bookings b
           JOIN events e ON b.event_id = e.id
           LEFT JOIN venues v ON e.venue_id = v.id
           JOIN ticket_tiers t ON b.tier_id = t.id
           WHERE b.user_id = ? ORDER BY b.created_at DESC LIMIT ? OFFSET ?`
        ).bind(userId, limit, (page - 1) * limit).all<any>()
        return results
      },
      async create(data: {
        id: string; userId: string; eventId: string; tierId: string
        qty: number; unitPrice: number; subtotal: number; discount: number
        gstAmount: number; convenienceFee: number; totalAmount: number
        paymentMethod?: string; promoCode?: string
      }) {
        return d1.prepare(
          `INSERT INTO bookings (id,user_id,event_id,tier_id,qty,unit_price,subtotal,
           discount,gst_amount,convenience_fee,total_amount,payment_method,promo_code,status)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'confirmed')`
        ).bind(
          data.id, data.userId, data.eventId, data.tierId,
          data.qty, data.unitPrice, data.subtotal, data.discount,
          data.gstAmount, data.convenienceFee, data.totalAmount,
          data.paymentMethod ?? null, data.promoCode ?? null
        ).run()
      },
    },

    // ── CMS ──
    cms: {
      async bySlug(slug: string) {
        return d1.prepare("SELECT * FROM cms_content WHERE slug = ? AND status = 'published'")
          .bind(slug).first<any>()
      },
      async byType(type: string, locale = 'en') {
        const { results } = await d1.prepare(
          "SELECT * FROM cms_content WHERE type = ? AND locale = ? AND status = 'published' ORDER BY updated_at DESC"
        ).bind(type, locale).all<any>()
        return results
      },
      async upsert(data: { id: string; type: string; slug: string; title: string; body?: string; metadata?: object; locale?: string; updatedBy: string }) {
        return d1.prepare(
          `INSERT INTO cms_content (id,type,slug,title,body,metadata,locale,status,updated_by,published_at)
           VALUES (?,?,?,?,?,?,?,'published',?,?)
           ON CONFLICT(slug) DO UPDATE SET
             title=excluded.title, body=excluded.body,
             metadata=excluded.metadata, updated_by=excluded.updated_by,
             updated_at=unixepoch(), published_at=excluded.published_at`
        ).bind(
          data.id, data.type, data.slug, data.title,
          data.body ?? null, data.metadata ? JSON.stringify(data.metadata) : null,
          data.locale ?? 'en', data.updatedBy, Math.floor(Date.now()/1000)
        ).run()
      },
    },

    // ── Notifications ──
    notifications: {
      async list(userId: string, unreadOnly = false) {
        let sql = 'SELECT * FROM notifications WHERE user_id = ?'
        if (unreadOnly) sql += ' AND is_read = 0'
        sql += ' ORDER BY created_at DESC LIMIT 50'
        const { results } = await d1.prepare(sql).bind(userId).all<any>()
        return results
      },
      async markRead(id: string, userId: string) {
        return d1.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?')
          .bind(id, userId).run()
      },
    },

    // ── Wallet ──
    wallet: {
      async get(userId: string) {
        return d1.prepare('SELECT * FROM wallets WHERE user_id = ?').bind(userId).first<any>()
      },
    },

    // ── Loyalty ──
    loyalty: {
      async get(userId: string) {
        return d1.prepare('SELECT * FROM loyalty_accounts WHERE user_id = ?').bind(userId).first<any>()
      },
    },

    // ── Promo ──
    promo: {
      async validate(code: string) {
        const now = Math.floor(Date.now()/1000)
        return d1.prepare(
          `SELECT * FROM promo_codes WHERE code = ? AND is_active = 1
           AND (valid_from IS NULL OR valid_from <= ?)
           AND (valid_until IS NULL OR valid_until >= ?)
           AND (usage_limit IS NULL OR used_count < usage_limit)`
        ).bind(code.toUpperCase(), now, now).first<any>()
      },
    },

    // ── Audit ──
    audit: {
      async log(entry: { userId?: string; action: string; resource: string; resourceId?: string; oldValue?: object; newValue?: object; ip?: string }) {
        return d1.prepare(
          'INSERT INTO audit_log (user_id,action,resource,resource_id,old_value,new_value,ip) VALUES (?,?,?,?,?,?,?)'
        ).bind(
          entry.userId ?? null, entry.action, entry.resource, entry.resourceId ?? null,
          entry.oldValue ? JSON.stringify(entry.oldValue) : null,
          entry.newValue ? JSON.stringify(entry.newValue) : null,
          entry.ip ?? null
        ).run()
      },
    },
  }
}

// ─── In-memory mock store (used when D1 not bound) ─────────────────────────
function mockDb() {
  const EVENTS = [
    { id: 'e1', name: 'Sunburn Arena – Mumbai', slug: 'sunburn-arena-mumbai', category: 'Music', city: 'Mumbai', event_date: '2026-04-12', status: 'published', price_from: 1499, venue_name: 'MMRDA Grounds', image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', sold_pct: 72, org_id: 'ORG-001' },
    { id: 'e2', name: 'NH7 Weekender', slug: 'nh7-weekender-2026', category: 'Festival', city: 'Pune', event_date: '2026-05-03', status: 'published', price_from: 2499, venue_name: 'Mahalunge Grounds', image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', sold_pct: 58, org_id: 'ORG-002' },
    { id: 'e3', name: 'Zakir Hussain Live', slug: 'zakir-hussain-live-delhi', category: 'Classical', city: 'Delhi', event_date: '2026-04-20', status: 'published', price_from: 999, venue_name: 'Siri Fort Auditorium', image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', sold_pct: 45, org_id: 'ORG-001' },
    { id: 'e4', name: 'IPL: MI vs CSK', slug: 'ipl-mi-vs-csk-2026', category: 'Sports', city: 'Mumbai', event_date: '2026-04-18', status: 'published', price_from: 1200, venue_name: 'Wankhede Stadium', image_url: 'https://images.unsplash.com/photo-1540747913346-19212a4b733d?w=800', sold_pct: 95, org_id: 'ORG-001' },
    { id: 'e5', name: 'Diljit Dosanjh World Tour', slug: 'diljit-dosanjh-world-tour', category: 'Punjabi', city: 'Bangalore', event_date: '2026-05-10', status: 'published', price_from: 3499, venue_name: 'Palace Grounds', image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', sold_pct: 88, org_id: 'ORG-002' },
    { id: 'e6', name: 'TEDx Mumbai 2026', slug: 'tedx-mumbai-2026', category: 'Conference', city: 'Mumbai', event_date: '2026-04-25', status: 'published', price_from: 2000, venue_name: 'Nehru Centre', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', sold_pct: 62, org_id: 'ORG-001' },
    { id: 'e7', name: 'Comedy Central Live – Chennai', slug: 'comedy-central-live-chennai', category: 'Comedy', city: 'Chennai', event_date: '2026-04-30', status: 'published', price_from: 799, venue_name: 'SVRC Hall', image_url: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', sold_pct: 40, org_id: 'ORG-002' },
    { id: 'e8', name: 'Lollapalooza India', slug: 'lollapalooza-india-2026', category: 'Music', city: 'Mumbai', event_date: '2026-03-22', status: 'published', price_from: 5999, venue_name: 'Mahalaxmi Racecourse', image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', sold_pct: 92, org_id: 'ORG-001' },
  ]

  return {
    events: {
      async list(filters: { city?: string; category?: string; q?: string } & PaginationOpts) {
        const { city, category, q, page = 1, limit = 20 } = filters
        let events = [...EVENTS]
        if (city)     events = events.filter(e => e.city.toLowerCase() === city.toLowerCase())
        if (category) events = events.filter(e => e.category.toLowerCase() === category.toLowerCase())
        if (q) {
          const ql = q.toLowerCase()
          events = events.filter(e => e.name.toLowerCase().includes(ql) || e.city.toLowerCase().includes(ql))
        }
        return events.slice((page-1)*limit, page*limit)
      },
      async byId(id: string) { return EVENTS.find(e => e.id === id) ?? null },
      async count(filters: { city?: string; category?: string }) {
        const { city, category } = filters
        let events = [...EVENTS]
        if (city)     events = events.filter(e => e.city.toLowerCase() === city.toLowerCase())
        if (category) events = events.filter(e => e.category.toLowerCase() === category.toLowerCase())
        return events.length
      },
    },
    users: {
      async byEmail(_: string) { return null },
      async byId(_: string)    { return null },
      async updateLastLogin(_: string) { return null },
    },
    bookings: {
      async forUser(_: string) { return [] },
      async create(_: object)  { return null },
    },
    cms: {
      async bySlug(_: string) { return null },
      async byType(_: string) { return [] },
      async upsert(_: object)  { return null },
    },
    notifications: {
      async list(_: string) { return [] },
      async markRead(_: string, __: string) { return null },
    },
    wallet: { async get(_: string) { return null } },
    loyalty: { async get(_: string) { return null } },
    promo: { async validate(_: string) { return null } },
    audit: { async log(_: object) { return null } },
  }
}
