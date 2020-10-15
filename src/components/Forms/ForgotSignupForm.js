import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FormWrapper, { Form } from './FormWrapper'

const ForgotSignupForm = ({ action, successful }) => {
    // set the default state of the form
    const [values, setValues] = useState()
    // update the state when a user types in the form
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    }

    if (successful) {
        return (
            <FormWrapper>
                <Form>Email sent! Check your inbox in a few moments</Form>
            </FormWrapper>
        )
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
                <p>
                    Enter the email you used to join the society and a unique
                    link to sign up from will be sent to your inbox.
                </p>
                <label htmlFor="email">Email:</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={onChange}
                />
                <Button type="submit">Send Link</Button>
            </Form>
        </FormWrapper>
    )
}
export default ForgotSignupForm
