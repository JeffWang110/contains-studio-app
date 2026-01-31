---
name: vercel-mcp
description: Vercel MCP 伺服器管理技能。用於設定 Vercel MCP、管理專案、部署、環境變數、domains 等 Vercel 操作。
---

# Vercel MCP 伺服器技能

這個技能用於管理和使用 Vercel MCP (Model Context Protocol) 伺服器，讓 Claude 可以直接與 Vercel API 互動。

---

## MCP 伺服器資訊

| 項目 | 說明 |
|------|------|
| 名稱 | vercel |
| 套件 | `@vercel/mcp` |
| 傳輸方式 | stdio |
| 認證方式 | Vercel API Token |

---

## 安裝狀態

執行以下指令檢查安裝狀態：

```bash
claude mcp list
```

若顯示 `vercel: ... - ✓ Connected` 表示已正確設定。

---

## 安裝與設定

### 步驟 1：取得 Vercel API Token

1. 登入 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 點擊 **Create** 建立新的 token
3. 設定 token 名稱（例如：`claude-mcp`）
4. 選擇 scope（建議選擇 Full Account 以獲得完整功能）
5. 設定過期時間（建議設定合理的過期時間）
6. 複製產生的 token

### 步驟 2：設定 MCP 伺服器

**方法 A：使用 Claude CLI（推薦）**

```bash
claude mcp add vercel -e VERCEL_API_TOKEN=你的Token -- npx -y @vercel/mcp
```

**方法 B：手動設定**

編輯 `~/.claude.json`，加入：

```json
{
  "mcpServers": {
    "vercel": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@vercel/mcp"],
      "env": {
        "VERCEL_API_TOKEN": "你的Token"
      }
    }
  }
}
```

### 步驟 3：驗證連線

```bash
claude mcp list
```

應該顯示：`vercel: ... - ✓ Connected`

---

## 環境變數

| 變數名稱 | 必填 | 說明 |
|----------|------|------|
| VERCEL_API_TOKEN | ✅ | Vercel API Token |

---

## 可用功能

安裝完成後，Vercel MCP 提供以下功能：

### 專案管理

- 列出所有專案
- 取得專案詳情
- 建立新專案
- 刪除專案

### 部署管理

- 列出部署記錄
- 取得部署詳情
- 觸發重新部署
- 取消部署

### 環境變數管理

- 列出環境變數
- 新增環境變數
- 更新環境變數
- 刪除環境變數
- 取得環境變數值（含解密）

### Domain 管理

- 列出 domains
- 新增 domain
- 移除 domain
- 設定 domain 重導向

### 日誌與監控

- 查看部署日誌
- 查看 runtime 日誌
- 查看錯誤日誌

### 團隊管理

- 列出團隊成員
- 取得團隊資訊

---

## 使用範例

### 查看專案列表

```
列出我所有的 Vercel 專案
```

### 查看部署狀態

```
查看 contains-studio-app 專案最近的部署狀態
```

### 管理環境變數

```
列出 contains-studio-app 專案的所有環境變數
```

```
在 contains-studio-app 專案新增環境變數 API_KEY，值為 xxx，環境為 production
```

### 查看日誌

```
查看 contains-studio-app 最近的部署日誌
```

### 觸發重新部署

```
重新部署 contains-studio-app 專案到 production
```

---

## 相關專案

以下是使用 Vercel 部署的專案：

| 專案 | 網址 | 說明 |
|------|------|------|
| agents.jeffwang.work | https://agents.jeffwang.work | AI Agents Studio |
| party.jeffwang.work | https://party.jeffwang.work | 入厝趴 RSVP |
| books.jeffwang.work | https://books.jeffwang.work | 讀書會天地 |

---

## 疑難排解

### 連線失敗

1. 確認 token 是否正確且未過期
2. 確認 token 有足夠的權限
3. 執行以下指令移除後重新設定：

```bash
claude mcp remove vercel -s user
claude mcp add vercel -e VERCEL_API_TOKEN=新Token -- npx -y @vercel/mcp
```

### Token 過期

前往 [Vercel Dashboard](https://vercel.com/account/tokens) 重新產生 token，然後更新 MCP 設定。

### 權限不足

確認 token 的 scope 是否足夠。若需要完整功能，建議使用 Full Account scope。

---

## 安全注意事項

1. **永遠不要將 token 提交到版本控制**
2. 定期輪換 token
3. 設定合理的 token 過期時間
4. 若 token 外洩，立即前往 Vercel 撤銷並重新產生
5. 考慮使用限定 scope 的 token，只授予必要的權限

---

## 與 CLI 指令對照

| Vercel CLI | MCP 功能 |
|------------|----------|
| `vercel ls` | 列出專案 |
| `vercel env ls` | 列出環境變數 |
| `vercel env add` | 新增環境變數 |
| `vercel logs` | 查看日誌 |
| `vercel --prod` | 部署到 production |
| `vercel domains ls` | 列出 domains |
