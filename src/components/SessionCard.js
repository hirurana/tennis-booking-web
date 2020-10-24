import React, { useState } from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'

import { CREATE_BOOKING, DELETE_BOOKING, DELETE_SESSION } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'

//import local libs
import SessionModal from './SessionModal'

const SessionCard = ({ session, fr, booked, bookable, full, admin, mobile }) => {
    const isLessThanSevenHundred = useMediaQuery({
        query: '(max-width: 700px)',
    })
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

    const [deleteSession] = useMutation(DELETE_SESSION, {
        variables: {
            id: session.id,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })

    const colors = {
        Beginner: '#4CBB17',
        Intermediate: '#FF7800',
        Advanced: '#E60000',
        Society: '#74b9ff',
    }

    const booked_colors = {
        Beginner: '#dbf1d0',
        Intermediate: '#ffe4cc',
        Advanced: '#facccc',
        Society: '#facccc',
    }

    const fullColor = `#f5f5f7`

    console.log(session, booked, full);
    const backgroundColor = full ? fullColor : (booked ? booked_colors[session.level] : '#fff')

    return (
        <Accordion
            style={{
                width: mobile ? '100%' : `${session.duration * fr}%`,
                minWidth: '12em',
                padding: '0.25em',
            }}
        >
            <Card
                style={{
                    borderRadius: mobile ? 16 : 8,
                    background: `linear-gradient(90deg, ${
                        colors[session.level]
                    } 10px, ${backgroundColor} 10px)`,
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
                        {booked && (
                            <span
                                style={{
                                    float: 'right',
                                    backgroundColor: '#f5f4f0',
                                    padding: '0.75em',
                                    borderRadius: '8px',
                                }}
                            >
                                {' '}
                                Booked
                            </span>
                        )}
                        {!booked && full && (
                            <span
                            style={{
                                float: 'right',
                                backgroundColor: '#e74c3c',
                                padding: '0.75em',
                                borderRadius: '8px',
                                color:"white"
                            }}
                        >
                            {' '}
                            Full
                        </span>
                        )}
                    </h6>
                    <h6>{session.address}</h6>
                    <div className="d-flex justify-content-between">
                        <span>
                            {session.level} {session.slotsBooked} /{' '}
                            {session.maxSlots}
                        </span>
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
                                    style={{
                                        margin: '0.25em',
                                    }}
                                    onClick={e => {
                                        e.preventDefault()
                                        createBooking()
                                    }}
                                    disabled={!bookable || full}
                                >
                                    Book
                                </Button>
                            )}
                            <Button
                                style={{
                                    margin: '0.25em',
                                }}
                                onClick={e => {
                                    e.preventDefault()
                                    setModalShow(true)
                                }}
                            >
                                Info
                            </Button>
                        </div>
                        {admin && (
                            <Button
                                variant="danger"
                                style={{ margin: '0.25em' }}
                                onClick={e => {
                                    e.preventDefault()
                                    deleteSession()
                                }}
                            >
                                Delete Session
                            </Button>
                        )}
                        <SessionModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            session={session}
                            booked={booked}
                            bookable={bookable}
                            color={colors[session.level]}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default SessionCard
