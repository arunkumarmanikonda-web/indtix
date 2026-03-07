// INDTIX Service Worker v5.1
const CACHE_NAME = 'indtix-v5.1';
const STATIC_CACHE = 'indtix-static-v5.1';
const API_CACHE = 'indtix-api-v5.1';

const STATIC_ASSETS = [
  '/fan',
  '/manifest.json',
  '/favicon.ico'
];

const API_CACHE_ROUTES = [
  '/api/events',
  '/api/health'
];

// Install: cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate for API, cache-first for static
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // API routes: network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    const isCacheable = API_CACHE_ROUTES.some(r => url.pathname.startsWith(r));
    if (!isCacheable) return;

    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation — use /fan (not /fan.html)
        if (request.mode === 'navigate') {
          return caches.match('/fan');
        }
      });
    })
  );
});

// Background sync for pending bookings
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncPendingBookings());
  }
});

async function syncPendingBookings() {
  // In a real app, retrieve from IndexedDB and retry POST /api/bookings
  console.log('[SW] Syncing pending bookings...');
}

// Push notifications — use /favicon.ico (inline SVG, always 200) for icon/badge
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification from INDTIX',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: { url: data.url || '/fan' },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    vibrate: [100, 50, 100],
    requireInteraction: false
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'INDTIX', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/fan';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
