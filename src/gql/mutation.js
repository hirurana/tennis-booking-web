import { gql } from '@apollo/client'

export const CREATE_SESSION = gql`
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

export const DELETE_SESSION = gql`
    mutation deleteSession($id: ID!) {
        deleteSession(id: $id)
    }
`

export const DELETE_BOOKING = gql`
    mutation deleteBooking($id: ID!) {
        deleteBooking(id: $id) {
            id
            slotsBooked
        }
    }
`

export const CREATE_BOOKING = gql`
    mutation createBooking($id: ID!) {
        createBooking(id: $id) {
            slotsBooked
        }
    }
`

export const CREATE_UNIQUE_LINK = gql`
    mutation createLink($email: String!) {
        createLink(email: $email)
    }
`