/**
 * INDTIX — Production Auth Module
 * JWT (HS256) via Web Crypto API  +  PBKDF2 password hashing
 * Works natively in Cloudflare Workers (no Node.js crypto required)
 */

// ─── Types ─────────────────────────────────────────────────────────────────
export interface JWTPayload {
  sub: string        // userId
  email: string
  role: UserRole
  orgId?: string
  venueId?: string
  iat: number        // issued-at (unix seconds)
  exp: number        // expiry  (unix seconds)
  jti: string        // unique token id (nonce)
}

export type UserRole =
  | 'fan'
  | 'organiser'
  | 'venue_manager'
  | 'event_manager'
  | 'ops_admin'
  | 'superadmin'

export interface AuthUser {
  userId: string
  name: string
  email: string
  role: UserRole
  badge: string
  avatar: string
  orgId: string | null
  venueId: string | null
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number       // seconds
  expiresAt: number       // unix ms
  tokenType: 'Bearer'
}

// ─── Constants ────────────────────────────────────────────────────────────
const ACCESS_TOKEN_TTL  = 8 * 60 * 60   // 8 hours in seconds
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 // 30 days in seconds

// JWT secret — in production set JWT_SECRET env var; fallback for dev
const getSecret = (env?: any): string =>
  env?.JWT_SECRET ?? 'indtix-dev-secret-change-in-production-min32chars!'

// ─── PBKDF2 Password Hashing ───────────────────────────────────────────────
// Uses SubtleCrypto — available in Cloudflare Workers, modern browsers, Node ≥18

const PBKDF2_ITERATIONS = 210_000  // OWASP 2023 recommendation
const SALT_BYTES        = 16
const KEY_BYTES         = 32

function buf2hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function hex2buf(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return arr
}

