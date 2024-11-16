import React from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { TOKEN_CONTRACT } from "../../contracts";
import { Abi } from "viem";

const index = () => {
  const { address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  function handleMint() {
    writeContract({
      address: TOKEN_CONTRACT.address,
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
