import { useWeb3React } from "@web3-react/core";
import * as React from "react";
import { Navbar, Nav as BSNav, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEagerConnect } from "../../hooks/use-eager-connect";
import { useInactiveListener } from "../../hooks/use-inactive-listener";
import { Web3Provider } from "@ethersproject/providers";
import {
  authereum,
  fortmatic,
  injected,
  portis,
  walletconnect,
  network,
} from "../../utils/connectors";
import Web3Image from "../../assets/connectors/Web3.png";
import WalletConnectImage from "../../assets/connectors/WalletConnect.svg";
import AuthereumImage from "../../assets/connectors/Authereum.svg";
import FortmaticImage from "../../assets/connectors/Fortmatic.jpg";
import PortisImage from "../../assets/connectors/Portis.jpg";
import MetamaskImage from "../../assets/connectors/Metamask.jpg";
import WalletIcon from "../../assets/purse.svg";
import { Spinner } from "../spinner";
import { ModalContext } from "./modal-context";

enum ConnectorNames {
  Injected = "Web3",
  WalletConnect = "WalletConnect",
  Authereum = "Authereum",
  Fortmatic = "Fortmatic",
  Portis = "Portis",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Authereum]: authereum,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Portis]: portis,
};

const connectorImagesByName: { [connectorName in ConnectorNames]: string } = {
  [ConnectorNames.Injected]: Web3Image,
  [ConnectorNames.WalletConnect]: WalletConnectImage,
  [ConnectorNames.Authereum]: AuthereumImage,
  [ConnectorNames.Fortmatic]: FortmaticImage,
  [ConnectorNames.Portis]: PortisImage,
};

export function Nav(): JSX.Element {
  const [pathname, setPathname] = React.useState(window.location.pathname);
  const { showModal, setShowModal } = React.useContext(ModalContext);
  const context = useWeb3React<Web3Provider>();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal?.(false)}>
        <Modal.Dialog style={{ minWidth: "280px", width: "90%" }}>
          <Modal.Header closeButton>
            <Modal.Title>Connect</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {[
                ...Object.keys(connectorsByName).map((connectorName) => {
                  const currentConnector = connectorsByName[connectorName as ConnectorNames];
                  const activating = currentConnector === activatingConnector;
                  const connected = currentConnector === connector;
                  const disabled =
                    (!triedEager && connector != network) ||
                    !!activatingConnector ||
                    connected ||
                    !!error;
                  return (
                    <Button
                      variant={connected ? "primary" : "light"}
                      disabled={disabled}
                      className="py-2 m-2"
                      key={connectorName}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "150px",
                        width: "80%",
                      }}
                      onClick={() => {
                        setActivatingConnector(currentConnector);
                        activate(connectorsByName[connectorName as ConnectorNames]);
                      }}
                    >
                      {activating ? (
                        <Spinner size={24} />
                      ) : (
                        <>
                          <img
                            src={
                              library?.provider.isMetaMask && connectorName === "Web3"
                                ? MetamaskImage
                                : connectorImagesByName[connectorName as ConnectorNames]
                            }
                            className="mr-2"
                            style={{ maxWidth: "4vmax", maxHeight: "4vmax" }}
                          />
                          <span>{connectorName}</span>
                        </>
                      )}
                    </Button>
                  );
                }),
                <Button
                  variant="secondary"
                  className="mt-3"
                  block
                  key="reset"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "150px",
                    width: "80%",
                  }}
                  disabled={connector == network}
                  onClick={deactivate}
                >
                  Disconnect
                </Button>,
              ]}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {connector == network || active ? null : <div>Not connected</div>}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
      <Navbar bg="light">
        <BSNav className="mx-auto">
          <BSNav.Item className="mr-3">
            <Button
              variant="light"
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
              onClick={() => setShowModal?.(true)}
            >
              <img
                src={WalletIcon}
                style={{
                  height: "2vmax",
                }}
              />
            </Button>
          </BSNav.Item>
          <BSNav.Link as={Link} to="/" active={pathname === "/"} onClick={() => setPathname("/")}>
            Send
          </BSNav.Link>

          <BSNav.Link
            as={Link}
            to="/create"
            active={pathname === "/create"}
            onClick={() => setPathname("/create")}
          >
            Create Link
          </BSNav.Link>
        </BSNav>
      </Navbar>
    </>
  );
}
