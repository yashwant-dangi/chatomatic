import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  FormInput,
  Button,
  Form,
  FormGroup,
} from "shards-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./App";

function Landing() {
  const navigate = useNavigate();
  const joinHandler = (e) => {
    e.preventDefault();
    setUsername(state.username);
    setGroup(state.group);
    navigate("/chat");
  };

  const [state, setState] = useState({
    group: "",
    username: "",
  });
  return (
    <Container>
      <h2>Chatomtic</h2>
      <Form>
        <FormGroup>
          <label htmlFor="#group">Group</label>
          <FormInput
            id="#group"
            placeholder="Group"
            value={state.group}
            onChange={(evt) => {
              setState({
                ...state,
                group: evt.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="#username">UserName</label>
          <FormInput
            id="#username"
            placeholder="Username"
            value={state.username}
            onChange={(evt) => {
              setState({
                ...state,
                username: evt.target.value,
              });
            }}
          />
        </FormGroup>
        <Button onClick={joinHandler}>Join Group</Button>
      </Form>
    </Container>
  );
}

export default Landing;
