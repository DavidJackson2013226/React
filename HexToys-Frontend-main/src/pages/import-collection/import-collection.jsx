/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';

import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";
import Header from '../header/header';
import { Footer } from '../footer/footer';

import * as Element from "./styles";
import { NetworkParams } from "../../utils";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { getImportInfo, isNFTAddress, importCollection } from "../../utils/contracts";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ImportCollection(props) {

    const { account, active, chainId, library } = useWeb3React();
    
    const [collectionFile, setCollectionFile] = useState(null);
    const [collectionImgHash, setCollectionImgHash] = useState("");
    const [collectionImgUploading, setCollectionImgUploading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [collectionCoverFile, setCollectionCoverFile] = useState(null);
    const [collectionCoverImgHash, setCollectionCoverImgHash] = useState("");
    const [collectionCoverImgUploading, setCollectionCoverImgUploading] = useState(false);

    const [contractAddress, setContractAddress] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [collectionDescription, setCollectionDescription] = useState("");
    const [creatingCollection, setCreatingCollection] = useState(false);

    const [balance, setBalance] = useState(0);
    const [importInfo, seImportInfo] = useState(null);
    useEffect(() => {
        if (account && chainId && library) {
            library.getBalance(account)
                .then((value) => {
                    var etherVal = parseFloat(ethers.utils.formatEther(value));
                    setBalance(etherVal)
                })
                .catch(() => {
                    setBalance(0)
                })
            getImportInfo(chainId, library.getSigner())
                .then((result) => {
                    seImportInfo(result)
                })
                .catch(() => {
                    seImportInfo(null)
                })
        }
        return () => {
            setBalance(0);
            seImportInfo(null);
        }
    }, [account, chainId, library])

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, [categories]);

    function fetchCategories() {
        axios.get(`${process.env.REACT_APP_API}/categories`)
            .then((res) => {
                setCategories(res.data.categories);
                setCategory(res.data.categories[0].name);
            })
            .catch((err) => {
                console.log("err: ", err.message);
                setCategories([]);
            });
    }

    async function onImportCollection() {
        if (!account || !chainId || !library) {
            toast.error("Please Connect Wallet!");
            return;
        }
        if (!importInfo) {
            return;
        }
        if (!contractAddress) {
            toast.error("Please Input Collection Address!");
            return;
        }
        if (!collectionName) {
            toast.error("Please Input Collection Name!");            
            return;
        }
        if (!collectionImgHash) {
            toast.error("Please Select Collection Image!");      
            return;
        }
        if (!collectionCoverImgHash) {
            toast.error("Please Select Collection Cover Image!"); 
            return;
        }

        const isNFT = await isNFTAddress(contractAddress, chainId, library.getSigner())
        if (!isNFT) {
            toast.error("Invalid Collection Address!"); 
            return;
        }
        if (importInfo.publicAdd) {
            // public add
            if (balance < importInfo.fee) {
                toast.error("Insufficient fee!"); 
                return;
            }
        } else {
            // only owner can import
            if (account.toLowerCase() !== importInfo.owner.toLowerCase()) {
                toast.error("Only admin can import collection!"); 
                return;
            }
        }

        const openseadata = {
            name: collectionName,
            description: collectionDescription,
            category: category,
            image: collectionImgHash,
            coverImg: collectionCoverImgHash
        };

        setCreatingCollection(true);
        getIpfsHash(openseadata).then((hash) => {
            let collectionUri = `https://ipfs.hex.toys/ipfs/${hash}`;
            const load_toast_id = toast.loading("Please wait for importing collection...");
            importCollection(
                contractAddress,
                collectionName,
                collectionUri,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                setCreatingCollection(false);
                if (result) {
                    toast.success("Collection was imported! Data will be synced after some block confirmation...");
                    await sleep(2000);
                    props.history.push(`/`);
                } else {
                    setCreatingCollection(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        });
    }

    function handleCollectionImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCollectionFile(event.target.files[0]);
            setCollectionImgUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setCollectionImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCollectionImgUploading(false);
            });
        }
    }

    function handleCollectionCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCollectionCoverFile(event.target.files[0]);
            setCollectionCoverImgUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setCollectionCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCollectionCoverImgUploading(false);
            });
        }
    }

    function closeCollectionImg() {
        setCollectionFile(null);
        setCollectionImgHash("");
        setCollectionImgUploading(false);
    }

    function closeCollectionCoverImg() {
        setCollectionCoverFile(null);
        setCollectionCoverImgHash("");
        setCollectionCoverImgUploading(false);
    }

    return (
        <>
            <Header {...props} />

            
            <Element.MainContainer>
            {(account && active && chainId ) ?
                <Element.Container>
                    <Element.Title>
                        <h1>Import Collection</h1>
                    </Element.Title>
                    {
                        importInfo &&
                        (
                            importInfo.publicAdd ?
                                <Element.Label>
                                    <span> Fee: </span>
                                    {` ${parseFloat(importInfo.fee).toFixed(3)} ${NetworkParams?.[chainId]?.nativeCurrency?.symbol}`}
                                </Element.Label>
                                :
                                <Element.Label>
                                    <span style={{ color: 'red' }}> Only Admin can import collection!</span>
                                </Element.Label>
                        )

                    }
                    <Element.ModalContent>
                        <Element.UploadContainer style={{ display: collectionFile ? "none" : "" }}>
                            <Element.UploadCaption> Logo image. 400x400 recommended.</Element.UploadCaption>
                            <Element.ChooseFileBtn>
                                Choose File
                                <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionImg} />
                            </Element.ChooseFileBtn>
                        </Element.UploadContainer>

                        <Element.PreviewContainer style={{ display: collectionFile ? "" : "none" }}>
                            <Element.CloseIconContainer style={{ display: collectionImgHash ? "" : "none" }}>
                                <CloseIcon onClick={() => closeCollectionImg()} fontSize="small" />
                            </Element.CloseIconContainer>
                            <Element.MediaContainer>
                                <CircularProgress style={{ display: collectionImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                <Element.ImagePreview style={{ display: collectionImgHash ? "" : "none" }} src={collectionImgHash} />
                            </Element.MediaContainer>
                        </Element.PreviewContainer>
                    </Element.ModalContent>

                    <Element.ModalContent>
                        <Element.UploadContainer style={{ display: collectionCoverFile ? "none" : "" }}>
                            <Element.UploadCaption>Cover image. 1600x400 recommended.</Element.UploadCaption>
                            <Element.ChooseFileBtn>
                                Choose File
                                <Element.FileInput type="file" value="" accept="image/*" onChange={handleCollectionCoverImg} />
                            </Element.ChooseFileBtn>
                        </Element.UploadContainer>

                        <Element.PreviewContainer style={{ display: collectionCoverFile ? "" : "none" }}>
                            <Element.CloseIconContainer style={{ display: collectionCoverImgHash ? "" : "none" }}>
                                <CloseIcon onClick={() => closeCollectionCoverImg()} fontSize="small" />
                            </Element.CloseIconContainer>
                            <Element.MediaContainer>
                                <CircularProgress style={{ display: collectionCoverImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                <Element.ImagePreview style={{ display: collectionCoverImgHash ? "" : "none" }} src={collectionCoverImgHash} />
                            </Element.MediaContainer>
                        </Element.PreviewContainer>
                    </Element.ModalContent>

                    <Element.Field>
                        <Element.Label>Collection Address</Element.Label>
                        <Element.Input placeholder={"e.g 0x0BF373dBbEe2AC7Af7028Ae8027a090EACB9b596"} value={contractAddress} onChange={event => setContractAddress(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label>Display name</Element.Label>
                        <Element.Input placeholder={"Enter name"} value={collectionName} onChange={event => setCollectionName(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label>Description <span> (Optional)</span></Element.Label>
                        <Element.Input placeholder={"Enter description"} value={collectionDescription} onChange={event => setCollectionDescription(event.target.value)} />
                    </Element.Field>

                    <Element.Field>
                        <Element.Label>Select Category</Element.Label>
                        <Element.SelectCategory name={"category"} defaultValue={category} onChange={event => setCategory(event.target.value)}>
                            {
                                categories.map((categoryItem, index) => {
                                    return (
                                        <Element.SelectCategoryOption key={index} value={categoryItem.name}>{categoryItem.name}</Element.SelectCategoryOption>
                                    );
                                })
                            }
                        </Element.SelectCategory>
                    </Element.Field>

                    <Element.ModalAction>
                        <Element.ModalButton onClick={() => onImportCollection()}>
                            {
                                creatingCollection ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Import Collection"
                            }
                        </Element.ModalButton>
                    </Element.ModalAction>
                </Element.Container>
                :
                <Element.Container>
                    <Element.Title>
                        <h1 style={{width : '100%', textAlign : 'center'}}>Please Connect Wallet</h1>
                    </Element.Title>
                </Element.Container>
            }
            </Element.MainContainer>
            <Footer />            
        </>

    );

}

export default ImportCollection;
