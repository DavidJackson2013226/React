import React from 'react';
import { useHistory } from "react-router";

import './PopularItem.css'
import { formatNum, getCurrencyInfoFromAddress } from "../../utils";

const PopularItem = (props) => {
    const {item} = props;
    const history = useHistory();    

    const goToItemDetail = () => {
        history.push(`/detail/${item.chainId}/${item.itemCollection}/${item.tokenId}`);
    }
    return (
        <div className="search-item" onClick={goToItemDetail}>
            <img src={item.image} alt={item.name} />
            <div className="search-item-info">
                <h4>{item.name}</h4>
                {
                    item?.auctionInfo ? 
                        (item?.auctionInfo.bids && item?.auctionInfo.bids.length > 0)  ?                            
                            <p><span>Highest Bid</span> {formatNum(item?.auctionInfo.price)} {getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).symbol}</p>
                            :
                            <p><span>Minimum Bid</span> {formatNum(item?.auctionInfo.price)} {getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr).symbol}</p>                                             
                        :
                        item?.pairInfo ?                            
                            <p><span> {formatNum(item?.pairInfo.price)} {getCurrencyInfoFromAddress(item.chainId, item.pairInfo.tokenAdr).symbol} </span>({item?.supply} editions)</p>                                                       
                            :
                            <p><span>Not for sale</span> {item?.supply} editions </p>                                             
                                         
                }                
            </div>            
        </div>
    )
}

export default PopularItem
