import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const { user, logout, admin } = useAuth();
  const navigate = useNavigate();

  const dashboardLinks = admin
    ? [
      { path: "/addApartment", label: "Add Apartment" },
      { path: "/manageApartments", label: "Manage Apartments" },
      { path: "/manageAllBookings", label: "Manage All Bookings" },
      { path: "/makeAdmin", label: "Make Admin" },
    ]
    : [
      { path: "/reviewAdding", label: "Give a Review" },
      { path: "/payment", label: "Pay" },
      { path: "/myApartments", label: "My Bookings" },
    ];

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="light"
      className="header"
      fixed="top"
    >
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
              <h6>
                {" "}
                <span className="text-warning"> Properties </span>{" "}
              </h6>
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto fw-bold">
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

            {user?.email ? (
              <NavDropdown title="Dashboard" id="dashboard-dropdown">
                {dashboardLinks.map((link) => (
                  <NavDropdown.Item as={Link} to={link.path} key={link.path}>
                    {link.label}
                  </NavDropdown.Item>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="btn btn-outline-danger rounded-pill w-100"
                >
                  Logout {user?.displayName}
                </button>
              </NavDropdown>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="btn btn-success btn-outline-warning text-white rounded-pill px-3"
              >
                Login
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
