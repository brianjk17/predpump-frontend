import type { NextPage } from "next";
import React from "react";
import { Boxes } from "./components/ui/background-boxes";
import { cn } from "../../lib/utils";
import Image from "next/image";
import gif from "../public/pepe-gif.gif"
import EventCard from "../components/EventCard/EventCard";
import useMyEvents from "../hooks/useMyEvents";
import Link from "next/link";

const Home: NextPage = () => {
  const { myEvents } = useMyEvents();
  return (
    <>
    <div className="h-full relative w-full overflow-hidden bg-darkgreen items-center flex justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-darkgreen [mask-image:radial-gradient(transparent,white)] pointer-events-none z-0" />
      
      <Boxes className="h-auto" />

      {/* Flex container for "hey" elements and PumpPretFun */}
      <div className="flex items-center justify-center space-x-4 mt-48 z-10">
         <Image
          src={gif} // Corrected path without "public"
          alt="Animated GIF"
          width={200} // Set the desired width
          height={200} // Set the desired height
        />
        <div className="press-start-2p-regular text-white md:text-5xl text-2xl">
          PumpPredFun
        </div>
        <Image
          src={gif} // Corrected path without "public"
          alt="Animated GIF"
          width={200} // Set the desired width
          height={200} // Set the desired height
        />
      </div>
    </div>

    <div className="flex gap-7 mt-14">
          {myEvents.map((event, index) => (
            <Link href={`/event/${index}`}>
              <EventCard eventData={event} key={index} /> 
            </Link>
          ))}
    </div>
    </>
  );
};

export default Home;
