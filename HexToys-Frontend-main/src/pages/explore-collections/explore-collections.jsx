import React , {useState,useEffect} from 'react';
import axios from 'axios';
import Header from '../header/header';
import { Footer } from '../footer/footer';
import './explore_collection.scss';
import { useLoader } from '../../context/useLoader'
import { Helmet } from "react-helmet";


import Masonry from 'react-masonry-css';
import CollectionCard from "../../components/Cards/CollectionCard";
import InfiniteScroll from "react-infinite-scroll-component";

function ExploreCollections(props){ 
    const breakpoint = {
        default: 3,
        1840: 3,
        1440: 3,
        1280: 3,
        1080: 2,
        768: 1,
        450: 1,
      };   
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    function fetchCategories() {        
        axios.get(`${process.env.REACT_APP_API}/categories`)
        .then((res) => {            
            setCategories(res.data.categories);                            
        })
        .catch((err) => {
            console.log("err: ", err.message);
            setCategories([]);
        });
    }

    const [collections, setCollectioins] = useState([]);     

    const [page, setPage] = useState(1);
    const [noCollectioins, setNoCollectioins] = useState(false);
    const [initialCollectioinsLoaded, setInitialCollectioinsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {    
        setCollectioins([]);
        setNoCollectioins(false)
        setInitialCollectioinsLoaded(false);
        setLoading(true);
        setPage(1);
        fetchCollectioins(true); 
        // eslint-disable-next-line react-hooks/exhaustive-deps   		   
    }, [category])

    useEffect(() => {
        setLoading(true)    
        if (initialCollectioinsLoaded) {
          fetchCollectioins(false);  	   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    function fetchCollectioins(reset) {
        let paramData = {};  
        if (category) {
          paramData.category = category;            
        } 
        if (reset) {
          paramData.page = 1 ;            
        } else {
          paramData.page = page ;
        }
        
        axios.get(`${process.env.REACT_APP_API}/collection`, {
          params: paramData
        })
        .then(res => {            
          setLoading(false) 
          if (res.data.collections.length === 0) setNoCollectioins(true)      
          if (reset){        
              setCollectioins(res.data.collections)
              setInitialCollectioinsLoaded(true)
          }else{
              let prevArray = JSON.parse(JSON.stringify(collections))
              prevArray.push(...res.data.collections)
              setCollectioins(prevArray)        
          }           
        })
        .catch(err => {            
          setLoading(false)  
          console.log(err)  
          setNoCollectioins(true)      
        })
    }
    
    function loadMore() {
        if (!loading) {
          setPage(page => {return (page + 1)}) 
        }      
    }
   const [setPageLoading, setMessage] = useLoader()
    useEffect(() => {
        setMessage('')
        setPageLoading(!noCollectioins && collections.length === 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collections, noCollectioins])

    return (
        <>
            <Helmet>
                <title>HEX TOYS - Collections | NFT Marketplace on PulseChain</title>
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" name="title"/>
                <meta content="Explore the diverse collections of unique digital collectibles on HEX TOYS. Buy, sell, and trade NFTs from various creators." name="description"/>
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" name="twitter:title"/>
                <meta content="https://marketplace.hex.toys/explore-collections" name="twitter:url"/>
                <meta content="HEX TOYS - Collections | NFT Marketplace on PulseChain" property="og:title"/>
                <meta content="Explore the diverse collections of unique digital collectibles on HEX TOYS. Buy, sell, and trade NFTs from various creators." property="og:description"/>
                <meta content="https://marketplace.hex.toys/explore-collections" property="og:url"/>
                <meta name="keywords" content="HEX TOYS, Collections, NFT marketplace, PulseChain, buy NFTs, sell NFTs, digital collectibles"/>                
            </Helmet>

            <Header {...props}/>
            <div className='explore_collection'>
                <div className='container'>
                    <div className='title'>
                        <h1>Explore Collections</h1>
                    </div>
                    <div className="tab_list">
                        <div className={category === '' ? 'tab active' : 'tab'} onClick={() => setCategory('')}>
                        All
                        </div>

                        {categories.map((categoryItem, index)=> {                             
                            return (
                                <div key={index} className={category === categoryItem.name ? 'tab active' : 'tab'} onClick={() => setCategory(categoryItem.name)}>
                                    {categoryItem.name}
                                </div>                                       
                                );
                            })
                        }    
                    </div>
                    <div className="tab_content">
                        <InfiniteScroll
                            dataLength={collections.length} //This is important field to render the next data
                            next={loadMore}
                            hasMore={!noCollectioins}
                            scrollThreshold={0.7}
                        >
                            <Masonry
                                breakpointCols={breakpoint}
                                className={'masonry'}
                                columnClassName={'gridColumn'}
                                >
                                {collections.map((collectionItem, index)=>(
                                    <CollectionCard key={index} {...props} collection={collectionItem}/>
                                ))}
                            </Masonry>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
           
            <Footer/>
        </>
    );
    
}

export default ExploreCollections;
