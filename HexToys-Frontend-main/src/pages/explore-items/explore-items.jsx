import React, { useState, useEffect } from "react";
import './explore-items.scss';
import { useLoader } from '../../context/useLoader'
import axios from 'axios';
import Header from '../header/header';
import { Footer } from '../footer/footer';
import clsx from 'clsx';
import ItemCard from "../../components/Cards/ItemCard";
import MySelect from '../../components/Widgets/MySelect';
import CheckBox from '../../components/Widgets/CheckBox';
import Expand from "react-expand-animated";
import Masonry from 'react-masonry-css';
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroll-component";

function ExploreItems(props) {
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

  const [collection, /*setCollection*/] = useState('');

  const [items, setItems] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  const [saleStatus, setSaleStatus] = useState('all'); // owned, sale, created, liked



  const [isExpandStatus, setIsExpandStatus] = useState(false);
  const [checkedFixed, setCheckedFixed] = useState(false);
  const [checkedAuction, setCheckedAuction] = useState(false);
  const [checkednNot_sale, setCheckedNot_sale] = useState(false);

  const networkOptions = [
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
    { label: 'Recently Listed', value: 'timestamp' },
    { label: 'Price: low to high', value: 'price1' },
    { label: 'Price: high to low', value: 'price2' },
    { label: 'Most Favorited', value: 'likeCount' },
    { label: 'Name', value: 'name' },
  ];
  const [sortBy, setSortBy] = useState("timestamp");

  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([]);
    setNoItems(false)
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, searchTxt, saleStatus, sortBy, type, chainId])

  useEffect(() => {
    setLoading(true)
    if (initialItemsLoaded) {
      fetchItems(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  function fetchItems(reset) {
    let paramData = {}
    if (chainId > 0) {
      paramData.chainId = chainId;
    }
    if (collection) {
      paramData.itemCollection = collection;
    }

    if (sortBy) {
      switch (sortBy) {
        case 'timestamp':
          paramData.sortBy = 'timestamp';
          paramData.sortDir = 'desc';
          break;
        case 'price1':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'asc';
          break;
        case 'price2':
          paramData.sortBy = 'usdPrice';
          paramData.sortDir = 'desc';
          break;
        case 'likeCount':
          paramData.sortBy = 'likeCount';
          paramData.sortDir = 'desc';
          break;
        case 'name':
          paramData.sortBy = 'name';
          paramData.sortDir = 'asc';
          break;

        default:
          break;
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
      setSaleStatus('all');
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
    setPageLoading(!noItems && items.length === 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, noItems])

  return (
    <>
      <Helmet>
        <title>HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain</title>
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" name="title" />
        <meta content="Explore and discover a wide range of unique digital items on HEX TOYS, the ultimate NFT marketplace on PulseChain. Find, buy, sell, and trade one-of-a-kind digital collectibles." name="description" />
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" name="twitter:title" />
        <meta content="https://marketplace.hex.toys/explore-items" name="twitter:url" />
        <meta content="HEX TOYS - Explore Items | The Ultimate NFT Marketplace on PulseChain" property="og:title" />
        <meta content="Explore and discover a wide range of unique digital items on HEX TOYS, the ultimate NFT marketplace on PulseChain. Find, buy, sell, and trade one-of-a-kind digital collectibles." property="og:description" />
        <meta content="https://marketplace.hex.toys/explore-items" property="og:url" />
        <meta content="HEX TOYS, NFT marketplace, PulseChain, explore items, digital items, digital collectibles" name="keywords" />
      </Helmet>

      <Header {...props} />

      <InfiniteScroll
        dataLength={items.length} //This is important field to render the next data
        next={loadMore}
        hasMore={!noItems}
        scrollThreshold={0.5}
      >
        <div className="explore-items">
          <div className="container">
            <div className="title">
              <h1>Explore Items</h1>
            </div>
            <div className="wrapper">
              <div className="left">
                <button onClick={() => setIsExpandStatus(!isExpandStatus)} className="expandBtn">
                  Status <i className="fas fa-angle-down" style={{ transform: `rotate(${!isExpandStatus ? 0 : 180}deg)` }}></i>
                </button>
                <Expand
                  open={isExpandStatus}
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

              <div className="right">
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
          </div>
        </div>
      </InfiniteScroll>
      <Footer />
    </>
  );

}

export default ExploreItems;