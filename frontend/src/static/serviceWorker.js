function log(...data) {
    console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'adventura-static-v1';

self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            return cache.addAll([
                '/offline',
                '/menu',
                //CSS
                '/css/styles.css',
                //Images
                '/images/background.jpg',
                '/images/logo-192x192.png',
                '/images/logo-236x256.png',
                '/images/logo-354x384.png',
                '/images/favicon-16x16.png',
                '/images/favicon-32x32.png',
                '/images/favicon.ico',
                '/images/safari-pinned-tab.svg',
                '/images/android-chrome-192x192.png',
                '/images/android-chrome-384x384.png',
                '/images/apple-touch-icon.png',
                '/images/logo.svg',
                '/images/logopng.png',
                //Scripts
                '/js/APIClient.js',
                '/js/common.js',
                '/js/activities.js',
                '/js/createacct.js',
                '/js/createItinerary.js',
                '/js/editItinerary.js',
                '/js/itineraries.js',
                '/js/menu.js',
                '/js/login.js',
                 //External Resources
                 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('ncparks-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        //Only intercept (and cache) GET API requests
        event.respondWith(
          cacheFirst(event.request)
        );
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  function networkFirst(request) {
    return fetchAndCache(request)
    .catch(error => {
      //If we get an error, try to return from cache
      return caches.match(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      //Cache everything except login
      if(response.ok && !requestUrl.pathname === '/') {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
  