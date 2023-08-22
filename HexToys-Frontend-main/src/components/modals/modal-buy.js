import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';

import { formatNum, getCurrencyInfoFromAddress } from "../../utils";
import {
    getTokenBalance,
    singleBuy,
    multipleBuy    
} from "../../utils/contracts";

import * as Element from "./style";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalBuy(props) {
    const { account, active, chainId, library } = useWeb3React();
    const { item, pairItem, setPairItem, showBuyNowModal, setShowBuyNowModal } = props;

    const [currencyInfo, setCurrencyInfo] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (item && pairItem) {
            setCurrencyInfo(getCurrencyInfoFromAddress(item.chainId, pairItem.tokenAdr));
        }
    }, [item])
    useEffect(() => {
        if (account && library && currencyInfo && chainId && (chainId === item.chainId)) {
            getTokenBalance(account, currencyInfo.address, item.chainId, library)
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

   
    const [buyQuantity, setBuyQuantity] = useState('1');
    const [buyingStatus, setBuyingStatus] = useState(false);

    async function buyNFTItem() {        
        if (balance < pairItem.price) {
            setShowBuyNowModal(false);
            toast.error("Your available balance is less than the price!");
            return;
        }
        if (((buyQuantity < 1) && (item?.type === 'multi')) || buyQuantity > pairItem.balance) {
            toast.error("Please input quantity correctly!");
            return;
        }

        setBuyingStatus(true);
        const load_toast_id = toast.loading("Please wait for buying nft...");    
        if (item.type === 'multi') {
            multipleBuy(
                account,
                pairItem.pairId,
                buyQuantity,
                currencyInfo.address,
                pairItem.price,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setBuyingStatus(false);
                    setShowBuyNowModal(false);
                    setPairItem(null);
                    toast.success("Buy Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return ;
                } else {
                    setBuyingStatus(false);
                    toast.error("Failed Transaction!");
                    return ;
                }
            });

        } else if (item?.type === 'single') {
            singleBuy(
                account,
                pairItem.pairId,
                currencyInfo.address,
                pairItem.price,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {                    
                    setBuyingStatus(false);
                    setShowBuyNowModal(false);
                    setPairItem(null);
                    toast.success("Buy Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return ;
                } else {
                    setBuyingStatus(false);
                    toast.error("Failed Transaction!");
                    return ;
                }
            });
        }
    }

    return (
        <>
            {
                item && pairItem && account && active && currencyInfo &&                
                <Modal
                    isOpen={showBuyNowModal}
                    onRequestClose={() => {
                        setShowBuyNowModal(false);
                        setPairItem(null);
                    }}
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
                            <Element.ModalCloseIcon size={32} onClick={() => {
                                setShowBuyNowModal(false);
                                setPairItem(null);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>
                            <Element.ModalLabel>Price : </Element.ModalLabel>
                            <Element.PayAmount>
                                <Element.CoinImage src={currencyInfo.logoURI} />
                                <Element.Price>{formatNum(pairItem.price)}</Element.Price>
                                <Element.Unit>{currencyInfo.symbol}</Element.Unit>
                                <Element.ModalLabel>for each</Element.ModalLabel>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        {item.type === 'multi' &&
                            <Element.Field>
                                <Element.Label>Enter quantity <span>({pairItem.balance} available)</span></Element.Label>
                                <Element.Input
                                    value={buyQuantity}
                                    type={"number"}
                                    onChange={(e) => { setBuyQuantity(Math.floor(e.target.value)) }}
                                    placeholder={"Enter quantity"} />
                            </Element.Field>
                        }
                        <Element.ModalRow>
                            <Element.ModalLabel>Your balance</Element.ModalLabel>
                            <Element.ModalPrice>{formatNum(balance)} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalRow>
                            <Element.ModalLabel>You will pay</Element.ModalLabel>
                            <Element.ModalPrice>{formatNum((pairItem.price * buyQuantity))} {currencyInfo.symbol}</Element.ModalPrice>
                        </Element.ModalRow>
                        <Element.ModalActions>
                            <Element.ModalCancelButton onClick={() => {
                                setShowBuyNowModal(false);
                                setPairItem(null)
                            }}>Cancel</Element.ModalCancelButton>
                            <Element.ModalSubmitButton disabled={buyingStatus} onClick={() => buyNFTItem()}>
                                {
                                    buyingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                            </Element.ModalSubmitButton>
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }            
        </>

    );
}

export default ModalBuy;