// ═══════════════════════════════════════════════════════════════════════════
// INDTIX — src/images.ts
// Cloudflare Images + CDN optimization layer
// ═══════════════════════════════════════════════════════════════════════════

// ── Cloudflare Images delivery URL builder ───────────────────────────────────
export function cfImageUrl(opts: {
  imageId: string          // Cloudflare Images image ID or path
  accountHash?: string     // CF account hash (from env)
  variant?: string         // CF Images delivery variant name
  width?: number
  height?: number
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad'
  quality?: number         // 1-100
  format?: 'webp' | 'avif' | 'auto'
}): string {
  const {
    imageId, accountHash, variant = 'public',
    width, height, fit = 'cover', quality = 85, format = 'auto'
  } = opts

  // CF Images delivery URL: https://imagedelivery.net/{accountHash}/{imageId}/{variant}
  if (accountHash) {
    return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
  }

  // CF Workers Image Resizing (when no Images account): /cdn-cgi/image/
  const transforms: string[] = []
  if (width) transforms.push(`width=${width}`)
  if (height) transforms.push(`height=${height}`)
  transforms.push(`fit=${fit}`)
  transforms.push(`quality=${quality}`)
  transforms.push(`format=${format}`)

  return `/cdn-cgi/image/${transforms.join(',')}/${imageId}`
}

// ── Generate optimized event poster placeholder ───────────────────────────────
export function eventPosterSVG(opts: {
  title: string
  category?: string
  gradient?: [string, string]
  width?: number
  height?: number
}): string {
  const { title, category = '', gradient = ['#6C3CF7', '#EC4899'], width = 800, height = 400 } = opts
  const [c1, c2] = gradient
  const line1 = title.slice(0, 24)
  const line2 = title.length > 24 ? title.slice(24, 48) : ''

  return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="30"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="#0A0A0F"/>
  <rect width="${width}" height="${height}" fill="url(#g)" opacity="0.4"/>
  <circle cx="80" cy="80" r="120" fill="${c1}" opacity="0.15" filter="url(#blur)"/>
  <circle cx="${width - 60}" cy="${height - 60}" r="100" fill="${c2}" opacity="0.15" filter="url(#blur)"/>
  ${category ? `<rect x="24" y="24" width="${category.length * 9 + 20}" height="28" rx="6" fill="${c1}" opacity="0.8"/>
  <text x="34" y="42" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="600" fill="white">${category}</text>` : ''}
  <text x="${width / 2}" y="${height / 2 - (line2 ? 14 : 0)}" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="${width > 400 ? '28' : '20'}" font-weight="800" fill="white" opacity="0.95">${line1}</text>
  ${line2 ? `<text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="${width > 400 ? '24' : '16'}" font-weight="700" fill="white" opacity="0.8">${line2}</text>` : ''}
  <text x="${width - 16}" y="${height - 16}" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="12" fill="white" opacity="0.4">INDTIX</text>
</svg>`)}`
}

// ── Category gradient map ─────────────────────────────────────────────────────
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  'Music': ['#6C3CF7', '#EC4899'],
  'Comedy': ['#F59E0B', '#EF4444'],
  'Sports': ['#10B981', '#3B82F6'],
  'Theatre': ['#8B5CF6', '#6366F1'],
  'Dance': ['#EC4899', '#F59E0B'],
  'Festival': ['#F59E0B', '#10B981'],
  'Conference': ['#3B82F6', '#6C3CF7'],
  'Exhibition': ['#6366F1', '#8B5CF6'],
  'Food': ['#EF4444', '#F59E0B'],
  'Kids': ['#10B981', '#EC4899'],
}

export function getCategoryGradient(category: string): [string, string] {
  return CATEGORY_GRADIENTS[category] || ['#6C3CF7', '#8B5CF6']
}

// ── Image upload route (to Cloudflare Images) ────────────────────────────────
import type { Hono } from 'hono'

export function registerImageRoutes(app: Hono<{ Bindings: any }>) {

  // GET /api/images/config — return CF Images config for frontend
  app.get('/api/images/config', (c) => {
    return c.json({
      account_hash: c.env?.CF_IMAGES_ACCOUNT_HASH || null,
      upload_enabled: !!(c.env?.CF_IMAGES_API_TOKEN),
      cdn_enabled: !!(c.env?.CF_IMAGES_ACCOUNT_HASH),
      _demo: !(c.env?.CF_IMAGES_ACCOUNT_HASH),
    })
  })

  // POST /api/images/upload — upload image to Cloudflare Images
  app.post('/api/images/upload', async (c) => {
    const accountId = c.env?.CF_ACCOUNT_ID
    const apiToken = c.env?.CF_IMAGES_API_TOKEN

    if (!accountId || !apiToken) {
      return c.json({
        error: 'CF_ACCOUNT_ID and CF_IMAGES_API_TOKEN not configured',
        demo_url: '/static/placeholder.svg',
        _demo: true,
      }, 200)
    }

    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) return c.json({ error: 'No file provided' }, 400)
    if (file.size > 10 * 1024 * 1024) return c.json({ error: 'File too large (max 10MB)' }, 400)

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowed.includes(file.type)) return c.json({ error: 'Invalid file type' }, 400)

    const uploadForm = new FormData()
    uploadForm.append('file', file)

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiToken}` },
        body: uploadForm,
      }
    )

    const data = await res.json() as any
    if (!data.success) {
      return c.json({ error: data.errors?.[0]?.message || 'Upload failed' }, 502)
    }

    const imageId = data.result.id
    const accountHash = c.env?.CF_IMAGES_ACCOUNT_HASH
    const url = accountHash
      ? `https://imagedelivery.net/${accountHash}/${imageId}/public`
      : data.result.variants?.[0]

    return c.json({ success: true, image_id: imageId, url, variants: data.result.variants })
  })

  // GET /api/images/placeholder/:category — return SVG placeholder for category
  app.get('/api/images/placeholder/:category', (c) => {
    const category = c.req.param('category') || 'Event'
    const title = c.req.query('title') || category
    const width = parseInt(c.req.query('w') || '800')
    const height = parseInt(c.req.query('h') || '400')
    const gradient = getCategoryGradient(category)

    c.header('Content-Type', 'image/svg+xml')
    c.header('Cache-Control', 'public, max-age=86400')

    const colors = gradient
    const [c1, c2] = colors
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#0A0A0F"/>
  <rect width="${width}" height="${height}" fill="url(#g)" opacity="0.35"/>
  <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="800" fill="white" opacity="0.9">${title.slice(0,30)}</text>
  <text x="50%" y="62%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="14" fill="white" opacity="0.5">${category}</text>
</svg>`

    return c.body(svgContent)
  })
}
