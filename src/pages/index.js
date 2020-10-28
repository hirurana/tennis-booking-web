import React, { useContext, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER_DATA } from '../gql/query'

// import routes
import Home from './home'
import SignUp from './signup'
import SignIn from './signin'
import ForgotPassword from './forgotpassword'
import ResetPassword from './reset'
import ForgotSignup from './forgotsignup'
import Header from '../components/Header'

import { LoggedIn, UserData, Responsive } from '../Contexts'
import { useMediaQuery } from 'react-responsive'

// define routes
const Pages = () => {
    // TODO: check if this query is instant, since it is a local cache query
    const {
        data: userData,
        loading: userDataLoading,
        refetch: userDataRefetch,
    } = useQuery(GET_USER_DATA)

    // TODO replace all media queries with a useContext
    const responsive = {
        lt576: useMediaQuery({ query: '(max-width: 576px)' }),
        lt768: useMediaQuery({ query: '(max-width: 768px)' }),
        lt992: useMediaQuery({ query: '(max-width: 992px)' }),
        lt1200: useMediaQuery({ query: '(max-width: 1200px)' }),
    }

    const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'))

    if (userDataLoading) {
        return <div>Loading...</div>
    }
    if (userData === undefined && isLoggedIn) {
        // edge case for token expiry
        setLoggedIn(false)
    }

    return (
        <Responsive.Provider value={responsive}>
            <LoggedIn.Provider
                value={{
                    isLoggedIn,
                    logIn: () => {
                        setLoggedIn(true)
                    },
                    logOut: () => {
                        setLoggedIn(false)
                    },
                }}
            >
                <UserData.Provider
                    value={{
                        userData: userData ? userData.me : undefined,
                        userDataRefetch: () => {
                            console.log('userdatarefetch')
                            return userDataRefetch()
                        },
                    }}
                >
                    <Header></Header>
                    <SignedInRoute exact path="/" component={Home} />
                    <SignedOutRoute exact path="/signin" component={SignIn} />
                    <SignedOutRoute
                        exact
                        path="/forgotpassword"
                        component={ForgotPassword}
                    />
                    <SignedOutRoute
                        exact
                        path="/signup"
                        component={ForgotSignup}
                    />
                    <SignedOutRoute path="/signup/:id" component={SignUp} />
                    <SignedOutRoute
                        path="/reset/:id"
                        component={ResetPassword}
                    />
                </UserData.Provider>
            </LoggedIn.Provider>
        </Responsive.Provider>
    )
}

const SignedInRoute = ({ component: Component, ...rest }) => {
    const { isLoggedIn } = useContext(LoggedIn)
    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/signin',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    )
}

const SignedOutRoute = ({ component: Component, ...rest }) => {
    const { isLoggedIn } = useContext(LoggedIn)
    return (
        <Route
            {...rest}
            render={props =>
                !isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    )
}

export default Pages
