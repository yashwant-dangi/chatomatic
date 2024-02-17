import React from "react";
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate("/signup")
    }
    const handleLoginClick = () => {
        navigate("/signup")
    }
    return <header>
        header
        <button onClick={handleSignupClick}>sign up</button>
        <button onClick={handleLoginClick}>login</button>
    </header>
}

export default Header;