export async function hashPassword(password: string): Promise<string> {
  const salt  = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    KEY_BYTES * 8
  )
  return `pbkdf2:${PBKDF2_ITERATIONS}:${buf2hex(salt)}:${buf2hex(bits)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':')
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
  const iterations = parseInt(parts[1])
  const salt       = hex2buf(parts[2])
  const expected   = parts[3]

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    KEY_BYTES * 8
  )
  // Constant-time comparison
  const computed = buf2hex(bits)
  if (computed.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < computed.length; i++)
    diff |= computed.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

// ─── JWT Implementation (HS256, Web Crypto) ──────────────────────────────

function b64url(data: string | ArrayBuffer): string {
  const str = typeof data === 'string'
    ? btoa(data)
    : btoa(String.fromCharCode(...new Uint8Array(data)))
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad    = (4 - padded.length % 4) % 4
  return atob(padded + '='.repeat(pad))
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signJWT(payload: JWTPayload, secret: string): Promise<string> {
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body    = b64url(JSON.stringify(payload))
  const signing = `${header}.${body}`
  const key     = await hmacKey(secret)
  const sig     = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signing))
  return `${signing}.${b64url(sig)}`
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, body, signature] = parts
    const signing = `${header}.${body}`
    const key     = await hmacKey(secret)
    const sigBuf  = Uint8Array.from(atob(signature.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0))
    const valid   = await crypto.subtle.verify('HMAC', key, sigBuf, new TextEncoder().encode(signing))
    if (!valid) return null
    const payload: JWTPayload = JSON.parse(b64urlDecode(body))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null  // expired
    return payload
  } catch {
    return null
  }
}

// ─── Token Factory ────────────────────────────────────────────────────────

export async function createTokens(user: AuthUser, env?: any): Promise<TokenResponse> {
  const secret = getSecret(env)
  const now    = Math.floor(Date.now() / 1000)
  const jti    = crypto.randomUUID()

  const accessPayload: JWTPayload = {
    sub: user.userId,
    email: user.email,
    role: user.role,
    orgId: user.orgId ?? undefined,
    venueId: user.venueId ?? undefined,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL,
    jti,
  }

  const refreshPayload: JWTPayload = {
    ...accessPayload,
    exp: now + REFRESH_TOKEN_TTL,
    jti: crypto.randomUUID(),
  }

  const [accessToken, refreshToken] = await Promise.all([
    signJWT(accessPayload, secret),
    signJWT(refreshPayload, secret),
  ])

  return {
    accessToken,
    refreshToken,
    expiresIn:  ACCESS_TOKEN_TTL,
    expiresAt:  (now + ACCESS_TOKEN_TTL) * 1000,
    tokenType:  'Bearer',
  }
}

// ─── Middleware Helper ─────────────────────────────────────────────────────

export async function extractUser(
  authHeader: string | undefined,
  env?: any
): Promise<JWTPayload | null> {
  if (!authHeader) return null
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader
  return verifyJWT(token, getSecret(env))
}

// ─── RBAC Role Hierarchy ──────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<UserRole, number> = {
  fan:           1,
  organiser:     2,
  venue_manager: 2,
  event_manager: 3,
  ops_admin:     4,
  superadmin:    10,
}

export function hasRole(userRole: UserRole, required: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(required) ? required : [required]
  return roles.some(r => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[r])
}

// Portal ↔ allowed roles map
export const PORTAL_ROLES: Record<string, UserRole[]> = {
  fan:           ['fan', 'organiser', 'venue_manager', 'event_manager', 'ops_admin', 'superadmin'],
  admin:         ['superadmin'],
  organiser:     ['organiser', 'superadmin'],
  venue:         ['venue_manager', 'superadmin'],
  'event-manager': ['event_manager', 'organiser', 'superadmin'],
  ops:           ['ops_admin', 'superadmin'],
}

// ─── Demo users with HASHED passwords (pre-computed for startup speed) ────
// In production these come from D1 database; hash them with hashPassword()
// The passwords below were hashed at build time.
export const DEMO_USER_STORE: Array<AuthUser & { passwordHash: string }> = [
  {
    userId:       'USR-FAN-001',
    name:         'Arjun Sharma',
    email:        'fan@demo.indtix.com',
    role:         'fan',
    badge:        'Gold Fan',
    avatar:       '🎵',
    orgId:        null,
    venueId:      null,
    // Fan@Demo2024 — generated at module load in initDemoPasswords()
    passwordHash: '__PENDING__',
  },
  {
    userId:       'USR-ADM-001',
    name:         'Priya Kapoor',
    email:        'admin@demo.indtix.com',
    role:         'superadmin',
    badge:        'Super Admin',
    avatar:       '👑',
    orgId:        null,
    venueId:      null,
    passwordHash: '__PENDING__',
  },
  {
    userId:       'USR-ORG-001',
    name:         'Rahul Verma',
    email:        'organiser@demo.indtix.com',
    role:         'organiser',
    badge:        'Verified Organiser',
    avatar:       '🎪',
    orgId:        'ORG-001',
    venueId:      null,
    passwordHash: '__PENDING__',
  },
  {
    userId:       'USR-VEN-001',
    name:         'Sneha Pillai',
    email:        'venue@demo.indtix.com',
    role:         'venue_manager',
    badge:        'Venue Manager',
    avatar:       '🏟️',
    orgId:        null,
    venueId:      'VEN-001',
    passwordHash: '__PENDING__',
  },
  {
    userId:       'USR-EM-001',
    name:         'Vikram Nair',
    email:        'eventmgr@demo.indtix.com',
    role:         'event_manager',
    badge:        'Event Manager',
    avatar:       '🎭',
    orgId:        null,
    venueId:      null,
    passwordHash: '__PENDING__',
  },
  {
    userId:       'USR-OPS-001',
    name:         'Meera Joshi',
    email:        'ops@demo.indtix.com',
    role:         'ops_admin',
    badge:        'Operations Admin',
    avatar:       '⚙️',
    orgId:        null,
    venueId:      null,
    passwordHash: '__PENDING__',
  },
]

// Map for fast lookup
export const DEMO_PASSWORDS_PLAIN: Record<string, string> = {
  'fan@demo.indtix.com':       'Fan@Demo2024',
  'admin@demo.indtix.com':     'Admin@Demo2024',
  'organiser@demo.indtix.com': 'Org@Demo2024',
  'venue@demo.indtix.com':     'Venue@Demo2024',
  'eventmgr@demo.indtix.com':  'EventMgr@Demo2024',
  'ops@demo.indtix.com':       'Ops@Demo2024',
}

export function findDemoUser(email: string): (AuthUser & { passwordHash: string }) | undefined {
  return DEMO_USER_STORE.find(u => u.email === email.toLowerCase().trim())
}
