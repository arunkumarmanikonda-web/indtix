import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { venuePortalHTML } from './venue'
import { eventManagerHTML } from './eventmanager'
import { superAdminHTML } from './superadmin'
import { opsPortalHTML, architectureHTML } from './arch'

const app = new Hono()

app.use('*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ─── Main Fan Portal ───
app.get('/', (c) => c.html(fanPortalHTML()))

// ─── Organiser Portal ───
app.get('/organiser', (c) => c.html(organiserPortalHTML()))

// ─── Venue Portal ───
app.get('/venue', (c) => c.html(venuePortalHTML()))

// ─── Event Manager Portal ───
app.get('/event-manager', (c) => c.html(eventManagerHTML()))

// ─── Super Admin / ERP ───
app.get('/admin', (c) => c.html(superAdminHTML()))

// ─── On-Ground Ops / POS ───
app.get('/ops', (c) => c.html(opsPortalHTML()))

// ─── Architecture Doc ───
app.get('/architecture', (c) => c.html(architectureHTML()))

// ─── API stubs ───
app.get('/api/health', (c) => c.json({ status: 'ok', platform: 'INDTIX', version: '1.0.0' }))
app.get('/api/events', (c) => c.json({ events: sampleEvents() }))
app.post('/api/book', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ success: true, bookingId: 'BK' + Date.now(), ...body })
})

// ─── Sample Data ───
function sampleEvents() {
  return [
    { id: 'E001', name: 'Sunburn Arena Mumbai', date: '2025-04-15', venue: 'NSCI Dome', city: 'Mumbai', price: 1499, category: 'Music', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600' },
    { id: 'E002', name: 'NH7 Weekender', date: '2025-05-20', venue: 'Mahalaxmi Grounds', city: 'Pune', price: 2999, category: 'Music', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600' },
    { id: 'E003', name: 'Comedy Central Live', date: '2025-04-28', venue: 'JW Marriott Ballroom', city: 'Bengaluru', price: 899, category: 'Comedy', image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600' },
    { id: 'E004', name: 'Tech Summit 2025', date: '2025-06-10', venue: 'HITEX Exhibition Centre', city: 'Hyderabad', price: 4999, category: 'Conference', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
    { id: 'E005', name: 'Lollapalooza India', date: '2025-03-22', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: 5999, category: 'Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600' },
    { id: 'E006', name: 'BITS Pilani Oasis', date: '2025-10-01', venue: 'BITS Campus', city: 'Pilani', price: 299, category: 'College Fest', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600' },
  ]
}

// ═══════════════════════════════════════════════════════════════════
// FAN PORTAL
// ═══════════════════════════════════════════════════════════════════
function fanPortalHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>INDTIX – Experience More</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root {
  --brand: #6C3CF7;
  --brand2: #FF3CAC;
  --brand3: #00F5C4;
  --dark: #080B14;
  --dark2: #0F1320;
  --dark3: #161B2E;
  --card: #1A2035;
  --border: rgba(108,60,247,0.2);
  --text: #E8EAFF;
  --muted: #8B93B8;
  --white: #ffffff;
  --grad1: linear-gradient(135deg, #6C3CF7 0%, #FF3CAC 100%);
  --grad2: linear-gradient(135deg, #00F5C4 0%, #6C3CF7 100%);
  --grad3: linear-gradient(180deg, #080B14 0%, #0F1320 100%);
  --glow: 0 0 40px rgba(108,60,247,0.3);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--dark);color:var(--text);font-family:'Inter',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--dark2)}
::-webkit-scrollbar-thumb{background:var(--brand);border-radius:2px}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(8,11,20,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1400px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.logo-mark{width:36px;height:36px;background:var(--grad1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:#fff;font-family:'Space Grotesk',sans-serif;letter-spacing:-1px}
.logo-text{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;color:#fff;letter-spacing:-0.5px}
.logo-text span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-links a{color:var(--muted);text-decoration:none;padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;transition:all 0.2s}
.nav-links a:hover{color:var(--white);background:rgba(108,60,247,0.15)}
.nav-actions{display:flex;align-items:center;gap:10px}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text);padding:8px 18px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif}
.btn-ghost:hover{border-color:var(--brand);color:var(--brand)}
.btn-primary{background:var(--grad1);border:none;color:#fff;padding:9px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;box-shadow:0 4px 20px rgba(108,60,247,0.35)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(108,60,247,0.5)}
.city-pill{display:flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--border);padding:6px 14px;border-radius:20px;font-size:13px;color:var(--muted);cursor:pointer;transition:all 0.2s}
.city-pill:hover{border-color:var(--brand);color:var(--brand)}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding-top:64px}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 30%, rgba(108,60,247,0.18) 0%, transparent 70%)}
.hero-particles{position:absolute;inset:0;overflow:hidden}
.particle{position:absolute;border-radius:50%;animation:float linear infinite}
@keyframes float{0%{transform:translateY(100vh) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100px) rotate(720deg);opacity:0}}
.hero-content{max-width:1400px;margin:0 auto;padding:80px 24px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(108,60,247,0.15);border:1px solid rgba(108,60,247,0.35);padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;color:var(--brand3);text-transform:uppercase;letter-spacing:1px;margin-bottom:24px}
.hero-badge i{font-size:10px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
h1.hero-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(42px,6vw,72px);font-weight:700;line-height:1.08;letter-spacing:-2px;margin-bottom:24px}
h1.hero-title span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-sub{font-size:18px;color:var(--muted);line-height:1.7;margin-bottom:36px;max-width:480px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.btn-xl{padding:14px 32px;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;transition:all 0.25s;font-family:'Inter',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.btn-xl-primary{background:var(--grad1);border:none;color:#fff;box-shadow:0 8px 32px rgba(108,60,247,0.4)}
.btn-xl-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(108,60,247,0.55)}
.btn-xl-ghost{background:transparent;border:1.5px solid var(--border);color:var(--text)}
.btn-xl-ghost:hover{border-color:var(--brand);color:var(--brand);transform:translateY(-1px)}
.hero-stats{display:flex;gap:32px;margin-top:40px}
.stat{text-align:left}
.stat-num{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{font-size:12px;color:var(--muted);margin-top:2px}
.hero-visual{position:relative}
.hero-card-stack{position:relative;height:500px}
.event-card-hero{position:absolute;background:var(--card);border:1px solid var(--border);border-radius:20px;overflow:hidden;transition:all 0.3s;cursor:pointer}
.event-card-hero:hover{transform:scale(1.02);box-shadow:var(--glow)}
.ec1{width:300px;top:0;right:60px;z-index:3;transform:rotate(2deg)}
.ec2{width:280px;top:80px;right:0;z-index:2;transform:rotate(-3deg)}
.ec3{width:260px;top:160px;right:120px;z-index:1;transform:rotate(1deg)}
.ec-img{width:100%;height:150px;object-fit:cover}
.ec-body{padding:16px}
.ec-cat{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--brand3);font-weight:600}
.ec-name{font-size:15px;font-weight:700;margin:4px 0}
.ec-meta{font-size:12px;color:var(--muted);display:flex;gap:12px;align-items:center}
.ec-price{font-size:16px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.live-badge{position:absolute;top:12px;left:12px;background:#FF3CAC;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;display:flex;align-items:center;gap:4px}
.live-dot{width:5px;height:5px;background:#fff;border-radius:50%;animation:pulse 1s infinite}

/* SEARCH BAR */
.search-section{background:var(--dark2);padding:40px 24px}
.search-wrap{max-width:1000px;margin:0 auto}
.search-box{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:8px 8px 8px 24px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 40px rgba(0,0,0,0.3)}
.search-box input{flex:1;background:transparent;border:none;outline:none;font-size:16px;color:var(--text);font-family:'Inter',sans-serif}
.search-box input::placeholder{color:var(--muted)}
.search-filters{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.filter-chip{background:var(--dark3);border:1px solid var(--border);color:var(--muted);padding:6px 16px;border-radius:20px;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif}
.filter-chip:hover,.filter-chip.active{background:rgba(108,60,247,0.2);border-color:var(--brand);color:var(--brand)}

/* SECTIONS */
section{padding:80px 24px}
.section-inner{max-width:1400px;margin:0 auto}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px}
.section-tag{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:var(--brand);margin-bottom:8px}
h2.section-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(28px,4vw,42px);font-weight:700;letter-spacing:-1px}
.see-all{color:var(--brand);text-decoration:none;font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px;transition:all 0.2s}
.see-all:hover{gap:10px}

/* EVENT CARDS GRID */
.events-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
.event-card{background:var(--card);border:1px solid var(--border);border-radius:20px;overflow:hidden;cursor:pointer;transition:all 0.3s;text-decoration:none;color:inherit;display:block}
.event-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(108,60,247,0.2);border-color:rgba(108,60,247,0.4)}
.card-img-wrap{position:relative;overflow:hidden}
.card-img{width:100%;height:200px;object-fit:cover;transition:transform 0.4s}
.event-card:hover .card-img{transform:scale(1.05)}
.card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,11,20,0.8) 0%,transparent 60%)}
.card-badge{position:absolute;top:14px;left:14px;background:rgba(8,11,20,0.7);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:11px;padding:4px 10px;border-radius:20px;font-weight:600}
.card-wish{position:absolute;top:12px;right:12px;width:34px;height:34px;background:rgba(8,11,20,0.7);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px;cursor:pointer;transition:all 0.2s}
.card-wish:hover{background:rgba(255,60,172,0.2);border-color:var(--brand2);color:var(--brand2)}
.card-body{padding:18px}
.card-cat{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--brand3);margin-bottom:6px}
.card-name{font-size:18px;font-weight:700;margin-bottom:8px;line-height:1.3}
.card-info{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.card-info span{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:6px}
.card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06)}
.card-price{font-size:20px;font-weight:800;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.card-price span{font-size:12px;font-weight:400;color:var(--muted)}
.btn-book{background:var(--grad1);border:none;color:#fff;padding:8px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif}
.btn-book:hover{transform:scale(1.05)}

/* CATEGORIES */
.cats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
.cat-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px 16px;text-align:center;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden}
.cat-card::before{content:'';position:absolute;inset:0;background:var(--grad1);opacity:0;transition:opacity 0.3s}
.cat-card:hover::before{opacity:0.1}
.cat-card:hover{transform:translateY(-4px);border-color:var(--brand)}
.cat-icon{font-size:32px;margin-bottom:10px;display:block}
.cat-name{font-size:14px;font-weight:600}
.cat-count{font-size:11px;color:var(--muted);margin-top:3px}

/* CITIES */
.cities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}
.city-card{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;height:120px;transition:all 0.3s}
.city-card:hover{transform:scale(1.03)}
.city-img{width:100%;height:100%;object-fit:cover}
.city-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,11,20,0.8),transparent)}
.city-name{position:absolute;bottom:12px;left:14px;font-size:16px;font-weight:700}
.city-events{position:absolute;bottom:32px;left:14px;font-size:11px;color:var(--brand3)}

