// useGetAllEvents.ts
import { useState, useEffect } from "react";
import { Event } from "../types/types";
import { supabase } from "../lib/supabaseClient";
import { useAccount } from "wagmi";

export const useGetAllEvents = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { chainId } = useAccount();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .is("resolved", null)
        .eq("chainId", chainId);

      if (error) {
        throw error;
      }
      console.log(data);
      const transformedEvents: Event[] = data.map((d: any) => ({
        id: d.id,
        address: d.fpmm_address,
        question: d.fpmm_title,
        choices: [""],
      }));

      setAllEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchMyEvents = () => {
    fetchEvents();
  };

  useEffect(() => {
    if (chainId) fetchEvents();
  }, [chainId]);

  return {
    allEvents,
    refetchMyEvents,
    isLoading,
    error,
  };
};
