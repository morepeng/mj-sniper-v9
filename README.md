# MJ 狙擊手 AI v9 — PWA 股票分析終端

> **多市場股票 AI 分析終端**  
> Yahoo Finance 直連 · 無需伺服器 · 可安裝到手機主畫面

---

## 🚀 快速安裝（免電腦伺服器）

### Android（Chrome）
1. 用 Chrome 開啟：`https://<你的GitHub帳號>.github.io/mj-sniper-v9/`
2. 右上角選單 → **「新增至主畫面」**
3. 點選「新增」→ 主畫面出現 MJ狙擊手圖示
4. 像 App 一樣直接開啟使用 ✅

### iOS（Safari）
1. 用 **Safari** 開啟上方 URL
2. 下方工具列 → 分享按鈕 📤
3. 選「**加入主畫面**」
4. 點「新增」→ 主畫面出現圖示 ✅

---

## 📁 目錄結構

```
mj-sniper-v9/
├── index.html        ← 主程式（完整 v9 看盤終端，約 290KB）
├── manifest.json     ← PWA 設定（App 名稱、圖示、顯示模式）
├── sw.js             ← Service Worker（離線快取、網路策略）
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png  ← Android 主要圖示
│   ├── icon-384.png
│   └── icon-512.png  ← iOS 主要圖示
└── README.md
```

---

## ⚙️ GitHub Pages 部署步驟

### 方法一：一鍵部署（推薦）

```bash
# 1. 在 GitHub 建立新倉庫（命名為 mj-sniper-v9）
# 2. 上傳本資料夾所有檔案
git init
git add .
git commit -m "MJ Sniper v9 PWA initial deploy"
git remote add origin https://github.com/<你的帳號>/mj-sniper-v9.git
git push -u origin main

# 3. 開啟 GitHub Pages
# Settings → Pages → Source: main branch / root
# 等待 1~2 分鐘，URL 即可使用
```

### 方法二：手動上傳
1. 在 GitHub 建立新倉庫（public）
2. 點「Add file → Upload files」
3. 把所有檔案拖曳上傳
4. Settings → Pages → Deploy from main branch

### 完成後你的 URL
```
https://<你的帳號>.github.io/mj-sniper-v9/
```

---

## 📊 功能說明

| 功能 | PWA 模式 | 本機伺服器模式 |
|------|----------|----------------|
| K 線圖（日/週/月/時） | ✅ Yahoo Finance 直連 | ✅ yfinance |
| 即時報價更新 | ✅ Yahoo Finance 直連 | ✅ |
| 油價/黃金/VIX | ✅ Yahoo Finance 直連 | ✅ |
| 板塊輪動 ETF | ✅ Yahoo Finance 直連 | ✅ |
| 台股籌碼（三大法人） | ⚠️ 估算（無 TWSE） | ✅ TWSE 真實 |
| 融資融券 | ⚠️ 量價估算 | ✅ TWSE 真實 |
| 南北向資金（港/陸股） | ⚠️ 量價估算 | ✅ akshare |
| 美股選擇權 PCR | ⚠️ RSI 估算 | ✅ yfinance |
| LSTM 波動情境 | ✅ ATR 公式 | ✅ |
| Claude AI 解讀 | ✅（需 claude.ai 環境） | ✅ |
| 離線使用 | ✅ Service Worker 快取 | ❌ |

> ⚠️ = 在 PWA 模式下使用本地估算替代真實 API，仍有參考價值

---

## 🔧 進階：同時使用本機 Flask 伺服器

若在家中電腦執行 `mj_server.py`，可獲得更精準的籌碼數據：

```python
# 執行伺服器
python mj_server.py
```

然後在 PWA 設定中輸入你的電腦 IP：
```
http://192.168.x.x:5000
```

PWA 會自動偵測並使用 Flask 籌碼數據。

---

## 📱 支援環境

| 平台 | 瀏覽器 | PWA安裝 |
|------|--------|---------|
| Android | Chrome 80+ | ✅ A2HS 提示 |
| iOS 16.4+ | Safari | ✅ 分享→加入主畫面 |
| Windows | Chrome/Edge | ✅ |
| macOS | Chrome/Safari | ✅ |

---

## ⚠️ 免責聲明

本工具僅供技術分析學習參考，不構成投資建議。  
最重要的保護永遠是：**嚴格停損 + 分批進場 + 等待確認K線收盤**。

---

*MJ 狙擊手 AI v9 · Yahoo Finance 直連 · Service Worker 離線快取*
