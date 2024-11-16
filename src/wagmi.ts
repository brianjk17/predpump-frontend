import {
  Chain,
  arbitrumSepolia,
  baseSepolia,
  chiliz,
  neonDevnet,
  mantleSepoliaTestnet,
  flowTestnet,
  scrollSepolia,
  morphHolesky,
  sepolia,
  spicy,
} from "wagmi/chains";
import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet, coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended Wallet",
      wallets: [coinbaseWallet],
    },
    {
      groupName: "Other Wallets",
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: "PredPump",
    appDescription: "The Infinite Market for Degens",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  }
);

export const config = getDefaultConfig({
  appName: "PredPump",
  appDescription: "The Infinite Market for Degens",
  //@ts-ignore
  connectors,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [
    baseSepolia,
    chiliz
    neonDevnet,
    mantleSepoliaTestnet,
    flowTestnet,
    scrollSepolia,
    morphHolesky,
    sepolia,
  ],
  ssr: true,
});
