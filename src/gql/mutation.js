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

export { DELETE_BOOKING, CREATE_BOOKING }
