import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';

import DatePicker from 'react-datepicker'

import {  getCurrencyInfoFromAddress, Tokens } from "../../utils";
import {
    listSingleItem,
    listMultiItem,
    createAuction
} from "../../utils/contracts";

import * as Element from "./style";
import "react-datepicker/dist/react-datepicker.css";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalList(props) {
    const { account, chainId, library } = useWeb3React();
    const { item, chain_id, holding, showPutMarketPlace, setShowPutMarketPlace } = props;

    const [listingStatus, setListingStatus] = useState(false);
    const [creatingAuctionStatus, setCreatingAuctionStatus] = useState(false);

    const [putType, setPutType] = useState('fixed');
    const [putPrice, setPutPrice] = useState(0);
    const [quantity, setQuantity] = useState('1');
    const [currencyInfo, setCurrencyInfo] = useState(Tokens?.[chain_id][0]);

    const [startType, setStartType] = useState('now');
    const [startDate, setStartDate] = useState(null);
    const [endType, setEndType] = useState('1');
    const [endDate, setEndDate] = useState(null);

    function putOnMarketPlace() {
        if (putType === 'fixed') {
            putFixed();
        } else if (putType === 'timed') {
            putAuction();
        }
    }

    async function putFixed() {
        // quantity
        if (putPrice <= 0) {
            toast.error("Please input price correctly!");
            return;
        }
        if (((quantity < 1) && (item.type === 'multi')) || quantity > holding) {
            toast.error("Please input quantity correctly!");
            return;
        }
        setListingStatus(true);
        const load_toast_id = toast.loading("Please wait for listing nft...");    
        if (item.type === 'multi') {
            listMultiItem(
                item.itemCollection,
                account,
                item.tokenId,
                quantity,
                currencyInfo.address,
                putPrice,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setListingStatus(false);
                    setShowPutMarketPlace(false);
                    toast.success("List Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return ;
                } else {
                    setListingStatus(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        } else if (item?.type === 'single') {
            listSingleItem(
                item.itemCollection,
                account,
                item.tokenId,
                currencyInfo.address,
                putPrice,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setListingStatus(false);
                    setShowPutMarketPlace(false);
                    toast.success("List Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return ;
                } else {
                    setListingStatus(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        }

    }

    async function putAuction() {
        if (putPrice <= 0) {
            toast.error("Please input price correctly!");
            return;
        }
        const currentTime = new Date().getTime();

        let startTimeStamp = 0;
        if (startType === 'specific') {
            if (!startDate) {
                toast.error("Please select start time.");
                return;
            }
            const startTime = startDate.getTime();
            if (currentTime >= startTime) {
                toast.error("The start time must be after the current time.");
                return;
            }
            startTimeStamp = Math.floor(startTime / 1000);
        } else {
            startTimeStamp = Math.floor(currentTime / 1000);
        }
        console.log("startTimeStamp");
        console.log(startTimeStamp);

        let endTimeStamp = 0;
        if (endType === 'specific') {
            if (!endDate) {
                toast.error("Please select end time.");
                return;
            }
            const endTime = endDate.getTime();
            endTimeStamp = Math.floor(endTime / 1000);
            if (currentTime >= endTime) {
                toast.error("The end time must be after the current time.");
                return;
            }
            if (startTimeStamp >= endTimeStamp) {
                toast.error("The end time must be after the start time.");
                return;
            }
        } else {
            const later = Number(endType);
            endTimeStamp = startTimeStamp + 86400 * later;
        }        

        setCreatingAuctionStatus(true);
        const load_toast_id = toast.loading("Please wait for creating auction...");    
        createAuction(
            item.itemCollection,
            account,
            item.tokenId,
            currencyInfo.address,
            putPrice,
            startTimeStamp,
            endTimeStamp,
            chainId,
            library.getSigner()
        ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
                setCreatingAuctionStatus(false);
                setShowPutMarketPlace(false);
                toast.success("Auction created! Data will be synced after some block confirmation...");
                await sleep(2000);
                window.location.reload();
                return true;
            } else {
                setCreatingAuctionStatus(false);
                toast.error("Failed Transaction!");
                return;
            }
        });
    }

    return (
        <>
            {
                item && account && chainId && Tokens?.[chainId] && (holding > 0) && 
                <Modal
                    isOpen={showPutMarketPlace}
                    onRequestClose={() => setShowPutMarketPlace(false)}
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
                            <Element.ModalCloseIcon size={32} onClick={() => setShowPutMarketPlace(false)} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>Put on Marketplace</Element.ModalTitle>
                        {item?.type === 'single' &&

                            <Element.PutTypes>
                                <Element.PutType onClick={() => setPutType('fixed')} className={putType === 'fixed' ? 'active' : ''}>
                                    <div className='content'>
                                        <Element.FixedIcon size={32} />
                                        <Element.TypeLabel>Fixed price</Element.TypeLabel>
                                    </div>
                                </Element.PutType>
                                <Element.PutType onClick={() => setPutType('timed')} className={putType === 'timed' ? 'active' : ''}>
                                    <div className='content'>
                                        <Element.TimeIcon size={36} />
                                        <Element.TypeLabel>Timed auction</Element.TypeLabel>
                                    </div>
                                    
                                </Element.PutType>
                            </Element.PutTypes>
                        }
                        {
                            putType === 'fixed' &&
                            <Element.Field>
                                <Element.Label>Price</Element.Label>
                                <Element.InputContainer>
                                    <Element.Input type={"number"} placeholder={"Enter Price"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                                    <Element.CurrencySelect name={"currencies"} defaultValue={currencyInfo.address} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(chainId, event.target.value))}>
                                    {
                                        Tokens?.[chainId].map((currencyItem, index) =>
                                            <Element.OrderByOption key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                                        )
                                    }
                                    </Element.CurrencySelect>
                                </Element.InputContainer>
                                {item.type === 'multi' &&
                                    <>
                                        <Element.Label>Enter quantity <span>({holding} available)</span></Element.Label>
                                        <Element.Input
                                            value={quantity}
                                            type={"number"}
                                            onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
                                            placeholder={"Enter quantity"} />
                                    </>
                                }
                            </Element.Field>
                        }
                        {
                            putType === 'timed' &&
                            <>
                                <Element.Field>
                                    <Element.Label>Minimum bid</Element.Label>
                                    <Element.InputContainer>
                                        <Element.Input type={"number"} placeholder={"Enter minimum bid"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                                        <Element.CurrencySelect name={"currencies"} defaultValue={currencyInfo.address} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(chainId, event.target.value))}>
                                        {
                                            Tokens?.[chainId].map((currencyItem, index) =>
                                                <Element.OrderByOption key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                                            )
                                        }
                                        </Element.CurrencySelect>
                                    </Element.InputContainer>
                                </Element.Field>
                                <Element.SelectRow>
                                    <Element.SelectField>
                                        <Element.Label>Starting Date</Element.Label>
                                        <Element.StartingDateSelect name={"starting_date"} defaultValue={startType} onChange={event => setStartType(event.target.value)}>
                                            <Element.OrderByOption value={"now"}>Right after listing</Element.OrderByOption>
                                            <Element.OrderByOption value={"specific"}>Pick specific date</Element.OrderByOption>
                                        </Element.StartingDateSelect>
                                        {
                                            startType === "specific" &&
                                            <DatePicker
                                                selected={startDate}
                                                onChange={value => setStartDate(value)}
                                                className={"input-picker"}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        }
                                    </Element.SelectField>
                                    <Element.SelectField>
                                        <Element.Label>Expiration Date</Element.Label>
                                        <Element.StartingDateSelect name={"expiration_date"} defaultValue={endType} onChange={event => setEndType(event.target.value)}>
                                            <Element.OrderByOption value={"1"}>1 day</Element.OrderByOption>
                                            <Element.OrderByOption value={"3"}>3 days</Element.OrderByOption>
                                            <Element.OrderByOption value={"5"}>5 days</Element.OrderByOption>
                                            <Element.OrderByOption value={"7"}>7 days</Element.OrderByOption>
                                            <Element.OrderByOption value={"specific"}>Pick specific date</Element.OrderByOption>
                                        </Element.StartingDateSelect>
                                        {
                                            endType === "specific" &&
                                            <DatePicker
                                                selected={endDate}
                                                onChange={value => setEndDate(value)}
                                                className={"input-picker"}
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        }
                                    </Element.SelectField>
                                </Element.SelectRow>
                            </>
                        }

                        <Element.ModalActions>
                            <Element.ModalCancelButton onClick={() => setShowPutMarketPlace(false)}>Cancel</Element.ModalCancelButton>
                            <Element.ModalSubmitButton onClick={() => putOnMarketPlace()} disabled={listingStatus || creatingAuctionStatus}>
                                {
                                    listingStatus || creatingAuctionStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                            </Element.ModalSubmitButton>
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }            
        </>
    );
}

export default ModalList;