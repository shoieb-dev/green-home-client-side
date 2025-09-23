import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Avatar1 from "../../../assets/images/avatar1.png";
import { useSidebar } from "../../../contexts/SidebarContext";
import useAuth from "../../../hooks/useAuth";

const dropdownVariants = {
    hidden: { opacity: 0, x: 20, y: -20, scale: 0.75, rotate: -5, originX: 1, originY: 0 },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        originX: 1,
        originY: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, x: 20, y: -20, scale: 0.75, rotate: -5, originX: 1, originY: 0, transition: { duration: 0.2 } },
};

const UserProfile = ({ onClose }) => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, id } = useParams();
    const { userData, setUserData } = useSidebar();

    const handleLogout = () => {
        logout();
        setUserData({});
        navigate("/login");
        onClose();
    };

    const handleGoDashboard = () => {
        navigate("/dashboard");
        onClose();
    };

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
        <AnimatePresence>
            <motion.div
                key="dropdown"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute right-0 top-full mt-4 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4"
            >
                <p className="font-semibold text-left text-lg text-gray-500">User Profile</p>

                {/* User info */}
                <div className="flex gap-3 items-center mt-2 border-b border-gray-200 pb-2">
                    <img
                        className="rounded-full h-16 w-16"
                        src={userData?.photoURL || userData?.googlePhotoUrl || Avatar1}
                        alt="user-profile"
                    />
                    <div className="text-left">
                        <p className="font-semibold text-xl mb-1">
                            {userData?.displayName || userData?.googleName || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">{admin ? "Admin" : "User"}</p>
                        <p className="text-gray-500 text-sm font-semibold mb-1">{userData?.email || "N/A"}</p>
                    </div>
                </div>

                {!isDashboardPage && (
                    <button
                        onClick={handleGoDashboard}
                        className="text-white bg-green-500 hover:bg-green-600 rounded w-full p-2 mt-3"
                    >
                        Go to Dashboard
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="text-white bg-red-500 hover:bg-red-600 rounded w-full p-2 mt-2"
                >
                    Logout
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserProfile;
