import { useState } from 'react';
import moment from 'moment';
import './blogCard.scss';
function BlogCard(props) {
   const { blog } = props;
   const goToBlogDetail = () => {
      window.open(`${blog.link}`);
   };
   const [isLoading, setIsLoading] = useState(true);
   const description = blog.description;
   const element_array = description.split('img');
   const link_array = element_array[1].split('"');
   const img_link = link_array[1];   

   return (
      <div className='blogCard'>
         <div className='card-content' onClick={goToBlogDetail}>
            <div className='img_div'>
               <img src={img_link} className="item-image" alt='' onLoad={() => setIsLoading(false)} />
               {isLoading && <div className='img_cover'></div>}
            </div>
            <div className='blog-detail-content'>
               <p className='blog-title'>{blog.title}</p>
               <p className='sub-bottom'>{blog.pubDate}</p>
               {/* <p className='sub-bottom'>{moment(1687187102 * 1000).format("MMM,DD,YYYY hh:mm a")}</p> */}
            </div>
         </div>
      </div>

   );
}

export default BlogCard;

