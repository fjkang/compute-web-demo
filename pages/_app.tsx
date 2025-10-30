import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// 定义 0G 测试网
const zgTestnet = defineChain({
  id: 16602,
  name: '0G Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Testnet Explorer',
      url: 'https://chainscan-newton.0g.ai',
    },
  },
  testnet: true,
});

// 配置 wagmi
const config = getDefaultConfig({
  appName: '0G Broker Starter Kit',
  projectId: 'YOUR_PROJECT_ID', // 需要从 WalletConnect 获取
  chains: [zgTestnet], // 使用 0G 测试网
  ssr: true,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;