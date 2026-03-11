// ═══════════════════════════════════════════════════════════════════════════
// INDTIX — src/razorpay.ts
// Razorpay payment gateway integration for Cloudflare Workers
// ═══════════════════════════════════════════════════════════════════════════

export interface RazorpayEnv {
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string
}

// ── Create a Razorpay order ──────────────────────────────────────────────────
export async function createRazorpayOrder(opts: {
  amount: number      // in paise (₹1 = 100 paise)
  currency?: string
  receipt: string
  notes?: Record<string, string>
  keyId: string
  keySecret: string
}) {
  const { amount, currency = 'INR', receipt, notes = {}, keyId, keySecret } = opts
  const auth = btoa(`${keyId}:${keySecret}`)

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency, receipt, notes }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Razorpay order creation failed: ${err}`)
  }
  return res.json() as Promise<{
    id: string; entity: string; amount: number; currency: string
    receipt: string; status: string; created_at: number
  }>
}

// ── Verify Razorpay webhook signature ───────────────────────────────────────
export async function verifyRazorpayWebhook(
  rawBody: string,
  signature: string,
  webhookSecret: string
): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(webhookSecret)
  const msgData = encoder.encode(rawBody)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  return computed === signature
}

// ── Verify payment signature (client-side callback) ─────────────────────────
export async function verifyPaymentSignature(opts: {
  orderId: string
  paymentId: string
  signature: string
  keySecret: string
}): Promise<boolean> {
  const { orderId, paymentId, signature, keySecret } = opts
  const message = `${orderId}|${paymentId}`
  const encoder = new TextEncoder()
  const keyData = encoder.encode(keySecret)
  const msgData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const computed = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  return computed === signature
}

// ── Razorpay route handlers (call from index.ts) ──────────────────────────
import type { Hono } from 'hono'

export function registerRazorpayRoutes(app: Hono<{ Bindings: any }>) {

  // POST /api/payments/order — create Razorpay order
  app.post('/api/payments/order', async (c) => {
    const body = await c.req.json().catch(() => ({} as any))
    const { amount, booking_id, tier, quantity } = body

    if (!amount || amount < 100) {
      return c.json({ error: 'Minimum amount is ₹1 (100 paise)' }, 400)
    }

    const keyId = c.env?.RAZORPAY_KEY_ID
    const keySecret = c.env?.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      // Demo mode — return mock order
      return c.json({
        id: `order_demo_${Date.now()}`,
        amount,
        currency: 'INR',
        receipt: booking_id || `bk_${Date.now()}`,
        status: 'created',
        key_id: 'rzp_test_demo',
        _demo: true,
        _note: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET via wrangler secret put'
      })
    }

    try {
      const order = await createRazorpayOrder({
        amount,
        receipt: booking_id || `bk_${Date.now()}`,
        notes: { tier: tier || '', quantity: String(quantity || 1) },
        keyId,
        keySecret,
      })
      return c.json({ ...order, key_id: keyId })
    } catch (err: any) {
      return c.json({ error: err.message }, 502)
    }
  })

  // POST /api/payments/verify — verify payment after checkout
  app.post('/api/payments/verify', async (c) => {
    const body = await c.req.json().catch(() => ({} as any))
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return c.json({ error: 'Missing payment verification fields' }, 400)
    }

    const keySecret = c.env?.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      // Demo mode — auto-verify
      return c.json({ verified: true, payment_id: razorpay_payment_id, _demo: true })
    }

    const valid = await verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      keySecret,
    })

    if (!valid) return c.json({ error: 'Payment signature mismatch' }, 400)

    // Save to D1 if available
    if (c.env?.DB) {
      await c.env.DB.prepare(
        `UPDATE payment_transactions SET status='paid', payment_id=?, updated_at=? WHERE order_id=?`
      ).bind(razorpay_payment_id, new Date().toISOString(), razorpay_order_id).run()
    }

    return c.json({ verified: true, payment_id: razorpay_payment_id })
  })

  // POST /api/payments/webhook — Razorpay webhook (order.paid, refund.created etc.)
  app.post('/api/payments/webhook', async (c) => {
    const rawBody = await c.req.text()
    const signature = c.req.header('X-Razorpay-Signature') || ''
    const webhookSecret = c.env?.RAZORPAY_WEBHOOK_SECRET || ''

    if (webhookSecret) {
      const valid = await verifyRazorpayWebhook(rawBody, signature, webhookSecret)
      if (!valid) return c.json({ error: 'Invalid webhook signature' }, 401)
    }

    let payload: any
    try { payload = JSON.parse(rawBody) } catch { return c.json({ error: 'Invalid JSON' }, 400) }

    const event = payload?.event
    const paymentEntity = payload?.payload?.payment?.entity

    if (event === 'payment.captured' && c.env?.DB && paymentEntity) {
      await c.env.DB.prepare(
        `UPDATE payment_transactions SET status='paid', payment_id=?, updated_at=? WHERE order_id=?`
      ).bind(paymentEntity.id, new Date().toISOString(), paymentEntity.order_id).run()

      // Update booking status
      await c.env.DB.prepare(
        `UPDATE bookings SET payment_status='paid', updated_at=? WHERE booking_ref=?`
      ).bind(new Date().toISOString(), paymentEntity.receipt || '').run()
    }

    if (event === 'payment.failed' && c.env?.DB && paymentEntity) {
      await c.env.DB.prepare(
        `UPDATE payment_transactions SET status='failed', updated_at=? WHERE order_id=?`
      ).bind(new Date().toISOString(), paymentEntity.order_id).run()
    }

    return c.json({ received: true, event })
  })

  // GET /api/payments/:id — get payment status
  app.get('/api/payments/:id', async (c) => {
    const id = c.req.param('id')
    if (c.env?.DB) {
      const tx = await c.env.DB.prepare(
        'SELECT * FROM payment_transactions WHERE id=? OR payment_id=? OR order_id=?'
      ).bind(id, id, id).first()
      if (tx) return c.json(tx)
    }
    return c.json({ id, status: 'unknown', _demo: true })
  })
}
