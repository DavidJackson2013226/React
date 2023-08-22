import { useState } from 'react';
import { formatNum } from "../../../utils";
import './TopNFTCard.scss';
function TopNFTCard(props) {
   const { item } = props;
   const goToItemDetail = () => {
      window.open(`/detail/${item.chainId}/${item.itemCollection}/${item.tokenId}`, "_self");
   };
   const [isLoading, setIsLoading] = useState(true);
   return (
      <div className='topNFTCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={item.image} className="item-image" alt='' onLoad={() => setIsLoading(false)} />
               {isLoading && <div className='img_cover'></div>}
            </div>
            <div className='nft-detail-content'>
               <p className='nft-title'>{item.name}</p>
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <p className='sub-top'>Floor</p>
                     <p className='sub-bottom'>{formatNum(Number(item.tradingVolume)/(Number(item.tradingCount) * Number(item.coinPrice)))} PLS(${formatNum(Number(item.tradingVolume)/Number(item.tradingCount))})</p>
                  </div>
                  <div className='sub-right'>
                     <p className='sub-top'>Volume</p>
                     <p className='sub-bottom'>{formatNum(item.tradingVolume/Number(item.coinPrice))} PLS(${formatNum(item.tradingVolume)})</p>
                  </div>                  

               </div>
            </div>
         </div>
      </div>

   );
}

export default TopNFTCard;

