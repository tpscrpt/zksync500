import * as React from "react";
import * as ReactDOM from "react-dom";
import { UrlContext } from "./hooks/url-context";
import { getUrlParams } from "./hooks/url-context/actions";
import { PaymentForm } from "./components/payment-form";
import { EthersManager } from "./components/ethers-manager";

function App() {
  return (
    <UrlContext.Provider value={getUrlParams()}>
      <EthersManager>
        <PaymentForm />
      </EthersManager>
    </UrlContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("zksync500"));
