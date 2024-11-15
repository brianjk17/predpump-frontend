import { PieChart } from "@mui/x-charts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";

interface Person {
  id: string;
  name: string;
  chance: string;
  buyYes: string;
  buyNo: string;
  sellYes: string;
  sellNo: string;
}

const peopleColors: Person[] = [
  {
    id: "1",
    name: "jake paul win",
    chance: "80",
    buyYes: "Buy Yes",
    buyNo: "Buy No",
    sellYes: "Sell Yes",
    sellNo: "Sell No",
  },
  {
    id: "2",
    name: "mike tyson win",
    chance: "80",
    buyYes: "Buy Yes",
    buyNo: "Buy No",
    sellYes: "Sell Yes",
    sellNo: "Sell No",
  },
  {
    id: "3",
    name: "draw",
    chance: "80",
    buyYes: "Buy Yes",
    buyNo: "Buy No",
    sellYes: "Sell Yes",
    sellNo: "Sell No",
  },
];

const event = () => {
  const [selectedPrediction, setSelectedPrediction] = useState<Person | null>(
    null
  );
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleButtonClick = (person: Person, action: string) => {
    setSelectedPrediction(person);
    setSelectedAction(action);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <>
      <ConnectButton />

      <div className=" min-h-screen bg-slate-700 flex items-center justify-center">
        <div className=" h-[45rem] w-[80rem] bg-red-600 flex justify-between pt-16 px-16">
          <div className=" bg-cyan-600 w-[49rem] h-[28rem]">
            <h1> Jake Paul vs. Mike Tyson: Who will win?</h1>
            <br />
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
              {peopleColors.map((person) => (
                <div key={person.id} className="flex gap-6 text-xl m-3">
                  <h1 className="w-40">{person.name}</h1>
                  <h1>{person.chance}</h1>
                  <button
                    onClick={() => handleButtonClick(person, person.buyYes)}
                    className={`px-4 py-2 rounded ${
                      selectedPrediction?.id === person.id &&
                      selectedAction === person.buyYes
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {person.buyYes}
                  </button>
                  <button
                    onClick={() => handleButtonClick(person, person.buyNo)}
                    className={`px-4 py-2 rounded ${
                      selectedPrediction?.id === person.id &&
                      selectedAction === person.buyNo
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {person.buyNo}
                  </button>
                  <button
                    onClick={() => handleButtonClick(person, person.sellYes)}
                    className={`px-4 py-2 rounded ${
                      selectedPrediction?.id === person.id &&
                      selectedAction === person.sellYes
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {person.sellYes}
                  </button>
                  <button
                    onClick={() => handleButtonClick(person, person.sellNo)}
                    className={`px-4 py-2 rounded ${
                      selectedPrediction?.id === person.id &&
                      selectedAction === person.sellNo
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {person.sellNo}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-500 w-[21rem] h-[28rem] p-4">
            <h1 className="text-xl mb-4">
              Name: {selectedPrediction?.name || "-"}
            </h1>
            <h1 className="text-xl mb-4">
              Chance: {selectedPrediction?.chance || "-"}%
            </h1>
            <h1 className="text-xl mb-4">Action: {selectedAction || "-"}</h1>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full p-2 rounded mb-4"
            />
            <button
              className={`w-full text-white py-2 rounded ${
                selectedPrediction
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Confirm {selectedAction}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default event;
