import React, { useState } from 'react'
import {
    Accordion,
    Button,
    Card,
    Nav,
    DropdownButton,
    Dropdown,
} from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import Clock from 'react-live-clock'
import { useMediaQuery } from 'react-responsive'

import BookingDay from './BookingDay'
import CreateSessionModal from './CreateSessionModal'

const BookingHeader = styled.div`
    position: relative;
    text-align: center;
    height: auto;
    margin-left: auto;
    border-radius: 16px;
    width: 95%;
    margin: 0.5em;
`

const getMutableSession = immutableSession => {
    const mutable = { ...immutableSession }
    mutable['startTime'] = new Date(immutableSession.startTime)
    mutable['endTime'] = new Date(immutableSession.startTime)
    mutable['endTime'].setMinutes(
        mutable.endTime.getMinutes() + mutable.duration,
    )
    return mutable
}

const BookingPage = ({
    data: { sessions: immutableSessions },
    user_data: immutableUserData,
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isLessThanThousand = useMediaQuery({ query: '(max-width: 1000px)' })
    const isLessThanSevenHundred = useMediaQuery({
        query: '(max-width: 700px)',
    })
    const [filter, setFilter] = useState('All')

    const sessions = immutableSessions
        .map(getMutableSession)
        .filter(session => session.endTime > new Date())
        .filter(session => filter === 'All' || session.level === filter)

    const userData = { ...immutableUserData.me }
    userData.sessions = userData.sessions.map(getMutableSession)

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

    const [showCreate, setShowCreate] = useState(false)

    return (
        <div>
            <CreateSessionModal
                show={showCreate}
                onClose={() => {
                    setShowCreate(false)
                }}
                onConfirm={data => {
                    setShowCreate(false)
                }}
                sessions={sessions}
            ></CreateSessionModal>
            <BookingHeader
                style={{
                    display: isLessThanSevenHundred ? 'block' : 'inline-flex',
                    float: isLessThanSevenHundred ? 'left' : null,
                }}
            >
                <p
                    style={{
                        float: 'left',
                        padding: '0.75em',
                        width: isLessThanSevenHundred ? '100%' : null,
                        backgroundColor:
                            userData.sessions.length === 3
                                ? '#E60000'
                                : '#f5f4f0',
                        color: userData.sessions.length === 3 ? '#fff' : '#000',
                        margin: isLessThanSevenHundred ? '0 0 1em 0' : 0,
                        borderRadius: 16,
                    }}
                >
                    {3 - userData.sessions.length} / 3 slots remaining
                </p>

                <Nav
                    style={{
                        float: 'left',
                        margin: '0 auto',
                        display: isLessThanThousand ? 'none' : null,
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
                                        padding: '0.75em',
                                    }}
                                >
                                    {filterLabel}
                                </Button>
                            </Nav.Item>
                        ),
                    )}
                </Nav>

                <DropdownButton
                    title={filter}
                    style={{
                        float: 'left',
                        margin: '0 auto',
                        display: isLessThanThousand ? null : 'none',
                        width: isLessThanSevenHundred ? '100%' : null,
                    }}
                >
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(
                        filterLabel => (
                            <Dropdown.Item
                                key={filterLabel}
                                onClick={() => setFilter(filterLabel)}
                            >
                                {filterLabel}
                            </Dropdown.Item>
                        ),
                    )}
                </DropdownButton>
                <Clock
                    format={'ddd, Do MMM HH:mm'}
                    ticking={true}
                    timezone={'GB'}
                    style={{
                        float: 'right',
                        padding: '0.75em',
                        backgroundColor: '#f5f4f0',
                        borderRadius: 16,
                        display: isLessThanSevenHundred ? 'none' : null,
                    }}
                />
            </BookingHeader>
            <p style={{ textAlign: 'center' }}>
                Please select a court and a time when you would like to play
            </p>
            {userData.admin && (
                <Button
                    style={{
                        width: isLessThanSevenHundred ? '100%' : null,
                        padding: isLessThanSevenHundred ? '10px' : null,
                        borderRadius: isLessThanSevenHundred ? '16px' : null,
                    }}
                    variant="success"
                    onClick={() => {
                        setShowCreate(true)
                    }}
                >
                    Create Session
                </Button>
            )}

            {Object.keys(days).map(day => (
                <BookingDay
                    key={day}
                    day={day}
                    sessions={days[day]}
                    userData={userData}
                ></BookingDay>
            ))}
        </div>
    )
}

export default BookingPage
