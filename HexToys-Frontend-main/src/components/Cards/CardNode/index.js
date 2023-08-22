import React from "react";
import { useHistory } from "react-router";
import * as Element from "./style";

const CardNode = (props) => {
  const { card, totalSupply } = props;
  const history = useHistory();
  const goToItemDetail = () => {
    history.push(`/detail/${card?.chainId}/${card?.collectionId}/${card?.tokenId}`);
  };

  return (
    <Element.Container>  
      <div className="card-preview" onClick={() => goToItemDetail()}>
      { 
        card?.itemInfo?.image && 
        <img className="card-img" src={card?.itemInfo?.image} alt="item logo"/> 
      }        
      </div>
      <div className="card-main-content">
        <div className="card-footer">
          <div className="card-content">
            <h2> {card?.itemInfo?.name} </h2>
            <h3> {card?.itemInfo?.collectionInfo?.name} </h3>      
          </div>          
        </div>
        <div className="card-node-header">
          <div className="card-node-heart">            
            <p>Probability : {parseFloat(card?.amount*100/totalSupply).toFixed(2)}%</p>
          </div>
          <p>{card?.amount} / {card?.itemInfo?.supply}</p>          
        </div>
      </div>      
    </Element.Container>
  );
};

export default CardNode;
