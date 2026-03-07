import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// ─── Middleware ───────────────────────────────────────────
app.use('*', cors())

// ─── Portal Routes ─────────────────────────────────────────
// Cloudflare Pages serves static HTML files with .html extension stripped
// /fan.html is served at /fan by Cloudflare Pages automatically
// We serve the fan portal at / by redirecting to /fan
app.get('/', (c) => c.redirect('/fan'))

// Portal hub listing all portals
// /portals.html is served at /portals by Cloudflare Pages automatically

// ─── API Routes ───────────────────────────────────────────
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', platform: 'INDTIX', version: '1.0.0', ts: new Date().toISOString() })
})

app.get('/api/events', (c) => {
  return c.json({
    events: [
      { id: 'e1', name: 'Sunburn Arena – Mumbai', category: 'Music', city: 'Mumbai', date: '2026-04-12', price: 1499, venue: 'MMRDA Grounds', image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400' },
      { id: 'e2', name: 'NH7 Weekender', category: 'Festival', city: 'Pune', date: '2026-05-03', price: 2499, venue: 'Mahalunge Grounds', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400' },
      { id: 'e3', name: 'Zakir Hussain Live', category: 'Classical', city: 'Delhi', date: '2026-04-20', price: 999, venue: 'Siri Fort Auditorium', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400' },
      { id: 'e4', name: 'IPL: MI vs CSK', category: 'Sports', city: 'Mumbai', date: '2026-04-18', price: 1200, venue: 'Wankhede Stadium', image: 'https://images.unsplash.com/photo-1540747913346-19212a4b733d?w=400' },
      { id: 'e5', name: 'Diljit Dosanjh World Tour', category: 'Punjabi', city: 'Bangalore', date: '2026-05-10', price: 3499, venue: 'Palace Grounds', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
      { id: 'e6', name: 'TEDx Mumbai 2026', category: 'Conference', city: 'Mumbai', date: '2026-04-25', price: 2000, venue: 'Nehru Centre', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
    ]
  })
})

app.post('/api/book', async (c) => {
  const body = await c.req.json()
  return c.json({
    success: true,
    bookingId: 'BK' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    message: 'Booking confirmed',
    ...body
  })
})

app.get('/api/cities', (c) => {
  return c.json({
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Goa']
  })
})

export default app
