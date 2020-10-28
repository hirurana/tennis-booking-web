import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FormWrapper, { Form } from './FormWrapper'

const SignupForm = ({ email, action }) => {
    // set the default state of the form
    const [values, setValues] = useState()
    // update the state when a user types in the form
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    }

    const [error, setError] = useState('')

    return (
        <FormWrapper>
            <Form
                onSubmit={e => {
                    e.preventDefault()
                    if (values['password'] !== values['confirmPassword']) {
                        setError(`Passwords don't match`)
                        return
                    }
                    if (values['fullName'].length < 5) {
                        setError('Please enter your full name')
                        return
                    }
                    if (values['password'].length < 8) {
                        setError('Password must be at least 8 characters long')
                        return
                    }

                    action({
                        variables: { email, ...values },
                    })
                }}
            >
                <h2>Sign Up</h2>
                <label htmlFor="email">Email:</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    disabled
                />
                <label htmlFor="fullName">Full Name:</label>{' '}
                <input
                    required
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Name"
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
                <label htmlFor="confirmPassword">Password:</label>
                <input
                    required
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={onChange}
                />
                <div style={{ color: 'red', padding: '0.5em' }}>{error}</div>
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
