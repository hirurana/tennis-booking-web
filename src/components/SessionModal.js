import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { CREATE_BOOKING, DELETE_BOOKING } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'

const SessionModal = ({ color, show, onHide, session, booked, bookable }) => {
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
    return (
        <React.Fragment>
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header
                    closeButton
                    style={{ background: color, color: '#fff' }}
                >
                    <Modal.Title id="contained-modal-title-vcenter">
                        {session.startTime.toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        -
                        {session.endTime.toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        {session.level} Session | Court {session.courtIndex}
                    </h4>
                    <h4>Location: {session.address}</h4>
                    <h4>Participants</h4>
                    {session.participants.length ? (
                        session.participants.map(participant => (
                            <li key={participant.id}>{participant.username}</li>
                        ))
                    ) : (
                        <p>No participants</p>
                    )}
                    <p>
                        {session.maxSlots - session.slotsBooked} slots remaining
                    </p>
                </Modal.Body>
                <Modal.Footer>
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
                            disabled={!bookable}
                        >
                            Book
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default SessionModal
