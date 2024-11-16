import { ZeroAddress } from "ethers";
import { tokenAbi } from "./erc20/abi";
import { factoryAbi } from "./factory/abi";

export const TOKEN_CONTRACT = {
  address: (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS ??
    ZeroAddress) as `0x${string}`,
  abi: tokenAbi,
} as const;

export const FACTORY_CONTRACT = {
  address: (process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS ??
    ZeroAddress) as `0x${string}`,
  abi: factoryAbi,
} as const;
