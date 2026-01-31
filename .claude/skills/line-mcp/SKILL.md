---
name: line-mcp
description: LINE Bot MCP 伺服器管理技能。用於設定 LINE Bot MCP、發送訊息、管理 LINE Official Account、推播通知等 LINE Messaging API 操作。
---

# LINE Bot MCP 伺服器技能

這個技能用於管理和使用 LINE Bot MCP (Model Context Protocol) 伺服器，讓 Claude 可以直接與 LINE Messaging API 互動，發送訊息給 LINE 使用者。

---

## MCP 伺服器資訊

| 項目 | 說明 |
|------|------|
| 名稱 | line-bot |
| 套件 | `@line/line-bot-mcp-server` |
| 傳輸方式 | stdio |
| 認證方式 | LINE Channel Access Token |

---

## 安裝狀態

執行以下指令檢查安裝狀態：

```bash
claude mcp list
```

若顯示 `line-bot: ... - ✓ Connected` 表示已正確設定。

---

## 前置條件

使用此 MCP 需要：

1. **LINE Official Account** - 若沒有請先建立
2. **啟用 Messaging API** - 在 LINE Official Account 中啟用
3. **Channel Access Token** - 用於 API 認證

---

## 安裝與設定

### 步驟 1：建立 LINE Official Account（若尚未建立）

1. 前往 [LINE Official Account Manager](https://manager.line.biz/)
2. 點擊「建立帳號」
3. 依照指示完成建立

### 步驟 2：啟用 Messaging API

1. 在 LINE Official Account Manager 中選擇你的帳號
2. 前往「設定」>「Messaging API」
3. 點擊「啟用 Messaging API」
4. 選擇或建立 Provider
5. 完成啟用

### 步驟 3：取得 Channel Access Token

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 Provider
3. 選擇你的 Messaging API Channel
4. 在「Messaging API」分頁中，找到「Channel access token」
5. 點擊「Issue」產生 token
6. 複製產生的 token

### 步驟 4：取得 User ID（選填）

如果你想設定預設的接收者：

1. 在 LINE Developers Console 的 Channel 頁面
2. 找到「Your user ID」
3. 複製這個 ID

### 步驟 5：設定 MCP 伺服器

**方法 A：使用 Claude CLI（推薦）**

```bash
# 只設定必填的 Channel Access Token
claude mcp add line-bot -e CHANNEL_ACCESS_TOKEN=你的Token -- npx -y @line/line-bot-mcp-server

# 或同時設定預設接收者
claude mcp add line-bot -e CHANNEL_ACCESS_TOKEN=你的Token -e DESTINATION_USER_ID=你的UserID -- npx -y @line/line-bot-mcp-server
```

**方法 B：手動設定**

編輯 `~/.claude.json`，加入：

```json
{
  "mcpServers": {
    "line-bot": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@line/line-bot-mcp-server"],
      "env": {
        "CHANNEL_ACCESS_TOKEN": "你的Token",
        "DESTINATION_USER_ID": "你的UserID（選填）"
      }
    }
  }
}
```

### 步驟 6：驗證連線

```bash
claude mcp list
```

應該顯示：`line-bot: ... - ✓ Connected`

---

## 環境變數

| 變數名稱 | 必填 | 說明 |
|----------|------|------|
| CHANNEL_ACCESS_TOKEN | ✅ | LINE Channel Access Token |
| DESTINATION_USER_ID | ❌ | 預設接收者的 User ID |

---

## 可用功能

安裝完成後，LINE Bot MCP 提供以下功能：

### 訊息發送

| 功能 | 說明 |
|------|------|
| 發送文字訊息 | 傳送純文字給使用者 |
| 發送貼圖 | 傳送 LINE 貼圖 |
| 發送圖片 | 傳送圖片訊息 |
| 發送影片 | 傳送影片訊息 |
| 發送音訊 | 傳送音訊訊息 |
| 發送位置 | 傳送位置資訊 |
| 發送 Flex Message | 傳送彈性版面訊息 |

### 訊息類型

| 類型 | 說明 |
|------|------|
| Push Message | 主動推播訊息給使用者 |
| Multicast | 同時發送給多位使用者 |
| Broadcast | 廣播給所有好友 |

### 使用者資訊

| 功能 | 說明 |
|------|------|
| 取得使用者資料 | 取得使用者的 display name、頭像等 |
| 取得好友數量 | 取得 Official Account 的好友數 |

---

## 使用範例

### 發送文字訊息

```
使用 LINE Bot 發送訊息「今天天氣很好！」給使用者
```

### 發送給特定使用者

```
使用 LINE Bot 發送訊息「會議提醒：下午 3 點」給 User ID 為 Uxxxxxxxxxx 的使用者
```

### 廣播訊息

```
使用 LINE Bot 廣播訊息「本週六有活動，歡迎參加！」給所有好友
```

### 發送 Flex Message

```
使用 LINE Bot 發送一個包含標題、內容和按鈕的 Flex Message
```

---

## 訊息格式範例

### 文字訊息

```json
{
  "type": "text",
  "text": "Hello, World!"
}
```

### 貼圖訊息

```json
{
  "type": "sticker",
  "packageId": "1",
  "stickerId": "1"
}
```

### 圖片訊息

```json
{
  "type": "image",
  "originalContentUrl": "https://example.com/image.jpg",
  "previewImageUrl": "https://example.com/preview.jpg"
}
```

---

## 疑難排解

### 連線失敗

1. 確認 Channel Access Token 是否正確
2. 確認 Messaging API 已啟用
3. 執行以下指令移除後重新設定：

```bash
claude mcp remove line-bot -s user
claude mcp add line-bot -e CHANNEL_ACCESS_TOKEN=新Token -- npx -y @line/line-bot-mcp-server
```

### 訊息發送失敗

1. 確認 User ID 格式正確（以 U 開頭）
2. 確認該使用者已加入你的 Official Account 為好友
3. 確認 Channel Access Token 未過期

### Token 過期

LINE Channel Access Token 預設有效期為 30 天。過期後需要重新 Issue：

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 Channel
3. 重新 Issue Channel Access Token
4. 更新 MCP 設定

---

## 安全注意事項

1. **永遠不要將 Channel Access Token 提交到版本控制**
2. 定期輪換 token（建議每 30 天）
3. 若 token 外洩，立即前往 LINE Developers Console 重新 Issue
4. 注意訊息發送的頻率限制，避免被封鎖

---

## 費用與限制

| 項目 | 免費方案 | 付費方案 |
|------|----------|----------|
| 每月訊息數 | 200 則 | 依方案而定 |
| Push Message | ✅ | ✅ |
| Multicast | ✅ | ✅ |
| Broadcast | ✅ | ✅ |

詳細費用請參考 [LINE Official Account 費用方案](https://www.linebiz.com/tw/service/line-official-account/plan/)

---

## 相關資源

- [LINE Developers Documentation](https://developers.line.biz/en/docs/messaging-api/)
- [LINE Bot MCP Server GitHub](https://github.com/line/line-bot-mcp-server)
- [LINE Official Account Manager](https://manager.line.biz/)
- [LINE Developers Console](https://developers.line.biz/console/)
