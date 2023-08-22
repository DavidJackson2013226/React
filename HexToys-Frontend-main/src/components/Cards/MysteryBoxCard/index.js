import React from "react";
import * as Element from "./style";
import { useHistory } from "react-router";

const MysteryBoxCard = (props) => {
  const { mysterybox } = props;

  const history = useHistory();
  
  const goToMysteryBoxDetail = () => {
    history.push(`/mysterybox/${mysterybox?.chainId}/${mysterybox?.address}`);
  };

  return (  
    <Element.Container onClick={() => goToMysteryBoxDetail()}>
      <div className="node-preview">
        <img className="node-img" src={mysterybox?.image} alt="mysterybox logo"/>       
      </div>
      <div className="node-main-content">
        <div className="node-footer">
          <div className="node-content">
            <h2>{mysterybox?.name}</h2>            
            <p>{mysterybox?.description}</p>         
          </div>          
        </div>         
        
      </div>  
    </Element.Container>  
    
  );
};

export default MysteryBoxCard;
