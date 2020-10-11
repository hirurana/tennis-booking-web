import React, { useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'
import { setConfiguration } from 'react-grid-system'
setConfiguration({ maxScreenClass: 'xl' })

const BookingDay = ({ day, sessions }) => {
    // split sessions list into courts
    const courts = {}
    for (const session of sessions) {
        if (!(session.courtIndex in courts)) {
            courts[session.courtIndex] = []
        }
        courts[session.courtIndex].push(session)
    }

    const minTime = new Date(sessions[0].startTime)
    var maxTime = minTime
    Object.values(sessions).forEach(session => {
        const sessionEnd = new Date(session.startTime)
        sessionEnd.setHours(sessionEnd.getHours() + session.duration)
        if (sessionEnd > maxTime) {
            maxTime = sessionEnd
        }
    })
    console.log(minTime.toTimeString())
    console.log(maxTime.toTimeString())

    const hours = []
    for (let i = 0; i <= (maxTime - minTime) / 3600 / 1000; i++) {
        hours.push(minTime.getHours() + i)
    }

    setConfiguration({ gridColumns: hours.length + 1 })

    return (
        <div>
            <h3>{day}</h3>
            Session count: {sessions.length}
            <div>
                <Container>
                    <Row>
                        <Col sm={1}>Court Number</Col>
                        {Object.values(hours).map(hour => (
                            <Col sm={1} key={hour}>
                                {hour}
                            </Col>
                        ))}
                    </Row>
                    {Object.keys(courts).map(courtIndex => (
                        <Row key={courtIndex}>
                            <Col sm={1}>{courtIndex}</Col>
                            {Object.values(courts[courtIndex]).map(session => (
                                <Col
                                    key={session.id}
                                    sm={session.duration}
                                    style={{ border: `1px solid black` }}
                                >
                                    {session.address} {session.level}
                                </Col>
                            ))}
                        </Row>
                    ))}
                </Container>
            </div>
        </div>
    )
}

export default BookingDay
