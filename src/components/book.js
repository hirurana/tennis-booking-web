import React from 'react'
import { Accordion, Button, Card, Nav } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import Clock from 'react-live-clock'

import BookingDay from './BookingDay'

const LoginItems = styled.div`
    position: relative;
    text-align: center;
    height: 64px;
    margin-left: auto;
    display: inline-flex;
`

const BookingPage = ({ data: { sessions: immutableSessions }, user_data }) => {
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
            <LoginItems>
                <p>{3 - user_data.me.sessions.length} slots remaining</p>
                <Nav
                    activeKey="/home"
                    onSelect={selectedKey => alert(`selected ${selectedKey}`)}
                >
                    <Nav.Item>
                        <Button>All</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button>Beginner</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button>Intermediate</Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button>Advanced</Button>
                    </Nav.Item>
                </Nav>
                <Clock
                    format={'ddd, Do MMM HH:mm:ss'}
                    ticking={true}
                    timezone={'GB'}
                />
            </LoginItems>
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
