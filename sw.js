// Service Worker CMS HOSANNA — v1
// Objectif : rendre le site installable (PWA) + mise en cache légère
// des pages déjà visitées pour un accès plus rapide et un minimum
// de tolérance hors-ligne (pas de données patient stockées ici).

const CACHE_NAME = "cms-hosanna-v1";
const OFFLINE_URLS = [
  "/",
  "/services",
  "/infertilite",
  "/pvvih",
  "/apropos",
  "/temoignages",
  "/blog",
  "/contact",
  "/img/logo-3d-clair.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Stratégie "network first, fallback cache" : toujours essayer d'avoir
// la version la plus récente ; si hors-ligne, servir la version en cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
