import { ethers } from "ethers";
import FpmmABI from "../contracts/fpmm/fpmmAbi.json"
import ConditionalTokensABI from "../contracts/ctf/ConditionalTokens.json"

export const handleReport = async(address: string, questionId: string, resultIndex: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();

    const fpmm = new ethers.Contract(
        address,
        FpmmABI,
        provider
      );

      const conditionalToken = await fpmm.conditionalTokens();

      const conditionalTokens = new ethers.Contract(
        conditionalToken,
        ConditionalTokensABI.abi,
        provider
      );
      
    // Create payout array for binary outcome
    const payout = new Array(2).fill(0);  // Initialize array with zeros
    payout[resultIndex] = 1;              // Set the winning outcome to 1

    console.log("Payout array:", payout); // Should log [1,0] for resultIndex 0, or [0,1] for resultIndex 1

    // Connect with signer for sending transaction
    await conditionalTokens.report(questionId, payout);
}   