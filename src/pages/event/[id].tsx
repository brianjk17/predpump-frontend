import { Button } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useGetAllEvents } from "../../hooks/useGetAllEvent";
import { useRouter } from "next/router";
import { useGetEvent } from "../../hooks/useGetEvent";
import { Config, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WriteContractMutate } from "wagmi/query";
import FpmmABI from "../../contracts/fpmm/fpmmAbi.json"
import { handleBuy } from "../../hooks/useBuy";
import { Abi, formatUnits, parseUnits } from "viem";
import { TOKEN_CONTRACT } from "../../contracts";

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
  const router = useRouter();
  const {id}=router.query
  const { event } = useGetEvent(id as string);

  const [choice, setChoice] = useState(""); //
  const [isBuy, setIsBuy] = useState(true); //buy or sell
  const [position, setPosition] = useState(1); //1 for yes, 0 for no
  const [amount, setAmount] = useState<string>("0");
  const [isApproved, setIsApproved] = useState(false);
  const tokenContractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value !== "") {
      setAmount(value);
    } else {
      setAmount("0");
    }
  };

  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const {
    data: hashApprove,
    isPending: isPendingApprove,
    writeContract: writeContractApprove,
  } = useWriteContract();

   // Calculate buy amount based on current input
   const { data: calculatedBuyAmount, isError } = useReadContract({
    address: "0x8ff3801288a85ea261e4277d44e1131ea736f77b" as `0x${string}`,
    abi: FpmmABI,
    functionName: "calcBuyAmount",
    args: amount && amount !== "0" ? [
      parseUnits(amount, 18),
      BigInt(position)
    ] : undefined,
  });

  function handleApprove() {
    // Convert input amount to 18 decimal places
    const amounts = BigInt(parseFloat(amount) * 10 ** 18);
    writeContractApprove({
      address: TOKEN_CONTRACT.address,
      abi: TOKEN_CONTRACT.abi as Abi,
      functionName: "approve",
      args: ["0x8ff3801288a85ea261e4277d44e1131ea736f77b", amounts],
    });
  }

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

  const formatTokenAmount = (amount: unknown) => {
    if (!amount) return "0";
    try {
      return formatUnits(BigInt(amount.toString()), 18);
    } catch {
      return "0";
    }
  };
  
  
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
                        position={0}
                      />
                      <ChoiceButton
                        choice={choice}
                        isBuy={isBuy}
                        position={1}
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
          {amount && amount !== "0" && (
  <div className="bg-white rounded p-3 mb-4">
    <h3 className="font-semibold mb-2">Transaction Preview</h3>
    {isError ? (
      <p className="text-sm text-red-500">Error calculating amount. Please try again.</p>
    ) : (
      <div className="space-y-1">
        <p className="text-sm">Tokens to receive: {
          calculatedBuyAmount 
            ? formatTokenAmount(calculatedBuyAmount)
            : "Calculating..."
        }</p>
        <p className="text-xs text-gray-500">
          Price per token: {
            calculatedBuyAmount && amount
              ? `${(Number(amount) / Number(formatTokenAmount(calculatedBuyAmount))).toFixed(4)} USDC`
              : "Calculating..."
          }
        </p>
      </div>
    )}
  </div>
)}
            {/* <Button
              variant="contained"
              className={`text-black w-full py-2 rounded ${
                isBuy
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={async() => {
                // console.log(
                //   choice,
                //   isBuy ? "Buy" : "Sell",
                //   position === 1 ? "Yes" : "No",
                //   amount
                // );
                console.log(calBuy);
                handleBuy(writeContract, "0x8ff3801288a85ea261e4277d44e1131ea736f77b", position, amount);
              }}
            >
              Confirm {isBuy ? "Buy" : "Sell"} {position === 1 ? "Yes" : "No"}
            </Button> */}
            <button
                onClick={handleApprove}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isPendingApprove ? "Confirming..." : "Approve"}
              </button>
            <Button
            variant="contained"
            className={`w-full py-2 rounded ${
              isBuy
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={!amount || amount === "0" || isPending || isConfirming}
            onClick={() => handleBuy(writeContract, "0x8ff3801288a85ea261e4277d44e1131ea736f77b", position, amount)}
          >
            {isPending || isConfirming ? "Confirming..." : `Confirm ${isBuy ? "Buy" : "Sell"} ${position === 1 ? "Yes" : "No"}`}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default event;
