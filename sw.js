// Service worker for offline support. Bump VERSION on any deploy that
// changes precached files so old caches get cleaned up on activate.
const VERSION = 'v1';
const CACHE_NAME = `her-cache-${VERSION}`;

// Only files guaranteed to exist in the repo — photos/audio are dropped in
// per README and may be missing or placeholders, so they're left out here
// and picked up lazily by the fetch handler below instead.
const PRECACHE_URLS = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'vendor/lottie.min.js',
  'animations/bird-pair-love.svg',
  'animations/cute-mascot-jumping.svg',
  'animations/happy-ball-throw.svg',
  'animations/happy-birthday.svg',
  'animations/smartphones-applications.svg',
  'animations/checkmark-success.json',
  'animations/finale-burst.json',
  'animations/floating-hearts.json',
  'animations/hard-moments-growth.json',
  'animations/heartbeat.json',
  'animations/heart-break.json',
  'animations/sparkle-burst.json',
  'animations/wax-seal-crack.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: serve from cache instantly when we have it, while
// refreshing the cache in the background so later visits pick up changes
// (new photos, rebuilt script.js, etc). Anything not yet cached falls back
// to the network and gets cached for next time.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      const networkFetch = fetch(request).then((response) => {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => null);

      if (cached) return cached;

      const fresh = await networkFetch;
      if (fresh) return fresh;

      if (request.mode === 'navigate') return cache.match('index.html');
      return Response.error();
    })
  );
});
