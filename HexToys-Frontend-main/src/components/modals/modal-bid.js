import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';

import { formatNum, getCurrencyInfoFromAddress } from "../../utils";
import {
    getTokenBalance,
    bidOnAuction
} from "../../utils/contracts";

import * as Element from "./style";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalBid(props) {
    const { account, active, chainId, library } = useWeb3React();
    const { item, chain_id, showPlaceBidModal, setShowPlaceBidModal } = props;

    const [currencyInfo, setCurrencyInfo] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (item && item.auctionInfo) {
            setCurrencyInfo(getCurrencyInfoFromAddress(item.chainId, item.auctionInfo.tokenAdr));
        }
    }, [item])
    useEffect(() => {
        if (account && library && currencyInfo && chainId && (chainId === Number(chain_id))) {
            getTokenBalance(account, currencyInfo.address, chain_id, library)
                .then((balance) => {
                    setBalance(balance)
                })
                .catch(() => {
                    setBalance(0)
                })
        }
        return () => {
            setBalance(0)
        }
    }, [account, chainId, library, active, currencyInfo])

    const [bidPrice, setBidPrice] = useState(0);
    const [biddingStatus, setBiddingStatus] = useState(false);
    function closePlaceBidModal() {
        setShowPlaceBidModal(false);
        setBidPrice(0);
    }

    async function placeBid() {
        if (bidPrice < item.auctionInfo.price) {
            toast.error("Your bid must be higher than minimum bid price!");
            return;
        }

        if ((item.auctionInfo.bids?.length > 0) && (bidPrice - item.auctionInfo.price * 1.05 <= 0)) {
            toast.error("Your bid must be 5% higher than current bid!");
            return;
        }

        if (balance - bidPrice < 0) {
            toast.error("Your available balance is less than the bid price!");
            return;
        }

        setBiddingStatus(true);
        const load_toast_id = toast.loading("Please wait for bidding...");    
        bidOnAuction(
            account,
            item.auctionInfo.auctionId,
            currencyInfo.address,
            bidPrice,
            chainId,
            library.getSigner()
        ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
                setBiddingStatus(false);
                closePlaceBidModal();
                toast.success("Bid Success! Data will be synced after some block confirmation...");
                sleep(2000);
                window.location.reload();
                return ;
            } else {
                setBiddingStatus(false);
                toast.error("Failed Transaction!");
                return ;
            }
        });

    }

    return (
        <>
            {
                item && item.auctionInfo && account && active && currencyInfo &&                
                <Modal
                    isOpen={showPlaceBidModal}
                    onRequestClose={() => closePlaceBidModal()}
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
                    <Element.ModalBody>
                        <Element.ModalHeader>
                            <Element.ModalCloseIcon size={32} onClick={() => closePlaceBidModal()} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>Your Bid</Element.ModalTitle>
                        <Element.ModalRow>
                            <Element.ModalLabel>Current bid</Element.ModalLabel>
                            <Element.ModalPrice>{formatNum(item.auctionInfo.price)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.BidPrice>
                            <Element.ModalLabel>Your bid</Element.ModalLabel>
                            <Element.ModalMainPrice type={"number"} value={bidPrice} onChange={event => setBidPrice(event.target.value)} />
                            <Element.UnitContainer>
                                <Element.CoinImage src={currencyInfo.logoURI} />
                                <Element.Unit>{currencyInfo.symbol}</Element.Unit>
                            </Element.UnitContainer>
                        </Element.BidPrice>
                        <Element.ModalRow>
                            <Element.ModalLabel>Available</Element.ModalLabel>
                            <Element.ModalPrice>{formatNum(balance)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalAction>
                            <Element.ModalButton disabled={biddingStatus} onClick={() => placeBid()}>
                                {
                                    biddingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Place a Bid"
                                }
                            </Element.ModalButton>
                        </Element.ModalAction>
                    </Element.ModalBody>
                </Modal>
            }            
        </>

    );
}

export default ModalBid;