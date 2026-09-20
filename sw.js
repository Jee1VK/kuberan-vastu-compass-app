const CACHE_NAME = 'kuberan-vastu-compass-v4.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=4.3.0',
  './style.css',
  './vastu-data.js?v=4.3.0',
  './vastu-data.js',
  './qrcode.min.js?v=4.3.0',
  './qrcode.min.js',
  './app.js?v=4.3.0',
  './app.js',
  './manifest.webmanifest?v=4.3.0',
  './manifest.webmanifest',
  './assets/images/kuberan_logo_white_bg.png',
  './assets/images/kuberan_logo_transparent.png',
  './icon.svg?v=4.3.0',
  './icon.svg',
  './icon-192.png?v=4.3.0',
  './icon-192.png',
  './icon-512.png?v=4.3.0',
  './icon-512.png',
  './apple-touch-icon.png?v=4.3.0',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate' || 
                       (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));
  
  // Icon files, manifest, and HTML: ALWAYS Network-First so updates appear instantly
  const isPriorityAsset = isNavigation || 
                          url.pathname.endsWith('manifest.webmanifest') ||
                          url.pathname.includes('icon') ||
                          url.pathname.endsWith('.svg');

  if (isPriorityAsset) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First with background revalidation for other static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
