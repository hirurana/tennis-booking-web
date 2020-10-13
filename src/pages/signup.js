import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client'

import UserForm from '../components/UserForm'
import { VERIFY_LINK } from '../gql/query'

const SIGNUP_USER = gql`
    mutation signUp($email: String!, $username: String!, $password: String!) {
        signUp(email: $email, username: $username, password: $password)
    }
`

const Wrapper = styled.div`
    border: 1px solid #f5f4f0;
    max-width: 500px;
    padding: 1em;
    margin: 0 auto;
`
const Form = styled.form`
    label,
    input {
        display: block;
        line-height: 2em;
    }
    input {
        width: 100%;
        margin-bottom: 1em;
    }
`

// include the props passed to the component for later use
const SignUp = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up — UCL TB'
    })

    const [values, setValues] = useState()
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        })
    }
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up — TB'
    })

    // Apollo Client
    const client = useApolloClient()

    const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
        onCompleted: data => {
            // store the token
            localStorage.setItem('token', data.signUp)
            //update the local cache
            client.writeData({ data: { isLoggedIn: true } })
            // redirect user to homepage
            props.history.push('/')
        },
    })

    //check the link
    const {
        data: verifier_data,
        loading: verifier_loading,
        error: verifier_error,
    } = useQuery(VERIFY_LINK, {
        variables: { uuid: props.match.params.id },
    })

    if (verifier_loading) {
        return 'loading...'
    }

    return (
        <React.Fragment>
            {verifier_data.verifyLink ? (
                <React.Fragment>
                    <UserForm action={signUp} formType="signup" />
                    {loading && <p>Loading...</p>}
                    {error && <p>Error creating an account!</p>}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p>Invalid link</p>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default SignUp
