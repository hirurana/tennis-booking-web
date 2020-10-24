import React, { useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { setConfiguration } from 'react-grid-system'
setConfiguration({ maxScreenClass: 'xl' })
import SessionCard from './SessionCard'
import { useMediaQuery } from 'react-responsive'

const BookingDay = ({ day, sessions, userData }) => {
    const isLessThanSevenHundred = useMediaQuery({
        query: '(max-width: 700px)',
    })
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

    const fr = 100 /( (maxTime - minTime) / 60 / 1000)

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

    if (isLessThanSevenHundred) {
        return (
            <div>
                <h3 style={{ padding: '0.5em' }}>{day}</h3>
                <div id="container-mobile" style={{ padding: '1em' }}>
                    {Object.keys(bufferedCourts).map(courtIndex => (
                        <div key={courtIndex}>
                            <div
                                style={{
                                    backgroundColor: '#f5f4f0',
                                    margin: ' 0.25em 0',
                                    borderRadius: '16px',
                                    padding: '1em',
                                    textAlign: 'center',
                                }}
                            >
                                <span>Court {courtIndex} </span>
                            </div>
                            <div>
                                {Object.values(bufferedCourts[courtIndex]).map(
                                    (sessionOrBuffer, i) => {
                                        if (
                                            typeof sessionOrBuffer !== 'number'
                                        ) {
                                            return SessionToCard(sessionOrBuffer, i, fr, userData, isLessThanSevenHundred)
                                        }
                                    },
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h3>{day}</h3>
                <div id="container" style={{ padding: '1em' }}>
                    {Object.keys(bufferedCourts).map(courtIndex => (
                        <div
                            key={courtIndex}
                            className="d-flex align-items-center"
                        >
                            <div
                                className="d-flex align-items-center align-self-stretch"
                                style={{
                                    backgroundColor: '#f5f4f0',
                                    margin: ' 0.25em 0',
                                    borderRadius: '8px ',
                                    padding: '0 1em',
                                }}
                            >
                                <span>Court {courtIndex} </span>
                            </div>
                            <div className="d-flex flex-fill">
                                {Object.values(bufferedCourts[courtIndex]).map(
                                    (sessionOrBuffer, i) => {
                                        if (
                                            typeof sessionOrBuffer === 'number'
                                        ) {
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
                                            return SessionToCard(sessionOrBuffer, i, fr, userData, isLessThanSevenHundred)
                                        }
                                    },
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

const SessionToCard = (session, i, fr, userData, mobile) => <SessionCard
key={i}
session={session}
fr={fr}
mobile={
    mobile
}
admin={userData.admin}
booked={userData.sessions.some(
    bookedSession =>
        session.id ===
        bookedSession.id,
)}
bookable={userData.sessions.every(
    // check if this session overlaps any booked session
    bookedSession =>
        userData.sessions
            .length < 3 && // sob is before bs
        (session.endTime <=
            bookedSession.startTime ||
            // sob is after bs
            session.startTime >=
                bookedSession.endTime),
)}
full={session.participants.length === session.maxSlots}
></SessionCard>


export default BookingDay
