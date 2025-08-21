import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar1 from "../../../assets/images/avatar1.png";
import useAuth from "../../../hooks/useAuth";

const UserProfile = ({ onClose }) => {
    const { user, admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleGoDashboard = () => {
        navigate("/dashboard");
        onClose();
    };

    const toggleOpen = (e) => {
        if (e.target.id === "profile") onClose();
    };

    return (
        <div id="profile" onClick={toggleOpen} className="fixed inset-0">
            <div className="nav-item absolute right-5 top-16 bg-white p-4 rounded-lg shadow-lg w-72 fade-in">
                <p className="font-semibold text-left text-lg text-gray-500">User Profile</p>

                {/* User info */}
                <div className="flex gap-3 items-center mt-2 border-b border-gray-200 pb-2">
                    <img className="rounded-pill h-16 w-16" src={user?.photoURL || Avatar1} alt="user-profile" />
                    <div className="text-left">
                        <p className="font-semibold text-xl mb-1">{user?.displayName || "N/A"}</p>
                        <p className="text-gray-500 text-sm mb-1">{admin ? "Admin" : "User"}</p>
                        <p className="text-gray-500 text-sm font-semibold mb-1">{user?.email || "N/A"}</p>
                    </div>
                </div>

                {/* Dashboard link */}
                {![
                    "/dashboard",
                    "/manageAllBookings",
                    "/addApartment",
                    "/manageApartments",
                    "/makeAdmin",
                    "/payment",
                    "/bookings",
                ].includes(window.location.pathname) && (
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={handleGoDashboard}
                            className="text-white bg-green-500 hover:bg-green-600 rounded w-full p-2"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}

                {/* Logout */}
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-white bg-red-500 hover:bg-red-600 rounded w-full p-2"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
