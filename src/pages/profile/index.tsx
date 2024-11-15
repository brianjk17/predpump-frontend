import React from "react";
import useMyEvents from "../../hooks/useMyEvents";
import EventCard from "../../components/EventCard/EventCard";

export default function index() {
  const { myEvents } = useMyEvents();

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
    </div>
  );
}
