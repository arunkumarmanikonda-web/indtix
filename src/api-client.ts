/**
 * INDTIX — Global Frontend API Client
 * Production-ready fetch wrapper with:
 *  - JWT auth header injection
 *  - Automatic token refresh on 401
 *  - Retry with exponential backoff
 *  - Toast notifications on errors
 *  - Request deduplication
 *  - Structured error responses
 *  - Offline detection
 *
 * Usage (paste into any portal's <script> section, or load as a module):
 *   const data = await apiFetch('/api/events')
 *   const result = await apiFetch('/api/auth/login', { method:'POST', body: { email, password } })
 */

/* ──────────────────────────────────────────────────────────────────────────
   1. TOKEN MANAGEMENT
   ────────────────────────────────────────────────────────────────────────── */

const TOKEN_KEY   = 'ix_access_token'
const REFRESH_KEY = 'ix_refresh_token'
const USER_KEY    = 'ix_user'

const TokenStore = {
  getAccess:     ()      => sessionStorage.getItem(TOKEN_KEY),
  setAccess:     (t: string) => sessionStorage.setItem(TOKEN_KEY, t),
  getRefresh:    ()      => sessionStorage.getItem(REFRESH_KEY),
  setRefresh:    (t: string) => sessionStorage.setItem(REFRESH_KEY, t),
  getUser:       ()      => { try { return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null') } catch { return null } },
  setUser:       (u: object) => sessionStorage.setItem(USER_KEY, JSON.stringify(u)),
  clear:         ()      => { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(REFRESH_KEY); sessionStorage.removeItem(USER_KEY) },
  isExpiringSoon: ()     => {
    const t = TokenStore.getAccess()
    if (!t) return true
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      return (payload.exp - Math.floor(Date.now() / 1000)) < 300  // < 5 min
    } catch { return true }
  },
}

/* ──────────────────────────────────────────────────────────────────────────
   2. TOAST SYSTEM
   ────────────────────────────────────────────────────────────────────────── */

function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 4000) {
  // Try to use existing toast function if defined in the portal
  const existingFn = (window as any).showToast || (window as any).ixToast
  if (typeof existingFn === 'function') {
    existingFn(message, type)
    return
  }

  // Fallback: create a lightweight toast
  let container = document.getElementById('ix-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'ix-toast-container'
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none'
    document.body.appendChild(container)
  }

  const colors: Record<string, string> = {
    success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
  }
  const icons: Record<string, string> = {
    success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️',
  }

  const toast = document.createElement('div')
  toast.style.cssText = `background:${colors[type]};color:#fff;padding:12px 16px;border-radius:8px;font-size:14px;font-weight:500;pointer-events:auto;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:360px;animation:ixToastIn .25s ease`
  toast.textContent = `${icons[type]} ${message}`
  container.appendChild(toast)

  // Add animation style once
  if (!document.getElementById('ix-toast-style')) {
    const style = document.createElement('style')
    style.id = 'ix-toast-style'
    style.textContent = '@keyframes ixToastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}'
    document.head.appendChild(style)
  }

  setTimeout(() => toast.remove(), duration)
}

/* ──────────────────────────────────────────────────────────────────────────
   3. IN-FLIGHT REQUEST DEDUPLICATION
   ────────────────────────────────────────────────────────────────────────── */

const INFLIGHT = new Map<string, Promise<any>>()

/* ──────────────────────────────────────────────────────────────────────────
   4. REFRESH MUTEX (prevent parallel refresh calls)
   ────────────────────────────────────────────────────────────────────────── */

let _refreshing: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (_refreshing) return _refreshing
  _refreshing = (async () => {
    const refreshToken = TokenStore.getRefresh()
    if (!refreshToken) return false
    try {
      const res = await fetch('/api/auth/refresh', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ refreshToken }),
      })
      if (!res.ok) {
        TokenStore.clear()
        return false
      }
      const data = await res.json()
      if (data.accessToken) {
        TokenStore.setAccess(data.accessToken)
        return true
      }
      return false
    } catch {
      return false
    } finally {
      _refreshing = null
    }
  })()
  return _refreshing
}

/* ──────────────────────────────────────────────────────────────────────────
   5. CORE apiFetch
   ────────────────────────────────────────────────────────────────────────── */

interface ApiFetchOptions extends RequestInit {
  body?: any              // auto-serialised to JSON
  retries?: number        // default 2
  retryDelay?: number     // default 500ms, doubles each retry
  silent?: boolean        // suppress error toasts
  dedupe?: boolean        // deduplicate identical GET requests (default true)
  timeout?: number        // ms — default 15000
  onProgress?: (pct: number) => void
}

interface ApiResponse<T = any> {
  data: T | null
  error: string | null
  status: number
  ok: boolean
  headers: Headers
}

