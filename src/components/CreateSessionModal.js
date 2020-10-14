import React, { useState } from 'react'
import { Button, Form, FormControl, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextTooltip from './Tooltip'

import { useMutation } from '@apollo/client'
import { CREATE_SESSION } from '../gql/mutation'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'

const CreateSessionModal = ({ show, onClose, onConfirm, sessions }) => {
    const addresses = ['Finsbury Park', 'Southwark Park']
    const levels = ['Beginner', 'Intermediate', 'Advanced']
    // https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
    const courtIndices = Array.from({ length: 16 }, (_, i) => i + 1)

    const [address, setAddress] = useState(addresses[0])
    const [courtIndex, setCourtIndex] = useState(1)
    const [date, setDate] = useState(new Date())
    const [level, setLevel] = useState(levels[0])
    const [duration, setDuration] = useState(5)
    const [maxSlots, setSlots] = useState(1)

    const endTime = new Date(date).setMinutes(date.getMinutes() + duration)

    console.log(sessions)
    const noOverlap = sessions
        .filter(existingSession => existingSession.address === address)
        .filter(existingSession => existingSession.courtIndex === courtIndex)
        .every(
            existingSession =>
                existingSession.endTime <= date ||
                existingSession.startTime >= endTime,
        )

    const error = !noOverlap
        ? 'A session on this court is running between the times you have specified.'
        : ''

    const [createSession] = useMutation(CREATE_SESSION, {
        variables: {
            startTime: date.toISOString(),
            address,
            duration,
            level,
            courtIndex,
            maxSlots,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })

    // console.log({ address, courtIndex, date, duration, maxSlots })
    console.log(error)

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>New Session</Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <div className="col-md-8">
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                >
                                    {addresses.map((address, i) => (
                                        <option key={i}>{address}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md">
                            <Form.Group>
                                <Form.Label>Court #</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={courtIndex}
                                    onChange={e =>
                                        setCourtIndex(parseInt(e.target.value))
                                    }
                                >
                                    {courtIndices.map((idx, i) => (
                                        <option key={i}>{idx}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>
                    <Form.Group>
                        <Form.Label>Date and Time </Form.Label>
                        {'  '}
                        <DatePicker
                            selected={date}
                            minDate={new Date()}
                            showDisabledMonthNavigation
                            onChange={date =>
                                date > new Date() && setDate(date)
                            }
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                        ></DatePicker>
                    </Form.Group>
                    <Form.Group>
                        <div className="d-flex align-items-center">
                            <Form.Label style={{ paddingRight: '1em' }}>
                                Level
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                            >
                                {levels.map(levelItem => (
                                    <option key={levelItem}>{levelItem}</option>
                                ))}
                            </Form.Control>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <div className="row">
                            <Form.Label className="col">
                                Duration (in minutes)
                            </Form.Label>
                            <div className="col-4 d-flex align-items-center">
                                <Form.Control
                                    style={{ margin: '0 1em', width: '100%' }}
                                    value={duration}
                                    onChange={e =>
                                        e.target.value.length > 0
                                            ? parseInt(e.target.value) > 0
                                                ? setDuration(
                                                      parseInt(e.target.value),
                                                  )
                                                : setDuration(0)
                                            : setDuration(0)
                                    }
                                ></Form.Control>
                            </div>
                            <div className="col-lg-5 d-flex align-items-center">
                                <Form.Control
                                    type="range"
                                    value={duration}
                                    onChange={e =>
                                        setDuration(parseInt(e.target.value))
                                    }
                                    min={5}
                                    max={360}
                                    step={5}
                                ></Form.Control>
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <div className="row">
                            <div className="col">
                                <Form.Label>Available Slots</Form.Label>
                            </div>
                            <div className="col-4 d-flex align-items-center">
                                <Form.Control
                                    style={{ margin: '0 1em', width: '100%' }}
                                    value={maxSlots}
                                    onChange={e =>
                                        e.target.value.length > 0
                                            ? parseInt(e.target.value) > 0
                                                ? setSlots(
                                                      parseInt(e.target.value),
                                                  )
                                                : setSlots(0)
                                            : setSlots(0)
                                    }
                                ></Form.Control>
                            </div>
                            <div className="col-lg-5 d-flex align-items-center">
                                <Form.Control
                                    type="range"
                                    value={maxSlots}
                                    onChange={e =>
                                        setSlots(parseInt(e.target.value))
                                    }
                                    min={1}
                                    max={16}
                                ></Form.Control>
                            </div>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        onClose()
                    }}
                >
                    Cancel
                </Button>
                {error.length !== 0 ? (
                    <TextTooltip text={error}>
                        <span>
                            <Button
                                variant="success disabled"
                                onClick={e => {
                                    e.preventDefault()
                                }}
                            >
                                Create Session
                            </Button>
                        </span>
                    </TextTooltip>
                ) : (
                    <Button
                        variant="success"
                        onClick={() => {
                            createSession()
                            onConfirm()
                        }}
                    >
                        Create Session
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default CreateSessionModal
