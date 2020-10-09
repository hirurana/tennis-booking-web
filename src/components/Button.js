import styled from 'styled-components'

const Button = styled.button`
    display: block;
    padding: 0 10px 0 10px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #f26640;
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
    :active {
        background-color: #f09f4c;
    }
`

export default Button
