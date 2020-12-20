// Declare files to cache
const FILES_TO_CACHE = [
    '/index.html',
    '/index.js',
    '/style.css',
    'db.js',  
];

const STATIC_CACHE = `static-cache-v1`;
const DATA_CACHE_NAME = 'data-cache-v1'

const iconSizes = ["192"];
const iconFiles = iconSizes.map(
  (size) => `/public/icons/icon-${size}x${size}.png`
);
// 
self.addEventListener("install", function (evt){
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
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
      caches.open(DATA_CACHE_NAME).then( cache => {
          return cache.match(evt.request).then(response => {
              return response || fetch(evt.request)
          });
  }));
})
