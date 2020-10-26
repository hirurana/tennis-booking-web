// import external libs
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

// import graphQL queries used in this component
import { GET_SESSIONS, GET_BOOKINGS } from '../gql/query'
import BookingPage from '../components/BookingTimetable'
import BookingList from '../components/BookingList'

import { Sessions, Bookings } from '../Contexts'

const getMutableSession = immutableSession => {
    const mutable = { ...immutableSession }
    mutable['startTime'] = new Date(immutableSession.startTime)
    mutable['endTime'] = new Date(immutableSession.endTime)
    mutable['full'] = mutable.participants.length === mutable.maxSlots
    return mutable
}

const Home = props => {
    useEffect(() => {
        // update the document title
        document.title = 'Bookings - UCL TB'
    })

    // get session details from server API via GQL query
    // TODO: this currently isn't polling - look into socket.io stuff
    const {
        data: sessions,
        loading: sessionsLoading,
        error: sessionsError,
    } = useQuery(GET_SESSIONS, { pollInterval: 1000 })

    const {
        data: bookings,
        loading: bookingsLoading,
        error: bookingsError,
    } = useQuery(GET_BOOKINGS)

    if (sessionsLoading || bookingsLoading) return <p>Loading...</p>

    if (sessionsError) return `Error! ${sessionsError.message}`
    if (bookingsError) return `Error! ${bookingsError.message}`

    return (
        <Sessions.Provider value={sessions.sessions.map(getMutableSession)}>
            <Bookings.Provider
                value={bookings.me.sessions.map(getMutableSession)}
            >
                <div className="d-flex" style={{ height: '100%' }}>
                    <div>
                        <BookingList></BookingList>
                    </div>
                    <div className="flex-grow-1" style={{ padding: '1em' }}>
                        <BookingPage
                            {...{ user_data: bookings, data: sessions }}
                        ></BookingPage>
                    </div>
                </div>
            </Bookings.Provider>
        </Sessions.Provider>
    )
}
export default Home