async function apiFetch<T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retries    = 2,
    retryDelay = 500,
    silent     = false,
    dedupe     = true,
    timeout    = 15_000,
    onProgress,
    ...fetchOpts
  } = options

  // Pre-flight token refresh if expiring soon
  if (TokenStore.isExpiringSoon() && TokenStore.getRefresh()) {
    await refreshAccessToken()
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(),
    ...(fetchOpts.headers as Record<string, string> ?? {}),
  }

  const token = TokenStore.getAccess()
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Serialize body
  let body: BodyInit | null = null
  if (options.body !== undefined && options.body !== null) {
    body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  }

  const finalOpts: RequestInit = { ...fetchOpts, headers, body: body ?? fetchOpts.body }

  // Deduplication for GET requests
  const method = (finalOpts.method ?? 'GET').toUpperCase()
  const dedupeKey = `${method}:${url}`
  if (dedupe && method === 'GET' && INFLIGHT.has(dedupeKey)) {
    return INFLIGHT.get(dedupeKey)!
  }

  const execute = async (attempt: number): Promise<ApiResponse<T>> => {
    // Offline check
    if (!navigator.onLine) {
      if (!silent) showToast('No internet connection', 'warning')
      return { data: null, error: 'No internet connection', status: 0, ok: false, headers: new Headers() }
    }

    // Timeout via AbortController
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const res = await fetch(url, { ...finalOpts, signal: controller.signal })
      clearTimeout(timer)

      // 401 → try token refresh once
      if (res.status === 401 && attempt === 0) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          // Retry with new token
          const newToken = TokenStore.getAccess()
          if (newToken) (finalOpts.headers as any)['Authorization'] = `Bearer ${newToken}`
          return execute(1)
        } else {
          // Redirect to login
          TokenStore.clear()
          if (!silent) showToast('Session expired — please log in again', 'warning')
          // Let portal handle redirect
          const event = new CustomEvent('ix:session-expired')
          window.dispatchEvent(event)
          return { data: null, error: 'Session expired', status: 401, ok: false, headers: res.headers }
        }
      }

      // Parse response
      let data: T | null = null
      const contentType = res.headers.get('Content-Type') ?? ''
      if (res.status !== 204) {
        try {
          data = contentType.includes('json') ? await res.json() : await res.text() as any
        } catch {
          data = null
        }
      }

      if (!res.ok) {
        const errorMsg = (data as any)?.error || (data as any)?.message || `HTTP ${res.status}`
        if (!silent) {
          const severity = res.status >= 500 ? 'error' : 'warning'
          showToast(errorMsg, severity)
        }
        return { data: null, error: errorMsg, status: res.status, ok: false, headers: res.headers }
      }

      return { data, error: null, status: res.status, ok: true, headers: res.headers }

    } catch (err: any) {
      clearTimeout(timer)
      if (err.name === 'AbortError') {
        if (!silent) showToast('Request timed out', 'warning')
        return { data: null, error: 'Request timed out', status: 408, ok: false, headers: new Headers() }
      }

      // Retry on network errors
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, retryDelay * Math.pow(2, attempt)))
        return execute(attempt + 1)
      }

      const msg = err.message || 'Network error'
      if (!silent) showToast(msg, 'error')
      return { data: null, error: msg, status: 0, ok: false, headers: new Headers() }
    }
  }

  const promise = execute(0).finally(() => {
    if (method === 'GET') INFLIGHT.delete(dedupeKey)
  })

  if (dedupe && method === 'GET') INFLIGHT.set(dedupeKey, promise)
  return promise
}

/* ──────────────────────────────────────────────────────────────────────────
   6. CONVENIENCE WRAPPERS
   ────────────────────────────────────────────────────────────────────────── */

const api = {
  get:    <T>(url: string, opts?: ApiFetchOptions)           => apiFetch<T>(url, { ...opts, method: 'GET' }),
  post:   <T>(url: string, body: any, opts?: ApiFetchOptions)=> apiFetch<T>(url, { ...opts, method: 'POST',   body }),
  put:    <T>(url: string, body: any, opts?: ApiFetchOptions)=> apiFetch<T>(url, { ...opts, method: 'PUT',    body }),
  patch:  <T>(url: string, body: any, opts?: ApiFetchOptions)=> apiFetch<T>(url, { ...opts, method: 'PATCH',  body }),
  delete: <T>(url: string, opts?: ApiFetchOptions)           => apiFetch<T>(url, { ...opts, method: 'DELETE' }),
}

/* ──────────────────────────────────────────────────────────────────────────
   7. AUTH HELPER
   ────────────────────────────────────────────────────────────────────────── */

const Auth = {
  async login(email: string, password: string) {
    const res = await api.post<any>('/api/auth/login', { email, password }, { silent: true })
    if (res.ok && res.data?.accessToken) {
      TokenStore.setAccess(res.data.accessToken)
      if (res.data.refreshToken) TokenStore.setRefresh(res.data.refreshToken)
      if (res.data.user) TokenStore.setUser(res.data.user)
      window.CURRENT_USER_ID = res.data.user?.userId ?? ''
      window._ixAuthUser     = res.data.user
    }
    return res
  },

  logout() {
    api.post('/api/auth/logout', {}, { silent: true }).catch(() => {})
    TokenStore.clear()
    window.CURRENT_USER_ID = ''
    window._ixAuthUser     = null
    window.dispatchEvent(new CustomEvent('ix:logout'))
  },

  getUser() {
    return TokenStore.getUser() ?? window._ixAuthUser ?? null
  },

  isLoggedIn() {
    const token = TokenStore.getAccess()
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp > Math.floor(Date.now() / 1000)
    } catch { return false }
  },
}

/* ──────────────────────────────────────────────────────────────────────────
   8. EXPOSE GLOBALLY
   ────────────────────────────────────────────────────────────────────────── */

// These are injected into each portal's window scope
(window as any).apiFetch  = apiFetch;
(window as any).api       = api;
(window as any).IxAuth    = Auth;
(window as any).TokenStore = TokenStore;

// Listen for session expiry events to trigger portal login modal
window.addEventListener('ix:session-expired', () => {
  const loginModal = document.getElementById('loginModal') || document.getElementById('ix-auth-gate')
  if (loginModal) {
    (loginModal as HTMLElement).style.display = 'flex'
  }
})

export { apiFetch, api, Auth, TokenStore }
export type { ApiFetchOptions, ApiResponse }
