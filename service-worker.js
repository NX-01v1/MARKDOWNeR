const CACHE_NAME = 'markdown-editor-v2'; // キャッシュ名とバージョンを更新して新しいキャッシュを強制
const urlsToCache = [
  './', // index.html
  'index.html',
  'manifest.json',
  'service-worker.js', // サービスワーカー自身もキャッシュする
  'IMG_1289.jpeg', // アップロードされたアイコン画像をキャッシュ対象に追加
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

// インストールイベント - アプリケーションシェルをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache:', error);
      })
  );
});

// フェッチイベント - キャッシュからリソースを提供し、オフラインアクセスを可能にする
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにレスポンスがあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークからフェッチする
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
        // 必要に応じて、オフラインページなどを返す
        // return caches.match('/offline.html');
      })
  );
});

// アクティベートイベント - 古いキャッシュをクリアする
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
