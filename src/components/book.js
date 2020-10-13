import React, { useState } from 'react'
import { Accordion, Button, Card, Nav } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import Clock from 'react-live-clock'

import BookingDay from './BookingDay'

const BookingHeader = styled.div`
    position: relative;
    text-align: center;
    height: 64px;
    margin-left: auto;
    display: inline-flex;
    background-color: #f26640;
    border-radius: 16px;
    padding: 0.25em;
`

const BookingPage = ({ data: { sessions: immutableSessions }, user_data }) => {
    const [filter, setFilter] = useState('All')

    const sessions = immutableSessions
        .map(immSess => {
            const mutable = { ...immSess }
            mutable['startTime'] = new Date(immSess.startTime)
            mutable['endTime'] = new Date(immSess.startTime)
            mutable['endTime'].setHours(
                mutable.endTime.getHours() + mutable.duration,
            )
            return mutable
        })
        .filter(session => session.endTime > new Date())
        .filter(session => filter === 'All' || session.level === filter)

    // split sessions up into days
    const days = {}
    const sorted = [...sessions].sort((a, b) => a.startTime - b.startTime)
    for (const session of sorted) {
        const date = session.startTime.toDateString()
        if (!(date in days)) {
            days[date] = []
        }
        days[date].push(session)
    }

    return (
        <div>
            <BookingHeader>
                <p>{3 - user_data.me.sessions.length} slots remaining</p>
                <Nav>
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(
                        filterLabel => (
                            <Nav.Item key={filterLabel}>
                                <Button
                                    onClick={() => {
                                        setFilter(filterLabel)
                                    }}
                                >
                                    {filterLabel}
                                </Button>
                            </Nav.Item>
                        ),
                    )}
                </Nav>
                <Clock
                    format={'ddd, Do MMM HH:mm'}
                    ticking={true}
                    timezone={'GB'}
                />
            </BookingHeader>
            <h2>Booking Page</h2>
            {Object.keys(days).map(day => (
                <BookingDay
                    key={day}
                    day={day}
                    sessions={days[day]}
                ></BookingDay>
            ))}
        </div>
    )
}

export default BookingPage
