import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
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
            <video
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',
                    width: '100%',
                    left: '50%',
                    top: '50%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%,-50%)',
                    zIndex: '-1',
                }}
            >
                <source src={Hero} type="video/mp4" />
            </video>
            {/* Display the appropriate form header */}
            {props.formType === 'signup' ? (
                <h2>Sign Up</h2>
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
                <label htmlFor="password">Password:</label>
                <input
                    required
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={onChange}
                />
                <Button type="submit">Submit</Button>
                {props.formType === 'signIn' ? <p>Forgot Password</p> : null}
            </Form>
        </Wrapper>
    )
}
export default UserForm
