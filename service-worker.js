/* TRINETRA v2.0.6 PWA · network-first update with a unique offline cache. */
const CACHE='trinetra-v206-static-20261102';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('trinetra-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const isHtml=req.mode==='navigate'||req.destination==='document';
 e.respondWith(fetch(req,isHtml?{cache:'no-store'}:undefined).then(r=>{if(r&&r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{}));}return r;})
 .catch(()=>caches.match(req).then(x=>x||caches.match('./index.html'))));
});
