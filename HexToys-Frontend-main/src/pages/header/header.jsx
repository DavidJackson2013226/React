import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import { Link, useLocation } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import { Dropdown } from "antd";
import SearchDrop from "../../components/Search/SearchDrop";
import MySelect from '../../components/Widgets/MySelect';
import { useAuthDispatch, logout } from '../../context/authContext';
import { connectorLocalStorageKey } from "../../utils/connectors"
import { setupNetwork } from "../../utils/wallet"
import "./header.scss";
import clsx from 'clsx';

import Logo from "../../assets/images/logo.png";
import menuicon from "../../assets/images/icon-hamburger-menu.svg";
import menuicon_01 from "../../assets/images/icon-hamburger-menu_01.svg";

function Header(props) {
  const { connectAccount } = props;
  const { account, chainId, deactivate } = useWeb3React();
  const dispatch = useAuthDispatch();
  const [userProfile, setUserProfile] = useState(undefined);
  useEffect(() => {
    if (account) {
      axios.get(`${process.env.REACT_APP_API}/user_info/${account}`)
        .then(res => {
          setUserProfile(res.data.user);
        })
    }
  }, [account])

  const [navId, setNavId] = useState('');
  const search = useLocation();
  useEffect(() => {
    const path = search.pathname.replace('/', '');
    setNavId(path);
  }, [setNavId, search]);


  const [searchTxt, setSearchTxt] = useState("");
  const searchDrop = <SearchDrop {...props} searchTxt={searchTxt} />;

  function signOut() {
    deactivate();
    logout(dispatch);
    window.localStorage.setItem(connectorLocalStorageKey, "");
  }

  function connectWallet() {
    // connect account
    closeMenu();
    connectAccount();
  }

  function disConnectWallet() {
    // disconnect account
    closeMenu();
    signOut();
  }

  const [showDropDown, setShowDropDown] = useState(false); // user profile
  const [showExploreSubMenu, setShowExploreSubMenu] = useState(false); // explore subview
  const [showCreateSubMenu, setShowCreateSubMenu] = useState(false); // create subview

  function openMenu() {
    console.log('openmenu');
    var element = document.getElementById('menuExp');
    element.classList.add('menu-open');
  }
  function closeMenu() {
    var element = document.getElementById('menuExp');
    element.classList.remove('menu-open');
  }
  function onClickMenu(menu) {
    if (menu === 'boutique') {
      window.open(`https://hextoys.co.uk/`);
      props.history.push(`/import`);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }    
    if (menu === 'explore') {
      setShowExploreSubMenu(!showExploreSubMenu);
      setShowDropDown(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'create') {
      setShowCreateSubMenu(!showCreateSubMenu);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
    }
    if (menu === 'import') {
      props.history.push(`/import`);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'explore-collections') {
      props.history.push(`/explore-collections`);
      setShowExploreSubMenu(false);
      setShowDropDown(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'explore-items') {
      props.history.push(`/explore-items`);
      setShowExploreSubMenu(false);
      setShowDropDown(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'mysteryboxes') {
      setShowExploreSubMenu(false);
      setShowDropDown(false);
      setShowCreateSubMenu(false);
      props.history.push(`/mysteryboxes`);
    }
    if (menu === 'nft-staking') {
      setShowExploreSubMenu(false);
      setShowDropDown(false);
      setShowCreateSubMenu(false);
      props.history.push(`/nft-staking`);
    }
    if (menu === 'create-single') {
      props.history.push(`/create-single`);
      setShowCreateSubMenu(false);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
    }
    if (menu === 'create-multiple') {
      props.history.push(`/create-multiple`);
      setShowCreateSubMenu(false);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
    }
    if (menu === 'user_profile') {
      setShowDropDown(!showDropDown);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'profile') {
      props.history.push(`/profile/${account}`);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'edit_profile') {
      props.history.push(`/edit_profile`);
      setShowDropDown(false);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }
    if (menu === 'disconnect') {
      disConnectWallet();
      setShowDropDown(false);
      setShowExploreSubMenu(false);
      setShowCreateSubMenu(false);
    }
  }

  const networkOptions = [
    { label: 'PulseChain', value: 369 },
  ];
  const [tempChainId, setTempChainId] = useState(369);
  const [activeChainId, setActiveChainId] = useState(networkOptions[0].value);
  const handleSelectNetwork = (value) => {
    if (chainId) {
      setupNetwork(value);
    } else {
      setActiveChainId(value);
      setTempChainId(value);
    }
  };

  useEffect(() => {
    if (chainId) {
      if (tempChainId > 0 && chainId !== tempChainId) {
        // open switch dialog
        setupNetwork(tempChainId);
        setTempChainId(0);
      } else {
        setActiveChainId(chainId);
      }
    }
  }, [chainId, tempChainId])

  return (
    <div className='header_bar'>
      <div className='container'>
        <div className={clsx('wrapper', 'light')}>
          <div className='logo_search'>
            <Link to="/">
              <div className='img-content'>
                <img src={Logo} alt='' />
              </div>
            </Link>
            <Dropdown placement="bottom" overlay={searchDrop} trigger={["click"]}>
              <div className="search">
                <button><i className="fas fa-search"></i></button>
                <input type="text" placeholder="Search" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} />
              </div>
            </Dropdown>
          </div>
          <div className="menu_connectBtn">
            <div className="menu_list" id='menuExp'>
              <div className="closeContainer">
                <CloseIcon className="fa" fontSize="small" onClick={() => { closeMenu() }} />
              </div>

              <div className={'menu-item'} onClick={() => onClickMenu('boutique')}>
                Boutique
              </div>
              <div className={navId.indexOf('explore') >= 0 ? 'menu-item active' : 'menu-item'} onClick={() => onClickMenu('explore')}>
                Explore
                <div className={clsx('drop_down', showExploreSubMenu ? 'active_drop' : '')}>
                  <div className='drop_down_list left'>
                    <div className='drop_down_item' onClick={() => onClickMenu('explore-collections')}>Explore Collections</div>
                    <div className='drop_down_item' onClick={() => onClickMenu('explore-items')}>All NFTs</div>
                  </div>
                </div>
              </div>


              {account &&
                <>
                  <div className={navId.indexOf('mysteryboxes') >= 0 ? 'menu-item active none' : 'menu-item none'} onClick={() => onClickMenu('mysteryboxes')}>
                    MysteryBoxes
                  </div>

                  <div className={navId.indexOf('nft-staking') >= 0 ? 'menu-item active none' : 'menu-item none'} onClick={() => onClickMenu('nft-staking')}>
                    NFT Staking
                  </div>

                  <div className={navId.indexOf('create') >= 0 ? 'menu-item active' : 'menu-item'} onClick={() => onClickMenu('create')}>
                    Create
                    <div className={clsx('drop_down', showCreateSubMenu ? 'active_drop' : '')}>
                      <div className='drop_down_list left'>
                        <div className='drop_down_item' onClick={() => onClickMenu('create-single')}>Single</div>
                        <div className='drop_down_item' onClick={() => onClickMenu('create-multiple')}>Multiple</div>
                      </div>
                    </div>
                  </div>

                  <div className={navId.indexOf('import') >= 0 ? 'menu-item active' : 'menu-item'} onClick={() => onClickMenu('import')}>
                    Import
                  </div>

                  <div className={'menu-item'} onClick={() => onClickMenu('profile')}>
                    My Items
                  </div>
                </>
              }

            </div>

            <div className="btn_div">
              <img src={menuicon} className="fa" alt='' onClick={() => {
                openMenu();
                setShowDropDown(false);
                setShowExploreSubMenu(false);
                setShowCreateSubMenu(false);
              }} />

              <MySelect
                value={activeChainId}
                options={networkOptions}
                onChange={handleSelectNetwork}
                className={clsx('filter_select', 'light')}
              />

              {account ?
                <div className='user_profile'>
                  <img src={userProfile && userProfile.profilePic ? userProfile.profilePic : 'https://ipfs.hex.toys/ipfs/QmaxQGhY772ffG7dZpGsVoUWcdSpEV1APru95icXKmii67'}
                    alt="userpicture"
                    onClick={() => onClickMenu('user_profile')} />
                  <div className={clsx('drop_down', account && showDropDown ? 'active_drop' : '')}>
                    <div className='drop_down_list right'>
                      <div className='drop_down_item' onClick={() => onClickMenu('edit_profile')}>Edit Profile</div>
                      <div className='drop_down_item' onClick={() => onClickMenu('disconnect')}>Disconnect</div>
                    </div>
                  </div>
                </div>
                :
                <div className='user_profile'>
                  <div className='connect-btn' onClick={() => connectWallet()}>
                    Connect Wallet
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
