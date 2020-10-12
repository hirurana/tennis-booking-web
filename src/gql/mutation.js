import { gql } from '@apollo/client'

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

export { DELETE_BOOKING, CREATE_BOOKING }
