// ============ STEP 20: 聊天基础UI ============
// 替换聊天组件的 return 部分（在 selectedProvider 检查通过后）

  return (
    <div>
      <h2>AI 聊天</h2>
      <div>当前服务: {selectedProvider.name} - {selectedProvider.model}</div>
      
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role === "user" ? "你" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="输入消息..."
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputMessage.trim()}
        >
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );