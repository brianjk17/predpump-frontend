import { WriteContractMutate } from "wagmi/query"
import FpmmABI from "../contracts/fpmm/fpmmAbi.json"
import { Config } from "wagmi"
import { ethers } from "ethers";
import { utils } from "ethers";  // Import utils instead of ethers directly



export const handleBuy = (writeContract:  WriteContractMutate<Config, unknown>, address: string, outcomeIndex: number, investedAmount: string) => {
    const etherInvestedAmount = utils.parseEther(investedAmount);
    console.log(etherInvestedAmount);
    writeContract({
        address: address as `0x${string}`,
        abi: FpmmABI,
        functionName: "buy",
        args: [
            BigInt(etherInvestedAmount.toString()), // Convert BigNumber to string then to BigInt
            BigInt(outcomeIndex),
            BigInt(0),
        ]
    })
}