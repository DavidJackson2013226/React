import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import toast from "react-hot-toast";

import Modal from "react-modal";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Element from "./style";
import { getIpfsHash, getIpfsHashFromFile } from "../../utils/ipfs";
import { createMysteryBox } from "../../utils/contracts";
import { getCurrencyInfoFromAddress, Tokens } from "../../utils";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ModalCreateMysteryBox(props) {
  const { showCreateMysteryBox, setShowCreateMysteryBox } = props;

  const { account, chainId, library } = useWeb3React();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [putPrice, setPutPrice] = useState(0);
  const [currencyInfo, setCurrencyInfo] = useState(null);
  useEffect(() => {
    if (!!chainId) {
      setCurrencyInfo(Tokens?.[chainId][0])
    }
  }, [chainId])


  const [creating, setCreating] = useState(false)

  const [logoFile, setLogoFile] = useState(null);
  const [logoImgHash, setLogoImgHash] = useState("");
  const [logoImgUploading, setLogoImgUploading] = useState(false);

  function handleLogoImg(event) {
    const fileType = event.target.files[0].type.split("/")[0];
    if (fileType === "image") {
      setLogoFile(event.target.files[0]);
      setLogoImgUploading(true);
      getIpfsHashFromFile(event.target.files[0]).then((hash) => {
        setLogoImgHash(`https://ipfs.hex.toys/ipfs/${hash}`);
        setLogoImgUploading(false);
      });
    }
  }
  function closeLogoImg() {
    setLogoFile(null);
    setLogoImgHash("");
    setLogoImgUploading(false);
  }

  const createNewMysteryBox = async () => {
    if (!currencyInfo) {
      toast.error("Please select currency");
      return;
    }
    if (logoImgHash === "") {
      toast.error("Please select image");
      return;
    }
    if (name === "") {
      toast.error("Please Input Name");
      return;
    }
    if (description === "") {
      toast.error("Please Input Description");
      return;
    }
    if (putPrice <= 0) {
      toast.error("Please Input price correctly");
      return;
    }

    const openseadata = {
      name: name,
      description: description,
      image: logoImgHash
    };
    setCreating(true);
    const load_toast_id = toast.loading("Please wait for creating mysterybox...");    
    getIpfsHash(openseadata).then((hash) => {
      let uri = `https://ipfs.hex.toys/ipfs/${hash}`;
      createMysteryBox(
        name,
        uri,
        currencyInfo.address,
        putPrice,
        chainId,
        library.getSigner()
      ).then(async (result) => {
        toast.dismiss(load_toast_id);
        if (result) {
          toast.success("MysteryBox is created! Data will be synced after some block confirmation...");
          setCreating(false);
          await sleep(2000);
          window.location.reload();
          return;
        } else {
          toast.error("Failed Transaction!");          
          setCreating(false);
          return;
        }
      });
    });
  };

  function closeCreateMysteryBox() {
    setShowCreateMysteryBox(false);
    setName("");
    setDescription("");
  }

  return (
    <Modal
      isOpen={showCreateMysteryBox}
      onRequestClose={() => closeCreateMysteryBox()}
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
      {
        account && chainId &&
        <Element.ModalBody>
          <Element.ModalHeader>
            <Element.ModalCloseIcon size={32} onClick={() => closeCreateMysteryBox()} />
          </Element.ModalHeader>

          <Element.ModalContent>
            <Element.UploadContainer style={{ display: logoFile ? "none" : "" }}>
              <Element.UploadCaption> Logo image. 400x400 recommended.</Element.UploadCaption>
              <Element.ChooseFileBtn>
                Choose File
                <Element.FileInput type="file" value="" accept="image/*" onChange={handleLogoImg} />
              </Element.ChooseFileBtn>
            </Element.UploadContainer>

            <Element.PreviewContainer style={{ display: logoFile ? "" : "none" }}>
              <Element.CloseIconContainer style={{ display: logoImgHash ? "" : "none" }}>
                <CloseIcon onClick={() => closeLogoImg()} fontSize="small" />
              </Element.CloseIconContainer>
              <Element.MediaContainer>
                <CircularProgress style={{ display: logoImgUploading ? "" : "none", width: "30px", height: "30px", color: "#37b5fe" }} />
                <Element.ImagePreview style={{ display: logoImgHash ? "" : "none" }} src={logoImgHash} />
              </Element.MediaContainer>
            </Element.PreviewContainer>
          </Element.ModalContent>

          <Element.MysteryBoxContainer>
            <div className="dialog-item">
              <h3> Name </h3>
              <input value={name}
                onChange={(e) => { setName(e.target.value) }}
                placeholder="Enter MysteryBox name" />
            </div>

            <div className="dialog-item">
              <h3>Description</h3>
              <input value={description}
                onChange={(e) => { setDescription(e.target.value) }}
                placeholder="Describe something about the MysteryBox" />
            </div>

            <Element.InputContainer>
              <Element.Input type={"number"} placeholder={"Enter Price"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
              <Element.CurrencySelect name={"currencies"} onChange={event => setCurrencyInfo(getCurrencyInfoFromAddress(chainId, event.target.value))}>
                {
                  Tokens?.[chainId].map((currencyItem, index) =>
                    <Element.OrderByOption key={index} value={currencyItem.address}>{currencyItem.symbol}</Element.OrderByOption>
                  )
                }
              </Element.CurrencySelect>
            </Element.InputContainer>

            <div className="dialog-item">
              <button onClick={createNewMysteryBox} disabled={creating} htmltype="submit">
                {
                  creating ? <CircularProgress style={{ width: "16px", height: "16px", color: "white" }} />
                    :
                    <> Create </>
                }
              </button>
            </div>
          </Element.MysteryBoxContainer>
        </Element.ModalBody>
      }      
    </Modal>
  );
};

export default ModalCreateMysteryBox;
