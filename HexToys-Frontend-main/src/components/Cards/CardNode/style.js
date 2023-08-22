
import styled from 'styled-components';

export const Container = styled.div`
    border: 1px solid var(--lightGrayColor);
    border-radius: 1rem;
    /* padding: 1.5rem; */
    margin: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.08);
    background: var(--backgroundWhiteColor);
    flex: 0 1 300px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .card-preview{
        border-radius: 12px;
        overflow: hidden;
        background: var(--lightGrayColor);
        height: 240px;  
        cursor: pointer;
        img{
            object-fit: cover;
            border-radius: 12px;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;
        }
    }
    .card-main-content{
        padding: 1rem;
        padding-top: 0;
        .card-footer{
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            text-align: left;
            margin-top: 1rem;
            .card-content{
                h2{
                    margin: 0;
                    color: var(--textPrimaryColor);
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    position: relative;                    
                }
                h3{
                    margin: 0;
                    color: var(--textPrimaryColor);
                    font-size: 0.9rem;
                    font-weight: 700;
                }
            }
        }
        .card-node-header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1rem;
            .card-node-heart{
                display: flex;
                align-items: center;
            }
            p{
                margin: 0;
                font-weight: 600;
                color: var(--textLightColor);
            }
        }
    }
`;