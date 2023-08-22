import {useState} from 'react';
import {getCurrencyInfoFromAddress, formatNum} from "../../../utils";
import './itemCard.scss';
function ItemCard(props) {
   const {item} = props;
   const goToItemDetail = () => {
      window.open(`/detail/${item.chainId}/${item.itemCollection}/${item.tokenId}`, "_self");      
   };
   const [isLoading, setIsLoading] = useState(true);
   return (
      <div className='itemCard'>         
         <div className='nft-pricing-box' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={item.image} className="item-image" alt='' onLoad={()=>setIsLoading(false)}/>
               {isLoading &&<div className='img_cover'></div>}
            </div>
            <div className='nft-box-content'>
               <div className='nft-box-top'>
                  <div className='name'>
                     <p className='sub-title'>{item.collectionInfo.name}</p>
                     <p className='nft-title'>{item.name}</p>
                     <p className='nft-code'>x {item.supply} editions</p>
                  </div>
                  {
                     item.auctionInfo && 
                     <div className='price'>
                        <p>Price</p>
                        <h5>
                           <img src={getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).logoURI} width='24' height='24' alt=''/>
                           {item.auctionInfo.price ? formatNum(item.auctionInfo.price) : formatNum(item.auctionInfo.startPrice)}
                        </h5>
                     </div>
                  }
                  {
                     item.pairInfo && 
                     <div className='price'>
                        <p>Price</p>
                        <h5>
                           <img src={getCurrencyInfoFromAddress(item.chainId, item.pairInfo.tokenAdr).logoURI} width='24' height='24' alt=''/>
                           {formatNum(item.pairInfo.price)}
                        </h5>
                     </div>
                  }

                  
               </div>
            </div>
         </div>        
      </div>
      
   );   
}

export default ItemCard;

