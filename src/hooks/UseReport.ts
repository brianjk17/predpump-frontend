import { ethers } from "ethers";
import FpmmABI from "../contracts/fpmm/fpmmAbi.json"
import ConditionalTokensABI from "../contracts/ctf/ConditionalTokens.json"

export const handleReport = async(address: string, questionId: string, resultIndex: number) => {
    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Initialize FPMM contract
    const fpmm = new ethers.Contract(
        address,
        FpmmABI,
        signer  // Use signer directly for write operations
    );

    // Get conditional tokens contract address
    const conditionalToken = await fpmm.conditionalTokens();

    // Initialize Conditional Tokens contract
    const conditionalTokens = new ethers.Contract(
        conditionalToken,
        ConditionalTokensABI.abi,
        signer  // Use signer directly for write operations
    );

    // Create payout array for binary outcome
    const payout = new Array(2).fill(0);  // Initialize array with zeros
    payout[resultIndex] = 1;              // Set the winning outcome to 1

    console.log("Payout array:", payout); // Should log [1,0] for resultIndex 0, or [0,1] for resultIndex 1

    // Send transaction
    const tx = await conditionalTokens.reportPayouts(questionId, payout);
    
    // Wait for transaction to be mined
    await tx.wait();

    return tx;
}