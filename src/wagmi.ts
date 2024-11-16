import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  Chain,
  arbitrumSepolia,
  baseSepolia,
  flowTestnet,
  mantleSepoliaTestnet,
  morphSepolia,
  sepolia,
  spicy,
} from "wagmi/chains";

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

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    arbitrumSepolia,
    sepolia,
    baseSepolia,
    mantleSepoliaTestnet,
    flowTestnet,
    morphSepolia,
    spicy,
  ],
  ssr: true,
});
