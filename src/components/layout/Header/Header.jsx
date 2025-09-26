import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Avatar1 from "../../../assets/images/avatar1.png";
import logoImage from "../../../assets/images/B-GREEN.png";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import UserProfile from "./UserProfile";

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { axiosInstance } = useAxiosInstance();
    const { isCollapsed, setIsCollapsed, toggleSidebar, userData, setUserData } = useSidebar();
    const [desktopOpen, setDesktopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { mode, id } = useParams();
    const desktopRef = useRef(null);

    // fetch user data
    const fetchUserData = async () => {
        try {
            const { data } = await axiosInstance.get(`${API_ENDPOINTS.users}/${user.email}`);
            setUserData(data?.data || {});
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    };

    useEffect(() => {
        if (user?.email) fetchUserData();
    }, [user.email]);

    // collapse sidebar on resize
    useEffect(() => {
        const handleResize = () => setIsCollapsed(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsCollapsed]);

    // navigation links
    const navLinks = [
        { to: "/home#banner", label: "Home" },
        { to: "/home#featured", label: "Featured" },
        { to: "/home#reviews", label: "Reviews" },
        { to: "/apartments", label: "Explore" },
    ];

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

    // animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -5, x: 20, y: -20, originX: 1, originY: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            originX: 1,
            originY: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            rotate: -5,
            x: 20,
            y: -20,
            originX: 1,
            originY: 0,
            transition: { duration: 0.2 },
        },
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-md text-white z-50">
            <div className="flex items-center justify-between px-4 md:px-6 py-2">
                {/* Brand / Logo */}
                <div
                    onClick={isDashboardPage ? toggleSidebar : () => navigate("/")}
                    className="flex items-center cursor-pointer select-none"
                >
                    {isCollapsed ? (
                        <div className="bg-gray-100 p-1 rounded">
                            <img src={logoImage} width="40" height="50" alt="logo" />
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className="bg-gray-100 px-2 py-1 rounded-l">
                                <img src={logoImage} width="60" height="50" alt="logo" />
                            </div>
                            <div className="bg-green-700 px-3 rounded-r text-white">
                                <span className="font-semibold brand">GREEN HOME</span>
                                <h6 className="text-yellow-400 m-0 text-sm">Properties</h6>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center space-x-6 font-semibold">
                    {navLinks.map((link) => (
                        <HashLink key={link.to} to={link.to} smooth className="hover:text-green-600 transition">
                            {link.label}
                        </HashLink>
                    ))}

                    {user?.email ? (
                        <div className="relative" ref={desktopRef}>
                            <button
                                className="flex items-center cursor-pointer bg-green-200 text-gray-800 ml-2 mr-1 px-2 py-1 rounded-full font-medium shadow-sm hover:bg-white transition"
                                onClick={() => setDesktopOpen((s) => !s)}
                            >
                                <img
                                    className="rounded-full w-8 h-8"
                                    src={userData?.photoURL || userData?.googlePhotoUrl || Avatar1}
                                    alt="user-profile"
                                />
                                <span className="ml-2 px-2">{userData?.displayName || userData?.googleName || ""}</span>
                                <ChevronDown size={16} />
                            </button>

                            <AnimatePresence>
                                {desktopOpen && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <UserProfile onClose={() => setDesktopOpen(false)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-green-600 border border-yellow-400 text-white rounded-full px-4 py-1.5 hover:bg-yellow-400 hover:text-black transition"
                        >
                            Login
                        </button>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <button
                    onClick={() => {
                        setMobileOpen((s) => !s);
                        setDesktopOpen(false); // close desktop dropdown when mobile opens
                    }}
                    className="md:hidden p-2 text-gray-700"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="md:hidden bg-black/5 backdrop-blur-md shadow-md border-t border-gray-200"
                    >
                        <div className="flex flex-col space-y-4 px-4 py-4 font-semibold">
                            {navLinks.map((link) => (
                                <HashLink
                                    key={link.to}
                                    to={link.to}
                                    smooth
                                    onClick={() => setMobileOpen(false)}
                                    className="hover:text-green-600 transition"
                                >
                                    {link.label}
                                </HashLink>
                            ))}

                            {user?.email ? (
                                <div className="relative flex flex-col items-center">
                                    <button
                                        className="flex items-center cursor-pointer bg-green-200 text-gray-800 ml-2 mr-1 px-2 py-1 rounded-full font-medium shadow-sm hover:bg-white transition"
                                        onClick={() => setDesktopOpen((s) => !s)}
                                    >
                                        <img
                                            className="rounded-full w-8 h-8"
                                            src={userData?.photoURL || userData?.googlePhotoUrl || Avatar1}
                                            alt="user-profile"
                                        />
                                        <span className="ml-2 px-2">
                                            {userData?.displayName || userData?.googleName || ""}
                                        </span>
                                        <ChevronDown size={16} />
                                    </button>

                                    <AnimatePresence>
                                        {desktopOpen && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute top-full right-0 bg-white shadow-lg rounded-md border border-gray-200"
                                            >
                                                <UserProfile
                                                    onClose={() => {
                                                        setDesktopOpen(false);
                                                        setMobileOpen(false);
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setMobileOpen(false) || navigate("/login")}
                                    className="bg-green-600 border border-yellow-400 text-white rounded-full px-4 py-1.5 hover:bg-yellow-400 transition"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
