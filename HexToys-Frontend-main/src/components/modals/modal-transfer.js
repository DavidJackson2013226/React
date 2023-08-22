import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Modal from "react-modal";
import toast from "react-hot-toast";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    isAddress,
    sendNFT
} from "../../utils/contracts";
import * as Element from "./style";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalTransfer(props) {
    const { account, active, chainId, library } = useWeb3React();
    const { item, holding, showSendNFTModal, setShowSendNFTModal } = props;

    const [quantity, setQuantity] = useState('1');
    const [toAddress, setToAddress] = useState('');
    const [sendingStatus, setSendingStatus] = useState(false);

    async function transferNFT() {

        if (((quantity < 1) || (quantity > holding))) {
            toast.error("Please input quantity correctly!");
            return;
        }
        if (!toAddress) {
            toast.error("Please input receiver wallet address!");
            return;
        }
        if (!isAddress(toAddress)) {
            toast.error("Please input receiver address correctly!");
            return;
        }

        setSendingStatus(true);
        const load_toast_id = toast.loading("Please wait for sending nft...");
        sendNFT(
            item.itemCollection,
            item.type,
            account,
            toAddress,
            item.tokenId,
            quantity,
            chainId,
            library.getSigner()
        ).then(async (result) => {
            toast.dismiss(load_toast_id);
            if (result) {
                setSendingStatus(false);
                setShowSendNFTModal(false);
                toast.success("NFT was sent! Data will be synced after some block confirmation...");
                await sleep(2000);
                window.location.reload();
                return;
            } else {
                setSendingStatus(false);
                toast.error("Failed Transaction!");
                return;
            }
        });
    }

    return (
        <>
            {
                item && (holding > 0) && account && active &&
                <Modal
                    isOpen={showSendNFTModal}
                    onRequestClose={() => {
                        setShowSendNFTModal(false);
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
                                setShowSendNFTModal(false);
                            }} />
                        </Element.ModalHeader>
                        <Element.ModalTitle>Transfer NFT</Element.ModalTitle>                        

                        <Element.Field>
                            <Element.Label>Transfer "{item.name}" to:</Element.Label>
                            <Element.Input
                                value={toAddress}
                                type={"text"}
                                onChange={(e) => { setToAddress(e.target.value) }}
                                placeholder={"e.g. 0x0BF373dBbEe2AC7Af7028Ae8027a090EACB9b596"} />
                        </Element.Field>

                        {item.type === 'multi' &&
                            <Element.Field>
                                <Element.Label>Enter quantity <span>({holding} available)</span></Element.Label>
                                <Element.Input
                                    value={quantity}
                                    type={"number"}
                                    onChange={(e) => { setQuantity(Math.floor(e.target.value)) }}
                                    placeholder={"Enter quantity"} />
                            </Element.Field>
                        }

                        <Element.ModalActions>
                            <Element.ModalCancelButton onClick={() => {
                                setShowSendNFTModal(false);                               
                            }}>Cancel</Element.ModalCancelButton>
                            <Element.ModalSubmitButton disabled={sendingStatus} onClick={() => transferNFT()}>
                                {
                                    sendingStatus ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Confirm"
                                }
                            </Element.ModalSubmitButton>
                        </Element.ModalActions>
                    </Element.ModalBody>
                </Modal>
            }
        </>

    );
}

export default ModalTransfer;