import React from 'react';
import './loader.scss';
export default function Loader(props) {
  const {isLoading, label} = props;
  return (
    <div className='loader-div'
    style={{
      opacity : isLoading ? 1 : 0,
      zIndex : isLoading ? 999 : -1,

    }}
    >
      <p>{label || 'Please wait ...'}</p>
      <div className="spinner-box" >
          <div className="three-quarter-spinner"></div>
      </div>
    </div>    
    
  )
  
}
