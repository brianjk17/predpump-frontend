import React from "react";
import { Boxes } from "../components/ui/background-boxes";
import { cn } from "../../../lib/utils";

const Landingpage = () => {
  return (
    <div className="h-full w-full overflow-hidden bg-darkgreen flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-darkgreen z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
 
      <Boxes />
      <div className='press-start-2p-regular text-white'>
        PumpPretFun
      </div>
    </div>
  )
}

export default Landingpage

