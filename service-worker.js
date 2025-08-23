const CACHE_NAME = "top10-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./top10.css",
  "./top10.js",
  "./Imagens/popcorn.png",
  "./Imagens/Portugal.png",
  "./Imagens/World.png"
];

// Instalação: guarda os ficheiros no cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação: remove caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch: serve ficheiros do cache quando possível
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
