/* ══════════════════════════════════════════════════════════════════
   MJ 狙擊手 AI v9 — Service Worker
   版本：1.0.0
   策略：
   - App Shell（HTML/JS/CSS/字型）→ Cache First
   - 金融數據 API（Yahoo Finance）→ Network First，失敗用快取
   - 圖示資源 → Cache First
   ══════════════════════════════════════════════════════════════════ */

const CACHE_VERSION  = 'mj-sniper-v9-1.0.0';
const SHELL_CACHE    = CACHE_VERSION + '-shell';
const DATA_CACHE     = CACHE_VERSION + '-data';

// App Shell — 離線也要能開啟的核心資源
const SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // 外部 CDN（輕量圖表庫）
  'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js',
  // Google Fonts
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
];

// 金融數據域名 — Network First
const DATA_DOMAINS = [
  'query1.finance.yahoo.com',
  'query2.finance.yahoo.com',
  'stooq.com',
  'www.twse.com.tw',
];

// ─────────────────────────────────────────────
// Install：快取 App Shell
// ─────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing:', CACHE_VERSION);
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => {
      // 逐一快取，避免任一失敗中斷全部
      return Promise.allSettled(
        SHELL_URLS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Shell cache miss:', url, err.message);
          })
        )
      );
    }).then(() => {
      console.log('[SW] Shell cached');
      return self.skipWaiting(); // 立即啟用新版本
    })
  );
});

// ─────────────────────────────────────────────
// Activate：清理舊版 Cache
// ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== DATA_CACHE)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─────────────────────────────────────────────
// Fetch：請求攔截策略
// ─────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 只處理 GET
  if (event.request.method !== 'GET') return;

  // ① 金融數據 API → Network First（優先網路，失敗用舊快取）
  if (DATA_DOMAINS.some(d => url.hostname.includes(d))) {
    event.respondWith(networkFirst(event.request, DATA_CACHE, 15000));
    return;
  }

  // ② App Shell / 靜態資源 → Cache First
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js')   ||
    url.pathname.endsWith('.css')  ||
    url.pathname.endsWith('.png')  ||
    url.pathname.endsWith('.svg')  ||
    url.pathname.endsWith('.json') ||
    url.pathname === '/'
  ) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // ③ Google Fonts / CDN → Cache First
  if (url.hostname.includes('fonts.google') || url.hostname.includes('unpkg.com')) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // ④ 其他請求 → 直接網路
  // (Flask localhost, 等)
});

// ─────────────────────────────────────────────
// 策略函數
// ─────────────────────────────────────────────

// Network First：優先網路，快取備援（金融數據用）
async function networkFirst(request, cacheName, timeoutMs = 10000) {
  const cache = await caches.open(cacheName);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) {
      // 快取金融數據（TTL 由瀏覽器管理）
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // 網路失敗 → 用快取
    const cached = await cache.match(request);
    if (cached) {
      console.log('[SW] Network fail, serving cache:', request.url.slice(0, 80));
      return cached;
    }
    // 無快取 → 回傳錯誤 JSON
    return new Response(JSON.stringify({ error: 'offline', message: '網路不可用，無快取數據' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache First：優先快取（App Shell 用）
async function cacheFirst(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return new Response('<!-- 離線，無法載入資源 -->', {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// ─────────────────────────────────────────────
// 版本更新推播（通知主頁重新整理）
// ─────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
