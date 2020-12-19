// Declare files to cache
const FILES_TO_CACHE = [
    '/db.js',
    '/index.html',
    '/index.js',
    '/style.css',
];
const STATIC_CACHE = `static-cache-v1`;
const RUNTIME_CACHE = `runtime-cache`;

const iconSizes = ["192"];
const iconFiles = iconSizes.map(
  (size) => `/public/icons/icon-${size}x${size}.png`
);
// 
self.addEventListener("install", function (evt){
    evt.waitUntil(
        caches.open(RUNTIME_CACHE).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("fetch", evt => {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(evt.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }

    evt.respondWith(
      caches.open(RUNTIME_CACHE).then( cache => {
          return cache.match(evt.request).then(response => {
              return response || fetch(evt.request)
          });
  }));
})
