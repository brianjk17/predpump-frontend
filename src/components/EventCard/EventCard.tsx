import React from "react";
import { Event } from "../../types/types";

export default function EventCard({ eventData }: { eventData: Event }) {
  function ChoiceButton({ isYes }: { isYes: boolean }) {
    return isYes ? (
      <div className="bg-green-500 w-20 rounded-md flex justify-center items-center">
        Yes
      </div>
    ) : (
      <div className="bg-red-500 w-20 rounded-md flex justify-center items-center">
        No
      </div>
    );
  }
  function Outcomes() {
    return eventData.choices.length > 1 ? (
      <div className="">
        {eventData.choices.map((choice, index) => (
          <div key={index} className="my-2 flex w-full justify-between">
            <div>{choice}</div>
            <div className="flex flex-row gap-2">
              <ChoiceButton isYes={true} />
              <ChoiceButton isYes={false} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-row">
        <div className="w-[50%] flex justify-center items-center">
          <ChoiceButton isYes={true} />
        </div>

        <div className="w-[50%] flex justify-center items-center">
          <ChoiceButton isYes={false} />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white w-[400px] h-[200px] rounded-md flex flex-col p-5 justify-between">
      <div>{eventData.question}</div>
      <div className="gap-2">
        <Outcomes />
      </div>
    </div>
  );
}
