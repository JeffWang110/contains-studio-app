import React, { useState, useRef, useEffect } from 'react';

const departments = [
  // ===== 電信專屬部門 =====
  {
    id: 'telecom',
    name: '電信工程',
    nameEn: 'Telecom Engineering',
    icon: '📡',
    color: 'from-cyan-500 to-cyan-600',
    bgLight: 'bg-cyan-50',
    border: 'border-cyan-200',
    textColor: 'text-cyan-600',
    agents: [
      { name: '5g-planner', title: '5G 基站規劃師', desc: '5G 基站選址、覆蓋優化與容量規劃' },
      { name: 'network-architect', title: '網路架構師', desc: '電信核心網路與傳輸系統設計' },
      { name: 'fiber-engineer', title: '光纖工程師', desc: '光纖網路佈建、熔接與測試規劃' },
      { name: 'enterprise-consultant', title: '企業通訊顧問', desc: '企業行動通訊與專網解決方案' },
      { name: 'network-monitor', title: '網管監控師', desc: '網路效能監控與故障快速排除' },
      { name: 'spectrum-analyst', title: '頻譜分析師', desc: '無線頻譜規劃與干擾分析' },
    ]
  },
  // ===== 台積電專案部門 =====
  {
    id: 'tsmc',
    name: '半導體設施',
    nameEn: 'Semiconductor Facility',
    icon: '🔬',
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-600',
    agents: [
      { name: 'fab-network-planner', title: 'FAB 網路規劃師', desc: '晶圓廠無塵室網路基礎設施規劃' },
      { name: 'cleanroom-comm', title: '無塵室通訊專家', desc: '無塵室環境特殊通訊需求解決方案' },
      { name: 'equipment-iot', title: '設備聯網工程師', desc: '半導體設備 IoT 通訊與數據採集' },
      { name: 'semiconductor-security', title: '半導體資安顧問', desc: '晶圓廠資安合規與網路隔離設計' },
      { name: 'facility-coordinator', title: '廠務協調師', desc: '與台積電廠務團隊跨部門協調' },
    ]
  },
  // ===== 電信專案管理部 =====
  {
    id: 'telecom-pm',
    name: '電信專案管理',
    nameEn: 'Telecom PM',
    icon: '📊',
    color: 'from-violet-500 to-violet-600',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    textColor: 'text-violet-600',
    agents: [
      { name: 'telecom-pm', title: '電信專案經理', desc: '大型電信基礎建設專案全程管理' },
      { name: 'vendor-coordinator', title: '廠商協調師', desc: '多方廠商進度協調與品質把關' },
      { name: 'quotation-generator', title: '報價生成器', desc: '工程報價單與成本估算文件產出' },
      { name: 'progress-tracker', title: '進度追蹤師', desc: '專案里程碑追蹤與風險預警' },
      { name: 'cht-report-writer', title: '中華電信報告撰寫', desc: '符合中華電信格式的專案報告產出' },
      { name: 'payment-tracker', title: '請款追蹤師', desc: '廠商請款進度與發票管理' },
    ]
  },
  // ===== 軟體工程部 =====
  {
    id: 'engineering',
    name: '軟體工程',
    nameEn: 'Software Engineering',
    icon: '💻',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-600',
    agents: [
      { name: 'rapid-prototyper', title: '快速原型師', desc: '在幾天內建立 MVP，而非幾週' },
      { name: 'ai-engineer', title: 'AI 工程師', desc: '整合可落地的 AI/ML 功能' },
      { name: 'backend-architect', title: '後端架構師', desc: '設計可擴展的 API 與伺服器系統' },
      { name: 'frontend-developer', title: '前端開發者', desc: '建構高效能使用者介面' },
      { name: 'mobile-app-builder', title: '行動應用開發', desc: '打造原生 iOS/Android 體驗' },
      { name: 'devops-automator', title: 'DevOps 自動化', desc: '持續部署不中斷服務' },
      { name: 'test-writer-fixer', title: '測試撰寫修復', desc: '撰寫能抓到真正 bug 的測試' },
    ]
  },
  // ===== 設計部 =====
  {
    id: 'design',
    name: '設計部',
    nameEn: 'Design',
    icon: '🎨',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    textColor: 'text-purple-600',
    agents: [
      { name: 'ui-designer', title: 'UI 設計師', desc: '設計開發者能實際建構的介面' },
      { name: 'ux-researcher', title: 'UX 研究員', desc: '將使用者洞察轉化為產品改進' },
      { name: 'brand-guardian', title: '品牌守護者', desc: '確保視覺識別一致性' },
      { name: 'visual-storyteller', title: '視覺敘事師', desc: '創造能轉換與分享的視覺內容' },
      { name: 'whimsy-injector', title: '驚喜注入師', desc: '為每個互動添加愉悅感' },
    ]
  },
  // ===== 行銷部 =====
  {
    id: 'marketing',
    name: '行銷部',
    nameEn: 'Marketing',
    icon: '📣',
    color: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    textColor: 'text-orange-600',
    agents: [
      { name: 'growth-hacker', title: '成長駭客', desc: '發現並利用病毒式成長迴圈' },
      { name: 'content-creator', title: '內容創作者', desc: '跨平台生成內容' },
      { name: 'tiktok-strategist', title: 'TikTok 策略師', desc: '創造可分享的行銷時刻' },
      { name: 'twitter-engager', title: 'Twitter 互動師', desc: '搭上趨勢達成病毒式傳播' },
      { name: 'app-store-optimizer', title: '應用商店優化師', desc: '主宰應用商店搜尋結果' },
    ]
  },
  // ===== 產品部 =====
  {
    id: 'product',
    name: '產品部',
    nameEn: 'Product',
    icon: '📦',
    color: 'from-green-500 to-green-600',
    bgLight: 'bg-green-50',
    border: 'border-green-200',
    textColor: 'text-green-600',
    agents: [
      { name: 'trend-researcher', title: '趨勢研究員', desc: '識別病毒式機會' },
      { name: 'feedback-synthesizer', title: '回饋整合師', desc: '將抱怨轉化為功能' },
      { name: 'sprint-prioritizer', title: 'Sprint 排序師', desc: '在 6 天內交付最大價值' },
    ]
  },
  // ===== 營運部 =====
  {
    id: 'studio-operations',
    name: '營運部',
    nameEn: 'Operations',
    icon: '⚙️',
    color: 'from-gray-500 to-gray-600',
    bgLight: 'bg-gray-50',
    border: 'border-gray-200',
    textColor: 'text-gray-600',
    agents: [
      { name: 'analytics-reporter', title: '數據分析報告', desc: '將數據轉化為可行動的洞察' },
      { name: 'finance-tracker', title: '財務追蹤師', desc: '保持工作室獲利' },
      { name: 'legal-compliance-checker', title: '法規合規檢查', desc: '快速行動同時保持合法' },
      { name: 'support-responder', title: '客服回應師', desc: '將憤怒用戶轉化為擁護者' },
    ]
  },
  // ===== 測試部 =====
  {
    id: 'testing',
    name: '測試部',
    nameEn: 'Testing',
    icon: '🧪',
    color: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
    textColor: 'text-red-600',
    agents: [
      { name: 'api-tester', title: 'API 測試師', desc: '確保 API 在壓力下正常運作' },
      { name: 'performance-benchmarker', title: '效能評測師', desc: '讓一切變得更快' },
      { name: 'workflow-optimizer', title: '流程優化師', desc: '消除工作流程瓶頸' },
    ]
  },
  // ===== 特別組 =====
  {
    id: 'bonus',
    name: '特別組',
    nameEn: 'Bonus',
    icon: '✨',
    color: 'from-pink-500 to-pink-600',
    bgLight: 'bg-pink-50',
    border: 'border-pink-200',
    textColor: 'text-pink-600',
    agents: [
      { name: 'studio-coach', title: '工作室教練', desc: '召集 AI 團隊達成卓越' },
      { name: 'joker', title: '開心果', desc: '用科技幽默緩和氣氛' },
      { name: 'ziwei-advisor', title: '紫微顧問', desc: '結合紫微斗數的決策輔助參考' },
    ]
  },
];

