import React, { useEffect, useState } from "react";

import EventCard from "../../components/EventCard/EventCard";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useMyEvents } from "../../hooks/useMyEvents";

export default function index() {
  const router = useRouter();
  const { events, isLoading, error } = useMyEvents();
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

  if (isLoading) {
    <div>Loading </div>;
  }

  return (
    <div className="flex w-full flex-col justify-center items-center flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {/* {rawEvents.map((event, index) => (
          <EventCard
            eventData={{
              id: event.id.toString(),
              address: event.questionId,
              question: event.fpmm_title,
              choices: [""],
            }}
            key={index}
          />
        ))} */}
      </div>

      <div className="flex gap-2 flex-wrap">
        {events.map((event, index) => (
          <div key={index} onClick={() => handleClick(event.id)}>
            <EventCard eventData={event} />
          </div>
        ))}
      </div>
      {/* <div className="mt-4">
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
      </div> */}
    </div>
  );
}
