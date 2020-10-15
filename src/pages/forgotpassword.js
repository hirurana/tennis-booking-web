import React, { useEffect, useState } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import FormWrapper from '../components/Forms/FormWrapper'
import ForgotForm from '../components/Forms/ForgotForm'

import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import { isObjectType } from 'graphql'
const FORGOT_PASSWORD = gql`
    mutation createLink($email: String!) {
        createLink(email: $email) {
            uuid
        }
    }
`
const ForgotPassword = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Forgot Password — UCL TB'
    })

    const [submitted, setSubmitted] = useState(false)
    const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD, {
        onError: error => {
            console.error(error)
            setSubmitted(true)
        },
        onCompleted: data => {
            console.log('onCompleted')
            setSubmitted(true)
        },
    })

    return <ForgotForm action={forgotPassword} successful={submitted} />
}
export default ForgotPassword
