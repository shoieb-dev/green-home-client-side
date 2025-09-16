import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import toast from "react-hot-toast";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Avatar1 from "../../../assets/images/avatar1.png";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import "./Header.css";
import UserProfile from "./UserProfile";

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { axiosInstance } = useAxiosInstance();
    const { isCollapsed, setIsCollapsed, toggleSidebar, userData, setUserData } = useSidebar();
    const [isOpen, setIsOpen] = useState(false);
    const { mode, id } = useParams();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const fetchUserData = async () => {
        try {
            const { data } = await axiosInstance.get(`${API_ENDPOINTS.users}/${user.email}`);
            setUserData(data?.data || {});
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchUserData();
        }
    }, [user.email]);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const dashboardRoutes = [
        "/dashboard",
        "/booking",
        "/bookings",
        "/reviewAdding",
        "/payment",
        "/manageAllBookings",
        "/manageApartments",
        "/apartment-form",
        `/apartment-form/${mode}/${id}`,
        "/makeAdmin",
        "/profile",
    ];

    const isDashboardPage = dashboardRoutes.includes(location.pathname);

    return (
        <Navbar collapseOnSelect expand="lg" variant="light" className="header" fixed="top">
            <Container fluid className="mx-2">
                {/* Brand / Logo */}
                <div
                    onClick={isDashboardPage ? toggleSidebar : () => navigate("/")}
                    className="navbar-brand d-flex text-start align-items-center cursor-pointer"
                >
                    {isCollapsed ? (
                        <div className="bg-light ps-1 pt-1 mb-3.5 rounded">
                            <img src="https://i.ibb.co/pz3fBBX/B-GREEN.png" width="50" height="50" alt="logo" />
                        </div>
                    ) : (
                        <>
                            <div className="bg-light ps-2 pt-1 rounded-start">
                                <img src="https://i.ibb.co/pz3fBBX/B-GREEN.png" width="80" height="50" alt="logo" />
                            </div>
                            <div className="bg-success px-3 rounded-end">
                                <span className="brand text-white">GREEN HOME</span>
                                <h6 className="m-0">
                                    <span className="text-warning">Properties</span>
                                </h6>
                            </div>
                        </>
                    )}
                </div>

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
                                    src={userData?.photoURL || userData?.googlePhotoUrl || Avatar1}
                                    alt="user-profile"
                                />
                                <span className="ms-2 me-2 text-success fw-semibold">
                                    {userData?.displayName || userData?.googleName || ""}
                                </span>
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
