import React, { useState, useContext } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { UserContext } from "./App";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  Container,
  Row,
  Col,
  FormInput,
  ButtonGroup,
  Button,
} from "shards-react";

const link = new WebSocketLink({
  uri: "ws://localhost:4000",
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  //   uri: "https://48p1r2roz4.sse.codesandbox.io",
  uri: "http://localhost:4000 ",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription ($groupId: String!) {
    messages(groupId: $groupId) {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!, $groupId: String!) {
    postMessage(user: $user, content: $content, groupId: $groupId)
  }
`;

const Messages = ({ user, groupId, data }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    variables: {
      groupId,
    },
  });
  if (!data) {
    return null;
  } else {
    return (
      <>
        {data.messages.map(({ id, user: messageUser, content }, index) => (
          <div
            key={`${index}${content}`}
            style={{
              display: "flex",
              justifyContent: user === messageUser ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
          >
            {user !== messageUser && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid #e5e6ea",
                  borderRadius: 25,
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 5,
                }}
              >
                {messageUser.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === messageUser ? "#58bf56" : "#e5e6ea",
                color: user === messageUser ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              {content}
            </div>
          </div>
        ))}
      </>
    );
  }
};

const Chat = () => {
  const [username, setUsername, group, setGroup] = useContext(UserContext);

  const [state, setState] = useState({
    user: username,
    content: "",
    groupId: group,
  });
  const [postMessage] = useMutation(POST_MESSAGE);
  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    setState({
      ...state,
      content: "",
    });
  };

  const temp = [
    { user: "user1", content: "", groupid: "mac" },
    { user: "user1", content: "", groupid: "windows" },
  ];

  const groupChangeHandler = (data) => {
    console.log(
      "🚀 ~ file: Chat.jsx ~ line 134 ~ groupChangeHandler ~ data",
      data
    );
    setState({
      ...state,
      groupId: data,
    });
  };

  const resp = useSubscription(GET_MESSAGES, {
    variables: {
      groupId: state.groupId,
    },
  });
  console.log("🚀 ~ file: Chat.jsx ~ line 151 ~ Chat ~ resp", resp);

  return (
    <Container>
      <Row>
        <Col xs={3}>
          <Button theme="dark">Add new Group</Button>
          <div>Active Group - {state.groupId}</div>
          <ButtonGroup vertical>
            {temp.map((data) => (
              <Button
                theme="light"
                onClick={() => groupChangeHandler(data.groupid)}
              >
                {data.groupid}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
        <Col xs={9}>
          <Messages
            user={state.user}
            groupId={state.groupId}
            data={resp.data}
          />
          <Row>
            <Col xs={2} style={{ padding: 0 }}>
              <FormInput
                disabled
                label="User"
                value={state.user}
                onChange={(evt) => {
                  setState({
                    ...state,
                    user: evt.target.value,
                  });
                }}
              ></FormInput>
            </Col>
            <Col xs={8}>
              <FormInput
                label="Content"
                value={state.content}
                onChange={(evt) => {
                  setState({
                    ...state,
                    content: evt.target.value,
                  });
                }}
                onKeyUp={(evt) => {
                  if (evt.keyCode === 13) {
                    onSend();
                  }
                }}
              ></FormInput>
            </Col>
            <Col xs={2} style={{ padding: 0 }}>
              <Button onClick={() => onSend()}>Send</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default () => {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
};
