// ============ STEP 14: 添加服务验证功能 ============
// 在 fetchProviders 函数后面添加：

  // 验证服务
  const verifyService = async () => {
    if (!broker || !selectedProvider) return;

    setLoading(true);
    try {
      await broker.inference.acknowledgeProviderSigner(selectedProvider.address);
      setMessage("服务验证成功");
    } catch (err) {
      console.error("服务验证失败:", err);
      setMessage("服务验证失败");
    }
    setLoading(false);
  };

// 然后在 UI 中的 selectedProvider 部分添加验证按钮：

          {selectedProvider && (
            <div>
              <p>地址: {selectedProvider.address}</p>
              <button
                onClick={verifyService}
                disabled={loading}
              >
                {loading ? "验证中..." : "验证服务"}
              </button>
            </div>
          )}