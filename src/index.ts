import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// ─── Middleware ───────────────────────────────────────────
app.use('*', cors())

// ─── Portal Routes ─────────────────────────────────────────
app.get('/', (c) => c.redirect('/fan'))

// ─── API: Health ──────────────────────────────────────────
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    platform: 'INDTIX',
    version: '4.0.0',
    ts: new Date().toISOString(),
    portals: ['fan','organiser','venue','event-manager','admin','ops','brand','architecture-spec'],
    api_version: 'v4',
    total_endpoints: 58,
    uptime: 'operational',
    region: 'edge-global',
    built_with: 'Hono + Cloudflare Workers + TypeScript',
    gstin: '27AABCO1234A1Z5',
    company: 'Oye Imagine Private Limited'
  })
})

// ─── API: Events ──────────────────────────────────────────
const EVENTS_DATA = [
  { id: 'e1', name: 'Sunburn Arena – Mumbai', category: 'Music', city: 'Mumbai', date: '2026-04-12', price: 1499, venue: 'MMRDA Grounds', image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400', sold_pct: 72, status: 'live', organiser: 'Percept Live' },
  { id: 'e2', name: 'NH7 Weekender', category: 'Festival', city: 'Pune', date: '2026-05-03', price: 2499, venue: 'Mahalunge Grounds', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', sold_pct: 58, status: 'live', organiser: 'Only Much Louder' },
  { id: 'e3', name: 'Zakir Hussain Live', category: 'Classical', city: 'Delhi', date: '2026-04-20', price: 999, venue: 'Siri Fort Auditorium', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400', sold_pct: 45, status: 'live', organiser: 'Art Culture India' },
  { id: 'e4', name: 'IPL: MI vs CSK', category: 'Sports', city: 'Mumbai', date: '2026-04-18', price: 1200, venue: 'Wankhede Stadium', image: 'https://images.unsplash.com/photo-1540747913346-19212a4b733d?w=400', sold_pct: 95, status: 'live', organiser: 'BCCI' },
  { id: 'e5', name: 'Diljit Dosanjh World Tour', category: 'Punjabi', city: 'Bangalore', date: '2026-05-10', price: 3499, venue: 'Palace Grounds', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', sold_pct: 88, status: 'live', organiser: 'BookMyShow Live' },
  { id: 'e6', name: 'TEDx Mumbai 2026', category: 'Conference', city: 'Mumbai', date: '2026-04-25', price: 2000, venue: 'Nehru Centre', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', sold_pct: 62, status: 'live', organiser: 'TEDx Mumbai' },
  { id: 'e7', name: 'Comedy Central Live – Chennai', category: 'Comedy', city: 'Chennai', date: '2026-04-30', price: 799, venue: 'Sir Mutha Venkatasubba Rao Concert Hall', image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400', sold_pct: 40, status: 'live', organiser: 'Canvas Laugh Club' },
  { id: 'e8', name: 'Lollapalooza India', category: 'Music', city: 'Mumbai', date: '2026-03-22', price: 5999, venue: 'Mahalaxmi Racecourse', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', sold_pct: 92, status: 'live', organiser: 'Lollapalooza India' },
]

app.get('/api/events', (c) => {
  const city = c.req.query('city')
  const category = c.req.query('category')
  const q = c.req.query('q')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')

  let events = [...EVENTS_DATA]
  if (city) events = events.filter(e => e.city.toLowerCase() === city.toLowerCase())
  if (category) events = events.filter(e => e.category.toLowerCase() === category.toLowerCase())
  if (q) {
    const query = q.toLowerCase()
    events = events.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.city.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      (e.organiser || '').toLowerCase().includes(query)
    )
  }

  const total = events.length
  const start = (page - 1) * limit
  const paginated = events.slice(start, start + limit)

  return c.json({
    events: paginated,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  })
})

app.get('/api/events/:id', (c) => {
  const id = c.req.param('id')
  const event = EVENTS_DATA.find(e => e.id === id)
  if (!event) return c.json({ error: 'Event not found' }, 404)

  return c.json({
    event: {
      ...event,
      description: `An unforgettable live experience at ${event.venue}. Book your tickets now on INDTIX.`,
      tiers: [
        { id: 'ga', name: 'General Admission', price: event.price, total: 5000, sold: Math.floor(5000 * event.sold_pct / 100) },
        { id: 'premium', name: 'Premium', price: event.price * 2, total: 2000, sold: Math.floor(2000 * event.sold_pct / 100) },
        { id: 'vip', name: 'VIP', price: event.price * 4, total: 500, sold: Math.floor(500 * event.sold_pct / 100) },
      ],
      addons: [
        { id: 'meal', name: 'Combo Meal', price: 350, available: true },
        { id: 'merch', name: 'Event T-Shirt', price: 899, available: true },
        { id: 'parking', name: 'Parking Pass', price: 200, available: event.sold_pct < 90 },
      ],
      policies: {
        refund: 'Full refund up to 48 hours before event. 50% refund 24-48 hours before. No refund within 24 hours.',
        transfer: 'Tickets are non-transferable.',
        age: 'No age restriction unless specified.',
      },
      gst_rate: 18,
      platform_fee: 20,
    }
  })
})

// ─── API: Cities ──────────────────────────────────────────
app.get('/api/cities', (c) => {
  return c.json({
    cities: [
      { name: 'Mumbai', state: 'Maharashtra', events: 18, icon: '🏙️' },
      { name: 'Delhi', state: 'Delhi NCR', events: 14, icon: '🏛️' },
      { name: 'Bangalore', state: 'Karnataka', events: 12, icon: '💻' },
      { name: 'Hyderabad', state: 'Telangana', events: 9, icon: '🕌' },
      { name: 'Chennai', state: 'Tamil Nadu', events: 8, icon: '🎭' },
      { name: 'Pune', state: 'Maharashtra', events: 11, icon: '🌿' },
      { name: 'Kolkata', state: 'West Bengal', events: 7, icon: '🌸' },
      { name: 'Ahmedabad', state: 'Gujarat', events: 5, icon: '🏗️' },
      { name: 'Jaipur', state: 'Rajasthan', events: 6, icon: '🏰' },
      { name: 'Goa', state: 'Goa', events: 10, icon: '🏖️' },
    ]
  })
})

// ─── API: Categories ─────────────────────────────────────
app.get('/api/categories', (c) => {
  return c.json({
    categories: [
      { id: 'music', name: 'Music', icon: '🎵', count: 234, color: '#6C3CF7' },
      { id: 'comedy', name: 'Comedy', icon: '😂', count: 87, color: '#FF4F6E' },
      { id: 'sports', name: 'Sports', icon: '⚽', count: 156, color: '#00F5C4' },
      { id: 'theatre', name: 'Theatre', icon: '🎭', count: 63, color: '#ffc107' },
      { id: 'festival', name: 'Festivals', icon: '🎪', count: 45, color: '#6C3CF7' },
      { id: 'conference', name: 'Conferences', icon: '🎯', count: 112, color: '#00F5C4' },
      { id: 'nightlife', name: 'Nightlife', icon: '🌙', count: 78, color: '#FF4F6E' },
      { id: 'workshops', name: 'Workshops', icon: '🎨', count: 190, color: '#ffc107' },
      { id: 'kids', name: 'Kids & Family', icon: '👨‍👩‍👧', count: 54, color: '#00F5C4' },
      { id: 'classical', name: 'Classical', icon: '🎻', count: 38, color: '#6C3CF7' },
    ]
  })
})

// ─── API: Venues ──────────────────────────────────────────
app.get('/api/venues', (c) => {
  const city = c.req.query('city')
  const venues = [
    { id: 'v1', name: 'MMRDA Grounds', city: 'Mumbai', capacity: 50000, type: 'Open Ground', verified: true, rating: 4.7 },
    { id: 'v2', name: 'Palace Grounds', city: 'Bangalore', capacity: 30000, type: 'Open Ground', verified: true, rating: 4.5 },
    { id: 'v3', name: 'Wankhede Stadium', city: 'Mumbai', capacity: 32000, type: 'Stadium', verified: true, rating: 4.8 },
    { id: 'v4', name: 'Siri Fort Auditorium', city: 'Delhi', capacity: 2000, type: 'Auditorium', verified: true, rating: 4.6 },
    { id: 'v5', name: 'Nehru Centre', city: 'Mumbai', capacity: 1200, type: 'Indoor', verified: true, rating: 4.4 },
    { id: 'v6', name: 'Mahalunge Grounds', city: 'Pune', capacity: 15000, type: 'Open Ground', verified: true, rating: 4.3 },
  ]
  const filtered = city ? venues.filter(v => v.city.toLowerCase() === city.toLowerCase()) : venues
  return c.json({ venues: filtered, total: filtered.length })
})

// ─── API: Bookings (create) ───────────────────────────────
app.post('/api/bookings', async (c) => {
  const body = await c.req.json()
  const { event_id, tickets, addons, payment_method } = body

  if (!event_id || !tickets) {
    return c.json({ success: false, error: 'Missing required fields: event_id, tickets' }, 400)
  }

  const bookingId = 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase()
  const subtotal = (tickets || []).reduce((s: number, t: any) => s + (t.price * t.qty), 0)
  const addonsTotal = (addons || []).reduce((s: number, a: any) => s + (a.price * (a.qty || 1)), 0)
  const platformFee = 20 * ((tickets || []).reduce((s: number, t: any) => s + t.qty, 0))
  const taxableAmount = subtotal + addonsTotal + platformFee
  const gstAmount = Math.round(taxableAmount * 0.18)
  const total = taxableAmount + gstAmount

  return c.json({
    success: true,
    booking: {
      id: bookingId,
      event_id,
      tickets,
      addons: addons || [],
      subtotal: subtotal + addonsTotal,
      platform_fee: platformFee,
      gst_amount: gstAmount,
      total,
      payment_method: payment_method || 'upi',
      status: 'confirmed',
      qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`,
      ticket_pdf: `https://r2.indtix.com/tickets/${bookingId}.pdf`,
      gst_invoice: `https://r2.indtix.com/gst/INV-2026-${bookingId}.pdf`,
      whatsapp_sent: true,
      email_sent: true,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: Bookings (get) ──────────────────────────────────
app.get('/api/bookings/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    booking: {
      id,
      event: EVENTS_DATA[0],
      status: 'confirmed',
      tickets: [{ tier: 'General Admission', qty: 2, seat: 'G-12, G-13', price: 1499 }],
      total: 3998,
      qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${id}`,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: Scan / QR Verify ───────────────────────────────
app.post('/api/scan/verify', async (c) => {
  const { qr_code, event_id, gate_id } = await c.req.json()
  if (!qr_code) return c.json({ result: 'invalid', message: 'No QR code provided' }, 400)

  // Simulate: BK prefix = valid, "DUP" = duplicate, else invalid
  if (qr_code.includes('DUP')) {
    return c.json({ result: 'duplicate', message: 'Already scanned at Gate 1, 10 mins ago', booking_id: qr_code })
  }
  if (qr_code.startsWith('BK')) {
    return c.json({
      result: 'valid',
      message: 'Welcome! Enjoy the show 🎉',
      booking: { id: qr_code, attendee: 'Rahul Sharma', tier: 'General Admission', seat: 'G-12' },
      gate_id: gate_id || 'Gate 1',
      scanned_at: new Date().toISOString()
    })
  }
  return c.json({ result: 'invalid', message: 'Invalid QR code. Contact support.' })
})

// ─── API: Platform Stats (Admin) ─────────────────────────
app.get('/api/admin/stats', (c) => {
  return c.json({
    platform: {
      gmv_this_month: 42000000,
      gmv_mom_change: 31,
      tickets_sold: 124500,
      tickets_mom_change: 18,
      live_events_today: 12,
      active_users_today: 84200,
      active_users_mom_change: 12,
      registered_users: 2400000,
    },
    finance: {
      upi_transactions: 68420,
      upi_volume_pct: 55,
      card_transactions: 28340,
      card_volume_pct: 23,
      refund_amount: 840000,
      refund_rate: 2.1,
      gst_collected: 7560000,
      settlements_pending: 1840000,
    },
    operations: {
      venues: 528,
      venues_pending_kyc: 12,
      organisers: 1842,
      organisers_pending_kyc: 18,
      events_live: 312,
      events_pending_approval: 24,
    },
    updated_at: new Date().toISOString()
  })
})

// ─── API: AI Chat (INDY) ─────────────────────────────────
app.post('/api/ai/chat', async (c) => {
  const { message, session_id } = await c.req.json()
  if (!message) return c.json({ error: 'message required' }, 400)

  const msg = message.toLowerCase()
  let reply = ''

  if (msg.includes('weekend') || msg.includes('this week')) {
    reply = "This weekend in Mumbai: 🎵 **Sunburn Arena** (₹1,499) on Apr 12, and **TEDx Mumbai** (₹2,000) on Apr 25. Both selling fast! Want me to check availability?"
  } else if (msg.includes('cancel') || msg.includes('refund')) {
    reply = "To cancel a booking: Go to **My Account → Bookings → Cancel**. Refunds are processed within 5-7 working days. Full refund if cancelled 48+ hours before the event. Need help with a specific booking?"
  } else if (msg.includes('cheap') || msg.includes('free') || msg.includes('budget') || msg.includes('₹') || msg.includes('under')) {
    reply = "Budget picks right now: 🎭 **BITS Pilani Oasis** at ₹299, 😂 **Comedy Central Live** at ₹799. Want me to filter by city or category too?"
  } else if (msg.includes('music') || msg.includes('concert')) {
    reply = "Top music events: 🎵 **Sunburn Arena Mumbai** (₹1,499 · Apr 12), **NH7 Weekender Pune** (₹2,499 · May 3), **Diljit Dosanjh Bangalore** (₹3,499 · May 10). Which city are you in?"
  } else if (msg.includes('about') || msg.includes('indtix') || msg.includes('what is')) {
    reply = "INDTIX is India's next-gen live event platform by **Oye Imagine Pvt Ltd**. We cover music, comedy, sports, theatre, festivals & more across 10+ cities. Book tickets in under 60 seconds. 🎟️"
  } else if (msg.includes('sports') || msg.includes('cricket') || msg.includes('ipl')) {
    reply = "Sports on INDTIX: ⚽ **IPL MI vs CSK** at Wankhede Stadium (₹1,200 · Apr 18) — 95% sold, grab them fast! More sports events being added weekly."
  } else {
    reply = `I found some great events matching "${message}"! Checking our database... 🔍 Try searching on the events page for more results, or ask me: "music this weekend", "cheap events in Pune", or "how do I cancel my booking"?`
  }

  return c.json({
    reply,
    session_id: session_id || 'sess_' + Math.random().toString(36).substring(2, 8),
    model: 'indy-v1',
    ts: new Date().toISOString()
  })
})

// ─── API: Promo Codes ────────────────────────────────────
app.post('/api/promo/validate', async (c) => {
  const { code, event_id, amount } = await c.req.json()
  const promos: Record<string, any> = {
    'FEST20': { discount_pct: 20, max_discount: 500, valid: true, description: '20% off on festivals' },
    'MUSIC10': { discount_pct: 10, max_discount: 300, valid: true, description: '10% off on music events' },
    'FIRST100': { discount_flat: 100, valid: true, description: '₹100 off on your first booking' },
    'INVALID': { valid: false, error: 'Promo code expired' }
  }

  const promo = promos[code?.toUpperCase()]
  if (!promo) return c.json({ valid: false, error: 'Invalid promo code' })
  if (!promo.valid) return c.json({ valid: false, error: promo.error })

  const discount = promo.discount_flat ||
    Math.min(promo.max_discount || 999999, Math.round((amount || 0) * promo.discount_pct / 100))

  return c.json({ valid: true, code: code.toUpperCase(), discount, description: promo.description })
})

// ─── API: GST Invoice ────────────────────────────────────
app.get('/api/gst/invoice/:booking_id', (c) => {
  const booking_id = c.req.param('booking_id')
  return c.json({
    invoice: {
      invoice_no: `INV-2026-${booking_id}`,
      booking_id,
      supplier: { name: 'Oye Imagine Private Limited', gstin: '27AABCO1234A1Z5', address: 'Mumbai, Maharashtra 400001' },
      buyer: { name: 'Customer Name', gstin: null, address: 'Customer Address' },
      line_items: [
        { description: 'Event Ticket – General Admission x2', hsn: '9996', qty: 2, rate: 1499, amount: 2998 },
        { description: 'Platform Convenience Fee', hsn: '9984', qty: 2, rate: 20, amount: 40 },
      ],
      taxable_value: 3038,
      cgst: 273.42,
      sgst: 273.42,
      igst: 0,
      total: 3584.84,
      pdf_url: `https://r2.indtix.com/gst/INV-2026-${booking_id}.pdf`,
      issued_at: new Date().toISOString()
    }
  })
})

// ─── API: Notifications (send) ───────────────────────────
app.post('/api/notifications/send', async (c) => {
  const { user_id, channel, template, payload } = await c.req.json()
  // In production: queue to Cloudflare Queue → dispatch to WhatsApp/email/push
  return c.json({
    queued: true,
    notification_id: 'notif_' + Math.random().toString(36).substring(2, 9),
    channel: channel || 'whatsapp',
    template,
    estimated_delivery: '< 30 seconds',
    ts: new Date().toISOString()
  })
})

// ─── API: Refund / Cancellation ──────────────────────────
app.post('/api/bookings/:id/cancel', async (c) => {
  const booking_id = c.req.param('id')
  const { reason, requested_by } = await c.req.json().catch(() => ({}))

  const booking = { id: booking_id, total: 3584, event_name: 'Sample Event', status: 'confirmed' }
  const hoursBeforeEvent = 72 // Simulate 72h before event
  let refund_pct = 0
  let refund_policy = ''

  if (hoursBeforeEvent >= 48) { refund_pct = 100; refund_policy = 'Full refund (>48h before event)' }
  else if (hoursBeforeEvent >= 24) { refund_pct = 50; refund_policy = '50% refund (24-48h before event)' }
  else { refund_pct = 0; refund_policy = 'No refund (<24h before event)' }

  const refund_amount = Math.round(booking.total * refund_pct / 100)

  return c.json({
    success: true,
    cancellation: {
      booking_id,
      reason: reason || 'User requested',
      refund_pct,
      refund_amount,
      refund_policy,
      refund_to: 'original_payment_method',
      refund_eta: '5-7 business days',
      cancellation_id: 'CAN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      whatsapp_sent: true,
      email_sent: true,
      cancelled_at: new Date().toISOString()
    }
  })
})

// ─── API: Wristband / LED Ops ────────────────────────────
app.post('/api/wristbands/issue', async (c) => {
  const { booking_id, zone, led_enabled } = await c.req.json().catch(() => ({}))
  const wristband_id = 'WB-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  return c.json({
    success: true,
    wristband: {
      id: wristband_id,
      booking_id,
      zone: zone || 'GA',
      led_enabled: led_enabled ?? false,
      color: zone === 'VIP' ? 'gold' : zone === 'PREM' ? 'purple' : 'white',
      nfc_id: 'NFC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      activated_at: new Date().toISOString()
    }
  })
})

app.post('/api/wristbands/led/command', async (c) => {
  const { event_id, command, color, effect, zones } = await c.req.json().catch(() => ({}))
  return c.json({
    success: true,
    command_id: 'LED-CMD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    event_id,
    command: command || 'color_change',
    color,
    effect,
    zones: zones || ['all'],
    bands_targeted: 2400,
    bands_responded: 2397,
    latency_ms: 12,
    broadcast_at: new Date().toISOString()
  })
})

// ─── API: Organiser KYC ──────────────────────────────────
app.post('/api/kyc/submit', async (c) => {
  const { entity_type, gstin, pan, aadhaar_last4, company_name } = await c.req.json().catch(() => ({}))
  const kyc_id = 'KYC-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  return c.json({
    success: true,
    kyc: {
      id: kyc_id,
      entity_type: entity_type || 'organiser',
      company_name,
      gstin,
      pan,
      status: 'under_review',
      review_eta: '24-48 hours',
      submitted_at: new Date().toISOString(),
      whatsapp_sent: true,
      email_sent: true
    }
  })
})

app.get('/api/kyc/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    kyc: {
      id,
      status: 'approved',
      verified_at: new Date().toISOString(),
      gstin_valid: true,
      pan_valid: true,
      reviewer: 'KYC Team',
      notes: 'All documents verified. GSTIN active on GST portal.'
    }
  })
})

// ─── API: Settlements ────────────────────────────────────
app.get('/api/settlements', (c) => {
  return c.json({
    settlements: [
      { id: 'SET-001', organiser: 'Percept Live', amount: 1240000, status: 'processed', utr: 'UTR2026031401', date: '2026-03-14' },
      { id: 'SET-002', organiser: 'Only Much Louder', amount: 840000, status: 'pending', hold_reason: null, date: '2026-03-07' },
      { id: 'SET-003', organiser: 'Canvas Laugh Club', amount: 124000, status: 'on_hold', hold_reason: 'KYC pending', date: '2026-03-05' },
    ],
    summary: { total_processed: 1240000, total_pending: 840000, total_on_hold: 124000, platform_commission: 205000 }
  })
})

app.post('/api/settlements/:id/process', async (c) => {
  const id = c.req.param('id')
  return c.json({
    success: true,
    settlement: {
      id,
      status: 'processed',
      utr: 'UTR' + Date.now(),
      processed_at: new Date().toISOString(),
      bank: 'HDFC Bank',
      mode: 'NEFT',
      eta: '2-4 hours'
    }
  })
})

// ─── API: Seat Map ────────────────────────────────────────
app.get('/api/events/:id/seatmap', (c) => {
  const event_id = c.req.param('id')
  const zone = c.req.query('zone') || 'GA'

  const zones: Record<string, any> = {
    GA:         { rows: 12, cols: 20, price: 1499, name: 'General Admission', available: 1240 },
    PREM:       { rows: 8,  cols: 15, price: 2999, name: 'Premium Standing',  available: 420  },
    VIP:        { rows: 4,  cols: 10, price: 4999, name: 'VIP Gold',          available: 88   },
    ACCESSIBLE: { rows: 2,  cols: 8,  price: 1499, name: 'Accessible',        available: 24   },
  }

  const zoneData = zones[zone] || zones['GA']
  const seats = []
  const takenPct = zone === 'VIP' ? 0.78 : zone === 'PREM' ? 0.65 : 0.45

  for (let r = 0; r < zoneData.rows; r++) {
    for (let s = 0; s < zoneData.cols; s++) {
      seats.push({
        id: `${zone}-R${r+1}S${s+1}`,
        row: r + 1,
        seat: s + 1,
        status: Math.random() < takenPct ? 'taken' : 'available',
        price: zoneData.price
      })
    }
  }

  return c.json({
    event_id,
    zone,
    zone_info: zoneData,
    zones: Object.keys(zones).map(z => ({ ...zones[z], id: z })),
    seats,
    timer_seconds: 600,
    max_seats_per_booking: 10
  })
})

// ─── API: Ticket Tiers Availability ─────────────────────
app.get('/api/events/:id/tiers', (c) => {
  const id = c.req.param('id')
  const event = EVENTS_DATA.find(e => e.id === id)
  if (!event) return c.json({ error: 'Event not found' }, 404)

  return c.json({
    event_id: id,
    tiers: [
      { id: 'ga', name: 'General Admission', price: event.price, available: Math.floor(5000 * (1 - event.sold_pct/100)), total: 5000, description: 'Standing floor area', benefits: [] },
      { id: 'premium', name: 'Premium', price: event.price * 2, available: Math.floor(2000 * (1 - event.sold_pct/100)), total: 2000, description: 'Premium standing zone', benefits: ['Dedicated entry', 'Better view'] },
      { id: 'vip', name: 'VIP Gold', price: event.price * 4, available: Math.floor(500 * (1 - event.sold_pct/100)), total: 500, description: 'VIP lounge with seating', benefits: ['Lounge access', 'Complimentary drinks', 'Meet & greet entry', 'Merchandise'] },
      { id: 'accessible', name: 'Accessible', price: event.price, available: 50, total: 50, description: 'Accessible viewing area', benefits: ['Accessible facilities', 'Companion seat'] },
    ],
    max_per_booking: 10,
    business_booking_cap: 50,
    group_booking_available: true,
    updated_at: new Date().toISOString()
  })
})

