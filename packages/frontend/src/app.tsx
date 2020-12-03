import * as React from "react";
import * as ReactDOM from "react-dom";
import { UrlContext } from "./hooks/url-context";
import { getUrlParams } from "./hooks/url-context/actions";
import { PaymentForm } from "./components/payment-form";

function App(): JSX.Element {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>zksync500</h1>
      <br />
      <UrlContext.Provider value={getUrlParams()}>
        <PaymentForm />
      </UrlContext.Provider>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("zksync500"));
