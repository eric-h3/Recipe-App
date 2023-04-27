import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './login-style.css';


async function handleLogin(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('http://127.0.0.1:8000/social/profile/login/', {
        method: 'POST',
        body: formData
    });
    console.log(response);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // prevent the default form submission behavior
        try {
            const response = await handleLogin(username, password);
            localStorage.setItem('user', response.uid);
            localStorage.setItem('access_token', response.access_token);
            //navigate('/');
            window.location.href = '/';
        } catch (error) {
            setErrorMessage('Username or Password Incorrect');
            console.log(error);
        }
    };

    const handleButtonClick = () => {
        navigate('/Register');
    };

    return (
        <div className="formcube">
            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label className="labeltext">Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="labeltext">Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {errorMessage && <div className="error"> {errorMessage} </div>}
                <div className="button text-center">
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </div>
                <div className="button text-center">
                    <Button variant="success" type="submit" onClick={handleButtonClick}>
                        Create Account
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default Login

