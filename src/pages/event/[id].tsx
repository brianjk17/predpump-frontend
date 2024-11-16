import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGetEvent } from "../../hooks/useGetEvent";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import FpmmABI from "../../contracts/fpmm/fpmmAbi.json";
import { handleBuy } from "../../hooks/useBuy";
import { Abi, formatUnits, parseUnits } from "viem";
import { TOKEN_CONTRACT } from "../../contracts";
import ConditionalTokensABI from "../../contracts/ctf/ConditionalTokens.json";
import { ethers } from "ethers";
import { supabase } from "../../lib/supabaseClient";
import MarketDataDisplay from "../../components/Chart";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { useWalletClient } from "wagmi";
interface GroupChat {
  groupId: string;
  messages: Array<any>;
  newMessage: string;
}

interface MarketState {
  title: string;
  deployer: string;
  questionId: string;
  fpmmAddress: string;
}

const event = () => {
  const { address: userAddress } = useAccount();
  const router = useRouter();
  const { data: walletClient } = useWalletClient();

  // Combine related states
  const [chatState, setChatState] = useState<GroupChat>({
    groupId: "",
    messages: [],
    newMessage: "",
  });

  const [marketState, setMarketState] = useState<MarketState>({
    title: "",
    deployer: "",
    questionId: "",
    fpmmAddress: "",
  });

  // Keep other independent states
  const [pushUser, setPushUser] = useState<PushAPI | null>(null);
  const [position, setPosition] = useState(1);
  const [amount, setAmount] = useState<string>("0");
  const [canRedeem, setCanRedeem] = useState(false);
  const [showRedeemSection, setShowRedeemSection] = useState(false);

  const id = router.query.id as string;
  const { event } = useGetEvent(id as string);

  const [choice, setChoice] = useState(""); //
  const [isBuy, setIsBuy] = useState(true); //buy or sell
  const [debugInfo, setDebugInfo] = useState({
    condition: { isReported: false, endTime: 0 },
  });
  const [deployer, setDeployer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [fpmmAddress, setFpmmAddress] = useState("");
  // Add this state to track if redemption is available
  const [groupId, setGroupId] = useState<string>("");
  const [messages, setMessages] = useState<Array<any>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState("");

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
    address: id as `0x${string}`,
    abi: FpmmABI,
    functionName: "calcBuyAmount",
    args:
      amount && amount !== "0"
        ? [parseUnits(amount, 18), BigInt(position)]
        : undefined,
  });

  const {
    data: redeemHash,
    isPending: isRedeemPending,
    writeContract: writeRedeemContract,
  } = useWriteContract();

  useEffect(() => {
    const initPushUser = async () => {
      if (!walletClient) return;

      try {
        const user = await PushAPI.initialize(walletClient, {
          env: CONSTANTS.ENV.STAGING,
        });
        setPushUser(user);
      } catch (error) {
        console.error("Error initializing Push:", error);
      }
    };

    initPushUser();
  }, [walletClient]);

  useEffect(() => {
    event.choices.length > 1 && setChoice(event.choices[0]);
  }, []);
  // Modify the checkRedeemStatus function to check conditions
  const checkRedeemStatus = async () => {
    if (!router.query.id) return;
    const { data: fpmmData, error } = await supabase
      .from("events")
      .select("*")
      .eq("fpmm_address", id)
      .single();

    if (error) {
      console.error("Error fetching fpmm data:", error);
      return;
    }

    const fpmmAddress = fpmmData?.fpmm_address;
    const deployer = fpmmData?.deployer;
    const questionId = fpmmData?.questionId;

    setFpmmAddress(fpmmAddress);
    setDeployer(deployer);
    setQuestionId(questionId);

    try {
      const provider = new ethers.providers.JsonRpcProvider(window.ethereum);

      const fpmm = new ethers.Contract(id || fpmmAddress, FpmmABI, provider);

      const conditionalToken = await fpmm.conditionalTokens();

      const conditionalTokens = new ethers.Contract(
        conditionalToken,
        ConditionalTokensABI.abi,
        provider
      );

      const conditionId = await conditionalTokens.getConditionId(
        deployer,
        questionId,
        2
      );

      const condition = await conditionalTokens.conditionInfo(conditionId);
      const currentTime = Math.floor(Date.now() / 1000);

      const canRedeemNow = condition[2] && Number(condition[1]) < currentTime;
      setCanRedeem(canRedeemNow);

      setDebugInfo({
        condition: {
          isReported: condition[2],
          endTime: condition[1],
        },
      });
    } catch (error) {
      console.error("Error checking redeem status:", error);
    }
  };

  // Add useEffect to check status periodically
  useEffect(() => {
    checkRedeemStatus();
    const interval = setInterval(checkRedeemStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!router.query.id || !pushUser) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, push_group_id")
          .eq("fpmm_address", router.query.id)
          .single();

        if (data) {
          setMarketState({
            title: data.fpmm_title,
            deployer: data.deployer,
            questionId: data.questionId,
            fpmmAddress: data.fpmm_address,
          });

          if (data.push_group_id) {
            const history = await pushUser.chat.history(data.push_group_id);

            const formattedHistory = history
              .map((msg) => ({
                fromDID: msg.fromDID,
                content:
                  msg.messageContent || msg.messageObj?.content || msg.content,
                timestamp: msg.timestamp,
                fromCAIP10: msg.fromCAIP10,
              }))
              .filter(
                (msg) =>
                  msg.content &&
                  msg.content !== "..." &&
                  msg.content.trim() !== ""
              );

            console.log(formattedHistory);

            setChatState((prev) => ({
              ...prev,
              groupId: data.push_group_id,
              messages: formattedHistory,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, [router.query.id, pushUser]);

  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If router is ready but no ID, show error
  if (!router.query.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="mt-2">No market ID found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value !== "") {
      setAmount(value);
    } else {
      setAmount("0");
    }
  };

  function handleApprove() {
    // Convert input amount to 18 decimal places
    const amounts = BigInt(parseFloat(amount) * 10 ** 18);
    writeContractApprove({
      address: TOKEN_CONTRACT.address,
      abi: TOKEN_CONTRACT.abi as Abi,
      functionName: "approve",
      args: [id as `0x${string}`, amounts],
    });
  }

  const formatTokenAmount = (amount: unknown) => {
    if (!amount) return "0";
    try {
      return formatUnits(BigInt(amount.toString()), 18);
    } catch {
      return "0";
    }
  };

  const handleRedeem = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(window.ethereum);
      const fpmm = new ethers.Contract(fpmmAddress, FpmmABI, provider);

      const conditionalToken = await fpmm.conditionalTokens();
      const indexSets = [BigInt(1), BigInt(2)];

      const conditionalTokens = new ethers.Contract(
        conditionalToken,
        ConditionalTokensABI.abi,
        provider
      );

      const conditionalId = await conditionalTokens.getConditionId(
        deployer,
        questionId,
        2
      );

      await writeRedeemContract({
        address: conditionalToken as `0x${string}`,
        abi: ConditionalTokensABI.abi,
        functionName: "redeemPositions",
        args: [
          process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          conditionalId,
          indexSets,
        ],
      });
    } catch (error) {
      console.error("Error redeeming positions:", error);
    }
  };

  const sendMessage = async () => {
    if (!pushUser || !chatState.groupId || !chatState.newMessage) return;

    // Store the message content before clearing
    const messageContent = chatState.newMessage;

    // Clear input immediately
    setChatState((prev) => ({
      ...prev,
      newMessage: "",
    }));

    try {
      await pushUser.chat.send(chatState.groupId, {
        content: messageContent,
        type: "Text",
      });

      const newMsg = {
        fromDID: address,
        content: messageContent,
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMsg],
        newMessage: "",
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatState((prev) => ({
      ...prev,
      newMessage: e.target.value,
    }));
  };

  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center mt-10 ">
      <div className=" flex flex-col justify-between gap-5">
        <div className="flex justify-center items-center flex-wrap bg-green-800/50 p-6 rounded-3xl border-4 border-dashed border-lime-400 text-white text-xl my-8">
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-center mb-10 animate-bounce
                 [text-shadow:_4px_4px_0_lime,_8px_8px_0_green] text-white"
          >
            {title}
          </h1>

          <MarketDataDisplay marketAddress={id as `0x${string}`} />
        </div>

        <div className="min-w-[23rem]flex-col flex justify-center items-center flex-wrap bg-green-800/50 p-6 rounded-3xl border-4 border-dashed border-lime-400 text-white text-xl my-8">
          <h1 className="text-xl mt-4 press-start-2p-regular">Outcome: </h1>
          <div className="w-full justify-center items-center flex gap-2">
            <button
              onClick={() => setPosition(1)}
              className={`text-black px-4 py-2 rounded bg-teal-300 hover:bg-teal-700 hover:text-white w-1/2`}
            >
              Yes
            </button>
            <button
              onClick={() => setPosition(0)}
              className="bg-teal-300 hover:bg-teal-700 hover:text-white text-black px-4 py-2 rounded w-1/2"
            >
              No
            </button>
          </div>

          <h1 className="text-xl mt-4 press-start-2p-regular">Amount: </h1>

          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full p-2 rounded mb-4 text-black"
          />

          <div className="item-center justify-center">
            {amount && amount !== "0" && (
              <div className=" bg-green-800/50 p-6 rounded-3xl border-4 border-dashed border-lime-400 text-white text-xl mb-4 ">
                <h3 className="font-semibold mb-2">Transaction Preview</h3>
                {isError ? (
                  <p className="text-sm text-red-500">
                    Error calculating amount. Please try again.
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm">
                      Tokens to receive:{" "}
                      {calculatedBuyAmount
                        ? formatTokenAmount(calculatedBuyAmount)
                        : "Calculating..."}
                    </p>
                    <p className="text-xs text-white">
                      Price per token:{" "}
                      {calculatedBuyAmount && amount
                        ? `${(
                            Number(amount) /
                            Number(formatTokenAmount(calculatedBuyAmount))
                          ).toFixed(4)} USDC`
                        : "Calculating..."}
                    </p>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleApprove}
              className="bg-teal-300 text-black px-4 py-2 rounded "
            >
              {isPendingApprove ? "Confirming..." : "Approve"}
            </button>
            <br />
            <br />
            <button
              className={`w-full p-3 rounded ${
                isBuy
                  ? "bg-teal-300 hover:bg-teal-600 text-black"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={!amount || amount === "0" || isPending || isConfirming}
              onClick={async () => {
                try {
                  // Get user's wallet address (assuming you're using wagmi)

                  if (!address) {
                    // Handle case where user is not connected
                    return;
                  }

                  // First execute the contract transaction
                  await handleBuy(
                    writeContract,
                    id as `0x${string}`,
                    position,
                    amount
                  );

                  // Then write to Supabase buys table
                  const { error } = await supabase.from("buys").insert({
                    user_address: address,
                    fpmm_address: id,
                    position: position,
                    amount: amount,
                  });

                  if (error) {
                    console.error("Error writing to Supabase:", error);
                    // Handle error appropriately in your UI
                  }
                } catch (error) {
                  console.error("Transaction error:", error);
                  // Handle error appropriately in your UI
                }
              }}
            >
              {isPending || isConfirming
                ? "Confirming..."
                : `Confirm ${isBuy ? "Buy" : "Sell"} ${
                    position === 1 ? "Yes" : "No"
                  }`}
            </button>
          </div>
        </div>
      </div>

      {canRedeem && (
        <div className="flex mt-8 bg-green-800/50 p-6 rounded-3xl border-4 border-dashed border-lime-400 text-white text-xl my-8">
          <div className="bg-green-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold">Redeem Positions</h2>
              <button
                onClick={() => setShowRedeemSection(!showRedeemSection)}
                className="text-blue-500 hover:text-blue-600"
              >
                {showRedeemSection ? "Hide" : "Show"} Redeem Section
              </button>
            </div>

            {showRedeemSection && (
              <div className="space-y-4">
                <div className="bg-green-800 p-4 rounded-lg text-sm space-y-2">
                  <p>Status: Market Resolved</p>
                  <p>
                    Is Reported: {debugInfo.condition.isReported ? "Yes" : "No"}
                  </p>
                  <p>
                    End Time:{" "}
                    {new Date(
                      Number(debugInfo.condition.endTime) * 1000
                    ).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={handleRedeem}
                  disabled={isRedeemPending}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    isRedeemPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isRedeemPending
                    ? "Processing Redemption..."
                    : "Redeem Positions"}
                </button>

                {redeemHash && (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg mt-4">
                    <p className="text-sm">
                      Redemption successful! Transaction hash:{" "}
                      {redeemHash.slice(0, 10)}...
                      <a
                        href={`https://etherscan.io/tx/${redeemHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline ml-2"
                      >
                        View on Etherscan
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show message if redemption is not available */}
      {!canRedeem && debugInfo.condition && (
        <div className="w-full max-w-2xl mt-8">
          <div className="bg-green-800 rounded-lg shadow p-6">
            <div className="text-center text-white">
              <h2 className="text-xl font-semibold mb-2">
                Redemption Not Available Yet
              </h2>
              <p>
                {!debugInfo.condition.isReported
                  ? "Market has not been reported yet."
                  : "Market end time has not been reached."}
              </p>
              <p className="text-sm mt-2">
                End Time:{" "}
                {new Date(
                  Number(debugInfo.condition.endTime) * 1000
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      {chatState.groupId && (
        <div className="w-full max-w-2xl mt-8">
          <div className="bg-teal-300 rounded-lg p-2">
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-xl press-start-2p-regular mb-4">
                Market Discussion
              </h2>

              <div className="h-96 overflow-y-auto border rounded p-4 bg-gray-50 mb-4">
                {chatState.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded mb-2 ${
                      msg.fromDID === address
                        ? "bg-teal-100 ml-auto"
                        : "bg-gray-100"
                    } max-w-[80%]`}
                  >
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {msg.fromDID?.slice(0, 6)}...{msg.fromDID?.slice(-4)}
                      </span>
                      {msg.timestamp && (
                        <span>
                          {new Date(Number(msg.timestamp)).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="break-words whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatState.newMessage}
                  onChange={handleMessageChange}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  onClick={sendMessage}
                  className="px-6 py-2 bg-teal-300 hover:bg-teal-700 hover:text-white text-black rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default event;
