import React, { useState, createContext } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";
import Chat from "./Chat";
import Landing from "./Landing";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Header from "./components/header";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";



export const UserContext = createContext();

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
];

const App = () => {
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState("");
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql ",
    cache: new InMemoryCache(),
  });
  return (
    <UserContext.Provider value={[username, setUsername, group, setGroup]}>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <Routes>
            {routes.map((item) => {
              return <Route key={item.path} path={item.path} element={item.element} />
            })}
          </Routes>
        </Router>
      </ApolloProvider>
    </UserContext.Provider >
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
