import { useState } from "react";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { client } from "libs/client";
import { getFriends } from "gql/getFriends";
import { messages } from "gql/getMessage";
import { post_Message } from "gql/postMessage";
import { getAllMessages } from "gql/getAllMessage";
import Messages from "components/message";
import { Separator } from "components/ui/separator";

const currentUser = JSON.parse(
  sessionStorage.getItem("currentUser") || "{}"
)?.id;

const Chat = () => {
  const [state, setState] = useState({
    content: "",
    senderID: `${JSON.parse(sessionStorage.getItem("currentUser") || "{}").name}_${JSON.parse(sessionStorage.getItem("currentUser") || "{}")?.id}`, //send by
    groupId: "",
  });
  const [message, setMessage] = useState({});
  const { data: friendsData } = useQuery(getFriends);
  const { data: allMessages } = useQuery(getAllMessages, {
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

  const subscriptionData = useSubscription(messages, {
    variables: {
      groupId: `${JSON.parse(sessionStorage.getItem("currentUser") || "{}").name}_${JSON.parse(sessionStorage.getItem("currentUser") || "{}")?.id}`,
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

  const [postMessage] = useMutation(post_Message);

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
    <div className="m-auto w-11/12">
      <div className="grid grid-cols-[1fr_auto_2fr] gap-4">
        <div className="flex flex-col gap-2">
          <div>Friends List</div>
          <div>Active Chat ID - {state.groupId}</div>

          {friendsData?.getFriends?.map((data, index) => (
            <Button
              key={index}
              variant={data?.id === state.groupId ? "secondary" : "outline"}
              onClick={() => groupChangeHandler(data)}
            >
              {data?.name}
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" />

        <div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm pb-0 h-4/6 overflow-scroll">
            {state.groupId ? (
              <>
                <div className="p-6">
                  <Messages user={currentUser} data={message[state.groupId]} />
                </div>
                <div className="flex gap-2 sticky bottom-0 bg-secondary p-2">
                  <Input
                    value={state.content}
                    placeholder="type your message here"
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
                  />
                  <Button onClick={() => onSend()}>Send</Button>
                </div>
              </>
            ) : (
              <div className="">Start New Chat</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
