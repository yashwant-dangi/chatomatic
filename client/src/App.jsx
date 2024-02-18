import React, { useState, createContext } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./output.css";


import "./index.css";
import Chat from "./Chat";
import Landing from "./Landing";
import Signup from "./pages/signup";
import Header from "./components/header";

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
    path: "chat",
    element: <Chat />,
  },
];

const App = () => {
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState("");
  return (
    <UserContext.Provider value={[username, setUsername, group, setGroup]}>
      <Router>
        <Header />
        <Routes>
          {routes.map((item) => {
            return <Route key={item.path} path={item.path} element={item.element} />
          })}
        </Routes>
      </Router>
    </UserContext.Provider >
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
