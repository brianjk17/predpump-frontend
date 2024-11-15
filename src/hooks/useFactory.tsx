import { useAccount, useReadContract } from "wagmi";
import { FACTORY_CONTRACT } from "../contracts";

export default function useFactory() {
  const { address: ownerAddress, chain } = useAccount();



  return {};
}
