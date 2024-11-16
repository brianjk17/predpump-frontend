import { ZeroAddress } from "ethers";
import { tokenAbi } from "./erc20/abi";
import { factoryAbi } from "./factory/abi";

export const TOKEN_CONTRACT = {
  abi: tokenAbi,
} as const;

export const FACTORY_CONTRACT = {
  abi: factoryAbi,
} as const;
