import { useAccount, useReadContract } from "wagmi";
import { TOKEN_CONTRACT } from "../contracts";

export default function useToken() {
  const { address: ownerAddress, chain } = useAccount();

  const { data: walletBalanceData, refetch: refetchBalance } = useReadContract({
    chainId: chain?.id ?? 1,
    address: TOKEN_CONTRACT.address,
    abi: TOKEN_CONTRACT.abi,
    functionName: "balanceOf",
    args: [ownerAddress!],
  });

  return {
    userBalance: walletBalanceData ?? 0 / 18,
    refetchBalance,
  };
}
