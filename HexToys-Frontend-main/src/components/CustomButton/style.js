import styled from 'styled-components';

export const Button = styled.button`
  background-color: var(--colorOrange);
  color: white;
  border: 0;
  padding: 12px 30px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: ${props => props.size === 'medium' ? '16px' : '18px'};
  line-height: 1.3;
  letter-spacing: 0.025em;
  font-family: 'Roboto', sans-serif;
  height: ${props => props.size === 'large' ? '60px' : 'auto'};
  width: ${props => props.width || 'auto'};
  margin: ${props => props.margin || '0'};
  background-image: linear-gradient(134deg,#febc07,#f96d63 32%,#f0f);
  box-shadow: 0 15px 30px #7f6bff4d;
  &:hover{
      box-shadow: 0 15px 30px #7f6bff4d, 3px 3px 5px #00000055;
  }
`
