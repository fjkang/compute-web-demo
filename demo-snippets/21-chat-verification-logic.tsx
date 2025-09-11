// ============ STEP 21: 添加聊天验证逻辑 ============
// 1. 首先添加验证状态：
const [verifyingMessageId, setVerifyingMessageId] = useState<string | null>(null);

// 2. 修改 sendMessage 函数，在 result 处理部分替换为：

      const result = await response.json();
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
          
          // 更新消息验证状态
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