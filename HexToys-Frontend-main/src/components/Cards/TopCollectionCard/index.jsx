import { useState } from 'react';
import { formatNum } from "../../../utils";
import './TopCollectionCard.scss';
function TopCollectionCard(props) {
   const { collection } = props;
   const goToItemDetail = () => {
      window.open(`/collection/${collection.chainId}/${collection.address}`);
   };
   const [isLoading, setIsLoading] = useState(true);
   return (
      <div className='topCollectionCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={collection.image} className="item-image" alt='' onLoad={() => setIsLoading(false)} />
               {isLoading && <div className='img_cover'></div>}
            </div>
            <div className='nft-detail-content'>
               <p className='nft-title'>{collection.name}</p>
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <p className='sub-top'>Floor</p>
                     <p className='sub-bottom'>{formatNum(collection.floorPrice/collection.coinPrice)} PLS(${formatNum(collection.floorPrice)})</p>
                  </div>
                  <div className='sub-right'>
                     <p className='sub-top'>Volume</p>
                     <p className='sub-bottom'>{formatNum(collection.tradingVolume/collection.coinPrice)} PLS(${formatNum(collection.tradingVolume)})</p>
                  </div>                  

               </div>
            </div>
         </div>
      </div>

   );
}

export default TopCollectionCard;

