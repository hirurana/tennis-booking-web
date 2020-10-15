import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Form } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client'

import ResetForm from '../components/Forms/ResetForm'
// import {}

// import UserForm from '../components/UserForm'
import { VERIFY_LINK } from '../gql/query'
import FormWrapper from '../components/Forms/FormWrapper'

const RESET_PASSWORD = gql`
    mutation resetPassword($link_uuid: String!, $password: String!) {
        resetPassword(link_uuid: $link_uuid, password: $password)
    }
`

// include the props passed to the component for later use
const ResetPassword = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Reset Password — UCL TB'
    })

    const { id: linkUUID } = useParams()

    const {
        data: verifier_data,
        loading: verifier_loading,
        error: verifier_error,
    } = useQuery(VERIFY_LINK, {
        variables: { uuid: linkUUID, signUp: false },
    })

    const [successful, setSuccessful] = useState(false)

    const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD, {
        variables: {},
        onCompleted: data => {
            console.log('RESET COMPLETE!!')
            setSuccessful(true)
        },
    })

    const history = useHistory()

    if (successful) {
        return (
            <FormWrapper>
                <Form style={{ textAlign: 'center' }}>
                    <h1>Password reset successful!</h1>
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

    if (verifier_data) {
        if (verifier_data.verifyLink === false) {
            return (
                <FormWrapper>
                    <Form>Invalid link!</Form>
                </FormWrapper>
            )
        }
    }

    return (
        <ResetForm
            action={data => {
                const payload = {
                    variables: { ...data.variables, link_uuid: linkUUID },
                }

                console.log(payload)
                resetPassword(payload)
            }}
        ></ResetForm>
    )
}

export default ResetPassword
