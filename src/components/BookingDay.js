import React, { useContext, useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { setConfiguration } from 'react-grid-system'
setConfiguration({ maxScreenClass: 'xl' })
import SessionCard from './SessionCard'
import { useMediaQuery } from 'react-responsive'
import { Bookings, Responsive, UserData } from '../Contexts'

const BookingDay = ({ day, sessions }) => {
    const { userData } = useContext(UserData)
    const { lt768 } = useContext(Responsive)
    const bookings = useContext(Bookings)
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

    if (lt768) {
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
                                            return SessionToCard(
                                                sessionOrBuffer,
                                                i,
                                                fr,
                                                userData,
                                                bookings,
                                                lt768,
                                            )
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
                                            return SessionToCard(
                                                sessionOrBuffer,
                                                i,
                                                fr,
                                                userData,
                                                bookings,
                                                lt768,
                                            )
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

const SessionToCard = (session, i, fr, userData, bookings, mobile) => (
    <SessionCard
        key={i}
        session={session}
        fr={fr}
        mobile={mobile}
        admin={userData.admin}
        booked={bookings.some(bookedSession => session.id === bookedSession.id)}
        bookable={bookings.every(
            // check if this session overlaps any booked session
            bookedSession =>
                bookings.length < userData.maxSessions && // sob is before bs
                (session.endTime <= bookedSession.startTime ||
                    // sob is after bs
                    session.startTime >= bookedSession.endTime),
        )}
        full={session.full}
    ></SessionCard>
)

export default BookingDay
