# Party RSVP 網站管理技能

這個技能用於管理和維護 party-rsvp 入厝趴時間調查網站。

## 專案位置

```
../party-rsvp/
```

完整路徑：`C:\Users\kraft\OneDrive - Chunghwa Telecom Co., Ltd\讀書分享天地\AI\一人公司AI team\party-rsvp\`

## 技術架構

| 項目 | 技術 |
|------|------|
| 前端框架 | React 18 + Vite |
| 樣式 | Tailwind CSS |
| 資料庫 | Firebase Firestore |
| 認證 | Firebase Anonymous Auth |
| 部署 | Vercel |
| 圖示 | Lucide React |

## 網站網址

- **Production:** https://party.jeffwang.work
- **Firebase 專案:** party-today-18738

## 關鍵檔案

```
party-rsvp/
├── src/
│   ├── App.jsx          # 主要應用程式（所有元件都在這裡）
│   ├── main.jsx         # React 進入點
│   └── index.css        # Tailwind 樣式
├── public/
│   └── hero.jpg         # 首頁圖片
├── index.html           # HTML 模板
├── vite.config.js       # Vite 設定
├── tailwind.config.js   # Tailwind 設定
├── package.json         # 依賴套件
└── .env                 # 本地環境變數（不會被 git 追蹤）
```

## Firebase 設定

Firebase 設定直接寫在 `src/App.jsx` 中：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCHpym8hch-ItTEMhRdeAMkvb2qClEldiA",
  authDomain: "party-today-18738.firebaseapp.com",
  projectId: "party-today-18738",
  storageBucket: "party-today-18738.firebasestorage.app",
  messagingSenderId: "561672972974",
  appId: "1:561672972974:web:ce616b5fb91cbd46591b3f"
};
```

### Firestore 資料結構

```
artifacts/
└── party-rsvp-app/
    └── public/
        └── data/
            └── party_rsvp_115/
                ├── {用戶名稱}/
                │   ├── name: string
                │   ├── dates: array<string>  # ["2026-02-04", "2026-02-20", ...]
                │   ├── uid: string
                │   └── updatedAt: timestamp
                └── ...
```

## 常用指令

### 本地開發

```bash
cd "../party-rsvp"
npm install        # 安裝依賴
npm run dev        # 啟動開發伺服器 (http://localhost:5173)
npm run build      # 建置生產版本
npm run preview    # 預覽生產版本
```

### 部署到 Vercel

```bash
cd "../party-rsvp"
git add .
git commit -m "描述變更內容"
git push
npx vercel --prod --yes
```

### 查詢 Firebase 資料

```bash
cd "../party-rsvp" && node -e "
const https = require('https');

function httpRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function query() {
  const authResult = await httpRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: '/v1/accounts:signUp?key=AIzaSyCHpym8hch-ItTEMhRdeAMzvb2qClEldiA',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ returnSecureToken: true }));

  const result = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: '/v1/projects/party-today-18738/databases/(default)/documents/artifacts/party-rsvp-app/public/data/party_rsvp_115',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + authResult.idToken }
  });

  console.log('=== 資料庫數據 ===');
  if (result.documents) {
    result.documents.forEach(doc => {
      const name = doc.fields.name?.stringValue || 'unknown';
      const dates = doc.fields.dates?.arrayValue?.values?.map(v => v.stringValue) || [];
      console.log(name + ': ' + dates.join(', '));
    });
  } else {
    console.log('(無數據)');
  }
}
query().catch(console.error);
"
```

## App.jsx 主要元件結構

1. **MangaPhotoPanel** - 首頁漫畫風格照片面板
2. **LoginView** - 選擇身分頁面
3. **CalendarView** - 日曆選擇頁面
4. **StatsView** - 統計排行榜頁面
5. **SpeedLines** - 背景速度線裝飾

## 用戶名單

```javascript
const USERS_LIST = [
  "又尹", "庭妤", "17", "尚芊", "宗翰",
  "阿敦", "佑儒", "懷文", "璿騰", "勃諄"
];
```

## 日期範圍

2026年2月1日 ~ 2026年3月31日

## 常見維護任務

### 更換首頁圖片

1. 將新圖片複製到 `public/` 資料夾並命名為 `hero.jpg`
2. 部署到 Vercel

### 修改用戶名單

編輯 `src/App.jsx` 中的 `USERS_LIST` 陣列

### 修改日期範圍

編輯 `src/App.jsx` 中的 `generateDateRange` 函數

### 修改首頁標籤文字

編輯 `src/App.jsx` 中 `<header>` 區塊的內容，例如：
- 「正宗北平烤鴨」
- 「好市多蝦沙拉」
- 「啤酒供應」
- 「外送飲料」
