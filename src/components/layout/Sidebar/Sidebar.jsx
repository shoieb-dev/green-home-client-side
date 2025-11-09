import { useEffect } from "react";
import { FaUserCog, FaUsers } from "react-icons/fa";
import {
    MdAddHome,
    MdAdminPanelSettings,
    MdApartment,
    MdBookOnline,
    MdClose,
    MdDashboard,
    MdHomeWork,
    MdLogout,
    MdMenu,
    MdPayment,
    MdRateReview,
    MdReviews,
} from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";

export default function Sidebar() {
    const { admin, logout } = useAuth();
    const { pathname } = useLocation();
    const { isCollapsed, setIsCollapsed, toggleSidebar, setUserData } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setUserData({});
        navigate("/login");
    };

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };

        handleResize(); // ✅ run on mount

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsCollapsed]);

    const adminLinks = [
        { to: "/manageAllBookings", label: "Manage All Bookings", icon: MdBookOnline },
        { to: "/manageApartments", label: "Manage Apartments", icon: MdHomeWork },
        { to: "/manageReviews", label: "Manage Reviews", icon: MdReviews },
        { to: "/apartment-form/create/new", label: "Add Apartment", icon: MdAddHome },
        { to: "/makeAdmin", label: "Make Admin", icon: MdAdminPanelSettings },
        { to: "/userList", label: "User List", icon: FaUsers },
        { to: "/profile", label: "Profile", icon: FaUserCog },
    ];
    const userLinks = [
        { to: "/bookings", label: "My Apartments", icon: MdApartment },
        { to: "/my-reviews", label: "My Reviews", icon: MdRateReview },
        { to: "/payment", label: "Payment", icon: MdPayment },
        { to: "/profile", label: "Profile", icon: FaUserCog },
    ];

    const links = admin ? adminLinks : userLinks;

    const linkClasses = ({ isActive }, to) => {
        const isManageApartmentsActive =
            to === "/manageApartments" &&
            (pathname.startsWith("/manageApartments") || pathname.startsWith("/apartment-form/edit/"));
        return `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200 ${
            isActive || isManageApartmentsActive ? "bg-green-700 font-semibold text-white" : "text-black"
        } hover:bg-green-700 hover:text-white ${isCollapsed ? "justify-center" : "justify-start"}`;
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full text-black flex flex-col transition-all duration-300 
        bg-gradient-to-b from-green-600 via-green-400 to-lime-300 ${isCollapsed ? "w-20" : "w-72"}`}
        >
            {/* Header with Brand + Toggle Button */}
            <div className="flex items-center justify-between p-4">
                {!isCollapsed && <span className="text-xl font-bold whitespace-nowrap">Green Home</span>}
                <button onClick={toggleSidebar} className="p-2 rounded hover:bg-green-500 hover:text-white">
                    {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    end
                    className={linkClasses}
                    data-tooltip-id="sidebar-tooltip"
                    data-tooltip-content="Dashboard Overview"
                >
                    <MdDashboard className="text-lg flex-shrink-0" />
                    {!isCollapsed && "Dashboard Overview"}
                </NavLink>

                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={(props) => linkClasses(props, to)}
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content={label}
                    >
                        <Icon className="text-lg flex-shrink-0" />
                        {!isCollapsed && label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-400">
                <button
                    onClick={handleLogout}
                    data-tooltip-id="sidebar-tooltip"
                    data-tooltip-content="Logout"
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600 ${
                        isCollapsed ? "justify-center" : "justify-start"
                    }`}
                >
                    <MdLogout className="text-lg flex-shrink-0" />
                    {!isCollapsed && "Logout"}
                </button>
            </div>

            {/* Global Tooltip */}
            {isCollapsed && <Tooltip id="sidebar-tooltip" place="right" />}
        </aside>
    );
}
