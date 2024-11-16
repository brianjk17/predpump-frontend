export const CHAINS_CONFIG = {
  // arbitrum
  [421614]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_ARBRITRUM as `0x${string}`,
      factory_address: process.env
        .NEXT_PUBLIC_FACTORY_ARBRITRUM as `0x${string}`,
    },
  },
  // base
  [84532]: {
    scan: "https://base-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_BASE as `0x${string}`,
      factory_address: process.env.NEXT_PUBLIC_FACTORY_BASE as `0x${string}`,
    },
  },
  // mantle
  [5003]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_MANTLE as `0x${string}`,
      factory_address: process.env.NEXT_PUBLIC_FACTORY_MANTLE as `0x${string}`,
    },
  },
  // flow
  [545]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_FLOW as `0x${string}`,
      factory_address: process.env.NEXT_PUBLIC_FACTORY_FLOW as `0x${string}`,
    },
  },
  // morph
  [2710]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_MORPH as `0x${string}`,
      factory_address: process.env.NEXT_PUBLIC_FACTORY_MORPH as `0x${string}`,
    },
  },
  // chiliz
  [88_882]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_CHILIZ as `0x${string}`,
      factory_address: process.env.NEXT_PUBLIC_FACTORY_CHILIZ as `0x${string}`,
    },
  },
};
