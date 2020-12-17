import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { networks } from "../../config/networks";
import { Web3Provider } from "@ethersproject/providers";

type Props = {
  txHash: string;
};

export function ZKScanLink({ txHash }: Props): JSX.Element {
  const { chainId } = useWeb3React<Web3Provider>();

  return (
    <>
      {chainId ? (
        <a
          rel="noreferrer"
          target="_blank"
          href={
            chainId === 1
              ? `https://zkscan.io/transactions/${txHash}`
              : `https://${networks[chainId]}.zkscan.io/transactions/${txHash}`
          }
        >
          View on zkscan
        </a>
      ) : null}
    </>
  );
}
