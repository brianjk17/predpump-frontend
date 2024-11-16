import {
  Chain,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

// Define Anvil chain
const anvil: Chain = {
  id: 31337,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended Wallet",
      wallets: [coinbaseWallet],
    },
    {
      groupName: "Other Wallets",
      wallets: [rainbowWallet, metaMaskWallet],
    },
  ],
  {
    appName: "PredPump",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  }
);

export const config = getDefaultConfig({
  appName: "PredPump",
  // @ts-ignore
  connectors,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
