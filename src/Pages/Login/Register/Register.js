import React, { useState } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import useAuth from '../../../hooks/useAuth';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [registerData, setRegisterData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const history = useHistory();
    const { user, registerUser, isLoading, authError, setAuthError } = useAuth();

    const handleOnChange = e => {
        setAuthError('');
        const field = e.target.name;
        const value = e.target.value;
        setRegisterData(prevState => ({ ...prevState, [field]: value }));
    }

    const handleRegisterSubmit = e => {
        e.preventDefault();
        if (registerData.password !== registerData.password2) {
            setAuthError('Your password did not match');
            return
        }
        registerUser(registerData.email, registerData.password, registerData.name, history);

    }

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'password2') {
            setShowPassword2(!showPassword2);
        }
    };

    return (
        <div className="bg-login body">
            <div className="p-5 bg-login2">
                <div className="p-5 mx-auto w-50 text-start bg-light login-card">
                    <Form onSubmit={handleRegisterSubmit}>
                        <h3 className="text-center mb-5">Sign Up</h3>

                        <Form.Group
                            className="mb-3" controlId="formBasicName">
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
                                {/* <InputGroup.Append> */}
                                <Button variant="outline-light" className='bg-white text-secondary' onClick={() => togglePasswordVisibility('password')}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </Button>
                                {/* </InputGroup.Append> */}
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
                                {/* <InputGroup.Append> */}
                                <Button variant="outline-light" className='bg-white text-secondary' onClick={() => togglePasswordVisibility('password2')}>
                                    <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} />
                                </Button>
                                {/* </InputGroup.Append> */}
                            </InputGroup>
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
                    </Form>

                    <Button as={Link} to="/login" variant="white" type="submit" className="fw-bold mt-4 w-100">Already have an account? </Button>

                </div>
            </div>
        </div>
    );
};

export default Register;