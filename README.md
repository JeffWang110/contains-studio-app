# AI Agents Studio - 中華電信 × 台積電 專案管理平台

基於 [Contains Studio Agents](https://github.com/contains-studio/agents) 專案客製化，整合 Google Gemini AI。

## 🚀 功能特色

- 📊 10 個部門分類，包含電信工程、半導體設施、專案管理等
- 🤖 **整合 Google Gemini AI**，真正的 AI 對話能力
- 💬 每個 Agent 都有專屬的角色設定和專業知識
- 🎨 現代化深色主題介面
- 📱 響應式設計，支援行動裝置
- 🇹🇼 繁體中文在地化
- 🔒 API Key 安全保護（Serverless Function）

## 📦 快速開始

### 安裝依賴
```bash
npm install
```

### 本地開發
```bash
npm run dev
```

### 建構生產版本
```bash
npm run build
```

## 🔑 設定 Gemini API Key

### 方法一：Vercel 環境變數（推薦）

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案
3. 進入 **Settings** → **Environment Variables**
4. 新增變數：
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `你的 Gemini API Key`
5. 點擊 **Save**
6. 重新部署專案

### 方法二：本地開發

1. 複製 `.env.example` 為 `.env`
2. 填入你的 API Key
```bash
cp .env.example .env
```

## 🌐 部署到 Vercel

### 透過 GitHub 整合

1. 將此專案推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)
3. 點擊「New Project」
4. 選擇你的 GitHub repo
5. **重要**：新增環境變數 `GEMINI_API_KEY`
6. 點擊「Deploy」

### 透過 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 設定環境變數
vercel env add GEMINI_API_KEY
```

## 🔧 技術架構

- **前端**: React 18 + Vite
- **樣式**: Tailwind CSS
- **後端**: Vercel Serverless Functions
- **AI**: Google Gemini 2.0 Flash-Lite
- **部署**: Vercel

## 📁 專案結構

```
contains-studio-app/
├── api/
│   └── chat.js          # Serverless API（呼叫 Gemini）
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # 主要元件
│   ├── main.jsx         # 入口點
│   └── index.css        # 全域樣式
├── index.html
├── package.json
├── vercel.json          # Vercel 設定
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🏢 部門與 Agents

### ⭐ 專屬部門

| 部門 | Agents 數量 | 說明 |
|-----|------------|------|
| 📡 電信工程 | 6 | 5G、光纖、網路架構 |
| 🔬 半導體設施 | 5 | FAB 網路、無塵室通訊 |
| 📊 電信專案管理 | 6 | PM、報價、報告撰寫 |

### 📁 通用部門

軟體工程、設計、行銷、產品、營運、測試、特別組

## 📄 授權

MIT License

## 🔗 相關連結

- [Google AI Studio](https://aistudio.google.com) - 取得 Gemini API Key
- [Contains Studio Agents](https://github.com/contains-studio/agents) - 原始專案
- [Vercel](https://vercel.com) - 部署平台
