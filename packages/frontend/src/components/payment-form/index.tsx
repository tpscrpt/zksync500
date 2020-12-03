import * as React from "react";
import * as ethers from "ethers";
import Big from "big.js";
import { useContext, useState, useEffect } from "react";
import { UrlContext } from "../../hooks/url-context";
import { CheckoutManager } from "zksync-checkout";
import { TransactionInfo } from "zksync-checkout/build/types";
import { supportedTokensWithIcons as supportedTokens } from "../../config/supported-tokens";
import { TxInfo } from "./components/tx-info";
import { inputHandler } from "../../utils/input-handler";
import { WaitingOn } from "./components/waiting-on";
import "./styles.css";
import { network } from "../../config/network";
import { Button, Dropdown, FormControl, InputGroup } from "react-bootstrap";
import { TokenOption } from "../token-option";
import { supportedTokensList } from "../supported-tokens-list";
import { Spinner } from "../spinner";

export function PaymentForm(): JSX.Element {
  const { to: urlTo, amount: urlAmount, token: urlToken, memo: urlMemo } = useContext(UrlContext);

  const [checkout] = useState(new CheckoutManager(network));
  const [to, setTo] = useState(urlTo ?? "");
  const [from, setFrom] = useState("");
  const [amount, setAmount] = useState(urlAmount ?? "");
  const [token, setToken] = useState(urlToken ?? "DAI");
  const [memo, setMemo] = useState(urlMemo ?? "");
  const [feeToken, setFeeToken] = useState("ETH");
  const [estimatedFee, setEstimatedFee] = useState("");
  const [notEnoughBalance, setNotEnoughBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [waitingOn, setWaitingOn] = useState("");
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | undefined>();

  const weiAmount = () =>
    Big(amount)
      .times(Big(10).pow(supportedTokens[token as keyof typeof supportedTokens].decimals))
      .toString();

  const toValid = () => ethers.utils.isAddress(to);
  const fromValid = () => ethers.utils.isAddress(from);
  const amountValid = () => !!amount && Big(amount).gt(0);

  useEffect(() => {
    if (!amount || !toValid() || !token) return;
    checkout
      .estimateBatchFee([{ amount: weiAmount(), to, token, description: memo }], feeToken)
      .then((val) =>
        setEstimatedFee(
          Big(val)
            .div(Big(10).pow(supportedTokens[feeToken as keyof typeof supportedTokens].decimals))
            .toString(),
        ),
      );

    if (from && fromValid()) {
      checkout
        .checkEnoughBalance([{ amount: weiAmount(), to, token, description: memo }], feeToken, from)
        .then((val) => setNotEnoughBalance(!val));
    }
  }, [amount, feeToken, from]);

  async function onSubmit(): Promise<void> {
    setSubmitting(true);

    const receipts = await checkout.zkSyncBatchCheckout(
      [
        {
          amount: weiAmount(),
          to,
          token,
        },
      ],
      feeToken,
      from,
    );

    setWaitingOn(receipts[0]);

    const transactionInfos = await checkout.wait(receipts);

    setTransactionInfo(transactionInfos[0]);
    setSubmitting(false);
    setWaitingOn("");
  }

  return (
    <div className="PaymentForm">
      {transactionInfo ? (
        <TxInfo transactionInfo={transactionInfo} setTransactionInfo={setTransactionInfo} />
      ) : waitingOn ? (
        <WaitingOn txHash={waitingOn} />
      ) : (
        <>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Recipient's Address"
              aria-label="Recipient's Address"
              aria-describedby="basic-addon1"
              value={to}
              isInvalid={!!to && !toValid()}
              onChange={inputHandler(setTo)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon6">From</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Enter Your Address"
              aria-label="Enter Your Address"
              aria-describedby="basic-addon6"
              value={from}
              onChange={inputHandler(setFrom)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2">Amount</InputGroup.Text>
            </InputGroup.Prepend>

            <FormControl
              placeholder="1337"
              aria-label="Send Amount"
              aria-describedby="basic-addon2"
              inputMode="decimal"
              value={amount}
              isInvalid={!!amount && !amountValid()}
              onChange={inputHandler(setAmount)}
            />
            <Dropdown
              as={InputGroup.Append}
              variant="outline-secondary"
              id="input-group-dropdown-2"
            >
              <Dropdown.Toggle style={{ display: "flex", alignItems: "center" }} variant="light">
                <TokenOption
                  symbol={token}
                  icon={supportedTokens[token as keyof typeof supportedTokens].icon}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>{supportedTokensList("token", setToken)}</Dropdown.Menu>
            </Dropdown>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon3">Auto-Fee</InputGroup.Text>
            </InputGroup.Prepend>
            <InputGroup.Prepend style={{ flex: "1 1 auto" }}>
              <InputGroup.Text id="basic-addon4" style={{ width: "100%" }}>
                {estimatedFee}
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Dropdown color="outline-secondary" id="input-group-dropdown-3">
              <Dropdown.Toggle style={{ display: "flex", alignItems: "center" }} variant="light">
                <TokenOption
                  symbol={feeToken}
                  icon={supportedTokens[feeToken as keyof typeof supportedTokens].icon}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>{supportedTokensList("feeToken", setFeeToken)}</Dropdown.Menu>
            </Dropdown>
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon-5">Message</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Message"
              aria-describedby="basic-addon5"
              value={memo}
              as="textarea"
              onChange={inputHandler(setMemo)}
            />
          </InputGroup>
          <Button
            block
            variant="dark"
            onClick={onSubmit}
            disabled={!toValid() || !fromValid() || !amountValid() || submitting}
          >
            {submitting ? <Spinner size={24} /> : "Send Transaction"}
          </Button>
        </>
      )}
    </div>
  );
}