function App() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 自動滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 呼叫 Gemini API
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agentName: selectedAgent.name,
          agentTitle: selectedAgent.title,
          agentDesc: selectedAgent.desc,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply 
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，發生了一些問題。請稍後再試。\n\n錯誤詳情：' + error.message 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 對話介面
  if (selectedAgent) {
    const dept = departments.find(d => d.id === selectedDept);
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${dept.color} text-white p-4 shadow-lg`}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button 
              onClick={() => { setSelectedAgent(null); setMessages([]); }}
              className="p-2 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h1 className="font-bold text-lg">{selectedAgent.title}</h1>
                <p className="text-sm opacity-80 font-mono">{selectedAgent.name}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm opacity-80">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Gemini AI 已連線
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-lg font-medium text-gray-600">{selectedAgent.title}</p>
              <p className="text-sm text-gray-500">{selectedAgent.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
                <span className="text-xs bg-white px-3 py-1 rounded-full shadow">💬 開始對話</span>
                <span className="text-xs bg-white px-3 py-1 rounded-full shadow">📋 詢問專案</span>
                <span className="text-xs bg-white px-3 py-1 rounded-full shadow">🔧 技術諮詢</span>
              </div>
              <p className="mt-4 text-xs text-gray-400">由 Google Gemini AI 驅動</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? `bg-gradient-to-r ${dept.color} text-white rounded-br-sm` 
                      : 'bg-white shadow-md rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md rounded-2xl rounded-bl-sm p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`詢問 ${selectedAgent.title}...`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`px-6 py-3 bg-gradient-to-r ${dept.color} text-white rounded-xl hover:opacity-90 transition font-medium flex items-center gap-2 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中
                </>
              ) : (
                <>
                  發送
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Agent 列表
  if (selectedDept) {
    const dept = departments.find(d => d.id === selectedDept);
    
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className={`bg-gradient-to-r ${dept.color} text-white p-6 shadow-lg`}>
          <div className="max-w-6xl mx-auto">
            <button 
              onClick={() => setSelectedDept(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回部門選擇
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                {dept.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{dept.name}</h1>
                <p className="opacity-80">{dept.nameEn} · {dept.agents.length} 位 Agents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dept.agents.map((agent) => (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent)}
                className={`p-5 rounded-xl bg-white border-2 ${dept.border} text-left hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${dept.color} flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    💬
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg">{agent.title}</h3>
                    <p className="text-xs text-gray-400 font-mono truncate">{agent.name}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{agent.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 部門選擇首頁
  const featuredDepts = departments.filter(d => ['telecom', 'tsmc', 'telecom-pm'].includes(d.id));
  const otherDepts = departments.filter(d => !['telecom', 'tsmc', 'telecom-pm'].includes(d.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="text-center py-10 px-4">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          AI Agents Studio
        </h1>
        <p className="text-xl text-gray-400">中華電信 × 台積電 專案管理平台</p>
        <p className="text-gray-500 mt-2">選擇部門以檢視可用的 AI Agents</p>
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Powered by Google Gemini AI
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 flex justify-around text-center">
          <div>
            <div className="text-3xl font-bold text-white">{departments.length}</div>
            <div className="text-gray-400 text-sm">部門</div>
          </div>
          <div className="border-l border-white/10" />
          <div>
            <div className="text-3xl font-bold text-white">
              {departments.reduce((sum, d) => sum + d.agents.length, 0)}
            </div>
            <div className="text-gray-400 text-sm">AI Agents</div>
          </div>
          <div className="border-l border-white/10" />
          <div>
            <div className="text-3xl font-bold text-cyan-400">CHT</div>
            <div className="text-gray-400 text-sm">中華電信</div>
          </div>
          <div className="border-l border-white/10" />
          <div>
            <div className="text-3xl font-bold text-emerald-400">TSMC</div>
            <div className="text-gray-400 text-sm">台積電</div>
          </div>
        </div>
      </div>

      {/* Featured Departments */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          ⭐ 專屬部門
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredDepts.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur border-2 border-white/20 hover:border-white/40 p-6 text-left transition-all duration-300 hover:scale-[1.03] hover:bg-white/15"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${dept.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {dept.icon}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{dept.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{dept.nameEn}</p>
              
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">👥 {dept.agents.length} Agents</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Other Departments */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          📁 通用部門
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {otherDepts.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:border-white/30 p-4 text-left transition-all duration-300 hover:bg-white/10"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${dept.color} flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform`}>
                {dept.icon}
              </div>
              
              <h2 className="text-sm font-bold text-white mb-0.5">{dept.name}</h2>
              <p className="text-gray-500 text-xs">{dept.agents.length} Agents</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm border-t border-white/5">
        <p>基於 Contains Studio Agents 專案客製化</p>
        <p className="mt-1">⚡ 專為電信工程與半導體設施設計 · Powered by Gemini AI</p>
      </div>
    </div>
  );
}

export default App;
