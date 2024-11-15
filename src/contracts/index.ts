import { ZeroAddress } from "ethers";
import { tokenAbi } from "./erc20/abi";

export const TOKEN_CONTRACT = {
  address: (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS ??
    ZeroAddress) as `0x${string}`,
  abi: tokenAbi,
} as const;
