---
name: github-mcp
description: GitHub MCP 伺服器管理技能。用於設定 GitHub MCP、管理 repositories、issues、pull requests、搜尋程式碼等 GitHub 操作。
---

# GitHub MCP 伺服器技能

這個技能用於管理和使用 GitHub MCP (Model Context Protocol) 伺服器，讓 Claude 可以直接與 GitHub API 互動。

---

## MCP 伺服器資訊

| 項目 | 說明 |
|------|------|
| 名稱 | github |
| 套件 | `@modelcontextprotocol/server-github` |
| 傳輸方式 | stdio |
| 認證方式 | GitHub Personal Access Token |

---

## 安裝狀態

執行以下指令檢查安裝狀態：

```bash
claude mcp list
```

若顯示 `github: ... - ✓ Connected` 表示已正確設定。

---

## 安裝與設定

### 步驟 1：取得 GitHub Personal Access Token

1. 前往 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 點擊 **Generate new token (classic)** 或 **Fine-grained tokens**
3. 選擇需要的權限：
   - `repo` - 完整的 repository 存取權限
   - `read:org` - 讀取組織資訊
   - `read:user` - 讀取使用者資訊
   - `gist` - Gist 存取權限（選填）
4. 複製產生的 token

### 步驟 2：設定 MCP 伺服器

**方法 A：使用 Claude CLI（推薦）**

```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=你的Token -- npx -y @modelcontextprotocol/server-github
```

**方法 B：手動設定**

編輯 `~/.claude.json`，加入：

```json
{
  "mcpServers": {
    "github": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "你的Token"
      }
    }
  }
}
```

### 步驟 3：驗證連線

```bash
claude mcp list
```

應該顯示：`github: ... - ✓ Connected`

---

## 環境變數

| 變數名稱 | 必填 | 說明 |
|----------|------|------|
| GITHUB_PERSONAL_ACCESS_TOKEN | ✅ | GitHub Personal Access Token |

---

## 可用工具

安裝完成後，可使用以下 GitHub 工具：

### Repository 操作

| 工具 | 說明 |
|------|------|
| `mcp__github__search_repositories` | 搜尋 GitHub repositories |
| `mcp__github__create_repository` | 建立新的 repository |
| `mcp__github__fork_repository` | Fork 一個 repository |
| `mcp__github__get_file_contents` | 取得檔案或目錄內容 |
| `mcp__github__create_or_update_file` | 建立或更新檔案 |
| `mcp__github__push_files` | 一次推送多個檔案 |
| `mcp__github__create_branch` | 建立新分支 |
| `mcp__github__list_commits` | 列出 commits |

### Issues 操作

| 工具 | 說明 |
|------|------|
| `mcp__github__list_issues` | 列出 issues |
| `mcp__github__get_issue` | 取得特定 issue 詳情 |
| `mcp__github__create_issue` | 建立新 issue |
| `mcp__github__update_issue` | 更新 issue |
| `mcp__github__add_issue_comment` | 新增 issue 留言 |

### Pull Request 操作

| 工具 | 說明 |
|------|------|
| `mcp__github__list_pull_requests` | 列出 pull requests |
| `mcp__github__get_pull_request` | 取得特定 PR 詳情 |
| `mcp__github__create_pull_request` | 建立新 PR |
| `mcp__github__get_pull_request_files` | 取得 PR 變更的檔案 |
| `mcp__github__create_pull_request_review` | 建立 PR review |
| `mcp__github__merge_pull_request` | 合併 PR |
| `mcp__github__update_pull_request_branch` | 更新 PR 分支 |
| `mcp__github__get_pull_request_status` | 取得 PR 狀態檢查結果 |
| `mcp__github__get_pull_request_comments` | 取得 PR 留言 |
| `mcp__github__get_pull_request_reviews` | 取得 PR reviews |

### 搜尋操作

| 工具 | 說明 |
|------|------|
| `mcp__github__search_code` | 搜尋程式碼 |
| `mcp__github__search_issues` | 搜尋 issues 和 PRs |
| `mcp__github__search_users` | 搜尋使用者 |

---

## 使用範例

### 搜尋 repositories

```
請幫我搜尋關於 "react hooks" 的熱門 repositories
```

### 建立 issue

```
在 owner/repo 建立一個 issue，標題是 "Bug: 登入失敗"
```

### 查看 PR 狀態

```
查看 owner/repo 的 PR #123 的狀態和 review 結果
```

### 取得檔案內容

```
取得 owner/repo 的 src/index.js 檔案內容
```

---

## 疑難排解

### 連線失敗

1. 確認 token 是否正確且未過期
2. 確認 token 有足夠的權限
3. 執行 `claude mcp remove github -s user` 移除後重新設定

### 權限不足錯誤

確認 token 包含所需的 scope：
- 操作 private repo 需要 `repo` scope
- 操作組織資源需要 `read:org` scope

### 重新設定 token

```bash
# 移除現有設定
claude mcp remove github -s user

# 重新新增（含新 token）
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=新Token -- npx -y @modelcontextprotocol/server-github
```

---

## 安全注意事項

1. **永遠不要將 token 提交到版本控制**
2. 定期輪換 token
3. 使用最小權限原則，只授予必要的 scope
4. 若 token 外洩，立即前往 GitHub 撤銷並重新產生
