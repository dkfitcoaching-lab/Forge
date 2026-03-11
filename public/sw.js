// ══════════════════════════════════════════════════════════════
// FORGE SERVICE WORKER — Offline-first PWA support
// Cache app shell + fonts for instant load, offline capability
// ══════════════════════════════════════════════════════════════

const CACHE_NAME = "forge-v5-cache";
const SHELL_ASSETS = [
  "/Forge/",
  "/Forge/index.html",
];

// Install: cache shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener("fetch", (e) => {
  const { request } = e;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Navigation requests — network first, fallback to cache
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() => caches.match("/Forge/index.html"))
    );
    return;
  }

  // Font files — cache first (they rarely change)
  if (request.url.includes("fontsource") || request.url.includes("fonts.googleapis") || request.url.includes("fonts.gstatic")) {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // JS/CSS assets — stale-while-revalidate
  if (request.url.match(/\.(js|css)$/)) {
    e.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }
});
