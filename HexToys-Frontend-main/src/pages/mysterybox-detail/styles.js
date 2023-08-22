import styled from 'styled-components';

export const Container = styled.div`
    min-height: 70vh;
    padding-top: 70px;
    padding-bottom: 60px;
    @media(max-width:450px){        
        padding-top: 65px;
        .mysterybox-header .mysterybox-header-user-context {
            flex-flow: column;
            align-items: center;
            top: 20%;
            width: 100%;
            left: 0;
            margin: 0 auto;
        }
        .mysterybox-header-user-context .mysterybox-content-box {
            flex-flow: column;
            align-items: center;            
        }
        .mysterybox-content-box .mysterybox-content {
            text-align: center;
            margin: 0;
            width: 95%;
        }

        .cards-content .all-cards {
            padding: 0;
            display: block;            
        }
    }    
    .mysterybox-header {
        position: relative;
        padding: 100px 100px;
        background: linear-gradient(90deg,#abeced,#e0eba194);
        .mysterybox-header-user-context {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;  
            img {
                width: 300px;
                aspect-ratio: 1/1;
                border-radius: 50%;
                object-fit: cover;
                box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
                border: 5px solid white;
                background: white;
            }
            .mysterybox-content-box {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                padding: 8px;                
            }
            .user-setting-container{
                @media(max-width:991px){ 
                    position: fixed;
                    top: 120px;
                    right: 20px;
                }                
            }
            .mysterybox-content {
                min-width: 300px;
                text-align: left;
                margin-left: 5%;
                h1 {
                    font-size: 2.5rem;
                    margin: 0;
                    font-weight: 700;
                    color: var(--textPrimaryColor);
                }
                h2{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .price-content {
                    margin-top: 12px; 
                    border: 1px solid #d9602b;
                    border-radius: 16px;
                    margin-left: 0!important;
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.5%;
                    .price-sub-content {
                        flex: 0 0 48%;
                        max-width: 48%;  
                        position: relative;
                        width: 100%;
                        text-align: center;
                        .inline-block{
                            display: inline-block;
                        }
                        .price-detail{
                            font-weight: 600;
                        }                        
                    }
                    .price-middle-content {
                        flex: 0 0 3%;
                        position: relative;
                        width: 100%;
                        padding: 1.5%;
                        text-align: center;
                        div{
                            width: 1px;
                            height: 100%;
                            background: #d9602b;
                        }

                    }
                }
                .action-container {
                    margin-top: 20px;
                    .action-unlock {
                        display: inline-block;
                        cursor: pointer;
                        color: #fff;
                        font-weight: 700;
                        background: linear-gradient(90deg,#9c5227,#f17f3c);
                        border-radius: 100px;
                        padding: 0.75rem 1.75rem;
                        font-size: 1.125rem;
                        line-height: 1.5;
                    }                    
                }                
            }
            .user-setting {
                padding: 10px;
                display: flex;
                align-items: center;
                background: var(--buttonColor);
                color: white;
                border-radius: 50%;
                svg{
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }
    @media(max-width:991px){ 
        .mysterybox-header {
            position: relative;
            padding: 100px 50px;
        }
        .cards-content {
            max-width: 680px;
        }
    }
    @media(max-width:1199px){ 
        .cards-content {
            max-width: 780px;
        }
    }  
    .cards-content {
        width: 95%;
        margin: 1rem auto;
        max-width: 1480px;  
        padding: 0 20px;
        position: relative;
        h1{
            background: linear-gradient(90deg,#b78524,#f5eccf);
            -webkit-background-clip: text;
            -moz-background-clip: text;
            -webkit-text-fill-color: transparent; 
            -moz-text-fill-color: transparent;
            span {
                padding-left: 10px;
                background: linear-gradient(90deg,#dc7437,#f24822);
                -webkit-background-clip: text;
                -moz-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        } 
        .all-cards {
            display: flex;
            flex-wrap: wrap;    
            justify-content: center;
        }
        .load-more{
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
        }  
    }
    .ant-modal-root{
        *, ::after, ::before {
            box-sizing: border-box;
        }
        .ant-modal-mask{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            height: 100%;
            background-color: rgba(0,0,0,.45);
            *, ::after, ::before {
                box-sizing: border-box;
            }
        }
        .ant-modal-wrap{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: auto;
            outline: 0;
            -webkit-overflow-scrolling: touch;
            z-index: 1000;
            *, ::after, ::before {
                box-sizing: border-box;
            }
        }
    }  
`;