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
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import getFriendsQuery from 'gql/getFriends.graphql'

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

const Messages = ({ user, groupId }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    variables: {
      groupId: 'mac',
    },
  });
  console.log("🚀 ~ Messages ~ data:", data)
  if (!data) {
    return null;
  } else {
    return (
      <>
        {data?.messages?.map(({ id, user: messageUser, content }, index) => (
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
  const { data: friendsData, error, loading } = useQuery(getFriendsQuery);

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

  // const resp = useSubscription(GET_MESSAGES, {
  //   variables: {
  //     groupId: state.groupId,
  //   },
  // });
  // console.log("🚀 ~ file: Chat.jsx ~ line 151 ~ Chat ~ resp", resp);

  return (
    <div className="flex m-auto max-w-lg">
      <div className="grid grid-flow-col gap-5">
        <div className="grid-cols-1 flex flex-col gap-2">
          <div>Friends List</div>
          <div>Active Chat ID - {state.groupId}</div>
          {friendsData?.getFriends?.map((data, index) => (
            <Button
              key={index}
              theme="light"
              onClick={() => groupChangeHandler(data.id)}
            >
              {data?.name}
            </Button>
          ))}
        </div>
        <div className="grid-cols-2">
          <Messages
            user={state.user}
            groupId={state.groupId}
          // data={resp.data}
          />
          <div className="flex gap-2">
            <div>
              <Input
                disabled
                label="User"
                value={state.user}
                onChange={(evt) => {
                  setState({
                    ...state,
                    user: evt.target.value,
                  });
                }}
              ></Input>
            </div>
            <div>
              <Input
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
              ></Input>
            </div>
            <div>
              <Button onClick={() => onSend()}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <Chat />
  );
};
