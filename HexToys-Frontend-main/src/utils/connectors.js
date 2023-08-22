import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { NetworkParams } from "./index"
import Metamask from "../icons/Metamask";
import WalletConnect from "../icons/WalletConnect";

export const injectedConnector = new InjectedConnector({ supportedChainIds: NetworkParams.chainList });

const POLLING_INTERVAL = 12000
export const walletconnect = new WalletConnectConnector({
  rpc: {
    [+NetworkParams.defaultChainID]: NetworkParams?.[NetworkParams.defaultChainID]?.rpcUrls[0]
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export function getConnector(connectorId) {
  switch (connectorId) {
    case "injectedConnector":
      return injectedConnector;
    case "walletconnect":
      return walletconnect;
    default:
      return injectedConnector;
  }
}

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: injectedConnector,
    key: "injectedConnector",
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: walletconnect,
    key: "walletconnect",
  },
]

export const connectorLocalStorageKey = "connectorId";