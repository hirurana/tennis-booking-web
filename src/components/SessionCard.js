import React, { useState } from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { CREATE_BOOKING } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import SessionModal from './SessionModal'

const SessionCard = ({ session, fr }) => {
    const [modalShow, setModalShow] = React.useState(false)

    const [createBooking] = useMutation(CREATE_BOOKING, {
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
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        -
                        {session.endTime.toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </h6>
                    <h6>{session.address}</h6>
                    {session.level} {session.slotsBooked} / {session.maxSlots}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body
                        style={{
                            paddingTop: '0px',
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Button
                                onClick={e => {
                                    e.preventDefault()
                                    createBooking()
                                }}
                            >
                                Book
                            </Button>
                            <Button
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
