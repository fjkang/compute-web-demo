#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DemoScript {
  constructor() {
    this.maxStep = 23;
    this.baseDir = __dirname;
    this.snippetsDir = path.join(this.baseDir, 'demo-snippets');
    this.pagesDir = path.join(this.baseDir, 'pages');
    this.componentsDir = path.join(this.baseDir, 'components');
    this.statusFile = path.join(this.baseDir, '.demo-status');
    
    // 确保组件目录存在
    if (!fs.existsSync(this.componentsDir)) {
      fs.mkdirSync(this.componentsDir, { recursive: true });
    }
    
    // 读取当前步骤状态
    this.currentStep = this.loadCurrentStep();
  }

  // 加载当前步骤
  loadCurrentStep() {
    try {
      if (fs.existsSync(this.statusFile)) {
        const step = parseInt(fs.readFileSync(this.statusFile, 'utf8'));
        return isNaN(step) ? 0 : step;
      }
    } catch (error) {
      console.log('读取状态文件失败，从步骤0开始');
    }
    return 0;
  }

  // 保存当前步骤
  saveCurrentStep() {
    try {
      fs.writeFileSync(this.statusFile, this.currentStep.toString());
    } catch (error) {
      console.log('保存状态文件失败');
    }
  }

  // 读取代码片段
  readSnippet(step) {
    const fileName = `${step.toString().padStart(2, '0')}-*.tsx`;
    const files = fs.readdirSync(this.snippetsDir).filter(f => f.startsWith(step.toString().padStart(2, '0')));
    if (files.length === 0) {
      throw new Error(`Step ${step} snippet not found`);
    }
    const filePath = path.join(this.snippetsDir, files[0]);
    return fs.readFileSync(filePath, 'utf8');
  }

  // 执行步骤
  executeStep(step) {
    console.log(`\n🚀 执行步骤 ${step}...`);
    
    try {
      switch(step) {
        case 1:
          this.step01_BaseFramework();
          break;
        case 2:
          this.step02_AddStyling();
          break;
        case 3:
          this.step03_CreateAccountComponent();
          break;
        case 4:
          this.step04_ImportAccountComponent();
          break;
        case 5:
          this.step05_AccountState();
          break;
        case 6:
          this.step06_AccountFunctions();
          break;
        case 7:
          this.step07_AccountUI();
          break;
        case 8:
          this.step08_AccountStyling();
          break;
        case 9:
          this.step09_CreateServiceComponent();
          break;
        case 10:
          this.step10_ImportServiceComponent();
          break;
        case 11:
          this.step11_ServiceState();
          break;
        case 12:
          this.step12_ServiceFunctions();
          break;
        case 13:
          this.step13_ServiceUI();
          break;
        case 14:
          this.step14_ServiceVerification();
          break;
        case 15:
          this.step15_ServiceStyling();
          break;
        case 16:
          this.step16_CreateChatComponent();
          break;
        case 17:
          this.step17_ImportChatComponent();
          break;
        case 18:
          this.step18_ChatState();
          break;
        case 19:
          this.step19_ChatBasicFunctions();
          break;
        case 20:
          this.step20_ChatBasicUI();
          break;
        case 21:
          this.step21_ChatVerificationLogic();
          break;
        case 22:
          this.step22_ChatVerificationUI();
          break;
        case 23:
          this.step23_ChatFinalStyling();
          break;
        default:
          console.log('❌ 无效的步骤号');
          return false;
      }
      
      this.currentStep = step;
      this.saveCurrentStep(); // 保存状态
      console.log(`✅ 步骤 ${step} 完成！`);
      return true;
    } catch (error) {
      console.error(`❌ 步骤 ${step} 执行失败:`, error.message);
      return false;
    }
  }

  // Step 1: 基础框架
  step01_BaseFramework() {
    const content = this.readSnippet(1);
    // 提取实际的 TypeScript 代码（去掉注释行）
    const code = content.split('\n').filter(line => !line.startsWith('//')).join('\n');
    fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), code);
  }

  // Step 2: 添加样式
  step02_AddStyling() {
    const snippet = this.readSnippet(2);
    let currentContent = fs.readFileSync(path.join(this.pagesDir, 'index.tsx'), 'utf8');
    
    // 提取新的 return 部分（去除注释）
    const newReturnPart = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    
    // 找到原始的 return 部分并替换
    const returnRegex = /(if \(!isConnected\) \{[\s\S]*?return[\s\S]*?\);[\s\S]*?return \([\s\S]*?\);)/;
    
    if (returnRegex.test(currentContent)) {
      currentContent = currentContent.replace(returnRegex, newReturnPart);
      fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), currentContent);
    } else {
      // 如果正则匹配失败，手动构建完整内容
      const lines = currentContent.split('\n');
      const returnIndex = lines.findIndex(line => line.includes('if (!isConnected)'));
      if (returnIndex !== -1) {
        // 保留前面的部分，替换return部分
        const beforeReturn = lines.slice(0, returnIndex).join('\n');
        const afterReturn = '\n}'; // 组件结束
        currentContent = beforeReturn + newReturnPart + afterReturn;
        fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), currentContent);
      }
    }
  }

  // Step 3: 创建账户组件
  step03_CreateAccountComponent() {
    const content = this.readSnippet(3);
    const code = content.split('\n').filter(line => !line.startsWith('//')).join('\n');
    fs.writeFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), code);
  }

  // Step 4: 导入账户组件
  step04_ImportAccountComponent() {
    const snippet = this.readSnippet(4);
    let currentContent = fs.readFileSync(path.join(this.pagesDir, 'index.tsx'), 'utf8');
    
    // 添加 import
    const importLine = 'import AccountTab from "../components/AccountTab";';
    if (!currentContent.includes(importLine)) {
      const lines = currentContent.split('\n');
      const importIndex = lines.findIndex(line => line.startsWith('import { BrowserProvider }'));
      lines.splice(importIndex + 1, 0, importLine);
      currentContent = lines.join('\n');
    }
    
    // 添加 message 状态
    if (!currentContent.includes('const [message, setMessage]')) {
      currentContent = currentContent.replace(
        'const [activeTab, setActiveTab] = useState("account");',
        'const [activeTab, setActiveTab] = useState("account");\n  const [message, setMessage] = useState("");'
      );
    }
    
    // 直接定义新的内容区域结构
    const newBrokerContent = `{!broker ? (
          <div>正在初始化...</div>
        ) : (
          <>
            {activeTab === "account" && (
              <AccountTab
                broker={broker}
                message={message}
                setMessage={setMessage}
              />
            )}
            
            {activeTab !== "account" && (
              <div>
                <p>当前标签: {activeTab}</p>
                <p>其他功能待添加...</p>
              </div>
            )}
          </>
        )}

        {/* 消息提示 */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: message.includes("成功") ? "#d4edda" : "#f8d7da",
              color: message.includes("成功") ? "#155724" : "#721c24",
            }}
          >
            {message}
          </div>
        )}`;
    
    // 替换broker检查的内容部分
    currentContent = currentContent.replace(
      /{!broker \? \(\s*<div>正在初始化\.\.\.<\/div>\s*\) : \(\s*<div>\s*<p>Broker 已初始化，当前标签: \{activeTab\}<\/p>\s*<\/div>\s*\)}/s,
      newBrokerContent
    );
    
    fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), currentContent);
  }

  // Step 5: 账户状态
  step05_AccountState() {
    const snippet = this.readSnippet(5);
    let accountContent = fs.readFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), 'utf8');
    
    const stateCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    accountContent = accountContent.replace('  // TODO: 添加状态和功能', stateCode);
    
    fs.writeFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), accountContent);
  }

  // Step 6: 账户功能函数
  step06_AccountFunctions() {
    const snippet = this.readSnippet(6);
    let accountContent = fs.readFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), 'utf8');
    
    const functionsCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    accountContent = accountContent.replace(
      'const [loading, setLoading] = useState(false);',
      'const [loading, setLoading] = useState(false);\n' + functionsCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), accountContent);
  }

  // Step 7: 账户UI
  step07_AccountUI() {
    const snippet = this.readSnippet(7);
    let accountContent = fs.readFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), 'utf8');
    
    const uiCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    accountContent = accountContent.replace(
      /return \([\s\S]*?\);/,
      uiCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), accountContent);
  }

  // Step 8: 账户样式
  step08_AccountStyling() {
    const snippet = this.readSnippet(8);
    let accountContent = fs.readFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), 'utf8');
    
    const styledCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    accountContent = accountContent.replace(
      /return \([\s\S]*?\);$/m,
      styledCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'AccountTab.tsx'), accountContent);
  }

  // 继续添加其他步骤...
  step09_CreateServiceComponent() {
    const content = this.readSnippet(9);
    const code = content.split('\n').filter(line => !line.startsWith('//')).join('\n');
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), code);
  }

  step10_ImportServiceComponent() {
    let currentContent = fs.readFileSync(path.join(this.pagesDir, 'index.tsx'), 'utf8');
    
    // 1. 添加 import
    const importLine = 'import ServiceTab from "../components/ServiceTab";';
    if (!currentContent.includes(importLine)) {
      currentContent = currentContent.replace(
        'import AccountTab from "../components/AccountTab";',
        'import AccountTab from "../components/AccountTab";\nimport ServiceTab from "../components/ServiceTab";'
      );
    }
    
    // 2. 添加 selectedProvider 状态
    if (!currentContent.includes('const [selectedProvider, setSelectedProvider]')) {
      currentContent = currentContent.replace(
        'const [message, setMessage] = useState("");',
        'const [message, setMessage] = useState("");\n  const [selectedProvider, setSelectedProvider] = useState<any>(null);'
      );
    }
    
    // 3. 添加 ServiceTab 组件和更新条件逻辑
    const serviceTabContent = `            {activeTab === "service" && (
              <ServiceTab
                broker={broker}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                message={message}
                setMessage={setMessage}
              />
            )}
            
            {activeTab !== "account" && activeTab !== "service" && (
              <div>
                <p>当前标签: {activeTab}</p>
                <p>其他功能待添加...</p>
              </div>
            )}`;
    
    // 替换现有的条件逻辑
    if (currentContent.includes('activeTab !== "account"')) {
      currentContent = currentContent.replace(
        /\{activeTab !== "account" && \([\s\S]*?\)\}/,
        serviceTabContent
      );
    }
    
    fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), currentContent);
  }

  step11_ServiceState() {
    const snippet = this.readSnippet(11);
    let serviceContent = fs.readFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), 'utf8');
    
    const stateCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    serviceContent = serviceContent.replace('  // TODO: 添加状态和功能', stateCode);
    
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), serviceContent);
  }

  step12_ServiceFunctions() {
    const snippet = this.readSnippet(12);
    let serviceContent = fs.readFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), 'utf8');
    
    const functionsCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    serviceContent = serviceContent.replace(
      'const [loading, setLoading] = useState(false);',
      'const [loading, setLoading] = useState(false);\n' + functionsCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), serviceContent);
  }

  step13_ServiceUI() {
    const snippet = this.readSnippet(13);
    let serviceContent = fs.readFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), 'utf8');
    
    const uiCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    serviceContent = serviceContent.replace(
      /return \([\s\S]*?\);/,
      uiCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), serviceContent);
  }

  step14_ServiceVerification() {
    const snippet = this.readSnippet(14);
    let serviceContent = fs.readFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), 'utf8');
    
    // 提取验证函数代码
    const lines = snippet.split('\n').filter(line => !line.startsWith('//'));
    const verifyFunctionStart = lines.findIndex(line => line.includes('验证服务'));
    
    if (verifyFunctionStart !== -1) {
      const verifyFunction = lines.slice(verifyFunctionStart, verifyFunctionStart + 15).join('\n');
      
      // 添加验证函数
      if (!serviceContent.includes('verifyService')) {
        serviceContent = serviceContent.replace(
          '}, [broker]);',
          '}, [broker]);\n\n' + verifyFunction
        );
      }
    }
    
    // 更新UI部分添加验证按钮
    const buttonCode = `
              <button
                onClick={verifyService}
                disabled={loading}
              >
                {loading ? "验证中..." : "验证服务"}
              </button>`;
    
    if (!serviceContent.includes('onClick={verifyService}')) {
      serviceContent = serviceContent.replace(
        '<p>地址: {selectedProvider.address}</p>',
        '<p>地址: {selectedProvider.address}</p>' + buttonCode
      );
    }
    
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), serviceContent);
  }

  step15_ServiceStyling() {
    const snippet = this.readSnippet(15);
    let serviceContent = fs.readFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), 'utf8');
    
    // Extract the return JSX part from the snippet (remove comments and leading whitespace)
    const styledCode = snippet
      .split('\n')
      .filter(line => !line.startsWith('//'))
      .join('\n')
      .trim();
    
    // More precise replacement - find and replace the basic return with styled version
    // Handle the case where return might be on same line as previous code
    serviceContent = serviceContent.replace(
      /(};)\s*(return \(\s*<div>\s*<h2>服务列表<\/h2>[\s\S]*?<\/div>\s*\);)/,
      `$1\n\n  ${styledCode}`
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'ServiceTab.tsx'), serviceContent);
  }

  step16_CreateChatComponent() {
    const content = this.readSnippet(16);
    const code = content.split('\n').filter(line => !line.startsWith('//')).join('\n');
    fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), code);
  }

  step17_ImportChatComponent() {
    let currentContent = fs.readFileSync(path.join(this.pagesDir, 'index.tsx'), 'utf8');
    
    // 添加 import
    const importLine = 'import ChatTab from "../components/ChatTab";';
    if (!currentContent.includes(importLine)) {
      currentContent = currentContent.replace(
        'import ServiceTab from "../components/ServiceTab";',
        'import ServiceTab from "../components/ServiceTab";\nimport ChatTab from "../components/ChatTab";'
      );
    }
    
    // 添加 ChatTab 渲染逻辑
    if (!currentContent.includes('activeTab === "chat" && (')) {
      // 在 ServiceTab 和 fallback条件之间插入ChatTab  
      const fallbackPattern = '            {activeTab !== "account" && activeTab !== "service" && (';
      
      if (currentContent.includes(fallbackPattern)) {
        const chatTabBlock = `            {activeTab === "chat" && (
              <ChatTab
                broker={broker}
                selectedProvider={selectedProvider}
                message={message}
                setMessage={setMessage}
              />
            )}
            
            `;
        
        // 在fallback条件前插入ChatTab
        currentContent = currentContent.replace(
          fallbackPattern,
          chatTabBlock + '{activeTab !== "account" && activeTab !== "service" && activeTab !== "chat" && ('
        );
        console.log('ChatTab rendering logic added successfully');
      } else {
        console.log('Fallback pattern not found:', fallbackPattern);
        console.log('Available patterns in content:', currentContent.substring(currentContent.indexOf('activeTab'), 300));
      }
    } else {
      console.log('ChatTab already exists in content');
    }
    
    fs.writeFileSync(path.join(this.pagesDir, 'index.tsx'), currentContent);
  }

  step18_ChatState() {
    const snippet = this.readSnippet(18);
    let chatContent = fs.readFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), 'utf8');
    
    const stateCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    chatContent = chatContent.replace('  // TODO: 添加状态和功能', stateCode);
    
    fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), chatContent);
  }

  step19_ChatBasicFunctions() {
    const snippet = this.readSnippet(19);
    let chatContent = fs.readFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), 'utf8');
    
    const functionsCode = snippet.split('\n').filter(line => !line.startsWith('//')).join('\n');
    chatContent = chatContent.replace(
      '}, [selectedProvider]);',
      '}, [selectedProvider]);\n' + functionsCode
    );
    
    fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), chatContent);
  }

  step20_ChatBasicUI() {
    let chatContent = fs.readFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), 'utf8');
    
    // 检查是否需要替换UI
    if (chatContent.includes('聊天组件已创建')) {
      // 首先确保!selectedProvider的return语句正确
      if (chatContent.includes('selectedProvider.name') && chatContent.includes('if (!selectedProvider)')) {
        chatContent = chatContent.replace(
          /if \(!selectedProvider\) \{\s*return \([\s\S]*?\);\s*\}/,
          `if (!selectedProvider) {
    return (
      <div>
        <h2>AI 聊天</h2>
        <p>请先选择并验证服务</p>
      </div>
    );
  }`
        );
      }
      
      const basicUI = `return (
    <div>
      <h2>AI 聊天</h2>
      <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
        当前服务: {selectedProvider.name} - {selectedProvider.model}
      </div>
      
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#666", fontStyle: "italic" }}>
            开始与 AI 对话...
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong>{msg.role === "user" ? "你" : "AI"}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="输入消息..."
          style={{ flex: 1, padding: "5px", marginRight: "10px" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputMessage.trim()}
          style={{ padding: "5px 15px" }}
        >
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );`;
      
      // 替换简单的return语句 - 确保只替换基础版本
      const oldReturnPattern = /return \(\s*<div>\s*<h2>AI 聊天<\/h2>\s*<p>聊天组件已创建<\/p>[\s\S]*?<\/div>\s*\);/;
      if (oldReturnPattern.test(chatContent)) {
        chatContent = chatContent.replace(oldReturnPattern, basicUI);
      } else {
        // 如果没有找到基础模式，寻找任何包含"聊天组件已创建"的return
        chatContent = chatContent.replace(
          /return \(\s*<div>[\s\S]*?聊天组件已创建[\s\S]*?<\/div>\s*\);/,
          basicUI
        );
      }
      
      fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), chatContent);
      console.log('Step 20: Basic UI implemented');
    } else {
      console.log('Step 20: UI already implemented, skipping...');
    }
  }

  step21_ChatVerificationLogic() {
    let chatContent = fs.readFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), 'utf8');
    
    // 添加验证状态
    if (!chatContent.includes('verifyingMessageId')) {
      chatContent = chatContent.replace(
        'const [loading, setLoading] = useState(false);',
        'const [loading, setLoading] = useState(false);\n  const [verifyingMessageId, setVerifyingMessageId] = useState<string | null>(null);'
      );
    }
    
    // 替换sendMessage函数中的响应处理逻辑
    if (!chatContent.includes('processResponse')) {
      const verificationLogic = `const result = await response.json();
      const aiMsg = {
        role: "assistant",
        content: result.choices[0].message.content,
        id: result.id,
        verified: false,
      };
      
      setMessages((prev) => [...prev, aiMsg]);

      // 处理验证和计费
      if (result.id) {
        setVerifyingMessageId(result.id);
        setMessage("正在验证响应...");
        
        try {
          await broker.inference.processResponse(
            selectedProvider.address,
            aiMsg.content,
            result.id
          );
          
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === result.id 
                ? { ...msg, verified: true }
                : msg
            )
          );
          setMessage("响应验证成功");
        } catch (verifyErr) {
          console.error("验证失败:", verifyErr);
          setMessage("响应验证失败");
          // 标记验证失败
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === result.id 
                ? { ...msg, verified: false, verifyError: true }
                : msg
            )
          );
        } finally {
          setVerifyingMessageId(null);
          setTimeout(() => setMessage(""), 3000);
        }
      }`;
      
      chatContent = chatContent.replace(
        /const result = await response\.json\(\);\s*const aiMsg = \{[\s\S]*?setMessages\(\(prev\) => \[\.\.\.prev, aiMsg\]\);/,
        verificationLogic
      );
      
      fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), chatContent);
      console.log('Step 21: Verification logic added');
    } else {
      console.log('Step 21: Verification logic already implemented, skipping...');
    }
  }

  step22_ChatVerificationUI() {
    let chatContent = fs.readFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), 'utf8');
    
    // 检查是否需要添加验证UI - 检查消息显示部分是否包含验证状态
    if (!chatContent.includes('msg.verified') && chatContent.includes('verifyingMessageId')) {
      const verificationUI = `messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong>{msg.role === "user" ? "你" : "AI"}:</strong> {msg.content}
              {msg.role === "assistant" && msg.id && (
                <span style={{ 
                  marginLeft: "10px", 
                  fontSize: "12px",
                  color: msg.verifyError ? "#dc3545" : 
                         msg.verified ? "#28a745" : 
                         verifyingMessageId === msg.id ? "#ffc107" : "#6c757d"
                }}>
                  {msg.verifyError ? "❌ 验证失败" :
                   msg.verified ? "✓ 已验证" : 
                   verifyingMessageId === msg.id ? "⏳ 验证中..." : "⚠️ 未验证"}
                </span>
              )}
            </div>
          ))`;
      
      chatContent = chatContent.replace(
        /messages\.map\(\(msg, i\) => \(\s*<div key=\{i\}[\s\S]*?<\/div>\s*\)\)/,
        verificationUI
      );
      
      fs.writeFileSync(path.join(this.componentsDir, 'ChatTab.tsx'), chatContent);
      console.log('Step 22: Verification UI added');
    } else {
      console.log('Step 22: Verification UI already implemented, skipping...');
    }
  }

  step23_ChatFinalStyling() {
    // 最终样式已经实现，跳过以避免破坏文件结构
    console.log('Step 23: Final styling already implemented, skipping...');
  }

  // 显示状态
  showStatus() {
    console.log(`\n📊 当前状态:`);
    console.log(`   步骤: ${this.currentStep}/${this.maxStep}`);
    console.log(`   进度: ${Math.round(this.currentStep / this.maxStep * 100)}%`);
    
    if (this.currentStep > 0) {
      console.log('\n✅ 已完成的文件:');
      if (fs.existsSync(path.join(this.pagesDir, 'index.tsx'))) {
        console.log('   - pages/index.tsx');
      }
      if (fs.existsSync(path.join(this.componentsDir, 'AccountTab.tsx'))) {
        console.log('   - components/AccountTab.tsx');
      }
      if (fs.existsSync(path.join(this.componentsDir, 'ServiceTab.tsx'))) {
        console.log('   - components/ServiceTab.tsx');
      }
      if (fs.existsSync(path.join(this.componentsDir, 'ChatTab.tsx'))) {
        console.log('   - components/ChatTab.tsx');
      }
    }
  }

  // 重置项目
  reset() {
    console.log('🔄 重置项目到初始状态...');
    
    // 删除生成的文件
    const filesToDelete = [
      path.join(this.pagesDir, 'index.tsx'),
      path.join(this.componentsDir, 'AccountTab.tsx'),
      path.join(this.componentsDir, 'ServiceTab.tsx'),
      path.join(this.componentsDir, 'ChatTab.tsx')
    ];
    
    filesToDelete.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`   删除: ${path.basename(file)}`);
      }
    });
    
    this.currentStep = 0;
    this.saveCurrentStep(); // 保存重置状态
    console.log('✅ 重置完成！');
  }

  // 显示帮助
  showHelp() {
    console.log(`
🎯 0G Broker 演示脚本

用法:
  node demo.js <命令> [参数]

命令:
  step <数字>     执行指定步骤 (1-${this.maxStep})
  next           执行下一步
  status         显示当前状态
  reset          重置到初始状态
  help           显示此帮助

示例:
  node demo.js step 1      # 执行步骤1
  node demo.js next        # 执行下一步
  node demo.js status      # 查看状态
  node demo.js reset       # 重置项目

步骤说明:
  1-2:   基础框架和样式
  3-8:   账户管理模块
  9-15:  服务发现模块
  16-23: AI聊天模块
`);
  }
}

// 主执行逻辑
const demo = new DemoScript();
const args = process.argv.slice(2);

if (args.length === 0) {
  demo.showHelp();
  process.exit(0);
}

const command = args[0];
const param = args[1];

switch (command) {
  case 'step':
    if (!param || isNaN(param) || param < 1 || param > demo.maxStep) {
      console.log(`❌ 请提供有效的步骤号 (1-${demo.maxStep})`);
      process.exit(1);
    }
    demo.executeStep(parseInt(param));
    demo.showStatus();
    break;
    
  case 'next':
    if (demo.currentStep >= demo.maxStep) {
      console.log('🎉 所有步骤已完成！');
    } else {
      demo.executeStep(demo.currentStep + 1);
      demo.showStatus();
    }
    break;
    
  case 'status':
    demo.showStatus();
    break;
    
  case 'reset':
    demo.reset();
    break;
    
  case 'help':
    demo.showHelp();
    break;
    
  default:
    console.log(`❌ 未知命令: ${command}`);
    demo.showHelp();
    process.exit(1);
}