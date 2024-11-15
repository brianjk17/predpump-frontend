import { useAccount, useReadContract } from "wagmi";
import { Event } from "../types/types";

export const useGetAllEvents = () => { 
  const { address: ownerAddress, chain } = useAccount();

  const { data: allEvents, refetch: refetchMyEvents } = {
    data: [
      { id: "1", question: "will trump win?", choices: [""] },
      {
        id: "2",
        question: "Jake Paul vs Mike Tyson",
        choices: ["Jake wins?", "Mike Wins?"],
      },
      {
        id: "3",
        question: "hey vs Mike Tyson",
        choices: ["hey wins?", "Mike Wins?"],
      },
    ] as Event[],
    refetch: () => {},
  };

  return {
    allEvents,
    refetchMyEvents,
  };
}
