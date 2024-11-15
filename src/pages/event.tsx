import { Button } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import useGetEvent from "../hooks/useGetEvent";

interface OutcomeData {
  id: string;
  name: string;
  chance: string;
  buyYes: string;
  buyNo: string;
  sellYes: string;
  sellNo: string;
}

const event = () => {
  const { event } = useGetEvent();

  const [choice, setChoice] = useState(""); //
  const [isBuy, setIsBuy] = useState(true); //buy or sell
  const [position, setPosition] = useState(1); //1 for yes, 0 for no
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const ChoiceButton = ({
    choice,
    isBuy,
    position,
  }: {
    choice: string;
    isBuy: boolean;
    position: number;
  }) => {
    return (
      <Button
        variant="contained"
        onClick={() => {
          setChoice(choice);
          setPosition(position);
        }}
        className={`text-black px-4 py-2 rounded ${
          isBuy
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        {`${isBuy ? "Buy" : "Sell"} ${position === 1 ? "Yes" : "No"}`}
      </Button>
    );
  };

  useEffect(() => {
    event.choices.length > 1 && setChoice(event.choices[0]);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className=" flex justify-between gap-5">
        <div className=" bg-cyan-600">
          <div className="text-2xl pb-5">{event.question} </div>

          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={400}
            height={200}
          />

          <br />

          <div>
            {event.choices.length > 1 &&
              event.choices.map((choice, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-6 text-xl m-3 justify-between"
                  >
                    {event.choices.length > 1 && <div>{choice}</div>}
                    <div
                      className={`gap-5 flex ${
                        event.choices.length > 1 &&
                        "flex justify-center items-center"
                      }`}
                    >
                      <ChoiceButton
                        choice={choice}
                        isBuy={isBuy}
                        position={1}
                      />
                      <ChoiceButton
                        choice={choice}
                        isBuy={isBuy}
                        position={2}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-green-500 rounded-md p-4 h-full min-w-[23rem]">
          {event.choices.length > 1 && (
            <h1 className="text-xl mb-4">{choice}</h1>
          )}

          <div>
            <Button
              variant="contained"
              onClick={() => setIsBuy(true)}
              className={`text-black px-4 py-2 rounded bg-blue-500 hover:bg-blue-600`}
            >
              Buy
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsBuy(false)}
              className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded"
            >
              Sell
            </Button>
          </div>

          <h1 className="text-xl mt-4">Outcome: </h1>
          <div className="w-full justify-center items-center flex gap-2">
            <Button
              variant="contained"
              onClick={() => setPosition(1)}
              className={`text-black px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 w-1/2`}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              onClick={() => setPosition(0)}
              className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded w-1/2"
            >
              No
            </Button>
          </div>

          <h1 className="text-xl mt-4">Amount: </h1>

          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full p-2 rounded mb-4"
          />
          <div>
            <Button
              variant="contained"
              className={`text-black w-full py-2 rounded ${
                isBuy
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={() => {
                console.log(
                  choice,
                  isBuy ? "Buy" : "Sell",
                  position === 1 ? "Yes" : "No",
                  amount
                );
              }}
            >
              Confirm {isBuy ? "Buy" : "Sell"} {position === 1 ? "Yes" : "No"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default event;
