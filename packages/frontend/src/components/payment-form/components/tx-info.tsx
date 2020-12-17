import * as React from "react";
import { TransactionInfo } from "zksync-checkout/build/types";
import { ZKScanLink } from "../../zkscan-link";

type TxInfoProps = {
  transactionInfo: TransactionInfo;
  setTransactionInfo: (val?: TransactionInfo) => void;
};

export function TxInfo(props: TxInfoProps): JSX.Element {
  const { transactionInfo } = props;

  return (
    <>
      <ZKScanLink txHash={transactionInfo.hash} />
      <span>Status: {transactionInfo.success ? "Success" : "Failure"}</span>
      {transactionInfo.failReason ? <span>Reason: {transactionInfo.failReason}</span> : null}
      <button onClick={() => props.setTransactionInfo(undefined)}>Close</button>
    </>
  );
}
