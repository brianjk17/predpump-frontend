import { WriteContractMutate } from "wagmi/query"
import FpmmABI from "../contracts/fpmm/fpmmAbi.json"
import { Config } from "wagmi"
import { ethers } from "ethers";

export const handleBuy = (writeContract:  WriteContractMutate<Config, unknown>, address: string, outcomeIndex: number, investedAmount: string) => {
    const etherInvestedAmount = ethers.parseEther(investedAmount);
    console.log(etherInvestedAmount);
    writeContract({
        address: address as `0x${string}`,
        abi: FpmmABI,
        functionName: "buy",
        args: [
            BigInt(etherInvestedAmount),
            BigInt(outcomeIndex),
            BigInt(0),
        ]
    })
}