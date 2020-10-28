import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Form } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client'

import SignupForm from '../components/Forms/SignupForm'
// import {}

// import UserForm from '../components/UserForm'
import { VERIFY_LINK } from '../gql/query'
import FormWrapper from '../components/Forms/FormWrapper'

const SIGNUP_USER = gql`
    mutation signUp(
        $link_uuid: String!
        $fullName: String!
        $password: String!
    ) {
        signUp(link_uuid: $link_uuid, fullName: $fullName, password: $password)
    }
`

// include the props passed to the component for later use
const SignUp = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up — UCL TB'
    })

    const { id: linkUUID } = useParams()

    const {
        data: verifier_data,
        loading: verifier_loading,
        error: verifier_error,
    } = useQuery(VERIFY_LINK, {
        variables: { uuid: linkUUID, signUp: true },
    })

    const [successful, setSuccessful] = useState(false)

    const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
        variables: {},
        onCompleted: data => {
            console.log('SIGNUP COMPLETE!!')
            setSuccessful(true)
        },
    })

    const history = useHistory()

    if (successful) {
        return (
            <FormWrapper>
                <Form style={{ textAlign: 'center' }}>
                    <h1>Sign up successful!</h1>
                    Head to the sign in page.
                    <br />
                    <Button
                        style={{ margin: '1em 0' }}
                        onClick={() => {
                            history.push('/signin')
                        }}
                    >
                        Take me there!
                    </Button>
                </Form>
            </FormWrapper>
        )
    }

    if (verifier_loading) {
        return (
            <FormWrapper>
                <Form>Loading...</Form>
            </FormWrapper>
        )
    }

    if (verifier_error) {
        return (
            <FormWrapper>
                <Form>Invalid link!</Form>
            </FormWrapper>
        )
    }

    console.log(verifier_data)

    if (verifier_data) {
        if (verifier_data.verifyLink.success === false) {
            return (
                <FormWrapper>
                    <Form>Invalid link!</Form>
                </FormWrapper>
            )
        }
    }

    return (
        <SignupForm
            email={verifier_data.verifyLink.email}
            action={data => {
                const payload = {
                    variables: { ...data.variables, link_uuid: linkUUID },
                }

                console.log(payload)
                signUp(payload)
            }}
        ></SignupForm>
    )
}

export default SignUp
