// ═══════════════════════════════════════════════════════════════════════════
// INDTIX — src/email.ts
// Email OTP + Notifications via SendGrid / Cloudflare Email Routing
// ═══════════════════════════════════════════════════════════════════════════

// ── In-memory OTP store (use KV in production) ───────────────────────────────
const OTP_STORE = new Map<string, { otp: string; expires: number; attempts: number }>()

// ── Generate 6-digit OTP ─────────────────────────────────────────────────────
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ── Send email via SendGrid REST API ─────────────────────────────────────────
export async function sendEmailViaSendGrid(opts: {
  to: string
  subject: string
  html: string
  from?: string
  apiKey: string
}): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, from = 'noreply@indtix.com', apiKey } = opts

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: 'INDTIX Platform' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  })

  if (res.status === 202) return { success: true }
  const err = await res.text()
  return { success: false, error: err }
}

// ── OTP email HTML template ───────────────────────────────────────────────────
function otpEmailHTML(otp: string, name = 'there'): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:Inter,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 20px">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#1A1A2E;border-radius:16px;border:1px solid rgba(108,60,247,0.2);overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,#6C3CF7,#EC4899);padding:32px;text-align:center">
        <div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:-1px">INDT<span style="color:#FFD700">IX</span></div>
        <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:4px">India's Live Event Platform</div>
      </td></tr>
      <tr><td style="padding:40px 32px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:#E8E8F0;margin-bottom:8px">Hi ${name} 👋</div>
        <div style="font-size:15px;color:#888899;margin-bottom:32px;line-height:1.6">Your one-time password for INDTIX. This code expires in <strong style="color:#E8E8F0">10 minutes</strong>.</div>
        <div style="background:#0A0A0F;border:2px solid #6C3CF7;border-radius:12px;padding:24px;margin:0 auto 32px;display:inline-block">
          <div style="font-size:42px;font-weight:900;color:#A78BFA;letter-spacing:12px;font-family:monospace">${otp}</div>
        </div>
        <div style="font-size:13px;color:#555566;line-height:1.6">
          Never share this code with anyone.<br>INDTIX will never ask for your OTP.<br>
          <span style="color:#EF4444">If you didn't request this, ignore this email.</span>
        </div>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(255,255,255,0.05);padding:20px 32px;text-align:center">
        <div style="font-size:12px;color:#444455">© 2026 INDTIX · India's Live Event Platform</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

// ── Booking confirmation email template ──────────────────────────────────────
function bookingConfirmationHTML(booking: {
  ref: string; event: string; date: string; tier: string
  qty: number; total: number; name: string
}): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:Inter,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 20px">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#1A1A2E;border-radius:16px;border:1px solid rgba(16,185,129,0.2);overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,#059669,#10B981);padding:32px;text-align:center">
        <div style="font-size:48px;margin-bottom:8px">🎟️</div>
        <div style="font-size:22px;font-weight:800;color:#fff">Booking Confirmed!</div>
        <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:4px">Reference: ${booking.ref}</div>
      </td></tr>
      <tr><td style="padding:32px">
        <div style="font-size:16px;color:#E8E8F0;margin-bottom:24px">Hi <strong>${booking.name}</strong>,<br>Your tickets are confirmed. See you there! 🎉</div>
        <table width="100%" style="border:1px solid rgba(108,60,247,0.2);border-radius:10px;overflow:hidden">
          <tr style="background:rgba(108,60,247,0.1)"><td style="padding:10px 16px;font-size:12px;color:#888899;text-transform:uppercase;letter-spacing:1px">Event</td><td style="padding:10px 16px;color:#E8E8F0;font-weight:600">${booking.event}</td></tr>
          <tr><td style="padding:10px 16px;font-size:12px;color:#888899;text-transform:uppercase;letter-spacing:1px;border-top:1px solid rgba(255,255,255,0.04)">Date</td><td style="padding:10px 16px;color:#E8E8F0;border-top:1px solid rgba(255,255,255,0.04)">${booking.date}</td></tr>
          <tr style="background:rgba(108,60,247,0.05)"><td style="padding:10px 16px;font-size:12px;color:#888899;text-transform:uppercase;letter-spacing:1px;border-top:1px solid rgba(255,255,255,0.04)">Tier</td><td style="padding:10px 16px;color:#E8E8F0;border-top:1px solid rgba(255,255,255,0.04)">${booking.tier} × ${booking.qty}</td></tr>
          <tr><td style="padding:10px 16px;font-size:12px;color:#888899;text-transform:uppercase;letter-spacing:1px;border-top:1px solid rgba(255,255,255,0.04)">Total Paid</td><td style="padding:10px 16px;color:#34D399;font-weight:700;border-top:1px solid rgba(255,255,255,0.04)">₹${booking.total.toLocaleString()}</td></tr>
        </table>
        <div style="text-align:center;margin-top:24px">
          <a href="https://www.indtix.com/fan" style="background:linear-gradient(135deg,#6C3CF7,#8B5CF6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;display:inline-block">View My Tickets →</a>
        </div>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(255,255,255,0.05);padding:16px 32px;text-align:center;font-size:12px;color:#444455">© 2026 INDTIX · <a href="https://www.indtix.com" style="color:#6C3CF7">www.indtix.com</a></td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

