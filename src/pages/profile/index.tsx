import React, { useEffect, useState } from "react";

import EventCard from "../../components/EventCard/EventCard";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Event } from "../../types/types";

export default function index() {
  const { address, chainId } = useAccount();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  const router = useRouter();

  async function fetchMyEvents() {
    try {
      setIsLoading(true); // Start loading
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("deployer", address)
        .eq("chainId", chainId);

      if (error) throw error;

      if (data) {
        const transformedEvents: Event[] = data.map((d: any) => ({
          id: d.id,
          address: d.fpmm_address,
          question: d.fpmm_title,
          choices: [""],
        }));

        setMyEvents(transformedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  function handleClick(fpmm_address: string) {
    router.push(`/profile/${fpmm_address}`);
  }

  useEffect(() => {
    if (address) fetchMyEvents();
  }, [address]);

  return (
    <div className="flex w-full flex-col justify-center items-center flex-wrap">
      {isLoading ? ( // Show loading spinner or message
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {/* If you want to add other raw events */}
          </div>

          <div className="flex gap-2 flex-wrap justify-center items-center">
            {myEvents.map((event, index) => (
              <div key={index} onClick={() => handleClick(event.address)}>
                <EventCard eventData={event} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
