import React, {useState,useEffect} from "react";
import { useWeb3React } from '@web3-react/core'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import toast from "react-hot-toast";

import './edit_profile.scss';
import Header from '../header/header';
import { Footer } from '../footer/footer'
import { getIpfsHashFromFile } from "../../utils/ipfs";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function EditProfile(props) {
    const { user, login } = props;    
    const [userProfile, setUserProfile] = useState(undefined);
    const { account, active, library } = useWeb3React();
    const [updating, setUpdating] = useState(false);
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newTwitter, setNewTwitter] = useState("");
    const [newInstagram, setNewInstagram] = useState("");
    const [newProfilePicSrc, setNewProfilePicSrc] = useState("");
    const [imgUploading, setImgUploading] = useState(false);

    useEffect(() => {
        if(user && account && active) {
          login();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, account, active, library])

    async function updateProfile(){        
        setUpdating(true);
        const data = new FormData();
        data.append("address", account);
        data.append("name", newName || "NoName");
        data.append("bio", newBio || "");
        data.append("email", newEmail || "");
        data.append("twitter", newTwitter || "");
        data.append("instagram", newInstagram || "");
        data.append("profilePic", newProfilePicSrc || "");

        axios.post(`${process.env.REACT_APP_API}/user/update`, data)
        .then(async (res) => {            
            setUpdating(false);
            await sleep(1000);
            props.history.push(`/profile/${account}`);
        })
        .catch(err => {
            setUpdating(false);
            toast.error(err.response.data.message);            
        })
    }

    useEffect(() => {        
        if (account && !userProfile){
          getUser();
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, account, active, userProfile])

    function getUser(){
        axios.get(`${process.env.REACT_APP_API}/user_info/${account}`)
        .then(res => {            
          setUserProfile(res.data.user);
          setNewProfilePicSrc(res.data.user.profilePic);
          setNewName(res.data.user.name);
          setNewBio(res.data.user.bio);
          setNewEmail(res.data.user.email);
          setNewTwitter(res.data.user.twitter);
          setNewInstagram(res.data.user.instagram);
        })
    }

    function handleFile(event) {        
        const fileType = event.target.files[0].type.split("/")[0];
        if (fileType === "image") {
            setFile(event.target.files[0]);
            setImgUploading(true);
            getIpfsHashFromFile(event.target.files[0]).then((hash) => {
                setNewProfilePicSrc(`https://ipfs.hex.toys/ipfs/${hash}`);
                setImgUploading(false);
            });
        }        
    }

    return (    
        <div>
            <Header {...props}/>
            <div className="edit_profile">
            {account?
                <div className="container">
                    <div className='title'>
                        <h1>Edit Profile</h1>
                    </div>
                    <div className="wrapper">
                        <div className="edit_avatar">
                            <div className="edit_content">
                                <img src={newProfilePicSrc ? newProfilePicSrc : "/profile.png"} alt = ''/>
                                <div className="camera_icon"><i class="fas fa-camera"></i></div>
                                <input type="file" accept="image/*" multiple={false} onChange={handleFile}/>     
                            </div>
                            <a className="img_link" href={newProfilePicSrc && !imgUploading ? newProfilePicSrc : '/'} target='_blank' rel="noreferrer noopener">
                                {file && !imgUploading ? "Uploaded!" : imgUploading ? "uploading to IPFS..." : ""} 
                            </a>                       
                        </div>
                        <div className="my_form">
                            <div className="row">
                                <h3 className="label">Name</h3>
                                <input onChange={e => setNewName(e.target.value)} value={newName}/>
                            </div>
                            <div className="row">
                                <h3 className="label">Bio</h3>
                                <textarea onChange={e => setNewBio(e.target.value)} value={newBio}/>
                            </div>
                            <div className="row">
                                <h3 className="label">Email</h3>
                                <input onChange={e => setNewEmail(e.target.value)} value={newEmail}/>
                            </div>
                            <div className="row">
                                <h3 className="label">Twitter link</h3>
                                <input onChange={e => setNewTwitter(e.target.value)} value={newTwitter}/>
                            </div>
                            <div className="row">
                                <h3 className="label">Instagram link</h3>
                                <input onChange={e => setNewInstagram(e.target.value)} value={newInstagram}/>
                            </div>
                            <div className="btn_div">
                                <button className="cancel_btn" onClick={() => props.history.push(`/profile/${account}`) }>Cancel</button>
                                <button  className="submit_btn"onClick={() => updateProfile()}>
                                    {!updating ? 'Update' : <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>:
                <div className="container">
                    <div className='title'>
                        <h1>Please Connect Wallet</h1>
                    </div>
                </div>
            }
            </div>
            <Footer />            
        </div>    
    );    
}

export default EditProfile;
