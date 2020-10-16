import React, { useRef } from 'react'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'

import Header from './Header'
import Bookings from './BookingList'

//get login status
const IS_LOGGED_IN = gql`
    {
        isLoggedIn @client
    }
`

// component styles
const Wrapper = styled.div`
    /* We can apply media query styles within the styled component */ /* This will only apply the layout for screens above 700px wide */
    @media (min-width: 700px) {
        display: flex;
        top: 125px;
        position: relative;
        height: calc(100% - 125px);
        width: 100%;
        flex: auto;
        flex-direction: column;
    }
`

const Main = styled.main`
    position: fixed;
    height: calc(100% - 100px);

    width: 100%;
    padding: 1em;
    overflow-y: auto;
    /* Again apply media query styles to screens above 700px */
    @media (min-width: 700px) {
        flex: 1;
        margin-left: 25%;
        height: calc(100% - 125px);
        width: 75%;
    }
    @media (max-width: 700px) {
        margin: 125px 0 0 0;
    }
`

const Layout = ({ children }) => {
    const { data, client } = useQuery(IS_LOGGED_IN)
    console.log(data)
    return (
        <React.Fragment>
            <Header />
            <Wrapper>
                {data.isLoggedIn && <Bookings />}
                {/* render home/signin/signup in the main section*/}
                <Main
                    style={{
                        width: data.isLoggedIn ? null : '100%',
                        marginLeft: data.isLoggedIn ? null : '0%',
                    }}
                >
                    {children}
                </Main>
            </Wrapper>
        </React.Fragment>
    )
}

export default Layout
