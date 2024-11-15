import { useAccount, useReadContract } from "wagmi";
import { TOKEN_CONTRACT } from "../contracts";
import { Event } from "../types/types";

export default function useMyEvents() {
  const { address: ownerAddress, chain } = useAccount();

  const { data: myEvents, refetch: refetchMyEvents } = {
    data: [
      { question: "will trump win?", choices: [""] },
      {
        question: "Jake Paul vs Mike Tyson",
        choices: ["Jake wins?", "Mike Wins?"],
      },


    ] as Event[],
    refetch: () => {},
    //   useReadContract({
    //     chainId: chain?.id ?? 1,
    //     address: TOKEN_CONTRACT.address,
    //     abi: TOKEN_CONTRACT.abi,
    //     functionName: "balanceOf",
    //     args: [ownerAddress!],
    //   });
  };

  return {
    myEvents,
    refetchMyEvents,
  };
}
