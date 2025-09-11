// ============ STEP 12: 服务组件功能函数 ============
// 在状态后面添加这些函数：

  // 获取服务列表
  const fetchProviders = async () => {
    if (!broker) return;

    setLoading(true);
    try {
      const services = await broker.inference.listService();
      const list = services.map((s: any) => ({
        address: s.provider || "",
        name: s.name || s.model || "Unknown",
        model: s.model || "Unknown",
      }));
      setProviders(list);
      if (list.length > 0 && !selectedProvider) {
        setSelectedProvider(list[0]);
      }
    } catch (err) {
      console.error("获取服务失败:", err);
    }
    setLoading(false);
  };

  // 自动获取服务列表
  useEffect(() => {
    fetchProviders();
  }, [broker]);