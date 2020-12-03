import * as React from "react";
import * as ReactDOM from "react-dom";
import { UrlContext } from "./hooks/url-context";
import { getUrlParams } from "./hooks/url-context/actions";
import { PaymentForm } from "./components/payment-form";
import { BuilderForm } from "./components/builder-form";
import { Nav } from "./components/nav";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App(): JSX.Element {
  return (
    <Router>
      <Nav />
      <Container fluid className="mt-3" style={{ maxWidth: "500px" }}>
        <Switch>
          <Route exact path="/create">
            <BuilderForm />
          </Route>
          <Route path="/">
            <UrlContext.Provider value={getUrlParams()}>
              <PaymentForm />
            </UrlContext.Provider>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("zksync500"));
