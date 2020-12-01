import * as React from "react"
import * as ethers from "ethers"
import Big from "big.js"
import { useContext, useState, useEffect } from "react";
import { UrlContext } from "../../hooks/url-context";
import { CheckoutManager } from "zksync-checkout"
import { EthersContext } from "../../hooks/ethers-context";
import { TransactionInfo } from "zksync-checkout/build/types";

export function inputHandler(setter: (val: string) => void): (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setter(event.target.value)
}

type TxInfoProps = {
  transactionInfo: TransactionInfo;
  setTransactionInfo: (val?: TransactionInfo) => void;
  network: "rinkeby" | "ropsten" | "mainnet" | "localhost";
}

export function TxInfo(props: TxInfoProps): JSX.Element {
  const { transactionInfo, network: ethereumNetwork } = props;
  const url = ethereumNetwork === "mainnet"
    ? `https://etherscan.io/tx/${transactionInfo.hash}`
    : `https://${ethereumNetwork}.etherscan.io/tx/${transactionInfo.hash}`
  
  return (<>
    <span>View transaction: <a href={url}>{transactionInfo.hash}</a></span>
    <span>Status: {transactionInfo.success ? "Success" : "Failure"}</span>
    { transactionInfo.failReason ? <span>Reason: {transactionInfo.failReason}</span> : null }
    <button onClick={() => props.setTransactionInfo(undefined)}>Close</button>
  </>)
}

export function PaymentForm(): JSX.Element {
  const { to: urlTo, amount: urlAmount, token: urlToken } = useContext(UrlContext)
  const { network: ethereumNetwork, address: walletAddress } = useContext(EthersContext);

  const [checkout,] = useState(new CheckoutManager(ethereumNetwork));
  const [to, setTo] = useState(urlTo);
  const [amount, setAmount] = useState(urlAmount);
  const [token, setToken] = useState(urlToken);
  const [feeToken, setFeeToken] = useState("ETH");
  const [estimatedFee, setEstimatedFee] = useState("");
  const [enoughBalance, setEnoughBalance] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [waitingOn, setWaitingOn] = useState("");
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | undefined>();

  const toValid = () => ethers.utils.isAddress(to);
  const amountValid = () => !!amount && Big(amount).gt(0)

  useEffect(() => {
    if (!amount) return;
    checkout.estimateBatchFee([{ amount, to, token }], feeToken).then(setEstimatedFee)
    checkout.checkEnoughBalance([{ amount, to, token, }], feeToken, walletAddress).then(setEnoughBalance)
  }, [amount, feeToken])

  async function onSubmit(): Promise<void> {
    setSubmitting(true)
    const receipts = await checkout.zkSyncBatchCheckout([{
      amount,
      to,
      token,
    }], feeToken, walletAddress)

    setWaitingOn(receipts[0]);
    const transactionInfos = await checkout.wait(receipts);
    
    setTransactionInfo(transactionInfos[0])
    setSubmitting(false)
    setWaitingOn("")
  }

  return (<div>
    { transactionInfo
        ? <TxInfo transactionInfo={transactionInfo} setTransactionInfo={setTransactionInfo} network={ethereumNetwork} />
        : waitingOn
          ? <WaitingOn txHash={waitingOn} />
          : <>
              <input id="to" value={to} onChange={inputHandler(setTo)}></input>
              <input id="amount" value={amount} onChange={inputHandler(setAmount)}></input>
              {
                enoughBalance === null || enoughBalance ? null : <span>Not enough balance</span> 
              }
              <select id="token" value={token} onChange={inputHandler(setToken)}>
                { 
                  // TODO: map over list of assets
                }
              </select>
              <select id="feeToken" value={feeToken} onChange={inputHandler(setFeeToken)}>
                {
                  // TODO: map over list of assets
                }
              </select>
              <span>Estimated fee: {estimatedFee || "..."} {feeToken}</span>
              <button id="submit" disabled={!toValid() || !amountValid() || submitting} onClick={onSubmit}>Send</button>
            </>
    }
  </div>)
}