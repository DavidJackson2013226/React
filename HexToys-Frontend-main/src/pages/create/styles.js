import styled from 'styled-components';
import {PlusCircle} from "@styled-icons/feather";

export const Container = styled.div`
    margin 48px auto;
    max-width: 1200px;
    @media only screen and (max-width: 767px) {
        padding-left: 16px;
        padding-right : 16px;
    }
`;

export const Title = styled.div`
    width: 100%;
    padding-top: 80px;
    padding-bottom: 0px;
    @media only screen and (max-width: 767px) {
        padding-top: 64px;
    }
    h1{
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(90deg,#f0f,#8dc4fa 62%,#0ff);
        -webkit-background-clip: text;
        background-clip: text;
        font-size: 64px;
        font-weight: 700;
        line-height: 1.5;
        @media only screen and (max-width: 767px) {
            font-size: 58px;
        }
    }
`;

export const UploadField = styled.div`
    margin: 40px 0px;
`;

export const SelectCollection = styled.div`
    margin: 40px 0px;
`;

export const Collections = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-box-pack: start;
    justify-content: flex-start;
`;


export const collection = styled.div`
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 180px;
    min-height: 180px;
    width: 180px;
    height: 180px;
    border-radius: 12px;
    margin: 8px;
    transition : all 0.3s ease;
    cursor : pointer;
    position : relative;
    box-shadow: 0 3px 6px #7f6bff4d;
    .content{
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        display: flex;
        text-align: center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 10px;
    }
    &::after{
        content : "";
        position : absolute;
        width : 100%;
        height : 100%;
        top : 0;
        left : 0;
        background-image: linear-gradient(90deg,#f0f,#8dc4fa 62%,#0ff);
        border-radius: 12px;
        z-index : -1;
        transition : all 0.3s ease;
        filter : grayscale(1)
    }
    &:hover{
        transform : translateY(-8px);
    }
    &.active {
        &::after{
            filter : grayscale(0)
        }
    }
`;

export const CollectionPlusIcon = styled(PlusCircle)`

`;


export const CollectionIcon = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
`;


export const CollectionName = styled.div`
    color: #1E2026;
    font-weight: bold;
    font-size: 16px;    
    margin-top: 12px;
`;

export const CollectionType = styled.div`
    color: grey;
    font-size: 14px;
`;


export const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: dotted 1px grey;
    border-radius: 12px;
    height: 200px;
`;

export const PreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: dotted 1px grey;
    border-radius: 12px;
    height: 200px;
`;
export const MediaContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    height: 160px;
`;
export const CloseIconContainer = styled.div`
    width: 100%;
    margin-left: -5px;
    margin-top: 5px;
    text-align: right;
`;

export const ImagePreview = styled.img`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;

export const VideoPreview = styled.video`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;

export const AudioPreview = styled.audio`
  border-radius: 6px;
  max-width: 80%;
  max-height: 100%;
`;



export const ChooseFileBtn = styled.div`
  display: inline-block;
    position: relative;
    padding: 10px 20px;
    border-radius: 20px;
    margin-top: 20px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    background-image: linear-gradient(108deg,#f0f 16%,#0ff);
    box-shadow: 0 15px 30px #7f6bff4d;
    transition : all 0.3s ease;
    cursor: pointer;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
`;

export const UploadCaption = styled.div`
    font-size: 14px;
    color: grey;
`;

export const FileInput = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    cursor: pointer;
`;

export const Form = styled.div`
    margin-top: 20px;
    .property-add-button {
        background: transparent;
        border: none;
        vertical-align: middle;
        svg {
            font-size: 26px;
            border-radius: 8rem;
            border: 2px solid var(--textPrimaryColor);
            padding: 3px;
        }
    }
    .ant-input-group{
        display: flex;
    }
    .property-remove-button{
        background: transparent;
        border: none;
        vertical-align: middle;
    }
`;

export const Field = styled.div`
    margin: 40px 0px;
    .ant-input-group{
        grid-area : auto;
        gap : 16px;
        .ant-input{
            border-radius : 8px;
            &:hover{
                border-color : #ff00ff55;
            }
            &:focus{
                box-shadow : 0px 0px 5px #ff00ff55;
                border-color : #ff00ff55;
            }
        }
    }
    .property-remove-button{
        transition : all 0.3s ease;
        cursor : pointer;
        svg{
            fill : #ff2718
        }
        &:hover{
            opacity : 0.7;
        }
    }
`;

export const Label = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    span{
        color: grey;
        font-size: 14px;
    }
`;

export const Input = styled.input`
    width: 100%;
    border: unset;
    border: 1px solid #ff00ff88;
    border-radius : 8px;
    font-size: 16px;
    padding: 8px;
    &:focus-visible{
        outline: unset;
    }
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

export const Option = styled.div`
    margin-top: 4px;
    font-size : 14px;
`;

export const Actions = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0; 
`;

export const CreateBtn = styled.div`
    padding: 12px 40px;
    background-color: #f96d63;
    background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
    font-size: 18px;
    color: white;
    border-radius: 44px;
    cursor: pointer;
    box-shadow: 0 15px 30px #7f6bff4d;
    transition : all 0.3s ease;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
`;

export const SelectCategory = styled.select`
    width: 100%;
    border: unset;
    border: 1px solid #ff00ff88;
    border-radius : 8px;
    font-size: 14px;
    padding: 8px;
    &:focus-visible{
        outline: unset;
    }
`;


export const SelectCategoryOption = styled.option`

`;

export const ModalBody = styled.div`
  padding: 8px 12px;
`;

export const ModalTitle = styled.div`
  margin-bottom: 24px;
  font-weight: bold;
  font-size: 24px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;  
  margin-bottom: 5px;
`;

export const ContentDetail = styled.div`
  margin: 20px 0 0 0;

   @media (min-width: 768px) {
    margin: 0 0 0 20px;
   }
`;

export const ModalAction = styled.div`
  width: 100%;
  text-align: center;
`;

export const ModalButton = styled.div`
    padding: 12px 40px;
    background-color: #f96d63;
    background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
    font-size: 18px;
    color: white;
    border-radius: 24px;
    cursor: pointer;
    box-shadow: 0 15px 30px #7f6bff4d;
    transition : all 0.3s ease;
    &:hover{
        box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
    }
`;
