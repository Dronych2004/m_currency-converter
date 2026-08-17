const CACHE_NAME = 'cconverter-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Запросы — сначала сеть, fallback на кэш (только для статики)
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Пропускаем API-запросы и не кэшируем их
  if (request.url.includes('api.') || request.url.includes('open.er-api.com') || request.url.includes('coingecko') || request.url.includes('open-meteo') || request.url.includes('frankfurter')) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Кэшируем успешные статические ответы
        if (response.ok && request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Fallback на кэш при оффлайне
        return caches.match(request).then((cached) => cached || caches.match('/'))
      })
  )
})
