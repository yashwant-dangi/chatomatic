import React, { useState, useContext } from "react";
import { UserContext } from "./App";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { client } from "libs/client";
import loginMutation from "gql/login.graphql";
import getFriendsQuery from "gql/getFriends.graphql";
import GET_MESSAGES from "gql/getMessage.graphql";
import POST_MESSAGE from "gql/postMessage.graphql";
import Messages from "components/message";

const Chat = () => {
  const [state, setState] = useState({
    senderId: JSON.parse(sessionStorage.getItem("currentUser")).id, //send by
    content: "",
    groupId: "",
  });
  const [message, setMessage] = useState({});
  const { data: friendsData, error, loading } = useQuery(getFriendsQuery);

  const subscriptionData = useSubscription(GET_MESSAGES, {
    variables: {
      groupId: JSON.parse(sessionStorage.getItem("currentUser")).name,
    },
  });
  console.log("🚀 ~ Messages ~ data:", subscriptionData.data);
  if (subscriptionData?.data?.messages) {
    const message = subscriptionData?.data?.messages;
    const senderID = subscriptionData?.data?.messages?.senderId;
    if (message[senderID]) {
      const messageCopy = JSON.parse(JSON.stringify(message[senderID]));
      messageCopy.push(message);
      setMessage({
        ...message,
        [state.groupId]: messageCopy,
      });
    } else {
      setMessage({
        ...message,
        [state.groupId]: [state],
      });
    }
  }
  // console.log("🚀 ~ Messages ~ error:", subscriptionData.error)
  // console.log("🚀 ~ Messages ~ loading:", subscriptionData.loading)

  const loginData = client.cache;
  console.log("🚀 ~ Chat ~ loginData:", loginData);

  const [postMessage, { data, error: postmsgerr }] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
      if (message[state.groupId]) {
        const messageCopy = JSON.parse(JSON.stringify(message[state.groupId]));
        messageCopy.push(state);
        setMessage({
          ...message,
          [state.groupId]: messageCopy,
        });
      } else {
        setMessage({
          ...message,
          [state.groupId]: [state],
        });
      }
    }
    setState({
      ...state,
      content: "",
    });
  };

  const groupChangeHandler = (data) => {
    setState({
      ...state,
      groupId: `${data?.name}_${data?.id}`,
    });
  };

  console.log("message", message[state.groupId]);

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
              onClick={() => groupChangeHandler(data)}
            >
              {data?.name}
            </Button>
          ))}
        </div>

        <div className="grid-cols-2">
          {state.groupId ? (
            <>
              <Messages
                user={state.user}
                groupId={state.groupId}
                data={message[state.groupId]}
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
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
