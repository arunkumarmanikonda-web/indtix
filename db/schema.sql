-- INDTIX D1 Database Schema v1.0
-- Apply with: wrangler d1 execute INDTIX_DB --file=db/schema.sql --remote
-- Local dev: wrangler d1 execute INDTIX_DB --file=db/schema.sql --local

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─── Users ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'fan',
  badge          TEXT,
  avatar_url     TEXT,
  phone          TEXT,
  org_id         TEXT,
  venue_id       TEXT,
  kyc_status     TEXT NOT NULL DEFAULT 'pending',
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role   ON users(role);

-- ─── Refresh Tokens ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  revoked_at  INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ─── Organisations ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organisations (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  owner_id       TEXT NOT NULL,
  gst_number     TEXT,
  pan_number     TEXT,
  bank_account   TEXT,
  kyc_status     TEXT NOT NULL DEFAULT 'pending',
  plan           TEXT NOT NULL DEFAULT 'starter',
  logo_url       TEXT,
  website        TEXT,
  city           TEXT,
  state          TEXT,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- ─── Venues ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS venues (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  address        TEXT NOT NULL,
  pincode        TEXT,
  lat            REAL,
  lng            REAL,
  capacity       INTEGER NOT NULL DEFAULT 0,
  amenities      TEXT,
  images         TEXT,
  owner_id       TEXT,
  org_id         TEXT,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (org_id)   REFERENCES organisations(id)
);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

-- ─── Events ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  city            TEXT NOT NULL,
  venue_id        TEXT,
  org_id          TEXT,
  event_date      TEXT NOT NULL,
  doors_open      TEXT,
  start_time      TEXT,
  end_time        TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  image_url       TEXT,
  banner_url      TEXT,
  tags            TEXT,
  age_restriction TEXT,
  dress_code      TEXT,
  language        TEXT DEFAULT 'Hindi,English',
  min_price       REAL,
  max_price       REAL,
  sold_pct        REAL DEFAULT 0,
  created_by      TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  published_at    INTEGER,
  FOREIGN KEY (venue_id)    REFERENCES venues(id),
  FOREIGN KEY (org_id)      REFERENCES organisations(id),
  FOREIGN KEY (created_by)  REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_events_city      ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_category  ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date      ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status    ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_org       ON events(org_id);

-- ─── Ticket Tiers ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ticket_tiers (
  id             TEXT PRIMARY KEY,
  event_id       TEXT NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          REAL NOT NULL,
  total_qty      INTEGER NOT NULL,
  sold_qty       INTEGER NOT NULL DEFAULT 0,
  held_qty       INTEGER NOT NULL DEFAULT 0,
  max_per_order  INTEGER NOT NULL DEFAULT 10,
  min_per_order  INTEGER NOT NULL DEFAULT 1,
  sale_starts_at INTEGER,
  sale_ends_at   INTEGER,
  seat_zone      TEXT,
  is_standing    INTEGER NOT NULL DEFAULT 1,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tiers_event ON ticket_tiers(event_id);

-- ─── Bookings ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL,
  event_id         TEXT NOT NULL,
  tier_id          TEXT NOT NULL,
  qty              INTEGER NOT NULL DEFAULT 1,
  unit_price       REAL NOT NULL,
  subtotal         REAL NOT NULL,
  discount         REAL NOT NULL DEFAULT 0,
  gst_amount       REAL NOT NULL DEFAULT 0,
  convenience_fee  REAL NOT NULL DEFAULT 0,
  total_amount     REAL NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  payment_method   TEXT,
  payment_ref      TEXT,
  payment_gateway  TEXT,
  promo_code       TEXT,
  seats            TEXT,
  addons           TEXT,
  qr_code          TEXT,
  check_in_at      INTEGER,
  refund_amount    REAL,
  refund_reason    TEXT,
  created_at       INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at       INTEGER NOT NULL DEFAULT (unixepoch()),
  confirmed_at     INTEGER,
  cancelled_at     INTEGER,
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (tier_id)  REFERENCES ticket_tiers(id)
);
CREATE INDEX IF NOT EXISTS idx_bookings_user   ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event  ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date   ON bookings(created_at);

-- ─── Seat Map ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seats (
  id          TEXT PRIMARY KEY,
  venue_id    TEXT NOT NULL,
  event_id    TEXT,
  tier_id     TEXT,
  row_label   TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  section     TEXT,
  zone        TEXT,
  status      TEXT NOT NULL DEFAULT 'available',
  booking_id  TEXT,
  held_until  INTEGER,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (venue_id)   REFERENCES venues(id),
  FOREIGN KEY (event_id)   REFERENCES events(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
CREATE INDEX IF NOT EXISTS idx_seats_event  ON seats(event_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);

-- ─── Loyalty ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id            TEXT PRIMARY KEY,
  user_id       TEXT UNIQUE NOT NULL,
  points        INTEGER NOT NULL DEFAULT 0,
  tier          TEXT NOT NULL DEFAULT 'bronze',
  lifetime_pts  INTEGER NOT NULL DEFAULT 0,
  next_tier_pts INTEGER,
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL,
  points      INTEGER NOT NULL,
  description TEXT,
  ref_id      TEXT,
  balance_after INTEGER NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_loyalty_tx_user ON loyalty_transactions(user_id);

-- ─── Wallet ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallets (
  id          TEXT PRIMARY KEY,
  user_id     TEXT UNIQUE NOT NULL,
  balance     REAL NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'INR',
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  wallet_id     TEXT NOT NULL,
  type          TEXT NOT NULL,
  amount        REAL NOT NULL,
  description   TEXT,
  ref_id        TEXT,
  balance_after REAL NOT NULL,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
CREATE INDEX IF NOT EXISTS idx_wtx_wallet ON wallet_transactions(wallet_id);

-- ─── Fan Clubs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fan_clubs (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  artist_id    TEXT,
  org_id       TEXT,
  description  TEXT,
  image_url    TEXT,
  cover_url    TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  is_active    INTEGER NOT NULL DEFAULT 1,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (org_id) REFERENCES organisations(id)
);

CREATE TABLE IF NOT EXISTS fan_club_members (
  club_id    TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'member',
  joined_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (club_id, user_id),
  FOREIGN KEY (club_id) REFERENCES fan_clubs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ─── Wishlist ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  user_id    TEXT NOT NULL,
  event_id   TEXT NOT NULL,
  added_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, event_id),
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- ─── Reviews & Ratings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id     TEXT NOT NULL,
  event_id    TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (user_id, event_id),
  FOREIGN KEY (user_id)  REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_event ON reviews(event_id);

-- ─── Notifications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        TEXT,
  action_url  TEXT,
  is_read     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_notif_user    ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created ON notifications(created_at);

-- ─── CMS Content ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_content (
  id           TEXT PRIMARY KEY,
  type         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  metadata     TEXT,
  status       TEXT NOT NULL DEFAULT 'draft',
  locale       TEXT NOT NULL DEFAULT 'en',
  seo_title    TEXT,
  seo_desc     TEXT,
  og_image     TEXT,
  created_by   TEXT,
  updated_by   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  published_at INTEGER,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_cms_type_status ON cms_content(type, status);
CREATE INDEX IF NOT EXISTS idx_cms_slug        ON cms_content(slug);

-- ─── Promo Codes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id            TEXT PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  type          TEXT NOT NULL DEFAULT 'percentage',
  value         REAL NOT NULL,
  min_order     REAL NOT NULL DEFAULT 0,
  max_discount  REAL,
  usage_limit   INTEGER,
  used_count    INTEGER NOT NULL DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  event_id      TEXT,
  org_id        TEXT,
  valid_from    INTEGER,
  valid_until   INTEGER,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (org_id)   REFERENCES organisations(id)
);

CREATE TABLE IF NOT EXISTS promo_usage (
  promo_id    TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  booking_id  TEXT,
  used_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (promo_id, user_id),
  FOREIGN KEY (promo_id)  REFERENCES promo_codes(id),
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- ─── Payment Transactions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_transactions (
  id              TEXT PRIMARY KEY,
  booking_id      TEXT NOT NULL,
  user_id         TEXT NOT NULL,
  gateway         TEXT NOT NULL,
  gateway_txn_id  TEXT UNIQUE,
  amount          REAL NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  status          TEXT NOT NULL DEFAULT 'pending',
  method          TEXT,
  captured_at     INTEGER,
  failed_at       INTEGER,
  refunded_at     INTEGER,
  refund_amount   REAL,
  metadata        TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id)    REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway ON payment_transactions(gateway_txn_id);

-- ─── KYC Documents ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kyc_documents (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id      TEXT,
  org_id       TEXT,
  type         TEXT NOT NULL,
  doc_url      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  reviewer_id  TEXT,
  reviewed_at  INTEGER,
  notes        TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (org_id)      REFERENCES organisations(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- ─── Audit Log ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id      TEXT,
  action       TEXT NOT NULL,
  resource     TEXT NOT NULL,
  resource_id  TEXT,
  old_value    TEXT,
  new_value    TEXT,
  ip           TEXT,
  user_agent   TEXT,
  cf_ray       TEXT,
  cf_country   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_audit_user     ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created  ON audit_log(created_at);

-- ─── System Config ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_config (
  key          TEXT PRIMARY KEY,
  value        TEXT NOT NULL,
  description  TEXT,
  updated_by   TEXT,
  updated_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT OR IGNORE INTO system_config (key, value, description) VALUES
  ('platform_fee_pct',    '2.5',    'Platform convenience fee %'),
  ('gst_rate',            '18',     'GST rate on platform fee %'),
  ('max_tickets_per_user','10',     'Max tickets per user per event'),
  ('refund_window_hours', '48',     'Hours before event to allow refund'),
  ('maintenance_mode',    'false',  'Enable maintenance mode');
