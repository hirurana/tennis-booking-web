import React from 'react'
import { useMutation } from '@apollo/client'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import { CREATE_BOOKING } from '../gql/mutation'

const Button = styled.button`
    align-items: center;
    color: #fff;
    background-color: #f26640;
    width: 95%;
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    margin: 0 0 10px 0;
    border: 0;
    border-radius: 0 0 10px 10px;
    cursor: pointer;
    outline: none;
    :hover {
        opacity: 0.8;
    }
    :active {
        background-color: #27ae60;
    }
`

const BookButton = props => {
    const [createBooking] = useMutation(CREATE_BOOKING, {
        variables: {
            id: props.sessionId,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })
    return (
        <Button
            onClick={() => {
                createBooking()
                props.onClickBook()
            }}
        >
            Confirm Booking
        </Button>
    )
}

export default withRouter(BookButton)
