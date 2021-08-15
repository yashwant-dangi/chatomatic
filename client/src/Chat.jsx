import React from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  //   uri: "https://48p1r2roz4.sse.codesandbox.io",
  uri: "http://localhost:4000 ",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      user
    }
  }
`;

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES);
  if (!data) {
    return null;
  } else {
    return JSON.stringify(data);
  }
};

const Chat = () => {
  return (
    <div>
      <Messages user={"Jack"} />
    </div>
  );
};

export default () => {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
};
