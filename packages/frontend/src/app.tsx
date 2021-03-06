import * as React from "react";
import * as ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { UrlContext } from "./hooks/url-context";
import { getUrlParams } from "./hooks/url-context/actions";
import { PaymentForm } from "./components/payment-form";
import { BuilderForm } from "./components/builder-form";
import { Nav } from "./components/nav";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from "ethers";
import { ContractProvider } from "./hooks/contract-context";
import { ModalProvider } from "./components/nav/modal-context";

function App(): JSX.Element {
  return (
    <Router>
      <Web3ReactProvider getLibrary={(provider) => new ethers.providers.Web3Provider(provider)}>
        <ModalProvider>
          <Nav />
          <ContractProvider>
            <Container fluid className="mt-5" style={{ maxWidth: "500px" }}>
              <Switch>
                <Route exact path="/create">
                  <BuilderForm />
                </Route>
                <Route exact path="/">
                  <UrlContext.Provider value={getUrlParams()}>
                    <PaymentForm />
                  </UrlContext.Provider>
                </Route>
              </Switch>
            </Container>
          </ContractProvider>
        </ModalProvider>
      </Web3ReactProvider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("zksync500"));
