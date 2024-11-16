import React from "react";
import useMyEvents from "../../hooks/useMyEvents";
import EventCard from "../../components/EventCard/EventCard";

export default function index() {
  const { myEvents } = useMyEvents();

  return (
    <div className="flex w-full flex-col">
      <p className="press-start-2p-regular text-white md:text-2xl text-xl">Profile</p>

      <div>
        <p className="text-white text-[18px] md:text-[20px] press-start-2p-regular">Your markets</p>
        <div className="flex gap-4 flex-wrap items-center justify-center">
          {myEvents.map((event, index) => (
            <EventCard eventData={event} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
