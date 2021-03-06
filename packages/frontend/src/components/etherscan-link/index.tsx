import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { networks } from "../../config/networks";
import { Web3Provider } from "@ethersproject/providers";

type Props = {
  txHash: string;
};

export function EtherscanLink({ txHash }: Props): JSX.Element {
  const { chainId } = useWeb3React<Web3Provider>();

  return (
    <>
      {chainId ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={
            chainId === 1
              ? `https://etherscan.io/tx/${txHash}`
              : `https://${networks[chainId]}.etherscan.io/tx/${txHash}`
          }
        >
          View on etherscan
        </a>
      ) : null}
    </>
  );
}
