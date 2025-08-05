// AutoService Pro - Service Worker
// PWA Service Worker for offline functionality and caching

const CACHE_NAME = 'autoservice-pro-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/diensten.html',
  '/over-ons.html',
  '/contact.html',
  '/boeken.html',
  '/css/custom.css',
  '/css/animations.css',
  '/js/main.js',
  '/js/booking.js',
  '/js/form-handler.js',
  '/js/utils.js',
  '/favicon.svg',
  '/manifest.json',
  // External resources
  'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://unpkg.com/vue@3/dist/vue.global.js'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Fallback for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form when online
async function syncContactForm() {
  try {
    const forms = await getStoredForms();
    for (const formData of forms) {
      await submitForm(formData);
      await removeStoredForm(formData.id);
    }
  } catch (error) {
    console.error('Form sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'AutoService Pro update',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('AutoService Pro', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Helper functions for offline form storage
function getStoredForms() {
  return new Promise((resolve) => {
    // Implementation for retrieving stored forms from IndexedDB
    resolve([]);
  });
}

function removeStoredForm(id) {
  return new Promise((resolve) => {
    // Implementation for removing stored form from IndexedDB
    resolve();
  });
}

function submitForm(formData) {
  return fetch('/contact-handler.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
}