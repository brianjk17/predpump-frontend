import { useAccount, useReadContract } from "wagmi";
import { Event } from "../types/types";

export default function useMyEvents() {
  const { address: ownerAddress, chain } = useAccount();

  const { data: myEvents, refetch: refetchMyEvents } = {
    data: [
      { id: "1", question: "will trump win?", choices: [""] },
      {
        id: "2",
        question: "Jake Paul vs Mike Tyson",
        choices: ["Jake wins?", "Mike Wins?"],
      },
    ] as Event[],
    refetch: () => {},
  };

  return {
    myEvents,
    refetchMyEvents,
  };
}
