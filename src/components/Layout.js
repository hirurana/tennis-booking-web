import React, { useRef } from 'react';
import styled from 'styled-components';

import Header from './Header';
import Bookings from './Bookings';

// component styles
const Wrapper = styled.div`
  /* We can apply media query styles within the styled component */ /* This will only apply the layout for screens above 700px wide */
  @media (min-width: 700px) {
    display: flex;
    top: 175px;
    position: relative;
    height: calc(100% - 175px);
    width: 100%;
    flex: auto;
    flex-direction: column;
  }
`;

const Main = styled.main`
  position: fixed;
  height: calc(100% - 185px);
  width: 100%;
  padding: 1em;
  overflow-y: auto;
  /* Again apply media query styles to screens above 700px */
  @media (min-width: 700px) {
    flex: 1;
    margin-left: 25%;
    height: calc(100% - 175px);
    width: 75%;
  }
`;

const Layout = ({ children }, props) => {
  return (
    <React.Fragment>
      <Header />
      <Wrapper>
        <Bookings />
        {/* render home/signin/signup in the main section*/}
        <Main>{children}</Main>
      </Wrapper>
    </React.Fragment>
  );
};

export default Layout;
