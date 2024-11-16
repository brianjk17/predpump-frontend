import React, { useEffect, useState } from "react";
import useMyEvents from "../../hooks/useMyEvents";
import EventCard from "../../components/EventCard/EventCard";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";

export default function index() {
  const router = useRouter();

  const { myEvents } = useMyEvents();
  interface RawEvent {
    id: number;
    fpmm_title: string;
    questionId: string;
  }

  const [rawEvents, setRawEvents] = useState<RawEvent[]>([]);

  async function fetchRawEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, fpmm_title, questionId")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setRawEvents(data);
    } catch (error) {
      console.error("Error fetching raw events:", error);
    }
  }

  useEffect(() => {
    fetchRawEvents();
  }, []);

  function handleClick(questionId: string) {
    router.push(`/profile/${questionId}`);
  }

  return (
    <div className="flex w-full">
      profile
      <div>
        your markets
        <div className="flex gap-2 flex-wrap">
          {myEvents.map((event, index) => (
            <EventCard eventData={event} key={index} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div>Raw Events</div>
        <div className="flex flex-col gap-2">
          {rawEvents.map((event) => (
            <div key={event.id}>
              <h1>{event.fpmm_title} </h1>
              <button onClick={() => handleClick(event.questionId)}>
                Click
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