// ─── API: Add-ons ────────────────────────────────────────
app.get('/api/events/:id/addons', (c) => {
  const id = c.req.param('id')
  return c.json({
    event_id: id,
    addons: [
      { id: 'meal', name: '🍔 Combo Meal Voucher', price: 350, category: 'food', available: true, per_ticket: true },
      { id: 'merch', name: '👕 Event T-Shirt', price: 899, category: 'merchandise', available: true, per_ticket: false, sizes: ['S','M','L','XL','XXL'] },
      { id: 'parking', name: '🚗 Parking Pass', price: 200, category: 'transport', available: true, per_ticket: false },
      { id: 'camping', name: '⛺ Camping Pass', price: 1500, category: 'accommodation', available: false, per_ticket: true },
      { id: 'afterparty', name: '🎉 After Party Access', price: 1200, category: 'experience', available: true, per_ticket: true },
      { id: 'fastlane', name: '⚡ Fast Lane Entry', price: 149, category: 'upgrade', available: true, per_ticket: true },
    ]
  })
})

// ─── API: Business / Bulk Booking ────────────────────────
app.post('/api/bookings/bulk', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { event_id, tier_id, quantity, business_name, gstin, contact } = body

  if (!event_id || !quantity) return c.json({ error: 'event_id and quantity required' }, 400)
  if (quantity > 500) return c.json({ error: 'Maximum 500 tickets per bulk order. Contact enterprise@indtix.com for larger orders.' }, 400)

  const pricePerTicket = 1499
  const bulkDiscount = quantity >= 50 ? 0.15 : quantity >= 20 ? 0.10 : quantity >= 10 ? 0.05 : 0
  const subtotal = quantity * pricePerTicket
  const discountAmt = Math.round(subtotal * bulkDiscount)
  const taxable = subtotal - discountAmt
  const gst = Math.round(taxable * 0.18)
  const total = taxable + gst

  return c.json({
    success: true,
    bulk_booking: {
      order_id: 'BULK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      event_id,
      tier_id,
      quantity,
      price_per_ticket: pricePerTicket,
      bulk_discount_pct: bulkDiscount * 100,
      discount_amount: discountAmt,
      subtotal,
      gst_amount: gst,
      total,
      business_name,
      gstin,
      status: 'confirmed',
      payment_link: 'https://pay.indtix.com/bulk/' + Math.random().toString(36).substring(2, 9),
      gst_invoice: 'https://r2.indtix.com/gst/BULK-INV-2026-' + Date.now() + '.pdf',
      account_manager_assigned: true,
      whatsapp_sent: true,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: FAQ Chatbot ─────────────────────────────────────
app.post('/api/events/:id/faq', async (c) => {
  const event_id = c.req.param('id')
  const event = EVENTS_DATA.find(e => e.id === event_id)
  const { question } = await c.req.json().catch(() => ({}))

  if (!question) return c.json({ error: 'question required' }, 400)

  const q = question.toLowerCase()
  let answer = ''

  if (q.includes('refund') || q.includes('cancel')) {
    answer = `For ${event?.name || 'this event'}: Full refund if cancelled 48+ hours before the event. 50% refund for 24-48h. No refund within 24h. Refunds process in 5-7 business days.`
  } else if (q.includes('age') || q.includes('children') || q.includes('kids')) {
    answer = `${event?.name || 'This event'} is open to all ages unless specifically stated. Attendees under 18 require a parent/guardian to be present.`
  } else if (q.includes('parking') || q.includes('transport')) {
    answer = `Parking passes are available as an add-on during checkout. We also recommend using Ola/Uber. The nearest metro station is a 10-minute walk from ${event?.venue || 'the venue'}.`
  } else if (q.includes('entry') || q.includes('gate') || q.includes('qr')) {
    answer = `Show your QR code at the gate — from your INDTIX ticket. Gates open 2 hours before the event. We recommend arriving 30 minutes early to avoid queues.`
  } else if (q.includes('dress') || q.includes('wear') || q.includes('code')) {
    answer = 'Smart casual or festive wear recommended. No offensive attire. Shoes are mandatory. VIP zone may have a specific dress code.'
  } else if (q.includes('food') || q.includes('drink') || q.includes('water')) {
    answer = 'F&B stalls are available inside the venue. Outside food and beverages are not permitted. Sealed water bottles are allowed. Meal vouchers available as add-ons.'
  } else if (q.includes('camera') || q.includes('photo') || q.includes('recording')) {
    answer = 'Professional cameras with detachable lenses are not permitted. Smartphone photography is allowed for personal use. No commercial recording without media credentials.'
  } else {
    answer = `Great question! For "${question}" — please check our full event FAQ at indtix.com/events/${event_id}/faq or WhatsApp us at +91-9999-INDTIX. Our team responds within 2 hours.`
  }

  return c.json({
    event_id,
    question,
    answer,
    confidence: 0.92,
    source: 'event_faq_bot',
    follow_up_suggestions: ['What are the gate timings?', 'Is there parking?', 'Can I transfer my ticket?'],
    ts: new Date().toISOString()
  })
})

// ─── API: Organiser Analytics ────────────────────────────
app.get('/api/organiser/analytics', (c) => {
  return c.json({
    summary: {
      total_events: 12,
      tickets_sold_total: 42840,
      gmv_total: 124000000,
      avg_occupancy: 78,
      pending_settlement: 1840000
    },
    revenue_by_tier: [
      { tier: 'General Admission', amount: 48000000, pct: 39 },
      { tier: 'Premium', amount: 42000000, pct: 34 },
      { tier: 'VIP Gold', amount: 34000000, pct: 27 },
    ],
    revenue_by_month: [
      { month: 'Oct 2025', amount: 8200000 },
      { month: 'Nov 2025', amount: 11400000 },
      { month: 'Dec 2025', amount: 18600000 },
      { month: 'Jan 2026', amount: 22400000 },
      { month: 'Feb 2026', amount: 28200000 },
      { month: 'Mar 2026', amount: 35200000 },
    ],
    top_cities: [
      { city: 'Mumbai', tickets: 18420, revenue: 52000000 },
      { city: 'Bangalore', tickets: 12840, revenue: 38000000 },
      { city: 'Delhi', tickets: 8240, revenue: 22000000 },
      { city: 'Pune', tickets: 3340, revenue: 12000000 },
    ],
    updated_at: new Date().toISOString()
  })
})

// ─── API: Check-in / Scan Stats ──────────────────────────
app.get('/api/events/:id/checkin-stats', (c) => {
  const id = c.req.param('id')
  return c.json({
    event_id: id,
    stats: {
      total_tickets_sold: 4200,
      checked_in: 2841,
      not_arrived: 1359,
      checkin_pct: 67.6,
      invalid_attempts: 12,
      duplicate_attempts: 8,
      gates: [
        { gate: 'Gate 1', scanned: 980, invalid: 3, active_scanners: 4 },
        { gate: 'Gate 2', scanned: 842, invalid: 4, active_scanners: 3 },
        { gate: 'Gate 3', scanned: 672, invalid: 2, active_scanners: 2 },
        { gate: 'Gate 4 (VIP)', scanned: 347, invalid: 3, active_scanners: 2 },
      ],
      checkin_rate_per_min: 92,
      peak_arrival_time: '17:30–18:30',
      updated_at: new Date().toISOString()
    }
  })
})

// ─── API: GST Reports ────────────────────────────────────
app.get('/api/admin/gst/monthly', (c) => {
  const month = c.req.query('month') || '2026-03'
  return c.json({
    period: month,
    gstr1: {
      status: 'filed',
      filed_date: '2026-03-10',
      b2b_invoices: 1842,
      b2c_invoices: 84200,
      taxable_value: 42000000,
      cgst: 3780000,
      sgst: 3780000,
      igst: 0,
      total_gst: 7560000
    },
    gstr3b: {
      status: 'due',
      due_date: '2026-03-20',
      total_itc: 1240000,
      net_payable: 6320000
    },
    hsn_summary: [
      { hsn: '9996', description: 'Event Tickets', taxable: 38000000, gst_rate: 18, gst_amount: 6840000 },
      { hsn: '9984', description: 'Platform Fees', taxable: 4000000, gst_rate: 18, gst_amount: 720000 },
    ],
    download_formats: ['JSON', 'Excel', 'PDF'],
    generated_at: new Date().toISOString()
  })
})

// ─── API: Platform BI / Intelligence ────────────────────
app.get('/api/admin/bi/dashboard', (c) => {
  return c.json({
    realtime: {
      dau: 84200,
      live_events: 12,
      tickets_sold_today: 4280,
      gmv_today: 8420000,
      avg_session_duration_min: 7.4,
      conversion_rate_pct: 12.8
    },
    ai_insights: [
      { insight: 'Sunburn Arena Mumbai is trending — 3.2x normal search volume. Consider pushing notification to 45K interest users.', type: 'opportunity', priority: 'high' },
      { insight: 'Refund rate for Comedy category is 4.1% vs platform average 2.1%. Investigate organiser "Canvas Laugh Club".', type: 'alert', priority: 'medium' },
      { insight: 'Mumbai users who bought Music tickets also buy Comedy tickets 68% of the time. Cross-sell opportunity.', type: 'insight', priority: 'low' },
    ],
    demand_forecast: {
      this_weekend: { predicted_tickets: 18400, confidence: 0.87 },
      next_weekend: { predicted_tickets: 22100, confidence: 0.79 },
    },
    cohort_retention: {
      day1: 82, day7: 61, day30: 44, day90: 31
    },
    updated_at: new Date().toISOString()
  })
})

// ─── API: Organiser Onboarding ────────────────────────────
app.post('/api/organiser/register', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { company_name, contact_name, email, mobile, gstin, city } = body

  if (!company_name || !email || !mobile) {
    return c.json({ error: 'company_name, email and mobile are required' }, 400)
  }

  const organiser_id = 'ORG-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  return c.json({
    success: true,
    organiser: {
      id: organiser_id,
      company_name,
      contact_name,
      email,
      mobile,
      gstin,
      city,
      status: 'kyc_pending',
      next_step: 'complete_kyc',
      dashboard_url: '/organiser',
      kyc_url: '/organiser#panel-kyc',
      account_manager: 'Team INDTIX',
      welcome_whatsapp_sent: true,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: Venue Onboarding ────────────────────────────────
app.post('/api/venue/register', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { venue_name, city, capacity, type, contact_name, email, mobile } = body

  if (!venue_name || !city || !capacity) {
    return c.json({ error: 'venue_name, city and capacity are required' }, 400)
  }

  const venue_id = 'VEN-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  return c.json({
    success: true,
    venue: {
      id: venue_id,
      venue_name,
      city,
      capacity,
      type: type || 'Outdoor',
      contact_name,
      email,
      mobile,
      status: 'kyc_pending',
      next_step: 'upload_documents',
      dashboard_url: '/venue',
      welcome_whatsapp_sent: true,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: Platform Config (Admin) ────────────────────────
app.get('/api/admin/config', (c) => {
  return c.json({
    config: {
      default_ticket_cap: 10,
      business_ticket_cap: 50,
      enterprise_ticket_cap: 500,
      platform_fee_per_ticket: 20,
      gst_rate: 18,
      settlement_cycle_days: 5,
      kyc_required_above_tickets: 10,
      fraud_auto_block_threshold: 5,
      refund_window_full_hours: 48,
      refund_window_partial_hours: 24,
      supported_payment_methods: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
      whatsapp_enabled: true,
      sms_enabled: true,
      push_enabled: true,
      email_enabled: true,
      cities_active: 10,
      categories_active: 10,
      maintenance_mode: false
    },
    updated_at: new Date().toISOString()
  })
})

// ─── API: POS (On-ground Sales) ──────────────────────────
app.post('/api/pos/sale', async (c) => {
  const { event_id, items, payment_method, gate_id, operator_id } = await c.req.json().catch(() => ({}))
  if (!items || !items.length) return c.json({ error: 'items required' }, 400)

  const subtotal = items.reduce((s: number, i: any) => s + (i.price * i.qty), 0)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst
  const order_id = 'POS-' + Math.random().toString(36).substring(2, 9).toUpperCase()

  return c.json({
    success: true,
    sale: {
      order_id,
      event_id,
      items,
      subtotal,
      gst,
      total,
      payment_method: payment_method || 'upi',
      gate_id: gate_id || 'Gate 1',
      operator_id,
      receipt_url: `https://r2.indtix.com/receipts/${order_id}.pdf`,
      created_at: new Date().toISOString()
    }
  })
})

// ─── API: Waitlist ───────────────────────────────────────
app.post('/api/events/:id/waitlist', async (c) => {
  const event_id = c.req.param('id')
  const { name, email, mobile, tier_id } = await c.req.json().catch(() => ({}))
  if (!email) return c.json({ error: 'email required' }, 400)
  const waitlist_id = 'WL-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  return c.json({
    success: true,
    waitlist: {
      id: waitlist_id,
      event_id,
      tier_id: tier_id || 'ga',
      name,
      email,
      mobile,
      position: Math.floor(Math.random() * 50) + 1,
      estimated_availability: '24-48 hours if tickets become available',
      whatsapp_alert: true,
      email_alert: true,
      added_at: new Date().toISOString()
    }
  })
})

// ─── API: Loyalty / Wallet ───────────────────────────────
app.get('/api/wallet/:user_id', (c) => {
  const user_id = c.req.param('user_id')
  return c.json({
    user_id,
    balance: 250,
    currency: 'INDY Credits',
    expires: '2026-12-31',
    transactions: [
      { id: 'TXN001', type: 'credit', amount: 100, description: 'Referral bonus — friend booked', date: '2026-02-28' },
      { id: 'TXN002', type: 'credit', amount: 150, description: 'Welcome bonus', date: '2026-01-15' },
      { id: 'TXN003', type: 'debit', amount: 150, description: 'Used at checkout — NH7 Weekender', date: '2026-01-20' },
    ],
    referral_code: 'INDY-REF-'+user_id.slice(0,6).toUpperCase(),
    referral_link: `https://indtix.com/ref/${user_id.slice(0,6)}`,
    total_earned: 400,
    total_redeemed: 150
  })
})

app.post('/api/wallet/redeem', async (c) => {
  const { user_id, amount, booking_id } = await c.req.json().catch(() => ({}))
  if (!amount || amount <= 0) return c.json({ error: 'valid amount required' }, 400)
  if (amount > 250) return c.json({ error: 'Insufficient INDY Credits balance' }, 400)
  return c.json({
    success: true,
    redeemed: amount,
    new_balance: 250 - amount,
    booking_id,
    applied_at: new Date().toISOString()
  })
})

// ─── API: Referral ───────────────────────────────────────
app.post('/api/referral/validate', async (c) => {
  const { code } = await c.req.json().catch(() => ({}))
  if (!code) return c.json({ error: 'code required' }, 400)
  const valid = code.startsWith('INDY-REF-')
  return c.json({
    valid,
    code,
    reward_for_referrer: 100,
    reward_for_new_user: 100,
    currency: 'INDY Credits',
    expires: '2026-12-31',
    message: valid ? '🎁 Referral code valid! Both you and your friend get ₹100 INDY Credits.' : 'Invalid referral code.'
  })
})

// ─── API: Ticket Transfer ────────────────────────────────
app.post('/api/tickets/:id/transfer', async (c) => {
  const ticket_id = c.req.param('id')
  const { to_email, to_mobile } = await c.req.json().catch(() => ({}))
  return c.json({
    success: false,
    error: 'Tickets are non-transferable as per event organiser policy.',
    ticket_id,
    policy: 'Tickets on INDTIX are non-transferable. If you cannot attend, please cancel for a refund per our policy.',
    support_url: 'https://indtix.com/support'
  })
})

// ─── API: Organiser Dashboard Summary ───────────────────
app.get('/api/organiser/dashboard', (c) => {
  return c.json({
    organiser: {
      id: 'ORG-PERCEPT',
      name: 'Percept Live',
      kyc_status: 'verified',
      account_manager: 'Kavita Reddy'
    },
    stats: {
      total_events: 12,
      live_events: 3,
      draft_events: 2,
      total_tickets_sold: 42840,
      total_revenue: 124000000,
      pending_settlement: 4285000,
      avg_rating: 4.7
    },
    upcoming_events: [
      { id: 'e1', name: 'Sunburn Arena Mumbai', date: '2026-04-12', sold_pct: 72, tickets_sold: 3600, revenue: 5400000 },
      { id: 'e5', name: 'Diljit Dosanjh World Tour', date: '2026-05-10', sold_pct: 88, tickets_sold: 4400, revenue: 15400000 },
    ],
    recent_transactions: [
      { booking_id: 'BK-ABC123', event: 'Sunburn Arena', amount: 3584, timestamp: new Date(Date.now()-120000).toISOString() },
      { booking_id: 'BK-DEF456', event: 'Sunburn Arena', amount: 5992, timestamp: new Date(Date.now()-240000).toISOString() },
    ],
    updated_at: new Date().toISOString()
  })
})

// ─── API: Venue Dashboard Summary ───────────────────────
app.get('/api/venue/dashboard', (c) => {
  return c.json({
    venue: {
      id: 'VEN-MMRDA',
      name: 'MMRDA Grounds',
      city: 'Mumbai',
      kyc_status: 'verified',
      rating: 4.7,
      capacity: 50000
    },
    stats: {
      bookings_this_month: 3,
      revenue_this_month: 7500000,
      occupancy_rate: 84,
      upcoming_bookings: 2,
      pending_enquiries: 1
    },
    calendar_highlights: [
      { date: '2026-04-12', event: 'Sunburn Arena Mumbai', organiser: 'Percept Live', pax: 15000 },
      { date: '2026-05-10', event: 'Diljit Dosanjh Tour', organiser: 'BookMyShow Live', pax: 30000 },
    ],
    updated_at: new Date().toISOString()
  })
})

// ─── API: Event Manager Dashboard ───────────────────────
app.get('/api/event-manager/dashboard', (c) => {
  return c.json({
    event: {
      id: 'e1',
      name: 'Sunburn Arena Mumbai',
      date: '2026-04-12',
      venue: 'MMRDA Grounds',
      status: 'live'
    },
    checkin_live: {
      total_sold: 4200,
      checked_in: 2841,
      pct: 67.6,
      rate_per_min: 92,
      gates_active: 4
    },
    wristbands: {
      total_issued: 2400,
      led_active: 2397,
      zones: ['GA', 'PREM', 'VIP', 'ACCESSIBLE']
    },
    incidents_open: 2,
    tasks_pending: 7,
    team_online: 18,
    updated_at: new Date().toISOString()
  })
})

// ─── API: Platform Search ─────────────────────────────────
app.get('/api/search', (c) => {
  const q = c.req.query('q') || ''
  const type = c.req.query('type') || 'all'
  const query = q.toLowerCase()

  const events = query ? EVENTS_DATA.filter(e =>
    e.name.toLowerCase().includes(query) ||
    e.city.toLowerCase().includes(query) ||
    e.venue.toLowerCase().includes(query) ||
    e.category.toLowerCase().includes(query)
  ) : EVENTS_DATA.slice(0, 5)

  return c.json({
    query: q,
    results: {
      events: events.slice(0, 5),
      venues: query ? [{ id: 'v1', name: 'MMRDA Grounds', city: 'Mumbai', capacity: 50000 }] : [],
      organisers: query ? [{ id: 'o1', name: 'Percept Live', events: 12 }] : [],
    },
    total: events.length,
    suggestions: ['Sunburn Arena', 'NH7 Weekender', 'Lollapalooza India', 'IPL 2026'],
    ts: new Date().toISOString()
  })
})

// ─── API: Wristband Status ───────────────────────────────
app.get('/api/wristbands/status', (c) => {
  const event_id = c.req.query('event_id') || 'e1'
  return c.json({
    event_id,
    total_issued: 2400,
    zones: {
      GA: { issued: 1500, led_active: 1498, color: 'white', effect: 'pulse' },
      PREM: { issued: 600, led_active: 600, color: 'purple', effect: 'wave' },
      VIP: { issued: 250, led_active: 249, color: 'gold', effect: 'shimmer' },
      ACCESSIBLE: { issued: 50, led_active: 50, color: 'blue', effect: 'steady' },
    },
    controllers_online: 14,
    controllers_total: 14,
    latency_ms: 12,
    last_command: 'color_change',
    last_command_at: new Date(Date.now() - 30000).toISOString(),
    updated_at: new Date().toISOString()
  })
})

// ─── API: Admin KYC Queue ────────────────────────────────
app.get('/api/admin/kyc/queue', (c) => {
  return c.json({
    pending: [
      { id: 'KYC-001', entity: 'Oye Events Pvt Ltd', type: 'organiser', submitted: '2026-04-15T10:20:00Z', docs: ['GST', 'PAN', 'Bank'], status: 'pending' },
      { id: 'KYC-002', entity: 'Ravescape Productions', type: 'organiser', submitted: '2026-04-15T08:45:00Z', docs: ['GST', 'PAN', 'INC'], status: 'pending' },
      { id: 'KYC-003', entity: 'MMRDA Grounds', type: 'venue', submitted: '2026-04-14T16:30:00Z', docs: ['GST', 'NOC'], status: 'on_hold' },
    ],
    stats: { pending_orgs: 18, pending_venues: 12, avg_review_time_hrs: 22, approved_today: 5 },
    updated_at: new Date().toISOString()
  })
})

// ─── API: Admin Fraud Queue ──────────────────────────────
app.get('/api/admin/fraud/alerts', (c) => {
  return c.json({
    alerts: [
      { id: 'FRAUD-001', type: 'velocity', description: '15 bookings in 8 min from IP 192.168.1.x', risk: 'high', amount: 67500, user_id: 'USR-889241', flagged_at: new Date(Date.now()-3600000).toISOString() },
      { id: 'FRAUD-002', type: 'card_testing', description: 'Multiple low-value transactions from same device', risk: 'medium', amount: 1500, user_id: 'USR-442819', flagged_at: new Date(Date.now()-7200000).toISOString() },
      { id: 'FRAUD-003', type: 'identity', description: 'Mismatched name on KYC and payment method', risk: 'low', amount: 4500, user_id: 'USR-119234', flagged_at: new Date(Date.now()-10800000).toISOString() },
    ],
    stats: { high_risk: 1, medium_risk: 1, low_risk: 1, blocked_today: 3, amount_saved: 73500 },
    updated_at: new Date().toISOString()
  })
})

// ─── API: Affiliate / Commission ─────────────────────────
app.get('/api/affiliate/stats', (c) => {
  return c.json({
    affiliates: [
      { id: 'AFF-001', name: 'MumbaiEventsBlog', clicks: 8420, conversions: 284, commission: 28400, status: 'active' },
      { id: 'AFF-002', name: 'IndiaFestivals.in', clicks: 5210, conversions: 187, commission: 18700, status: 'active' },
    ],
    total_commission_paid: 47100,
    commission_rate_pct: 2,
    updated_at: new Date().toISOString()
  })
})

// ─── Update health to reflect 58 endpoints ───────────────
export default app
