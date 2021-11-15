import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import useAuth from '../../../hooks/useAuth';
import './Header.css';

const Header = () => {
    const { user, logout, admin } = useAuth();

    return (
        <div>

            {/* responsive navbar */}
            <Navbar collapseOnSelect expand="lg" variant="light" className="header" fixed="top">

                <Container>
                    <Navbar.Brand as={Link} to="/">

                        <div className="d-flex text-start">
                            <div className="bg-light ps-2 pt-1 rounded-start">
                                <img
                                    src="https://i.ibb.co/pz3fBBX/B-GREEN.png"
                                    width="80"
                                    height="50"
                                    className="d-inline-block align-top me-2"
                                    alt="logo"
                                />
                            </div>
                            <div className="bg-success px-3 rounded-end">
                                <span className="brand text-white"> GREEN HOME </span>
                                <h6> <span className="text-warning"> Properties </span> </h6>
                            </div>
                        </div>

                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">

                        <Nav className="ms-auto fw-bold">
                            <Nav.Link as={HashLink} to="/home#banner">Home</Nav.Link>
                            <Nav.Link as={HashLink} to="/home#featured">Featured</Nav.Link>
                            <Nav.Link as={Link} to="/apartments">Explore</Nav.Link>
                            <Nav.Link as={HashLink} to="/home#reviews">Reviews</Nav.Link>

                            {/* showing dashboard in the navbar if the user logged in  */}
                            {user?.email ?
                                <>
                                    <NavDropdown title="Dashboard" menuVariant="success" className="btn-outline-success rounded-pill px-1 mx-2" id="basic-nav-dropdown">
                                        {!admin &&
                                            <div>

                                                <NavDropdown.Item as={Link} to="/payment">Pay</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/myApartments">My Bookings</NavDropdown.Item>
                                            </div>
                                        }
                                        {admin &&
                                            <div>

                                                <NavDropdown.Item as={Link} to="/addApartment">Add Apartment</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/manageApartments">Manage Apartments</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/manageAllBookings">Manage All Bookings</NavDropdown.Item>
                                                <NavDropdown.Item as={Link} to="/makeAdmin">Make Admin</NavDropdown.Item>
                                            </div>
                                        }

                                        <Nav.Link onClick={logout} className="btn-success btn-outline-danger text-white rounded-pill ps-4">Logout {user?.displayName}</Nav.Link>
                                    </NavDropdown>
                                </>
                                :
                                <Nav.Link as={Link} to="/login" className="btn-success btn-outline-warning text-white rounded-pill px-3">Login</Nav.Link>
                            }
                        </Nav>

                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>
    );
};

export default Header;