
  /* ================= PWA: service worker =================
     Registers sw.js for offline support and home-screen installability.
     Registration path is relative so this works from either the repo root
     (Netlify) or a /Her/ subpath (GitHub Pages). */
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){});
    });
  }
