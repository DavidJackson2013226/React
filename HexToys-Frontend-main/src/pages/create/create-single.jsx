/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import { Input, Form } from "antd";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";

import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";
import Header from '../header/header';
import { Footer } from '../footer/footer';

import Modal from "react-modal";
import * as Element from "./styles";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { addSingleItem, createSingleCollection } from "../../utils/contracts";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function CreateSingle(props) {

    const { account, active, chainId, library } = useWeb3React();
    
    const [mainFile, setMainFile] = useState(null);
    const [mainFileHash, setMainFileHash] = useState("");
    const [mainFileUploading, setMainFileUploading] = useState(false);
    const [showCoverUpload, setShowCoverUpload] = useState(false);

    const [coverImgFile, setCoverImgFile] = useState(null);
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImageUploading, setCoverImageUploading] = useState(false);
    const [mediaType, setMediaType] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [properties, setProperties] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collections, setCollections] = useState([]);
    const [creatingItem, setCreatingItem] = useState(false);

    const [showCreateCollectionDlg, setShowCreateCollectionDlg] = useState(false);
    const [collectionFile, setCollectionFile] = useState(null);
    const [collectionImgHash, setCollectionImgHash] = useState("");
    const [collectionImgUploading, setCollectionImgUploading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [collectionCoverFile, setCollectionCoverFile] = useState(null);
    const [collectionCoverImgHash, setCollectionCoverImgHash] = useState("");
    const [collectionCoverImgUploading, setCollectionCoverImgUploading] = useState(false);

    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const [creatingCollection, setCreatingCollection] = useState(false);

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

    useEffect(() => {
        if (account && active && chainId)
        {
            fetchCollections();
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, active, chainId]);

    function fetchCollections() {
        setSelectedCollection(null);
        axios.get(`${process.env.REACT_APP_API}/collection?ownerAddress=${account}&chainId=${chainId}&type=single&sortDir=asc`)
            .then((res) => {
                console.log("res: ", res);
                setCollections(res.data.collections);
                res.data.collections.forEach((item, i) => {
                    if (item.isPublic) {
                        setSelectedCollection(item);
                    }
                });
            })
            .catch((err) => {
                console.log("err: ", err.message);
                setCollections([]);
            });
    }


    async function onCreateCollection() {
        if (!newCollectionName) {
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

        const openseadata = {
            name: newCollectionName,
            description: newCollectionDescription,
            category: category,
            image: collectionImgHash,
            coverImg: collectionCoverImgHash
        };

        setCreatingCollection(true);
        getIpfsHash(openseadata).then((hash) => {
            let collectionUri = `https://ipfs.hex.toys/ipfs/${hash}`;
            const load_toast_id = toast.loading("Please wait for creating collection...");
            createSingleCollection(
                newCollectionName,
                collectionUri,
                chainId,
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    setNewCollectionName("");
                    setNewCollectionDescription("");

                    setCollectionImgHash("");
                    setCollectionCoverImgHash("");
                    toast.success("Collection was created! Data will be synced after some block confirmation...");
          
                    await sleep(2000);
                    setShowCreateCollectionDlg(false);
                    fetchCollections();
                    setCreatingCollection(false);
                } else {
                    setNewCollectionName("");
                    setNewCollectionDescription("");
                    setCreatingCollection(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        });
    }

    async function onCreateItem() {
        if (!name) {
            toast.error("Please Input Title!");
            return;
        }
        // if (!description) {
        //     toast.error("Please Input Description!");
        //     return;
        // }

        if (!selectedCollection) {
            toast.error("Please Select Collection!");
            return;
        }
        if (!mainFileHash) {
            toast.error("Please Upload file!");
            return;
        }
        if ((mediaType === "video" || mediaType === "audio") && !coverImgHash) {
            toast.error("Please Upload cover image!");
            return;
        }

        let attributesData = [];
        for (let i = 0; i < properties.length; i++) {
            attributesData.push({
                trait_type: properties[i][0],
                value: properties[i][1],
            });
        }



        // call createItem contract function

        const openseadata = {
            asset_type: mediaType,
            name: name,
            description: description,
            attributes: attributesData,
            animation_url: mainFileHash,
            image: coverImgHash
        };
        setCreatingItem(true);
        getIpfsHash(openseadata).then((hash) => {
            let tokenUri = `https://ipfs.hex.toys/ipfs/${hash}`;
            const load_toast_id = toast.loading("Please wait for minting nft...");
            addSingleItem(
                selectedCollection.address,
                tokenUri,
                chainId, 
                library.getSigner()
            ).then(async (result) => {
                toast.dismiss(load_toast_id);
                if (result) {
                    toast.success("NFT was minted! Data will be synced after some block confirmation...");
                    setCreatingItem(false);
                    await sleep(2000);
                    props.history.push(`/profile/${account}`);
                    return;
                } else {
                    setCreatingItem(false);
                    toast.error("Failed Transaction!");
                    return;
                }
            });
        });
    }

    function handleMainFile(event) {
        console.log("handleMainFile");
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setMediaType(fileType);
            setCoverImgFile(null);
            setCoverImgHash("");
            setShowCoverUpload(false);
            setMainFile(event.target.files[0]);
            setMainFileUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setMainFileHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setMainFileUploading(false);
            })
        } else if ((fileType === "video") || (fileType === "audio")) {
            setMainFile(event.target.files[0]);
            setMainFileUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setMainFileHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setMainFileUploading(false);
                setMediaType(fileType);
                setShowCoverUpload(true);
            });
        }
    }

    function handleCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCoverImgFile(event.target.files[0]);
            setCoverImageUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCoverImageUploading(false);
            });
        }
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

    function closeMainFile() {
        setMainFile(null);
        setMainFileHash("");
        setMainFileUploading(false);
        setShowCoverUpload(false);

        setCoverImgFile(null);
        setCoverImgHash("");
        setCoverImageUploading(false);
        setMediaType("");
    }

    function closeCoverImg() {
        setCoverImgFile(null);
        setCoverImgHash("");
        setCoverImageUploading(false);
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


    function createProperty() {
        if (properties.length < 10) {
            setProperties((props) => [...props, ["", ""]]);
        }
    }
    function editProperties(propIndex, nameValIndex, newVal) {
        let props = [...properties];
        let prop = props[propIndex];
        prop[nameValIndex] = newVal;
        setProperties(props);
    }

    function deleteProperty(index) {
        let props = [...properties];
        props.splice(index, 1);
        setProperties(props);
    }

    return (
        <div>
            <Header {...props} />
            {
                account && active &&
                <Element.Container>
                    <Element.Title><h1>Create Single NFT</h1></Element.Title>
                    <Element.UploadField>
                        <Element.Label>Upload file</Element.Label>
                        <Element.UploadContainer style={{ display: mainFile ? "none" : "" }}>
                            <Element.UploadCaption> JPG, PNG, GIF, MP3 or MP4. Max 100mb</Element.UploadCaption>
                            <Element.ChooseFileBtn>
                                Choose File
                                <Element.FileInput type="file" value="" accept="image/*,audio/*,video/*" onChange={handleMainFile} />
                            </Element.ChooseFileBtn>
                        </Element.UploadContainer>
                        <Element.PreviewContainer style={{ display: mainFile ? "" : "none" }}>
                            <Element.CloseIconContainer style={{ display: mainFileHash ? "" : "none" }}>
                                <CloseIcon onClick={() => closeMainFile()} fontSize="small" />
                            </Element.CloseIconContainer>
                            <Element.MediaContainer>
                                <CircularProgress style={{ display: mainFileUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                {
                                    mainFileHash && (
                                        mediaType === "video" ?
                                            <Element.VideoPreview src={mainFileHash} autoPlay loop controls />
                                            :
                                            mediaType === "audio" ?
                                                <Element.AudioPreview src={mainFileHash} autoPlay loop controls />
                                                :
                                                <Element.ImagePreview src={mainFileHash} />
                                    )
                                }
                            </Element.MediaContainer>
                        </Element.PreviewContainer>
                    </Element.UploadField>
                    <Element.UploadField style={{ display: showCoverUpload ? "" : "none" }}>
                        <Element.Label>Upload cover</Element.Label>
                        <Element.UploadContainer style={{ display: coverImgFile ? "none" : "" }}>
                            <Element.UploadCaption>JPG, PNG, GIF, WEBP. Max 100mb</Element.UploadCaption>
                            <Element.ChooseFileBtn>
                                Choose File
                                <Element.FileInput type="file" value="" accept="image/*" onChange={handleCoverImg} />
                            </Element.ChooseFileBtn>
                        </Element.UploadContainer>
                        <Element.PreviewContainer style={{ display: coverImgFile ? "" : "none" }}>
                            <Element.CloseIconContainer style={{ display: coverImgHash ? "" : "none" }}>
                                <CloseIcon onClick={() => closeCoverImg()} fontSize="small" />
                            </Element.CloseIconContainer>
                            <Element.MediaContainer>
                                <CircularProgress style={{ display: coverImageUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                <Element.ImagePreview style={{ display: coverImgHash ? "" : "none" }} src={coverImgHash} />
                            </Element.MediaContainer>
                        </Element.PreviewContainer>
                        <Element.Option>Please add cover Image to your media file</Element.Option>
                    </Element.UploadField>

                    <Element.SelectCollection>
                        <Element.Label>Choose collection</Element.Label>
                        <Element.Collections>
                            <Element.collection onClick={() => setShowCreateCollectionDlg(true)}>
                                <div className="content">
                                    <Element.CollectionPlusIcon size={48} />
                                    <Element.CollectionName>Create</Element.CollectionName>
                                    <Element.CollectionType>PRC-721</Element.CollectionType>
                                </div>
                            </Element.collection>
                            {
                                collections.map((collection, index) => {
                                    return (
                                        <Element.collection key={index} onClick={() => setSelectedCollection(collection)} className={selectedCollection === collection ? 'active' : ''}>
                                            <div className="content">
                                                <Element.CollectionIcon src={collection.image} />
                                                <Element.CollectionName>{collection.name}</Element.CollectionName>
                                            </div>
                                        </Element.collection>
                                    );
                                })
                            }
                        </Element.Collections>
                    </Element.SelectCollection>
                    <Element.Form>
                        <Element.Field>
                            <Element.Label>Name</Element.Label>
                            <Element.Input value={name} placeholder="Please input item name" onChange={event => setName(event.target.value)} />
                        </Element.Field>
                        <Element.Field>
                            <Element.Label>Description <span> (Optional)</span></Element.Label>
                            <Element.Input value={description} placeholder="Provide a detailed description of your item" onChange={event => setDescription(event.target.value)} />
                        </Element.Field>

                        <Element.Field>
                            <Form.Item>
                                <h3 style={{ marginTop: '10px' }}>
                                    Properties <span>(Optional)</span>
                                    <button className="property-add-button" onClick={createProperty}><PlusOutlined /></button>
                                </h3>
                                {
                                    properties.map((value, index) => {
                                        return (
                                            <div key={index} style={{ display: 'flex', marginBottom: '10px', flexWrap: 'nowrap' }}>
                                                <Input.Group className="input-group">
                                                    <Input value={value[0]}
                                                        onChange={(e) => { editProperties(index, 0, e.target.value) }}
                                                        placeholder="Name" />
                                                    <Input value={value[1]}
                                                        onChange={(e) => { editProperties(index, 1, e.target.value) }}
                                                        placeholder="Value" />
                                                </Input.Group>
                                                <button className="property-remove-button"
                                                    onClick={(e) => { deleteProperty(index) }}>
                                                    <CloseCircleFilled style={{ fontSize: '26px' }} />
                                                </button>
                                            </div>
                                        );
                                    })
                                }

                            </Form.Item>
                        </Element.Field>


                        <Element.Actions>
                            <Element.CreateBtn onClick={() => onCreateItem()} >
                                {
                                    creatingItem ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Create item"
                                }
                            </Element.CreateBtn>
                        </Element.Actions>
                    </Element.Form>
                    <Modal
                        isOpen={showCreateCollectionDlg}
                        onRequestClose={() => setShowCreateCollectionDlg(false)}
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
                            <Element.ModalTitle>Collection</Element.ModalTitle>
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
                                <Element.Label>Display name</Element.Label>
                                <Element.Input placeholder={"Enter name"} value={newCollectionName} onChange={event => setNewCollectionName(event.target.value)} />
                            </Element.Field>

                            <Element.Field>
                                <Element.Label>Description <span> (Optional)</span></Element.Label>
                                <Element.Input placeholder={"Enter description"} value={newCollectionDescription} onChange={event => setNewCollectionDescription(event.target.value)} />
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
                                <Element.ModalButton onClick={() => onCreateCollection()}>
                                    {
                                        creatingCollection ? <CircularProgress style={{ width: "16px", height: "16px", color: "white", }} /> : "Create collection"
                                    }
                                </Element.ModalButton>
                            </Element.ModalAction>
                        </Element.ModalBody>
                    </Modal>
                </Element.Container>
            }

            <Footer />            
        </div>

    );

}

export default CreateSingle;
