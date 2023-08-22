import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import Querystring from 'query-string';
import { format } from "date-fns";
import { useLoader } from '../../context/useLoader'
import './detail.scss';
import { shorter, formatNum, getCurrencyInfoFromAddress, NetworkParams } from "../../utils";
import { setupNetwork } from '../../utils/wallet';
import { Heart } from "@styled-icons/feather/Heart";
import { Heart as HeartFill } from "@styled-icons/fa-solid/Heart";
import { Helmet } from "react-helmet";

import Header from '../header/header';
import { Footer } from '../footer/footer'
import ItemCard from "../../components/Cards/ItemCard";
import "react-datepicker/dist/react-datepicker.css";

import reloadBtn from "../../assets/images/reload-btn.svg";
import shareLink from "../../assets/images/share-link.svg";
import externalLink from "../../assets/images/external-link.svg";
import menuIcn from "../../assets/images/menu-icn.svg";

import ModalTransfer from "../../components/modals/modal-transfer";
import ModalList from "../../components/modals/modal-list";
import ModalDelist from "../../components/modals/modal-delist";
import ModalBuy from "../../components/modals/modal-buy";
import ModalBid from "../../components/modals/modal-bid";
import ModalEndAuction from "../../components/modals/modal-end-auction";
import Expand from "react-expand-animated";
import Masonry from 'react-masonry-css';
import MyChart from '../../components/MyChart';

