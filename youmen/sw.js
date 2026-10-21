'use strict';
// Only the public prototype shell is cached. Health files and inputs are never cached.
const CACHE='minova-care-prototype-v0.2-20261021';
const ASSETS=['./index.html','./styles.css','./app.js','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);const allowed=ASSETS.map(p=>new URL(p,self.registration.scope).pathname);if(url.origin!==location.origin||!allowed.includes(url.pathname))return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request)));});
