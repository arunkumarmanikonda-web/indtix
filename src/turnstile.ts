// ═══════════════════════════════════════════════════════════════════════════
// INDTIX — src/turnstile.ts
// Cloudflare Turnstile CAPTCHA verification middleware
// ═══════════════════════════════════════════════════════════════════════════

// ── Verify Turnstile token with Cloudflare's siteverify API ─────────────────
export async function verifyTurnstileToken(opts: {
  token: string
  secretKey: string
  ip?: string
}): Promise<{ success: boolean; error?: string }> {
  const { token, secretKey, ip } = opts

  const formData = new FormData()
  formData.append('secret', secretKey)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) return { success: false, error: 'Verification service unavailable' }

  const data = await res.json() as { success: boolean; 'error-codes'?: string[] }
  if (!data.success) {
    return { success: false, error: data['error-codes']?.join(', ') || 'CAPTCHA verification failed' }
  }
  return { success: true }
}

// ── Turnstile middleware — protects sensitive POST routes ────────────────────
export function requireTurnstile() {
  return async (c: any, next: any) => {
    const secretKey = c.env?.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      // No secret configured → skip in demo/dev mode
      return next()
    }

    const body = await c.req.json().catch(() => ({} as any))
    // Re-attach body for next handler (Hono body can only be read once)
    c.set('parsedBody', body)

    const token = body['cf-turnstile-response'] || body.turnstile_token
    if (!token) {
      return c.json({ error: 'CAPTCHA token required. Please complete the CAPTCHA.' }, 400)
    }

    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For')
    const result = await verifyTurnstileToken({ token, secretKey, ip })

    if (!result.success) {
      return c.json({ error: `CAPTCHA failed: ${result.error}` }, 400)
    }

    return next()
  }
}

// ── Turnstile routes ─────────────────────────────────────────────────────────
import type { Hono } from 'hono'

export function registerTurnstileRoutes(app: Hono<{ Bindings: any }>) {

  // GET /api/turnstile/config — return public site key for frontend
  app.get('/api/turnstile/config', (c) => {
    const siteKey = c.env?.TURNSTILE_SITE_KEY || '1x00000000000000000000AA'  // always-passes test key
    return c.json({
      site_key: siteKey,
      enabled: !!c.env?.TURNSTILE_SECRET_KEY,
      _demo: !c.env?.TURNSTILE_SECRET_KEY,
    })
  })
}

// ── Frontend Turnstile widget HTML (inject into login forms) ─────────────────
export const TURNSTILE_WIDGET_HTML = `
<!-- Cloudflare Turnstile CAPTCHA -->
<div id="ix-turnstile-container" style="margin:12px 0;min-height:65px;display:flex;align-items:center;justify-content:center">
  <div id="ix-turnstile" style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:rgba(108,60,247,0.06);border:1px solid rgba(108,60,247,0.2);border-radius:10px;font-size:13px;color:#888899">
    <div id="ix-turnstile-spinner" style="width:16px;height:16px;border:2px solid #6C3CF7;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></div>
    Loading CAPTCHA...
  </div>
</div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>
// Initialize Turnstile widget when CF script loads
window._turnstileReady = false;
function _initTurnstile(siteKey) {
  const container = document.getElementById('ix-turnstile');
  if (!container || window._turnstileReady) return;
  window._turnstileReady = true;
  container.innerHTML = '';
  container.style.background = 'none';
  container.style.border = 'none';
  container.style.padding = '0';
  if (typeof turnstile !== 'undefined') {
    turnstile.render('#ix-turnstile', {
      sitekey: siteKey,
      callback: (token) => {
        window._turnstileToken = token;
        const input = document.getElementById('ix-turnstile-token-input');
        if (input) input.value = token;
      },
      'expired-callback': () => { window._turnstileToken = null; },
      'error-callback': () => { window._turnstileToken = null; },
      theme: 'dark',
      language: 'en',
    });
  }
}
// Fetch site key and initialize
fetch('/api/turnstile/config').then(r=>r.json()).then(d=>{
  if (d.site_key) {
    // Poll until Turnstile script is loaded
    const wait = setInterval(()=>{
      if (typeof turnstile !== 'undefined') {
        clearInterval(wait);
        _initTurnstile(d.site_key);
      }
    }, 200);
    // Fallback: auto-approve in demo mode
    if (d._demo) {
      clearInterval(wait);
      window._turnstileToken = 'demo-token';
      const c = document.getElementById('ix-turnstile');
      if (c) { c.innerHTML = '<span style="color:#34D399;font-size:13px">✅ CAPTCHA bypassed (demo mode)</span>'; }
    }
  }
}).catch(()=>{
  window._turnstileToken = 'demo-token';
  const c = document.getElementById('ix-turnstile');
  if(c) c.innerHTML = '<span style="color:#888;font-size:12px">CAPTCHA unavailable</span>';
});
</script>
<input type="hidden" id="ix-turnstile-token-input" name="cf-turnstile-response" value="">
<style>@keyframes spin{to{transform:rotate(360deg)}}</style>
`
