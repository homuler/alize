'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/examples/serviceWorker/sw.js').then((registration) => {
    console.log('ServiceWorker registration successful: ', registration);
  }).catch((err) => {
    console.log('error ', err);
  });
}
