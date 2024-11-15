import { useAccount, useReadContract } from "wagmi";
import { FACTORY_CONTRACT } from "../contracts";

export default function useFactory() {
  const { address: ownerAddress, chain } = useAccount();

  const { data: walletBalanceData, refetch: refetchBalance } = useReadContract({
    chainId: chain?.id ?? 1,
    address: FACTORY_CONTRACT.address,
    abi: FACTORY_CONTRACT.abi,
    functionName: "",
    args: [ownerAddress!],
  });

  return {};
}
