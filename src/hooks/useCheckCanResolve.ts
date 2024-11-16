import { ethers } from "ethers";
import FpmmABI from "../contracts/fpmm/fpmmAbi.json"
import ConditionalTokensABI from "../contracts/ctf/ConditionalTokens.json"

export const handleCheckCanResolve = async(address: string, deployer: string, questionId: string, outcomeSlots: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
      
            const fpmm = new ethers.Contract(
              address,
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

            const conditionalId = await conditionalTokens.getConditionId(address, questionId, outcomeSlots);

            const canResolve = await conditionalTokens.canReport(conditionalId);

            return canResolve;
}