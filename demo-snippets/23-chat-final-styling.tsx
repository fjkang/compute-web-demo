// ============ STEP 23: 聊天组件最终样式 ============
// 替换完整的 return 部分

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