import { useAccount, useReadContract } from "wagmi";
import { Event } from "../types/types";

export default function useGetEvent() {
  const { address: ownerAddress, chain } = useAccount();

  const { data: event, refetch: refetchEvents } = {
    // data: {
    //   question: "will trump win?",
    //   choices: ["will trump win?Choice"],
    // } as Event,
    data: {
      question: "Jake Paul vs Mike Tyson",
      choices: ["Jake wins?", "Mike Wins?"],
    } as Event,

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
    event,
    refetchEvents,
  };
}
