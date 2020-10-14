import React, { useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { setConfiguration } from 'react-grid-system'
setConfiguration({ maxScreenClass: 'xl' })
import SessionCard from './SessionCard'

const BookingAddress = ({ day, sessions, userData }) => {
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

    const fr = 100 / ((maxTime - minTime) / 60 / 1000)

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
            millis => millis / 60 / 1000,
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
        <div id="container" style={{ padding: '1em' }}>
            {Object.keys(bufferedCourts).map(courtIndex => (
                <div key={courtIndex} className="d-flex align-items-center">
                    <div
                        className="d-flex align-items-center align-self-stretch"
                        style={{
                            backgroundColor: '#f5f4f0',
                            margin: ' 0.25em 0',
                            borderRadius: '16px ',
                            padding: '0 1em',
                        }}
                    >
                        <span>Court {courtIndex} </span>
                    </div>
                    <div className="d-flex flex-fill align-items-center">
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
                                            booked={userData.sessions.some(
                                                bookedSession =>
                                                    sessionOrBuffer.id ===
                                                    bookedSession.id,
                                            )}
                                            bookable={userData.sessions.every(
                                                // check if this session overlaps any booked session
                                                bookedSession =>
                                                    userData.sessions.length <
                                                        3 && // sob is before bs
                                                    (sessionOrBuffer.endTime <=
                                                        bookedSession.startTime ||
                                                        // sob is after bs
                                                        sessionOrBuffer.startTime >=
                                                            bookedSession.endTime),
                                            )}
                                            admin={userData.admin}
                                        ></SessionCard>
                                    )
                                }
                            },
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const BookingDay = ({ day, sessions, userData }) => {
    // split sessions into addresses
    const addresses = {}
    for (const session of sessions) {
        if (!(session.address in addresses)) {
            addresses[session.address] = []
        }
        addresses[session.address].push(session)
    }

    return (
        <div>
            <h3>{day}</h3>
            {Object.keys(addresses).map(address => (
                <div key={address}>
                    <h5>{address}</h5>{' '}
                    <BookingAddress
                        {...{ sessions: addresses[address], userData }}
                    ></BookingAddress>{' '}
                </div>
            ))}
        </div>
    )
}

export default BookingDay
