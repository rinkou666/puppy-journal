// Every release updates VERSION and the versioned module URLs together.
const VERSION='pwa-1';
const PREFIX='puppy-pwa:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const ASSETS=['./','./index.html','./app.js?v=pwa-1','./db.js?v=pwa-1','./model.js?v=pwa-1','./style.css?v=pwa-1','./dog.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const {request}=event,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok)await cache.put(new URL('./index.html',self.registration.scope).href,response.clone());return response}catch(error){const offline=await cache.match(new URL('./index.html',self.registration.scope).href);if(offline)return offline;throw error}})());return;
 }
 // Cached app modules stay consistent with the cached shell when offline.
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(request);if(cached)return cached;return fetch(request)})());
});
