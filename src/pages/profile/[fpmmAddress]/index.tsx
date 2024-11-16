import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { TOKEN_CONTRACT } from "../../../contracts";
import { Abi } from "viem";
import fpmmAbi from "../../../contracts/fpmm/fpmmAbi.json";
import { handleCheckCanResolve } from "../../../hooks/useCheckCanResolve";
import { handleReport } from "../../../hooks/UseReport";
import { useGetTokenContract } from "../../../hooks/contracts/useGetTokenContract";

interface Event {
  id: number;
  fpmm_title: string;
  fpmm_address: string;
  deployer: string;
  created_at: string;
  questionId: string;
}

const Index = () => {
  const router = useRouter();
  const { fpmmAddress } = router.query;

  const [eventData, setEventData] = useState<Event | null>(null);
  const [funding, setFunding] = useState<string>("");
  const [canResolve, setCanResolve] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const { address, chainId } = useAccount(); // Add this to check if user is the deployer
  const { address: tokenContractAddress } = useGetTokenContract(
    Number(chainId)
  );

  const {
    data: hashApprove,
    isPending: isPendingApprove,
    writeContract: writeContractApprove,
  } = useWriteContract();
  const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApproved } =
    useWaitForTransactionReceipt({
      hash: hashApprove,
    });
  function handleApprove() {
    // Convert input amount to 18 decimal places
    const amount = BigInt(parseFloat(funding) * 10 ** 18);
    writeContractApprove({
      address: tokenContractAddress,
      abi: TOKEN_CONTRACT.abi as Abi,
      functionName: "approve",
      args: [eventData!.fpmm_address, amount],
    });
  }

  const {
    data: hash,
    isPending: isPending,
    writeContract: writeContract,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  function handleFunding() {
    // Convert input amount to 18 decimal places
    const amount = BigInt(parseFloat(funding) * 10 ** 18);
    writeContract({
      address: eventData!.fpmm_address as `0x${string}`,
      abi: fpmmAbi as Abi,
      functionName: "addFunding",
      args: [amount, [1, 1]],
    });
  }

  async function fetchEventData() {
    if (!fpmmAddress) return;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("fpmm_address", fpmmAddress)
        .single();

      if (error) throw error;
      if (data) setEventData(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }

  async function checkCanResolve() {
    if (!eventData || !fpmmAddress) return;

    try {
      const canResolveStatus = await handleCheckCanResolve(
        eventData.fpmm_address,
        eventData.deployer,
        eventData.questionId as string,
        2
      );
      setCanResolve(canResolveStatus);
      console.log("Can resolve:", canResolveStatus);
    } catch (error) {
      console.error("Error checking resolution status:", error);
      setCanResolve(false);
    }
  }

  const handleResolveEvent = async (resultIndex: number) => {
    if (!eventData || !canResolve) return;

    try {
      setIsResolving(true);
      await handleReport(
        eventData.fpmm_address,
        eventData.questionId as string,
        resultIndex
      );

      // Update the database
      const { error } = await supabase
        .from("events")
        .update({
          resolved: true,
          resolution: resultIndex === 1 ? "Yes" : "No",
        })
        .eq("fpmm_address", fpmmAddress);

      if (error) throw error;

      // Refetch event data
      await fetchEventData();
    } catch (error) {
      console.error("Error resolving event:", error);
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [fpmmAddress]);

  useEffect(() => {
    if (eventData) {
      checkCanResolve();
    }
  }, [eventData]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 ">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 press-start-2p-regular">
        <h1 className="text-xl font-bold text-gray-800 mb-4 ">Prediction</h1>
        {eventData && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="text-lg font-medium text-gray-700">
                {eventData.fpmm_title}
              </h2>
              <span className="text-sm text-gray-500">
                Created: {new Date(eventData.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Funding Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Add Funding
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              value={funding}
              onChange={(e) => setFunding(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={isPendingApprove}
              >
                {isPendingApprove && (
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isPendingApprove ? "Confirming..." : "Approve"}
              </button>

              <button
                onClick={handleFunding}
                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending && (
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isPending ? "Confirming..." : "Add Funding"}
              </button>
            </div>
          </div>

          {/* Transaction Status Messages */}
          <div className="space-y-2 mt-4">
            {isConfirmingApprove && (
              <div className="text-blue-600 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Waiting for approval...
              </div>
            )}
            {isConfirmedApproved && (
              <div className="text-green-600 text-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approval confirmed
              </div>
            )}
            {isConfirming && (
              <div className="text-blue-600 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Waiting for funding confirmation...
              </div>
            )}
            {isConfirmed && (
              <div className="text-green-600 text-sm flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Funding confirmed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Resolve Event</h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                canResolve
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {canResolve ? "Ready to Resolve" : "Not Ready"}
            </span>
            {!canResolve && (
              <button
                onClick={checkCanResolve}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Check Again
              </button>
            )}
          </div>
        </div>

        {address === eventData?.deployer ? (
          <div className="space-y-6">
            <p className="text-gray-600">
              As the event creator, you can resolve this event with the final
              outcome.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleResolveEvent(1)}
                disabled={!canResolve || isResolving}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {isResolving ? "Resolving..." : "Resolve as YES"}
              </button>
              <button
                onClick={() => handleResolveEvent(0)}
                disabled={!canResolve || isResolving}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {isResolving ? "Resolving..." : "Resolve as NO"}
              </button>
            </div>
            {!canResolve && (
              <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 p-4 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Cannot resolve yet. Please check if the resolution conditions
                are met.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-center">
              Only the event creator can resolve this event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
