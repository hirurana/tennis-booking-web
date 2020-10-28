import { gql } from '@apollo/client'

export const GET_BOOKINGS = gql`
    query me {
        me {
            id
            sessions {
                id
                address
                startTime
                endTime
                duration
                level
                courtIndex
                maxSlots
                participants {
                    id
                    fullName
                }
                author {
                    fullName
                }
                lastUpdatedBy {
                    fullName
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
            endTime
            duration
            level
            courtIndex
            maxSlots
            participants {
                id
                fullName
            }
            author {
                fullName
            }
            lastUpdatedBy {
                fullName
            }
        }
    }
`

export const VERIFY_LINK = gql`
    query verifyLink($uuid: String!, $signUp: Boolean!) {
        verifyLink(uuid: $uuid, signUp: $signUp) {
            success
            email
        }
    }
`

export const GET_USER_DATA = gql`
    query me {
        me {
            id
            fullName
            admin
            maxSessions
        }
    }
`
