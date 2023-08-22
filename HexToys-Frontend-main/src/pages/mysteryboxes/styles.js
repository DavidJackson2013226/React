import styled from 'styled-components';

export const Container = styled.div`
    min-height: 70vh;
    padding: 0rem 3rem;  
    padding-top: 120px;
    justify-content: center;
    @media only screen and (max-width: 450px) {
        padding: 0rem 1rem; 
        padding-top: 120px;
        .all-mysteryboxes {
            padding: 0;
            display: block;
        }
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
            color: red;   
            cursor: pointer; 
        }
    }
    .all-mysteryboxes {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .load-more{
        margin: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
    }    
`

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
    }
    .filterBox{
        margin: 20px 0;      
        display: flex;
        justify-content: center;  
        .mysterybox-box{
            display: flex;
            width: 100%;
            max-width: 1000px;
            @media(max-width:1199px){
                max-width: 500px;
            }
        }
        .form-search{
            background-color:#EBEBEB;
            background-position:left 40px center;
            background-repeat: no-repeat;
            padding: 0 40px;
            padding-left: 76px;
            border: none;
            border-radius: 50px;
            height: 60px;
            font-size: 20px;
            flex: 1;            
        }
    }
    input{
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
    }    
`