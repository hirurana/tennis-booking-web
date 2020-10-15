import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FormWrapper, { Form } from './FormWrapper'

const SigninForm = ({ action, error }) => {
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
        <FormWrapper>
            <Form
                onSubmit={e => {
                    e.preventDefault()
                    action({
                        variables: { ...values },
                    })
                }}
            >
                <h2>Sign In</h2>
                <label htmlFor="email">Email:</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={onChange}
                />
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
                    {error && (
                        <p style={{ color: 'red' }}>
                            Invalid email or password!
                        </p>
                    )}
                    <Button type="submit">Submit</Button>
                </React.Fragment>
                <a href="/forgotpassword" style={{ float: 'right' }}>
                    {' '}
                    Forgot Password
                </a>
            </Form>
        </FormWrapper>
    )
}
export default SigninForm
