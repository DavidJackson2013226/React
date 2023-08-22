import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Header from '../header/header';
import { Footer } from '../footer/footer';
import "./home.scss";
import { useLoader } from '../../context/useLoader';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { getMintingInfo, toEth, claimNFT } from '../../utils/contracts';
import { NetworkParams, formatNum } from '../../utils';



import TopNFTCard from '../../components/Cards/TopNFTCard';
import VideoImageContentCard from '../../components/Cards/VideoImageContentCard';
import TopCollectionCard from '../../components/Cards/TopCollectionCard';
import RecentNFTCard from '../../components/Cards/RecentNFTCard';
import Timer from '../../components/timer/Timer';
import BlogCard from "../../components/Cards/BlogCard";
import CollectionTable from '../../components/CollectionTable/CollectionTable';

import telegram from "../../assets/images/telegram.svg";
import twitter from "../../assets/images/twitter.png";
import hextoysloadingLogo from "../../assets/images/hextoysloading.gif";
import god_background from "../../assets/images/god_background.gif";


import mintLogo from '../../assets/images/mint-logo.gif';
import BannerScrolling from '../../components/BannerScrolling/BannerScrolling';
import Carousel from "react-spring-3d-carousel";

const sleep = (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms));
}


function Home(props) {
   const { connectAccount } = props;

   const { account, active, chainId, library } = useWeb3React();

   var settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 1280,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 1080,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   var banner_settings = {
      infinite: false,
      dots: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 1280,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 1080,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   var bolg_settings = {
      infinite: false,
      dots: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
         {
            breakpoint: 1280,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 1080,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };

   //--------NFT Minting--------------
   const [showMint, setShowMint] = useState(false)
   const [mintCount, setMintCount] = useState(1);
   const [mintInfo, setMintInfo] = useState(null);

   useEffect(() => {
      getMintingInfo(NetworkParams.defaultChainID, null)
         .then((result) => {
            console.log('mintinfo:', result);
            setMintInfo(result);
         })
         .catch(error => {
            console.log('mintinfo error:', error);
            setMintInfo(null);
         })
   }, [])

   const decreaseHandle = () => {
      if (mintCount > 0) {
         setMintCount(mintCount - 1)
      }
   }
   const increaseHandle = () => {
      setMintCount(mintCount + 1);
   }
   const mintTokens = async () => {
      if (account && chainId && library) {
         const load_toast_id = toast.loading("Please wait for minting nft...");
         claimNFT(
            account,
            mintInfo,
            mintCount,
            chainId,
            library.getSigner()
         ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
               toast.success("NFT Minting success!");
               await sleep(2000);
               window.location.reload();
            } else {
               toast.error("Failed Transaction!");
               return;
            }
         });
      }
   };

   //--------Featured Collection-----
   const [featuredCollections, setFeaturedCollections] = useState([]);


   //--------Banner Scroll----
   const [showScroll, setShowScroll] = useState(true);


   //-------------- Blog ----------------
   const [blogs, setBlogs] = useState([]);
   useEffect(() => {
      axios.get(`${process.env.REACT_APP_API}/articles`)
         .then(res => {
            console.log(res.data.items);
            setBlogs(res.data.items)
         })
         .catch(err => {
            setBlogs([]);
         })
   }, [])



   const [topNFTs, setTopNFTs] = useState([]);
   const [topNFTsCards, setTopNFTsCards] = useState([]);
   const [topCollections, setTopCollections] = useState([]);
   const [topCollectionCards, setTopCollectionCards] = useState([]);
   const [recentNFTs, setRecentNFTs] = useState([]);
   const [recentNFTCards, setRecentNFTCards] = useState([]);
   const [topNFTSlideIndex, setTopNFTSlideIndex] = useState(0);
   const [topCollectionSlideIndex, setTopCollectionSlideIndex] = useState(0);
   const [recentNFTSlideIndex, setRecentNFTSlideIndex] = useState(0);

   useEffect(() => {
      axios.get(`${process.env.REACT_APP_API}/featured_collections`)
         .then(res => {
            setFeaturedCollections(res.data.collections);
         })
         .catch(err => {
            setFeaturedCollections([]);
         })
      axios.get(`${process.env.REACT_APP_API}/top_nfts`)
         .then(res => {
            setTopNFTs(res.data.items);
            let items = res.data.items;
            let results = [];
            for (let i = 0; i < items.length; i++) {
               results.push({
                  key: i,
                  content: <TopNFTCard key={i} item={items[i]} />
               })
            }
            setTopNFTsCards(results);
         })
         .catch(err => {
            setTopNFTs([]);
            setTopNFTsCards([]);
         })
      axios.get(`${process.env.REACT_APP_API}/top_collections`)
         .then(res => {
            setTopCollections(res.data.collections);
            let items = res.data.collections;
            let results = [];
            for (let i = 0; i < items.length; i++) {
               results.push({
                  key: i,
                  content: <TopCollectionCard key={i} collection={items[i]} />
               })
            }
            setTopCollectionCards(results);
         })
         .catch(err => {
            setTopCollections([]);
            setTopCollectionCards([]);
         })
      axios.get(`${process.env.REACT_APP_API}/recently_sold`)
         .then(res => {
            setRecentNFTs(res.data.items);
            let items = res.data.items;
            let results = [];
            for (let i = 0; i < items.length; i++) {
               results.push({
                  key: i,
                  content: <RecentNFTCard key={i} item={items[i]} />
               })
            }
            setRecentNFTCards(results);
         })
         .catch(err => {
            setRecentNFTs([]);
            setRecentNFTCards([]);
         })
   }, [])

   const [setPageLoading, setMessage] = useLoader();
   setMessage('');
   setPageLoading(false);

   const goToNextTopNFT = () => {
      let newIndex = topNFTSlideIndex + 1;
      setTopNFTSlideIndex(newIndex);
   }

   const goToPrevTopNFT = () => {
      let newIndex = topNFTSlideIndex - 1;
      setTopNFTSlideIndex(newIndex);
   }

   const goToNextTopCollection = () => {
      let newIndex = topCollectionSlideIndex + 1;
      setTopCollectionSlideIndex(newIndex);
   }

   const goToPrevTopCollection = () => {
      let newIndex = topCollectionSlideIndex - 1;
      setTopCollectionSlideIndex(newIndex);
   }

   const goToNextRecentNFT = () => {
      let newIndex = recentNFTSlideIndex + 1;
      setRecentNFTSlideIndex(newIndex);
   }

   const goToPrevRecentNFT = () => {
      let newIndex = recentNFTSlideIndex - 1;
      setRecentNFTSlideIndex(newIndex);
   }


   return (
      <>
         <Helmet>
            <title>HEX TOYS - The Ultimate NFT Marketplace on PulseChain</title>
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="title" />
            <meta content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles." name="description" />
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" name="twitter:title" />
            <meta content="https://marketplace.hex.toys" name="twitter:url" />
            <meta content="HEX TOYS - The Ultimate NFT Marketplace on PulseChain" property="og:title" />
            <meta content="HEX TOYS is the ultimate NFT marketplace on PulseChain, offering generous rewards. Buy, sell, and trade unique digital collectibles." property="og:description" />
            <meta content="https://marketplace.hex.toys" property="og:url" />
            <meta content="HEX TOYS, NFT marketplace, PulseChain, digital collectibles, buy NFTs, sell NFTs" name="keywords" />
         </Helmet>
         <Header {...props} />
         <div className='top-home'>
            {
               showScroll && recentNFTs && recentNFTs.length > 0 &&
               <BannerScrolling items={recentNFTs} setShow={setShowScroll} />
            }
            <div className='banner'>
               <Slider {...banner_settings}>
                  <div className='banner-container'>
                     <div className='background-container'>
                        <img src={god_background} alt='' />
                     </div>
                     <div className='flex'>
                        <div className='left-con'>
                           <VideoImageContentCard url={mintLogo} type='image' />
                        </div>
                        <div className='right-con'>
                           <div className='subtitle'>
                              <img src={hextoysloadingLogo} width='20' height='20' alt='' />
                              <p>MINTING NOW</p>
                           </div>

                           <h1>THE GOD WHALE</h1>
                           <p className='desc'>To commemorate the highly anticipated launch of PulseChain, we are delighted to extend an exclusive opportunity to our esteemed community of existing NFT collectors and loyal store customers. As a token of our gratitude, you can now claim The God Whale, an extraordinary NFT.</p>
                           {
                              mintInfo &&
                              <div className="mintCount">
                                 <div className="mint_dec_inc">
                                    <button
                                       className="mintIncDec"
                                       disabled={mintCount === 1}
                                       onClick={decreaseHandle}
                                    >
                                       <i className="fas fa-minus"></i>
                                    </button>
                                    <span className="mintCountValue">{mintCount}</span>
                                    <button
                                       className="mintIncDec"
                                       disabled={false}
                                       onClick={increaseHandle}
                                    >
                                       <i className="fas fa-plus"></i>
                                    </button>
                                 </div>
                                 {
                                    account ?
                                       <button
                                          className="mintNow"
                                          onClick={() => mintTokens()}
                                          disabled={false}
                                       >Mint({formatNum(Number(toEth(mintInfo.activeCondition.pricePerToken, 18)) * mintCount)} PLS)
                                       </button>
                                       :
                                       <button
                                          className="mintNow"
                                          onClick={() => connectAccount()}
                                          disabled={false}
                                       >Connect Wallet
                                       </button>
                                 }

                              </div>
                           }
                           {
                              mintInfo &&
                              <div className="state">
                                 <p className='desc'>▪ {mintInfo.totalSupply} / {mintInfo.totalSupply + Number(mintInfo.activeCondition.maxClaimableSupply) - Number(mintInfo.activeCondition.supplyClaimed)} minted
                                    {/* ▪ <Timer deadLine={1687235039}/> left */}
                                 </p>
                              </div>
                           }
                        </div>
                     </div>
                  </div>

                  {
                     featuredCollections && featuredCollections.length > 0 &&
                     featuredCollections.map((featuredCollection, index) => (
                        <div className='banner-container'>
                           <div className='flex'>
                              <div className='left-con'>
                                 <VideoImageContentCard url={featuredCollection.image} type='image' />
                              </div>
                              <div className='right-con'>
                                 <h1>{featuredCollection.name}</h1>
                                 <p className='subtitle'>{featuredCollection.description} </p>
                                 <div className='headbtn'>
                                    <a href={`/collection/369/${featuredCollection.address}`} className='orgbtn' target="_blank" rel="noreferrer">
                                       View Collection
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))
                  }
               </Slider>
            </div>
         </div>
         <div className="home">
            <CollectionTable />
         </div>

         <div className='home'>
            <div className='container'>
               <h2>Top Selling NFTs</h2>
               <div className="carousel-container">
                  <div className='wrapper carousel-wrapper'>
                     {
                        topNFTs && topNFTs.length > 0 && <Carousel slides={topNFTsCards} showNavigation={false} goToSlide={topNFTSlideIndex} />
                     }
                  </div>
                  {
                     topNFTs && topNFTs.length > 0 && (
                        <div className="carousel-buttons">
                           <button type="button" data-role="none" className="slide-prev" onClick={goToPrevTopNFT}> Previous</button>
                           <button type="button" data-role="none" className="slide-next" onClick={goToNextTopNFT}> Next</button>
                        </div>
                     )
                  }
               </div>

               <h2>Top Selling Collections</h2>
               <div className="carousel-container">
                  <div className='wrapper carousel-wrapper'>
                     {
                        topCollections && topCollections.length > 0 && <Carousel slides={topCollectionCards} showNavigation={false} goToSlide={topCollectionSlideIndex} />
                     }
                  </div>
                  {
                     topCollections && topCollections.length > 0 && (
                        <div className="carousel-buttons">
                           <button type="button" data-role="none" className="slide-prev" onClick={goToPrevTopCollection}> Previous</button>
                           <button type="button" data-role="none" className="slide-next" onClick={goToNextTopCollection}> Next</button>
                        </div>
                     )
                  }
               </div>

               <h2>Most Recently Sold</h2>
               <div className="carousel-container">
                  <div className='wrapper carousel-wrapper'>
                     {
                        recentNFTs && recentNFTs.length > 0 && <Carousel slides={recentNFTCards} showNavigation={false} goToSlide={recentNFTSlideIndex} />
                     }
                  </div>
                  {
                     recentNFTs && recentNFTs.length > 0 && (
                        <div className="carousel-buttons">
                           <button type="button" data-role="none" className="slide-prev" onClick={goToPrevRecentNFT}> Previous</button>
                           <button type="button" data-role="none" className="slide-next" onClick={goToNextRecentNFT}> Next</button>
                        </div>
                     )
                  }
               </div>
            </div>

         </div>

         <div className="home">
            <div className='container'>
               <h2>Blog Articles</h2>
               <div className='blog_div'>
                  {
                     blogs && blogs.length > 0 &&
                     <Slider {...bolg_settings}>
                        {blogs.map((blog, index) => (
                           <BlogCard key={index}
                              blog={blog}
                           />
                        ))}
                     </Slider>
                  }
               </div>
            </div>
         </div>

         <div className='community'>
            <div className='container'>
               <p>Recently Verified Collections</p>
               <div className='social-btn'>
                  <a href="https://t.me/hextoys" target="_blank" rel="noreferrer"> Telegram <span> <img src={telegram} width='30' height='24' alt='' /></span> </a>
                  <a href="https://twitter.com/HEXTOYSOFFICIAL" target="_blank" rel="noreferrer"> Twitter<span> <img src={twitter} width='30' height='24' alt='' /></span>   </a>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
}

export default Home;

