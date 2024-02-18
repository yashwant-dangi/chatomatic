import React from "react";
import { useNavigate } from 'react-router-dom';

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
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>
        <button onClick={handleSignupClick}>sign up</button>
        <button onClick={handleLoginClick}>login</button>
    </header>
}

export default Header;