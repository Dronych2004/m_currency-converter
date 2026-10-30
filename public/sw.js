const CACHE_NAME = 'cconverter-v3'

// На localhost SW не нужен — мешает HMR и кэширует бандлы.
// Если старый SW всё ещё жив, он самоуничтожается при обновлении.
if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  self.addEventListener('activate', () => {
    self.registration.unregister();
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.navigate(client.url));
    });
  });
}
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
]

// Установка — кэшируем статику
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Активация — удаляем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('cconverter-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Запросы — network-first для HTML, cache-first для статики
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  // Пропускаем API-запросы (погодные — не кэшируем, чтобы не показывать устаревшую погоду)
  if (request.url.includes('open.er-api.com') || request.url.includes('coingecko') || request.url.includes('open-meteo') || request.url.includes('api.met.no') || request.url.includes('wttr.in')) {
    return
  }

  // HTML-навигации (prerendered pages): всегда сеть, чтобы Google видел актуальный контент
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(request)) || new Response('Нет подключения к интернету. Попробуйте позже.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))
    )
    return
  }

  // Mutable files must always be refreshed.
  if (!new URL(request.url).pathname.startsWith('/assets/')) return

  // Hashed assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
