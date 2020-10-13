import React, { useRef } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

const IS_LOGGED_IN = gql`
    {
        isLoggedIn @client
    }
`

// import shared layout component
import Layout from '../components/Layout'

// import routes
import Home from './home'
import SignUp from './signup'
import SignIn from './signin'
import ForgotPassword from './forgotpassword'

// define routes
const Pages = () => {
    return (
        <Router>
            <Layout>
                <PrivateRoute exact path="/" component={Home} />
                <Route path="/signup" component={SignUp} />
                <Route path="/signin" component={SignIn} />
                <Route path="/forgotpassword" component={ForgotPassword} />
                <Route path="/reset/:id" component={SignUp} />
            </Layout>
        </Router>
    )
}

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { loading, error, data } = useQuery(IS_LOGGED_IN)
    //if the data is loading, display a loading message
    if (loading) return <p>Loading...</p>

    if (error) return <p>Error!</p>

    return (
        <Route
            {...rest}
            render={props =>
                data.isLoggedIn === true ? (
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

export default Pages
