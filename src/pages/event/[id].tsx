// pages/event/[id].tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Event } from "../../types/types";
import useMyEvents from "../../hooks/useMyEvents";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PieChart } from "@mui/x-charts";

const EventDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { myEvents } = useMyEvents();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      const eventIndex = parseInt(id as string, 10);
      setEvent(myEvents[eventIndex]);
    }
  }, [id, myEvents]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>

      <div className="min-h-screen bg-slate-700 flex items-center justify-center">
        <div className="h-[45rem] w-[80rem] bg-red-600 flex justify-between pt-16 px-16">
          <div className="bg-cyan-600 w-[49rem] h-[28rem]">
            <h1>{event.question}</h1>
            <br />
            <PieChart
              series={[
                {
                  data: event.choices.map((choice, index) => ({
                    id: index,
                    value: Math.random() * 100,
                    label: choice,
                  })),
                },
              ]}
              width={400}
              height={200}
            />
            <br />
          </div>

          {/* Right-side details */}
          <div className="bg-green-500 w-[21rem] h-[28rem] p-4">
            <h1 className="text-xl mb-4">Question: {event.question}</h1>
            <h1 className="text-xl mb-4">Choices:</h1>
            <ul>
              {event.choices.map((choice, index) => (
                <li key={index}>{choice}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
