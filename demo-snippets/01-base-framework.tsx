// ============ STEP 1: 基础框架 ============
// 创建 pages/index.tsx

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { useState, useEffect } from "react";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { BrowserProvider } from "ethers";

export default function Home() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // 基础状态
  const [broker, setBroker] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("account");

  // 初始化 Broker
  useEffect(() => {
    if (!isConnected || !walletClient || broker) return;

    const initBroker = async () => {
      try {
        const provider = new BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const instance = await createZGComputeNetworkBroker(signer);
        setBroker(instance);
        console.log("Broker 初始化成功");
      } catch (err) {
        console.error("Broker 初始化失败:", err);
      }
    };

    initBroker();
  }, [isConnected, walletClient, broker]);

  if (!isConnected) {
    return (
      <div>
        <h1>0G Broker 演示</h1>
        <p>请先连接钱包</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div>
      <h1>0G Broker 演示</h1>
      <ConnectButton />
      
      {/* 标签导航 */}
      <div>
        <button onClick={() => setActiveTab("account")}>账户</button>
        <button onClick={() => setActiveTab("service")}>服务</button>
        <button onClick={() => setActiveTab("chat")}>聊天</button>
      </div>

      {/* 内容区域 */}
      {!broker ? (
        <div>正在初始化...</div>
      ) : (
        <div>
          <p>Broker 已初始化，当前标签: {activeTab}</p>
        </div>
      )}
    </div>
  );
}