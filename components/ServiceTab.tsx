
import { useState, useEffect } from 'react';
import { ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from 'ethers';

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
  const fetchBalance = async () => {
    if (!broker) return;
    try {
      const account = await broker.inference.getAccount(selectedProvider.address);
      setSelectedProvider({ ...selectedProvider, balance: account.balance });
    } catch (e) {
      return;
    }
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
              <div>
                <p>余额: {ethers.formatEther(selectedProvider.balance)} 0G</p> 
                <button
                onClick={fetchBalance}
                disabled={loading}
                style={{ padding: "5px 15px", marginTop: "10px" }}
              >
                获取余额
              </button>
              <button
                onClick={retrieveFund}
                disabled={loading}
                style={{ padding: "5px 15px", marginTop: "10px" }}
              >
                退款余额
              </button>
              </div>
              <button
                onClick={verifyService}
                disabled={loading}
                style={{ padding: "5px 15px", marginTop: "10px" }}
              >
                {loading ? "验证中..." : "验证服务"}
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