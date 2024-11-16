import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { FACTORY_CONTRACT, TOKEN_CONTRACT } from "../../contracts";
import { Abi, keccak256 } from "viem";
import { encodeAbiParameters } from "viem";
import { decodeEventLog } from "viem";
import { supabase } from "../../lib/supabaseClient";

export default function index() {
  const [question, setQuestion] = useState("");
  const encodedQuestion = encodeAbiParameters([{ type: "string" }], [question]);
  const questionId = keccak256(encodedQuestion);
  const [fpmmAddress, setFpmmAddress] = useState<string>("");
  const [isStoringData, setIsStoringData] = useState(false);

  const now = Math.floor(Date.now() / 1000); // Current epoch time in seconds
  const later = now + 15 * 60; // Add 15 minutes (15 * 60 seconds)

  const { address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  function handleDeployPrediction() {
    writeContract({
      address: FACTORY_CONTRACT.address,
      abi: FACTORY_CONTRACT.abi as Abi,
      functionName: "createFPMM",
      args: [
        TOKEN_CONTRACT.address as `0x${string}`, // collateralToken - address
        address as `0x${string}`, // oracle - address
        questionId as `0x${string}`, // questionId - bytes32
        BigInt(2), // outcomeSlotCount - uint256
        BigInt(1732142169), // endTime - uint256
        BigInt(2), // fee - uint256
      ],
    });
  }

  async function storeEventData(fpmmAddress: string, question: string) {
    try {
      setIsStoringData(true);
      const { data, error } = await supabase.from("events").insert([
        {
          fpmm_address: fpmmAddress,
          fpmm_title: question,
          deployer: address,
          questionId: questionId
        },
      ]);

      if (error) throw error;
      console.log("Stored event data successfully");
    } catch (error) {
      console.error("Error storing event data:", error);
    } finally {
      setIsStoringData(false);
    }
  }

  useEffect(() => {
    if (receipt?.logs[1]?.topics[2]) {
      const fpmmAddressWithPadding = receipt.logs[1].topics[2];
      const cleanAddress = `0x${fpmmAddressWithPadding.slice(26)}`;
      setFpmmAddress(cleanAddress);
      console.log("clean Address", cleanAddress);

      storeEventData(cleanAddress, question);
    }
  }, [receipt]);

  // function confirmMarket() {
  //   const marketChoices =
  //   choices.length < 2 ? [`${question}Choice`] : [...choices];
  //   console.log([question, ...marketChoices]);
  //   return [question, ...marketChoices];
  // }

  // const [choices, setChoices] = useState([""]);
  // function addChoice() {
  //   if (choices.length >= 2) {
  //     alert("Only 2 choices max at the moment");
  //     return;
  //   }
  //   setChoices([...choices, ""]);
  // }

  return (
    <div>
      <div className="text-white">create</div>
      <div className="flex flex-col justify-center items-center">
        <div className="text-teal-300 my-2 bg-slate-50">
          <TextField
            id="outlined-controlled"
            focused
            variant="filled"
            label="Title: "
            value={question}
            color="success"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
        </div>

        <button className="bg-green-500" onClick={handleDeployPrediction}>
          {isPending
            ? "Confirming..."
            : isStoringData
            ? "Storing data..."
            : "Create Prediction Market"}
        </button>
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}

        {/* {choices.length > 1 &&
          choices.map((choice, index) => {
            return (
              <div className="text-teal-300 my-2" key={index} >
                choice {index + 1} {""}
                <input
                  type="text"
                  value={choices[index]} // Set the current value
                  onChange={(e) => {
                    const updatedChoices = [...choices]; // Create a copy of the array
                    updatedChoices[index] = e.target.value; // Update the specific index
                    setChoices(updatedChoices); // Set the new state
                  }}
                />
              </div>
            );
          })}
        <button onClick={() => addChoice()} className="bg-blue-400 my-4">
          Use 2 Choice
        </button> */}
      </div>
    </div>
  );
}
