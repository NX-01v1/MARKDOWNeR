const CACHE_NAME = 'markdown-editor-v1'; // キャッシュ名とバージョンを定義
const urlsToCache = [
  './', // index.html
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  // アイコンのプレースホルダーもキャッシュ対象に含めます (実際は実際のアイコンファイルへのパスに置き換えてください)
  'https://placehold.co/48x48/2563eb/ffffff?text=MD',
  'https://placehold.co/72x72/2563eb/ffffff?text=MD',
  'https://placehold.co/96x96/2563eb/ffffff?text=MD',
  'https://placehold.co/144x144/2563eb/ffffff?text=MD',
  'https://placehold.co/168x168/2563eb/ffffff?text=MD',
  'https://placehold.co/192x192/2563eb/ffffff?text=MD',
  'https://placehold.co/512x512/2563eb/ffffff?text=MD'
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
