import React, { useEffect, useState } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import FormWrapper from '../components/Forms/FormWrapper'
import ForgotSignupForm from '../components/Forms/ForgotSignupForm'

import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import { isObjectType } from 'graphql'
const FORGOT_SIGNUP = gql`
    mutation createLink($email: String!) {
        createLink(email: $email)
    }
`
const ForgotSignup = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up — UCL TB'
    })

    const [submitted, setSubmitted] = useState(false)
    const [forgotPassword, { loading, error }] = useMutation(FORGOT_SIGNUP, {
        onError: error => {
            console.error(error)
            setSubmitted(true)
        },
        onCompleted: data => {
            console.log('onCompleted')
            setSubmitted(true)
        },
    })

    return <ForgotSignupForm action={forgotPassword} successful={submitted} />
}
export default ForgotSignup
