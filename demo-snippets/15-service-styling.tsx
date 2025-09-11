// ============ STEP 15: 服务组件样式优化 ============
// 替换完整的 return 部分

  return (
    <div>
      <h2>服务列表</h2>
      {providers.length > 0 ? (
        <div>
          <select
            value={selectedProvider?.address || ""}
            onChange={(e) => {
              const p = providers.find((p) => p.address === e.target.value);
              setSelectedProvider(p);
            }}
            style={{
              padding: "5px",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            {providers.map((p) => (
              <option key={p.address} value={p.address}>
                {p.name} - {p.model}
              </option>
            ))}
          </select>

          {selectedProvider && (
            <div>
              <p>地址: {selectedProvider.address}</p>
              <button
                onClick={verifyService}
                disabled={loading}
                style={{ padding: "5px 15px", marginTop: "10px" }}
              >
                {loading ? "验证中..." : "验证服务"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );