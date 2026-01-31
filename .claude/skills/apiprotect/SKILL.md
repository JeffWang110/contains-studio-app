---
name: apiprotect
description: API 安全性保護技能。用於檢查專案安全漏洞、更新 API 金鑰、設置 CORS 保護、輸入驗證、速率限制、Firestore Security Rules、以及 Git 敏感資料防護。
---

# API 安全性保護技能

這個技能用於管理和維護 API 安全性，包含安全審計、金鑰管理、防護機制設置等。

---

## 適用專案

### 1. agents.jeffwang.work (AI Agents Studio)

```
C:\Users\kraft\OneDrive - Chunghwa Telecom Co., Ltd\讀書分享天地\AI\一人公司AI team\contains-studio-app\
```

| 項目 | 說明 |
|------|------|
| 網站 | https://agents.jeffwang.work |
| 技術 | React + Vite + Vercel + Gemini API |
| API | Serverless Function (`api/chat.js`) |

### 2. party.jeffwang.work (入厝趴 RSVP)

```
C:\Users\kraft\OneDrive - Chunghwa Telecom Co., Ltd\讀書分享天地\AI\一人公司AI team\party-rsvp\
```

| 項目 | 說明 |
|------|------|
| 網站 | https://party.jeffwang.work |
| 技術 | React + Vite + Vercel + Firebase |
| 資料庫 | Firestore (party-today-18738) |

---

## 安全規格總覽

### agents.jeffwang.work

| 項目 | 規格 | 狀態 |
|------|------|------|
| CORS | 只允許特定網域 | ✅ |
| 輸入驗證 | 訊息長度 ≤ 5000 字元 | ✅ |
| 速率限制 | 20 請求/分鐘/IP | ✅ |
| 安全標頭 | X-Content-Type-Options, X-Frame-Options | ✅ |
| 錯誤處理 | 生產環境隱藏詳細錯誤 | ✅ |
| Git 保護 | pre-commit hook 阻擋敏感檔案 | ✅ |

### party.jeffwang.work

| 項目 | 規格 | 狀態 |
|------|------|------|
| Firestore Rules | 讀取公開、寫入需登入+驗證 | ✅ |
| 安全標頭 | X-Content-Type-Options, X-Frame-Options, Referrer-Policy | ✅ |
| 環境變數 | Firebase 設定使用 VITE_FIREBASE_* | ✅ |
| Git 保護 | .env 在 .gitignore 中 | ✅ |

---

# Part A: agents.jeffwang.work

## 1. CORS 設定

**位置：** `api/chat.js`

```javascript
const allowedOrigins = [
  'https://agents.jeffwang.work',
  'https://contains-studio-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
```

### 新增允許的網域

編輯 `api/chat.js`，在 `allowedOrigins` 陣列中新增網域：

```javascript
const allowedOrigins = [
  'https://agents.jeffwang.work',
  'https://新網域.com',  // 新增這行
  // ...
];
```

---

## 2. 輸入驗證規格

**位置：** `api/chat.js`

| 欄位 | 類型 | 限制 |
|------|------|------|
| message | string | 必填，≤ 5000 字元 |
| agentName | string | 選填，只允許 `[a-z0-9-]` |
| agentTitle | string | 選填，≤ 200 字元 |
| agentDesc | string | 選填，≤ 200 字元 |

### 驗證常數

```javascript
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FIELD_LENGTH = 200;
const VALID_AGENT_NAME_PATTERN = /^[a-z0-9-]+$/;
```

---

## 3. 速率限制

**位置：** `api/chat.js`

```javascript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分鐘
const RATE_LIMIT_MAX = 20;           // 每分鐘最多 20 次
```

### 錯誤回應

當超過速率限制時：
```json
{
  "error": "請求過於頻繁，請稍後再試"
}
```
HTTP 狀態碼：`429 Too Many Requests`

### 調整速率限制

修改 `api/chat.js` 中的常數：

```javascript
const RATE_LIMIT_WINDOW = 60 * 1000; // 時間窗口（毫秒）
const RATE_LIMIT_MAX = 30;           // 調整為 30 次/分鐘
```

---

## 4. 安全標頭

**位置：** `api/chat.js`

```javascript
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
```

| 標頭 | 用途 |
|------|------|
| X-Content-Type-Options | 防止 MIME 類型嗅探攻擊 |
| X-Frame-Options | 防止點擊劫持（禁止 iframe 嵌入） |

---

## 5. API 金鑰管理 (Gemini)

### 金鑰存放位置

| 環境 | 位置 |
|------|------|
| 本地開發 | `.env` 檔案 |
| 生產環境 | Vercel 環境變數 |

### 更新 API 金鑰流程

#### 步驟 1：撤銷舊金鑰
前往 https://aistudio.google.com/apikey 刪除舊金鑰

#### 步驟 2：更新本地 .env
```bash
# 編輯 .env 檔案
GEMINI_API_KEY=新的金鑰
```

#### 步驟 3：更新 Vercel 環境變數
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/contains-studio-app"

# 刪除舊的
echo "新金鑰" | npx vercel env rm GEMINI_API_KEY production -y

# 新增新的
echo "新金鑰" | npx vercel env add GEMINI_API_KEY production
```

#### 步驟 4：重新部署
```bash
npx vercel --prod
```

### 查看目前環境變數
```bash
npx vercel env ls
```

---

## 6. Git 敏感資料防護

### .gitignore 設定

**位置：** `.gitignore`

```
# Local env files
.env
.env.local
.env.*.local
```

### Pre-commit Hook

**位置：** `.git/hooks/pre-commit`

**功能：**
1. 阻擋敏感檔案提交（.env, credentials.json 等）
2. 掃描程式碼中的 API 金鑰模式

**檢測的金鑰模式：**
```
AIzaSy[a-zA-Z0-9_-]{33}     # Google API Key
sk-[a-zA-Z0-9]{48}          # OpenAI API Key
```

### 測試 Hook
```bash
git add .env
# 應該被 .gitignore 阻擋

