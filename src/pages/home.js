// import external libs
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'

// import graphQL queries used in this component
import { GET_SESSIONS, GET_BOOKINGS } from '../gql/query'
import BookingPage from '../components/book'

// position live clock on top right
const CurrentClock = styled.div`
    color: '#000';
    float: right;
    margin: 0 20px 0 0;
`

const Home = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Bookings - UCL TB'
    })

    // get session details from server API via GQL query
    const { data, loading, error, fetchMore } = useQuery(GET_SESSIONS, {
        pollInterval: 1000,
    })

    const {
        data: user_data,
        loading: user_data_loading,
        error: user_data_error,
    } = useQuery(GET_BOOKINGS, {
        pollInterval: 1000,
    })

    // create state to store the session that will display the book button
    const [bookingButton, setBookingButton] = useState(null)

    // if the data is loading, display a loading message
    if (loading || user_data_loading) return <p>Loading...</p>

    // if there is an error display message
    if (error || user_data_error) return `Error! ${error.message}`

    // get user's bookings to highlight as booked on load
    // (this could all be fixed with just a better gql query)
    const initBookedSessions = []
    user_data.me.sessions.forEach(sesh => {
        initBookedSessions.push(sesh.id)
    })

    return <BookingPage {...{ user_data, data }}></BookingPage>
}
export default Home
