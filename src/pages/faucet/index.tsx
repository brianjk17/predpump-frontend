import React from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { TOKEN_CONTRACT } from "../../contracts";
import { Abi } from "viem";
import { CHAINS_CONFIG } from "../../constants/chains";

const index = () => {
  const { address, chainId } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  function handleMint() {
    writeContract({
      address:
        CHAINS_CONFIG[chainId as keyof typeof CHAINS_CONFIG].contractAddress
          .token_address,
      abi: TOKEN_CONTRACT.abi as Abi,
      functionName: "mint",
      args: [address, 1000000000000000000000],
    });
  }

  return (
    <div>
      <button onClick={handleMint} className=" bg-zinc-50">
        {isPending ? "Confirming..." : "mint"}
      </button>
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
    </div>
  );
};

export default index;
