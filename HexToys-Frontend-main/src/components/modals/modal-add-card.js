/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';

import axios from 'axios';
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Element from "./style";
import { getNFTTokenBalance, addToken } from "../../utils/contracts";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalAddCard(props) {

  const { mysteryboxAddress, showAddCardModal, setShowAddCardModal } = props;
  const { account, active, chainId, library } = useWeb3React();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [noItems, setNoItems] = useState(false);
  const [initialItemsLoaded, setInitialItemsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");

  useEffect(() => {    
    setItems([]);
    setNoItems(false);
    setInitialItemsLoaded(false);
    setLoading(true);
    setPage(1);    
    fetchItems(true);   
  }, [account, chainId, searchTxt])

  useEffect(() => {
    setLoading(true)    
    if (initialItemsLoaded){
      fetchItems(false);
    }
  }, [page])

  function fetchItems(reset){   
    if (account && chainId) {
      let query=`${process.env.REACT_APP_API}/items?owner=${account}&chainId=${chainId}`
      let queryUrl = `${query}&page=${reset ? 1 : page}${searchTxt ? '&searchTxt=' + searchTxt : ''}`
      
      axios.get(queryUrl)
      .then(res => {
        setLoading(false)   
        if (res.data.items.length === 0) setNoItems(true);        
        if (reset){        
          setItems(res.data.items)
          setInitialItemsLoaded(true)
        }else{
          let prevArray = JSON.parse(JSON.stringify(items))
          prevArray.push(...res.data.items)
          setItems(prevArray)        
        }
        
      })
      .catch(err => {            
        setLoading(false)  
        if (err.response.data.message === 'No Items found') {
          setNoItems(true)    
        }      
      })
    } 
    
  }

  function loadMore() {
    if (!loading) {
      setPage(page => {return (page + 1)})  
    }      
  }

  const [selectedCard, setSelectedCard] = useState(null); 
  const [holdingBalance, setHoldingBalance] = useState(0);
  const [amount, setAmount] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if(account && active && library && chainId && selectedCard) {
        // get Card holding balance
        if (selectedCard.type === 'multi') {
          getNFTTokenBalance(account, selectedCard.itemCollection, selectedCard.tokenId, chainId, library)
          .then((balance) => {
            setHoldingBalance(Number(balance))
          })
          .catch(() => {
            setHoldingBalance(0);
          })    
        } else {
          setHoldingBalance(1);
        }        
    }
    return () => {
      setHoldingBalance(0);         
    }
  }, [account, active, chainId, library, selectedCard])


  const addCard = async () => {
    if (!selectedCard) {
      toast.error("Please Select Card NFT");      
      return;
    }
    if (holdingBalance < amount) {
      toast.error("Amount have to be smaller than your holding amount");   
      return;
    }
    if (amount < 1) {
      toast.error("Please input amount correctly"); 
      return;
    }
    
    setAdding(true);    
    var cardType = 0;
    if (selectedCard.type === 'multi') {
      cardType = 1;
    }  
    
    const load_toast_id = toast.loading("Please wait for adding nft...");    
    addToken(
      account,
      mysteryboxAddress,
      cardType,
      selectedCard.itemCollection,
      selectedCard.tokenId,
      amount,
      chainId,
      library.getSigner()
    ).then(async (result) => {
      toast.dismiss(load_toast_id);
      if (result) {
        toast.success("NFT Card is added! Data will be synced after some block confirmation..."); 
        setAdding(false);
        setSelectedCard(null);
        setHoldingBalance(0);
        setAmount(1);
        setSearchTxt("");  
        await sleep(2000);                   
        window.location.reload();
      } else {
        toast.error("Failed Transaction!");
        setAdding(false);                
      }
    });
    
  };

  function closeAddCardModal() {
    setShowAddCardModal(false);
    setSelectedCard(null);
    setHoldingBalance(0);
    setAmount(1);
    setSearchTxt("");     
  }
  
  return (
    <Modal
      isOpen={showAddCardModal}
      onRequestClose={() => closeAddCardModal()}
      ariaHideApp={false}
      style={{
        overlay: {
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0, .8)",
            overflowY: "auto",
            zIndex: 99,
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '500px',
            maxHeight: '600px',
            borderRadius: '20px',
            backgroundColor: '#fff',
            zIndex: 9999
        },
      }}
    >
      {
        account?
        <Element.ModalBody>
          <Element.ModalHeader>
            <Element.ModalCloseIcon size={32} onClick={() => closeAddCardModal()} />
          </Element.ModalHeader>
          <Element.MysteryBoxContainer>
            <div className="dialog-item">
              <div className="nft-container">
                <h3>Select Card</h3>
                {
                  selectedCard && 
                  <div className="nft-info">
                    <img src={selectedCard?.image} alt="nftImg"/>
                    <p>{selectedCard?.name}</p>
                  </div>
                }
                
              </div> 

              <input value={searchTxt} 
                onChange={(e) => { setSearchTxt(e.target.value) }} 
                placeholder="Search NFT Card" />

              <div className="choose-nft">
              {
                items.map((item, index) => (
                  <div className="nft-info" key={index} 
                    onClick={() => {
                      setHoldingBalance(0);
                      setAmount(1)                      
                      setSelectedCard(item);
                      setSearchTxt("");                               
                    }}>
                    <img src={item?.image} alt="nftImg"/>
                    <p>{item?.name}</p>
                  </div>
                ))
              }
              </div>
            </div>
            {
              selectedCard && (selectedCard.type === 'multi') &&
              (
                <div className="dialog-item"> 
                  <p>Available : {holdingBalance} quantites</p>             
                  <h3> Amount </h3>
                  <input value={amount} 
                    type="number"
                    onChange={(e) => { setAmount(Math.floor(e.target.value)) }} 
                    placeholder="Enter Amount" />                         
                </div>
              )
            }

            <div className="dialog-item">
              <button onClick={addCard} disabled={adding} htmltype="submit">              
                {
                    adding? <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
                    :
                    <> Add </>
                }
              </button>
            </div>
          </Element.MysteryBoxContainer>
        </Element.ModalBody>
          :
        <></>
      } 
    </Modal>    
  );
};

export default ModalAddCard;