// ── Email route handlers ──────────────────────────────────────────────────────
import type { Hono } from 'hono'

export function registerEmailRoutes(app: Hono<{ Bindings: any }>) {

  // POST /api/auth/send-otp — generate & email OTP
  app.post('/api/auth/send-otp', async (c) => {
    const body = await c.req.json().catch(() => ({} as any))
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: 'Valid email is required' }, 400)
    }

    const otp = generateOTP()
    const expires = Date.now() + 10 * 60 * 1000  // 10 minutes

    // Store in KV if available, else in-memory map
    if (c.env?.CACHE) {
      await c.env.CACHE.put(`otp:${email}`, JSON.stringify({ otp, expires, attempts: 0 }), { expirationTtl: 600 })
    } else {
      OTP_STORE.set(email, { otp, expires, attempts: 0 })
    }

    const apiKey = c.env?.SENDGRID_API_KEY
    if (apiKey) {
      // Look up user name from DB
      let name = 'there'
      if (c.env?.DB) {
        const user = await c.env.DB.prepare('SELECT name FROM users WHERE email=?').bind(email).first()
        if (user?.name) name = user.name
      }
      const result = await sendEmailViaSendGrid({
        to: email,
        subject: `${otp} — Your INDTIX OTP (valid 10 mins)`,
        html: otpEmailHTML(otp, name),
        apiKey,
      })
      if (!result.success) {
        return c.json({ error: 'Failed to send email', detail: result.error }, 502)
      }
    }

    // In demo mode, return OTP in response (NEVER do this in production)
    const isDev = (c.env?.ENV || 'production') !== 'production'
    return c.json({
      sent: true,
      email,
      ...(isDev ? { _dev_otp: otp } : {}),
      expires_in: 600,
    })
  })

  // POST /api/auth/verify-otp — verify OTP and issue JWT
  app.post('/api/auth/verify-otp', async (c) => {
    const body = await c.req.json().catch(() => ({} as any))
    const { email, otp } = body

    if (!email || !otp) return c.json({ error: 'Email and OTP required' }, 400)

    let stored: { otp: string; expires: number; attempts: number } | null = null

    if (c.env?.CACHE) {
      const raw = await c.env.CACHE.get(`otp:${email}`)
      if (raw) stored = JSON.parse(raw)
    } else {
      stored = OTP_STORE.get(email) || null
    }

    if (!stored) return c.json({ error: 'OTP not found or expired' }, 400)
    if (Date.now() > stored.expires) {
      OTP_STORE.delete(email)
      return c.json({ error: 'OTP has expired. Request a new one.' }, 400)
    }
    if (stored.attempts >= 5) return c.json({ error: 'Too many attempts. Request a new OTP.' }, 429)
    if (stored.otp !== otp.toString()) {
      stored.attempts++
      OTP_STORE.set(email, stored)
      return c.json({ error: 'Invalid OTP', attempts_left: 5 - stored.attempts }, 400)
    }

    // OTP valid — clean up and find/create user
    OTP_STORE.delete(email)
    if (c.env?.CACHE) await c.env.CACHE.delete(`otp:${email}`)

    let user: any = null
    if (c.env?.DB) {
      user = await c.env.DB.prepare('SELECT * FROM users WHERE email=?').bind(email).first()
      if (!user) {
        // Auto-create account for new OTP users
        const id = `u_${Date.now()}`
        await c.env.DB.prepare(
          'INSERT INTO users (id, email, name, role, created_at) VALUES (?,?,?,?,?)'
        ).bind(id, email, email.split('@')[0], 'fan', new Date().toISOString()).run()
        user = { id, email, name: email.split('@')[0], role: 'fan' }
      }
    } else {
      user = { id: `demo_${Date.now()}`, email, name: email.split('@')[0], role: 'fan' }
    }

    // Issue JWT (reuse auth module)
    const { signJWT } = await import('./auth')
    const secret = c.env?.JWT_SECRET || 'demo-secret-32-chars-minimum-key!'
    const accessToken = await signJWT({ sub: user.id, email: user.email, role: user.role, name: user.name }, secret, '15m')

    return c.json({
      success: true,
      token: accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  })

  // POST /api/notifications/send — send notification email (internal use)
  app.post('/api/notifications/send', async (c) => {
    const body = await c.req.json().catch(() => ({} as any))
    const { type, to, data } = body

    const apiKey = c.env?.SENDGRID_API_KEY
    if (!apiKey) {
      return c.json({ queued: true, _demo: true, note: 'Set SENDGRID_API_KEY to enable real emails' })
    }

    let html = '', subject = ''
    if (type === 'booking_confirmation') {
      subject = `✅ Booking Confirmed — ${data?.event || 'Your Event'}`
      html = bookingConfirmationHTML(data)
    } else {
      subject = data?.subject || 'Notification from INDTIX'
      html = data?.html || `<p>${data?.message || 'You have a new notification from INDTIX.'}</p>`
    }

    const result = await sendEmailViaSendGrid({ to, subject, html, apiKey })
    return c.json(result)
  })
}
