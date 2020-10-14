import { gql } from '@apollo/client'

const CREATE_SESSION = gql`
    mutation createSession(
        $startTime: String!
        $address: String!
        $duration: Int!
        $level: String!
        $courtIndex: Int!
        $maxSlots: Int!
    ) {
        createSession(
            startTime: $startTime
            address: $address
            duration: $duration
            level: $level
            courtIndex: $courtIndex
            maxSlots: $maxSlots
        ) {
            id
            startTime
            address
        }
    }
`

const DELETE_SESSION = gql`
    mutation deleteSession($id: ID!) {
        deleteSession(id: $id)
    }
`

const DELETE_BOOKING = gql`
    mutation deleteBooking($id: ID!) {
        deleteBooking(id: $id) {
            id
            slotsBooked
        }
    }
`

const CREATE_BOOKING = gql`
    mutation createBooking($id: ID!) {
        createBooking(id: $id) {
            slotsBooked
        }
    }
`

const CREATE_UNIQUE_LINK = gql`
    mutation createLink($email: String!) {
        createLink(email: $email) {
            id
        }
    }
`

export { CREATE_SESSION, DELETE_SESSION, DELETE_BOOKING, CREATE_BOOKING }
