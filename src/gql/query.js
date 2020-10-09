import { gql } from '@apollo/client'

const GET_BOOKINGS = gql`
    query me {
        me {
            id
            username
            user_sessions {
                id
                session_datetime
                slots_booked
            }
        }
    }
`

const GET_SESSIONS = gql`
    query sessions {
        sessions {
            id
            session_datetime
            max_slots
            slots_booked
            participants {
                id
                username
            }
            session_author {
                username
            }
            session_updated_by {
                username
            }
        }
    }
`

export { GET_BOOKINGS, GET_SESSIONS }
