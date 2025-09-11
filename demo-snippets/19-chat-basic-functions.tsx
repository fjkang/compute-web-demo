// ============ STEP 19: 聊天基础功能函数 ============
// 在状态后面添加基础的发送消息函数：

  // 发送消息（基础版本）
  const sendMessage = async () => {
    if (!broker || !selectedProvider || !inputMessage.trim()) return;

    const userMsg = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const metadata = await broker.inference.getServiceMetadata(selectedProvider.address);
      const headers = await broker.inference.getRequestHeaders(
        selectedProvider.address,
        JSON.stringify([userMsg])
      );

      const response = await fetch(`${metadata.endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          messages: [userMsg],
          model: metadata.model,
          stream: false,
        }),
      });

      const result = await response.json();
      const aiMsg = {
        role: "assistant",
        content: result.choices[0].message.content,
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "错误: " + (err instanceof Error ? err.message : String(err))
      }]);
    }
    setLoading(false);
  };