import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useQuery, useMutation, gql } from '@apollo/client'

// import constituent components
import DeleteButton from './DeleteButton'
// import gql query
import { GET_BOOKINGS } from '../gql/query'
// check if booked query
const IS_LOGGED_IN = gql`
    {
        isLoggedIn @client
    }
`

// define component styles
const SideBar = styled.div`
    background: #f5f4f0;
    text-align: center;
    @media (max-width: 700px) {
        padding-top: 175px;
    }
    @media (min-width: 700px) {
        position: fixed;
        width: 25%;
        height: calc(100% - 175px);
        overflow-y: auto;
    }
`

const BookingsList = styled.ul`
    margin: 0;
    padding: 0;
    vertical-align: middle;
    list-style: none;
    line-height: 2;

    /* We can nest styles in styled-components */
    /* The following styles will apply to links within the NavList component */
    a {
        text-decoration: none;
        font-weight: bold;
        font-size: 1.1em;
        color: #333;
    }
    a:visited {
        color: #333;
    }
    a:hover,
    a:focus {
        color: #0077cc;
    }
    background: #f5f4f0;
    padding: 15px;
    @media (max-width: 700px) {
        padding-top: 150px;
    }
    @media (min-width: 700px) {
        position: fixed;
        width: 25%;
        height: calc(100% - 150px);
        overflow-y: auto;
    }
`

const CancelButton = styled.button`
    align-items: center;
    color: #fff;
    background-color: #dc3545;
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
        background-color: #ff0000;
    }
`

const BookingItem = styled.button`
    align-items: center;
    color: #4c4c4c;
    width: 95%;
    text-align: center;
    vertical-align: middle;
    padding: 20px;
    margin: 0 0 10px 0;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    :hover {
        opacity: 0.8;
    }
    :active {
        background-color: #082244;
    }
`

const Bookings = props => {
    //query the server api
    const { loading, error, data, refetch } = useQuery(GET_BOOKINGS)
    const {
        data: local_data,
        loading: local_loading,
        error: local_error,
    } = useQuery(IS_LOGGED_IN)

    // create state to store booking that will show cancel button
    const [cancelButton, setCancelButton] = useState(null)

    // if the data is loading, display a loading message
    if (loading) return <p>Loading...</p>

    // if there is an error display message
    if (error) {
        console.log('User not signed in to view bookings')
        return null
    }

    return (
        <div>
            {local_data.isLoggedIn ? (
                <SideBar>
                    <div>
                        <h2>Upcoming Bookings</h2>
                        <p>Click to cancel</p>
                    </div>
                    {/* if user has bookings show them otherwise display no bookings*/}
                    {!!data.me.sessions.length ? (
                        <BookingsList>
                            {data.me.sessions.map(session => (
                                <li key={session.id}>
                                    {/* change the style of the booking item when the user clicks
                  on a booking*/}
                                    <BookingItem
                                        onClick={() => {
                                            setCancelButton(
                                                cancelButton === session.id
                                                    ? null
                                                    : session.id,
                                            )
                                        }}
                                        style={{
                                            borderRadius:
                                                cancelButton === session.id
                                                    ? '10px 10px 0 0'
                                                    : '10px',
                                            margin:
                                                cancelButton === session.id
                                                    ? '0'
                                                    : '0 0 10px 0',
                                            backgroundColor:
                                                cancelButton === session.id
                                                    ? '#d6d2c2'
                                                    : '#e1ded1',
                                        }}
                                    >
                                        Date:{' '}
                                        {new Date(
                                            session.startTime,
                                        ).toLocaleDateString()}
                                        <p>
                                            at{' '}
                                            {new Date(
                                                session.startTime,
                                            ).toLocaleTimeString('en-UK', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </BookingItem>
                                    {/* if user clicked on this booking then show the cancel button*/}
                                    {cancelButton === session.id ? (
                                        <DeleteButton sessionId={session.id}>
                                            Cancel
                                        </DeleteButton>
                                    ) : null}
                                </li>
                            ))}
                        </BookingsList>
                    ) : (
                        <p>No bookings!</p>
                    )}
                </SideBar>
            ) : null}
        </div>
    )
}
export default Bookings
