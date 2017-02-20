let cacheName = 'v1';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'public/app.js',
        'assets/favicon.ico',
        'assets/picture.png',
        'assets/style.css'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log('SW Fetching... ')
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open(cacheName).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('assets/picture.png');
  }));
});
