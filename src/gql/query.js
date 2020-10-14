import { gql } from '@apollo/client'

const GET_BOOKINGS = gql`
    query me {
        me {
            id
            username
            sessions {
                id
                startTime
                duration
                slotsBooked
            }
        }
    }
`

const GET_SESSIONS = gql`
    query sessions {
        sessions {
            id
            startTime
            address
            duration
            level
            courtIndex
            maxSlots
            slotsBooked
            participants {
                id
                username
            }
            author {
                username
            }
            lastUpdatedBy {
                username
            }
        }
    }
`

const VERIFY_LINK = gql`
    query verifyLink($uuid: String!) {
        verifyLink(uuid: $uuid)
    }
`

export { GET_BOOKINGS, GET_SESSIONS, VERIFY_LINK }
