import React from 'react';
import './style.scss';
import { formatNum } from '../../utils';
export default function BannerScrolling(props) {
  const { items, setShow } = props;

  function getTimeAgo(timestamp) {
    const currentTimestamp = new Date().getTime()

    const distanceToDate = currentTimestamp - timestamp * 1000;
    let months = Math.floor(distanceToDate / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor((distanceToDate % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
    if (months > 0) {
      return `${months} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `${seconds} seconds ago`;
    }
 }

  return (
    <div className='scrolling_div'>
      <div className="scroll_view">
        <ul>
          {
            items.map((item, index) => (
              <li key={index}>{item.name} ({formatNum(Number(item.soldInfo.price))} {item.soldInfo.tokenInfo.symbol} - {getTimeAgo(item.soldInfo.timestamp)})</li>
            ))
          }
        </ul>
      </div>
      <button onClick={() => setShow(false)}><i className="fas fa-times"></i></button>
    </div>
  )

}
