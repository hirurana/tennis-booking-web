import React, { useContext } from 'react'
import styled from 'styled-components'
import SessionCard from './SessionCard'

// define component styles
const SideBar = styled.div`
    width: 420px;
    height: 100%;
    background: #f5f4f0;
    text-align: center;
    padding: 2em;
    @media (max-width: 768px) {
        display: none !important;
    }
    @media (max-width: 992px) {
        width: 42.3vw;
    }
`

const ListStyle = styled.ul`
    margin: 0;
    padding: 0;
    vertical-align: middle;
    list-style: none;
    line-height: 2;
`

import { Responsive, Bookings } from '../Contexts'

const BookingList = () => {
    const { lt1200 } = useContext(Responsive)
    const bookings = useContext(Bookings)

    return (
        <SideBar>
            <div>
                <h2 style={{ fontSize: lt1200 ? '1.5em' : undefined }}>
                    Upcoming Bookings
                </h2>
                <p>Click to cancel</p>
            </div>
            {!!bookings.length ? (
                <ListStyle>
                    {bookings.map(session => (
                        <li key={session.id}>
                            <SessionCard
                                session={session}
                                fr={1}
                                booked={true}
                                bookable={true}
                            ></SessionCard>
                        </li>
                    ))}
                </ListStyle>
            ) : (
                <p>No bookings!</p>
            )}
        </SideBar>
    )
}
export default BookingList
