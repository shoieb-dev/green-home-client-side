import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
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
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";

export default function Sidebar() {
    const { admin } = useAuth();
    const { isCollapsed, setIsCollapsed, toggleSidebar } = useSidebar();

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

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
    ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
    hover:bg-green-500 hover:text-white ${isCollapsed ? "justify-center" : "justify-start"}`;

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-[#97c0db] text-black flex flex-col transition-all duration-300 ${
                isCollapsed ? "w-20" : "w-72"
            }`}
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

                {admin ? (
                    <>
                        <NavLink
                            to="/manageAllBookings"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Manage All Bookings"
                        >
                            <MdBookOnline className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Manage All Bookings"}
                        </NavLink>

                        <NavLink
                            to="/addApartment"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Add Apartment"
                        >
                            <MdAddHome className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Add Apartment"}
                        </NavLink>

                        <NavLink
                            to="/manageApartments"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Manage Apartments"
                        >
                            <MdHomeWork className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Manage Apartments"}
                        </NavLink>

                        <NavLink
                            to="/makeAdmin"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Make Admin"
                        >
                            <MdAdminPanelSettings className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Make Admin"}
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/bookings"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="My Apartments"
                        >
                            <MdApartment className="text-lg flex-shrink-0" />
                            {!isCollapsed && "My Apartments"}
                        </NavLink>

                        <NavLink
                            to="/reviewAdding"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Add Review"
                        >
                            <MdRateReview className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Add Review"}
                        </NavLink>

                        <NavLink
                            to="/payment"
                            className={linkClasses}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content="Payment"
                        >
                            <MdPayment className="text-lg flex-shrink-0" />
                            {!isCollapsed && "Payment"}
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-400">
                <button
                    onClick={() => {
                        // logout logic
                    }}
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
