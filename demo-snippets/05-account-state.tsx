// ============ STEP 5: 账户组件状态 ============
// 在 components/AccountTab.tsx 中，替换 "TODO: 添加状态和功能"

  const [balance, setBalance] = useState<{
    total: number;
    available: number;
  } | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);