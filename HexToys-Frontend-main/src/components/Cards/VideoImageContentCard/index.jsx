import {useState} from 'react';
import './video_img_card.scss';

function VideoImageContentCard(props) {
   const {url, type} = props;   
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
   return (
      <div className='video_img_card'>
         {type === 'image' ? 
            <img src={url} className="image" alt='' onLoad={()=>setIsLoading(false)}/>:
            <video className="videoEmbed" autoPlay={true} loop muted={true} onLoadedData={()=>setIsLoading(false)} >
               <source src={url} type="video/mp4"/>
            </video>
         }
         {isLoading && <div className="img_cover"></div>}
      </div>
   );   
}

export default VideoImageContentCard;

