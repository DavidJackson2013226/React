import { UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'

export function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install wallet.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "Invalid network. Please switch to the PulseChain network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}
