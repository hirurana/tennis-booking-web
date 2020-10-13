import React, { useState } from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { CREATE_BOOKING, DELETE_BOOKING } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import SessionModal from './SessionModal'

const SessionCard = ({ session, fr, user_data }) => {
    const [modalShow, setModalShow] = React.useState(false)

    const [createBooking] = useMutation(CREATE_BOOKING, {
        variables: {
            id: session.id,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })

    const [deleteBooking] = useMutation(DELETE_BOOKING, {
        variables: {
            id: session.id,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })

    const booked = user_data.me.sessions.some(bookedSession => {
        return session.id === bookedSession.id
    })

    const colors = {
        Beginner: '#4CBB17',
        Intermediate: '#FF7800',
        Advanced: '#E60000',
        Society: '#74b9ff',
    }

    return (
        <Accordion
            style={{
                width: `calc(${session.duration * fr}%)`,
                padding: '0.25em',
            }}
        >
            <Card
                style={{
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${
                        colors[session.level]
                    } 10px, #FFF 10px)`,
                    borderColor: colors[session.level],
                }}
            >
                <Accordion.Toggle
                    as={Card.Body}
                    eventKey="0"
                    style={{ cursor: 'pointer', color: '#404040' }}
                >
                    <h6>
                        {session.startTime.toLocaleTimeString('en-UK', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {session.endTime.toLocaleTimeString('en-UK', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </h6>
                    <h6>{session.address}</h6>
                    <div className="d-flex justify-content-between">
                        <span>
                            {session.level} {session.slotsBooked} /{' '}
                            {session.maxSlots}
                        </span>
                        {booked && <span>Booked!</span>}
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body
                        style={{
                            paddingTop: '0px',
                        }}
                    >
                        <div className="d-flex align-items-center">
                            {booked ? (
                                <Button
                                    variant="danger"
                                    style={{ margin: '0.25em' }}
                                    onClick={e => {
                                        e.preventDefault()
                                        deleteBooking()
                                    }}
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    style={{ margin: '0.25em' }}
                                    onClick={e => {
                                        e.preventDefault()
                                        createBooking()
                                    }}
                                >
                                    Book
                                </Button>
                            )}
                            <Button
                                style={{ margin: '0.25em' }}
                                onClick={e => {
                                    e.preventDefault()
                                    setModalShow(true)
                                }}
                            >
                                Info
                            </Button>
                        </div>
                        <SessionModal
                            color={colors[session.level]}
                            session={session}
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default SessionCard
