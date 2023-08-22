import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import toast from "react-hot-toast";
import Modal from "react-modal";
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    singleDelistItem,
    multipleDelistItem
} from "../../utils/contracts";

import * as Element from "./style";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalDelist(props) {
    const { account, chainId, library } = useWeb3React();
    const { item, pairItem, setPairItem, showUnlistMarketPlace, setShowUnlistMarketPlace } = props;

    const [delistingStatus, setDelistingStatus] = useState(false);
    async function unlistItem() {
        setDelistingStatus(true);    
        const load_toast_id = toast.loading("Please wait for delisting...");    
        if (item?.type === 'multi') {
            multipleDelistItem(
                pairItem.pairId,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setDelistingStatus(false);
                    setShowUnlistMarketPlace(false);
                    setPairItem(null);
                    toast.success("Delist Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return;
                } else {
                    setDelistingStatus(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        } else if (item?.type === 'single') {
            singleDelistItem(
                pairItem.pairId,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setDelistingStatus(false);
                    setShowUnlistMarketPlace(false);
                    setPairItem(null);
                    toast.success("Delist Success! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    window.location.reload();
                    return true;
                } else {
                    setDelistingStatus(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        }
    }

    return (
        <>
            {
                account && item && pairItem &&
                <Modal
                    isOpen={showUnlistMarketPlace}
                    onRequestClose={() => {
                        setShowUnlistMarketPlace(false);
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
                                setShowUnlistMarketPlace(false);
                                setPairItem(null);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>
                            Unlist Item
                            <Element.PayAmount>
                                <Element.Price>Are you sure you want to unlist this item ?</Element.Price>
                            </Element.PayAmount>
                        </Element.ModalTitle>
                        <Element.ModalActions>
                            <Element.ModalCancelButton onClick={() => {
                                setShowUnlistMarketPlace(false);
                                setPairItem(null);
                            }}>Cancel</Element.ModalCancelButton>
                            <Element.ModalSubmitButton onClick={() => unlistItem()} disabled={delistingStatus}>
                                {
                                    delistingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Unlist"
                                }
                            </Element.ModalSubmitButton>
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>
    );
}

export default ModalDelist;