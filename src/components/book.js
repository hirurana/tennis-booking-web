import React from 'react'
import { Accordion, Button, Card } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import BookingDay from './BookingDay'

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

export default BookingPage
