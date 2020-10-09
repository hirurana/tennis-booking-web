// import external libs
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'

// import custom components
import Button from '../components/Button'
import BookButton from '../components/BookButton'
import SessionItem from '../components/SessionItem'
import Clock from 'react-live-clock'
// import graphQL queries used in this component
import { GET_SESSIONS, GET_BOOKINGS } from '../gql/query'

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
    user_data.me.user_sessions.forEach(sesh => {
        initBookedSessions.push(sesh.id)
    })

    // if data is successful display data in UI
    return (
        <div>
            <CurrentClock>
                <Clock format={'dddd, Do MMMM, h:mm a'} />
            </CurrentClock>

            <ul
                style={{ position: 'relative', top: '20px', listStyle: 'none' }}
            >
                {data.sessions.map(session => (
                    /* map each session as a list item*/
                    <li key={session.id}>
                        {/* Border styles and margins change when user clicks a booking to
              present confirm booking button.
              Colour of the session item changes depending on if user has Booked
              the session or if the session is full*/}
                        <SessionItem
                            key={session.id}
                            onClick={() => {
                                setBookingButton(
                                    bookingButton === session.id
                                        ? null
                                        : session.id,
                                )
                            }}
                            style={{
                                display: 'inline-flex',
                                borderRadius:
                                    bookingButton === session.id &&
                                    !!(
                                        session.max_slots - session.slots_booked
                                    ) &&
                                    !initBookedSessions.includes(session.id)
                                        ? '10px 10px 0 0'
                                        : '10px',
                                margin:
                                    bookingButton === session.id &&
                                    !!(
                                        session.max_slots - session.slots_booked
                                    ) &&
                                    !initBookedSessions.includes(session.id)
                                        ? '0'
                                        : '0 0 10px 0',
                                backgroundColor: !!initBookedSessions.includes(
                                    session.id,
                                )
                                    ? '#f26640'
                                    : !(
                                          session.max_slots -
                                          session.slots_booked
                                      )
                                    ? '#dc3545'
                                    : '#e1ded1',
                            }}
                        >
                            <div>
                                Date: {session.session_datetime.slice(0, 10)}{' '}
                                Time: {session.session_datetime.slice(11)} has{' '}
                                {session.max_slots - session.slots_booked} slots
                                available
                                {initBookedSessions.includes(session.id)
                                    ? ' Booked!'
                                    : null}
                            </div>
                        </SessionItem>
                        {/* Only present the book button if user has clicked the session item
              and there are still slot available and the user hasn't already booked it */}
                        {bookingButton === session.id &&
                        !!(session.max_slots - session.slots_booked) &&
                        !initBookedSessions.includes(session.id) ? (
                            <BookButton
                                sessionId={session.id}
                                onClickBook={() => {
                                    initBookedSessions.push(session.id)
                                }}
                            />
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Home
