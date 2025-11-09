self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('bndlabs-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/home.html',
        '/about.html',
        '/portfolio.html',
        '/blog.html',
        '/contact.html',
        '/404.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
