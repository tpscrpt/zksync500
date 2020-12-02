import * as React from "react";
import * as ReactDOM from "react-dom";
import { UrlContext } from "./hooks/url-context";
import { getUrlParams } from "./hooks/url-context/actions";
import { PaymentForm } from "./components/payment-form";
import { EthersManager } from "./components/ethers-manager";

function App(): JSX.Element {
  return (
    <EthersManager>
      <UrlContext.Provider value={getUrlParams()}>
        <PaymentForm />
      </UrlContext.Provider>
    </EthersManager>
  );
}

ReactDOM.render(<App />, document.getElementById("zksync500"));
