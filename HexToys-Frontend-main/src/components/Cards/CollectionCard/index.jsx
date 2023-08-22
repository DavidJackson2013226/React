import {useState} from 'react';
import './collectionCard.scss';

import profile from "../../../assets/images/profile.png";
function CollectionCard(props) {
   const {collection} = props;   
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
   return (
      <div className='collectionCard'>  
         <div className='nft-product-box' onClick={() => window.open(`/collection/${collection.chainId}/${collection.address}`)}>
            <div className='img_div'>
               <img src={collection.coverImg} className="item-image" alt='' onLoad={()=>setIsLoading(false)}/>
               {isLoading &&<div className='img_cover'></div>}
            </div>
            
            <div className='profilepic'>
               <div className='avatar_div'>
                  <img src={collection.image} alt='' onLoad={()=>setIsLoadingAvatar(false)}/>
                  {isLoadingAvatar && <img src={profile} alt='' className='img_cover'/>}
               </div>
               
            </div>
            <div className='nft-box-content'>
               <div className='name'>
                  <p className='nft-title'>{collection.name}</p>
                  <p className='subtitle'>by <span>{collection.ownerUser.name}</span></p>
               </div>
               <p className='desc'>{collection.description}</p>
            </div>
         </div>
      </div>
   );   
}

export default CollectionCard;

