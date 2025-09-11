// ============ STEP 2: 添加基础样式 ============
// 替换 pages/index.tsx 中的 return 部分

  if (!isConnected) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>0G Broker 演示</h1>
        <p>请先连接钱包</p>
        <div style={{ marginTop: "20px" }}>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>0G Broker 演示</h1>
        <ConnectButton />
      </div>

      {/* 标签导航 */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("account")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            background: activeTab === "account" ? "#007bff" : "#f0f0f0",
            color: activeTab === "account" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          账户
        </button>
        <button
          onClick={() => setActiveTab("service")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            background: activeTab === "service" ? "#007bff" : "#f0f0f0",
            color: activeTab === "service" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          服务
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          style={{
            padding: "10px 20px",
            background: activeTab === "chat" ? "#007bff" : "#f0f0f0",
            color: activeTab === "chat" ? "white" : "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          聊天
        </button>
      </div>

      {/* 内容区域 */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          minHeight: "400px",
        }}
      >
        {!broker ? (
          <div>正在初始化...</div>
        ) : (
          <div>
            <p>Broker 已初始化，当前标签: {activeTab}</p>
          </div>
        )}
      </div>
    </div>
  );