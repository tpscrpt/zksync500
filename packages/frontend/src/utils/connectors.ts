import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { NetworkConnector } from "@web3-react/network-connector";

console.log(process.env.NODE_ENV);

const POLLING_INTERVAL = 12000;

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string,
};

const defaultChainId = process.env.NODE_ENV === "production" ? 1 : 4;

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: defaultChainId,
});

export const injected = new InjectedConnector({ supportedChainIds: [1, 4] });

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const authereum = new AuthereumConnector({ chainId: defaultChainId });

export const fortmatic = new FortmaticConnector({
  apiKey:
    process.env.NODE_ENV === "production"
      ? (process.env.PROD_FORTMATIC_API_KEY as string)
      : (process.env.DEV_FORTMATIC_API_KEY as string),
  chainId: defaultChainId,
});

export const portis = new PortisConnector({
  dAppId: process.env.PORTIS_DAPP_ID as string,
  networks: [1, 4],
});
