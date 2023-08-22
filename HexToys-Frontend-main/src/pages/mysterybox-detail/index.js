/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useWeb3React } from '@web3-react/core'
import { useParams } from "react-router-dom";
import { Image } from "antd";
import axios from 'axios';
import toast from "react-hot-toast";
import ReadMoreReact from "read-more-react";
import { PlusCircleOutlined } from "@ant-design/icons";
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Element from "./styles";
import CardNode from "../../components/Cards/CardNode";
import { getTokenBalance, spin } from "../../utils/contracts";
import { formatNum, getCurrencyInfoFromAddress, NetworkParams } from "../../utils";
import { setupNetwork } from '../../utils/wallet';

import ModalAddCard from "../../components/modals/modal-add-card";
import Header from '../header/header';
import { Footer } from '../footer/footer'

function MysteryBoxDetail(props) {
    let { chain_id, address } = useParams();
    const history = useHistory();
    const [mysteryBoxInfo, setMysteryBoxInfo] = useState(null);
    useEffect(() => {
        if (chain_id && address) {
            console.log('get info');
            axios.get(`${process.env.REACT_APP_API}/mysterybox/detail?address=${address}&chainId=${chain_id}`)
                .then((res) => {
                    setMysteryBoxInfo(res.data.mysterybox);
                })
        }
    }, [chain_id, address])

    const { account, active, chainId, library } = useWeb3React();
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        if (account && library && mysteryBoxInfo && chainId && (chainId === mysteryBoxInfo.chainId)) {
            getTokenBalance(account, mysteryBoxInfo.tokenAddress, chainId, library)
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
    }, [account, chainId, library, active, mysteryBoxInfo])

    const [cards, setCards] = useState([])
    const [giftCard, setGiftCard] = useState([])
    const [giftGotStatus, setGiftGotStatus] = useState(false)
    const [page, setPage] = useState(1)
    const [noCards, setNoCards] = useState(false)
    const [initialCardsLoaded, setInitialCardsLoaded] = useState(false)
    const [cardLoading, setCardLoading] = useState(false)
    useEffect(() => {
        setCards([])
        setNoCards(false)
        setInitialCardsLoaded(false)
        setCardLoading(true)
        setPage(1)
        fetchCards(true)
    }, [address])
    useEffect(() => {
        setCardLoading(true)
        if (initialCardsLoaded) {
            fetchCards(false);
        }
    }, [page])
    function fetchCards(reset) {
        let query = `${process.env.REACT_APP_API}/cards?mysteryboxAddress=${address}&chainId=${chain_id}&sortBy=amount`
        let queryUrl = `${query}&page=${reset ? 1 : page}`

        axios.get(queryUrl)
            .then(res => {
                setCardLoading(false)
                if (res.data.cards.length === 0) setNoCards(true)
                if (reset) {
                    setCards(res.data.cards)
                    setInitialCardsLoaded(true)
                } else {
                    let prevArray = JSON.parse(JSON.stringify(cards))
                    prevArray.push(...res.data.cards)
                    setCards(prevArray)
                }

            })
            .catch(err => {
                setCardLoading(false)
                if (err.response.data.message === 'No cards found') {
                    setNoCards(true)
                }
            })
    }
    function loadMore() {
        if (!cardLoading) {
            setPage(page => { return (page + 1) })
        }
    }

    const [unlocking, setUnlocking] = useState(false);
    const unlockMysteryBox = async () => {
        if (unlocking) {
            return
        }
        if (!mysteryBoxInfo) {
            return
        }        
        if (chainId !== Number(chain_id)) {
            toast.error(`Please connect correct network(${NetworkParams?.[chain_id]?.chainName})`);
            setupNetwork(chain_id);
            return
        }
        if (balance < mysteryBoxInfo.price) {
            toast.error("Insufficient funds!");
            return
        }

        setUnlocking(true);
        spin(
            account,
            address,
            mysteryBoxInfo.tokenAddress,
            chainId,
            library.getSigner()
        ).then((key) => {
            if (key) {
                axios.get(`${process.env.REACT_APP_API}/card/detail?key=${key}&chainId=${chainId}`)
                    .then(res => {
                        if (res.data.card) {
                            setGiftCard(res.data.card);
                            setGiftGotStatus(true);
                        } else {
                            toast.error("Can not catch nft card from the server!");
                            setUnlocking(false);
                        }
                    })
                    .catch(err => {
                        toast.error("Can not catch nft card from the server!");
                        setUnlocking(false);
                    })
            } else {
                toast.error("Failed Transaction");
                setUnlocking(false);
            }
        });

    };



    const [showAddCardModal, setShowAddCardModal] = useState(false);

    return (
        <div>
            <Header {...props} />
            {
                mysteryBoxInfo &&
                <Element.Container>
                    
                    <div className="mysterybox-header">
                        <div className="mysterybox-header-user-context">
                            <Image
                                preview={false}
                                src={mysteryBoxInfo.image ? mysteryBoxInfo.image : "/white-background.png"}
                            />
                            <div className="mysterybox-content-box">
                                <div className="mysterybox-content">
                                    <h1>{mysteryBoxInfo.name}</h1>
                                    <ReadMoreReact
                                        text={`${mysteryBoxInfo.description}`}
                                        min={1}
                                        ideal={50}
                                        max={100}
                                        readMoreText="Read more"
                                    />
                                    <>
                                        <div>
                                            <div className="price-content">
                                                <div className="price-sub-content">
                                                    <h2 className="inline-block">
                                                        {formatNum(mysteryBoxInfo.price)} {getCurrencyInfoFromAddress(mysteryBoxInfo.chainId, mysteryBoxInfo.tokenAddress).symbol}
                                                    </h2>
                                                    <p className="price-detail">Unlock Price</p>
                                                </div>
                                                <div className="price-middle-content">
                                                    <div></div>
                                                </div>
                                                {
                                                    account && active && library &&
                                                    <div className="price-sub-content">
                                                        <h2 className="inline-block">
                                                            {formatNum(balance)} {getCurrencyInfoFromAddress(mysteryBoxInfo.chainId, mysteryBoxInfo.tokenAddress).symbol}
                                                        </h2>
                                                        <p className="price-detail">Your Balance</p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {
                                            account && active && library && chainId &&
                                            <div className="action-container">
                                                <div className="action-unlock" onClick={unlockMysteryBox}>
                                                    {
                                                        unlocking ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                                                            :
                                                            <> Unlock </>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </>

                                </div>
                                {
                                    account && account.toLowerCase() === mysteryBoxInfo.owner.toLowerCase() && chainId && (chainId === mysteryBoxInfo.chainId) &&
                                    <div className="user-setting-container" onClick={() => setShowAddCardModal(true)}>
                                        <div className="user-setting">
                                            <PlusCircleOutlined />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div className="cards-content">
                        <h1>
                            Items in MysteryBox 
                            <span>({NetworkParams?.[chain_id]?.chainName})</span>
                        </h1>
                        <div className="all-cards">
                            {                                
                                cards.map((card, index) => (
                                    <CardNode {...props} card={card} key={index} totalSupply={mysteryBoxInfo.cardAmount} />
                                ))
                            }
                        </div>
                        <div className="load-more" style={{ display: noCards ? "none" : "" }}>
                            <button onClick={() => loadMore()} className="" type="primary" >
                                {cardLoading ? "Loading..." : "Load more"}
                            </button>
                        </div>
                    </div>

                    {
                        account && account.toLowerCase() === mysteryBoxInfo.owner.toLowerCase() && chainId && (chainId === mysteryBoxInfo.chainId) &&
                        <ModalAddCard
                            showAddCardModal={showAddCardModal}
                            setShowAddCardModal={setShowAddCardModal}
                            mysteryboxAddress={address}
                        />
                    }
                    <div className="ant-modal-root" style={{ display: unlocking ? '' : 'none' }}>
                        <div className="ant-modal-mask" style={{ background: 'rgba(0, 0, 0, 0.9)' }}></div>
                        <div tabIndex="-1" className="ant-modal-wrap" role="dialog">
                            <div style={{ top: '150px', width: '350px', position: 'relative', margin: '0 auto' }}>
                                <div style={{ display: giftGotStatus ? 'none' : '' }}>
                                    <h2 style={{ color: 'yellow', fontWeight: '700' }}>Opening MysteryBox</h2>
                                    <div >
                                        <div>
                                            <img src="/processing_unlock.gif"
                                                style={{ maxWidth: '100%', borderRadius: '10px' }} alt="img" />
                                        </div>
                                    </div>
                                    <p style={{ color: 'white' }}>Please wait...</p>
                                </div>
                                {
                                    giftGotStatus && giftCard &&
                                    <div>
                                        <h2 style={{ color: 'yellow', fontWeight: '700' }}>CONGRATULATIONS!</h2>
                                        <p style={{ color: 'white' }}>You won
                                            {
                                                giftCard.itemInfo && giftCard.itemInfo.name &&
                                                <span style={{ color: 'lightgreen', paddingLeft: '5px' }}>{giftCard.itemInfo.name}</span>
                                            }

                                        </p>
                                        <div>
                                            <div>
                                                {
                                                    giftCard.itemInfo && giftCard.itemInfo.image &&
                                                    <img src={giftCard.itemInfo.image}
                                                        style={{ maxWidth: '100%', borderRadius: '10px' }} alt="img" />
                                                }

                                            </div>
                                        </div>
                                        <div onClick={() => history.push(`/detail/${giftCard.chainId}/${giftCard.collectionId}/${giftCard.tokenId}`)}
                                            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                            <div style={{ padding: '5px 15px', color: 'white', background: 'var(--buttonColor)', width: 'fit-content', borderRadius: '10px', cursor: 'pointer' }}>
                                                View NFT Detail
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                                            <div onClick={() => window.location.reload()}
                                                style={{ padding: '5px 15px', color: 'white', background: 'var(--buttonColor)', width: 'fit-content', borderRadius: '10px', cursor: 'pointer' }}>
                                                Back
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </Element.Container>
            }

            <Footer />            
        </div>

    )
}

export default MysteryBoxDetail