/* WHY INDTIX */
.why-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px}
.why-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;position:relative;overflow:hidden;transition:all 0.3s}
.why-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad1);opacity:0;transition:opacity 0.3s}
.why-card:hover::after{opacity:1}
.why-card:hover{transform:translateY(-4px)}
.why-icon{width:48px;height:48px;border-radius:12px;background:rgba(108,60,247,0.15);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}
.why-title{font-size:17px;font-weight:700;margin-bottom:8px}
.why-desc{font-size:14px;color:var(--muted);line-height:1.6}

/* PORTALS NAV */
.portals-section{background:var(--dark3);padding:60px 24px}
.portals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;max-width:1400px;margin:32px auto 0}
.portal-link{display:flex;flex-direction:column;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px 16px;text-decoration:none;color:var(--text);transition:all 0.3s;text-align:center}
.portal-link:hover{border-color:var(--brand);transform:translateY(-3px);background:rgba(108,60,247,0.08)}
.portal-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
.portal-name{font-size:14px;font-weight:600}
.portal-desc{font-size:11px;color:var(--muted)}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:9999;display:none;align-items:center;justify-content:center;padding:24px}
.modal-overlay.active{display:flex}
.modal{background:var(--card);border:1px solid var(--border);border-radius:24px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;position:relative}
.modal-close{position:absolute;top:16px;right:16px;width:36px;height:36px;background:rgba(255,255,255,0.1);border:none;border-radius:50%;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;z-index:1}
.modal-close:hover{background:rgba(255,60,172,0.3)}
.modal-img{width:100%;height:300px;object-fit:cover;border-radius:24px 24px 0 0}
.modal-body{padding:28px}
.modal-title{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;margin-bottom:12px}
.modal-meta{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:20px}
.meta-item{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:14px}
.meta-item i{color:var(--brand)}
.ticket-section{background:var(--dark3);border-radius:16px;padding:20px;margin:20px 0}
.ticket-type{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
.ticket-type:last-child{border-bottom:none}
.tt-info{flex:1}
.tt-name{font-size:15px;font-weight:600}
.tt-desc{font-size:12px;color:var(--muted)}
.tt-price{font-size:18px;font-weight:800;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.qty-ctrl{display:flex;align-items:center;gap:10px}
.qty-btn{width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:var(--dark);color:var(--text);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
.qty-btn:hover{border-color:var(--brand);background:rgba(108,60,247,0.2)}
.qty-num{font-size:16px;font-weight:700;min-width:20px;text-align:center}
.modal-footer{display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid var(--border)}
.total-price{font-size:24px;font-weight:800;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}

/* SEAT MAP */
.seat-map-container{background:var(--dark);border-radius:16px;padding:20px;overflow-x:auto;margin:20px 0}
.stage{background:linear-gradient(135deg,rgba(108,60,247,0.3),rgba(255,60,172,0.3));border:1px solid rgba(108,60,247,0.4);border-radius:8px;text-align:center;padding:10px;font-size:12px;font-weight:600;color:var(--brand);margin-bottom:20px;letter-spacing:2px}
.seat-rows{display:flex;flex-direction:column;gap:6px;align-items:center}
.seat-row{display:flex;align-items:center;gap:6px}
.row-label{font-size:10px;color:var(--muted);width:20px;text-align:right}
.seat{width:22px;height:22px;border-radius:5px;cursor:pointer;transition:all 0.15s;border:none;font-size:9px;font-weight:600}
.seat.available{background:rgba(108,60,247,0.3);color:var(--brand)}
.seat.available:hover{background:var(--brand);color:#fff;transform:scale(1.2)}
.seat.selected{background:var(--brand2);color:#fff}
.seat.booked{background:var(--dark3);color:var(--muted);cursor:not-allowed}
.seat.vip{background:rgba(0,245,196,0.2);color:var(--brand3)}
.seat.vip:hover{background:var(--brand3);color:var(--dark)}
.seat-legend{display:flex;gap:16px;margin-top:16px;flex-wrap:wrap;justify-content:center}
.legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.legend-dot{width:16px;height:16px;border-radius:4px}

/* CHATBOT */
.chatbot-fab{position:fixed;bottom:28px;right:28px;width:56px;height:56px;background:var(--grad1);border-radius:50%;border:none;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 8px 32px rgba(108,60,247,0.5);z-index:998;display:flex;align-items:center;justify-content:center;transition:all 0.3s}
.chatbot-fab:hover{transform:scale(1.1)}
.chatbot-window{position:fixed;bottom:96px;right:28px;width:360px;background:var(--card);border:1px solid var(--border);border-radius:20px;z-index:997;display:none;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.5);overflow:hidden}
.chatbot-window.open{display:flex}
.chat-header{background:var(--grad1);padding:16px 20px;display:flex;align-items:center;gap:12px}
.chat-avatar{width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}
.chat-title{font-weight:700;font-size:15px}
.chat-status{font-size:11px;opacity:0.8}
.chat-close{margin-left:auto;background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer}
.chat-messages{flex:1;padding:16px;overflow-y:auto;max-height:300px;display:flex;flex-direction:column;gap:10px}
.msg{max-width:80%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5}
.msg.bot{background:var(--dark3);color:var(--text);align-self:flex-start;border-radius:4px 14px 14px 14px}
.msg.user{background:var(--grad1);color:#fff;align-self:flex-end;border-radius:14px 4px 14px 14px}
.chat-input-row{padding:12px;border-top:1px solid var(--border);display:flex;gap:8px}
.chat-input{flex:1;background:var(--dark);border:1px solid var(--border);border-radius:10px;padding:8px 14px;color:var(--text);font-size:13px;outline:none;font-family:'Inter',sans-serif}
.chat-send{background:var(--grad1);border:none;border-radius:10px;padding:8px 14px;color:#fff;cursor:pointer;font-size:14px}
.chat-suggestions{padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px}
.chat-sug{background:var(--dark3);border:1px solid var(--border);color:var(--muted);padding:5px 10px;border-radius:20px;font-size:11px;cursor:pointer;transition:all 0.2s}
.chat-sug:hover{border-color:var(--brand);color:var(--brand)}

/* TOAST */
.toast-container{position:fixed;top:80px;right:24px;z-index:9998;display:flex;flex-direction:column;gap:8px}
.toast{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 20px;font-size:14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.3);animation:slideIn 0.3s ease;min-width:280px}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
.toast.success{border-color:var(--brand3);color:var(--brand3)}
.toast.error{border-color:var(--brand2);color:var(--brand2)}

/* FOOTER */
footer{background:var(--dark3);border-top:1px solid var(--border);padding:60px 24px 30px}
.footer-inner{max-width:1400px;margin:0 auto}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.footer-brand .logo-text{font-size:24px}
.footer-desc{color:var(--muted);font-size:14px;line-height:1.7;margin-top:12px;max-width:280px}
.footer-socials{display:flex;gap:10px;margin-top:20px}
.social-btn{width:36px;height:36px;background:var(--card);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;transition:all 0.2s;font-size:14px}
.social-btn:hover{border-color:var(--brand);color:var(--brand)}
.footer-col h4{font-size:14px;font-weight:700;margin-bottom:16px;color:var(--white)}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.footer-col ul a{color:var(--muted);text-decoration:none;font-size:14px;transition:color 0.2s}
.footer-col ul a:hover{color:var(--brand)}
.footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:gap}
.footer-copy{font-size:13px;color:var(--muted)}
.footer-legal{display:flex;gap:20px}
.footer-legal a{font-size:12px;color:var(--muted);text-decoration:none}
.footer-legal a:hover{color:var(--brand)}

/* RESPONSIVE */
@media(max-width:768px){
  .hero-content{grid-template-columns:1fr;gap:40px}
  .hero-visual{display:none}
  .footer-grid{grid-template-columns:1fr 1fr}
  .nav-links{display:none}
}
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <div class="logo-mark">IX</div>
      <span class="logo-text">IND<span>TIX</span></span>
    </a>
    <div class="nav-links">
      <a href="#events">Events</a>
      <a href="#categories">Categories</a>
      <a href="#cities">Cities</a>
      <a href="#offers">Offers</a>
    </div>
    <div class="nav-actions">
      <div class="city-pill" onclick="showCityPicker()">
        <i class="fas fa-location-dot"></i>
        <span id="selectedCity">Mumbai</span>
        <i class="fas fa-chevron-down" style="font-size:10px"></i>
      </div>
      <button class="btn-ghost" onclick="openLoginModal()">Sign In</button>
      <button class="btn-primary" onclick="openSignupModal()"><i class="fas fa-ticket"></i> Get Tickets</button>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-particles" id="particles"></div>
  <div class="hero-content">
    <div>
      <div class="hero-badge"><i class="fas fa-fire"></i> India's Next-Gen Event Platform</div>
      <h1 class="hero-title">Your Ticket to<br><span>Unforgettable</span><br>Experiences</h1>
      <p class="hero-sub">Discover concerts, festivals, comedy shows, sports, theatre, and more — powered by AI, built for the youth of India.</p>
      <div class="hero-cta">
        <a href="#events" class="btn-xl btn-xl-primary"><i class="fas fa-compass"></i> Explore Events</a>
        <a href="#" class="btn-xl btn-xl-ghost" onclick="openSignupModal()"><i class="fas fa-user-plus"></i> Join Free</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><div class="stat-num">50K+</div><div class="stat-label">Events Listed</div></div>
        <div class="stat"><div class="stat-num">2M+</div><div class="stat-label">Happy Fans</div></div>
        <div class="stat"><div class="stat-num">500+</div><div class="stat-label">Partner Venues</div></div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-card-stack">
        <div class="event-card-hero ec1">
          <div class="live-badge"><div class="live-dot"></div>LIVE NOW</div>
          <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400" class="ec-img" alt="Event">
          <div class="ec-body">
            <div class="ec-cat">🎵 Music Festival</div>
            <div class="ec-name">Sunburn Arena Mumbai</div>
            <div class="ec-meta"><span>📅 Apr 15</span><span class="ec-price">₹1,499</span></div>
          </div>
        </div>
        <div class="event-card-hero ec2">
          <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400" class="ec-img" alt="Event">
          <div class="ec-body">
            <div class="ec-cat">🎪 Outdoor Festival</div>
            <div class="ec-name">NH7 Weekender Pune</div>
            <div class="ec-meta"><span>📅 May 20</span><span class="ec-price">₹2,999</span></div>
          </div>
        </div>
        <div class="event-card-hero ec3">
          <img src="https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400" class="ec-img" alt="Event">
          <div class="ec-body">
            <div class="ec-cat">😂 Comedy</div>
            <div class="ec-name">Comedy Central Live</div>
            <div class="ec-meta"><span>📅 Apr 28</span><span class="ec-price">₹899</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SEARCH -->
<div class="search-section">
  <div class="search-wrap">
    <div class="search-box">
      <i class="fas fa-search" style="color:var(--muted);font-size:18px"></i>
      <input type="text" placeholder="Search events, artists, venues, cities..." id="searchInput" oninput="handleSearch(this.value)">
      <button class="btn-primary" onclick="doSearch()"><i class="fas fa-search"></i> Search</button>
    </div>
    <div class="search-filters">
      <button class="filter-chip active" onclick="filterBy(this,'all')">All Events</button>
      <button class="filter-chip" onclick="filterBy(this,'music')">🎵 Music</button>
      <button class="filter-chip" onclick="filterBy(this,'comedy')">😂 Comedy</button>
      <button class="filter-chip" onclick="filterBy(this,'sports')">⚽ Sports</button>
      <button class="filter-chip" onclick="filterBy(this,'theatre')">🎭 Theatre</button>
      <button class="filter-chip" onclick="filterBy(this,'workshop')">🎓 Workshops</button>
      <button class="filter-chip" onclick="filterBy(this,'festival')">🎪 Festivals</button>
      <button class="filter-chip" onclick="filterBy(this,'conference')">💼 Conferences</button>
      <button class="filter-chip" onclick="filterBy(this,'nightlife')">🌙 Nightlife</button>
    </div>
  </div>
</div>

<!-- EVENTS SECTION -->
<section id="events">
  <div class="section-inner">
    <div class="section-header">
      <div>
        <div class="section-tag">🔥 Trending</div>
        <h2 class="section-title">Events You'll Love</h2>
      </div>
      <a href="#" class="see-all">View All <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="events-grid" id="eventsGrid"></div>
  </div>
</section>

<!-- CATEGORIES -->
<section id="categories" style="background:var(--dark2)">
  <div class="section-inner">
    <div class="section-header">
      <div>
        <div class="section-tag">🎯 Browse</div>
        <h2 class="section-title">Explore by Category</h2>
      </div>
    </div>
    <div class="cats-grid">
      <div class="cat-card" onclick="filterCategory('Music')"><span class="cat-icon">🎵</span><div class="cat-name">Music & Concerts</div><div class="cat-count">1,240 events</div></div>
      <div class="cat-card" onclick="filterCategory('Comedy')"><span class="cat-icon">😂</span><div class="cat-name">Comedy & Stand-up</div><div class="cat-count">340 events</div></div>
      <div class="cat-card" onclick="filterCategory('Sports')"><span class="cat-icon">⚽</span><div class="cat-name">Sports & Fitness</div><div class="cat-count">520 events</div></div>
      <div class="cat-card" onclick="filterCategory('Theatre')"><span class="cat-icon">🎭</span><div class="cat-name">Theatre & Arts</div><div class="cat-count">180 events</div></div>
      <div class="cat-card" onclick="filterCategory('Festival')"><span class="cat-icon">🎪</span><div class="cat-name">Festivals & Fairs</div><div class="cat-count">90 events</div></div>
      <div class="cat-card" onclick="filterCategory('Conference')"><span class="cat-icon">💼</span><div class="cat-name">Conferences</div><div class="cat-count">410 events</div></div>
      <div class="cat-card" onclick="filterCategory('Workshop')"><span class="cat-icon">🎓</span><div class="cat-name">Workshops</div><div class="cat-count">650 events</div></div>
      <div class="cat-card" onclick="filterCategory('Nightlife')"><span class="cat-icon">🌙</span><div class="cat-name">Nightlife & Clubs</div><div class="cat-count">210 events</div></div>
    </div>
  </div>
</section>

<!-- CITIES -->
<section id="cities">
  <div class="section-inner">
    <div class="section-header">
      <div>
        <div class="section-tag">📍 Locations</div>
        <h2 class="section-title">Events Near You</h2>
      </div>
    </div>
    <div class="cities-grid">
      <div class="city-card" onclick="selectCity('Mumbai')"><img src="https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400" class="city-img" alt="Mumbai"><div class="city-overlay"></div><div class="city-events">1,240 events</div><div class="city-name">Mumbai</div></div>
      <div class="city-card" onclick="selectCity('Delhi')"><img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400" class="city-img" alt="Delhi"><div class="city-overlay"></div><div class="city-events">980 events</div><div class="city-name">Delhi</div></div>
      <div class="city-card" onclick="selectCity('Bengaluru')"><img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400" class="city-img" alt="Bengaluru"><div class="city-overlay"></div><div class="city-events">870 events</div><div class="city-name">Bengaluru</div></div>
      <div class="city-card" onclick="selectCity('Pune')"><img src="https://images.unsplash.com/photo-1567878729230-0a2d5c1b9b36?w=400" class="city-img" alt="Pune"><div class="city-overlay"></div><div class="city-events">540 events</div><div class="city-name">Pune</div></div>
      <div class="city-card" onclick="selectCity('Hyderabad')"><img src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400" class="city-img" alt="Hyderabad"><div class="city-overlay"></div><div class="city-events">460 events</div><div class="city-name">Hyderabad</div></div>
      <div class="city-card" onclick="selectCity('Chennai')"><img src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400" class="city-img" alt="Chennai"><div class="city-overlay"></div><div class="city-events">380 events</div><div class="city-name">Chennai</div></div>
    </div>
  </div>
</section>

<!-- WHY INDTIX -->
<section style="background:var(--dark2)" id="offers">
  <div class="section-inner">
    <div class="section-header">
      <div>
        <div class="section-tag">💡 Why Us</div>
        <h2 class="section-title">Built Different. Built Better.</h2>
      </div>
    </div>
    <div class="why-grid">
      <div class="why-card"><div class="why-icon">🎟️</div><div class="why-title">Instant Digital Tickets</div><div class="why-desc">QR-code entry, NFC wristbands, and LED band integration for seamless on-ground access.</div></div>
      <div class="why-card"><div class="why-icon">🤖</div><div class="why-title">AI-Powered Discovery</div><div class="why-desc">Smart recommendations based on your taste, location, and browsing history.</div></div>
      <div class="why-card"><div class="why-icon">💺</div><div class="why-title">Deep Seat Selection</div><div class="why-desc">Interactive seat maps with real-time availability, 3D venue views, and accessibility filters.</div></div>
      <div class="why-card"><div class="why-icon">🍕</div><div class="why-title">Pre-Order F&B + Merch</div><div class="why-desc">Skip the queue — order food, beverages, and merchandise right from your ticket.</div></div>
      <div class="why-card"><div class="why-icon">🔒</div><div class="why-title">Bank-Grade Security</div><div class="why-desc">End-to-end encryption, PCI-DSS compliant payments, and fraud detection.</div></div>
      <div class="why-card"><div class="why-icon">📲</div><div class="why-title">WhatsApp + Email</div><div class="why-desc">Get your tickets, reminders, and updates directly on WhatsApp or email — no app download needed.</div></div>
      <div class="why-card"><div class="why-icon">💸</div><div class="why-title">Transparent Pricing</div><div class="why-desc">No hidden fees. GST-accurate invoicing, multiple payment methods, EMI options.</div></div>
      <div class="why-card"><div class="why-icon">🌍</div><div class="why-title">Multi-City Coverage</div><div class="why-desc">50+ cities, 500+ venues, 50,000+ events. India's most comprehensive event discovery platform.</div></div>
    </div>
  </div>
</section>

<!-- PORTALS SECTION -->
<div class="portals-section">
  <div style="max-width:1400px;margin:0 auto;text-align:center">
    <div class="section-tag" style="margin-bottom:8px">🔗 Platform Portals</div>
    <h2 class="section-title">Access Your Portal</h2>
    <p style="color:var(--muted);margin-top:8px">INDTIX powers every stakeholder in the event ecosystem</p>
  </div>
  <div class="portals-grid">
    <a href="/" class="portal-link"><div class="portal-icon" style="background:rgba(108,60,247,0.2)">🎫</div><div class="portal-name">Fan Portal</div><div class="portal-desc">Discover & Book Events</div></a>
    <a href="/organiser" class="portal-link"><div class="portal-icon" style="background:rgba(255,60,172,0.2)">🎪</div><div class="portal-name">Organiser Portal</div><div class="portal-desc">Create & Manage Events</div></a>
    <a href="/venue" class="portal-link"><div class="portal-icon" style="background:rgba(0,245,196,0.2)">🏟️</div><div class="portal-name">Venue Portal</div><div class="portal-desc">List & Manage Venues</div></a>
    <a href="/event-manager" class="portal-link"><div class="portal-icon" style="background:rgba(255,180,0,0.2)">📋</div><div class="portal-name">Event Manager</div><div class="portal-desc">Ops & On-Day Control</div></a>
    <a href="/admin" class="portal-link"><div class="portal-icon" style="background:rgba(255,100,100,0.2)">⚙️</div><div class="portal-name">Super Admin / ERP</div><div class="portal-desc">Platform Command Centre</div></a>
    <a href="/ops" class="portal-link"><div class="portal-icon" style="background:rgba(100,200,255,0.2)">📱</div><div class="portal-name">On-Ground Ops / POS</div><div class="portal-desc">Scanner & Point of Sale</div></a>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo"><div class="logo-mark">IX</div><span class="logo-text" style="font-size:22px">IND<span>TIX</span></span></div>
        <p class="footer-desc">India's next-generation event commerce platform. Discover, book, and experience more — powered by AI, built for the youth.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-whatsapp"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
      <div class="footer-col"><h4>Discover</h4><ul>
        <li><a href="#">Music Events</a></li><li><a href="#">Comedy Shows</a></li>
        <li><a href="#">Sports Events</a></li><li><a href="#">Theatre</a></li>
        <li><a href="#">Workshops</a></li><li><a href="#">Nightlife</a></li>
      </ul></div>
      <div class="footer-col"><h4>Platform</h4><ul>
        <li><a href="/organiser">Organise an Event</a></li>
        <li><a href="/venue">List Your Venue</a></li>
        <li><a href="/architecture">Architecture Docs</a></li>
        <li><a href="/admin">Admin Portal</a></li>
        <li><a href="/ops">POS & Scanner</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="#">About Oye Imagine Pvt Ltd</a></li>
        <li><a href="#">Careers</a></li><li><a href="#">Press</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">GST: 27AABCO1234A1Z5</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2025 Oye Imagine Private Limited. All rights reserved. CIN: U74999MH2024PTC000000</div>
      <div class="footer-legal">
        <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookie Policy</a><a href="#">Grievance</a>
      </div>
    </div>
  </div>
</footer>

<!-- EVENT MODAL -->
<div class="modal-overlay" id="eventModal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('eventModal')"><i class="fas fa-times"></i></button>
    <img id="modalImg" src="" class="modal-img" alt="Event">
    <div class="modal-body">
      <div id="modalCat" class="card-cat"></div>
      <div class="modal-title" id="modalTitle"></div>
      <div class="modal-meta">
        <div class="meta-item"><i class="fas fa-calendar"></i><span id="modalDate"></span></div>
        <div class="meta-item"><i class="fas fa-location-dot"></i><span id="modalVenue"></span></div>
        <div class="meta-item"><i class="fas fa-city"></i><span id="modalCity"></span></div>
      </div>
      <div class="ticket-section">
        <h4 style="font-size:14px;color:var(--muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">Select Tickets</h4>
        <div class="ticket-type"><div class="tt-info"><div class="tt-name">General Admission</div><div class="tt-desc">Open floor, standing area</div></div><div class="tt-price" id="gaPrice"></div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('ga',-1)">−</button><span class="qty-num" id="gaQty">0</span><button class="qty-btn" onclick="changeQty('ga',1)">+</button></div></div>
        <div class="ticket-type"><div class="tt-info"><div class="tt-name">Premium Standing</div><div class="tt-desc">Premium floor, closer to stage</div></div><div class="tt-price" id="premPrice"></div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('prem',-1)">−</button><span class="qty-num" id="premQty">0</span><button class="qty-btn" onclick="changeQty('prem',1)">+</button></div></div>
        <div class="ticket-type"><div class="tt-info"><div class="tt-name">VIP / Lounge</div><div class="tt-desc">Exclusive lounge, complimentary drinks</div></div><div class="tt-price" id="vipPrice"></div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('vip',-1)">−</button><span class="qty-num" id="vipQty">0</span><button class="qty-btn" onclick="changeQty('vip',1)">+</button></div></div>
      </div>
      <!-- SEAT MAP -->
      <div>
        <h4 style="font-size:14px;color:var(--muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">Choose Your Seats</h4>
        <div class="seat-map-container">
          <div class="stage">◀ STAGE ▶</div>
          <div class="seat-rows" id="seatMap"></div>
          <div class="seat-legend">
            <div class="legend-item"><div class="legend-dot" style="background:rgba(108,60,247,0.3)"></div>Available</div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--brand2)"></div>Selected</div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--dark3)"></div>Booked</div>
            <div class="legend-item"><div class="legend-dot" style="background:rgba(0,245,196,0.2)"></div>VIP</div>
          </div>
        </div>
      </div>
      <!-- ADD-ONS -->
      <div class="ticket-section">
        <h4 style="font-size:14px;color:var(--muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">🍕 Add-Ons (Pre-Order)</h4>
        <div class="ticket-type"><div class="tt-info"><div class="tt-name">Combo Meal (Burger + Drink)</div><div class="tt-desc">Collect at F&B counter</div></div><div class="tt-price">₹350</div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('fb',-1)">−</button><span class="qty-num" id="fbQty">0</span><button class="qty-btn" onclick="changeQty('fb',1)">+</button></div></div>
        <div class="ticket-type"><div class="tt-info"><div class="tt-name">Event Merch T-Shirt</div><div class="tt-desc">Official event merchandise</div></div><div class="tt-price">₹899</div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('merch',-1)">−</button><span class="qty-num" id="merchQty">0</span><button class="qty-btn" onclick="changeQty('merch',1)">+</button></div></div>
      </div>
      <div class="modal-footer">
        <div><div style="font-size:12px;color:var(--muted)">Total (incl. GST)</div><div class="total-price" id="totalPrice">₹0</div></div>
        <button class="btn-primary" style="padding:12px 28px;font-size:16px" onclick="proceedCheckout()"><i class="fas fa-lock"></i> Secure Checkout</button>
      </div>
    </div>
  </div>
</div>

<!-- LOGIN MODAL -->
<div class="modal-overlay" id="loginModal">
  <div class="modal" style="max-width:440px">
    <button class="modal-close" onclick="closeModal('loginModal')"><i class="fas fa-times"></i></button>
    <div class="modal-body">
      <div style="text-align:center;margin-bottom:28px">
        <div class="logo-mark" style="margin:0 auto 12px;width:48px;height:48px;font-size:20px">IX</div>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700">Welcome Back</h2>
        <p style="color:var(--muted);font-size:14px;margin-top:6px">Sign in to your INDTIX account</p>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:20px">
        <button onclick="socialLogin('google')" style="flex:1;padding:12px;background:var(--dark3);border:1px solid var(--border);border-radius:12px;color:var(--text);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter',sans-serif"><i class="fab fa-google" style="color:#EA4335"></i> Google</button>
        <button onclick="socialLogin('facebook')" style="flex:1;padding:12px;background:var(--dark3);border:1px solid var(--border);border-radius:12px;color:var(--text);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter',sans-serif"><i class="fab fa-facebook" style="color:#1877F2"></i> Facebook</button>
      </div>
      <div style="position:relative;margin-bottom:20px;text-align:center"><div style="position:absolute;left:0;right:0;top:50%;height:1px;background:var(--border)"></div><span style="position:relative;background:var(--card);padding:0 12px;font-size:12px;color:var(--muted)">or continue with email</span></div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <input type="email" placeholder="Email address" style="background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <input type="password" placeholder="Password" style="background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <button class="btn-primary" style="padding:12px;font-size:15px;border-radius:12px" onclick="handleLogin()">Sign In <i class="fas fa-arrow-right"></i></button>
      </div>
      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--muted)">New to INDTIX? <a href="#" onclick="switchToSignup()" style="color:var(--brand);text-decoration:none;font-weight:600">Create account</a></p>
      <p style="text-align:center;margin-top:8px;font-size:12px;color:var(--muted)"><a href="#" style="color:var(--muted)">Forgot password?</a></p>
    </div>
  </div>
</div>

<!-- SIGNUP MODAL -->
<div class="modal-overlay" id="signupModal">
  <div class="modal" style="max-width:440px">
    <button class="modal-close" onclick="closeModal('signupModal')"><i class="fas fa-times"></i></button>
    <div class="modal-body">
      <div style="text-align:center;margin-bottom:28px">
        <div class="logo-mark" style="margin:0 auto 12px;width:48px;height:48px;font-size:20px">IX</div>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700">Join INDTIX</h2>
        <p style="color:var(--muted);font-size:14px;margin-top:6px">Your next unforgettable experience awaits</p>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:14px">
        <input type="text" placeholder="First Name" style="flex:1;background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <input type="text" placeholder="Last Name" style="flex:1;background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <input type="email" placeholder="Email address" style="background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <input type="tel" placeholder="Mobile number (for WhatsApp tickets)" style="background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <input type="password" placeholder="Create password" style="background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif">
        <button class="btn-primary" style="padding:12px;font-size:15px;border-radius:12px" onclick="handleSignup()">Create Account <i class="fas fa-arrow-right"></i></button>
      </div>
      <p style="text-align:center;margin-top:16px;font-size:12px;color:var(--muted)">By signing up, you agree to our <a href="#" style="color:var(--brand)">Terms</a> and <a href="#" style="color:var(--brand)">Privacy Policy</a>. GST invoice available for business bookings.</p>
      <p style="text-align:center;margin-top:10px;font-size:13px;color:var(--muted)">Already have an account? <a href="#" onclick="switchToLogin()" style="color:var(--brand);text-decoration:none;font-weight:600">Sign in</a></p>
    </div>
  </div>
</div>

<!-- CITY PICKER MODAL -->
<div class="modal-overlay" id="cityModal">
  <div class="modal" style="max-width:500px">
    <button class="modal-close" onclick="closeModal('cityModal')"><i class="fas fa-times"></i></button>
    <div class="modal-body">
      <h3 style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;margin-bottom:20px">Select Your City</h3>
      <input type="text" placeholder="Search city..." style="width:100%;background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif;margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${['Mumbai','Delhi','Bengaluru','Pune','Hyderabad','Chennai','Kolkata','Ahmedabad','Jaipur','Goa','Chandigarh','Kochi'].map(c=>`<button onclick="selectCity('${c}')" style="background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:10px;color:var(--text);cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;transition:all 0.2s" onmouseover="this.style.borderColor='var(--brand)'" onmouseout="this.style.borderColor='var(--border)'">${c}</button>`).join('')}
      </div>
    </div>
  </div>
</div>

<!-- CHECKOUT MODAL -->
<div class="modal-overlay" id="checkoutModal">
  <div class="modal" style="max-width:520px">
    <button class="modal-close" onclick="closeModal('checkoutModal')"><i class="fas fa-times"></i></button>
    <div class="modal-body">
      <h3 style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;margin-bottom:6px">Secure Checkout</h3>
      <p style="color:var(--muted);font-size:13px;margin-bottom:20px"><i class="fas fa-lock" style="color:var(--brand3)"></i> 256-bit SSL encrypted payment</p>
      <div style="background:var(--dark3);border-radius:14px;padding:16px;margin-bottom:20px">
        <div id="checkoutSummary"></div>
        <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">
          <span style="color:var(--muted);font-size:13px">Subtotal</span><span id="checkoutSubtotal" style="font-weight:600"></span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <span style="color:var(--muted);font-size:13px">GST (18%)</span><span id="checkoutGST" style="font-weight:600"></span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <span style="color:var(--muted);font-size:13px">Platform Fee</span><span style="font-weight:600;color:var(--muted)">₹20</span>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:700;font-size:16px">Total</span><span id="checkoutTotal" class="card-price" style="font-size:22px"></span>
        </div>
      </div>
      <h4 style="font-size:14px;font-weight:600;margin-bottom:12px">Payment Method</h4>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
        <button onclick="selectPayment(this,'upi')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">📱 UPI</button>
        <button onclick="selectPayment(this,'card')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">💳 Card</button>
        <button onclick="selectPayment(this,'netbanking')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">🏦 Net Banking</button>
        <button onclick="selectPayment(this,'wallet')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">👛 Wallets</button>
        <button onclick="selectPayment(this,'emi')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">📅 EMI</button>
        <button onclick="selectPayment(this,'bnpl')" class="pay-btn" style="padding:10px;background:var(--dark3);border:1px solid var(--border);border-radius:10px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">⚡ Pay Later</button>
      </div>
      <button class="btn-primary" style="width:100%;padding:14px;font-size:16px;border-radius:12px" onclick="completePayment()"><i class="fas fa-lock"></i> Pay Now & Get Tickets</button>
      <p style="text-align:center;margin-top:10px;font-size:11px;color:var(--muted)">By completing purchase you agree to our Terms. Tickets sent via WhatsApp & Email. GST invoice generated automatically.</p>
    </div>
  </div>
</div>

<!-- TOAST CONTAINER -->
<div class="toast-container" id="toastContainer"></div>

<!-- CHATBOT -->
<button class="chatbot-fab" onclick="toggleChat()">🤖</button>
<div class="chatbot-window" id="chatWindow">
  <div class="chat-header">
    <div class="chat-avatar">🤖</div>
    <div><div class="chat-title">INDY — Your Event Assistant</div><div class="chat-status">Online · Powered by AI</div></div>
    <button class="chat-close" onclick="toggleChat()">✕</button>
  </div>
  <div class="chat-messages" id="chatMessages">
    <div class="msg bot">Hey! 👋 I'm INDY, your personal event assistant. I can help you find events, answer questions, and more. What are you looking for?</div>
  </div>
  <div class="chat-suggestions">
    <button class="chat-sug" onclick="chatSuggest('Events this weekend in Mumbai')">This weekend in Mumbai</button>
    <button class="chat-sug" onclick="chatSuggest('Best concerts 2025')">Best concerts 2025</button>
    <button class="chat-sug" onclick="chatSuggest('How do I cancel my booking?')">Cancel booking?</button>
    <button class="chat-sug" onclick="chatSuggest('Tell me about INDTIX')">About INDTIX</button>
  </div>
  <div class="chat-input-row">
    <input class="chat-input" id="chatInput" placeholder="Ask me anything..." onkeypress="if(event.key==='Enter')sendChat()">
    <button class="chat-send" onclick="sendChat()"><i class="fas fa-paper-plane"></i></button>
  </div>
</div>

<script>
const EVENTS = [
  { id:'E001',name:'Sunburn Arena Mumbai',date:'Apr 15, 2025',venue:'NSCI Dome, Worli',city:'Mumbai',price:1499,category:'Music',image:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',sold:72 },
  { id:'E002',name:'NH7 Weekender',date:'May 20, 2025',venue:'Mahalaxmi Grounds',city:'Pune',price:2999,category:'Music',image:'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600',sold:58 },
  { id:'E003',name:'Comedy Central Live',date:'Apr 28, 2025',venue:'JW Marriott Ballroom',city:'Bengaluru',price:899,category:'Comedy',image:'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600',sold:45 },
  { id:'E004',name:'Tech Summit 2025',date:'Jun 10, 2025',venue:'HITEX Exhibition Centre',city:'Hyderabad',price:4999,category:'Conference',image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',sold:85 },
  { id:'E005',name:'Lollapalooza India',date:'Mar 22, 2025',venue:'Mahalaxmi Racecourse',city:'Mumbai',price:5999,category:'Music',image:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',sold:92 },
  { id:'E006',name:'BITS Pilani Oasis',date:'Oct 1, 2025',venue:'BITS Campus',city:'Pilani',price:299,category:'College Fest',image:'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600',sold:34 },
];

let currentEvent=null, qty={ga:0,prem:0,vip:0,fb:0,merch:0}, selectedSeats=[];

function renderEvents(list){
  const grid=document.getElementById('eventsGrid');
  if(!list||!list.length){grid.innerHTML='<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px">No events found. Try a different filter.</p>';return;}
  grid.innerHTML=list.map(e=>`
    <div class="event-card" onclick="openEvent('${e.id}')">
      <div class="card-img-wrap">
        <img src="${e.image}" class="card-img" alt="${e.name}" loading="lazy">
        <div class="card-overlay"></div>
        <div class="card-badge">${e.category}</div>
        <div class="card-wish" onclick="event.stopPropagation();wishlist('${e.id}',this)"><i class="far fa-heart"></i></div>
      </div>
      <div class="card-body">
        <div class="card-cat">${e.category.toUpperCase()}</div>
        <div class="card-name">${e.name}</div>
        <div class="card-info">
          <span><i class="fas fa-calendar"></i>${e.date}</span>
          <span><i class="fas fa-location-dot"></i>${e.venue}</span>
          <span><i class="fas fa-city"></i>${e.city}</span>
        </div>
        <div style="background:var(--dark3);border-radius:8px;height:4px;margin-bottom:12px;overflow:hidden"><div style="width:${e.sold}%;height:100%;background:var(--grad1);border-radius:8px"></div></div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:12px">${e.sold}% tickets sold</div>
        <div class="card-footer">
          <div class="card-price">₹${e.price.toLocaleString('en-IN')}<span> onwards</span></div>
          <button class="btn-book" onclick="event.stopPropagation();openEvent('${e.id}')">Book Now</button>
        </div>
      </div>
    </div>`).join('');
}

function openEvent(id){
  currentEvent=EVENTS.find(e=>e.id===id);if(!currentEvent)return;
  qty={ga:0,prem:0,vip:0,fb:0,merch:0};selectedSeats=[];
  document.getElementById('modalImg').src=currentEvent.image;
  document.getElementById('modalTitle').textContent=currentEvent.name;
  document.getElementById('modalCat').textContent=currentEvent.category;
  document.getElementById('modalDate').textContent=currentEvent.date;
  document.getElementById('modalVenue').textContent=currentEvent.venue;
  document.getElementById('modalCity').textContent=currentEvent.city;
  document.getElementById('gaPrice').textContent='₹'+currentEvent.price.toLocaleString('en-IN');
  document.getElementById('premPrice').textContent='₹'+(currentEvent.price*1.5|0).toLocaleString('en-IN');
  document.getElementById('vipPrice').textContent='₹'+(currentEvent.price*3|0).toLocaleString('en-IN');
  buildSeatMap();updateTotal();
  document.getElementById('eventModal').classList.add('active');
}

function buildSeatMap(){
  const rows=['A','B','C','D','E','F','G','H'];
  const seats=['VIP','VIP','VIP','VIP','VIP','VIP','VIP','VIP','VIP','VIP'];
  const map=document.getElementById('seatMap');
  const booked=new Set([2,5,8,12,15,18,22,25,28,32,35,38,42,45]);
  map.innerHTML=rows.map((r,ri)=>`
    <div class="seat-row">
      <span class="row-label">${r}</span>
      ${Array.from({length:ri<2?10:12}).map((_,si)=>{
        const sn=ri*12+si;const isBooked=booked.has(sn);const isVip=ri<2;
        return`<button class="seat ${isBooked?'booked':isVip?'vip':'available'}" onclick="toggleSeat(this,'${r}${si+1}')" ${isBooked?'disabled':''}>${r}${si+1}</button>`;
      }).join('')}
    </div>`).join('');
}

function toggleSeat(btn,id){
  if(btn.classList.contains('selected')){
    btn.classList.remove('selected');btn.classList.add(btn.dataset.type||'available');
    selectedSeats=selectedSeats.filter(s=>s!==id);
  } else {
    btn.dataset.type=btn.classList.contains('vip')?'vip':'available';
    btn.classList.remove('available','vip');btn.classList.add('selected');
    selectedSeats.push(id);
  }
  updateTotal();
}

function changeQty(type,delta){
  qty[type]=Math.max(0,Math.min(10,qty[type]+delta));
  document.getElementById(type+'Qty').textContent=qty[type];
  updateTotal();
}

function updateTotal(){
  if(!currentEvent)return;
  const t=qty.ga*currentEvent.price+qty.prem*(currentEvent.price*1.5|0)+qty.vip*(currentEvent.price*3|0)+qty.fb*350+qty.merch*899;
  document.getElementById('totalPrice').textContent='₹'+t.toLocaleString('en-IN');
}

function proceedCheckout(){
  if(!currentEvent)return;
  const sub=qty.ga*currentEvent.price+qty.prem*(currentEvent.price*1.5|0)+qty.vip*(currentEvent.price*3|0)+qty.fb*350+qty.merch*899;
  if(sub===0){showToast('Please select at least one ticket!','error');return;}
  closeModal('eventModal');
  document.getElementById('checkoutSummary').innerHTML=`<div style="font-weight:700;font-size:16px;margin-bottom:8px">${currentEvent.name}</div><div style="font-size:13px;color:var(--muted)">${currentEvent.date} · ${currentEvent.venue}</div>`;
  document.getElementById('checkoutSubtotal').textContent='₹'+sub.toLocaleString('en-IN');
  document.getElementById('checkoutGST').textContent='₹'+(sub*0.18|0).toLocaleString('en-IN');
  document.getElementById('checkoutTotal').textContent='₹'+(sub*1.18+20|0).toLocaleString('en-IN');
  document.getElementById('checkoutModal').classList.add('active');
}

function selectPayment(btn,method){
  document.querySelectorAll('.pay-btn').forEach(b=>b.style.borderColor='var(--border)');
  btn.style.borderColor='var(--brand)';btn.style.background='rgba(108,60,247,0.15)';
}

function completePayment(){
  closeModal('checkoutModal');
  showToast('🎉 Booking confirmed! Tickets sent to WhatsApp & email.','success');
  setTimeout(()=>showToast('📧 GST invoice generated. Check your email.','success'),1500);
}

function filterBy(btn,cat){
  document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderEvents(cat==='all'?EVENTS:EVENTS.filter(e=>e.category.toLowerCase().includes(cat)));
}

function filterCategory(cat){renderEvents(EVENTS.filter(e=>e.category===cat));}

function handleSearch(v){if(v.length>2)renderEvents(EVENTS.filter(e=>e.name.toLowerCase().includes(v.toLowerCase())||e.venue.toLowerCase().includes(v.toLowerCase())||e.city.toLowerCase().includes(v.toLowerCase())));}

function doSearch(){handleSearch(document.getElementById('searchInput').value);}

function selectCity(city){document.getElementById('selectedCity').textContent=city;closeModal('cityModal');showToast('📍 City changed to '+city,'success');}

function showCityPicker(){document.getElementById('cityModal').classList.add('active');}

function openLoginModal(){document.getElementById('loginModal').classList.add('active');}
function openSignupModal(){document.getElementById('signupModal').classList.add('active');}
function closeModal(id){document.getElementById(id).classList.remove('active');}

function switchToSignup(){closeModal('loginModal');openSignupModal();}
function switchToLogin(){closeModal('signupModal');openLoginModal();}

function handleLogin(){closeModal('loginModal');showToast('✅ Welcome back! Signed in successfully.','success');}
function handleSignup(){closeModal('signupModal');showToast('🎉 Account created! Welcome to INDTIX.','success');}
function socialLogin(p){closeModal('loginModal');showToast('✅ Signed in with '+p.charAt(0).toUpperCase()+p.slice(1),'success');}

function wishlist(id,btn){btn.innerHTML='<i class="fas fa-heart" style="color:var(--brand2)"></i>';showToast('❤️ Added to wishlist!','success');}

function showToast(msg,type='success'){
  const t=document.createElement('div');t.className='toast '+type;
  t.innerHTML='<i class="fas fa-'+(type==='success'?'check-circle':'exclamation-circle')+'"></i>'+msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(()=>t.remove(),4000);
}

// CHATBOT
let chatOpen=false;
function toggleChat(){chatOpen=!chatOpen;document.getElementById('chatWindow').classList.toggle('open',chatOpen);}

const chatResponses={
  'events this weekend':()=>'This weekend in Mumbai: 🎵 Sunburn Arena (Apr 15, ₹1,499) and more! Check the events section below.',
  'concerts':()=>'Top concerts: Sunburn Arena Mumbai (Apr 15), NH7 Weekender Pune (May 20), Lollapalooza India (Mar 22). Use the filter to browse all music events!',
  'cancel':()=>'To cancel your booking: Go to My Tickets → Select the booking → Click Cancel. Refunds are processed in 5-7 business days as per our refund policy.',
  'indtix':()=>'INDTIX is India\'s next-gen event commerce platform by Oye Imagine Private Ltd. We serve fans, organisers, venues, and more — all in one platform. Discover 50,000+ events across 50+ cities!',
  'refund':()=>'Refund policy: Full refund if event is cancelled. Partial refund (50%) up to 48 hrs before event. No refund within 24 hrs. Waivers at organiser\'s discretion.',
  'default':()=>'I\'m here to help! 😊 You can ask me about events, bookings, cancellations, refunds, or venue info. What would you like to know?'
};

function sendChat(){
  const input=document.getElementById('chatInput');const msg=input.value.trim();if(!msg)return;
  addChatMsg(msg,'user');input.value='';
  setTimeout(()=>{
    const key=Object.keys(chatResponses).find(k=>msg.toLowerCase().includes(k));
    addChatMsg((chatResponses[key]||chatResponses['default'])(),'bot');
  },600);
}

function chatSuggest(msg){document.getElementById('chatInput').value=msg;sendChat();}

function addChatMsg(msg,type){
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');div.className='msg '+type;div.textContent=msg;
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
}

// PARTICLES
function createParticles(){
  const c=document.getElementById('particles');
  const colors=['rgba(108,60,247,0.5)','rgba(255,60,172,0.4)','rgba(0,245,196,0.3)'];
  for(let i=0;i<15;i++){
    const p=document.createElement('div');p.className='particle';
    const size=Math.random()*4+2;const color=colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText=`width:${size}px;height:${size}px;background:${color};left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s`;
    c.appendChild(p);
  }
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('active')}));

// Init
renderEvents(EVENTS);createParticles();

// Navbar scroll
window.addEventListener('scroll',()=>{
  document.querySelector('nav').style.background=window.scrollY>50?'rgba(8,11,20,0.98)':'rgba(8,11,20,0.85)';
});
</script>
</body>
</html>`
}

export default app

// ═══════════════════════════════════════════════════════════════════
// ORGANISER PORTAL
// ═══════════════════════════════════════════════════════════════════
function organiserPortalHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Organiser Portal – INDTIX</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{--brand:#6C3CF7;--brand2:#FF3CAC;--brand3:#00F5C4;--dark:#080B14;--dark2:#0F1320;--dark3:#161B2E;--card:#1A2035;--border:rgba(108,60,247,0.2);--text:#E8EAFF;--muted:#8B93B8;--grad1:linear-gradient(135deg,#6C3CF7,#FF3CAC);--grad2:linear-gradient(135deg,#00F5C4,#6C3CF7)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--dark);color:var(--text);font-family:'Inter',sans-serif;display:flex;min-height:100vh}
.sidebar{width:260px;background:var(--dark3);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;overflow-y:auto}
.sb-logo{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
.sb-logo a{text-decoration:none;color:inherit}
.logo-wrap{display:flex;align-items:center;gap:10px}
.logo-mark{width:34px;height:34px;background:var(--grad1);border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:'Space Grotesk',sans-serif}
.logo-text{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px}
.logo-text span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-portal-badge{background:rgba(255,60,172,0.15);border:1px solid rgba(255,60,172,0.3);color:#FF3CAC;font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;margin-left:auto;align-self:center}
.sb-user{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sb-avatar{width:38px;height:38px;border-radius:50%;background:var(--grad1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.sb-uname{font-size:13px;font-weight:600}
.sb-role{font-size:11px;color:var(--muted)}
.sb-status{width:8px;height:8px;border-radius:50%;background:#00F5C4;margin-left:auto}
.sb-nav{flex:1;padding:16px 12px}
.sb-section{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);padding:8px 8px 4px}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:2px;color:var(--muted);font-size:13px;font-weight:500;text-decoration:none;border:none;background:transparent;width:100%;text-align:left;font-family:'Inter',sans-serif}
.sb-item:hover,.sb-item.active{background:rgba(108,60,247,0.15);color:var(--text)}
.sb-item.active{color:var(--brand)}
.sb-item i{width:18px;text-align:center;font-size:14px}
.sb-badge{margin-left:auto;background:var(--brand);color:#fff;font-size:10px;padding:2px 7px;border-radius:20px;font-weight:600}
.sb-footer{padding:16px 20px;border-top:1px solid var(--border)}
.sb-footer a{display:flex;align-items:center;gap:8px;color:var(--muted);text-decoration:none;font-size:13px;transition:color 0.2s}
.sb-footer a:hover{color:var(--brand)}
.main{margin-left:260px;flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--dark2);border-bottom:1px solid var(--border);padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.topbar-title{font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700}
.topbar-actions{display:flex;align-items:center;gap:12px}
.btn-sm{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s}
.btn-primary{background:var(--grad1);color:#fff;box-shadow:0 4px 16px rgba(108,60,247,0.3)}
.btn-primary:hover{transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text)}
.btn-ghost:hover{border-color:var(--brand);color:var(--brand)}
.content{flex:1;padding:28px;overflow-y:auto}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;position:relative;overflow:hidden}
.stat-card::after{content:'';position:absolute;top:0;right:0;width:80px;height:80px;border-radius:50%;opacity:0.08}
.stat-card.purple::after{background:var(--brand)}
.stat-card.pink::after{background:var(--brand2)}
.stat-card.teal::after{background:var(--brand3)}
.stat-card.gold::after{background:#FFB300}
.stat-label{font-size:12px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:0.5px}
.stat-value{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;margin:8px 0 4px}
.stat-change{font-size:12px;font-weight:600}
.stat-change.up{color:var(--brand3)}
.stat-change.dn{color:var(--brand2)}
.stat-icon{position:absolute;top:20px;right:20px;font-size:24px;opacity:0.6}
.cards-row{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px}
.card-title{font-size:14px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}
.card-title span{color:var(--muted);font-size:12px;font-weight:400}
.event-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.event-row:last-child{border-bottom:none}
.er-thumb{width:48px;height:48px;border-radius:10px;object-fit:cover}
.er-info{flex:1}
.er-name{font-size:14px;font-weight:600;margin-bottom:3px}
.er-meta{font-size:12px;color:var(--muted)}
.er-status{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600}
.s-approved{background:rgba(0,245,196,0.15);color:var(--brand3)}
.s-pending{background:rgba(255,180,0,0.15);color:#FFB300}
.s-draft{background:rgba(139,147,184,0.15);color:var(--muted)}
.er-rev{text-align:right}
.er-amount{font-size:15px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.er-tickets{font-size:11px;color:var(--muted)}
.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.qa-btn{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s;font-size:13px;font-weight:600;color:var(--text)}
.qa-btn:hover{border-color:var(--brand);background:rgba(108,60,247,0.1)}
.qa-btn i{display:block;font-size:22px;margin-bottom:8px;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.panel{display:none}
.panel.active{display:block}
.form-section{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px}
.form-title{font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group.full{grid-column:1/-1}
label{font-size:13px;font-weight:500;color:var(--muted)}
input,select,textarea{background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text);font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.2s}
input:focus,select:focus,textarea:focus{border-color:var(--brand)}
select option{background:var(--dark3)}
textarea{resize:vertical;min-height:80px}
.upload-zone{border:2px dashed var(--border);border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all 0.2s}
.upload-zone:hover{border-color:var(--brand);background:rgba(108,60,247,0.05)}
.upload-zone i{font-size:32px;color:var(--muted);margin-bottom:8px}
.upload-zone p{color:var(--muted);font-size:13px}
.ticket-builder{display:flex;flex-direction:column;gap:12px}
.ticket-type-row{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:14px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:12px;align-items:center}
.ticket-type-row input{padding:8px 12px;font-size:13px}
.approval-notice{background:rgba(255,180,0,0.08);border:1px solid rgba(255,180,0,0.3);border-radius:12px;padding:16px;margin-bottom:20px;display:flex;gap:12px;align-items:flex-start}
.approval-notice i{color:#FFB300;font-size:20px;margin-top:2px}
.approval-notice h4{font-size:14px;font-weight:600;color:#FFB300;margin-bottom:4px}
.approval-notice p{font-size:12px;color:var(--muted);line-height:1.5}
.progress-steps{display:flex;gap:0;margin-bottom:28px}
.step{flex:1;text-align:center;position:relative}
.step::after{content:'';position:absolute;top:16px;left:50%;width:100%;height:2px;background:var(--border)}
.step:last-child::after{display:none}
.step.done::after{background:var(--grad1)}
.step-circle{width:32px;height:32px;border-radius:50%;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:2px solid var(--border);background:var(--dark);position:relative;z-index:1}
.step.active .step-circle{background:var(--brand);border-color:var(--brand);color:#fff}
.step.done .step-circle{background:var(--brand3);border-color:var(--brand3);color:var(--dark)}
.step-label{font-size:11px;color:var(--muted);font-weight:500}
.step.active .step-label{color:var(--brand)}
.kyc-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.kyc-doc-upload{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.2s}
.kyc-doc-upload:hover{border-color:var(--brand)}
.doc-icon{width:40px;height:40px;background:rgba(108,60,247,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
.doc-info{flex:1}
.doc-title{font-size:13px;font-weight:600}
.doc-status{font-size:11px;color:var(--muted)}
.toggle-switch{position:relative;display:inline-block;width:44px;height:24px}
.toggle-switch input{opacity:0;width:0;height:0}
.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:var(--dark3);border:1px solid var(--border);border-radius:24px;transition:.3s}
.slider:before{position:absolute;content:"";height:18px;width:18px;left:2px;bottom:2px;background:var(--muted);border-radius:50%;transition:.3s}
input:checked+.slider{background:var(--brand);border-color:var(--brand)}
input:checked+.slider:before{transform:translateX(20px);background:#fff}
</style>
</head>
<body>
<div class="sidebar">
  <div class="sb-logo">
    <a href="/"><div class="logo-wrap"><div class="logo-mark">IX</div><span class="logo-text">IND<span>TIX</span></span><span class="sb-portal-badge">Organiser</span></div></a>
  </div>
  <div class="sb-user"><div class="sb-avatar">RA</div><div><div class="sb-uname">Rahul Arora</div><div class="sb-role">Verified Organiser</div></div><div class="sb-status"></div></div>
  <nav class="sb-nav">
    <div class="sb-section">Overview</div>
    <button class="sb-item active" onclick="showPanel('dashboard',this)"><i class="fas fa-chart-line"></i>Dashboard</button>
    <button class="sb-item" onclick="showPanel('events',this)"><i class="fas fa-calendar"></i>My Events<span class="sb-badge">3</span></button>
    <div class="sb-section">Create</div>
    <button class="sb-item" onclick="showPanel('create',this)"><i class="fas fa-plus-circle"></i>Create Event</button>
    <button class="sb-item" onclick="showPanel('tickets',this)"><i class="fas fa-ticket"></i>Ticket Builder</button>
    <button class="sb-item" onclick="showPanel('seatmap',this)"><i class="fas fa-map"></i>Seat Map Config</button>
    <button class="sb-item" onclick="showPanel('addons',this)"><i class="fas fa-shopping-bag"></i>Add-Ons & Merch</button>
    <div class="sb-section">Finance</div>
    <button class="sb-item" onclick="showPanel('revenue',this)"><i class="fas fa-indian-rupee-sign"></i>Revenue</button>
    <button class="sb-item" onclick="showPanel('settlements',this)"><i class="fas fa-wallet"></i>Settlements<span class="sb-badge">1</span></button>
    <button class="sb-item" onclick="showPanel('invoices',this)"><i class="fas fa-file-invoice"></i>GST Invoices</button>
    <div class="sb-section">Management</div>
    <button class="sb-item" onclick="showPanel('attendees',this)"><i class="fas fa-users"></i>Attendees</button>
    <button class="sb-item" onclick="showPanel('checkin',this)"><i class="fas fa-qrcode"></i>Check-In Config</button>
    <button class="sb-item" onclick="showPanel('marketing',this)"><i class="fas fa-bullhorn"></i>Marketing Tools</button>
    <button class="sb-item" onclick="showPanel('analytics',this)"><i class="fas fa-chart-bar"></i>Analytics</button>
    <div class="sb-section">Account</div>
    <button class="sb-item" onclick="showPanel('kyc',this)"><i class="fas fa-id-card"></i>KYC / Verification<span class="sb-badge" style="background:#FFB300">!</span></button>
    <button class="sb-item" onclick="showPanel('settings',this)"><i class="fas fa-cog"></i>Settings</button>
  </nav>
  <div class="sb-footer"><a href="/"><i class="fas fa-arrow-left"></i>Back to Fan Portal</a></div>
</div>

<div class="main">
  <div class="topbar">
    <div class="topbar-title" id="topbarTitle">Dashboard</div>
    <div class="topbar-actions">
      <button class="btn-sm btn-ghost" onclick="showPanel('create',null)"><i class="fas fa-plus"></i> New Event</button>
      <button class="btn-sm btn-ghost"><i class="fas fa-bell"></i></button>
      <button class="btn-sm btn-ghost"><i class="fas fa-question-circle"></i></button>
    </div>
  </div>

  <div class="content">
    <!-- DASHBOARD -->
    <div class="panel active" id="panel-dashboard">
      <div class="approval-notice">
        <i class="fas fa-clock"></i>
        <div><h4>KYC Pending — Complete to Go Live</h4><p>Your account is under review. Upload GST certificate, PAN, and bank details to unlock event creation and payouts. Estimated approval: 24-48 hours.</p></div>
      </div>
      <div class="stats-row">
        <div class="stat-card purple"><div class="stat-icon">🎟️</div><div class="stat-label">Total Tickets Sold</div><div class="stat-value">12,450</div><div class="stat-change up">↑ 18% vs last month</div></div>
        <div class="stat-card pink"><div class="stat-icon">💰</div><div class="stat-label">Gross Revenue</div><div class="stat-value">₹18.4L</div><div class="stat-change up">↑ 24% vs last month</div></div>
        <div class="stat-card teal"><div class="stat-icon">📅</div><div class="stat-label">Active Events</div><div class="stat-value">3</div><div class="stat-change up">2 approved, 1 pending</div></div>
        <div class="stat-card gold"><div class="stat-icon">⭐</div><div class="stat-label">Avg Rating</div><div class="stat-value">4.7</div><div class="stat-change up">↑ 0.2 this quarter</div></div>
      </div>
      <div class="cards-row">
        <div class="card">
          <div class="card-title">Recent Events <span>Last 30 days</span></div>
          <div class="event-row"><img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100" class="er-thumb" alt=""><div class="er-info"><div class="er-name">Sunburn Arena Mumbai</div><div class="er-meta">Apr 15 · NSCI Dome · 4,200 attendees</div></div><span class="er-status s-approved">Approved</span><div class="er-rev"><div class="er-amount">₹6.3L</div><div class="er-tickets">4,200 tickets</div></div></div>
          <div class="event-row"><img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=100" class="er-thumb" alt=""><div class="er-info"><div class="er-name">NH7 Weekender Pune</div><div class="er-meta">May 20 · Mahalaxmi Grounds · 8,500 cap</div></div><span class="er-status s-approved">Approved</span><div class="er-rev"><div class="er-amount">₹8.5L</div><div class="er-tickets">2,840 sold</div></div></div>
          <div class="event-row"><img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=100" class="er-thumb" alt=""><div class="er-info"><div class="er-name">Tech Summit 2025</div><div class="er-meta">Jun 10 · HITEX · 1,200 cap</div></div><span class="er-status s-pending">Pending Review</span><div class="er-rev"><div class="er-amount">₹3.6L</div><div class="er-tickets">720 sold</div></div></div>
        </div>
        <div class="card">
          <div class="card-title">Quick Actions</div>
          <div class="quick-actions">
            <button class="qa-btn" onclick="showPanel('create',null)"><i class="fas fa-plus-circle"></i>Create Event</button>
            <button class="qa-btn" onclick="showPanel('analytics',null)"><i class="fas fa-chart-bar"></i>View Analytics</button>
            <button class="qa-btn" onclick="showPanel('settlements',null)"><i class="fas fa-wallet"></i>Settlements</button>
            <button class="qa-btn" onclick="showPanel('marketing',null)"><i class="fas fa-bullhorn"></i>Promote</button>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
            <div style="font-size:13px;font-weight:600;margin-bottom:10px">Pending Settlement</div>
            <div style="font-size:28px;font-weight:800;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent">₹3,24,500</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">Payout scheduled: Apr 20</div>
            <button class="btn-sm btn-primary" style="margin-top:12px;width:100%;justify-content:center" onclick="showPanel('settlements',null)">View Details</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE EVENT -->
    <div class="panel" id="panel-create">
      <div class="progress-steps">
        <div class="step done"><div class="step-circle">✓</div><div class="step-label">Basic Info</div></div>
        <div class="step active"><div class="step-circle">2</div><div class="step-label">Details</div></div>
        <div class="step"><div class="step-circle">3</div><div class="step-label">Tickets</div></div>
        <div class="step"><div class="step-circle">4</div><div class="step-label">Venue</div></div>
        <div class="step"><div class="step-circle">5</div><div class="step-label">Review</div></div>
      </div>
      <div class="form-section">
        <div class="form-title"><i class="fas fa-info-circle" style="color:var(--brand)"></i> Event Information</div>
        <div class="form-grid">
          <div class="form-group full"><label>Event Title *</label><input type="text" placeholder="e.g. Sunburn Arena Mumbai 2025" value="My Amazing Event"></div>
          <div class="form-group"><label>Category *</label><select><option>Music & Concerts</option><option>Comedy</option><option>Sports</option><option>Theatre</option><option>Conference</option><option>Workshop</option><option>Festival</option><option>College Fest</option></select></div>
          <div class="form-group"><label>Sub-Category</label><select><option>Electronic/EDM</option><option>Indie</option><option>Bollywood</option><option>Rock</option><option>Jazz</option></select></div>
          <div class="form-group"><label>Event Date *</label><input type="date"></div>
          <div class="form-group"><label>Event Time *</label><input type="time" value="18:00"></div>
          <div class="form-group"><label>End Date</label><input type="date"></div>
          <div class="form-group"><label>End Time</label><input type="time" value="23:00"></div>
          <div class="form-group full"><label>Description *</label><textarea placeholder="Describe your event in detail. What makes it special? Who's performing? What's included?">Experience the most electrifying music event of 2025...</textarea></div>
          <div class="form-group full"><label>Event Banner / Poster *</label><div class="upload-zone"><i class="fas fa-cloud-upload-alt"></i><p>Drag & drop or <strong>browse</strong> to upload<br><span style="font-size:11px">Recommended: 1920×1080px, JPG/PNG, max 5MB</span></p></div></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-title"><i class="fas fa-map-marker-alt" style="color:var(--brand2)"></i> Venue Selection</div>
        <div class="form-grid">
          <div class="form-group"><label>City *</label><select><option>Mumbai</option><option>Delhi</option><option>Bengaluru</option><option>Pune</option><option>Hyderabad</option><option>Chennai</option></select></div>
          <div class="form-group"><label>Venue *</label><select><option>NSCI Dome, Worli</option><option>Mahalaxmi Racecourse</option><option>BKC Arena</option><option>Nehru Centre</option></select></div>
          <div class="form-group"><label>Expected Capacity</label><input type="number" placeholder="5000" value="5000"></div>
          <div class="form-group"><label>Age Restriction</label><select><option>18+ with ID</option><option>All Ages</option><option>21+ with ID</option><option>No Restriction</option></select></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-title"><i class="fas fa-file-alt" style="color:var(--brand3)"></i> Compliance & Documents</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="kyc-doc-upload"><div class="doc-icon">📄</div><div class="doc-info"><div class="doc-title">Event Permission Letter</div><div class="doc-status">Required — Upload PDF</div></div><i class="fas fa-upload" style="color:var(--muted)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">📋</div><div class="doc-info"><div class="doc-title">Venue Hire Agreement</div><div class="doc-status">Required — Upload PDF</div></div><i class="fas fa-upload" style="color:var(--muted)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">🔒</div><div class="doc-info"><div class="doc-title">Police NOC</div><div class="doc-status">If 500+ attendees</div></div><i class="fas fa-upload" style="color:var(--muted)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">🎵</div><div class="doc-info"><div class="doc-title">Music License (IPRS/PPL)</div><div class="doc-status">Required for live music</div></div><i class="fas fa-upload" style="color:var(--muted)"></i></div>
        </div>
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="btn-sm btn-ghost">Save Draft</button>
        <button class="btn-sm btn-ghost">Preview Event</button>
        <button class="btn-sm btn-primary" onclick="submitForApproval()"><i class="fas fa-paper-plane"></i> Submit for Approval</button>
      </div>
    </div>

    <!-- ANALYTICS PANEL -->
    <div class="panel" id="panel-analytics">
      <div class="stats-row">
        <div class="stat-card purple"><div class="stat-icon">👀</div><div class="stat-label">Event Page Views</div><div class="stat-value">48,200</div><div class="stat-change up">↑ 32%</div></div>
        <div class="stat-card pink"><div class="stat-icon">🔄</div><div class="stat-label">Conversion Rate</div><div class="stat-value">3.8%</div><div class="stat-change up">↑ 0.4%</div></div>
        <div class="stat-card teal"><div class="stat-icon">💳</div><div class="stat-label">Avg Order Value</div><div class="stat-value">₹2,840</div><div class="stat-change up">↑ 12%</div></div>
        <div class="stat-card gold"><div class="stat-icon">🔁</div><div class="stat-label">Repeat Buyers</div><div class="stat-value">28%</div><div class="stat-change up">↑ 5%</div></div>
      </div>
      <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px">
        <div style="font-size:15px;font-weight:700;margin-bottom:20px">Sales Timeline — Sunburn Arena Mumbai</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:120px">
          ${[30,45,60,80,95,70,85,100,72,88,65,40].map((h,i)=>`<div style="flex:1;background:var(--grad1);border-radius:4px 4px 0 0;height:${h}%;opacity:0.7;cursor:pointer;transition:opacity 0.2s" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'" title="Week ${i+1}: ${h}% sales"></div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11px;color:var(--muted)">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        <div class="card"><div class="card-title">Ticket Types</div>${[['GA',45,'#6C3CF7'],['Premium',30,'#FF3CAC'],['VIP',25,'#00F5C4']].map(([n,p,c])=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><div style="width:10px;height:10px;border-radius:2px;background:${c}"></div><span style="flex:1;font-size:13px">${n}</span><span style="font-size:13px;font-weight:600">${p}%</span></div>`).join('')}</div>
        <div class="card"><div class="card-title">Top Cities</div>${[['Mumbai',42],['Pune',28],['Nashik',18],['Others',12]].map(([c,p])=>`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>${c}</span><span>${p}%</span></div><div style="background:var(--dark3);border-radius:4px;height:5px"><div style="width:${p}%;height:100%;background:var(--grad1);border-radius:4px"></div></div></div>`).join('')}</div>
        <div class="card"><div class="card-title">Traffic Sources</div>${[['Organic Search',35],['Social Media',28],['Email/WhatsApp',22],['Referral',15]].map(([s,p])=>`<div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;margin-bottom:10px"><span>${s}</span><span style="font-weight:600">${p}%</span></div>`).join('')}</div>
      </div>
    </div>

    <!-- KYC PANEL -->
    <div class="panel" id="panel-kyc">
      <div class="approval-notice">
        <i class="fas fa-shield-alt"></i>
        <div><h4>Complete KYC to Start Selling</h4><p>INDTIX requires verification for all organisers to ensure safe, compliant ticketing. Provide your business documents below. Reviewed within 24-48 hours by our team.</p></div>
      </div>
      <div class="form-section">
        <div class="form-title">🏢 Business Information</div>
        <div class="form-grid">
          <div class="form-group"><label>Legal Business Name</label><input type="text" placeholder="Oye Events Private Limited"></div>
          <div class="form-group"><label>Business Type</label><select><option>Private Limited</option><option>LLP</option><option>Proprietorship</option><option>Partnership</option><option>Trust/NGO</option></select></div>
          <div class="form-group"><label>GST Number</label><input type="text" placeholder="27AABCO1234A1Z5"></div>
          <div class="form-group"><label>PAN Number</label><input type="text" placeholder="AABCO1234A"></div>
          <div class="form-group"><label>Business Email</label><input type="email" placeholder="accounts@yourcompany.com"></div>
          <div class="form-group"><label>Business Phone</label><input type="tel" placeholder="+91 98000 00000"></div>
          <div class="form-group full"><label>Registered Address</label><textarea placeholder="Full registered business address"></textarea></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-title">📄 Document Upload</div>
        <div class="kyc-row">
          <div class="kyc-doc-upload"><div class="doc-icon">📋</div><div class="doc-info"><div class="doc-title">GST Certificate</div><div class="doc-status">⬆ Upload PDF/Image</div></div><i class="fas fa-upload" style="color:var(--brand)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">🪪</div><div class="doc-info"><div class="doc-title">PAN Card</div><div class="doc-status">⬆ Upload PDF/Image</div></div><i class="fas fa-upload" style="color:var(--brand)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">🏦</div><div class="doc-info"><div class="doc-title">Cancelled Cheque</div><div class="doc-status">⬆ Upload Image</div></div><i class="fas fa-upload" style="color:var(--brand)"></i></div>
          <div class="kyc-doc-upload"><div class="doc-icon">📝</div><div class="doc-info"><div class="doc-title">Certificate of Incorporation</div><div class="doc-status">⬆ Upload PDF</div></div><i class="fas fa-upload" style="color:var(--brand)"></i></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-title">🏦 Bank Details (for Settlements)</div>
        <div class="form-grid">
          <div class="form-group"><label>Account Holder Name</label><input type="text" placeholder="As per bank records"></div>
          <div class="form-group"><label>Account Number</label><input type="text" placeholder="XXXXXXXXXXXX"></div>
          <div class="form-group"><label>IFSC Code</label><input type="text" placeholder="HDFC0001234"></div>
          <div class="form-group"><label>Bank Name</label><input type="text" placeholder="HDFC Bank"></div>
        </div>
      </div>
      <button class="btn-sm btn-primary" style="padding:12px 32px" onclick="submitKYC()"><i class="fas fa-shield-check"></i> Submit KYC for Verification</button>
    </div>

    <!-- SETTLEMENTS PANEL -->
    <div class="panel" id="panel-settlements">
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat-card purple"><div class="stat-icon">💰</div><div class="stat-label">Available Balance</div><div class="stat-value">₹3,24,500</div><div class="stat-change up">Ready to withdraw</div></div>
        <div class="stat-card teal"><div class="stat-icon">✅</div><div class="stat-label">Settled This Month</div><div class="stat-value">₹8,40,000</div><div class="stat-change up">3 settlements</div></div>
        <div class="stat-card pink"><div class="stat-icon">🔄</div><div class="stat-label">Pending TDS Deduction</div><div class="stat-value">₹16,225</div><div class="stat-change dn">TDS @5%</div></div>
      </div>
      <div class="card">
        <div class="card-title">Settlement History</div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead><tr style="border-bottom:1px solid var(--border);color:var(--muted)">${['Settlement ID','Event','Gross','Platform Fee','TDS','Net Payout','Date','Status'].map(h=>`<th style="padding:10px 8px;text-align:left;font-weight:500">${h}</th>`).join('')}</tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04)"><td style="padding:10px 8px;font-weight:600">STL-001</td><td>Sunburn Arena</td><td>₹6,30,000</td><td>₹63,000 (10%)</td><td>₹28,350</td><td style="color:var(--brand3);font-weight:700">₹5,38,650</td><td>Mar 20</td><td><span class="er-status s-approved">Paid</span></td></tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04)"><td style="padding:10px 8px;font-weight:600">STL-002</td><td>NH7 Weekender</td><td>₹8,50,000</td><td>₹85,000 (10%)</td><td>₹38,250</td><td style="color:var(--brand3);font-weight:700">₹7,26,750</td><td>Apr 5</td><td><span class="er-status s-pending">Processing</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- DEFAULT PANELS -->
    <div class="panel" id="panel-events"><div class="card"><div class="card-title">My Events</div><p style="color:var(--muted);font-size:14px">3 events total — 2 approved, 1 pending review</p></div></div>
    <div class="panel" id="panel-tickets"><div class="card"><div class="card-title">Ticket Builder</div><p style="color:var(--muted);font-size:14px">Configure ticket types, pricing, and capacity for your events.</p></div></div>
    <div class="panel" id="panel-seatmap"><div class="card"><div class="card-title">Seat Map Configuration</div><p style="color:var(--muted);font-size:14px">Design your venue layout, configure sections, rows, and individual seats.</p></div></div>
    <div class="panel" id="panel-addons"><div class="card"><div class="card-title">Add-Ons & Merchandise</div><p style="color:var(--muted);font-size:14px">Configure F&B options, merchandise, and other add-ons for your event.</p></div></div>
    <div class="panel" id="panel-revenue"><div class="card"><div class="card-title">Revenue Dashboard</div><p style="color:var(--muted);font-size:14px">Detailed revenue breakdown across all your events.</p></div></div>
    <div class="panel" id="panel-invoices"><div class="card"><div class="card-title">GST Invoices</div><p style="color:var(--muted);font-size:14px">Download GST-compliant invoices for all transactions.</p></div></div>
    <div class="panel" id="panel-attendees"><div class="card"><div class="card-title">Attendee Management</div><p style="color:var(--muted);font-size:14px">View and manage all your event attendees.</p></div></div>
    <div class="panel" id="panel-checkin"><div class="card"><div class="card-title">Check-In Configuration</div><p style="color:var(--muted);font-size:14px">Configure QR code scanning, NFC wristbands, and entry points.</p></div></div>
    <div class="panel" id="panel-marketing"><div class="card"><div class="card-title">Marketing Tools</div><p style="color:var(--muted);font-size:14px">Email campaigns, WhatsApp broadcasts, promo codes, and affiliate tools.</p></div></div>
    <div class="panel" id="panel-settings"><div class="card"><div class="card-title">Account Settings</div><p style="color:var(--muted);font-size:14px">Update your profile, notification preferences, and security settings.</p></div></div>
  </div>
</div>

<script>
function showPanel(name,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  const panel=document.getElementById('panel-'+name);
  if(panel)panel.classList.add('active');
  if(btn)btn.classList.add('active');
  const titles={dashboard:'Dashboard',create:'Create New Event',events:'My Events',tickets:'Ticket Builder',seatmap:'Seat Map Configuration',addons:'Add-Ons & Merchandise',revenue:'Revenue Overview',settlements:'Settlements & Payouts',invoices:'GST Invoices',attendees:'Attendee Management',checkin:'Check-In Configuration',marketing:'Marketing Tools',analytics:'Analytics & Insights',kyc:'KYC Verification',settings:'Account Settings'};
  document.getElementById('topbarTitle').textContent=titles[name]||'Dashboard';
}
function submitForApproval(){
  alert('✅ Event submitted for review! Our team will review within 24-48 hours. You\'ll receive a WhatsApp notification on approval.');
}
function submitKYC(){
  alert('✅ KYC documents submitted! Our compliance team will review within 24-48 hours. You\'ll receive confirmation on your registered mobile.');
}
</script>
</body>
</html>`
}

export default app
