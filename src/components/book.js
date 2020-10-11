import React from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query'
import { CREATE_BOOKING } from '../gql/mutation'

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

    console.log(days)

    return (
        <div>
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

const BookingDay = ({ day, sessions }) => {
    // split sessions list into courts
    const courts = {}
    for (const session of sessions) {
        if (!(session.courtIndex in courts)) {
            courts[session.courtIndex] = []
        }
        courts[session.courtIndex].push(session)
    }

    const minTime = sessions[0].startTime
    var maxTime = minTime
    Object.values(sessions).forEach(session => {
        if (session.endTime > maxTime) {
            maxTime = session.endTime
        }
    })

    const hours = []
    for (let i = 0; i < (maxTime - minTime) / 3600 / 1000; i++) {
        hours.push(minTime.getHours() + i)
    }
    const fr = 100 / hours.length

    const courtTimeBuffers = {}
    Object.keys(courts).forEach(courtIndex => {
        // check court start time

        courtTimeBuffers[courtIndex] = [
            courts[courtIndex][0].startTime - minTime,
        ]
        for (let i = 1; i < courts[courtIndex].length; i++) {
            courtTimeBuffers[courtIndex].push(
                courts[courtIndex][i].startTime -
                    courts[courtIndex][i - 1].endTime,
            )
        }
        courtTimeBuffers[courtIndex] = courtTimeBuffers[courtIndex].map(
            millis => millis / 3600 / 1000,
        )
    })

    const bufferedCourts = {}
    Object.keys(courts).forEach(courtIndex => {
        bufferedCourts[courtIndex] = []
        for (let i = 0; i < courts[courtIndex].length; i++) {
            bufferedCourts[courtIndex].push(courtTimeBuffers[courtIndex][i])
            bufferedCourts[courtIndex].push(courts[courtIndex][i])
        }
    })

    return (
        <div>
            <h3>{day}</h3>
            <div id="container" style={{ padding: '2em' }}>
                {Object.keys(bufferedCourts).map(courtIndex => (
                    <div key={courtIndex} className="d-flex align-items-center">
                        {Object.values(bufferedCourts[courtIndex]).map(
                            (sessionOrBuffer, i) => {
                                if (typeof sessionOrBuffer === 'number') {
                                    if (sessionOrBuffer > 0) {
                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    width: `${sessionOrBuffer *
                                                        fr}%`,
                                                }}
                                            ></div>
                                        )
                                    }
                                } else {
                                    return (
                                        <SessionCard
                                            key={i}
                                            session={sessionOrBuffer}
                                            fr={fr}
                                        ></SessionCard>
                                    )
                                }
                            },
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const SessionCard = ({ session, fr }) => {
    const [createBooking] = useMutation(CREATE_BOOKING, {
        variables: {
            id: session.id,
        },
        refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }],
    })

    const colors = {
        Beginner: '#55efc4',
        Intermediate: '#fdcb6e',
        Advanced: '#ff7675',
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
                style={{ borderRadius: 16, borderColor: colors[session.level] }}
            >
                <Accordion.Toggle
                    as={Card.Body}
                    eventKey="0"
                    style={{ cursor: 'pointer' }}
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
                            <span
                                style={{
                                    marginLeft: '1em',
                                }}
                            >
                                (i)
                            </span>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default BookingPage
