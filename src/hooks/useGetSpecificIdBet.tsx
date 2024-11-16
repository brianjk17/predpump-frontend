// useGetSpecificIdBet.ts for multiple events
import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabaseClient";
import { Event } from "../types/types";

export const useGetSpecificIdBet = (fpmmAddress: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventsByAddress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq('fpmm_address', fpmmAddress);
      
      if (error) {
        throw error;
      }

      const transformedEvents: Event[] = data.map(d => ({
        id: d.id,
        question: d.fpmm_title,
        choices: [""] // Adjust based on your data structure
        // Add any other fields you need
      }));

      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fpmmAddress) {
      fetchEventsByAddress();
    }
  }, [fpmmAddress]);

  const refetchEvents = () => {
    fetchEventsByAddress();
  };

  return {
    events,
    isLoading,
    error,
    refetchEvents
  };
};