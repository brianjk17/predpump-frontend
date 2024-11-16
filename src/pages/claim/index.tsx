import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConditionalTokensABI from '../../contracts/ctf/ConditionalTokens.json';
import FpmmABI from "../../contracts/fpmm/fpmmAbi.json"
import { ethers } from 'ethers';

const RedeemPayouts = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(BigInt(0));

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // // Get user's token balance
  // const { data: userBalance } = useReadContract({
  //   address: process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS as `0x${string}`,
  //   abi: [{
  //     "inputs": [{"name": "account", "type": "address"}],
  //     "name": "balanceOf",
  //     "outputs": [{"name": "", "type": "uint256"}],
  //     "stateMutability": "view",
  //     "type": "function"
  //   }],
  //   functionName: 'balanceOf',
  //   args: [address as `0x${string}`],
  // });

  const handleRedeem = async () => {
    try {
      setLoading(true);
      
      // Create index sets for both positions
      const indexSets = [BigInt(1), BigInt(2)]; // [1, 2] for binary outcomes

      const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
      
            const fpmm = new ethers.Contract(
              "0x569213644d0b75681994af0786de877fd993a977",
              FpmmABI,
              provider
            );

            const conditionalToken = await fpmm.conditionalTokens();
            console.log(conditionalToken);

            const conditionalTokens = new ethers.Contract(
                conditionalToken,
                ConditionalTokensABI.abi,
                provider
            );
            // TODO: Get Condition Id params 
            // Deployer Address 
            // Question Id
            // Outcome Slots
            const conditionalId = await conditionalTokens.getConditionId("0xcA51855FBA4aAe768DCc273349995DE391731e70", "0x42fde50281c1ebd14fd1b55ad2267b508218a32e86956283ef57a56e1709bc19", 2);

      await writeContract({
        address: conditionalToken as `0x${string}`,
        abi: ConditionalTokensABI.abi,
        functionName: 'redeemPositions',
        args: [
          process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
          '0x0000000000000000000000000000000000000000000000000000000000000000', // parentCollectionId as bytes32(0)
          conditionalId, // Make sure to set this in your .env
          indexSets,
        ],
      });

    } catch (error) {
      console.error('Error redeeming positions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Redeem Payouts</h1>

      {/* Position Info */}
      {/* <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Position</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Current Balance: {userBalance ? formatUnits(userBalance, 18) : '0'} USDC
          </p>
        </div>
      </div> */}

      {/* Claimable Amount */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Claimable Amount</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            {claimableAmount > BigInt(0)  
              ? `${formatUnits(claimableAmount, 18)} USDC available to claim`
              : 'No amount available to claim yet'}
          </p>
        </div>
      </div>

      {/* Redeem Button */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <button
          onClick={handleRedeem}
          // disabled={loading || isPending || isConfirming || claimableAmount === BigInt(0)}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            loading || isPending || isConfirming
              ? 'bg-gray-400 cursor-not-allowed'
              : claimableAmount > BigInt(0)
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading || isPending || isConfirming ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Redeem Positions'
          )}
        </button>

        {isConfirmed && (
          <div className="mt-4 bg-green-100 text-green-700 p-4 rounded-lg">
            <p className="text-sm">
              Successfully redeemed! Transaction hash: {hash?.slice(0, 10)}...
              <a 
                href={`https://etherscan.io/tx/${hash}`}
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

      {/* How it works */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. The redeem function will check both YES and NO positions.</p>
          <p>2. If you hold any winning positions, you'll receive USDC tokens.</p>
          <p>3. The amount you receive depends on your position size and the market outcome.</p>
          <p>4. Redemption can only happen once per position.</p>
        </div>
      </div>
    </div>
  );
};

export default RedeemPayouts;