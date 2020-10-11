import React, { useState } from 'react'
import styled from 'styled-components'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Clock from 'react-live-clock'
import { useQuery, gql } from '@apollo/client'
import { Link, withRouter } from 'react-router-dom'

import { Button } from 'react-bootstrap'

// local query
const IS_LOGGED_IN = gql`
    {
        isLoggedIn @client
    }
`

const GET_USER_DATA = gql`
    query me {
        me {
            id
            username
        }
    }
`

const HeaderBar = styled.header`
    width: 100%;
    padding: 0.5em 1em 0 3em;
    display: flex;
    height: 125px;
    position: fixed;
    align-items: center;
    background-color: #082244;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
    z-index: 1;
`

const MainTitle = styled.h1`
    color: #fff;
    margin: 0;
    padding: 0;
    display: inline;
`

const LoginItems = styled.div`
    position: fixed;
    text-align: center;
    height: 64px;
    margin-left: auto;
    right: 50px;
    display: inline-flex;
    background-color: #f26640;
    border-radius: 64px;
`

const AvatarIcon = styled.img`
    border-radius: 50%;
    :hover {
        opacity: 0.8;
    }
`

const Header = props => {
    const [logButton, setLogButton] = useState(0)

    const showLogButton = () => {
        setLogButton(1)
    }

    const hideLogButton = () => {
        setLogButton(0)
    }

    const { data, client, refetch } = useQuery(IS_LOGGED_IN)
    const { data: user_data, loading, error } = useQuery(GET_USER_DATA)

    refetch()

    return (
        <HeaderBar>
            <MainTitle>LOGO UCL Society Bookings | Tennis</MainTitle>
            {data.isLoggedIn ? (
                <LoginItems
                    onMouseLeave={hideLogButton}
                    onMouseEnter={showLogButton}
                    onLoad={hideLogButton}
                >
                    {!!user_data ? (
                        <AvatarIcon
                            src={`https://eu.ui-avatars.com/api/?name=${user_data.me.username
                                .split(' ')
                                .join('+')}&background=fff&color=082244`}
                            alt="Avatar"
                        />
                    ) : null}

                    {logButton ? (
                        <Button
                            style={{
                                borderRadius: '0 64px 64px 0',
                                outline: 'none',
                            }}
                            onClick={() => {
                                //remove the token
                                localStorage.removeItem('token')
                                //cleaer the application's cache
                                client.resetStore()
                                // update the local state
                                client.writeData({
                                    data: { isLoggedIn: false },
                                })
                                // redirect the user to the home page
                                props.history.push('/signin')
                            }}
                        >
                            Log Out
                        </Button>
                    ) : null}
                </LoginItems>
            ) : (
                <LoginItems>
                    <Button
                        style={{
                            borderRadius: '64px 0 0 64px',
                            outline: 'none',
                        }}
                        onClick={() => props.history.push('/signin')}
                    >
                        Sign In
                    </Button>
                    <Button
                        style={{
                            borderRadius: '0 64px 64px 0',
                            outline: 'none',
                        }}
                        onClick={() => props.history.push('/signup')}
                    >
                        Sign Up
                    </Button>
                </LoginItems>
            )}
        </HeaderBar>
    )
}

export default withRouter(Header)
