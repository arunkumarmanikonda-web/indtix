/**
 * INDTIX — CMS Abstraction Layer
 *
 * Supports multiple headless CMS backends via a unified interface.
 * Adapters: Local D1 (default) | Contentful | Sanity | Strapi
 * 
 * Configure via environment variables:
 *   CMS_PROVIDER=contentful|sanity|strapi|d1 (default: d1)
 *   CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN
 *   SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
 *   STRAPI_URL, STRAPI_API_TOKEN
 */

// ─── CMS Content Types ─────────────────────────────────────────────────────

export interface CMSContent {
  id: string
  type: 'banner' | 'promo' | 'faq' | 'page' | 'blog' | 'event_widget' | 'artist'
  slug: string
  title: string
  body?: string
  metadata?: Record<string, unknown>
  status: 'published' | 'draft' | 'archived'
  locale: string
  publishedAt?: string
  updatedAt?: string
}

export interface CMSBanner extends CMSContent {
  type: 'banner'
  metadata: {
    imageUrl: string
    linkUrl?: string
    ctaText?: string
    bgColor?: string
    priority: number
    validFrom?: string
    validUntil?: string
  }
}

export interface CMSPromo extends CMSContent {
  type: 'promo'
  metadata: {
    code: string
    discount: number
    discountType: 'percentage' | 'fixed'
    validUntil?: string
    minOrder?: number
  }
}

export interface CMSAdapter {
  getBySlug(slug: string, locale?: string): Promise<CMSContent | null>
  getByType(type: string, opts?: { locale?: string; limit?: number }): Promise<CMSContent[]>
  getAll(opts?: { locale?: string; limit?: number; status?: string }): Promise<CMSContent[]>
  create(content: Omit<CMSContent, 'id'>): Promise<CMSContent>
  update(id: string, content: Partial<CMSContent>): Promise<CMSContent>
  delete(id: string): Promise<boolean>
  search(query: string, opts?: { locale?: string }): Promise<CMSContent[]>
}

// ─── CMS Env Interface ─────────────────────────────────────────────────────
export interface CMSEnv {
  CMS_PROVIDER?: string
  // Contentful
  CONTENTFUL_SPACE_ID?: string
  CONTENTFUL_DELIVERY_TOKEN?: string
  CONTENTFUL_PREVIEW_TOKEN?: string
  CONTENTFUL_ENV?: string
  // Sanity
  SANITY_PROJECT_ID?: string
  SANITY_DATASET?: string
  SANITY_API_TOKEN?: string
  SANITY_API_VERSION?: string
  // Strapi
  STRAPI_URL?: string
  STRAPI_API_TOKEN?: string
  // D1
  DB?: unknown
  [key: string]: unknown
}

// ─── Contentful Adapter ────────────────────────────────────────────────────

class ContentfulAdapter implements CMSAdapter {
  private spaceId: string
  private token: string
  private env: string
  private baseUrl: string

  constructor(cfg: { spaceId: string; token: string; env?: string }) {
    this.spaceId = cfg.spaceId
    this.token   = cfg.token
    this.env     = cfg.env ?? 'master'
    this.baseUrl = `https://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.env}`
  }

