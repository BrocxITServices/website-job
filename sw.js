// Service Worker voor Autoreparatie Op Locatie
// Versie: 1.0.0
// Cache alleen statische assets, GEEN HTML

const CACHE_NAME = 'aol-assets-v1';
const assetsToCache = [
  '/css/base.min.css',
  '/css/custom.min.css',
  '/css/mobile.min.css',
  '/css/animations.min.css',
  '/images/logo.png',
  '/images/logo.webp'
];

// Installatie - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching assets');
        return cache.addAll(assetsToCache);
      })
      .catch(err => console.error('[ServiceWorker] Cache failed:', err))
  );
});

// Activatie - verwijder oude caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch - serveer gecachte assets waar mogelijk
self.addEventListener('fetch', event => {
  // Cache alleen CSS, JS en afbeeldingen
  if (event.request.url.includes('.css') || 
      event.request.url.includes('.js') || 
      event.request.url.includes('/images/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version of ga naar netwerk
          return response || fetch(event.request);
        })
    );
  }
  // HTML altijd vers van server halen
});