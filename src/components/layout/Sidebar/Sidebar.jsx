import React from "react";
import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdBookOnline,
    MdAddHome,
    MdHomeWork,
    MdAdminPanelSettings,
    MdRateReview,
    MdPayment,
    MdApartment,
} from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import "./Sidebar.css";

export default function Sidebar() {
    const { admin } = useAuth();

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
     ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
     hover:bg-green-500 hover:text-white`;

    return (
        <aside className="fixed top-0 left-0 w-72 h-screen bg-[#97c0db] text-black flex flex-col">
            {/* Logo / Brand */}
            <div className="p-4 text-2xl font-bold border-gray-700">Green Home</div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/dashboard" end className={linkClasses}>
                    <MdDashboard className="text-lg" />
                    Dashboard Overview
                </NavLink>

                {admin ? (
                    // Admin Menu
                    <>
                        <NavLink to="/manageAllBookings" className={linkClasses}>
                            <MdBookOnline className="text-lg" />
                            Manage All Bookings
                        </NavLink>

                        <NavLink to="/addApartment" className={linkClasses}>
                            <MdAddHome className="text-lg" />
                            Add Apartment
                        </NavLink>

                        <NavLink to="/manageApartments" className={linkClasses}>
                            <MdHomeWork className="text-lg" />
                            Manage Apartments
                        </NavLink>

                        <NavLink to="/makeAdmin" className={linkClasses}>
                            <MdAdminPanelSettings className="text-lg" />
                            Make Admin
                        </NavLink>
                    </>
                ) : (
                    // Normal User Menu
                    <>
                        <NavLink to="/bookings" className={linkClasses}>
                            <MdApartment className="text-lg" />
                            My Apartments
                        </NavLink>

                        <NavLink to="/reviewAdding" className={linkClasses}>
                            <MdRateReview className="text-lg" />
                            Add Review
                        </NavLink>

                        <NavLink to="/payment" className={linkClasses}>
                            <MdPayment className="text-lg" />
                            Payment
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => {
                        // logout logic
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
