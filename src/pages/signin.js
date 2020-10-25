import React, { useContext, useEffect } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import FormWrapper from '../components/Forms/FormWrapper'
import SigninForm from '../components/Forms/SigninForm'

import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import { LoggedIn, UserData } from '../Contexts'
import { useHistory } from 'react-router-dom'
const SIGNIN_USER = gql`
    mutation signIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password)
    }
`
const SignIn = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign In — UCL TB'
    })

    const { logIn } = useContext(LoggedIn)
    const { userDataRefetch } = useContext(UserData)

    const [signIn, { loading, error }] = useMutation(SIGNIN_USER, {
        onCompleted: data => {
            // store the token
            localStorage.setItem('token', data.signIn)
            userDataRefetch()
            logIn()
        },
    })
    return (
        <FormWrapper>
            <SigninForm
                action={(...args) => {
                    console.log('signin')
                    signIn(...args)
                }}
                error={!!error}
            ></SigninForm>
        </FormWrapper>
    )
}
export default SignIn
