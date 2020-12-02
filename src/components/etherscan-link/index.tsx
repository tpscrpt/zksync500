import * as React from "react";
import { useContext } from "react";
import { EthersContext } from "../../hooks/ethers-context";

type Props = {
  txHash: string;
};

export function EtherscanLink({ txHash }: Props): JSX.Element {
  const { network } = useContext(EthersContext);
  const url =
    network === "mainnet"
      ? `https://etherscan.io/tx/${txHash}`
      : `https://${network}.etherscan.io/tx/${txHash}`;

  return <a href={url}>View on etherscan</a>;
}
