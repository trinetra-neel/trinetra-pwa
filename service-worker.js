/* TRINETRA v2.0.5 - PWA upgrade: network-first HTML, offline fallback, cache revision. */
const CACHE='trinetra-v205-static-20261029';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('trinetra-')&&k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  const isHtml=req.mode==='navigate'||req.destination==='document';
  event.respondWith(fetch(req,isHtml?{cache:'no-store'}:undefined).then(resp=>{
    if(resp&&resp.ok){const copy=resp.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{}));}
    return resp;
  }).catch(()=>caches.match(req).then(x=>x||caches.match('./index.html'))));
});
