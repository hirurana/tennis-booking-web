import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FormWrapper, { Form } from './FormWrapper'

const SignupForm = ({ action }) => {
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
                <h2>Sign Up</h2>
                <label htmlFor="username">Full Name:</label>{' '}
                <input
                    required
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Name"
                    onChange={onChange}
                />
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
            </Form>

            {/* <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
                required
                type="password"
                id="confirmPassword"
                name="password"
                placeholder="Password"
                onChange={onChange}
            /> */}
        </FormWrapper>
    )
}
export default SignupForm