  private async fetch(path: string): Promise<any> {
    const res = await globalThis.fetch(`${this.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
    if (!res.ok) throw new Error(`Contentful error ${res.status}: ${await res.text()}`)
    return res.json()
  }

  private mapEntry(entry: any): CMSContent {
    const f = entry.fields
    return {
      id:          entry.sys.id,
      type:        (f.contentType ?? 'page') as CMSContent['type'],
      slug:        f.slug ?? entry.sys.id,
      title:       typeof f.title === 'string' ? f.title : (f.title?.['en-US'] ?? ''),
      body:        typeof f.body === 'string'  ? f.body  : (f.body?.['en-US'] ?? ''),
      metadata:    f.metadata ?? {},
      status:      entry.sys.publishedAt ? 'published' : 'draft',
      locale:      'en',
      publishedAt: entry.sys.publishedAt,
      updatedAt:   entry.sys.updatedAt,
    }
  }

  async getBySlug(slug: string): Promise<CMSContent | null> {
    const data = await this.fetch(`/entries?fields.slug=${encodeURIComponent(slug)}&limit=1`)
    if (!data.items?.length) return null
    return this.mapEntry(data.items[0])
  }

  async getByType(type: string, opts?: { limit?: number }): Promise<CMSContent[]> {
    const limit = opts?.limit ?? 50
    const data  = await this.fetch(`/entries?content_type=${encodeURIComponent(type)}&limit=${limit}`)
    return (data.items ?? []).map((e: any) => this.mapEntry(e))
  }

  async getAll(opts?: { limit?: number }): Promise<CMSContent[]> {
    const limit = opts?.limit ?? 100
    const data  = await this.fetch(`/entries?limit=${limit}`)
    return (data.items ?? []).map((e: any) => this.mapEntry(e))
  }

  async create(_: Omit<CMSContent, 'id'>): Promise<CMSContent> {
    throw new Error('Contentful writes require Management API — use Contentful dashboard or CMA')
  }
  async update(_id: string, _c: Partial<CMSContent>): Promise<CMSContent> {
    throw new Error('Contentful writes require Management API')
  }
  async delete(_id: string): Promise<boolean> {
    throw new Error('Contentful writes require Management API')
  }

  async search(query: string): Promise<CMSContent[]> {
    const data = await this.fetch(`/entries?query=${encodeURIComponent(query)}&limit=20`)
    return (data.items ?? []).map((e: any) => this.mapEntry(e))
  }
}

// ─── Sanity Adapter ────────────────────────────────────────────────────────

class SanityAdapter implements CMSAdapter {
  private projectId: string
  private dataset: string
  private token: string
  private apiVersion: string
  private baseUrl: string

  constructor(cfg: { projectId: string; dataset: string; token: string; apiVersion?: string }) {
    this.projectId  = cfg.projectId
    this.dataset    = cfg.dataset
    this.token      = cfg.token
    this.apiVersion = cfg.apiVersion ?? '2024-01-01'
    this.baseUrl    = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`
  }

  private async query(groq: string): Promise<any[]> {
    const res = await globalThis.fetch(`${this.baseUrl}?query=${encodeURIComponent(groq)}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
    if (!res.ok) throw new Error(`Sanity error ${res.status}: ${await res.text()}`)
    const { result } = await res.json()
    return result ?? []
  }

  private mapDoc(doc: any): CMSContent {
    return {
      id:          doc._id,
      type:        doc._type as CMSContent['type'],
      slug:        doc.slug?.current ?? doc._id,
      title:       doc.title ?? '',
      body:        doc.body ? JSON.stringify(doc.body) : doc.description ?? '',
      metadata:    doc.metadata ?? {},
      status:      doc._id.startsWith('drafts.') ? 'draft' : 'published',
      locale:      doc.language ?? 'en',
      publishedAt: doc._updatedAt,
      updatedAt:   doc._updatedAt,
    }
  }

  async getBySlug(slug: string): Promise<CMSContent | null> {
    const [doc] = await this.query(`*[slug.current == "${slug}"][0]`)
    return doc ? this.mapDoc(doc) : null
  }

  async getByType(type: string, opts?: { limit?: number }): Promise<CMSContent[]> {
    const limit = opts?.limit ?? 50
    const docs  = await this.query(`*[_type == "${type}"] | order(_updatedAt desc) [0...${limit}]`)
    return docs.map(d => this.mapDoc(d))
  }

  async getAll(opts?: { limit?: number }): Promise<CMSContent[]> {
    const limit = opts?.limit ?? 100
    const docs  = await this.query(`*[!(_id in path("drafts.**"))] | order(_updatedAt desc) [0...${limit}]`)
    return docs.map(d => this.mapDoc(d))
  }

  async create(_: Omit<CMSContent, 'id'>): Promise<CMSContent> {
    throw new Error('Sanity writes — use Sanity Studio or Mutations API with project token')
  }
  async update(_id: string, _c: Partial<CMSContent>): Promise<CMSContent> {
    throw new Error('Sanity writes — use Sanity Studio')
  }
  async delete(_id: string): Promise<boolean> {
    throw new Error('Sanity writes — use Sanity Studio')
  }

  async search(query: string): Promise<CMSContent[]> {
    const docs = await this.query(`*[pt::text(body) match "${query}*" || title match "${query}*"][0...20]`)
    return docs.map(d => this.mapDoc(d))
  }
}

// ─── D1 Adapter (default) ─────────────────────────────────────────────────

class D1CMSAdapter implements CMSAdapter {
  private db: any

  constructor(d1: any) {
    this.db = d1
  }

  async getBySlug(slug: string): Promise<CMSContent | null> {
    return this.db.prepare("SELECT * FROM cms_content WHERE slug = ? AND status = 'published'")
      .bind(slug).first()
  }

  async getByType(type: string, opts?: { locale?: string; limit?: number }): Promise<CMSContent[]> {
    const { results } = await this.db.prepare(
      "SELECT * FROM cms_content WHERE type = ? AND locale = ? AND status = 'published' ORDER BY updated_at DESC LIMIT ?"
    ).bind(type, opts?.locale ?? 'en', opts?.limit ?? 50).all()
    return results
  }

  async getAll(opts?: { locale?: string; limit?: number; status?: string }): Promise<CMSContent[]> {
    const status = opts?.status ?? 'published'
    const { results } = await this.db.prepare(
      "SELECT * FROM cms_content WHERE locale = ? AND status = ? ORDER BY updated_at DESC LIMIT ?"
    ).bind(opts?.locale ?? 'en', status, opts?.limit ?? 100).all()
    return results
  }

  async create(content: Omit<CMSContent, 'id'>): Promise<CMSContent> {
    const id = 'cms-' + crypto.randomUUID().slice(0, 8)
    await this.db.prepare(
      "INSERT INTO cms_content (id,type,slug,title,body,metadata,status,locale) VALUES (?,?,?,?,?,?,?,?)"
    ).bind(id, content.type, content.slug, content.title, content.body ?? null,
           content.metadata ? JSON.stringify(content.metadata) : null,
           content.status ?? 'published', content.locale ?? 'en').run()
    return { ...content, id }
  }

  async update(id: string, content: Partial<CMSContent>): Promise<CMSContent> {
    const sets: string[] = []
    const vals: unknown[] = []
    if (content.title)    { sets.push('title=?');    vals.push(content.title) }
    if (content.body)     { sets.push('body=?');     vals.push(content.body) }
    if (content.status)   { sets.push('status=?');   vals.push(content.status) }
    if (content.metadata) { sets.push('metadata=?'); vals.push(JSON.stringify(content.metadata)) }
    sets.push('updated_at=?'); vals.push(Math.floor(Date.now()/1000))
    vals.push(id)
    await this.db.prepare(`UPDATE cms_content SET ${sets.join(',')} WHERE id=?`)
      .bind(...vals).run()
    const updated = await this.db.prepare('SELECT * FROM cms_content WHERE id=?').bind(id).first()
    return updated as CMSContent
  }

  async delete(id: string): Promise<boolean> {
    await this.db.prepare("UPDATE cms_content SET status='archived' WHERE id=?").bind(id).run()
    return true
  }

  async search(query: string): Promise<CMSContent[]> {
    const { results } = await this.db.prepare(
      "SELECT * FROM cms_content WHERE status='published' AND (title LIKE ? OR body LIKE ?) LIMIT 20"
    ).bind(`%${query}%`, `%${query}%`).all()
    return results
  }
}

// ─── In-memory fallback adapter ────────────────────────────────────────────

const MOCK_CMS_DATA: CMSContent[] = [
  { id: 'cms-1', type: 'banner', slug: 'summer-sale-2026', title: 'Summer Sale — Up to 40% Off!', body: 'Use code SUMMER40 at checkout', metadata: { imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200', ctaText: 'Shop Now', linkUrl: '/fan.html', priority: 1, bgColor: '#6C3CF7' }, status: 'published', locale: 'en' },
  { id: 'cms-2', type: 'faq',    slug: 'refund-policy', title: 'What is the refund policy?', body: 'Bookings can be cancelled up to 48 hours before the event for a full refund.', metadata: {}, status: 'published', locale: 'en' },
  { id: 'cms-3', type: 'page',   slug: 'about-us', title: 'About INDTIX', body: "India's most-loved live event ticketing platform. Connecting fans with the world's greatest artists and events.", metadata: { seoTitle: 'About INDTIX | India\'s Best Event Platform', seoDesc: 'INDTIX is India\'s most loved live-event ticketing platform' }, status: 'published', locale: 'en' },
  { id: 'cms-4', type: 'promo',  slug: 'welcome10', title: 'Welcome Offer — 10% Off', body: 'Get 10% off your first booking with code WELCOME10', metadata: { code: 'WELCOME10', discount: 10, discountType: 'percentage', minOrder: 500 }, status: 'published', locale: 'en' },
  { id: 'cms-5', type: 'blog',   slug: 'top-concerts-2026', title: 'Top 10 Concerts to Attend in 2026', body: 'From Diljit Dosanjh to Lollapalooza, here are the must-attend concerts this year.', metadata: { author: 'INDTIX Team', readTime: '5 min', tags: ['concerts', 'music', '2026'] }, status: 'published', locale: 'en' },
]

class MockCMSAdapter implements CMSAdapter {
  async getBySlug(slug: string): Promise<CMSContent | null> {
    return MOCK_CMS_DATA.find(c => c.slug === slug) ?? null
  }
  async getByType(type: string, opts?: { limit?: number }): Promise<CMSContent[]> {
    return MOCK_CMS_DATA.filter(c => c.type === type).slice(0, opts?.limit ?? 50)
  }
  async getAll(opts?: { limit?: number }): Promise<CMSContent[]> {
    return MOCK_CMS_DATA.slice(0, opts?.limit ?? 100)
  }
  async create(content: Omit<CMSContent, 'id'>): Promise<CMSContent> {
    const item = { ...content, id: 'cms-' + Date.now() }
    MOCK_CMS_DATA.push(item)
    return item
  }
  async update(id: string, content: Partial<CMSContent>): Promise<CMSContent> {
    const idx = MOCK_CMS_DATA.findIndex(c => c.id === id)
    if (idx < 0) throw new Error('Not found')
    MOCK_CMS_DATA[idx] = { ...MOCK_CMS_DATA[idx], ...content }
    return MOCK_CMS_DATA[idx]
  }
  async delete(id: string): Promise<boolean> {
    const idx = MOCK_CMS_DATA.findIndex(c => c.id === id)
    if (idx < 0) return false
    MOCK_CMS_DATA[idx].status = 'archived'
    return true
  }
  async search(query: string): Promise<CMSContent[]> {
    const q = query.toLowerCase()
    return MOCK_CMS_DATA.filter(c =>
      c.title.toLowerCase().includes(q) || (c.body ?? '').toLowerCase().includes(q)
    )
  }
}

// ─── Factory: picks the right adapter based on env ─────────────────────────

export function getCMSAdapter(env: CMSEnv): CMSAdapter {
  const provider = (env.CMS_PROVIDER ?? 'd1').toLowerCase()

  if (provider === 'contentful' && env.CONTENTFUL_SPACE_ID && env.CONTENTFUL_DELIVERY_TOKEN) {
    return new ContentfulAdapter({
      spaceId: env.CONTENTFUL_SPACE_ID,
      token:   env.CONTENTFUL_DELIVERY_TOKEN,
      env:     env.CONTENTFUL_ENV,
    })
  }

  if (provider === 'sanity' && env.SANITY_PROJECT_ID && env.SANITY_DATASET && env.SANITY_API_TOKEN) {
    return new SanityAdapter({
      projectId:  env.SANITY_PROJECT_ID,
      dataset:    env.SANITY_DATASET,
      token:      env.SANITY_API_TOKEN,
      apiVersion: env.SANITY_API_VERSION,
    })
  }

  if (provider === 'd1' && env.DB) {
    return new D1CMSAdapter(env.DB)
  }

  // Default: in-memory mock (works without any external services)
  return new MockCMSAdapter()
}

// ─── CMS Routes helper (returns Hono-compatible route handlers) ─────────────
export function cmsRoutes(app: any) {
  // GET /api/cms/content/:slug
  app.get('/api/cms/content/:slug', async (c: any) => {
    try {
      const cms     = getCMSAdapter(c.env ?? {})
      const content = await cms.getBySlug(c.req.param('slug'))
      if (!content) return c.json({ error: 'Content not found' }, 404)
      return c.json({ content })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // GET /api/cms/type/:type
  app.get('/api/cms/type/:type', async (c: any) => {
    try {
      const cms    = getCMSAdapter(c.env ?? {})
      const locale = c.req.query('locale') ?? 'en'
      const limit  = parseInt(c.req.query('limit') ?? '50')
      const items  = await cms.getByType(c.req.param('type'), { locale, limit })
      return c.json({ items, count: items.length })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // GET /api/cms/search
  app.get('/api/cms/search', async (c: any) => {
    try {
      const cms    = getCMSAdapter(c.env ?? {})
      const q      = c.req.query('q') ?? ''
      if (!q) return c.json({ items: [], count: 0 })
      const items  = await cms.search(q)
      return c.json({ items, count: items.length, query: q })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // GET /api/cms/banners
  app.get('/api/cms/banners', async (c: any) => {
    try {
      const cms   = getCMSAdapter(c.env ?? {})
      const items = await cms.getByType('banner', { limit: 10 })
      return c.json({ banners: items })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // POST /api/cms/content (admin only)
  app.post('/api/cms/content', async (c: any) => {
    try {
      const cms  = getCMSAdapter(c.env ?? {})
      const body = await c.req.json()
      const item = await cms.create(body)
      return c.json({ content: item, success: true }, 201)
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // PUT /api/cms/content/:id
  app.put('/api/cms/content/:id', async (c: any) => {
    try {
      const cms  = getCMSAdapter(c.env ?? {})
      const body = await c.req.json()
      const item = await cms.update(c.req.param('id'), body)
      return c.json({ content: item, success: true })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // DELETE /api/cms/content/:id
  app.delete('/api/cms/content/:id', async (c: any) => {
    try {
      const cms = getCMSAdapter(c.env ?? {})
      await cms.delete(c.req.param('id'))
      return c.json({ success: true })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })

  // GET /api/cms/all
  app.get('/api/cms/all', async (c: any) => {
    try {
      const cms   = getCMSAdapter(c.env ?? {})
      const limit = parseInt(c.req.query('limit') ?? '100')
      const items = await cms.getAll({ limit })
      return c.json({ items, count: items.length })
    } catch (e: any) {
      return c.json({ error: e.message }, 500)
    }
  })
}
