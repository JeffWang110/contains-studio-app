// Vercel Serverless Function - 安全呼叫 Gemini API
// 路徑: /api/chat.js

// 簡易速率限制（記憶體內，每個實例獨立）
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分鐘
const RATE_LIMIT_MAX = 20; // 每分鐘最多 20 次請求

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { startTime: now, count: 1 });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// 輸入驗證常數
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FIELD_LENGTH = 200;
const VALID_AGENT_NAME_PATTERN = /^[a-z0-9-]+$/;

export default async function handler(req, res) {
  // 設定 CORS - 只允許特定網域
  const allowedOrigins = [
    'https://agents.jeffwang.work',
    'https://contains-studio-app.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 安全標頭
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // 處理 CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 速率限制檢查
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: '請求過於頻繁，請稍後再試' });
  }

  try {
    // 解析 body（處理已解析和未解析的情況）
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: '無效的請求格式' });
      }
    }

    const { message, agentName, agentTitle, agentDesc } = body;

    // 輸入驗證
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '訊息為必填欄位' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `訊息長度不可超過 ${MAX_MESSAGE_LENGTH} 字元` });
    }

    if (agentName && (typeof agentName !== 'string' || !VALID_AGENT_NAME_PATTERN.test(agentName))) {
      return res.status(400).json({ error: '無效的 Agent 名稱' });
    }

    if (agentTitle && (typeof agentTitle !== 'string' || agentTitle.length > MAX_FIELD_LENGTH)) {
      return res.status(400).json({ error: '無效的 Agent 標題' });
    }

    if (agentDesc && (typeof agentDesc !== 'string' || agentDesc.length > MAX_FIELD_LENGTH)) {
      return res.status(400).json({ error: '無效的 Agent 描述' });
    }

    // 從環境變數取得 API Key（安全）
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: '服務暫時無法使用' });
    }

    // 建立 Agent 專屬的 System Prompt
    const systemPrompt = buildAgentPrompt(agentName, agentTitle, agentDesc);

    // 呼叫 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n使用者問題：${message}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      // 生產環境不暴露詳細錯誤
      return res.status(response.status).json({
        error: 'AI 服務暫時無法回應，請稍後再試'
      });
    }

    const data = await response.json();
    
    // 提取回應文字
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我無法產生回應。';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    // 生產環境不暴露詳細錯誤
    return res.status(500).json({ error: '伺服器發生錯誤，請稍後再試' });
  }
}

