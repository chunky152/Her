// Service worker for offline support. VERSION is a hash of PRECACHE_URLS'
// contents, auto-written by scripts/update-sw-version.js (run via `npm run
// concat`/`build`) — don't hand-edit it, it'll just get overwritten.
const VERSION = 'v4303726b02';
const CACHE_NAME = `her-cache-${VERSION}`;
// Photos/audio/video are dropped in per README and lazily runtime-cached
// (see fetch handler) rather than precached, so unlike the app shell above
// they aren't a fixed known set — kept in their own cache with a size cap
// so a growing media collection can't cache-bloat the device indefinitely.
const MEDIA_CACHE_NAME = `her-media-${VERSION}`;
const MAX_MEDIA_ENTRIES = 30;

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
  'fonts/playfair-display-variable.woff2',
  'fonts/playfair-display-italic-variable.woff2',
  'fonts/mulish-variable.woff2',
  'fonts/caveat-variable.woff2',
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
        keys.filter((key) => key !== CACHE_NAME && key !== MEDIA_CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Deletes the oldest entries (cache.keys() is insertion-ordered) once a
// cache grows past maxEntries, so MEDIA_CACHE_NAME can't grow without bound.
async function trimCache(cacheName, maxEntries){
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const excess = keys.length - maxEntries;
  if (excess <= 0) return;
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}

// Stale-while-revalidate: serve from cache instantly when we have it, while
// refreshing the cache in the background so later visits pick up changes
// (new photos, rebuilt script.js, etc). Anything not yet cached falls back
// to the network and gets cached for next time. Photos/audio go in the
// capped MEDIA_CACHE_NAME; everything else (the fixed app shell) in CACHE_NAME.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const isMedia = /\/(?:photos|audio)\//.test(new URL(request.url).pathname);
  const cacheName = isMedia ? MEDIA_CACHE_NAME : CACHE_NAME;

  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      const cached = await cache.match(request);

      const networkFetch = fetch(request).then((response) => {
        if (response && response.ok) {
          cache.put(request, response.clone());
          if (isMedia) trimCache(MEDIA_CACHE_NAME, MAX_MEDIA_ENTRIES);
        }
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
