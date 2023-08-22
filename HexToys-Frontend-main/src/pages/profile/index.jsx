import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useLoader } from '../../context/useLoader'

import { shorter } from "../../utils";
import './profile.scss';
import { NetworkParams } from "../../utils";

import Masonry from 'react-masonry-css';
import ItemCard from "../../components/Cards/ItemCard";
import MySelect from '../../components/Widgets/MySelect';
import clsx from 'clsx';
import CopyIcon from "../../assets/images/copyIcon.png";
import twitterIcon from "../../assets/images/icon-twitter.png";
import mailIcon from "../../assets/images/icon-mail.png";
import instagramIcon from "../../assets/images/icon-instagram.png";


import Header from '../header/header';
import { Footer } from '../footer/footer';

function Profile(props) {
  const breakpoint = {
    default: 5,
    1840: 5,
    1440: 4,
    1280: 3,
    768: 2,
    450: 1,
  };
  let { id } = useParams();
  const [userProfile, setUserProfile] = useState(undefined);
  const { account } = useWeb3React();

  const [curTab, setCurTab] = useState('owned'); // owned, sale, liked

  const [items, setItems] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  const networkOptions = [
    // { value: 0, label: 'All Networks' },    
    { value: 369, label: 'PulseChain' },
  ];
  const [chainId, setChainId] = useState(369);

  const typeOptions = [
    { label: 'All items', value: '' },
    { label: 'Single items', value: 'single' },
    { label: 'Multiple items', value: 'multi' },
  ];
  const [type, setType] = useState("");

  const sortOptions = [
    { label: 'Recently Listed', value: 'timestamp'},
    { label: 'Price: low to high', value: 'price1'},
    { label: 'Price: high to low', value: 'price2'},
    { label: 'Most Favorited', value: 'likeCount'},
    { label: 'Name', value: 'name'},
  ];
  const [sortBy, setSortBy] = useState("timestamp");


  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function getUser() {
    axios.get(`${process.env.REACT_APP_API}/user_info/${id ? id : ""}`)
      .then(res => {
        setUserProfile(res.data.user);
      })
  }

  useEffect(() => {
    setItems([]);
    setNoItems(false)
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchTxt, sortBy, curTab, type, chainId])

  useEffect(() => {
    setLoading(true)
    if (initialItemsLoaded) {
      fetchItems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchItems(reset) {
    let paramData = { sortDir: 'desc' };

    if (sortBy) {
      paramData.sortBy = sortBy;
      if (sortBy === 'name') {
        paramData.sortDir = 'asc';
      }
    }
    if (searchTxt) {
      paramData.searchTxt = searchTxt;
    }
    if (type) {
      paramData.type = type;
    }
    if (chainId > 0) {
      paramData.chainId = chainId;
    }

    switch (curTab) {
      case 'owned':
        // Owned
        paramData.owner = id;
        break;
      case 'sale':
        // On sale
        paramData.itemOwner = id;
        paramData.saleType = 'all';
        break;
      case 'liked':
        // Liked
        paramData.likes = id;
        break;
      default:
        break;
    }

    if (reset) {
      paramData.page = 1;
    } else {
      paramData.page = page;
    }

    axios.get(`${process.env.REACT_APP_API}/items`, {
      params: paramData
    })
      .then(res => {
        setLoading(false)
        if (res.data.items.length === 0) setNoItems(true)
        if (reset) {
          setItems(res.data.items)
          setInitialItemsLoaded(true)
        } else {
          let prevArray = JSON.parse(JSON.stringify(items))
          prevArray.push(...res.data.items)
          setItems(prevArray)
        }
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
        setNoItems(true)
      })
  }

  function loadMore() {
    if (!loading) {
      setPage(page => { return (page + 1) })
    }
  }

  const copyToClipboard = (text) => {
    console.log('text', text)
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    toast.success("Copied");
  }

  const [setPageLoading, setMessage] = useLoader()
  useEffect(() => {
    setMessage('')
    setPageLoading((!noItems && items.length === 0) || !userProfile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, items, noItems])
  return (
    <>
      <Header {...props} />
      <div className="profile">
        <div className="banner">
          <div className="background-cover"></div>
          <div className="banner_content">
            <div className="inner-wrap">
              <div className="content-box">
                <div className="profile-box">
                  <img
                    className="profileimg"
                    src={userProfile && userProfile.profilePic ? userProfile.profilePic : "/profile.png"}
                    alt="ProfileImage"
                  />
                  <div className="profileInfo-box">
                    <h1>{userProfile && userProfile.name ? userProfile.name : "NoName"}</h1>
                    <div className="pinId">
                      <p>
                        <span className="uid" onClick={() => window.open(`${NetworkParams?.[chainId]?.blockExplorerUrls[0]}/address/${id}`)}>{`${shorter(id)}`}</span>
                        <span className="copy-button">
                          <img src={CopyIcon} alt="ProfileImage" onClick={() => copyToClipboard(id)} />
                        </span>
                      </p>
                    </div>
                    <div>
                      {
                        userProfile && userProfile.email &&
                        <a href={`mailto:${userProfile.email}`} target="_blank" rel="noreferrer"> <span> <img src={mailIcon} width='30' height='24' alt='' /></span> </a>
                      }
                      {
                        userProfile && userProfile.twitter &&
                        <a href={userProfile.twitter} target="_blank" rel="noreferrer"> <span> <img src={twitterIcon} width='30' height='24' alt='' /></span> </a>
                      }
                      {
                        userProfile && userProfile.instagram &&
                        <a href={userProfile.instagram} target="_blank" rel="noreferrer"> <span> <img src={instagramIcon} width='30' height='24' alt='' /></span> </a>
                      }                     
                      
                    </div>

                  </div>
                </div>
              </div>
              {account &&
                <div className="button-box">
                  <Link to="/edit_profile" className="cta-button setting-button" style={{ display: account.toLowerCase() === id.toLowerCase() ? '' : 'none' }}>
                    Setting
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="container">
          <div className="tab_list">
            <div onClick={() => setCurTab('owned')} className={curTab === 'owned' ? 'tab active' : 'tab'}>Owned</div>
            <div onClick={() => setCurTab('sale')} className={curTab === 'sale' ? 'tab active' : 'tab'}>On sale</div>
            <div onClick={() => setCurTab('liked')} className={curTab === 'liked' ? 'tab active' : 'tab'}>Liked</div>
          </div>
          <div className="filter_div">
            <div className="search_div">
              <button><i className="fas fa-search"></i></button>
              <input type='text' placeholder="Search" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} />

            </div>

            <MySelect
              value={chainId}
              options={networkOptions}
              onChange={setChainId}
              className={clsx('filter_select', 'light')}
            />
            <MySelect
              value={type}
              options={typeOptions}
              onChange={setType}
              className={clsx('filter_select', 'light')}
            />

            <MySelect
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              className={clsx('filter_select', 'light')}
            />
          </div>
          <div className="tab_content">
            <Masonry
              breakpointCols={breakpoint}
              className={'masonry'}
              columnClassName={'gridColumn'}
            >
              {
                items.map((item, index) => <ItemCard key={index} {...props} item={item} />)
              }
            </Masonry>
          </div>
          <div className="btn_div" style={{ display: noItems ? "none" : "" }}>
            <button className="cta-button" onClick={() => loadMore()}>
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

}

export default Profile;
