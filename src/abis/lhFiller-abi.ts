export const lhFillerAbi = [
  {
    inputs: [
      { internalType: "contract IReactor", name: "_reactor", type: "address" },
      { internalType: "contract IWETH", name: "_weth", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "InsufficientNativeAmount",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "InvalidSender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes", name: "order", type: "bytes" },
          { internalType: "bytes", name: "sig", type: "bytes" },
        ],
        internalType: "struct SignedOrder",
        name: "order",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "contract IExchange",
            name: "exchange",
            type: "address",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct IExchange.Swap[]",
        name: "swaps",
        type: "tuple[]",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes", name: "order", type: "bytes" },
          { internalType: "bytes", name: "sig", type: "bytes" },
        ],
        internalType: "struct SignedOrder[]",
        name: "orders",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "contract IExchange",
            name: "exchange",
            type: "address",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct IExchange.Swap[]",
        name: "swaps",
        type: "tuple[]",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "fillers",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "contract IReactor",
                name: "reactor",
                type: "address",
              },
              { internalType: "address", name: "swapper", type: "address" },
              { internalType: "uint256", name: "nonce", type: "uint256" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
              {
                internalType: "contract IValidationCallback",
                name: "additionalValidationContract",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "additionalValidationData",
                type: "bytes",
              },
            ],
            internalType: "struct OrderInfo",
            name: "info",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "uint256", name: "maxAmount", type: "uint256" },
            ],
            internalType: "struct InputToken",
            name: "input",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "address", name: "recipient", type: "address" },
            ],
            internalType: "struct OutputToken[]",
            name: "outputs",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "sig", type: "bytes" },
          { internalType: "bytes32", name: "hash", type: "bytes32" },
        ],
        internalType: "struct ResolvedOrder",
        name: "order",
        type: "tuple",
      },
    ],
    name: "getFeeOutputs",
    outputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "recipient", type: "address" },
        ],
        internalType: "struct OutputToken[]",
        name: "fees",
        type: "tuple[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reactor",
    outputs: [{ internalType: "contract IReactor", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "contract IReactor",
                name: "reactor",
                type: "address",
              },
              { internalType: "address", name: "swapper", type: "address" },
              { internalType: "uint256", name: "nonce", type: "uint256" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
              {
                internalType: "contract IValidationCallback",
                name: "additionalValidationContract",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "additionalValidationData",
                type: "bytes",
              },
            ],
            internalType: "struct OrderInfo",
            name: "info",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "uint256", name: "maxAmount", type: "uint256" },
            ],
            internalType: "struct InputToken",
            name: "input",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "address", name: "recipient", type: "address" },
            ],
            internalType: "struct OutputToken[]",
            name: "outputs",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "sig", type: "bytes" },
          { internalType: "bytes32", name: "hash", type: "bytes32" },
        ],
        internalType: "struct ResolvedOrder[]",
        name: "orders",
        type: "tuple[]",
      },
      { internalType: "bytes", name: "callbackData", type: "bytes" },
    ],
    name: "reactorCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_fillers", type: "address[]" },
      { internalType: "bool", name: "enabled", type: "bool" },
    ],
    name: "setFillers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "filler", type: "address" },
      {
        components: [
          {
            components: [
              {
                internalType: "contract IReactor",
                name: "reactor",
                type: "address",
              },
              { internalType: "address", name: "swapper", type: "address" },
              { internalType: "uint256", name: "nonce", type: "uint256" },
              { internalType: "uint256", name: "deadline", type: "uint256" },
              {
                internalType: "contract IValidationCallback",
                name: "additionalValidationContract",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "additionalValidationData",
                type: "bytes",
              },
            ],
            internalType: "struct OrderInfo",
            name: "info",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "uint256", name: "maxAmount", type: "uint256" },
            ],
            internalType: "struct InputToken",
            name: "input",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "address", name: "recipient", type: "address" },
            ],
            internalType: "struct OutputToken[]",
            name: "outputs",
            type: "tuple[]",
          },
          { internalType: "bytes", name: "sig", type: "bytes" },
          { internalType: "bytes32", name: "hash", type: "bytes32" },
        ],
        internalType: "struct ResolvedOrder",
        name: "",
        type: "tuple",
      },
    ],
    name: "validate",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IExchange",
            name: "exchange",
            type: "address",
          },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct IExchange.Swap[]",
        name: "swaps",
        type: "tuple[]",
      },
      { internalType: "address[]", name: "tokens", type: "address[]" },
      { internalType: "uint256", name: "nativeAmountMin", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
