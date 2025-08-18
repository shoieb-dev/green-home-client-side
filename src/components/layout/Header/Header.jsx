import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Avatar1 from "../../../assets/images/avatar1.png";
import useAuth from "../../../hooks/useAuth";
import "./Header.css";
import UserProfile from "./UserProfile";

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Navbar collapseOnSelect expand="lg" variant="light" className="header" fixed="top">
            {/* <div className="mx-5 d-flex align-items-center"> */}
            <Container fluid className="mx-2">
                {/* Brand / Logo */}
                <Navbar.Brand as={Link} to="/">
                    <div className="d-flex text-start align-items-center">
                        <div className="bg-light ps-2 pt-1 rounded-start">
                            <img src="https://i.ibb.co/pz3fBBX/B-GREEN.png" width="80" height="50" alt="logo" />
                        </div>
                        <div className="bg-success px-3 rounded-end">
                            <span className="brand text-white">GREEN HOME</span>
                            <h6 className="m-0">
                                <span className="text-warning">Properties</span>
                            </h6>
                        </div>
                    </div>
                </Navbar.Brand>

                {/* Mobile Toggle */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {/* Public Navigation */}
                    <Nav className="ms-auto fw-bold align-items-center">
                        <Nav.Link as={HashLink} to="/home#banner">
                            Home
                        </Nav.Link>
                        <Nav.Link as={HashLink} to="/home#featured">
                            Featured
                        </Nav.Link>
                        <Nav.Link as={HashLink} to="/home#reviews">
                            Reviews
                        </Nav.Link>
                        <Nav.Link as={Link} to="/apartments">
                            Explore
                        </Nav.Link>

                        {/* Auth Section */}
                        {user?.email ? (
                            <div className="d-flex align-items-center ml-5 cursor-pointer" onClick={toggleOpen}>
                                <img
                                    className="rounded-full w-8 h-8"
                                    src={user.photoURL || Avatar1}
                                    alt="user-profile"
                                />
                                <span className="ms-2 me-2 text-success fw-semibold">{user.displayName}</span>
                                <MdKeyboardArrowDown className="text-black text-14" />
                                {isOpen && <UserProfile onClose={toggleOpen} />}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="btn btn-success btn-outline-warning text-white rounded-pill px-3"
                            >
                                Login
                            </button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {/* </div> */}
        </Navbar>
    );
};

export default Header;
