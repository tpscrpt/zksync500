import * as ethers from "ethers";
import Big from "big.js";
import { Tested } from "@bgpc/aws-serverless-toolkit";
import { supportedTokens } from "@zksync500/shared/supported-tokens";
import { ShortBody } from "./types";

export const shortTests: Tested<ShortBody> = {
  to: { test: ethers.utils.isAddress },
  amount: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test: (val: any): boolean => {
      if (typeof val !== "string") return false;
      if (Big(val).lte(0)) return false;
      return true;
    },
  },
  token: {
    test: Object.keys(supportedTokens).includes,
  },
  memo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    test: (val: any): boolean => {
      if (typeof val !== "string") return false;
      if (val.length > 281) return false;
      return true;
    },
  },
};
