export const CHAINS_CONFIG = {
  [421614]: {
    scan: "https://arbitrum-sepolia.blockscout.com/",
    contractAddress: {
      token_address: process.env.NEXT_PUBLIC_TOKEN_ARBRITRUM as `0x${string}`,
      factory_address: process.env
        .NEXT_PUBLIC_FACTORY_ARBRITRUM as `0x${string}`,
    },
  },
};
