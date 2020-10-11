import React, { useState } from 'react'

const BookingPage = ({ data: { sessions: immutableSessions }, user_data }) => {
    const sessions = immutableSessions.map(immSess => {
        const mutable = { ...immSess }
        mutable['startTime'] = new Date(immSess.startTime)
        mutable['endTime'] = new Date(immSess.startTime)
        mutable['endTime'].setHours(
            mutable.endTime.getHours() + mutable.duration,
        )
        return mutable
    })

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
    console.log(courtTimeBuffers)

    const bufferedCourts = {}
    Object.keys(courts).forEach(courtIndex => {
        bufferedCourts[courtIndex] = []
        for (let i = 0; i < courts[courtIndex].length; i++) {
            bufferedCourts[courtIndex].push(courtTimeBuffers[courtIndex][i])
            bufferedCourts[courtIndex].push(courts[courtIndex][i])
        }
    })

    console.log(bufferedCourts)

    return (
        <div>
            <h3>{day}</h3>
            Session count: {sessions.length}
            <div id="container" style={{ padding: '2em' }}>
                <div className="d-flex justify-content-between">
                    {/* <div style={{ width: `${fr}%` }}>Court Number</div> */}
                    {Object.values(hours).map(hour => (
                        <div
                            key={hour}
                            style={{ width: `${fr}%`, marginLeft: '-0.5em' }}
                        >
                            {hour}
                        </div>
                    ))}
                    <div style={{ width: `0%` }}>
                        {hours[hours.length - 1] + 1}
                    </div>
                </div>
                {Object.keys(bufferedCourts).map(courtIndex => (
                    <div key={courtIndex} className="d-flex">
                        {/* <div style={{ width: `${fr}%` }}>{courtIndex}</div> */}
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
                                        <div
                                            key={i}
                                            style={{
                                                border: `1px solid black`,
                                                width: `${sessionOrBuffer.duration *
                                                    fr}%`,
                                            }}
                                        >
                                            {sessionOrBuffer.address}{' '}
                                            {sessionOrBuffer.level}
                                        </div>
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

export default BookingPage
