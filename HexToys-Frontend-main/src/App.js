import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import { Toaster } from 'react-hot-toast';
import "./App.css";
import "antd/dist/antd.css";

import { connectors, connectorLocalStorageKey } from './utils/connectors';
import { useEagerConnect } from "./hooks/useEagerConnect";
import { useInactiveListener } from "./hooks/useInactiveListener";
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage } from "./utils/ethereum";

import { getUser, loginUser, logout, useAuthDispatch, useAuthState } from "./context/authContext";
import ConnectDialog from './components/ConnectDialog';
import NetworkErrorDialog from './components/NetworkErrorDialog';

import Collection from "./pages/collection/collection";
import EditCollection from "./pages/edit-collection";
import CreateMultiple from "./pages/create/create-multiple";
import CreateSingle from "./pages/create/create-single";
import ImportCollection from "./pages/import-collection/import-collection";
import Detail from "./pages/detail/detail";
import EditProfile from "./pages/edit-profile";
import ExploreCollections from "./pages/explore-collections/explore-collections";
import ExploreItems from "./pages/explore-items/explore-items";
import Home from "./pages/home/home";
import Profile from "./pages/profile";
import Search from "./pages/search/search";
import MysteryBoxes from "./pages/mysteryboxes";
import MysteryBoxDetail from "./pages/mysterybox-detail";

import NftStaking from "./pages/nft-staking";

function App() {

  const [connectModalOpen, setConnectModalOpen] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  useAxios();

  const { account, library, activate, active, connector } = useWeb3React();
  const connectAccount = () => {
    setConnectModalOpen(true);
  }
  const connectToProvider = (connector) => {
    activate(connector);
  }

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector])

  // mount only once or face issues :P
  const [triedEager, triedEagerError] = useEagerConnect();
  const { activateError } = useInactiveListener(!triedEager || !!activatingConnector);

  // handling connection error
  if ((triedEagerError || activateError) && errorModalOpen === null) {
    const errorMsg = getErrorMessage(triedEagerError || activateError);
    setNetworkError(errorMsg);
    setErrorModalOpen(true);
    window.localStorage.setItem(connectorLocalStorageKey, "");
  }

  const dispatch = useAuthDispatch();
  const { user, token } = useAuthState();

  const login = async () => {
    if (!account || !library) {
      console.log('not connected to wallet');
      return;
    }
    if (!user || (user && user.address.toLowerCase() !== account.toLowerCase())) {
      console.log('fetching user');
      await getUser(dispatch, account);
    }
    if (token) {
      jwt.verify(token, '!@#456QWErty', (err, payload) => {
        if (err) {
          logout(dispatch);
        }
        let address = payload.data;
        if (address.toLowerCase() !== account.toLowerCase()) {
          loginUser(dispatch, account, user?.nonce, library.getSigner());
        }
      })
    } else {
      loginUser(dispatch, account, user?.nonce, library.getSigner());
    }
    console.log("login 2")

  }

  useEffect(() => {
    if (active && account) {
      getUser(dispatch, account);
    }
  }, [active, account])

  const closeErrorModal = () => {
    // window.localStorage.setItem(connectorLocalStorageKey, connectors[0].key);
    // window.location.reload();
    setErrorModalOpen(false);    
  }

  return (
    <div className="App">
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 },
        }}
      />
      <Router>
        <Switch>
          <Route path="/" exact render={(props) => (<Home {...props} connectAccount={connectAccount} />)} />
          <Route path="/home" exact render={(props) => (<Home {...props} connectAccount={connectAccount} />)} />
          <Route path="/search/:searchTxt" exact render={(props) => (<Search {...props} connectAccount={connectAccount} />)} />
          <Route path="/detail/:chain_id/:collection/:tokenID" exact render={(props) => (<Detail {...props} user={user} login={login} connectAccount={connectAccount} />)} />
          <Route path="/explore-collections" exact render={(props) => (<ExploreCollections {...props} connectAccount={connectAccount} />)} />
          <Route path="/explore-items" exact render={(props) => (<ExploreItems {...props} connectAccount={connectAccount} />)} />
          <Route path="/collection/:chain_id/:collection" exact render={(props) => (<Collection {...props} connectAccount={connectAccount} />)} />
          <Route path="/profile/:id" exact render={(props) => (<Profile {...props} user={user} login={login} connectAccount={connectAccount} />)} />
          <Route path="/edit_profile" exact render={(props) => (<EditProfile {...props} user={user} login={login} connectAccount={connectAccount} />)} />
          <Route path="/edit_collection/:chain_id/:collection" exact render={(props) => (<EditCollection {...props} user={user} login={login} connectAccount={connectAccount} />)} />
          <Route path="/create-single" exact render={(props) => (<CreateSingle {...props} connectAccount={connectAccount} />)} />
          <Route path="/create-multiple" exact render={(props) => (<CreateMultiple {...props} connectAccount={connectAccount} />)} />
          <Route path="/import" exact render={(props) => (<ImportCollection {...props} connectAccount={connectAccount} />)} />
          <Route path="/mysteryboxes" exact render={(props) => (<MysteryBoxes {...props} connectAccount={connectAccount} />)} />
          <Route path="/mysterybox/:chain_id/:address" exact render={(props) => (<MysteryBoxDetail {...props} connectAccount={connectAccount} />)} />
          <Route path="/nft-staking" exact render={(props) => (<NftStaking {...props} connectAccount={connectAccount} />)} />          
        </Switch>
      </Router>

      {/* <NetworkErrorDialog
        open={!!errorModalOpen && !active}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return false;
          }
          if (reason === "escapeKeyDown") {
            return false;
          }
          setErrorModalOpen(false)
        }}
        handleClose={closeErrorModal}
        message={networkError}
      /> */}
      <ConnectDialog
        open={!!connectModalOpen}
        handleClose={(event, reason) => {
          if (reason === "backdropClick") {
            return false;
          }
          if (reason === "escapeKeyDown") {
            return false;
          }
          setConnectModalOpen(false)
        }}
        connectors={connectors}
        connectToProvider={connectToProvider}
        connectorLocalStorageKey={connectorLocalStorageKey}
      />

    </div>
  );
}

export default App;
