import React from 'react'

export const LoggedIn = React.createContext({
    isLoggedIn: false,
    logIn: undefined,
    logOut: undefined,
})

export const UserData = React.createContext({
    userData: undefined,
    userDataRefetch: undefined,
})

// https://getbootstrap.com/docs/4.1/layout/overview/ look at default breakpoints
export const Responsive = React.createContext({
    lt576: false,
    lt768: false,
    lt992: false,
    lt1200: true,
})

export const Sessions = React.createContext(undefined)

export const Bookings = React.createContext(undefined)
