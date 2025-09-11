// ============ STEP 6: 账户组件功能函数 ============
// 在状态后面添加这些函数：

  // 获取余额
  const fetchBalance = async () => {
    if (!broker) return;

    try {
      const { ledgerInfo } = await broker.ledger.ledger.getLedgerWithDetail();
      const total = Number(ledgerInfo[0]) / 1e18;
      const locked = Number(ledgerInfo[1]) / 1e18;
      setBalance({ total, available: total - locked });
    } catch {
      setBalance(null);
    }
  };

  // 充值
  const handleDeposit = async () => {
    if (!broker || !depositAmount) return;

    setLoading(true);
    try {
      const amount = parseFloat(depositAmount);

      // 检查是否有账本
      let hasLedger = false;
      try {
        await broker.ledger.ledger.getLedgerWithDetail();
        hasLedger = true;
      } catch {}

      if (hasLedger) {
        await broker.ledger.depositFund(amount);
      } else {
        await broker.ledger.addLedger(amount);
      }

      setMessage(`充值 ${amount} A0GI 成功`);
      setDepositAmount("");
      await fetchBalance();
    } catch (err) {
      setMessage("充值失败");
    }
    setLoading(false);
  };

  // 自动获取余额
  useEffect(() => {
    fetchBalance();
  }, [broker]);