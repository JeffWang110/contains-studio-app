// Editorial recommendations for the Studio site, not Hermes skill execution.
// Keep IDs and descriptions bounded: the server uses these as a whitelist.
export const scenarios = {
  build: '開發實作',
  research: '研究盤點',
  design: '設計呈現',
  audit: '品管稽核',
};

export const skillCatalog = {
  'web-design-engineer': '設計與檢查可操作的網頁介面',
  'brownfield-safe-change': '先盤點既有系統，再做小範圍修改與回歸驗證',
  'test-driven-development': '先定義可重現的驗收測試，再實作',
  'ponytail': '只在工程實作時評估最小可驗證改動，保留測試與安全',
  'github-pr-workflow': '以分支、PR、CI 和審查交付程式變更',
  'gary-chen-anti-ai-design': '檢視介面設計語彙與資訊層次',
  'hallmark': '檢查視覺品質與常見設計套版問題',
  'baoyu-infographic': '規劃可讀的資訊圖表',
  'news-briefing': '整理來源、篩選主題並產出早報',
  'social-radar': '規劃社群訊號追蹤與人工判讀',
  'meta-platform-diagnostics': '檢查 Meta 平台權限與連線狀態',
  'domain-modeling': '界定需求、實體與術語',
  'writing-plans': '把需求轉成可執行計畫',
  'project-workflow': '規劃、設計、執行與驗證里程碑',
  'linear': '整理議題、負責人與追蹤狀態',
  'handoff': '交接工作脈絡與待辦',
  'weekly-report-generator': '整理可追溯的工作週報',
  'daily-task-automation': '評估例行工作自動化邊界',
  'site-watchdog': '規劃網站變更監測',
  'data-viz': '將資料呈現成易讀圖表',
  'surge-deploy-safe': '部署前後檢查公開檔案與線上內容',
  'systematic-debugging': '先重現並定位根因，再修改',
  'dependency-security-audit': '檢查第三方依賴與供應鏈風險',
  'humanizer': '調整文字語氣，避免模板感',
};

export const skillsByDept = {
  engineering: ['web-design-engineer', 'brownfield-safe-change', 'test-driven-development', 'ponytail', 'github-pr-workflow'],
  design: ['gary-chen-anti-ai-design', 'hallmark', 'baoyu-infographic'],
  marketing: ['news-briefing', 'social-radar', 'meta-platform-diagnostics'],
  product: ['domain-modeling', 'writing-plans', 'project-workflow'],
  'project-management': ['project-workflow', 'linear', 'handoff', 'weekly-report-generator'],
  'studio-operations': ['daily-task-automation', 'site-watchdog', 'data-viz', 'surge-deploy-safe'],
  testing: ['test-driven-development', 'systematic-debugging', 'dependency-security-audit'],
  bonus: ['humanizer', 'baoyu-infographic'],
  health: [],
};

export function validateSkillSelection(deptId, scenario, skills) {
  if (typeof deptId !== 'string' || !Object.hasOwn(skillsByDept, deptId)) return false;
  if (typeof scenario !== 'string' || !Object.hasOwn(scenarios, scenario)) return false;
  return Array.isArray(skills) && skills.length <= 5 && new Set(skills).size === skills.length &&
    skills.every(id => typeof id === 'string' && skillsByDept[deptId].includes(id) && Object.hasOwn(skillCatalog, id)) &&
    !(skills.includes('ponytail') && scenario !== 'build');
}