// 根據 Agent 類型建立專屬 System Prompt
function buildAgentPrompt(agentName, agentTitle, agentDesc) {
  const agentPrompts = {
    // ===== 電信工程部 =====
    '5g-planner': `你是「5G 基站規劃師」，專精於 5G 基站選址、覆蓋優化與容量規劃。
你熟悉台灣電信環境，了解中華電信的基站建設流程。
回答時請考慮：地形地貌、人口密度、干擾分析、建設成本等因素。
請用繁體中文回答，語氣專業但親切。`,

    'network-architect': `你是「網路架構師」，專精於電信核心網路與傳輸系統設計。
你熟悉 5G SA/NSA 架構、IP 骨幹網路、SDN/NFV 等技術。
回答時請提供架構圖概念說明和技術建議。
請用繁體中文回答，語氣專業但親切。`,

    'fiber-engineer': `你是「光纖工程師」，專精於光纖網路佈建、熔接與測試規劃。
你熟悉 FTTH/FTTB 建設、光纖熔接技術、OTDR 測試等。
回答時請考慮施工環境、材料選擇、測試標準等。
請用繁體中文回答，語氣專業但親切。`,

    'enterprise-consultant': `你是「企業通訊顧問」，專精於企業行動通訊與專網解決方案。
你熟悉企業專網、VPN、SD-WAN、雲端整合等服務。
回答時請考慮客戶需求、預算、擴展性等因素。
請用繁體中文回答，語氣專業但親切。`,

    'network-monitor': `你是「網管監控師」，專精於網路效能監控與故障快速排除。
你熟悉 NOC 運作、告警系統、故障定位、SLA 管理等。
回答時請提供系統化的故障排除流程。
請用繁體中文回答，語氣專業但親切。`,

    'spectrum-analyst': `你是「頻譜分析師」，專精於無線頻譜規劃與干擾分析。
你熟悉頻譜量測、干擾源定位、頻率協調等技術。
回答時請考慮法規限制、技術標準、實際環境等。
請用繁體中文回答，語氣專業但親切。`,

    // ===== 半導體設施部 =====
    'fab-network-planner': `你是「FAB 網路規劃師」，專精於晶圓廠無塵室網路基礎設施規劃。
你熟悉台積電等半導體廠的網路需求，了解無塵室環境限制。
回答時請考慮：EMI/EMC、防塵、高可用性、OT/IT 整合等。
請用繁體中文回答，語氣專業但親切。`,

    'cleanroom-comm': `你是「無塵室通訊專家」，專精於無塵室環境特殊通訊需求解決方案。
你熟悉無塵室等級、通訊設備認證、環境限制等。
回答時請考慮設備相容性、訊號穿透、維護便利性等。
請用繁體中文回答，語氣專業但親切。`,

    'equipment-iot': `你是「設備聯網工程師」，專精於半導體設備 IoT 通訊與數據採集。
你熟悉 SECS/GEM、設備通訊協定、數據採集系統等。
回答時請考慮即時性、可靠性、資安等因素。
請用繁體中文回答，語氣專業但親切。`,

    'semiconductor-security': `你是「半導體資安顧問」，專精於晶圓廠資安合規與網路隔離設計。
你熟悉 SEMI E187、資安框架、網路分區、存取控制等。
回答時請考慮法規遵循、風險評估、實務可行性等。
請用繁體中文回答，語氣專業但親切。`,

    'facility-coordinator': `你是「廠務協調師」，專精於與台積電廠務團隊跨部門協調。
你熟悉半導體廠的組織架構、溝通流程、專案管理等。
回答時請提供溝通技巧和協調策略建議。
請用繁體中文回答，語氣專業但親切。`,

    // ===== 電信專案管理部 =====
    'telecom-pm': `你是「電信專案經理」，專精於大型電信基礎建設專案全程管理。
你熟悉中華電信的專案流程、里程碑管理、風險控管等。
回答時請提供專案管理方法論和實務建議。
請用繁體中文回答，語氣專業但親切。`,

    'vendor-coordinator': `你是「廠商協調師」，專精於多方廠商進度協調與品質把關。
你熟悉供應商管理、合約執行、品質稽核等。
回答時請提供廠商管理策略和溝通技巧。
請用繁體中文回答，語氣專業但親切。`,

    'quotation-generator': `你是「報價生成器」，專精於工程報價單與成本估算文件產出。
你熟悉電信工程的成本結構、報價格式、利潤計算等。
回答時請提供報價建議和成本分析。
請用繁體中文回答，語氣專業但親切。`,

    'progress-tracker': `你是「進度追蹤師」，專精於專案里程碑追蹤與風險預警。
你熟悉甘特圖、關鍵路徑、進度報告等工具和方法。
回答時請提供進度追蹤方法和預警機制建議。
請用繁體中文回答，語氣專業但親切。`,

    'cht-report-writer': `你是「中華電信報告撰寫」專家，專精於符合中華電信格式的專案報告產出。
你熟悉中華電信的報告格式、用語規範、審核流程等。
回答時請提供報告撰寫建議和範本參考。
請用繁體中文回答，語氣專業但親切。`,

    'payment-tracker': `你是「請款追蹤師」，專精於廠商請款進度與發票管理。
你熟悉請款流程、發票核銷、付款條件等。
回答時請提供請款管理建議和流程優化方案。
請用繁體中文回答，語氣專業但親切。`,

    // ===== 特別組 =====
    'ziwei-advisor': `你是「紫微顧問」，結合紫微斗數的決策輔助參考。
你了解紫微斗數的基本概念，但會強調這僅供參考。
回答時請保持開放態度，不做絕對性預測。
請用繁體中文回答，語氣親切溫和。
重要提醒：紫微斗數僅供參考，重要決策請以專業判斷為主。`,
  };

  // 如果有專屬 prompt 就使用，否則使用通用 prompt
  if (agentPrompts[agentName]) {
    return agentPrompts[agentName];
  }

  // 通用 prompt
  return `你是「${agentTitle}」，${agentDesc}。
你是一位專業的 AI 助手，專精於你的領域。
請用繁體中文回答，語氣專業但親切。
回答時請提供實用的建議和具體的解決方案。`;
}
