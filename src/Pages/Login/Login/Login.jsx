import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Alert, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./Login.css";

const Login = () => {
    const [loginData, setLoginData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { user, loginUser, signInWithGoogle, isLoading, authError, setAuthError } = useAuth();

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const location = useLocation();
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setAuthError("");
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setAuthError("");
        loginUser(loginData.email, loginData.password, location, navigate);
    };

    const handleGoogleSignIn = () => {
        setAuthError("");
        signInWithGoogle(location, navigate);
    };

    return (
        <main className="bg-login body">
            <div className="p-5 bg-login2">
                <div className="p-5 mx-auto w-50 text-start bg-light login-card">
                    <Form onSubmit={handleLoginSubmit}>
                        <h3 className="text-center mb-5">Login</h3>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                onChange={handleOnChange}
                                placeholder="Enter email"
                                aria-label="Email"
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
                                    aria-label="Password"
                                    required
                                />
                                <Button
                                    variant="outline-light"
                                    className="bg-white text-secondary"
                                    onClick={togglePasswordVisibility}
                                    aria-label="Toggle password visibility"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <div className="fw-bold">
                                {isLoading && <Spinner animation="grow" variant="success" />}
                                {user?.email && <Alert variant="success">Login successful!</Alert>}
                                {authError && <Alert variant="danger">{authError}</Alert>}
                            </div>
                        </div>

                        <div className="d-flex">
                            <Button
                                variant="dark"
                                type="submit"
                                className="w-50 btn-outline-success rounded-pill fw-bold text-white mt-4 mx-1"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={handleGoogleSignIn}
                                variant="light"
                                type="button"
                                className="w-50 btn-outline-success rounded-pill fw-bold mt-4 mx-1"
                            >
                                <FontAwesomeIcon icon={faGoogle} /> Continue with Google
                            </Button>
                        </div>
                    </Form>

                    <Button
                        onClick={() => setAuthError("")}
                        as={Link}
                        to="/register"
                        variant="white"
                        className="fw-bold mt-4 w-100 mx-auto"
                    >
                        Don't have an account?
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default Login;
