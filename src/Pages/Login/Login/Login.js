import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Login.css';
import { useHistory, useLocation } from 'react-router';

const Login = () => {
    const [loginData, setLoginData] = useState({});
    const { user, loginUser, signInWithGoogle, handleResetPassword, isLoading, authError } = useAuth();
    // const [error, setError] = useState('');
    // const [message, setMessage] = useState('');
    // const { signInUsingGoogle, isLogin,
    //     handleRegistration,
    //     handleNameChange,
    //     handleEmailChange,
    //     handlePassChange,
    //     processLogin,
    //     toggleLogin,
    //     handleResetPassword,
    // } = useAuth();

    const location = useLocation();
    const history = useHistory();
    // const redirect_uri = location.state?.from || '/';
    const handleOnChange = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newLoginData = { ...loginData };
        newLoginData[field] = value;
        setLoginData(newLoginData);
    }
    const handleLoginSubmit = e => {
        loginUser(loginData.email, loginData.password, location, history);
        e.preventDefault();
    }

    const handleGoogleSignIn = () => {
        signInWithGoogle(location, history)
    }

    // const handleGoogleLogin = () => {
    //     signInUsingGoogle()
    //         .then(result => {
    //             history.push(redirect_uri);
    //         })
    // }

    // const handleEmailLogin = e => {
    //     processLogin()
    //         .then(result => {
    //             setError('');
    //             setMessage('Login Successful');
    //             history.push(redirect_uri);
    //         })
    // }


    return (
        <div className="bg-login body">
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
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                name="password"
                                onChange={handleOnChange}
                                placeholder="Password"
                                required
                            />
                        </Form.Group>

                        {/* showing error/succuss massage  */}
                        <div className="d-flex justify-content-between">
                            <div className="fw-bold">
                                {/* <span className="text-danger">{error}</span>
                                <span className="text-success">{message}</span> */}
                                {isLoading && <Spinner animation="grow" variant="success" />}

                                {user?.email && <Alert variant={'success'}>Login successful!</Alert>}

                                {authError && <Alert variant={'danger'}> {authError} </Alert>}
                            </div>

                            {/* password reseting  */}
                            <div>
                                <p onClick={handleResetPassword} type="button" className="text-end">Forgot Password?</p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <Button
                                // onClick={handleEmailLogin} 
                                variant="dark" type="submit" className="w-50 btn-outline-success rounded-pill fw-bold text-white mt-4 mx-1"> Login </Button>

                            {/* google signin  */}
                            <Button onClick={handleGoogleSignIn} variant="light" type="submit" className="w-50 btn-outline-success rounded-pill fw-bold mt-4 mx-1">
                                <FontAwesomeIcon icon={faGoogle} /> Continue with Google
                            </Button>
                        </div>
                    </Form>

                    <Button as={Link} to="/register" variant="white" type="submit" className="fw-bold mt-4 w-100 mx-auto">Don't have an account? </Button>

                </div>
            </div>
        </div>
    );
};


export default Login;