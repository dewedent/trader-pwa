// === Trader Journal Service Worker ===
// Версия кэша — обновляй при каждом изменении файлов,
// чтобы браузер подтянул новую версию.
const CACHE = 'trader-journal-v3';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Установка: кэшируем все файлы приложения
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Запросы: сначала кэш, потом сеть
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
