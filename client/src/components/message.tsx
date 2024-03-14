import { cn } from "libs/utils";

function Messages({ user, data }) {
  if (!data) {
    return null;
  } else {
    return (
      <>
        {data?.map(
          ({ user: messageUser, senderID, content, createdAt }, index) => {
            return (
              <div
                key={`${index}${content}`}
                style={{
                  // display: "flex",
                  justifyContent: user == senderID ? "flex-end" : "flex-start",
                  // paddingBottom: "1em",
                }}
                className="flex items-center pb-4"
              >
                {user !== messageUser && (
                  <div
                    style={
                      {
                        // height: 50,
                        // width: 50,
                        // marginRight: "0.5em",
                        // border: "2px solid #e5e6ea",
                        // borderRadius: 25,
                        // textAlign: "center",
                        // fontSize: "18pt",
                        // paddingTop: 5,
                      }
                    }
                    className="h-8 w-8 mr-2 border rounded-full text-center"
                  >
                    {messageUser?.slice(0, 2)?.toUpperCase()}
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2",
                    user === senderID
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  // style={{
                  //   background: user === senderID ? "#58bf56" : "#e5e6ea",
                  //   color: user === senderID ? "white" : "black",
                  //   padding: "1em",
                  //   borderRadius: "1em",
                  //   maxWidth: "60%",
                  // }}
                >
                  {content}
                  <span className="text-[0.6rem] text-gray-400 ml-2">
                    {new Date(parseInt(createdAt)).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </>
    );
  }
}

export default Messages;
