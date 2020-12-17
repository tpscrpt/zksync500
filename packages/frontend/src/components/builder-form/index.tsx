import { ethers } from "ethers";
import * as React from "react";
import Big from "big.js";
import { useState } from "react";
import { Button, Dropdown, FormControl, InputGroup, Toast } from "react-bootstrap";
import { supportedTokensWithIcons as supportedTokens } from "../../config/supported-tokens";
import { inputHandler } from "../../utils/input-handler";
import { Spinner } from "../spinner";
import { supportedTokensList } from "../supported-tokens-list";
import { TokenOption } from "../token-option";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ContractContext } from "../../hooks/contract-context";
import { EtherscanLink } from "../etherscan-link";
import { formatBytes32String } from "ethers/lib/utils";
import { ModalContext, ModalProvider } from "../nav/modal-context";
import { tokenAddresses } from "../../config/token-addresses";
import { networks } from "../../config/networks";
import { Star } from "../star";
import { deployUrl } from "../../config/deploy-url";

export function BuilderForm(): JSX.Element {
  const { setShowModal } = React.useContext(ModalContext);
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const contract = React.useContext(ContractContext);
  const [short, setShort] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("DAI");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toValid = () => ethers.utils.isAddress(to);
  const amountValid = () => !!amount && Big(amount).gt(0);

  React.useEffect(() => {
    if (account && !to) setTo(account);
  }, [account]);

  async function onSubmit(): Promise<void> {
    if (contract && library && account && chainId) {
      setSubmitting(true);

      const tx = await contract.connect(library.getSigner(account)).create(
        formatBytes32String(short),
        Big(amount)
          .times(Big(10).pow(supportedTokens[token as keyof typeof supportedTokens].decimals))
          .toString(),
        to,
        tokenAddresses[chainId as keyof typeof networks][token as keyof typeof supportedTokens],
        memo,
      );

      setTxHash(tx.hash);
      setShowSubmitted(true);

      setTimeout(() => {
        setShowSubmitted(false);
      }, 5000);

      const receipt = await tx.wait(1);

      if (receipt.status) {
        setSuccess(true);
      } else {
        setError("Transaction failed.");
        setShowSubmitted(false);
        setTimeout(() => setError(""), 5000);
      }

      setSubmitting(false);
    }
  }

  return (
    <>
      {error ? (
        <Toast>
          <Toast.Header>Transaction failed</Toast.Header>
          <Toast.Body>
            <span>{error}</span>
          </Toast.Body>
        </Toast>
      ) : null}
      {success ? (
        <div
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <a href={`${deployUrl}?$=${short}`}>{`${deployUrl}?$=${short}`}</a>
        </div>
      ) : (
        <>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                Recipient <Star />
              </InputGroup.Text>
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
              <InputGroup.Text id="basic-addon2">
                Amount <Star />
              </InputGroup.Text>
            </InputGroup.Prepend>

            <FormControl
              placeholder="0"
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
              <InputGroup.Text id="basic-addon7">
                ?$= <Star />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Query Cash Equals"
              aria-describedby="basic-addon7"
              placeholder="..."
              value={short}
              onChange={inputHandler(setShort)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon5">Description</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="Description"
              aria-describedby="basic-addon5"
              value={memo}
              maxLength={141}
              as="textarea"
              onChange={inputHandler(setMemo)}
            />
          </InputGroup>

          <Button
            block
            variant="dark"
            onClick={() => (account ? onSubmit() : setShowModal?.(true))}
            disabled={!toValid() || !amountValid() || submitting || !contract || !short}
          >
            {submitting ? <Spinner size={24} /> : !account ? "Connect Wallet" : "Create"}
          </Button>
          {txHash ? (
            <div
              className="mt-3"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>Transaction submitted</span>
              <EtherscanLink txHash={txHash} />
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
