import { useState } from 'react';
import { formatNum } from "../../../utils";
import './RecentNFTCard.scss';
function RecentNFTCard(props) {
   const { item } = props;
   const goToItemDetail = () => {
      window.open(`/detail/${item.chainId}/${item.itemCollection}/${item.tokenId}`, "_self");
   };
   const [isLoading, setIsLoading] = useState(true);

   function getTimeAgo(timestamp) {
      const currentTimestamp = new Date().getTime()
  
      const distanceToDate = currentTimestamp - timestamp * 1000;
      let months = Math.floor(distanceToDate / (1000 * 60 * 60 * 24 * 30));
      let days = Math.floor((distanceToDate % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
      if (months > 0) {
        return `${months}months ago`;
      } else if (days > 0) {
        return `${days}days ago`;
      } else if (hours > 0) {
        return `${hours}hours ago`;
      } else if (minutes > 0) {
        return `${minutes}mins ago`;
      } else if (seconds > 0) {
        return `${seconds}s ago`;
      }
   }

   return (
      <div className='recentNFTCard'>
         <div className='nft-content' onClick={goToItemDetail}>
            <div className='img_div'>
               <img src={item.image} className="item-image" alt='' onLoad={() => setIsLoading(false)} />
               {isLoading && <div className='img_cover'></div>}
            </div>
            <div className='nft-detail-content'>
               <p className='nft-title'>{item.name}</p>
               <div className='nft-price-content'>
                  <div className='sub-left'>
                     <p className='sub-top'>Sold for</p>
                     <p className='sub-bottom'>{formatNum(Number(item.soldInfo.price))} {item.soldInfo.tokenInfo.symbol}</p>
                  </div>
                  <div className='sub-right'>
                     <p className='sub-top'>Time</p>
                     <p className='sub-bottom'>{getTimeAgo(item.soldInfo.timestamp)}</p>
                  </div>                  

               </div>
            </div>
         </div>
      </div>

   );
}

export default RecentNFTCard;

