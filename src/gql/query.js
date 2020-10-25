import { gql } from '@apollo/client'

export const GET_BOOKINGS = gql`
    query me {
        me {
            id
            sessions {
                id
                address
                startTime
                duration
                level
                courtIndex
                maxSlots
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
    }
`

export const GET_SESSIONS = gql`
    query sessions {
        sessions {
            id
            address
            startTime
            duration
            level
            courtIndex
            maxSlots
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

export const VERIFY_LINK = gql`
    query verifyLink($uuid: String!, $signUp: Boolean!) {
        verifyLink(uuid: $uuid, signUp: $signUp)
    }
`

export const GET_USER_DATA = gql`
    query me {
        me {
            id
            username
            admin
        }
    }
`
