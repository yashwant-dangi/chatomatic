import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./App";

function Landing() {
  const navigate = useNavigate();
  const joinHandler = (e) => {
    e.preventDefault();
    setUsername(state.username);
    setGroup(state.group);
    navigate("/chat");
  };

  const [state, setState] = useState({
    group: "",
    username: "",
  });
  return (
    <div>
      <h2>Chatomtic</h2>
    </div>
  );
}

export default Landing;
