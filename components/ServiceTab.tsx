
import { useState, useEffect } from 'react';
import { ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from 'ethers';
import moment, { duration } from 'moment';

interface ServiceTabProps {
  broker: ZGComputeNetworkBroker;
  selectedProvider: any;
  setSelectedProvider: (provider: any) => void;
  message: string;
  setMessage: (message: string) => void;
}

export default function ServiceTab({ 
  broker, 
  selectedProvider, 
  setSelectedProvider, 
  message, 
  setMessage 
}: ServiceTabProps) {

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [subAccount, setSubAccount] = useState({balance: BigInt(0), amount: BigInt(0), remainTime: BigInt(0)});

  const convertSecToHHmmss = (sec: number) => {
    let currentTime = duration(sec, "seconds");
    // 将获取到的下轮间隔秒数转换成时分秒
    return moment({
      h: currentTime.hours(),
      m: currentTime.minutes(),
      s: currentTime.seconds(),
    }).format("HH:mm:ss");
  }

  const fetchSubAcount = async () => {
    if (!broker) return;
    try {
      const account = await broker.inference.getAccountWithDetail(selectedProvider.address);
      setSubAccount({...subAccount,
          balance: account[0].balance
        })
      if (account[1]){
        setSubAccount({
          balance: account[0].balance,
          amount: account[1][0].amount,
          remainTime: account[1][0].remainTime,
        })
      }
    } catch (e) {
      return;
    }
  }
  const transferFund = async () => {
    if (!broker || !transferAmount) return;

    setLoading(true);
    try {
      const amount = parseFloat(transferAmount);
      await broker.ledger.transferFund(selectedProvider.address,"inference", BigInt(amount * 1e18));
      setMessage(`授权子账号 ${amount} A0GI 成功`);
      setTransferAmount("");
      await fetchSubAcount();
    } catch (err) {
      setMessage("授权失败");
    }
    setLoading(false);
  }

  const retrieveFund = async () => {
    if (!broker || (selectedProvider.balance === 0)) return;
    try {
      await broker.ledger.retrieveFund("inference");
      setMessage("退款成功");
    } catch (err) {
      console.log(err);
      setMessage("退款失败");
    }
  }

  // 获取服务列表
  const fetchProviders = async () => {
    if (!broker) return;

    setLoading(true);
    try {
      const services = await broker.inference.listService();
      // 循环services，设置provider信息
      let list:any[] = services.map((s: any) => ({
          address: s.provider || "",
          name: s.name || s.model || "Unknown",
          model: s.model || "Unknown",
          url: s.url || "",
          inputPrice: BigInt(s.inputPrice) || 0,
          outputPrice: BigInt(s.outputPrice) || 0,
          balance: 0,
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
              setSubAccount({balance: BigInt(0), amount: BigInt(0), remainTime: BigInt(0)});
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
              <p>服务url: {selectedProvider.url}</p>
              <p>输入价格: {ethers.formatEther(selectedProvider.inputPrice)} 0G / token </p>
              <p>输出价格: {ethers.formatEther(selectedProvider.outputPrice)} 0G / token </p>
              <button
                onClick={verifyService}
                disabled={loading}
                className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
              >
                {loading ? "验证中..." : "验证服务"}
              </button>
              <p>子账号余额: {ethers.formatEther(subAccount.balance)} 0G  （退款信息： 待退款金额：{ethers.formatEther(subAccount.amount)} 退款剩余时间：{convertSecToHHmmss(Number(subAccount.remainTime))}）</p>
              
              <button
                onClick={fetchSubAcount}
                disabled={loading}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                获取余额
              </button>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="充值金额"
                className="block flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={transferFund}
                disabled={loading}
                className="block px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                充值子账号
              </button>
              <button
                onClick={retrieveFund}
                disabled={loading}
                className="block px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                退款子账号
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );
}