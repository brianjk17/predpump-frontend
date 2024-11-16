// index.tsx
import type { NextPage } from "next";
import React from "react";
import { Boxes } from "../components/ui/background-boxes";
import Image from "next/image";
import gif from "../public/pepe-gif.gif";
import EventCard from "../components/EventCard/EventCard";
import { useGetAllEvents } from "../hooks/useGetAllEvent";
import Link from "next/link";

const Home: NextPage = () => {
  const { allEvents, isLoading, error } = useGetAllEvents();

  function Content() {
    if (isLoading) {
      return (
        <div className="text-white flex justify-center items-center">
          Loading events...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-white justify-center items-center flex">
          Error: {error}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-7 mt-14 items-center justify-center">
        {allEvents.length === 0 ? (
          <div>No events found</div>
        ) : (
          allEvents.map((event) => (
            <Link href={`/event/${event.address}`} key={event.address}>
              <EventCard eventData={event} />
            </Link>
          ))
        )}
      </div>
    );
  }

  return (
    <>
      <div className="h-full relative w-full overflow-hidden bg-darkgreen items-center flex justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full bg-darkgreen [mask-image:radial-gradient(transparent,white)] pointer-events-none z-0" />

        <Boxes className="h-auto" />

        {/* Flex container for "hey" elements and PredPumpFun */}
        <div className="flex items-center justify-center md:space-x-4 sm:space-x-0 sm:space-y-4 mt-28 md:mt-48 z-10">
         <Image
          src={gif}
          alt="Animated GIF"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-52 lg:h-48"
          width={200}
          height={200}
        />


          <div className="animate-bounce">
          <div className="press-start-2p-regular text-transparent stroke-text-md sm:stroke-text sm:text-8xl md:text-6xl lg:text-8xl rainbow-tail">
            PREDPUMP
          </div>
          </div>
          <Image
            src={gif}
            alt="Animated GIF"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-52 lg:h-48"
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className=" justify-center items-center flex">
        <Content />
      </div>
    </>
  );
};

export default Home;