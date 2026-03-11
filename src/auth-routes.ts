/**
 * INDTIX — Production Auth Routes
 * Replaces the demo auth in index.ts with JWT + PBKDF2 implementation
 * Uses real D1 database when available, falls back to in-memory demo store
 */

import type { Hono } from 'hono'
import {
  hashPassword, verifyPassword, createTokens, verifyJWT, findDemoUser,
  DEMO_PASSWORDS_PLAIN, PORTAL_ROLES, type AuthUser,
} from './auth'
import { db, type D1Env } from './db'
import {
  authRateLimit, requireAuth, validateBody, noCache,
} from './middleware'

// ─── Login Schema ──────────────────────────────────────────────────────────
const LOGIN_SCHEMA = {
  email:    { type: 'email'  as const, required: true },
  password: { type: 'string' as const, required: true, minLength: 6, maxLength: 128 },
}

export function registerAuthRoutes(app: Hono<any>) {

  // ── POST /api/auth/login ──────────────────────────────────────────────────
  app.post('/api/auth/login', authRateLimit, noCache, async (c: any) => {
    let body: { email?: string; password?: string } = {}
    try { body = await c.req.json() } catch {
      return c.json({ success: false, error: 'Invalid JSON body' }, 400)
    }

    const email    = (body.email ?? '').toLowerCase().trim()
    const password = body.password ?? ''

    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400)
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRx.test(email)) {
      return c.json({ success: false, error: 'Invalid email format' }, 400)
    }

    try {
      const env: D1Env = c.env ?? {}
      let user: AuthUser | null = null

      // ── 1. Try real D1 database first ─────────────────────────────
      if (env.DB) {
        const dbUser = await db(env).users.byEmail(email)
        if (dbUser) {
          const valid = await verifyPassword(password, dbUser.password_hash)
          if (!valid) {
            // Constant-time rejection to prevent timing attacks
            await new Promise(r => setTimeout(r, 200 + Math.random() * 100))
            return c.json({ success: false, error: 'Invalid credentials' }, 401)
          }
          user = {
            userId:   dbUser.id,
            name:     dbUser.name,
            email:    dbUser.email,
            role:     dbUser.role,
            badge:    dbUser.badge ?? '',
            avatar:   dbUser.avatar_url ?? '',
            orgId:    dbUser.org_id ?? null,
            venueId:  dbUser.venue_id ?? null,
          }
          // Update last login (fire-and-forget)
          db(env).users.updateLastLogin(user.userId).catch(() => {})
        }
      }

      // ── 2. Fall back to demo in-memory store ──────────────────────
      if (!user) {
        const demoUser = findDemoUser(email)
        if (!demoUser) {
          await new Promise(r => setTimeout(r, 200 + Math.random() * 100))
          return c.json({ success: false, error: 'Invalid credentials', hint: 'Try demo credentials from the portal login page' }, 401)
        }

        // For demo users, check plain-text password OR accept empty password in dev
        const expectedPw = DEMO_PASSWORDS_PLAIN[email]
        const isDevBypass = (c.env?.ENV === 'development') && password === ''
        const pwMatch     = password === expectedPw || isDevBypass

        if (!pwMatch) {
          await new Promise(r => setTimeout(r, 200 + Math.random() * 100))
          return c.json({ success: false, error: 'Invalid credentials' }, 401)
        }

        user = {
          userId:  demoUser.userId,
          name:    demoUser.name,
          email:   demoUser.email,
          role:    demoUser.role,
          badge:   demoUser.badge,
          avatar:  demoUser.avatar,
          orgId:   demoUser.orgId,
          venueId: demoUser.venueId,
        }
      }

      // ── 3. Issue JWT tokens ────────────────────────────────────────
      const tokens = await createTokens(user, c.env)

      // Determine accessible portals for this role
      const portals = Object.entries(PORTAL_ROLES)
        .filter(([, roles]) => roles.includes(user!.role))
        .map(([id]) => id)

      // Audit log (fire-and-forget)
      db(env).audit.log({
        userId:     user.userId,
        action:     'login',
        resource:   'auth',
        resourceId: user.userId,
        ip:         c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For'),
      }).catch(() => {})

      return c.json({
        success:      true,
        accessToken:  tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn:    tokens.expiresIn,
        expiresAt:    tokens.expiresAt,
        tokenType:    tokens.tokenType,
        user: {
          userId:  user.userId,
          name:    user.name,
          email:   user.email,
          role:    user.role,
          badge:   user.badge,
          avatar:  user.avatar,
          orgId:   user.orgId,
          venueId: user.venueId,
        },
        portals,
        message: `Welcome back, ${user.name}! 🎉`,
      })
    } catch (e: any) {
      console.error('[AUTH LOGIN ERROR]', e)
      return c.json({ success: false, error: 'Login service temporarily unavailable' }, 500)
    }
  })

  // ── GET /api/auth/me ──────────────────────────────────────────────────────
  app.get('/api/auth/me', requireAuth(), noCache, async (c: any) => {
    const jwtPayload = c.get('user')
    const env: D1Env = c.env ?? {}

    // Try to get fresh data from DB
    if (env.DB) {
      const dbUser = await db(env).users.byId(jwtPayload.sub)
      if (dbUser) {
        return c.json({ success: true, user: {
          userId:  dbUser.id,
          name:    dbUser.name,
          email:   dbUser.email,
          role:    dbUser.role,
          badge:   dbUser.badge,
          avatar:  dbUser.avatar_url,
          orgId:   dbUser.org_id,
          venueId: dbUser.venue_id,
          kyc:     dbUser.kyc_status,
        }})
      }
    }

    // Fallback to JWT payload
    const demoUser = findDemoUser(jwtPayload.email)
    return c.json({
      success: true,
      user: {
        userId:  jwtPayload.sub,
        name:    demoUser?.name ?? 'User',
        email:   jwtPayload.email,
        role:    jwtPayload.role,
        orgId:   jwtPayload.orgId,
        venueId: jwtPayload.venueId,
      },
    })
  })

  // ── POST /api/auth/logout ─────────────────────────────────────────────────
  app.post('/api/auth/logout', noCache, async (c: any) => {
    // With JWTs, logout is client-side (delete token from storage)
    // If using refresh token rotation, revoke refresh token in DB here
    const auth = c.req.header('Authorization')
    if (auth && c.env?.DB) {
      // Could revoke refresh token from DB — omitted for brevity
    }
    return c.json({ success: true, message: 'Logged out successfully. Please clear your local token.' })
  })

  // ── POST /api/auth/refresh ────────────────────────────────────────────────
  app.post('/api/auth/refresh', noCache, async (c: any) => {
    let body: { refreshToken?: string } = {}
    try { body = await c.req.json() } catch {}

    const refreshToken = body.refreshToken
    if (!refreshToken) {
      return c.json({ success: false, error: 'refreshToken required' }, 400)
    }

    const payload = await verifyJWT(refreshToken, c.env?.JWT_SECRET ?? 'indtix-dev-secret-change-in-production-min32chars!')
    if (!payload) {
      return c.json({ success: false, error: 'Invalid or expired refresh token' }, 401)
    }

    // Find user and re-issue tokens
    const demoUser = findDemoUser(payload.email)
    if (!demoUser) {
      return c.json({ success: false, error: 'User not found' }, 401)
    }

    const user: AuthUser = {
      userId:  demoUser.userId,
      name:    demoUser.name,
      email:   demoUser.email,
      role:    demoUser.role,
      badge:   demoUser.badge,
      avatar:  demoUser.avatar,
      orgId:   demoUser.orgId,
      venueId: demoUser.venueId,
    }

    const tokens = await createTokens(user, c.env)
    return c.json({
      success:     true,
      accessToken: tokens.accessToken,
      expiresIn:   tokens.expiresIn,
      expiresAt:   tokens.expiresAt,
    })
  })

  // ── GET /api/auth/portals ─────────────────────────────────────────────────
  app.get('/api/auth/portals', async (c: any) => {
    const auth    = c.req.header('Authorization')
    const payload = auth ? await verifyJWT(auth.replace('Bearer ', ''), c.env?.JWT_SECRET ?? 'indtix-dev-secret-change-in-production-min32chars!') : null
    const role    = payload?.role ?? 'fan'

    const ALL_PORTALS = [
      { id: 'fan',           name: 'Fan Portal',          url: '/fan.html',           icon: '🎵', description: 'Discover events, buy tickets, manage your fan life',          roles: PORTAL_ROLES.fan },
      { id: 'admin',         name: 'Super Admin Console', url: '/admin.html',          icon: '👑', description: 'Full platform control, approvals, analytics',               roles: PORTAL_ROLES.admin },
      { id: 'organiser',     name: 'Organiser Dashboard', url: '/organiser.html',      icon: '🎪', description: 'Create and manage your events',                              roles: PORTAL_ROLES.organiser },
      { id: 'venue',         name: 'Venue Manager',       url: '/venue.html',          icon: '🏟️', description: 'Manage your venue, bookings and operations',                roles: PORTAL_ROLES.venue },
      { id: 'event-manager', name: 'Event Manager',       url: '/event-manager.html',  icon: '🎭', description: 'Runsheets, lineups, on-ground operations',                   roles: PORTAL_ROLES['event-manager'] },
      { id: 'ops',           name: 'Operations Centre',   url: '/ops.html',            icon: '⚙️', description: 'Payments, fraud, compliance, system health',                roles: PORTAL_ROLES.ops },
    ]

    const accessible = ALL_PORTALS.filter(p => p.roles.includes(role as UserRole))
    return c.json({ portals: accessible, role })
  })

  // ── POST /api/auth/register (public registration) ────────────────────────
  app.post('/api/auth/register', authRateLimit, noCache, async (c: any) => {
    let body: any = {}
    try { body = await c.req.json() } catch {
      return c.json({ success: false, error: 'Invalid JSON body' }, 400)
    }

    const { email, password, name, phone } = body

    // Validation
    if (!email || !password || !name) {
      return c.json({ success: false, error: 'email, password and name are required' }, 400)
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ success: false, error: 'Invalid email format' }, 400)
    }
    if (password.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return c.json({ success: false, error: 'Password must contain uppercase, lowercase and a number' }, 400)
    }

    const env: D1Env = c.env ?? {}

    // Check existing user
    if (env.DB) {
      const existing = await db(env).users.byEmail(email)
      if (existing) {
        return c.json({ success: false, error: 'An account with this email already exists' }, 409)
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)
    const userId       = 'USR-' + crypto.randomUUID().slice(0, 8).toUpperCase()

    // Insert user
    if (env.DB) {
      try {
        await (env.DB as any).prepare(
          `INSERT INTO users (id,email,name,password_hash,role,is_active) VALUES (?,?,?,?,'fan',1)`
        ).bind(userId, email.toLowerCase(), name, passwordHash).run()
      } catch (e: any) {
        if (e.message?.includes('UNIQUE')) {
          return c.json({ success: false, error: 'Email already registered' }, 409)
        }
        throw e
      }
    }

    const user: AuthUser = {
      userId, name, email: email.toLowerCase(),
      role: 'fan', badge: 'New Fan', avatar: '🎵',
      orgId: null, venueId: null,
    }

    const tokens = await createTokens(user, c.env)

    return c.json({
      success:     true,
      accessToken: tokens.accessToken,
      expiresIn:   tokens.expiresIn,
      user: { userId, name, email: email.toLowerCase(), role: 'fan' },
      message: `Welcome to INDTIX, ${name}! 🎉`,
    }, 201)
  })

  // ── POST /api/auth/change-password ────────────────────────────────────────
  app.post('/api/auth/change-password', requireAuth(), noCache, async (c: any) => {
    let body: any = {}
    try { body = await c.req.json() } catch {}

    const { currentPassword, newPassword } = body
    if (!currentPassword || !newPassword) {
      return c.json({ success: false, error: 'currentPassword and newPassword required' }, 400)
    }
    if (newPassword.length < 8) {
      return c.json({ success: false, error: 'New password must be at least 8 characters' }, 400)
    }

    const jwtUser  = c.get('user')
    const env: D1Env = c.env ?? {}

    if (!env.DB) {
      return c.json({ success: false, error: 'Password change requires database connection' }, 503)
    }

    const dbUser = await db(env).users.byEmail(jwtUser.email)
    if (!dbUser) return c.json({ success: false, error: 'User not found' }, 404)

    const valid = await verifyPassword(currentPassword, dbUser.password_hash)
    if (!valid) return c.json({ success: false, error: 'Current password is incorrect' }, 401)

    const newHash = await hashPassword(newPassword)
    await (env.DB as any).prepare('UPDATE users SET password_hash=?, updated_at=? WHERE id=?')
      .bind(newHash, Math.floor(Date.now()/1000), dbUser.id).run()

    return c.json({ success: true, message: 'Password updated successfully' })
  })
}
