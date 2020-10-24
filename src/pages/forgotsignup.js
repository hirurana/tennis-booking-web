import React, { useEffect, useState } from 'react'
import { useMutation, useApolloClient, gql } from '@apollo/client'
import FormWrapper from '../components/Forms/FormWrapper'
import ForgotSignupForm from '../components/Forms/ForgotSignupForm'

import { CREATE_UNIQUE_LINK } from '../gql/mutation'

const ForgotSignup = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Sign Up — UCL TB'
    })

    const [submitted, setSubmitted] = useState(false)
    const [forgotPassword, { loading, error }] = useMutation(CREATE_UNIQUE_LINK, {
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
