import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';

import { finalizeAuction } from "../../utils/contracts";

import * as Element from "./style";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalEndAuction(props) {
    const { account, chainId, library } = useWeb3React();
    const { item, showEndAuction, setShowEndAuction } = props;

    const [endingAuctionStatus, setEndingAuctionStatus] = useState(false);
    async function endAuction() {
        setEndingAuctionStatus(true);
        const load_toast_id = toast.loading("Please wait for ending auction...");    
        finalizeAuction(
            item.auctionInfo.auctionId,
            chainId,
            library.getSigner()
        ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
                setEndingAuctionStatus(false);
                setShowEndAuction(false);
                toast.success("End Auction Success! Data will be synced after some block confirmation...");
                await sleep(2000);
                window.location.reload();
                return;
            } else {
                setEndingAuctionStatus(false);
                toast.error("Failed Transaction!");
                return;
            }
        });

    }
    return (
        <>
            {
                item && item.auctionInfo && account &&
                <Modal
                    isOpen={showEndAuction}
                    onRequestClose={() => setShowEndAuction(false)}
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
                            <Element.ModalCloseIcon size={32} onClick={() => setShowEndAuction(false)} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>
                            End Auction
                            <Element.PayAmount>
                                <Element.Price>Are you sure you want to end this auction ?</Element.Price>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        <Element.ModalActions>
                            <Element.ModalCancelButton onClick={() => setShowEndAuction(false)}>Cancel</Element.ModalCancelButton>
                            <Element.ModalSubmitButton onClick={() => endAuction()} disabled={endingAuctionStatus}>
                                {
                                    endingAuctionStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "End Auction"
                                }
                            </Element.ModalSubmitButton>
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }           
        </>
    );
}

export default ModalEndAuction;