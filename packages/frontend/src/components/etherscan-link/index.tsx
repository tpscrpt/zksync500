import * as React from "react";
import { network } from "../../config/network";

type Props = {
  txHash: string;
};

export function EtherscanLink({ txHash }: Props): JSX.Element {
  const url =
    network === "mainnet"
      ? `https://zkscan.io/transactions/${txHash}`
      : `https://${network}.zkscan.io/transactions/${txHash}`;

  return <a href={url}>View on zkscan</a>;
}
