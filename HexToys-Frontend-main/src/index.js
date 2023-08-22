import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import App from './App';
import { AuthProvider } from './context/authContext';

import reportWebVitals from './reportWebVitals';
import { LoadingProvider } from "./context/useLoader";
function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <LoadingProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Web3ReactProvider>
    </LoadingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
