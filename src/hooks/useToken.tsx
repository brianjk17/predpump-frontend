import { useAccount, useReadContract } from "wagmi";
import { TOKEN_CONTRACT } from "../contracts";
import { useGetTokenContract } from "./contracts/useGetTokenContract";
import { tokenAbi } from "../contracts/erc20/abi";
import { use, useEffect } from "react";

export default function useToken() {
  const { address: ownerAddress, chainId } = useAccount();

  const { data: walletBalanceData, refetch: refetchBalance } = useReadContract({
    chainId: chainId ?? 1,
    address: useGetTokenContract(chainId ?? 11155111).address,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [ownerAddress!],
  });

  useEffect(() => {
    if (chainId) refetchBalance();
  }),
    [chainId, ownerAddress];

  return {
    userBalance: walletBalanceData ?? 0 / 18,
    refetchBalance,
  };
}
