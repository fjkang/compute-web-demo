
import { useState, useEffect } from 'react';
import { ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from 'ethers';

interface AccountTabProps {
  broker: ZGComputeNetworkBroker;
  message: string;
  setMessage: (message: string) => void;
}

export default function AccountTab({ broker, message, setMessage }: AccountTabProps) {

  const [balance, setBalance] = useState<{
    total: bigint;
    locked: bigint;
    available: bigint;
  } | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);

  // 获取余额
  const fetchBalance = async () => {
    if (!broker) return;

    try {
      const { ledgerInfo } = await broker.ledger.ledger.getLedgerWithDetail();
      const total = ledgerInfo[0];
      const locked = ledgerInfo[1];
      setBalance({ total, locked, available: total - locked });
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
      } catch { }

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
  // 退款处理
  const handleRefund = async () => {
    if (!broker || !refundAmount) return;
    const amount = parseFloat(refundAmount);

    setLoadingRefund(true);
    try {
      // 检查是否有账本
      let hasLedger = false;
      try {
        let ledgerInfo = await broker.ledger.ledger.getLedgerWithDetail();
        console.log(ledgerInfo);
        hasLedger = true;
      } catch { }

      if (hasLedger) {
        await broker.ledger.refund(amount);
        setMessage(`退款 ${amount} A0GI 成功`);
        setRefundAmount("");
        await fetchBalance();
      } else {
        setMessage("没有账本，无法退款");
      }
    } catch (err) {
      console.log(err);
      setMessage("退款失败");
    }
    setLoadingRefund(false);
  };

  // 自动获取余额
  useEffect(() => {
    fetchBalance();
  }, [broker]);

  
  
  return (
    <div>
      <h2>账户余额</h2>
      {balance ? (
        <p>
          可用余额: {ethers.formatEther(balance.available)} A0GI (总计:{" "}
          {ethers.formatEther(balance.total)}  锁定:{" "} {ethers.formatEther(balance.locked)})
        </p>
      ) : (
        <p>暂无账本</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="充值金额"
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button
          onClick={handleDeposit}
          disabled={loading}
          style={{ padding: "5px 15px" }}
        >
          {loading ? "处理中..." : "充值"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={refundAmount}
          onChange={(e) => setRefundAmount(e.target.value)}
          placeholder="退款金额"
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button
          onClick={handleRefund}
          disabled={loadingRefund}
          style={{ padding: "5px 15px" }}
        >
          {loadingRefund ? "处理中..." : "退款"}
        </button>
      </div>


    </div>
  );
}