git add api/chat.js
git commit -m "test"
# 如果含有 API 金鑰，會被 hook 阻擋
```

---

# Part B: party.jeffwang.work

## 7. Firestore Security Rules

**位置：** `firestore.rules`

**Firebase 專案：** party-today-18738

### 目前規則

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/party_rsvp_115/{userName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.data.keys().hasAll(['name', 'dates', 'uid', 'updatedAt'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 50
        && request.resource.data.dates is list
        && request.resource.data.uid is string;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 規則說明

| 操作 | 權限 |
|------|------|
| 讀取 | ✅ 公開（任何人可讀取投票結果） |
| 寫入 | 需登入 + 資料格式驗證 |
| 其他路徑 | ❌ 全部封鎖 |

### 寫入驗證

| 欄位 | 類型 | 限制 |
|------|------|------|
| name | string | 必填，1-50 字元 |
| dates | list | 必填，陣列格式 |
| uid | string | 必填 |
| updatedAt | any | 必填 |

### 部署 Firestore Rules

**方法 1：Firebase CLI**
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/party-rsvp"
npx firebase login
npx firebase deploy --only firestore:rules --project party-today-18738
```

**方法 2：Firebase Console**
1. 前往 https://console.firebase.google.com/project/party-today-18738/firestore/rules
2. 貼上規則
3. 點擊「發布」

---

## 8. party 網站安全標頭

**位置：** `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 9. party 環境變數

**位置：** `.env` (本地) / Vercel 環境變數 (生產)

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_ID=
```

### 更新 Firebase 設定

```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/party-rsvp"
npx vercel env add VITE_FIREBASE_API_KEY production
# 依序新增其他變數
npx vercel --prod
```

---

# Part C: 通用

## 10. 安全審計檢查清單

### 高風險
- [ ] API 金鑰是否外洩在程式碼中
- [ ] CORS 是否設為 `*`（過度寬鬆）
- [ ] .env 是否被 git 追蹤
- [ ] Firestore Rules 是否過於寬鬆

### 中風險
- [ ] 是否缺少安全標頭
- [ ] 輸入是否有長度限制
- [ ] 錯誤訊息是否暴露敏感資訊
- [ ] 是否有速率限制

### 低風險
- [ ] 依賴套件是否有已知漏洞
- [ ] 是否使用 HTTPS

### 執行安全掃描

**agents 專案：**
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/contains-studio-app"
grep -r "AIzaSy" --include="*.js" --include="*.jsx" src/ api/
npm audit
```

**party 專案：**
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/party-rsvp"
grep -r "AIzaSy" --include="*.js" --include="*.jsx" src/
npm audit
```

---

## 11. 常用部署指令

### agents.jeffwang.work
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/contains-studio-app"
npx vercel --prod
```

### party.jeffwang.work
```bash
cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/party-rsvp"
npx vercel --prod
```

### 驗證安全標頭
```bash
curl -I https://agents.jeffwang.work
curl -I https://party.jeffwang.work
```

---

## 12. 錯誤訊息對照表

### agents.jeffwang.work

| 錯誤 | 訊息（用戶看到） | 原因 |
|------|------------------|------|
| 400 | 訊息為必填欄位 | message 未提供 |
| 400 | 訊息長度不可超過 5000 字元 | 訊息太長 |
| 400 | 無效的 Agent 名稱 | agentName 格式錯誤 |
| 429 | 請求過於頻繁，請稍後再試 | 超過速率限制 |
| 500 | 服務暫時無法使用 | API 金鑰未設定 |
| 500 | AI 服務暫時無法回應 | Gemini API 錯誤 |
| 500 | 伺服器發生錯誤 | 其他錯誤 |

### party.jeffwang.work

| 錯誤 | 原因 |
|------|------|
| 儲存失敗 | Firestore 寫入被 Security Rules 拒絕 |
| 認證超時 | Firebase Anonymous Auth 失敗 |

---

## 13. 緊急應變

### API 金鑰外洩處理 (agents)

1. **立即撤銷金鑰**
   - 前往 https://aistudio.google.com/apikey
   - 刪除外洩的金鑰

2. **生成新金鑰並更新**
   ```bash
   cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/contains-studio-app"
   echo "新金鑰" | npx vercel env rm GEMINI_API_KEY production -y
   echo "新金鑰" | npx vercel env add GEMINI_API_KEY production
   npx vercel --prod
   ```

3. **檢查 git 歷史**
   ```bash
   git log --all --full-history -- .env
   git log -p --all -S 'AIzaSy'
   ```

### Firebase 金鑰外洩處理 (party)

1. **前往 Firebase Console**
   https://console.firebase.google.com/project/party-today-18738/settings/general

2. **重新生成 Web API Key**

3. **更新 Vercel 環境變數**
   ```bash
   cd "C:/Users/kraft/OneDrive - Chunghwa Telecom Co., Ltd/讀書分享天地/AI/一人公司AI team/party-rsvp"
   npx vercel env rm VITE_FIREBASE_API_KEY production -y
   npx vercel env add VITE_FIREBASE_API_KEY production
   npx vercel --prod
   ```

### 發現攻擊行為

1. 檢查 Vercel 日誌
   ```bash
   npx vercel logs
   ```

2. 暫時提高速率限制嚴格度（agents）
   修改 `RATE_LIMIT_MAX` 為更小的值

3. 收緊 Firestore Rules（party）
   暫時禁止所有寫入
