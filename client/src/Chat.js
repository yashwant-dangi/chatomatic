import { useState } from "react";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { client } from "libs/client";
import getFriendsQuery from "gql/getFriends.graphql";
import GET_MESSAGES from "gql/getMessage.graphql";
import POST_MESSAGE from "gql/postMessage.graphql";
import GET_ALL_MESSAGE from "gql/getAllMessage.graphql";
import Messages from "components/message";

const currentUser = JSON.parse(sessionStorage.getItem("currentUser")).id;

const Chat = () => {
  const [state, setState] = useState({
    content: "",
    senderID: `${JSON.parse(sessionStorage.getItem("currentUser")).name}_${JSON.parse(sessionStorage.getItem("currentUser")).id}`, //send by
    groupId: "",
  });
  const [message, setMessage] = useState({});
  const { data: friendsData } = useQuery(getFriendsQuery);
  const { data: allMessages } = useQuery(GET_ALL_MESSAGE, {
    onCompleted: (data) => {
      const stateMessageCopy = JSON.parse(JSON.stringify(message));
      data?.getAllMessages?.map((item) => {
        const senderID = item?.senderID;
        const receiverID = item?.receiverID;
        if (stateMessageCopy[senderID]) {
          stateMessageCopy[senderID].push(item);
        } else {
          stateMessageCopy[senderID] = [item];
        }

        if (stateMessageCopy[receiverID]) {
          stateMessageCopy[receiverID].push(item);
        } else {
          stateMessageCopy[receiverID] = [item];
        }
      });
      setMessage(stateMessageCopy);
    },
  });

  const subscriptionData = useSubscription(GET_MESSAGES, {
    variables: {
      groupId: `${JSON.parse(sessionStorage.getItem("currentUser")).name}_${JSON.parse(sessionStorage.getItem("currentUser")).id}`,
    },
    onData: ({ data: { data } }) => {
      if (data?.messages) {
        const incomingMessage = data?.messages;
        const senderID = data?.messages?.senderID;
        if (message[senderID]) {
          const messageCopy = JSON.parse(JSON.stringify(message[senderID]));
          messageCopy.push(incomingMessage);
          setMessage({
            ...message,
            [senderID]: messageCopy,
          });
        } else {
          setMessage({
            ...message,
            [senderID]: [incomingMessage],
          });
        }
      }
    },
  });

  // console.log("🚀 ~ Messages ~ error:", subscriptionData.error)
  // console.log("🚀 ~ Messages ~ loading:", subscriptionData.loading)

  const loginData = client.cache;
  console.log("🚀 ~ Chat ~ loginData:", loginData);

  const [postMessage] = useMutation(POST_MESSAGE);

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
      // groupId: `${data?.name}_${data?.id}`,
      groupId: `${data?.id}`,
    });
  };

  console.log("message", message[state.groupId]);

  return (
    <div className="flex m-auto max-w-lg">
      <div className="grid grid-cols-[1fr_2fr] gap-5">
        <div className="flex flex-col gap-2">
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

        <div className="">
          {state.groupId ? (
            <>
              <Messages user={currentUser} data={message[state.groupId]} />
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
