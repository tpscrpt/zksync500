import * as React from "react";
import { ZKScanLink } from "../../../zkscan-link";

type Props = {
  txHash: string;
};

export function WaitingOn({ txHash }: Props): JSX.Element {
  return (
    <>
      <div className="spinner"></div>
      <p>Waiting for transaction to complete</p>
      <ZKScanLink txHash={txHash} />
    </>
  );
}
