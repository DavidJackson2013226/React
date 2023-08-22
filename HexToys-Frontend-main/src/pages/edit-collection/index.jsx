import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";
import CloseIcon from '@material-ui/icons/Close';

import './edit-collection.scss';
import Header from '../header/header';
import { Footer } from '../footer/footer'
import { getIpfsHashFromFile } from "../../utils/ipfs";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function EditCollection(props) {
    let { chain_id, collection } = useParams();

    const { user, login } = props;
    const { account, active, library } = useWeb3React();
    useEffect(() => {
        if (user && account && active) {
            login();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, account, active, library])

    const [collectionInfo, setCollectionInfo] = useState(null);
    useEffect(() => {
        if (!collectionInfo) {
            axios.get(`${process.env.REACT_APP_API}/collection/detail?chainId=${chain_id}&address=${collection}`)
                .then(res => {
                    setCollectionInfo(res.data.collection);
                    if (res.data.collection.name) {
                        setNewName(res.data.collection.name);
                    }
                    if (res.data.collection.description) {
                        setNewDescription(res.data.collection.description);
                    }
                    if (res.data.collection.discord) {
                        setNewDiscord(res.data.collection.discord);
                    }
                    if (res.data.collection.facebook) {
                        setNewFacebook(res.data.collection.facebook);
                    }
                    if (res.data.collection.instagram) {
                        setNewInstagram(res.data.collection.instagram);
                    }
                    if (res.data.collection.image) {
                        setNewImage(res.data.collection.image);
                    }
                    if (res.data.collection.coverImg) {
                        setCoverImgHash(res.data.collection.coverImg);
                        setCoverFile(res.data.collection.coverImg);
                    }

                })
                .catch(err => {
                    setCollectionInfo(undefined);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain_id, collection])

    const [updating, setUpdating] = useState(false);

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDiscord, setNewDiscord] = useState("");
    const [newFacebook, setNewFacebook] = useState("");
    const [newInstagram, setNewInstagram] = useState("");


    const [file, setFile] = useState(null);
    const [newImage, setNewImage] = useState("");
    const [imgUploading, setImgUploading] = useState(false);

    function handleFile(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setFile(event.target.files[0]);
            setImgUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setNewImage(`https://ipfs.hex.toys/ipfs/${hash}`);
                setImgUploading(false);
            });
        }
    }


    const [coverFile, setCoverFile] = useState(null);
    const [coverImgHash, setCoverImgHash] = useState("");
    const [coverImgUploading, setCoverImgUploading] = useState(false);

    function handleCoverImg(event) {
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setCoverFile(event.target.files[0]);
            setCoverImgUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setCoverImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
                setCoverImgUploading(false);
            });
        }
    }

    function closeCoverImg() {
        setCoverFile(null);
        setCoverImgHash("");
        setImgUploading(false);
    }



    async function updateCollection() {
        setUpdating(true);
        const data = new FormData();
        data.append("account", account);
        data.append("chainId", chain_id);
        data.append("collection", collection);
        data.append("name", newName || "");
        data.append("description", newDescription || "");
        data.append("discord", newDiscord || "");
        data.append("facebook", newFacebook || "");
        data.append("instagram", newInstagram || "");
        data.append("image", newImage || "");
        data.append("coverImg", coverImgHash || "");

        axios.post(`${process.env.REACT_APP_API}/collection/update`, data)
            .then(async (res) => {
                setUpdating(false);
                await sleep(1000);
                props.history.push(`/collection/${chain_id}/${collection}`);
            })
            .catch(err => {
                setUpdating(false);
                toast.error(err.response.data.message);
            })
    }

    return (
        <div>
            <Header {...props} />
            {
                collectionInfo &&
                <div className="edit-collection">
                    {
                        account ?
                            <div className="container">
                                <div className='title'>
                                    <h1>Edit Collection</h1>
                                </div>
                                <div className="wrapper">
                                    <div className="edit_avatar">
                                        <div className="edit_content">
                                            <img src={newImage ? newImage : "https://ipfs.hex.toys/ipfs/QmPF4ybwpu7dXqu4spWEZRQVBTn18TXgy95TzBGpbUvSmC"} alt='' />
                                            <div className="camera_icon"><i class="fas fa-camera"></i></div>
                                            <input type="file" accept="image/*" multiple={false} onChange={handleFile} />
                                        </div>
                                        <a className="img_link" href={newImage && !imgUploading ? newImage : '/'} target='_blank' rel="noreferrer noopener">
                                            {file && !imgUploading ? "Uploaded!" : imgUploading ? "uploading to IPFS..." : ""}
                                        </a>
                                    </div>

                                    <div className="edit_cover">
                                        <div className="upload_container" style={{ display: coverFile ? "none" : "" }}>
                                            <div className="caption">
                                                Cover image. 1600x400 recommended.
                                            </div>
                                            <div className="choose_file_btn">
                                                Choose File
                                                <input type="file" value="" accept="image/*" onChange={handleCoverImg}/>
                                            </div>
                                        </div>

                                        <div className="preview_container" style={{ display: coverFile ? "" : "none" }}>
                                            <div className="close_container" style={{ display: coverImgHash ? "" : "none" }}>
                                                <CloseIcon onClick={() => closeCoverImg()} fontSize="small" />
                                            </div>
                                            <div className="media_container">
                                                <CircularProgress style={{ display: coverImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                                                <img className="img_preview" style={{ display: coverImgHash ? "" : "none" }} src={coverImgHash} alt=""/>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="my_form">
                                        <div className="row">
                                            <h3 className="label">Name</h3>
                                            <input onChange={e => setNewName(e.target.value)} value={newName} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Description</h3>
                                            <textarea onChange={e => setNewDescription(e.target.value)} value={newDescription} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Discord</h3>
                                            <input onChange={e => setNewDiscord(e.target.value)} value={newDiscord} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Twitter link</h3>
                                            <input onChange={e => setNewFacebook(e.target.value)} value={newFacebook} />
                                        </div>
                                        <div className="row">
                                            <h3 className="label">Instagram link</h3>
                                            <input onChange={e => setNewInstagram(e.target.value)} value={newInstagram} />
                                        </div>
                                        <div className="btn_div">
                                            <button className="cancel_btn" onClick={() => props.history.push(`/collection/${chain_id}/${collection}`)}>Cancel</button>
                                            <button className="submit_btn" onClick={() => updateCollection()}>
                                                {!updating ? 'Update' : <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="container">
                                <div className='title'>
                                    <h1>Please Connect Wallet</h1>
                                </div>
                            </div>
                    }
                </div>
            }
            <Footer />
        </div>
    );
}

export default EditCollection;
