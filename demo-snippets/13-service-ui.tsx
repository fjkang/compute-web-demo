// ============ STEP 13: 服务组件基础UI ============
// 替换 return 部分

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
            </div>
          )}
        </div>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );