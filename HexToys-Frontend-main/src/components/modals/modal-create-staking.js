/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import DatePicker from 'react-datepicker'
import { useWeb3React } from '@web3-react/core';
import toast from "react-hot-toast";
import axios from 'axios'
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Pagination } from '@windmill/react-ui';

import * as Element from "./style";
import { getTokenBalance, getStakingSubscriptions, getStakingAprs, createMultiNFTStaking, createSingleNFTStaking } from "../../utils/contracts";
import { Tokens, NetworkParams, getCurrencyInfoFromAddress, formatNum } from "../../utils";
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalCreateStaking(props) {
  const { showCreateStaking, setShowCreateStaking } = props;
  const { account, active, chainId, library } = useWeb3React();

  const [searchTxt, setSearchTxt] = useState("");
  const [collections, setCollections] = useState([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (chainId) {
      setCollections([]);
      setSelectedCollection(null);
      setPage(1);
      fetchCollections();
    } else {
      setCollections([]);
      setSelectedCollection(null);
      setPage(1);
    }
  }, [chainId, searchTxt])

  useEffect(() => {
    fetchCollections();
  }, [page])

  function fetchCollections() {
    let paramData = {
      limit: 10,
      page: page,
      chainId: chainId,
    };
    if (searchTxt) {
      paramData.search = searchTxt;
    }

    axios.get(`${process.env.REACT_APP_API}/search_collections`, {
      params: paramData
    })
      .then((res) => {
        if (res) {
          setCollectionCount(res.data.count);
          setCollections(res.data.collections);
        } else {
          setCollectionCount(0);
          setCollections([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setCollections([]);
      });
  }

  const [selectedCollection, setSelectedCollection] = useState(null);

  const [creatingStatus, setCreatingStatus] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [subscriptions, setSubscriptions] = useState([]);
  const [aprs, setAprs] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [aprIndex, setAprIndex] = useState(-1);

  const [currencyInfo, setCurrencyInfo] = useState(null);
  useEffect(() => {
    if (chainId) {
      setCurrencyInfo(getCurrencyInfoFromAddress(chainId, '0x0000000000000000000000000000000000000000'))
    }
  }, [chainId])

  const [stakeNftPrice, setStakeNftPrice] = useState(0);
  const [maxStakedNfts, setMaxStakedNfts] = useState(1);
  const [maxNftsPerUser, setMaxNftsPerUser] = useState(1);

  const [depositTokenAmount, setDepositTokenAmount] = useState(0);
  useEffect(() => {
    if (stakeNftPrice > 0 && maxStakedNfts > 0 && aprs && currentSubscription && aprIndex >= 0) {
      const amount = stakeNftPrice * maxStakedNfts * (aprs[aprIndex] / 1000.0) * (currentSubscription.period / 31104000.0);
      setDepositTokenAmount(amount)
    }
  }, [stakeNftPrice, maxStakedNfts, aprs, aprIndex, currentSubscription])

  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  useEffect(() => {
    if (account && library && chainId && currencyInfo) {
      getTokenBalance(account, currencyInfo.address, chainId, library)
        .then((value) => {
          setTokenBalance(value);
        })
        .catch(() => {
          setTokenBalance(0);
        })
    }
    return () => {
      setTokenBalance(0)
    }
  }, [account, chainId, library, currencyInfo])

  useEffect(() => {
    if (account && chainId && library) {
      library.getBalance(account)
        .then((value) => {
          var etherVal = parseFloat(ethers.utils.formatEther(value));
          setBalance(etherVal);
        })
        .catch(() => {
          setBalance(0);
        })
    }
    return () => {
      setBalance(0)
    }
  }, [account, chainId, library])

  useEffect(() => {
    if (selectedCollection) {
      getStakingSubscriptions(selectedCollection.type, selectedCollection.chainId, library.getSigner())
        .then((result) => {
          setSubscriptions(result)
          if (result?.length > 0) {
            setCurrentSubscription(result[0]);
          }
        })
        .catch(() => {
          setSubscriptions([])
        })
      getStakingAprs(selectedCollection.type, selectedCollection.chainId, library.getSigner())
        .then((result) => {
          setAprs(result)
          if (result?.length > 0) {
            setAprIndex(0);
          }
        })
        .catch(() => {
          setAprs([])
        })
    } else {
      setSubscriptions([]);
      setAprIndex(-1)
      setCurrentSubscription(null);
      setAprs([]);
    }
  }, [selectedCollection])

  function getPeriodFromTimestamp(timestamp) {
    let years = Math.floor(timestamp / 31536000);
    let months = Math.floor(timestamp / 2592000);
    let days = Math.floor(timestamp / 86400);
    if (years > 0) {
      return `${years} years`
    } else if (months > 0) {
      return `${months} months`
    } else if (days > 0) {
      return `${days} days`
    } else {
      return ''
    }
  }

  function createStaking() {
    if (!selectedCollection) {
      toast.error("Please select collection!");
      return;
    }

    if (chainId !== selectedCollection.chainId) {
      toast.error(`Please connect correct network (${NetworkParams?.[chainId]?.chainName})`);
      return;
    }
    if (!currencyInfo) {
      toast.error("Please select currency!");
      return;
    }

    if (creatingStatus) {
      return;
    }
    if (Number(stakeNftPrice) <= 0) {
      toast.error("invalid nft price!");
      return;
    }
    if (Number(maxStakedNfts) < 1) {
      toast.error("invalid maxStakedNfts!");
      return;
    }
    if (Number(maxNftsPerUser) < 1) {
      toast.error("invalid maxNftsPerUser!");
      return;
    }
    if (Number(maxStakedNfts) < Number(maxNftsPerUser)) {
      toast.error("maxStakedNfts must be bigger than maxNftsPerUser!");
      return;
    }
    if (Number(balance) < Number(currentSubscription.price)) {
      toast.error("Insufficient balance!");
      return;
    }
    if (currencyInfo.address === '0x0000000000000000000000000000000000000000') {
      if (balance < Number(currentSubscription.price) + Number(depositTokenAmount)) {
        toast.error("Insufficient balance!");
        return;
      }
    } else {
      if (Number(tokenBalance) < Number(depositTokenAmount)) {
        toast.error("Insufficient token balance!");
        return;
      }
    }
    const startTimeStamp = Math.floor(startDate.getTime() / 1000);
    setCreatingStatus(true);
    const load_toast_id = toast.loading("Please wait for create staking...");
    if (selectedCollection.type === 'multi') {
      createMultiNFTStaking(
        account,
        startTimeStamp,
        currentSubscription.id,
        Number(currentSubscription.price),
        aprIndex,
        selectedCollection.address,
        currencyInfo.address,
        stakeNftPrice,
        maxStakedNfts,
        depositTokenAmount,
        maxNftsPerUser,
        chainId,
        library.getSigner()
      ).then(async (result) => {
        toast.dismiss(load_toast_id);
        if (result) {
          setCreatingStatus(false);
          setShowCreateStaking(false);
          toast.success("Create Staking Success! Data will be synced after some block confirmation...");
          await sleep(2000);
          window.location.reload();
          return;
        } else {
          setCreatingStatus(false);
          toast.error("Failed Transaction!");
          return;
        }
      });

    } else if (selectedCollection.type === 'single') {
      createSingleNFTStaking(
        account,
        startTimeStamp,
        currentSubscription.id,
        Number(currentSubscription.price),
        aprIndex,
        selectedCollection.address,
        currencyInfo.address,
        stakeNftPrice,
        maxStakedNfts,
        depositTokenAmount,
        maxNftsPerUser,
        chainId,
        library.getSigner()
      ).then(async (result) => {
        toast.dismiss(load_toast_id);
        if (result) {
          setCreatingStatus(false);
          setShowCreateStaking(false);
          toast.success("Create Staking Success! Data will be synced after some block confirmation...");
          await sleep(2000);
          window.location.reload();
          return;
        } else {
          setCreatingStatus(false);
          toast.error("Failed Transaction!");
          return;
        }
      });
    }
  }

  function closeModal() {
    setShowCreateStaking(false);
    setSelectedCollection(null);
    setSearchTxt("");
  }

  return (
    <Modal
      isOpen={showCreateStaking}
      onRequestClose={() => closeModal()}
      ariaHideApp={false}
      style={{
        overlay: {
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0, .8)",
          overflowY: "auto",
          zIndex: 99,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '500px',
          maxHeight: '600px',
          borderRadius: '20px',
          backgroundColor: '#fff',
          zIndex: 9999
        },
      }}
    >
      {
        (account && chainId) ?
          <Element.ModalBody>
            <Element.ModalHeader>
              <Element.ModalCloseIcon size={32} onClick={() => closeModal()} />
            </Element.ModalHeader>
            <Element.StakingContainer>
              {/* select nft collection */}
              <div className="dialog-item">
                <div className="nft-container">
                  <h3>Select Collection</h3>
                  {
                    selectedCollection &&
                    <div className="nft-info"
                      onClick={() => window.open(`/collection/${selectedCollection.chainId}/${selectedCollection.address}`)}>
                      <img src={selectedCollection.image} alt="nftImg" />
                      <p>{selectedCollection.name}</p>
                    </div>
                  }
                </div>

                <input value={searchTxt}
                  onChange={(e) => { setSearchTxt(e.target.value) }}
                  placeholder="Search Collection Name" />

                <div className="choose-nft">
                  {
                    collections.map((collection, index) => (
                      <div className="nft-info" key={index}
                        onClick={() => {
                          setSelectedCollection(collection);
                        }}>
                        <img src={collection.image} alt="nftImg" />
                        <p>{collection.name}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
              {
                <Element.PaginationContainer>
                  {
                    collectionCount > 0 &&
                    <Pagination
                      className='pagination'
                      totalResults={collectionCount}
                      resultsPerPage={10}
                      onChange={(p) => {
                        setPage(p);
                      }}
                      label="Collections Navigation"
                    />
                  }
                </Element.PaginationContainer>
              }

              {/* select start time */}
              <div className="dialog-item">
                <div className="nft-container">
                  <h3>Start Time</h3>
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={value => setStartDate(value)}
                  className={"input-picker"}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>

              {/* select subscription */}
              {
                subscriptions &&
                <div className="dialog-item">
                  <div className="nft-container">
                    <h3>Select Subscription</h3>
                    {
                      currentSubscription &&
                      <div className="nft-info">
                        <p className="sub-detail">
                          ( Price: {currentSubscription.price} {NetworkParams?.[chainId]?.nativeCurrency.symbol}, Period: {getPeriodFromTimestamp(currentSubscription.period)})
                        </p>
                      </div>
                    }
                  </div>
                  <Element.StartingDateSelect onChange={event => {
                    const result = subscriptions.find((obj) => {
                      return obj.id === event.target.value;
                    });
                    setCurrentSubscription(result)
                  }}>
                    {
                      subscriptions.map((subscription, index) =>
                        <Element.OrderByOption key={index} value={subscription.id}>
                          {subscription.name}
                        </Element.OrderByOption>
                      )
                    }
                  </Element.StartingDateSelect>
                </div>
              }
              {/* select apr */}
              {
                aprs &&
                <div className="dialog-item">
                  <div className="nft-container">
                    <h3>Select Apr</h3>
                  </div>
                  <Element.StartingDateSelect
                    value={aprIndex}
                    onChange={event => setAprIndex(Number(event.target.value))}>
                    {
                      aprs.map((apr, index) =>
                        <Element.OrderByOption key={index} value={index}>
                          {apr / 10} %
                        </Element.OrderByOption>
                      )
                    }
                  </Element.StartingDateSelect>
                </div>
              }

              {/* nft price */}
              <div className="dialog-item">
                <div className="nft-container">
                  <h3>NFT Price</h3>
                </div>
                <Element.InputContainer>
                  <Element.Input type={"number"} placeholder={"Enter NFT Price"} value={stakeNftPrice} onChange={event => setStakeNftPrice(+event.target.value)} />
                  <Element.CurrencySelect name={"currencies"} defaultValue={currencyInfo?.address} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(chainId, event.target.value))}>
                    {
                      Tokens?.[chainId].map((currencyItem, index) =>
                        <Element.OrderByOption key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                      )
                    }
                  </Element.CurrencySelect>
                </Element.InputContainer>
              </div>

              <div className="dialog-item">
                <div className="nft-container">
                  <h3>Enter Max Staked Nfts</h3>
                </div>
                <input
                  type={'number'}
                  value={maxStakedNfts}
                  onChange={(e) => { setMaxStakedNfts(e.target.value) }}
                  placeholder="Enter max staked Nfts" />
              </div>

              <div className="dialog-item">
                <div className="nft-container">
                  <h3>Enter Max Nfts Per User</h3>
                </div>
                <input
                  type={'number'}
                  value={maxNftsPerUser}
                  onChange={(e) => { setMaxNftsPerUser(e.target.value) }}
                  placeholder="Enter Max Nfts Per User" />
              </div>

              <Element.ModalRow>
                <Element.ModalLabel>{NetworkParams?.[chainId]?.nativeCurrency.symbol} Balance : </Element.ModalLabel>
                <Element.ModalPrice>{formatNum(balance)}</Element.ModalPrice>
              </Element.ModalRow>
              {
                currencyInfo && currencyInfo.address !== '0x0000000000000000000000000000000000000000' &&
                <Element.ModalRow>
                  <Element.ModalLabel>{currencyInfo.symbol} Balance : </Element.ModalLabel>
                  <Element.ModalPrice>{formatNum(tokenBalance)}</Element.ModalPrice>
                </Element.ModalRow>
              }
              {
                currencyInfo && depositTokenAmount > 0 && currentSubscription &&
                <Element.ModalRow>
                  <Element.ModalLabel>You will pay </Element.ModalLabel>
                  <Element.ModalPrice>{currentSubscription.price} {NetworkParams?.[chainId]?.nativeCurrency.symbol} + {formatNum(depositTokenAmount)} {currencyInfo.symbol}</Element.ModalPrice>
                </Element.ModalRow>
              }
              

              <div className="dialog-item">
                <button className="confirm" onClick={createStaking} disabled={creatingStatus} htmltype="submit">
                  {
                    creatingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                      :
                      <> Confirm </>
                  }
                </button>
              </div>
            </Element.StakingContainer>
          </Element.ModalBody>
          :
          <></>
      }
    </Modal>
  );
};

export default ModalCreateStaking;