function Detail(props) {
  let { chain_id, collection, tokenID } = useParams();
  const breakpoint = {
    default: 4,
    1840: 4,
    1440: 4,
    1280: 3,
    1080: 2,
    768: 1,
    450: 2,
  };
  const styles = {
    open: {
      width: "100%",
      overflow: 'auto',
      maxHeight: '550px'
    },
    close: {
      width: "100%",
      // overflow: 'auto',
      // maxHeight: '500px'
    }
  };
  const transitions = ["height", "opacity", "background"];

  const { account, chainId } = useWeb3React();
  const [extendAuctionInfo, setExtendAuctionInfo] = useState(true);
  const [extendBidHistory, setExtendBidHistory] = useState(false);
  const [extendChart, setExtendChart] = useState(false);
  const [extendListing, setExtendListing] = useState(true);
  const [extendOwners, setExtendOwners] = useState(false);
  const [extendActivity, setExtendActivity] = useState(false);
  // const [extendDescription, setExtendDescription] = useState(false);
  const [extendProperties, setExtendProperties] = useState(true);
  const [extendDetails, setExtendDetails] = useState(false);
  const [extendMore, setExtendMore] = useState(true);

  const [item, setItem] = useState(null);

  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [didLike, setDidLike] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [showSendNFTModal, setShowSendNFTModal] = useState(false);
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showEndAuction, setShowEndAuction] = useState(false);
  const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false);
  const [showPutMarketPlace, setShowPutMarketPlace] = useState(false);

  const [auctionStatus, setAuctionStatus] = useState(false);
  const [auctionStatusMessage, setAuctionStatusMessage] = useState('');
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // properties for owners list
  const [holding, setHolding] = useState(0);
  const [pairItem, setPairItem] = useState(null);

  function fetchItem() {
    axios.get(`${process.env.REACT_APP_API}/item_detail/${chain_id}/${collection}/${tokenID}`)
      .then(res => {
        setItem(res.data.item);
      })
      .catch(err => {
        //show an error page that the item doesnt exist
        setItem(undefined);
      })
  }
  useEffect(() => {
    if (!item) {
      fetchItem();
    } else {
      let holdingAmount = 0;
      for (let index = 0; index < item.holders.length; index++) {
        let holder = item.holders[index];
        if (holder.user && holder.balance > 0 && account) {
          if (holder.address.toLowerCase() === account.toLowerCase()) {
            holdingAmount = holdingAmount + holder.balance;
          }
        }
      }
      setHolding(holdingAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, account, collection, tokenID])

  useEffect(() => {
    if (item && account) {
      setLocalLikeCount(item.likes ? item.likes.length : 0);
      setDidLike(item.likes && item.likes.includes(account.toLowerCase()));
    }
  }, [item, account])

  useEffect(() => {
    if (item && item.auctionInfo) setInterval(() => setNewTime(), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const setNewTime = () => {
    const currentTimestamp = new Date().getTime();
    let countdownDate = 0;
    if (item.auctionInfo.startTime * 1000 > currentTimestamp) {
      setAuctionStatus(false);
      countdownDate = item.auctionInfo.startTime * 1000;
      setAuctionStatusMessage('Auction starts in');

    } else if (item.auctionInfo.endTime * 1000 > currentTimestamp) {
      setAuctionStatus(true);
      countdownDate = item.auctionInfo.endTime * 1000;
      setAuctionStatusMessage('Ends in');
    } else {
      setAuctionStatusMessage('Auction has ended');
      setAuctionStatus(false);
    }

    if (countdownDate) {
      const distanceToDate = countdownDate - currentTimestamp;

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (numbersToAddZeroTo.includes(days)) {
        days = `0${days}`;
      }
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      }
      if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      }
      if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }
      setState({ days: days, hours: hours, minutes: minutes, seconds: seconds });
    } else {
      setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  function clickFavorite() {
    if (account) {
      if (!isLiking) {
        setIsLiking(true);
        setLocalLikeCount(l => l + (didLike ? -1 : 1));
        setDidLike(i => !i);
        axios.post(`${process.env.REACT_APP_API}/item/like`, Querystring.stringify({ address: account.toLowerCase(), chainId: item.chainId, tokenId: item.tokenId, itemCollection: item.itemCollection }))
          .then(res => {
            setIsLiking(false);
          })
          .catch(err => {
            setIsLiking(false);
          })
      }
    }
  }

  function buyItem(pair) {
    if (chainId && (Number(chain_id) === chainId)) {
      setPairItem(pair)
      setShowBuyNowModal(true);
    } else {
      setupNetwork(chain_id);
    }
  }
  function delistPairItem(pair) {
    if (chainId && (Number(chain_id) === chainId)) {
      setPairItem(pair)
      setShowUnlistMarketPlace(true);
    } else {
      setupNetwork(chain_id);
    }
  }
  const [setPageLoading, setMessage] = useLoader()
  useEffect(() => {
    setMessage('')
    setPageLoading(!item)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])
  return (
    <>
      <Helmet>
        <title>HEX TOYS - Item Details | NFT Marketplace on PulseChain</title>
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" name="title" />
        <meta content="Explore the details of a unique digital collectible on HEX TOYS. Learn more about this NFT and its creator on PulseChain." name="description" />
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" name="twitter:title" />
        <meta content={`https://marketplace.hex.toys/detail/${chain_id}/${collection}/${tokenID}`} name="twitter:url" />
        <meta content="HEX TOYS - Item Details | NFT Marketplace on PulseChain" property="og:title" />
        <meta content="Explore the details of a unique digital collectible on HEX TOYS. Learn more about this NFT and its creator on PulseChain." property="og:description" />
        <meta content={`https://marketplace.hex.toys/detail/${chain_id}/${collection}/${tokenID}`} property="og:url" />
        <meta content="HEX TOYS, NFT marketplace, PulseChain, digital collectible, NFT details, NFT creator" name="keywords" />
      </Helmet>

      <Header {...props} />
      {item &&
        <div className="detail">
          <div className="container">
            <div className='bull-info'>
              <div className='bull-price'>
                <span className='price-wrapper'>
                  {item.auctionInfo ?
                    <>
                      <img src={getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).logoURI} alt={''} />
                      <h6>{formatNum(item.auctionInfo.price)}</h6>
                    </> :
                    item.pairs && item.pairs.length > 0 ?
                      <>
                        <img src={getCurrencyInfoFromAddress(item.chainId, item.pairs[0].tokenAdr).logoURI} alt={''} />
                        <h6>{formatNum(item.pairs[0].price)}</h6>
                      </> :
                      <h6>Not for sale</h6>
                  }
                </span>
                <div className="favorit_btn" onClick={() => clickFavorite()}>
                  {didLike ? <HeartFill color='red' size={20} /> : <Heart size={20} />}
                  <p>{localLikeCount}</p>
                </div>
              </div>
              <div className="img_container">

                {
                  item?.asset_type === 'video' ?
                    <video className='video' src={item.animation_url} autoPlay loop controls /> :
                    item?.asset_type === 'audio' ?
                      <>
                        <div className="img_div">
                          <img src={item.image} alt='' />
                        </div>
                        <audio className='audio' src={item.animation_url} autoPlay loop controls />
                      </> :
                      <div className="img_div">
                        <img src={item.image} alt='' />
                      </div>
                }
              </div>

              {
                account && !item.auctionInfo && holding > 0 &&
                <div className='productinfo-buttons'>
                  <div className='buy-btn' onClick={() => {
                    if (chainId && (Number(chain_id) === chainId)) {
                      setShowPutMarketPlace(true);
                    } else {
                      setupNetwork(chain_id);
                    }
                  }}>
                    Put on sale
                  </div>
                  <div className='offer-btn' onClick={() => {
                    if (chainId && (Number(chain_id) === chainId)) {
                      setShowSendNFTModal(true);
                    } else {
                      setupNetwork(chain_id);
                    }
                  }}>
                    Send NFT
                  </div>
                </div>
              }

              <ul>
                <li>
                  <div className='info-title'>
                    <h6>Description</h6>
                    {/* <h6><i className="fas fa-angle-down" style={{ transform : `rotate(${!extendDescription ? 0:180}deg)`}}/></h6> */}
                  </div>
                  <Expand
                    open={true}
                    duration={300}
                    styles={styles}
                    transitions={transitions}
                  >
                    <div className='info-des'>
                      <p>{item.description}</p>
                    </div>
                  </Expand>

                </li>
                <li>
                  <div className='info-title' onClick={() => setExtendProperties(!extendProperties)}>
                    <h6>Properties</h6>
                    <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendProperties ? 0 : 180}deg)` }} /></h6>
                  </div>
                  <Expand
                    open={extendProperties}
                    duration={300}
                    styles={styles}
                    transitions={transitions}
                  >
                    <div className='info-property'>
                      {
                        item?.attributes.map((attribute, index) => (
                          <div className="item-property" key={index}>
                            <div className="property-type">{attribute.trait_type}</div>
                            <div className="property-value">{attribute.value}</div>
                          </div>
                        ))
                      }
                    </div>
                  </Expand>

                </li>
                <li className={extendDetails ? 'active' : ''}>
                  <div className='info-title' onClick={() => setExtendDetails(!extendDetails)}>
                    <h6>Details  </h6>
                    <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendDetails ? 0 : 180}deg)` }} /></h6>
                  </div>
                  <Expand
                    open={extendDetails}
                    duration={300}
                    styles={styles}
                    transitions={transitions}
                  >
                    <div className='info-des'>
                      <div className="detail-item">
                        Contract Address
                        <span>
                          <a href={`${NetworkParams?.[chain_id]?.blockExplorerUrls[0]}/address/${item.itemCollection}`} target="_blank" rel="noreferrer">{shorter(item.itemCollection)}</a>
                        </span>
                      </div>
                      <div className="detail-item">
                        Token ID
                        <span>{item.tokenId}</span>
                      </div>
                      <div className="detail-item">
                        Token Standard
                        <span> {item.type === 'single' ? 'PRC-721' : 'PRC-1155'} </span>
                      </div>
                      <div className="detail-item">
                        Blockchain
                        <span>{NetworkParams?.[chain_id]?.chainName}</span>
                      </div>
                    </div>
                  </Expand>

                </li>
              </ul>
            </div>
            <div className='activity-section'>
              <div className='header'>
                <div className="title">
                  <h2>{item.name}</h2>
                </div>

                <div className='header-links' style={{ display: 'none' }}>
                  <ul>
                    <li><a href='#' className='primary-bg'>
                      <img src={reloadBtn} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='#'>
                      <img src={externalLink} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='#'>
                      <img src={shareLink} height="24" width="24" alt={''} />
                    </a></li>
                    <li><a href='#'>
                      <img src={menuIcn} height="24" width="24" alt={''} />
                    </a></li>
                  </ul>
                </div>
                {
                  item.type === 'single' &&
                  <div className='header-subtitle' onClick={(e) => {
                    window.open(`/profile/${item.ownerUser.address}`);
                  }}>
                    <span>Owned By:</span>
                    <span className='owner-name'>
                      <img src={item.ownerUser.profilePic} alt={''} />
                      {item.ownerUser.name}
                    </span>
                  </div>
                }
              </div>
              <div className='product-info'>
                <ul>
                  {/* view auction info */}
                  {
                    item.auctionInfo &&
                    <li className={extendAuctionInfo ? 'product-price-item active' : 'product-price-item'}>
                      <div className='productinfo-title sale-ends' onClick={() => setExtendAuctionInfo(!extendAuctionInfo)}>
                        <h6>{auctionStatusMessage}</h6>
                        {
                          auctionStatus &&
                          <p>
                            <span>{state.days || '00'}</span> Days
                            <span>{state.hours || '00'}</span> Hours
                            <span>{state.minutes || '00'}</span> Minutes
                            <span>{state.seconds || '00'}</span> Seconds
                          </p>
                        }

                      </div>
                      <Expand
                        open={extendAuctionInfo}
                        duration={300}
                        styles={styles}
                        transitions={transitions}
                      >
                        <div className='productinfo-des'>
                          <h6>
                            {
                              (item.auctionInfo.bids && item.auctionInfo.bids.length > 0) ?
                                'Highest bid' : 'Minimum Bid'
                            }
                          </h6>
                          <div className='auction-price-wrapper'>
                            <img className='icon-price' src={getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).logoURI} alt={''} />
                            <h5>{formatNum(item.auctionInfo.price)}</h5>
                          </div>
                          {
                            account &&
                            <div className='productinfo-buttons'>
                              {
                                item.auctionInfo.owner.toLowerCase() === account.toLowerCase() &&
                                <div className='buy-btn' onClick={() => {
                                  if (chainId && (Number(chain_id) === chainId)) {
                                    setShowEndAuction(true);
                                  } else {
                                    setupNetwork(chain_id);
                                  }
                                }}>
                                  End Auction
                                </div>
                              }
                              {
                                item.auctionInfo.owner.toLowerCase() !== account.toLowerCase() &&
                                <div className='offer-btn' onClick={() => {
                                  if (chainId && (Number(chain_id) === chainId)) {
                                    setShowPlaceBidModal(true);
                                  } else {
                                    setupNetwork(chain_id);
                                  }
                                }}>
                                  Place a bid
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </Expand>

                    </li>
                  }

                  {/* view minimum listing info */}
                  {
                    item.pairs && item.pairs.length > 0 &&
                    <li className='product-price-item active'>
                      <div className='productinfo-title sale-ends'>
                        <h6>Current Price</h6>
                        {
                          item.supply > 1 &&
                          <p>
                            <span>{item.pairs[0].balance}</span> of <span>{item.supply}</span> Available
                          </p>
                        }
                      </div>
                      <Expand
                        open={extendAuctionInfo}
                        duration={300}
                        styles={styles}
                        transitions={transitions}
                      >
                        <div className='productinfo-des'>
                          <div className='auction-price-wrapper'>
                            <img className='icon-price' src={getCurrencyInfoFromAddress(item.chainId, item.pairs[0].tokenAdr).logoURI} alt={''} />
                            <h5>{formatNum(item.pairs[0].price)} {getCurrencyInfoFromAddress(item.chainId, item.pairs[0].tokenAdr).symbol}</h5>
                          </div>
                          {
                            account &&
                            <div className='productinfo-buttons'>
                              {
                                item.pairs[0].owner.toLowerCase() === account.toLocaleLowerCase() ?
                                  <div className='buy-btn' onClick={() => {
                                    if (chainId && (Number(chain_id) === chainId)) {
                                      delistPairItem(item.pairs[0]);
                                    } else {
                                      setupNetwork(chain_id);
                                    }
                                  }}>
                                    Unlist
                                  </div>
                                  :
                                  <div className='offer-btn' onClick={() => {
                                    if (chainId && (Number(chain_id) === chainId)) {
                                      buyItem(item.pairs[0]);
                                    } else {
                                      setupNetwork(chain_id);
                                    }
                                  }}>
                                    Buy Now
                                  </div>
                              }
                            </div>
                          }
                        </div>
                      </Expand>

                    </li>
                  }

                  <li className={extendListing ? 'active' : ''}>
                    <div className='productinfo-title' onClick={() => setExtendChart(!extendChart)}>
                      <h6>Price History</h6>
                      <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendBidHistory ? 0 : 180}deg)` }} /></h6>
                    </div>
                    <Expand
                      open={extendChart}
                      duration={300}
                      styles={styles}
                      transitions={transitions}
                    >
                      <div className='productinfo-des bg-dark'>
                        <MyChart collection={collection} tokenId={tokenID} />
                      </div>
                    </Expand>
                  </li>

                  {
                    item.auctionInfo && item.auctionInfo.bids &&
                    <li>
                      <div className='productinfo-title' onClick={() => setExtendBidHistory(!extendBidHistory)}>
                        <h6>Bid history</h6>
                        <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendBidHistory ? 0 : 180}deg)` }} /></h6>
                      </div>
                      <Expand
                        open={extendBidHistory}
                        duration={300}
                        styles={styles}
                        transitions={transitions}
                      >
                        <div className='productinfo-des bg-dark'>
                          <div className='activity-table-wrapper'>
                            <table className='activity-table'>
                              <thead>
                                <tr>
                                  <th>Price</th>
                                  <th>From </th>
                                  <th>Date </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  item.auctionInfo.bids.map((bid, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className='price-wrapper'>
                                          <img src={getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).logoURI} alt={''} />
                                          <p>{formatNum(bid.bidPrice)}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className='price-wrapper'
                                          onClick={() => window.open(`/profile/${bid.fromUser.address}`)}>
                                          <img src={bid.fromUser.profilePic} alt={''} />
                                          <p>{bid.fromUser.name}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className='date-wrapper'>
                                          <i className="icon-share-link"></i>
                                          <p>{format(bid.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Expand>
                    </li>
                  }

                  {
                    item.pairs && item.pairs.length > 0 &&
                    <li className={extendListing ? 'active' : ''}>
                      <div className='productinfo-title' onClick={() => setExtendListing(!extendListing)}>
                        <h6>Listing</h6>
                        <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendBidHistory ? 0 : 180}deg)` }} /></h6>
                      </div>
                      <Expand
                        open={extendListing}
                        duration={300}
                        styles={styles}
                        transitions={transitions}
                      >
                        <div className='productinfo-des bg-dark'>
                          <div className='activity-table-wrapper'>
                            <table className='activity-table'>
                              <thead>
                                <tr>
                                  <th>Price </th>
                                  <th>Quantity</th>
                                  <th>From</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  item?.pairs.map((pair, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className='price-wrapper'>
                                          <img src={getCurrencyInfoFromAddress(item.chainId, pair.tokenAdr).logoURI} alt={''} />
                                          <p>{formatNum(pair.price)}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <p>{pair.balance}</p>
                                      </td>
                                      <td>
                                        <div className='price-wrapper'
                                          onClick={() => window.open(`/profile/${pair.ownerUser.address}`)}>
                                          <img src={pair.ownerUser.profilePic} alt={''} />
                                          <p>{pair.ownerUser.name}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className='action-container'>
                                          {
                                            account && pair.ownerUser.address.toLowerCase() === account.toLocaleLowerCase() &&
                                            <div className='action'
                                              onClick={() => delistPairItem(pair)}>
                                              Unlist
                                            </div>
                                          }
                                          {
                                            account && pair.ownerUser.address.toLowerCase() !== account.toLocaleLowerCase() &&
                                            <div className='action'
                                              onClick={() => buyItem(pair)}>
                                              Buy
                                            </div>
                                          }
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Expand>
                    </li>
                  }
                  {
                    item.holders && item.type === 'multi' &&
                    <li className={extendOwners ? 'active' : ''}>
                      <div className='productinfo-title' onClick={() => setExtendOwners(!extendOwners)}>
                        <h6>Owners</h6>
                        <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendOwners ? 0 : 180}deg)` }} /></h6>
                      </div>
                      <Expand
                        open={extendOwners}
                        duration={300}
                        styles={styles}
                        transitions={transitions}
                      >
                        <div className='productinfo-des bg-dark'>
                          <div className='activity-table-wrapper'>
                            <table className='activity-table'>
                              <thead>
                                <tr>
                                  <th>Profile </th>
                                  <th>Address</th>
                                  <th>Quantity </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  item?.holders.map((holder, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className='price-wrapper'
                                          onClick={() => window.open(`/profile/${holder.user.address}`)}>
                                          <img src={holder.user.profilePic} alt={''} />
                                          <p>{holder.user.name}</p>
                                        </div>
                                      </td>
                                      <td>
                                        <p
                                          onClick={() => window.open(`${NetworkParams?.[chain_id]?.blockExplorerUrls[0]}/address/${holder.user.address}`)}>
                                          {shorter(holder.user.address)}
                                        </p>
                                      </td>
                                      <td>
                                        <p>{holder.balance}</p>
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Expand>
                    </li>
                  }

                  <li className={extendActivity ? 'active' : ''}>
                    <div className='productinfo-title' onClick={() => setExtendActivity(!extendActivity)}>
                      <h6>Activity</h6>
                      <h6><i className="fas fa-angle-down" style={{ transform: `rotate(${!extendActivity ? 0 : 180}deg)` }} /></h6>
                    </div>
                    <Expand
                      open={extendActivity}
                      duration={300}
                      styles={styles}
                      transitions={transitions}
                    >
                      <div className='productinfo-des bg-dark'>
                        {/* <div className='filter-bar'>
                          <select>
                            <option>ALL</option>
                            <option>Listing</option>
                            <option>Sales</option>
                            <option>Bids</option>
                            <option>Transfers</option>
                          </select>
                          <i className="icon-angle-white"></i>
                        </div> */}
                        {/* <div className='filter-content' style={{ display: 'none' }}>
                          <div className='filter-item'>Transfers<i className='icon-cross'></i></div>
                          <div className='filter-item'>Sales<i className='icon-cross'></i></div>
                          <a className='clear-input'>Clear All</a>
                        </div> */}
                        <div className='activity-table-wrapper'>
                          <table className='activity-table'>
                            <thead>
                              <tr>
                                <th>Event </th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>From </th>
                                <th>To</th>
                                <th>Date </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                item.events.map((event, index) => (
                                  <tr key={index}>
                                    <td>
                                      <p>{event.name}</p>
                                    </td>
                                    <td>
                                      <div className='price-wrapper'>
                                        {
                                          event.price > 0 &&
                                          <>
                                            <img src={getCurrencyInfoFromAddress(item.chainId, event.tokenAdr).logoURI} alt={''} />
                                            <p>{formatNum(event.price)}</p>
                                          </>
                                        }
                                      </div>
                                    </td>
                                    <td>
                                      <p>{event.amount}</p>
                                    </td>
                                    <td>
                                      <div className='price-wrapper'>
                                        {
                                          event.fromUser &&
                                          <>
                                            <img src={event.fromUser.profilePic} onClick={() => window.open(`/profile/${event.fromUser.address}`)} alt={''} />
                                            <p>{event.fromUser.name}</p>
                                          </>
                                        }
                                      </div>
                                    </td>
                                    <td>
                                      <div className='price-wrapper'>
                                        {
                                          event.toUser &&
                                          <>
                                            <img src={event.toUser.profilePic} onClick={() => window.open(`/profile/${event.toUser.address}`)} alt={''} />
                                            <p>{event.toUser.name}</p>
                                          </>
                                        }
                                      </div>
                                    </td>
                                    <td>
                                      <div className='date-wrapper'>
                                        <p>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              }

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Expand>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
            <div className='cards-wrapper'>
              <button onClick={() => setExtendMore(!extendMore)} className="expandBtn">
                More from this Collection <i className="fas fa-angle-down" style={{ transform: `rotate(${!extendMore ? 0 : 180}deg)` }}></i>
              </button>
              <Expand
                open={extendMore}
                duration={300}
                styles={styles}
                transitions={transitions}
              >
                <Masonry
                  breakpointCols={breakpoint}
                  className={'masonry'}
                  columnClassName={'gridColumn'}
                >
                  {item.more.map((moreItem, index) => (
                    <ItemCard key={index} {...props} item={moreItem} />
                  ))}
                </Masonry>
                <div className='more-content'>
                  <div className='view-collection' onClick={() => window.open(`/collection/${chain_id}/${collection}`)}>View Collection</div>
                </div>
              </Expand>
            </div>
          </div>
        </div>
      }
      <Footer />
      {
        item && item.auctionInfo && account && (Number(chain_id) === chainId) &&
        <ModalBid
          item={item}
          chain_id={Number(chain_id)}
          showPlaceBidModal={showPlaceBidModal}
          setShowPlaceBidModal={setShowPlaceBidModal}
        />
      }
      {
        item && pairItem && account && (Number(chain_id) === chainId) &&
        <ModalBuy
          item={item}
          chain_id={Number(chain_id)}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showBuyNowModal={showBuyNowModal}
          setShowBuyNowModal={setShowBuyNowModal}
        />
      }
      {
        item && pairItem && account && (Number(chain_id) === chainId) &&
        <ModalDelist
          item={item}
          chain_id={Number(chain_id)}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showUnlistMarketPlace={showUnlistMarketPlace}
          setShowUnlistMarketPlace={setShowUnlistMarketPlace}
        />
      }
      {
        item && item.auctionInfo && account && (Number(chain_id) === chainId) &&
        <ModalEndAuction
          item={item}
          chain_id={Number(chain_id)}
          showEndAuction={showEndAuction}
          setShowEndAuction={setShowEndAuction}
        />
      }
      {
        item && (holding > 0) && account && (Number(chain_id) === chainId) &&
        <ModalList
          item={item}
          chain_id={Number(chain_id)}
          holding={holding}
          showPutMarketPlace={showPutMarketPlace}
          setShowPutMarketPlace={setShowPutMarketPlace}
        />
      }
      {
        item && (holding > 0) && account && (Number(chain_id) === chainId) &&
        <ModalTransfer
          item={item}
          chain_id={Number(chain_id)}
          holding={holding}
          showSendNFTModal={showSendNFTModal}
          setShowSendNFTModal={setShowSendNFTModal}
        />
      }
    </>
  );
}

export default Detail;