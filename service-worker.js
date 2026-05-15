/* Teheccüd · Seher · Sabah Namazı Vakitleri — Service Worker
 *
 * Strateji:
 *  - Statik kabuk (HTML/CSS/JS/icon/manifest): cache-first
 *  - Diyanet API çağrıları: stale-while-revalidate
 *    (önce cache'den göster, arka planda taze veri çek; offline'da en son
 *     başarılı yanıt gösterilir)
 */

const VERSION = "v1.8.2";
const STATIC_CACHE  = `vakit-static-${VERSION}`;
const RUNTIME_CACHE = `vakit-runtime-${VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon-180.png",
  "./icons/favicon-32.png",
  "./assets/mescid.jpg",
  "./assets/kabe.jpg",
  "./assets/fonts/amiri-regular.ttf",
  "./assets/bg-kabe.jpg"
];

const API_HOSTS = [
  "ezanvakti.imsakiyem.com"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (API_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (e) {
    const fallback = await caches.match("./index.html");
    if (fallback) return fallback;
    throw e;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkPromise.catch(() => {});
    return cached;
  }

  const net = await networkPromise;
  if (net) return net;
  return new Response(JSON.stringify({ error: "offline" }), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}
