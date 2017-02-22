let cacheName = 'v1';

// Note: we added { credentials: 'include' } because otherwise more than one connection would be used.
// This happens by default because two different connections are created in HTTP/2 for credentialed and non-credentialed requests.
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'app.js',
        'favicon.ico',
        'picture.png',
        'style.css'
      ].map(u => new Request(u, { credentials: 'include' })))
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
    return caches.match('picture.png');
  }));
});
