import styled from 'styled-components';

const SessionItem = styled.button`
  align-items: center;
  color: #4c4c4c;
  width: 95%;
  text-align: center;
  vertical-align: middle;
  padding: 20px;
  margin: 0 0 10px 0;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  :hover {
    opacity: 0.8;
  }
  :active {
    background-color: #082244;
  }
`;

export default SessionItem;
