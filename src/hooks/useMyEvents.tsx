import { useState, useEffect } from "react";
import { Event } from "../types/types";
import { supabase } from "../lib/supabaseClient";
import { useAccount } from "wagmi";

export const useMyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount(); // Get the address of the connected wallet

  const fetchEvents = async () => {
    try {
      console.log(address);

      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("fpmm_address", address);

      if (error) {
        throw error;
      }

      // If data exists, transform it into the proper event format
      const transformedEvents: Event[] = data.map((d: any) => ({
        id: d.id,
        address: d.fpmm_address,
        question: d.fpmm_title,
        choices: [""],
      }));

      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger event fetching when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []); // Empty dependency array means this runs once after the first render

  return {
    events,
    isLoading,
    error,
  };
};
