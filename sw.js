const CACHE_NAME = 'kuberan-vastu-compass-v4.6.1';
const ASSETS_TO_CACHE = [
  './index.html',
  './style.css',
  './vastu-data.js',
  './qrcode.min.js',
  './app.js',
  './manifest.webmanifest',
  './assets/images/kuberan_logo_white_bg.png',
  './assets/images/kuberan_logo_transparent.png',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled or catch individual errors so one missing file (like './') doesn't break the entire SW install
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => console.warn('SW Install: failed to cache', url, err));
        })
      );
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
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  // Cache-First with background revalidation for other static assets
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
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
