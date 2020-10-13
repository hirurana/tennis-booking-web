import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'

import Hero from '../img/hero.mp4'

const Wrapper = styled.div`
    border: 1px solid #f5f4f0;
    max-width: 500px;
    padding: 1em;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 16px;
`
const Form = styled.form`
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

const UserForm = props => {
    // set the default state of the form
    const [values, setValues] = useState()
    // update the state when a user types in the form
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    }

    return (
        <Wrapper>
            <HeroVideo autoPlay loop muted>
                <source src={Hero} type="video/mp4" />
            </HeroVideo>
            {/* Display the appropriate form header */}
            {props.formType === 'signup' ? (
                <h2>Sign Up</h2>
            ) : props.formType === 'forgotPassword' ? (
                <React.Fragment>
                    <h2>Forgot Password</h2>
                    <p>
                        If the account exists, a password reset link will be
                        emailed
                    </p>
                </React.Fragment>
            ) : (
                <h2>Sign In</h2>
            )}{' '}
            {/* perform the mutation when a user submits the form */}
            <Form
                onSubmit={e => {
                    e.preventDefault()
                    props.action({
                        variables: { ...values },
                    })
                }}
            >
                {props.formType === 'signup' && (
                    <React.Fragment>
                        <label htmlFor="username">Username:</label>{' '}
                        <input
                            required
                            type="text"
                            id="username"
                            name="username"
                            placeholder="username"
                            onChange={onChange}
                        />{' '}
                    </React.Fragment>
                )}
                <label htmlFor="email">Email:</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={onChange}
                />
                {props.formType != 'forgotPassword' ? (
                    <React.Fragment>
                        <label htmlFor="password">Password:</label>
                        <input
                            required
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={onChange}
                        />
                        {props.error && (
                            <p style={{ color: 'red' }}>
                                Invalid Username/Password
                            </p>
                        )}
                        <Button type="submit">Submit</Button>
                    </React.Fragment>
                ) : (
                    <Button type="submit">Send Link</Button>
                )}
                {props.formType === 'signIn' ? (
                    <a href="/forgotpassword" style={{ float: 'right' }}>
                        {' '}
                        Forgot Password
                    </a>
                ) : null}
            </Form>
        </Wrapper>
    )
}
export default UserForm
