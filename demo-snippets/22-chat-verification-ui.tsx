// ============ STEP 22: 聊天验证状态UI ============
// 替换消息显示部分：

      <div>
        {messages.length === 0 ? (
          <div>开始与 AI 对话...</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i}>
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