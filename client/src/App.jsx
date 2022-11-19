import React, { useState, createContext } from "react";
import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import "./index.css";
import Chat from "./Chat";
import Landing from "./Landing";

export const UserContext = createContext();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
]);

const App = () => {
  const [username, setUsername] = useState("");
  return (
    <UserContext.Provider value={[username, setUsername]}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
