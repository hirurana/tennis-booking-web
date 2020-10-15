import React, { useEffect } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import FormWrapper from '../components/Forms/FormWrapper'
import SigninForm from '../components/Forms/SigninForm'

import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
const SIGNIN_USER = gql`
    mutation signIn($email: String, $password: String!) {
        signIn(email: $email, password: $password)
    }
`
const SignIn = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign In — UCL TB'
    })
    const client = useApolloClient()
    const [signIn, { loading, error }] = useMutation(SIGNIN_USER, {
        onCompleted: data => {
            // store the token
            localStorage.setItem('token', data.signIn)
            // update the local cache
            client.writeData({ data: { isLoggedIn: true } })
            // redirect the user to the homepage
            props.history.push('/')
        },
    })
    return (
        <React.Fragment>
            <FormWrapper>
                <SigninForm action={signIn} error={!!error}></SigninForm>
            </FormWrapper>
        </React.Fragment>
    )
}
export default SignIn
