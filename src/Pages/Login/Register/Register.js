import React, { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import useAuth from '../../../hooks/useAuth';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Register = () => {
    const [loginData, setLoginData] = useState({});
    const history = useHistory();
    const { user, registerUser, isLoading, authError } = useAuth();

    const handleOnBlur = e => {
        const field = e.target.name;
        const value = e.target.value;
        const newLoginData = { ...loginData };
        newLoginData[field] = value;
        setLoginData(newLoginData);
    }
    const handleLoginSubmit = e => {
        if (loginData.password !== loginData.password2) {
            alert('Your password did not match');
            return
        }
        registerUser(loginData.email, loginData.password, loginData.name, history);
        e.preventDefault();

    }
    return (
        <div className="bg-login body">
            <div className="p-5 bg-login2">
                <div className="p-5 mx-auto w-50 text-start bg-light login-card">

                    {!isLoading && <form onSubmit={handleLoginSubmit}>
                        <h3 className="text-center mb-5">Sign Up</h3>

                        <Form.Group
                            className="mb-3" controlId="formBasicName">
                            <Form.Control
                                type="name"
                                name="name"
                                onBlur={handleOnBlur}
                                placeholder="Enter name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                onBlur={handleOnBlur}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                name="password"
                                onBlur={handleOnBlur} placeholder="Password"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                name="password2"
                                onBlur={handleOnBlur}
                                placeholder="Retype Password"
                            />
                        </Form.Group>

                        {/* showing error/succuss massage  */}
                        <div className="d-flex justify-content-between">
                            <div className="fw-bold">
                                {/* <span className="text-danger">{error}</span>
                                <span className="text-success">{message}</span> */}

                                {isLoading && <Spinner animation="grow" variant="success" />}

                                {user?.email && <Alert variant={'success'}> User Created successfully! </Alert>}

                                {authError && <Alert variant={'danger'}> {authError} </Alert>}
                            </div>
                        </div>

                        <div className="d-flex">
                            <Button variant="dark" type="submit" className="w-75 btn-outline-success rounded-pill fw-bold text-white mt-4 mx-auto">Sign Up </Button>
                        </div>
                    </form>}

                    <Button as={Link} to="/login" variant="white" type="submit" className="fw-bold mt-4 w-100">Already have an account? </Button>

                </div>
            </div>
        </div>
    );
};

export default Register;