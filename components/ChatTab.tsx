
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

interface ChatTabProps {
  broker: any;
  selectedProvider: any;
  message: string;
  setMessage: (message: string) => void;
}

export default function ChatTab({ 
  broker, 
  selectedProvider, 
  message, 
  setMessage 
}: ChatTabProps) {

  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingMessageId, setVerifyingMessageId] = useState<string | null>(null);

  // 重置消息历史
  useEffect(() => {
    if (selectedProvider) {
      // 读取 localStorage 中的消息历史
      const storedMessages = localStorage.getItem('messages');
      // 获取最近10次对话
      setMessages(storedMessages ? JSON.parse(storedMessages).slice(-20)  : []);
    }
  }, [selectedProvider]);

  // 定义获取币对24hr的变化情况接口函数
  // https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=0gusdt
  const get24hrChangeBySymbol = async (symbol: string) => {
    try {
      const response = await fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching 24hr change:', error);
    }
  }

  // 发送消息（基础版本）
  const sendMessage = async () => {
    if (!broker || !selectedProvider || !inputMessage.trim()) return;

    const sysMsg = {
      role: "system", content: `
        你是全能的AI助手。
        如果用户询问币对相关信息时，请提取币对参数并调用https://fapi.binance.com/fapi里的行情数据。
        基于返回的数据，提供专业的投资分析和建议。分析时应考虑：
        1. 价格涨跌幅情况
        2. 交易量变化
        3. 市场活跃度
        4. 风险提示
        请确保分析客观、专业，并提醒用户投资有风险。`
    }
    const userMsg = { role: "user", content: inputMessage };
    // 配置tools参数，当用户查询币对投资建议时，调用币对24小时行情API
    const tools = [
      {
        type: "function",
        function: {
          name: "get24hrChangeBySymbol",
          description: "当用户询问币对相关信息时，调用币对24小时行情API",
          parameters: {
            type: "object",
            properties: {
              symbol: { "type": "string" }
            },
            required: ["symbol"]
          }
        }
      }
    ]
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const metadata = await broker.inference.getServiceMetadata(selectedProvider.address);
      const headers = await broker.inference.getRequestHeaders(
        selectedProvider.address,
        JSON.stringify([sysMsg, userMsg])
      );

      let account;
      try {
        account = await broker.inference.getAccount(selectedProvider.address);
      } catch (error) {
        await broker.ledger.transferFund(
          selectedProvider.address,
          "inference",
          BigInt(2e18)
        );
      }

      console.log("账户信息:", account);
      console.log("账户信息:", account.balance);
      if (account.balance <= BigInt(1.5e18)) {
        console.log("子账户余额不足，正在充值...");
        await broker.ledger.transferFund(
          selectedProvider.address,
          "inference",
          BigInt(2e18)
        );
      }

      const response = await fetch(`${metadata.endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          messages: [sysMsg, userMsg],
          model: metadata.model,
          stream: false,
          // tools: tools, // 弃用tools方式，使用system promote方式
        }),
      });

      let result = await response.json();
      // console.log("result: ", result);
      // // 判断是否为tool_calls调用
      // if (result.choices[0].finish_reason === "tool_calls") {
      //   const function_data = result.choices[0].message.tool_calls[0]
      //   console.log("function_data: ", function_data);
      //   if (function_data.function.name === "get24hrChangeBySymbol") {
      //     const args = JSON.parse(function_data.function.arguments);
      //     // 调用币对24小时行情API
      //     let priceData = await get24hrChangeBySymbol(args.symbol)
      //     console.log("priceData: ", priceData);
      //     const functionCallMsg = { role: "user", content: `根据币安fapi返回的${JSON.stringify(priceData)}，输出交易分析`}
      //     const headersToolCall = await broker.inference.getRequestHeaders(
      //       selectedProvider.address,
      //       JSON.stringify([functionCallMsg])
      //     );
      //     const functionCallResult = await fetch(`${metadata.endpoint}/chat/completions`, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json", ...headersToolCall },
      //       body: JSON.stringify({
      //         messages: [functionCallMsg],
      //         model: metadata.model,
      //         stream: false,
      //       }),
      //     });
      //     result = await functionCallResult.json();
      //     console.log("functionCallResult: ", result);
      //   }
      // }

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
      }
    } catch (err) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "错误: " + (err instanceof Error ? err.message : String(err))
      }]);
    }
    // 返回最终验证结果后，更新 messages到本地存储
    setMessages((history) => {
      // 在这里可以访问最新的 messages
      localStorage.setItem('messages', JSON.stringify(history));
      return history;
    });
    setLoading(false);
  };

  if (!selectedProvider) {
    return (
      <div>
        <h2>AI 聊天</h2>
        <p>请先选择并验证服务</p>
      </div>
    );
  }

  return (
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
              <strong>{msg.role === "user" ? "你" : "AI"}:</strong> 
              {/* 安装react-markdown包，支持响应中markdown的渲染显示 */}
              <ReactMarkdown remarkPlugins={[gfm]}>{msg.content}</ReactMarkdown>
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
  );
}