import styled from 'styled-components';
// import angle from "../../assets/images/angle.svg";
import angleWhite from "../../assets/images/angle-white.svg";
import search from "../../assets/images/search.png";

export const Container = styled.div`
    min-height: 70vh;
    padding: 0rem 3rem;  
    padding-top: 120px;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0rem 0.5rem; 
        padding-top: 120px;
        h1 {
            padding: 12px;
            font-size: 1.5rem;
            display: block;
        }
    }
    h1 {
        text-align: center;        
        width: 100%;
        color: var(--textPrimaryColor);
        font-weight: 700;
        font-size: 2.2rem;
        margin: 0;
        margin-top: 20px;
        padding-bottom: 10px;
        display: inline-block;    
        span {
            padding-left: 10px;
            color: red;   
            cursor: pointer;
            font-weight: 900; 
        }
    }
`;

export const BodyContainer = styled.div`
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    @media(max-width:1199px){
        max-width: 780px;
    }
    @media(max-width:991px){
        max-width: 680px;
        padding: 0 10px;
    }    
`;

export const FilterBox = styled.div`
    margin: 20px 0;      
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
`;

export const Searchbar = styled.div`
    display: flex;
    flex-wrap: nowrap;
    > div{
        margin-bottom:20px;
    }
    input{
        height:40px;
        border: 1px solid rgba(190, 190, 190, 1);
        border-radius: 4px;
        padding: 8px 16px 8px 50px;
        font-family: TT Norms Pro;
        font-family: "Poppins",sans-serif;
        color: #878787;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        width: 100%;
        margin-bottom:20px;
        background-image: url(${search});
        background-repeat:no-repeat;
        background-position: 10px;
        background-size: 25px; 
    }
    div.totalcard{
        width: 160px; 
        margin-right: 10px;
    }    
    select{
        background: rgba(26, 26, 26, 1);
        border:0;
        color: #fff;
        font-family: TT Norms Pro;
        font-family: "Poppins",sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        height:40px;
        width:100%;
        display: inline-block;
        padding: 0 16px;
        border-radius: 4px;
        margin-right:8px;
        background-image: url(${angleWhite});
        background-repeat:no-repeat;
        background-position: right;
        background-size: 25px;
        display: inline-block;
        appearance: none;
    }
    .grid-btn{
        display: flex;
        > div{
            border-radius: 4px;
            padding: 6px 10px;
            display: flex;
            align-items:center;
            justify-content:center;
            background: #F2F2F2;
            &.selected{
                background: #F24822;
            }
            &:not(:last-child){
                margin-right:8px;
            }
        }
        
    }
`;
export const FilterContainer = styled.div`
    display: flex;
    @media(max-width:991px){
        display: block;
    }
`;

export const TabingWrap = styled.ul`
    border-radius: 5px;
    border: 1px solid #BEBEBE;
    margin:0; padding:0;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    li{
        font-family: Poppins;
        &.active{
            font-size: 15px;
            color: #F24822;
        }        
        display: inline-block;
        text-align: center;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 22px;
        padding: 7px 16px; 
        list-style: none;
        cursor: pointer;
        margin:0;
        border-radius: 4px;        
    }    
`;

export const RowContainer = styled.div`
    display: flex;
    flex-wrap: nowrap; 
    align-items: center;   
`;

export const CheckBoxContainer = styled.div`
    display: flex;
    flex-wrap: nowrap; 
    margin-right: 20px;
    p {
        font-family: Poppins;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        margin: 0;
        padding-left: 5px;        
    }
`;







export const AllStaking = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0;
        display: block;
    }
`;

export const LoadMore = styled.div`
    margin: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    button {
        font-family: 'Poppins',sans-serif;
        font-size: 15px;
        font-weight: 800;
        line-height: 15px;
        -webkit-letter-spacing: 0em;
        -moz-letter-spacing: 0em;
        -ms-letter-spacing: 0em;
        letter-spacing: 0em;
        text-align: center;
        background: #F24822;
        color: #fff;
        border-radius: 8px;
        padding: 15px 20px;
        border: none;
    }
`;
