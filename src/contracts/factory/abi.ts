export const factoryAbi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createFPMM",
    inputs: [
      {
        name: "collateralToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "oracle",
        type: "address",
        internalType: "address",
      },
      {
        name: "questionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "outcomeSlotCount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "endTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract FixedProductMarketMaker",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fpmmFactory",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract FPMMFactory",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isFPMM",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidFPMM",
    inputs: [
      {
        name: "fpmmAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
] as const;
