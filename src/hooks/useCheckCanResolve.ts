import { ethers } from "ethers";
import FpmmABI from "../contracts/fpmm/fpmmAbi.json";
import ConditionalTokensABI from "../contracts/ctf/ConditionalTokens.json";


export const handleCheckCanResolve = async (
  address: string,
  deployer: string,
  questionId: string,
  outcomeSlots: number
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const fpmm = new ethers.Contract(address, FpmmABI, provider);

  const conditionalToken = await fpmm.conditionalTokens();
  console.log(conditionalToken);

  const conditionalTokens = new ethers.Contract(
    conditionalToken,
    ConditionalTokensABI.abi,
    provider
  );

  const conditionalId = await conditionalTokens.getConditionId(
    address,
    questionId,
    outcomeSlots
  );

  const canResolve = await conditionalTokens.canReport(conditionalId);

  const conditionalId2 = await conditionalTokens.getConditionId(
    deployer,
    questionId,
    outcomeSlots
  );

  const info = await conditionalTokens.conditionInfo(conditionalId2);
  console.log("info", info)

  return canResolve;
};
