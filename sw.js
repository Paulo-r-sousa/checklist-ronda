// Service worker: guarda o app no aparelho para funcionar sem internet.
// A cada publicação nova, aumente VERSAO (v2, v3...) para os aparelhos receberem a atualização.
const VERSAO = "v9";
const CACHE = "checklist-lessence-" + VERSAO;
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./jspdf.umd.min.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : Response.error())
    )
  );
});
