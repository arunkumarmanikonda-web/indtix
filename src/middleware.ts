/**
 * INDTIX — Global Middleware
 * Security headers, rate limiting, request validation, structured logging,
 * error handling, and CORS for the Cloudflare Workers runtime.
 */

import type { MiddlewareHandler } from 'hono'
import { extractUser, hasRole, type UserRole } from './auth'

// ─── Types ─────────────────────────────────────────────────────────────────

interface RateLimitEntry { count: number; resetAt: number }

// In-process rate-limit store (per isolate — resets on cold start)
// For multi-region production use Cloudflare KV or Durable Objects
const RL_STORE = new Map<string, RateLimitEntry>()

// ─── 1. Security Headers ──────────────────────────────────────────────────

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next()
  c.header('X-Content-Type-Options',   'nosniff')
  c.header('X-Frame-Options',          'DENY')
  c.header('X-XSS-Protection',         '1; mode=block')
  c.header('Referrer-Policy',          'strict-origin-when-cross-origin')
  c.header('Permissions-Policy',       'camera=(), microphone=(), geolocation=(self)')
  c.header('Strict-Transport-Security','max-age=31536000; includeSubDomains; preload')
  c.header('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https: http:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests"
  )
}

// ─── 2. Rate Limiting ─────────────────────────────────────────────────────

interface RateLimitOptions {
  windowMs: number    // window size in ms
  max: number         // max requests per window
  keyFn?: (c: any) => string  // custom key function
  message?: string
}

export function rateLimit(opts: RateLimitOptions): MiddlewareHandler {
  const { windowMs, max, keyFn, message } = opts
  return async (c, next) => {
    const key = keyFn ? keyFn(c)
      : `rl:${c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'}:${new URL(c.req.url).pathname}`

    const now = Date.now()
    let entry = RL_STORE.get(key)

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs }
      RL_STORE.set(key, entry)
    }

    entry.count++
    c.header('X-RateLimit-Limit',     String(max))
    c.header('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)))
    c.header('X-RateLimit-Reset',     String(Math.ceil(entry.resetAt / 1000)))

    if (entry.count > max) {
      return c.json({
        error: message ?? 'Too many requests',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      }, 429)
    }
    await next()
  }
}

// Pre-configured rate limiters
export const generalRateLimit = rateLimit({ windowMs: 60_000, max: 120 })   // 120/min
export const authRateLimit    = rateLimit({ windowMs: 15 * 60_000, max: 10, message: 'Too many login attempts. Try again in 15 minutes.' })
export const apiRateLimit     = rateLimit({ windowMs: 60_000, max: 300 })   // 300/min for API

// ─── 3. Auth Middleware (JWT) ─────────────────────────────────────────────

export function requireAuth(allowedRoles?: UserRole[]): MiddlewareHandler {
  return async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const payload    = await extractUser(authHeader, c.env)

    if (!payload) {
      return c.json({
        error: 'Unauthorized',
        hint: 'Include Authorization: Bearer <token> header',
      }, 401)
    }

    if (allowedRoles && !hasRole(payload.role, allowedRoles)) {
      return c.json({
        error: 'Forbidden',
        hint: `Required role: ${allowedRoles.join(' or ')}`,
      }, 403)
    }

    // Attach to context for downstream handlers
    c.set('user', payload)
    await next()
  }
}

// Optional auth — attaches user if token present, doesn't block if missing
export const optionalAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader) {
    const payload = await extractUser(authHeader, c.env)
    if (payload) c.set('user', payload)
  }
  await next()
}

// ─── 4. Request Validation ────────────────────────────────────────────────

// Simple schema validator (Zod-like shape, no Zod dependency needed in CF Workers)
type ValidationSchema = Record<string, {
  type: 'string' | 'number' | 'boolean' | 'email' | 'url'
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
}>

