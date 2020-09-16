import React from 'react';
import { useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { DELETE_BOOKING } from '../gql/mutation';
import { GET_BOOKINGS, GET_SESSIONS } from '../gql/query';

const CancelButton = styled.button`
  align-items: center;
  color: #fff;
  background-color: #dc3545;
  width: 95%;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
  margin: 0 0 10px 0;
  border: 0;
  border-radius: 0 0 10px 10px;
  cursor: pointer;
  outline: none;
  :hover {
    opacity: 0.8;
  }
  :active {
    background-color: #ff0000;
  }
`;

const DeleteButton = props => {
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    variables: {
      id: props.sessionId
    },
    refetchQueries: [{ query: GET_BOOKINGS, GET_SESSIONS }]
  });
  return <CancelButton onClick={deleteBooking}>Cancel</CancelButton>;
};
export default withRouter(DeleteButton);
