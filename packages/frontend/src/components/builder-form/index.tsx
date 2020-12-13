import { ethers } from "ethers";
import * as React from "react";
import Big from "big.js";
import { useState } from "react";
import { Button, Dropdown, FormControl, InputGroup } from "react-bootstrap";
import { makePost, ApiGatewayBusinessResponseBody } from "@bgpc/aws-serverless-toolkit";
import { supportedTokensWithIcons as supportedTokens } from "../../config/supported-tokens";
import { inputHandler } from "../../utils/input-handler";
import { Spinner } from "../spinner";
import { supportedTokensList } from "../supported-tokens-list";
import { TokenOption } from "../token-option";
import { Short } from "./components/short";
import { ShortBody, ShortPayload } from "@zksync500/backend/src/functions/short/types";
import { backendUrl } from "../../config/backend-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shortCall = makePost<ShortBody, ApiGatewayBusinessResponseBody<ShortPayload, any>>(
  `${backendUrl}/short`,
);

export function BuilderForm(): JSX.Element {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("DAI");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [short, setShort] = useState("");

  const toValid = () => ethers.utils.isAddress(to);
  const amountValid = () => !!amount && Big(amount).gt(0);

  async function onSubmit(): Promise<void> {
    setSubmitting(true);
    const response = await shortCall({
      amount,
      to,
      token,
      memo,
    });

    setShort(response.payload?.short ?? "");
    setSubmitting(false);
  }

  return (
    <>
      {short ? (
        <Short short={short} />
      ) : (
        <>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Recipient</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Your Address"
              aria-label="Your Address"
              aria-describedby="basic-addon1"
              value={to}
              isInvalid={!!to && !toValid()}
              onChange={inputHandler(setTo)}
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
            disabled={!toValid() || !amountValid() || submitting}
          >
            {submitting ? <Spinner size={24} /> : "Create Short Link"}
          </Button>
        </>
      )}
    </>
  );
}
