importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// cache webpack resources: bundle.js bundle.js.gz, on dev: hot updates
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// have it update and control a web page as soon as possible, skipping the default service worker lifecycle.
workbox.core.skipWaiting();
workbox.core.clientsClaim();

const EXPIRATION = new workbox.expiration.ExpirationPlugin({
  maxEntries: 60,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
});

workbox.routing.registerRoute(
  ({ url }) => url.href.endsWith('/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'html',
    plugins: [EXPIRATION],
  }),
);

workbox.routing.registerRoute(
  ({ url }) => url.href.endsWith('webmanifest'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'manifest',
    plugins: [EXPIRATION],
  }),
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
// workbox.routing.registerRoute(
//   ({ url }) => url.origin === 'https://fonts.googleapis.com',
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: 'google-fonts-stylesheets',
//   }),
// );

// Cache the underlying font files with a cache-first strategy for 1 year.
// workbox.routing.registerRoute(
//   ({ url }) => url.origin === 'https://fonts.gstatic.com',
//   new workbox.strategies.CacheFirst({
//     cacheName: 'google-fonts-webfonts',
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//       new workbox.expiration.ExpirationPlugin(EXPIRATION),
//     ],
//   }),
// );

// images, favicon
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|ico|ttf)/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [EXPIRATION],
  }),
);

// sounds
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'audio',
  new workbox.strategies.CacheFirst({
    cacheName: 'sounds',
    plugins: [EXPIRATION],
  }),
);
