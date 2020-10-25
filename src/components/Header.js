import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Clock from 'react-live-clock'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import { Button } from 'react-bootstrap'
import Logo from '../img/favicon.ico'

const HeaderBar = styled.header`
    width: 100%;
    padding: 0.5em 1em 0 3em;
    display: flex;
    height: 125px;
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
    text-align: center;
    height: 64px;
    margin-left: auto;
    right: 50px;
    display: inline-flex;
    background-color: #502776;
    border-radius: 64px;
`

const AvatarIcon = styled.img`
    border-radius: 50%;
    :hover {
        opacity: 0.8;
    }
`

import { LoggedIn, Responsive, UserData } from '../Contexts'

const Header = () => {
    const history = useHistory()
    const { isLoggedIn, logOut } = useContext(LoggedIn)
    const { userData, userDataRefetch } = useContext(UserData)

    console.log(isLoggedIn)
    console.log(userData)

    const { lt768, lt992 } = useContext(Responsive)

    const [logButton, setLogButton] = useState(0)

    const showLogButton = () => {
        setLogButton(1)
    }

    const hideLogButton = () => {
        setLogButton(0)
    }

    return (
        <HeaderBar>
            {lt768 ? (
                <MainTitle>
                    <img
                        src={Logo}
                        alt="UCL Tennis Logo"
                        height="100"
                        style={{ padding: '0.25em' }}
                    />{' '}
                </MainTitle>
            ) : (
                <MainTitle style={{ fontSize: lt992 ? '4vw' : '50px' }}>
                    <img
                        src={Logo}
                        alt="UCL Tennis Logo"
                        height="100"
                        style={{ padding: '0.25em' }}
                    />{' '}
                    UCL Tennis Court Bookings
                </MainTitle>
            )}

            {isLoggedIn ? (
                <LoginItems
                    onMouseLeave={hideLogButton}
                    onMouseEnter={showLogButton}
                    onLoad={hideLogButton}
                >
                    {!!userData ? (
                        <AvatarIcon
                            src={`https://eu.ui-avatars.com/api/?name=${userData.username
                                .split(' ')
                                .join('+')}&background=fffff&color=082244`}
                            alt="Avatar"
                        />
                    ) : null}

                    {logButton || lt768 ? (
                        <Button
                            style={{
                                borderRadius: '0 64px 64px 0',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: '#502776',
                            }}
                            onClick={() => {
                                //remove the token
                                localStorage.removeItem('token')
                                logOut()
                                userDataRefetch()
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
                            border: 'none',
                            backgroundColor: '#502776',
                        }}
                        onClick={() => history.push('/signin')}
                    >
                        Sign In
                    </Button>
                    <Button
                        style={{
                            borderRadius: '0 64px 64px 0',
                            outline: 'none',
                            border: 'none',
                            backgroundColor: '#502776',
                        }}
                        onClick={() => history.push('/signup')}
                    >
                        Sign Up
                    </Button>
                </LoginItems>
            )}
        </HeaderBar>
    )
}

export default Header
