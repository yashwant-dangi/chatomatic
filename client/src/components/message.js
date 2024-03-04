function Messages({ user, data }) {
  if (!data) {
    return null;
  } else {
    return (
      <>
        {data?.map(({ user: messageUser, senderID, content }, index) => {
          return (
            <div
              key={`${index}${content}`}
              style={{
                display: "flex",
                justifyContent: user == senderID ? "flex-end" : "flex-start",
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
                  {messageUser?.slice(0, 2)?.toUpperCase()}
                </div>
              )}
              <div
                style={{
                  background: user === senderID ? "#58bf56" : "#e5e6ea",
                  color: user === senderID ? "white" : "black",
                  padding: "1em",
                  borderRadius: "1em",
                  maxWidth: "60%",
                }}
              >
                {content}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

export default Messages;
