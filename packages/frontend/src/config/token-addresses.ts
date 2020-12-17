import { supportedTokens } from "@zksync500/shared/supported-tokens";
import { networks } from "./networks";

export const tokenAddresses: Record<
  keyof typeof networks,
  Record<keyof typeof supportedTokens, string>
> = {
  1: {
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ETH: "0x0000000000000000000000000000000000000000",
  },
  3: {
    DAI: "",
    ETH: "",
  },
  4: {
    DAI: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
    ETH: "0x0000000000000000000000000000000000000000",
  },
};

export const addressTokens: Record<
  keyof typeof networks,
  Record<string, keyof typeof supportedTokens>
> = Object.entries(tokenAddresses).reduce((acc, [chainId, obj]) => {
  return {
    ...acc,
    [chainId]: {
      ...Object.entries(obj).reduce((obj, [symbol, address]) => {
        return { ...obj, [address]: symbol };
      }, {}),
    },
  };
}, {});
