import React, { useState } from "react";
import { Alert, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../../hooks/useAuth";

const Register = () => {
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", password2: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();
    const { user, registerUser, isLoading, authError, setAuthError } = useAuth();

    const handleOnChange = (e) => {
        setAuthError("");
        const { name, value } = e.target;
        setRegisterData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        const { password, password2 } = registerData;

        if (password !== password2) {
            setAuthError("Passwords do not match.");
            return;
        }
        registerUser(registerData.email, registerData.password, registerData.name, navigate);
    };

    return (
        <div className="bg-login body">
            <div className="p-5 bg-login2">
                <div className="p-5 mx-auto w-50 text-start bg-light login-card">
                    <Form onSubmit={handleRegisterSubmit}>
                        <h3 className="text-center mb-5">Sign Up</h3>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Control
                                type="text"
                                name="name"
                                onChange={handleOnChange}
                                placeholder="Enter name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                onChange={handleOnChange}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    onChange={handleOnChange}
                                    placeholder="Password"
                                    required
                                />
                                <Button
                                    variant="outline-light"
                                    className="bg-white text-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <InputGroup>
                                <Form.Control
                                    type={showPassword2 ? "text" : "password"}
                                    name="password2"
                                    onChange={handleOnChange}
                                    placeholder="Retype Password"
                                    required
                                />
                                <Button
                                    variant="outline-light"
                                    className="bg-white text-secondary"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                >
                                    <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} />
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <div className="text-center">
                            {isLoading && <Spinner animation="grow" variant="success" />}
                            {user?.email && <Alert variant="success">User Created Successfully!</Alert>}
                            {authError && <Alert variant="danger">{authError}</Alert>}
                        </div>

                        <div className="d-flex justify-content-center mt-4">
                            <Button variant="dark" type="submit" className="w-75 btn-outline-success rounded-pill fw-bold text-white">
                                Sign Up
                            </Button>
                        </div>
                    </Form>

                    <Button as={Link} to="/login" variant="white" type="button" className="fw-bold mt-4 w-100">
                        Already have an account?
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Register;
