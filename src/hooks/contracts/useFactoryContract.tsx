import { ZeroAddress } from "ethers";
import { CHAINS_CONFIG } from "../../constants/chains";
import { TOKEN_CONTRACT } from "../../contracts";
import { useEffect, useState } from "react";

export const useFactoryContract = (chainId: number) => {
  const [contractAddress, setContractAddress] = useState<`0x${string}`>(
    ZeroAddress as `0x${string}`
  );

  useEffect(() => {
    const chainConfig = CHAINS_CONFIG[chainId as keyof typeof CHAINS_CONFIG];

    if (chainConfig) {
      setContractAddress(
        chainConfig.contractAddress.factory_address as `0x${string}`
      );
    } else {
      setContractAddress(ZeroAddress as `0x${string}`);
    }
  }, [chainId]);

  return {
    address: contractAddress,
    abi: TOKEN_CONTRACT.abi,
  } as const;
};