export function validateBody(schema: ValidationSchema): MiddlewareHandler {
  return async (c, next) => {
    let body: Record<string, unknown> = {}
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    const errors: string[] = []

    for (const [field, rules] of Object.entries(schema)) {
      const val = body[field]

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`${field} is required`)
        continue
      }
      if (val === undefined || val === null) continue

      if (rules.type === 'email' && typeof val === 'string') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          errors.push(`${field} must be a valid email`)
      }
      if (rules.type === 'string' && typeof val !== 'string')
        errors.push(`${field} must be a string`)
      if (rules.type === 'number' && typeof val !== 'number')
        errors.push(`${field} must be a number`)
      if (rules.minLength && typeof val === 'string' && val.length < rules.minLength)
        errors.push(`${field} must be at least ${rules.minLength} characters`)
      if (rules.maxLength && typeof val === 'string' && val.length > rules.maxLength)
        errors.push(`${field} must be at most ${rules.maxLength} characters`)
      if (rules.min && typeof val === 'number' && val < rules.min)
        errors.push(`${field} must be at least ${rules.min}`)
      if (rules.max && typeof val === 'number' && val > rules.max)
        errors.push(`${field} must be at most ${rules.max}`)
      if (rules.pattern && typeof val === 'string' && !rules.pattern.test(val))
        errors.push(`${field} format is invalid`)
    }

    if (errors.length) {
      return c.json({ error: 'Validation failed', details: errors }, 422)
    }

    c.set('validatedBody', body)
    await next()
  }
}

// ─── 5. Structured Request Logging ───────────────────────────────────────

export const structuredLogger: MiddlewareHandler = async (c, next) => {
  const start   = Date.now()
  const method  = c.req.method
  const path    = new URL(c.req.url).pathname
  const ip      = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? 'unknown'
  const country = c.req.header('CF-IPCountry') ?? 'XX'
  const ua      = c.req.header('User-Agent') ?? ''

  await next()

  const duration = Date.now() - start
  const status   = c.res.status

  // Log as JSON (consumed by Cloudflare Workers tail workers / Logpush)
  const log = {
    ts:       new Date().toISOString(),
    method,
    path,
    status,
    duration,
    ip,
    country,
    ua:       ua.slice(0, 100),
    cf_ray:   c.req.header('CF-Ray') ?? null,
  }

  // In production, use Workers Analytics Engine or Logpush
  // console.log(JSON.stringify(log))  // disabled in prod (see console suppressor)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${log.ts}] ${method} ${path} ${status} ${duration}ms`)
  }
}

// ─── 6. Global Error Handler ─────────────────────────────────────────────

export const globalErrorHandler = (err: Error, c: any) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`)
  const status = (err as any).status ?? 500
  const isDev  = (c.env?.ENV ?? 'production') === 'development'

  return c.json({
    error:   err.message || 'Internal server error',
    code:    (err as any).code ?? 'INTERNAL_ERROR',
    ...(isDev ? { stack: err.stack } : {}),
    requestId: c.req.header('CF-Ray') ?? crypto.randomUUID(),
    ts:      new Date().toISOString(),
  }, status)
}

// ─── 7. Cache-Control Helpers ─────────────────────────────────────────────

export const noCache: MiddlewareHandler = async (c, next) => {
  await next()
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate')
  c.header('Pragma', 'no-cache')
}

export function cacheFor(seconds: number): MiddlewareHandler {
  return async (c, next) => {
    await next()
    c.header('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`)
  }
}

// ─── 8. CORS (more specific than the global one) ──────────────────────────

export const strictCors: MiddlewareHandler = async (c, next) => {
  const origin  = c.req.header('Origin') ?? ''
  const allowed = [
    'https://indtix.pages.dev',
    'https://www.indtix.com',
    'https://admin.indtix.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ]

  const isAllowed = allowed.some(a => origin.startsWith(a)) || !origin

  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Origin',  isAllowed ? origin : allowed[0])
    c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Request-ID')
    c.header('Access-Control-Max-Age',       '86400')
    return c.text('', 204)
  }

  c.header('Access-Control-Allow-Origin', isAllowed ? origin || '*' : allowed[0])
  c.header('Vary', 'Origin')
  await next()
}

// ─── 9. Request ID ────────────────────────────────────────────────────────

export const requestId: MiddlewareHandler = async (c, next) => {
  const id = c.req.header('X-Request-ID') ?? crypto.randomUUID()
  c.set('requestId', id)
  await next()
  c.header('X-Request-ID', id)
}

// ─── 10. Body Size Limit ─────────────────────────────────────────────────

export function bodyLimit(maxBytes: number): MiddlewareHandler {
  return async (c, next) => {
    const contentLength = parseInt(c.req.header('Content-Length') ?? '0')
    if (contentLength > maxBytes) {
      return c.json({ error: `Request body too large (max ${maxBytes} bytes)` }, 413)
    }
    await next()
  }
}
