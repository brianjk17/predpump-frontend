// index.tsx
import type { NextPage } from "next";
import React from "react";
import { Boxes } from "./components/ui/background-boxes";
import { cn } from "../../lib/utils";
import Image from "next/image";
import gif from "../public/pepe-gif.gif";
import EventCard from "../components/EventCard/EventCard";
import { useGetAllEvents } from "../hooks/useGetAllEvent";
import Link from "next/link";

const Home: NextPage = () => {
  const { allEvents } = useGetAllEvents();

  return (
    <>
      <div className="h-full relative w-full overflow-hidden bg-darkgreen items-center flex justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full bg-darkgreen [mask-image:radial-gradient(transparent,white)] pointer-events-none z-0" />
        
        <Boxes className="h-auto" />

        {/* Flex container for "hey" elements and PredPumpFun */}
        <div className="flex items-center justify-center space-x-4 mt-48 z-10">
          <Image src={gif} alt="Animated GIF" width={200} height={200} />
          <div className="press-start-2p-regular text-white md:text-5xl text-2xl">
            PredPump
          </div>
          <Image src={gif} alt="Animated GIF" width={200} height={200} />
        </div>
      </div>

      <div className="flex flex-wrap gap-7 mt-14 items-center justify-center">
        {allEvents.map((event) => (
          <Link href={`/event/${event.id}`} key={event.id}>
              <EventCard eventData={event} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
