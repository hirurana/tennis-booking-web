import React, { useState } from 'react'
import { Accordion, Button, Card, Nav } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import Clock from 'react-live-clock'

import BookingDay from './BookingDay'

const BookingHeader = styled.div`
    position: relative;
    text-align: center;
    height: auto;
    margin-left: auto;
    display: inline-flex;
    border-radius: 16px;
    width: 95%;
    margin: 1em;
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
                <p
                    style={{
                        float: 'left',
                        padding: '0.75em',
                        backgroundColor:
                            user_data.me.sessions.length === 3
                                ? '#E60000'
                                : '#f5f4f0',
                        color:
                            user_data.me.sessions.length === 3
                                ? '#fff'
                                : '#000',
                        margin: '0',
                        borderRadius: 16,
                    }}
                >
                    {3 - user_data.me.sessions.length} slots remaining
                </p>

                <Nav
                    style={{
                        float: 'left',
                        margin: '0 auto',
                    }}
                >
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(
                        filterLabel => (
                            <Nav.Item key={filterLabel}>
                                <Button
                                    onClick={() => {
                                        setFilter(filterLabel)
                                    }}
                                    style={{
                                        borderRadius:
                                            filterLabel === 'All'
                                                ? '16px 0 0 16px'
                                                : filterLabel === 'Advanced'
                                                ? '0 16px 16px 0'
                                                : 0,
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
                    style={{
                        float: 'right',
                        padding: '0.75em',
                        backgroundColor: '#f5f4f0',
                        borderRadius: 16,
                    }}
                />
            </BookingHeader>
            <p style={{ textAlign: 'center' }}>
                Please select a court and a time when you would like to play
            </p>

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
