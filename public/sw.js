const CACHE_NAME = "yachtdrop-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
];

// Install: cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and API/scraper requests
  if (request.method !== "GET") return;
  if (request.url.includes("/api/")) return;

  // For navigation requests (HTML pages): network-first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // For static assets: stale-while-revalidate
  if (
    request.url.includes("/_next/static/") ||
    request.url.includes("/fonts/") ||
    request.url.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }
});
