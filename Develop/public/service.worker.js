// Declare files to cache
const FILES_TO_CACHE = [
    '/transaction.js',
    '/index.html',
    '/index.js',
    '/style.css',
    '/manifest.webmanifest',
];
const STATIC_CACHE = `static-cache-v1`;
const RUNTIME_CACHE = `runtime-cache`;

const iconSizes = ["72", "96", "128", "144", "152", "192", "384", "512"];
const iconFiles = iconSizes.map(
  (size) => `/public/icons/icon-${size}x${size}.png`
);
// 
self.addEventListener("install", function (event){
    event.waitUntil(
        caches  .open(STATIC_CACHE)
                .then(cache => cache.addAll(FILES_TO_CACHE) )
                .then(()=> self.skipWaiting())
    );
    self.skipWaiting();
});

self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
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
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
        });
      })
    );
  });
  

