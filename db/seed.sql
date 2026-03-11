-- INDTIX D1 Seed Data v1.0
-- Run AFTER schema.sql:
-- wrangler d1 execute INDTIX_DB --file=db/seed.sql --local

-- NOTE: Passwords below are PBKDF2 hashes.
-- For demo deployment, the auth route also supports plain-text comparison
-- against DEMO_PASSWORDS_PLAIN when D1 is bound but user not found there.

-- ─── Demo Users (passwords are plain-text for initial seed; run hash script in prod) ──
-- In production: replace password_hash with output of `hashPassword(plaintext)`
-- Demo hashes below are SHA-256 placeholders; replace with real PBKDF2 hashes

INSERT OR IGNORE INTO users (id, email, name, password_hash, role, badge, kyc_status)
VALUES
  ('USR-FAN-001',  'fan@demo.indtix.com',        'Arjun Sharma',  '__HASH_FAN__',     'fan',           'Gold Fan',           'verified'),
  ('USR-ADM-001',  'admin@demo.indtix.com',       'Priya Kapoor',  '__HASH_ADMIN__',   'superadmin',    'Super Admin',        'verified'),
  ('USR-ORG-001',  'organiser@demo.indtix.com',   'Rahul Verma',   '__HASH_ORG__',     'organiser',     'Verified Organiser', 'verified'),
  ('USR-VEN-001',  'venue@demo.indtix.com',       'Sneha Pillai',  '__HASH_VEN__',     'venue_manager', 'Venue Manager',      'verified'),
  ('USR-EM-001',   'eventmgr@demo.indtix.com',    'Vikram Nair',   '__HASH_EM__',      'event_manager', 'Event Manager',      'verified'),
  ('USR-OPS-001',  'ops@demo.indtix.com',         'Meera Joshi',   '__HASH_OPS__',     'ops_admin',     'Operations Admin',   'verified');

-- ─── Demo Organisations ────────────────────────────────────────────────────
INSERT OR IGNORE INTO organisations (id, name, slug, owner_id, gst_number, kyc_status, plan)
VALUES
  ('ORG-001', 'Percept Live',      'percept-live',      'USR-ORG-001', '27AADCP1234B1Z5', 'verified', 'enterprise'),
  ('ORG-002', 'Only Much Louder',  'only-much-louder',  'USR-ORG-001', '27AADCO5678C1Z2', 'verified', 'growth'),
  ('ORG-003', 'BookMyShow Live',   'bookmyshow-live',   'USR-ORG-001', '27AADCB9012D1Z8', 'verified', 'enterprise');

-- Link organiser to org
UPDATE users SET org_id = 'ORG-001' WHERE id = 'USR-ORG-001';

-- ─── Demo Venues ───────────────────────────────────────────────────────────
INSERT OR IGNORE INTO venues (id, name, slug, city, state, address, pincode, lat, lng, capacity, org_id, owner_id)
VALUES
  ('VEN-001', 'MMRDA Grounds',           'mmrda-grounds-mumbai',    'Mumbai',    'Maharashtra', 'BKC, Bandra East, Mumbai', '400051', 19.0607, 72.8679, 50000, 'ORG-001', 'USR-VEN-001'),
  ('VEN-002', 'Palace Grounds',          'palace-grounds-bangalore','Bangalore', 'Karnataka',   'Jayamahal Rd, Bangalore',  '560080', 12.9915, 77.5962, 80000, 'ORG-002', 'USR-VEN-001'),
  ('VEN-003', 'Siri Fort Auditorium',    'siri-fort-delhi',          'Delhi',     'Delhi',       'August Kranti Marg, Delhi', '110049', 28.5494, 77.2143, 2000,  'ORG-001', 'USR-VEN-001'),
  ('VEN-004', 'DY Patil Stadium',        'dy-patil-stadium-navi',    'Mumbai',    'Maharashtra', 'Nerul, Navi Mumbai',        '400706', 19.0330, 73.0297, 55000, 'ORG-001', 'USR-VEN-001'),
  ('VEN-005', 'Wankhede Stadium',        'wankhede-stadium-mumbai',  'Mumbai',    'Maharashtra', 'D Rd, Churchgate, Mumbai',  '400020', 18.9388, 72.8258, 33000, 'ORG-003', 'USR-VEN-001'),
  ('VEN-006', 'Jio World Garden',        'jio-world-garden-bkc',     'Mumbai',    'Maharashtra', 'BKC, Mumbai',               '400098', 19.0631, 72.8650, 20000, 'ORG-003', 'USR-VEN-001');
