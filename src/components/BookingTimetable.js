import React, { useContext, useState } from 'react'
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
import CreateSessionModal from './Modals/CreateSession'
import AddUserModal from './Modals/AddUser'

import { Bookings, UserData, Sessions, Responsive } from '../Contexts'

const BookingHeader = styled.div`
    position: relative;
    text-align: center;
    height: auto;
    margin-left: auto;
    border-radius: 16px;
    width: 95%;
    margin: 0.5em;
`

const BookingPage = () => {
    const { userData } = useContext(UserData)
    const bookings = useContext(Bookings)
    const sessions = useContext(Sessions)
    const { lt1200, lt768 } = useContext(Responsive)
    const [filter, setFilter] = useState('All')

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
    const [showAddUser, setShowAddUser] = useState(false)

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
            <AddUserModal
                show={showAddUser}
                onClose={() => {
                    setShowAddUser(false)
                }}
                onConfirm={data => {
                    setShowAddUser(false)
                }}
            ></AddUserModal>
            <BookingHeader
                style={{
                    display: lt768 ? 'block' : 'inline-flex',
                    float: lt768 ? 'left' : null,
                }}
            >
                <p
                    style={{
                        float: 'left',
                        padding: '0.75em',
                        width: lt768 ? '100%' : null,
                        backgroundColor:
                            bookings.length === userData.maxSessions
                                ? '#E60000'
                                : '#f5f4f0',
                        color:
                            bookings.length === userData.maxSessions
                                ? '#fff'
                                : '#000',
                        margin: lt768 ? '0 0 1em 0' : 0,
                        borderRadius: 16,
                    }}
                >
                    {userData.maxSessions - bookings.length} /{' '}
                    {userData.maxSessions} slots remaining
                </p>

                <Nav
                    style={{
                        float: 'left',
                        margin: '0 auto',
                        display: lt1200 ? 'none' : null,
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
                        display: lt1200 ? null : 'none',
                        width: lt768 ? '100%' : null,
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
                        display: lt768 ? 'none' : null,
                    }}
                />
            </BookingHeader>
            <p style={{ textAlign: 'center' }}>
                Please select a court and a time when you would like to play
            </p>
            {userData.admin && (
                <div className="d-flex">
                    <Button
                        style={{
                            width: lt768 ? '50%' : null,
                            padding: lt768 ? '10px' : null,
                            borderRadius: lt768 ? '16px' : null,
                            margin: '0 1em',
                        }}
                        variant="success"
                        onClick={() => {
                            setShowCreate(true)
                        }}
                    >
                        Create Session
                    </Button>

                    <Button
                        style={{
                            width: lt768 ? '50%' : null,
                            padding: lt768 ? '10px' : null,
                            borderRadius: lt768 ? '16px' : null,
                            margin: '0 1em',
                        }}
                        variant="outline-primary"
                        onClick={() => {
                            setShowAddUser(true)
                        }}
                    >
                        Add User
                    </Button>
                </div>
            )}

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
