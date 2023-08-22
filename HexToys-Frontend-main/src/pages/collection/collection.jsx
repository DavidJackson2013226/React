import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header from '../header/header';
import { Footer } from '../footer/footer';
import { useLoader } from '../../context/useLoader'
import "./collection.scss";
import clsx from 'clsx';
import ItemCard from "../../components/Cards/ItemCard";
import MySelect from '../../components/Widgets/MySelect';
import CheckBox from '../../components/Widgets/CheckBox';
import Expand from "react-expand-animated";
import Masonry from 'react-masonry-css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { formatNum } from "../../utils";
import { useWeb3React } from '@web3-react/core';
import InfiniteScroll from "react-infinite-scroll-component";

import DiscordIcon from "../../assets/images/icon-discord.png";
import FacebookIcon from "../../assets/images/icon-facebook.png";
import InstagramIcon from "../../assets/images/icon-instagram.png";
import EditIcon from "../../assets/images/icon-edit.png";

function Collection(props) {
  let { chain_id, collection } = useParams();
  const { account } = useWeb3React();

  const breakpoint = {
    default: 4,
    1840: 4,
    1440: 4,
    1280: 3,
    1080: 2,
    768: 2,
    450: 1,
  };
  const styles = {
    open: { width: "100%" },
    close: { width: "100%" }
  };
  const transitions = ["height", "opacity", "background"];


  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);

  const [extendStatus, setExtendStatus] = useState(false);
  const [checkedFixed, setCheckedFixed] = useState(false);
  const [checkedAuction, setCheckedAuction] = useState(false);
  const [checkednNot_sale, setCheckedNot_sale] = useState(false);


  const [saleStatus, setSaleStatus] = useState(''); // owned, sale, liked

  const [collectionInfo, setCollectionInfo] = useState(null);
  useEffect(() => {
    if (!collectionInfo) {
      axios.get(`${process.env.REACT_APP_API}/collection/detail?chainId=${chain_id}&address=${collection}`)
        .then(res => {
          setCollectionInfo(res.data.collection);
        })
        .catch(err => {
          setCollectionInfo(undefined);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain_id, collection])

  const [items, setItems] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { label: 'All items', value: '' },
    { label: 'Single items', value: 'single' },
    { label: 'Multiple items', value: 'multi' },
  ];
  const [type, setType] = useState("");

  const sortOptions = [
    { label: 'Recently Listed', value: 'timestamp' },
    { label: 'Price: low to high', value: 'price1' },
    { label: 'Price: high to low', value: 'price2' },
    { label: 'Most Favorited', value: 'likeCount' },
    { label: 'Name', value: 'name' },
  ];
  const [sortBy, setSortBy] = useState("timestamp");

  useEffect(() => {
    setItems([]);
    setNoItems(false)
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain_id, collection, searchTxt, saleStatus, sortBy, type])

  useEffect(() => {
    setLoading(true)
    if (initialItemsLoaded) {
      fetchItems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchItems(reset) {
    let paramData = {
      chainId: chain_id,
      itemCollection: collection,
      sortDir: 'desc'
    }

    if (sortBy) {
      paramData.sortBy = sortBy;
      if (sortBy === 'name') {
        paramData.sortDir = 'asc';
      }
    }
    if (searchTxt) {
      paramData.searchTxt = searchTxt
    }
    if (type) {
      paramData.type = type
    }
    if (saleStatus) {
      paramData.saleType = saleStatus
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

  function changeStatus(newStatus) {
    if (saleStatus === newStatus) {
      setSaleStatus('');
      setCheckedFixed(false);
      setCheckedAuction(false);
      setCheckedNot_sale(false);
    } else {
      setSaleStatus(newStatus);
    }
    if (newStatus === 'fixed') {
      setCheckedFixed(true);
      setCheckedAuction(false);
      setCheckedNot_sale(false);
    }
    if (newStatus === 'auction') {
      setCheckedFixed(false);
      setCheckedAuction(true);
      setCheckedNot_sale(false);
    }
    if (newStatus === 'not_sale') {
      setCheckedFixed(false);
      setCheckedAuction(false);
      setCheckedNot_sale(true);
    }
  }
  const [setPageLoading, setMessage] = useLoader()
  useEffect(() => {
    setMessage('')
    setPageLoading((!noItems && items.length === 0) || !collectionInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, collectionInfo, noItems])
  return (
    <>
      <Header {...props} />
      {
        collectionInfo &&
        <InfiniteScroll
          dataLength={items.length} //This is important field to render the next data
          next={loadMore}
          hasMore={!noItems}
          scrollThreshold={0.5}
        >
          <div className="collection">
            <div className="banner">
              <img src={collectionInfo?.coverImg} alt={''} onLoad={() => setIsBannerLoading(false)} />
              {isBannerLoading && <div className="img_cover"></div>}
              <div className="value_detail">
                <div className="flex">
                  <p><span>{formatNum(collectionInfo.summary.floorPrice / collectionInfo.summary.coinPrice)} PLS</span>(${formatNum(collectionInfo.summary.floorPrice)})</p>
                  <p><span>{formatNum(collectionInfo.summary.totalVolume / collectionInfo.summary.coinPrice)} PLS</span>(${formatNum(collectionInfo.summary.totalVolume)})</p>
                  <p>{collectionInfo.summary.itemCount}</p>
                  <p>{collectionInfo.summary.totalOwners}</p>
                </div>
                <div className="flex">
                  <h5>Floor</h5>
                  <h5>Voume</h5>
                  <h5>Items</h5>
                  <h5>Owners</h5>
                </div>
              </div>
            </div>

            <div className="profile_div">
              <div className="pic-detailwrap">
                <div className="propic-wrap">
                  <div className="propic-main">
                    <div className="avatar_div">
                      <img src={collectionInfo?.image} alt={''} onLoad={() => setIsAvatarLoading(false)} />
                      {isAvatarLoading && <div className="img_cover"></div>}
                    </div>
                    {
                      collectionInfo && collectionInfo.ownerUser && collectionInfo.ownerUser.address !== '0x0000000000000000000000000000000000000000' &&
                      <p className="owner">
                        Owner:
                        <span onClick={(e) => { window.open(`/profile/${collectionInfo?.ownerUser?.address}`) }}>
                          {collectionInfo?.ownerUser?.name}
                        </span>
                      </p>
                    }
                    <div className="social-link">
                      {
                        collectionInfo.discord &&
                        <a href={collectionInfo.discord} target="_blank" rel="noreferrer">
                          <img src={DiscordIcon} width='30' height='30' alt='' />
                        </a>
                      }
                      {
                        collectionInfo.facebook &&
                        <a href={collectionInfo.facebook} target="_blank" rel="noreferrer">
                          <img src={FacebookIcon} width='30' height='30' alt='' />
                        </a>
                      }
                      {
                        collectionInfo.instagram &&
                        <a href={collectionInfo.instagram} target="_blank" rel="noreferrer">
                          <img src={InstagramIcon} width='30' height='30' alt='' />
                        </a>
                      }
                      {
                        account && ((account.toLowerCase() === collectionInfo.ownerAddress) || collectionInfo.whitelist?.includes(account.toLowerCase())) &&
                        <a href={`/edit_collection/${chain_id}/${collection}`}>
                          <img src={EditIcon} width='30' height='30' alt='' />
                        </a>
                      }

                    </div>
                  </div>
                </div>
                <div className="collection-info">
                  <h2>{collectionInfo?.name}</h2>
                  <p className="desc">{collectionInfo?.description}</p>
                </div>
              </div>
            </div>
            <div className="container">
              {
                collectionInfo.isSynced ?
                  <div className="wrapper">
                    <div className="left">
                      <div className="left">
                        <button onClick={() => setExtendStatus(!extendStatus)} className="expandBtn">
                          Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!extendStatus ? 0 : 180}deg)` }}></i>
                        </button>
                        <Expand
                          open={extendStatus}
                          duration={300}
                          styles={styles}
                          transitions={transitions}
                        >
                          <div className="btn_list">
                            <CheckBox label='Buy Now' value={checkedFixed} onChange={() => changeStatus('fixed')} />
                            <CheckBox label='On Auction' value={checkedAuction} onChange={() => changeStatus('auction')} />
                            <CheckBox label='Not for Sale' value={checkednNot_sale} onChange={() => changeStatus('not_sale')} />
                          </div>
                        </Expand>
                      </div>
                    </div>
                    <div className="right">
                      <div className="filter_div">
                        <div className="search_div">
                          <button><i className="fas fa-search"></i></button>
                          <input type='text' placeholder="Search" onChange={e => setSearchTxt(e.target.value)} value={searchTxt} />
                        </div>
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


                      <Masonry
                        breakpointCols={breakpoint}
                        className={'masonry'}
                        columnClassName={'gridColumn'}
                      >
                        {items.map((item, index) => (
                          <ItemCard key={index} {...props} item={item} />
                        ))}
                      </Masonry>
                    </div>
                  </div>
                  :
                  <div className="loadingContainer">
                    <p>This collection is not synced yet.</p>
                    <p>Fetching previous transactions now...</p>
                    <CircularProgress style={{ width: "50px", height: "50px", color: "#f0f", marginTop: '20px' }} />
                  </div>
              }
            </div>
          </div>
        </InfiniteScroll>
      }
      <Footer />
    </>
  );

}

export default Collection;