-- Link venue manager to venue
UPDATE users SET venue_id = 'VEN-001' WHERE id = 'USR-VEN-001';

-- ─── Demo Events ───────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (id, name, slug, category, city, venue_id, org_id, event_date, start_time, status, image_url, min_price, max_price, sold_pct, created_by)
VALUES
  ('e1', 'Sunburn Arena – Mumbai',        'sunburn-arena-mumbai-2026',  'Music',      'Mumbai',    'VEN-001', 'ORG-001', '2026-04-12', '17:00', 'published', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 1499, 4999, 72,  'USR-ORG-001'),
  ('e2', 'NH7 Weekender',                 'nh7-weekender-2026',          'Festival',   'Pune',      'VEN-001', 'ORG-002', '2026-05-03', '14:00', 'published', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 2499, 7999, 58,  'USR-ORG-001'),
  ('e3', 'Zakir Hussain Live',             'zakir-hussain-live-delhi',    'Classical',  'Delhi',     'VEN-003', 'ORG-001', '2026-04-20', '19:00', 'published', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', 999,  2999, 45,  'USR-ORG-001'),
  ('e4', 'IPL: MI vs CSK',                'ipl-mi-vs-csk-2026',          'Sports',     'Mumbai',    'VEN-005', 'ORG-003', '2026-04-18', '19:30', 'published', 'https://images.unsplash.com/photo-1540747913346-19212a4b733d?w=800', 1200, 5000, 95,  'USR-ORG-001'),
  ('e5', 'Diljit Dosanjh World Tour',      'diljit-dosanjh-world-tour',   'Punjabi',    'Bangalore', 'VEN-002', 'ORG-002', '2026-05-10', '20:00', 'published', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 3499, 9999, 88,  'USR-ORG-001'),
  ('e6', 'TEDx Mumbai 2026',              'tedx-mumbai-2026',             'Conference', 'Mumbai',    'VEN-006', 'ORG-001', '2026-04-25', '09:00', 'published', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 2000, 2000, 62,  'USR-ORG-001'),
  ('e7', 'Comedy Central Live – Chennai', 'comedy-central-live-chennai',  'Comedy',     'Chennai',   'VEN-003', 'ORG-002', '2026-04-30', '20:00', 'published', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', 799,  1499, 40,  'USR-ORG-001'),
  ('e8', 'Lollapalooza India',            'lollapalooza-india-2026',      'Music',      'Mumbai',    'VEN-001', 'ORG-001', '2026-03-22', '12:00', 'published', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 5999, 12999,92, 'USR-ORG-001');

-- ─── Demo Ticket Tiers ─────────────────────────────────────────────────────
INSERT OR IGNORE INTO ticket_tiers (id, event_id, name, price, total_qty, sold_qty, sort_order)
VALUES
  ('TT-001', 'e1', 'General Admission',  1499,  5000, 3600, 1),
  ('TT-002', 'e1', 'Premium Standing',   2999,  1000,  750, 2),
  ('TT-003', 'e1', 'VIP',                4999,   200,  180, 3),
  ('TT-004', 'e2', 'Day Pass',           2499,  3000, 1740, 1),
  ('TT-005', 'e2', 'Weekend Pass',       5999,  1500,  900, 2),
  ('TT-006', 'e3', 'Standard',            999,  2000,  900, 1),
  ('TT-007', 'e4', 'Stand Ticket',       1200,  8000, 7600, 1),
  ('TT-008', 'e4', 'Pavilion',           3500,  2000, 1900, 2),
  ('TT-009', 'e5', 'General',            3499,  5000, 4400, 1),
  ('TT-010', 'e5', 'Gold Circle',        9999,   500,  480, 2),
  ('TT-011', 'e8', 'Day 1 GA',           5999,  3000, 2760, 1),
  ('TT-012', 'e8', 'All Access',        12999,   500,  460, 2);

-- ─── Demo Promo Codes ──────────────────────────────────────────────────────
INSERT OR IGNORE INTO promo_codes (id, code, type, value, min_order, max_discount, usage_limit, is_active)
VALUES
  ('promo-1', 'WELCOME10', 'percentage', 10,  500,  200, 10000, 1),
  ('promo-2', 'FLAT200',   'fixed',     200,  999, NULL,  5000, 1),
  ('promo-3', 'SUMMER40',  'percentage', 40, 1999, 1500,  2000, 1),
  ('promo-4', 'INDIE50',   'fixed',      50,  299, NULL,  NULL, 1),
  ('promo-5', 'VIPONLY',   'percentage', 15, 4000,  750,   500, 1);

-- ─── Demo CMS Content ──────────────────────────────────────────────────────
INSERT OR IGNORE INTO cms_content (id, type, slug, title, body, metadata, status, locale)
VALUES
  ('cms-1', 'banner', 'summer-sale-2026',    'Summer Sale — Up to 40% Off!',     'Use code SUMMER40 for events above ₹2000',          '{"imageUrl":"https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200","ctaText":"Book Now","linkUrl":"/fan.html","priority":1}', 'published', 'en'),
  ('cms-2', 'faq',    'refund-policy',        'What is the refund policy?',        'Full refund up to 48 hours before the event.',       '{"category":"booking"}', 'published', 'en'),
  ('cms-3', 'page',   'about-us',             'About INDTIX',                      'India''s most-loved live event ticketing platform.', '{"seoTitle":"About INDTIX"}', 'published', 'en'),
  ('cms-4', 'promo',  'welcome10-banner',     'Welcome 10% Off',                   'First-time users get 10% off with WELCOME10',         '{"code":"WELCOME10"}',  'published', 'en'),
  ('cms-5', 'blog',   'top-concerts-2026',    'Top 10 Concerts to Attend in 2026', 'From Diljit to Lolla — must-attend shows this year.', '{"author":"INDTIX Team","readTime":"5 min"}', 'published', 'en');

-- ─── Demo Fan Clubs ────────────────────────────────────────────────────────
INSERT OR IGNORE INTO fan_clubs (id, name, slug, org_id, description, member_count)
VALUES
  ('FC-001', 'Diljit Fan Army India', 'diljit-fan-army', 'ORG-002', 'Official fan club for Diljit Dosanjh India tour', 45230),
  ('FC-002', 'Sunburn Family',        'sunburn-family',  'ORG-001', 'Official Sunburn festival community',             128500),
  ('FC-003', 'NH7 Tribe',             'nh7-tribe',       'ORG-002', 'Community for NH7 Weekender lovers',              67800);

-- ─── System config ─────────────────────────────────────────────────────────
INSERT OR REPLACE INTO system_config (key, value, description) VALUES
  ('platform_name',       'INDTIX',                      'Platform display name'),
  ('platform_fee_pct',    '2.5',                         'Platform convenience fee %'),
  ('gst_rate',            '18',                          'GST rate on convenience fee'),
  ('max_tickets_per_user','10',                          'Max tickets per user per event'),
  ('refund_window_hours', '48',                          'Hours before event for refund'),
  ('maintenance_mode',    'false',                       'Enable site maintenance mode'),
  ('payment_gateways',    '["razorpay","paytm","upi"]',  'Enabled payment gateways'),
  ('supported_cities',    '["Mumbai","Delhi","Bangalore","Pune","Chennai","Hyderabad","Kolkata","Goa"]', 'Event cities');
