// useGetAllEvents.ts
import { useState, useEffect } from 'react';
import { Event } from "../types/types";
import { supabase } from "../lib/supabaseClient";

export const useGetAllEvents = () => { 
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.from("events").select("*");
      
      if (error) {
        throw error;
      }

      const transformedEvents: Event[] = data.map(d => ({
        id: d.id,
        address: d.fpmm_address,
        question: d.fpmm_title,
        choices: [""] // Adjust this based on your data structure
      }));

      setAllEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchMyEvents = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    allEvents,
    refetchMyEvents,
    isLoading,
    error
  };
}