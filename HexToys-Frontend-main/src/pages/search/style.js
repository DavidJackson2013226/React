import styled from 'styled-components';

export const Container = styled.div`
    padding-top: 100px;
    text-align: left;
    width: 90%;
    margin: 1rem auto;
    h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--textLightColor);
        span {
            color: var(--textPrimaryColor);
        }
    }
    @media only screen and (max-width: 450px) {
        padding-top: 90px;
        h1 {
            font-size: 1.5rem;
        }
    }
`;