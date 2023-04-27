import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './register-style.css';

function Register() {
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate()

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password1', password1);
        formData.append('password2', password2);
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/social/profile/register/",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setFormErrors(data.errors || {});
                throw new Error(data.message);
            }
            console.log(data);
            navigate('/Login')
        } catch (error) {
            console.error(error);
        }
    };

    const handleButtonClick = () => {
        navigate('/Login');
    };

    return (
        <div className="formbox">
            <Form onSubmit={handleFormSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label className="labeltext">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {formErrors.username && (<div className="error">{formErrors.username[0]}</div>)}
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword1">
                            <Form.Label className="labeltext">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                            {formErrors.password1 && (<div className="error">{formErrors.password1[0]}</div>)}
                        </Form.Group>
                        <Form.Group controlId="formBasicFirstName">
                            <Form.Label className="labeltext">First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter First Name"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {formErrors.first_name && (<div className="error">{formErrors.first_name[0]}</div>)}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="labeltext">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {formErrors.email && (<div className="error">{formErrors.email[0]}</div>)}
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword2">
                            <Form.Label className="labeltext">Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            {formErrors.password2 && (<div className="error">{formErrors.password2}</div>)}

                        </Form.Group>
                        <Form.Group controlId="formBasicLastName">
                            <Form.Label className="labeltext">Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Last Name"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {formErrors.last_name && (<div className="error">{formErrors.last_name[0]}</div>)}
                        </Form.Group>
                    </Col>
                </Row>
                <div className="button text-center">
                    <Button variant="primary" type="submit">
                        Create Account
                    </Button>
                </div>
                <div className="button text-center">
                    <Button variant="success" type="submit" onClick={handleButtonClick}>
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default Register

