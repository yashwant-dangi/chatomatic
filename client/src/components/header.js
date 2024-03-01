import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button'

function Header() {
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate("/signup")
    }
    const handleLoginClick = () => {
        navigate("/login")
    }
    return <header>
        <Button onClick={handleSignupClick}>sign up</Button>
        <Button variant="secondary" onClick={handleLoginClick}>login</Button>
    </header>
}

export default Header;