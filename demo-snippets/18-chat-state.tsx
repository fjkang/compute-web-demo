// ============ STEP 18: 聊天组件状态 ============
// 在 components/ChatTab.tsx 中，替换 "TODO: 添加状态和功能"

  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 重置消息历史
  useEffect(() => {
    if (selectedProvider) {
      setMessages([]);
    }
  }, [selectedProvider]);