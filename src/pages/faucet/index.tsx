import React from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWalletClient,
  http,
} from "wagmi";
import { TOKEN_CONTRACT } from "../../contracts";
import { encodeFunctionData } from "viem";
import {
  PaymasterMode,
  createSmartAccountClient,
  createSession,
  Rule,
  Policy,
  createSessionKeyEOA,
} from "@biconomy/account";
import { baseSepolia } from "@wagmi/core/chains";
import { useGetTokenContract } from "../../hooks/contracts/useGetTokenContract";

const index = () => {
  const { address: walletAddress, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { address: tokenAddress } = useGetTokenContract(Number(chainId));
  const withSponsorship = {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  };

  const bundlerUrl =
    "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
  const paymasterUrl =
    "https://paymaster.biconomy.io/api/v2/84532/nwkoCC1BZ.2a5a6188-c4e1-4a8c-be8d-ab681c1b3e44";

  const [smartAccount, setSmartAccount] = React.useState<any>(null);

  React.useEffect(() => {
    const initSmartAccount = async () => {
      const account = await createSmartAccountClient({
        signer: walletClient!,
        biconomyPaymasterApiKey:
          "P-caz6djQ.db236ecd-3c59-405e-b8f6-a0f0532d9115",
        bundlerUrl: bundlerUrl,
      });
      setSmartAccount(account);
    };

    if (walletClient) {
      initSmartAccount();
    }
  }, [walletClient]);

  async function handleMint() {
    const address = await smartAccount?.getAccountAddress();
    if (!address) return;

    //create transaction data encode function data
    const transactionData = encodeFunctionData({
      abi: TOKEN_CONTRACT.abi,
      functionName: "mint",
      args: [walletAddress!, 1000000000000000000000n],
    });

    console.log("transactionData", transactionData);

    const tx = {
      to: tokenAddress,
      data: transactionData,
    };

    const userOpResponse = await smartAccount?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    });
    const { transactionHash } = await userOpResponse.waitForTxHash();
    console.log("Transaction Hash", transactionHash);
    const userOpReceipt = await userOpResponse.wait();
    if (userOpReceipt.success == "true") {
      console.log("UserOp receipt", userOpReceipt);
      console.log("Transaction receipt", userOpReceipt.receipt);
    }
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
