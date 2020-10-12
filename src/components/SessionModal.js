import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { CREATE_BOOKING } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'

const SessionModal = props => {
    const [createBooking] = useMutation(CREATE_BOOKING, {
        variables: {
            id: props.session.id,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })
    return (
        <React.Fragment>
            <Modal {...props} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.session.startTime.toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        -
                        {props.session.endTime.toLocaleTimeString('en-UK', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        {props.session.level} Session | Court{' '}
                        {props.session.courtIndex}
                    </h4>
                    <h4>Location: {props.session.address}</h4>
                    <h4>Participants</h4>
                    {props.session.participants.length ? (
                        props.session.participants.map(participant => (
                            <li key={participant.id}>{participant.username}</li>
                        ))
                    ) : (
                        <p>No participants</p>
                    )}
                    <p>
                        {props.session.maxSlots - props.session.slotsBooked}{' '}
                        slots remaining
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={e => {
                            e.preventDefault()
                            createBooking()
                            props.onHide()
                        }}
                    >
                        Book
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default SessionModal
