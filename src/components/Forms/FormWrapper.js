import React from 'react'
import styled from 'styled-components'
import Hero from '../../img/hero.mp4'

const Wrapper = styled.div`
    border: 1px solid #f5f4f0;
    max-width: 500px;
    padding: 1em;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 16px;
`

const HeroVideo = styled.video`
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    transform: translateX(-50%) translateY(-50%);
    object-fit: fill;
    background-size: cover;
    transition: 1s opacity;
`

export const Form = styled.form`
    label,
    background_color: #fff,
    input {
        display: block;
        line-height: 2em;
    }
    input {
        width: 100%;
        margin-bottom: 1em;
    }
`

const FormWrapper = ({ children }) => {
    return (
        <Wrapper>
            <HeroVideo autoPlay loop muted>
                <source src={Hero} type="video/mp4" />
            </HeroVideo>
            {children}
        </Wrapper>
    )
}

export default FormWrapper
