import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdBookOnline, MdAddHome, MdHomeWork } from "react-icons/md";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <aside className="fixed top-0 left-0 w-72 h-screen bg-[#97c0db] text-black flex flex-col">
            {/* Logo / Brand */}
            <div className="p-4 text-2xl font-bold border-gray-700">Green Home</div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
             ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
             hover:bg-green-500 hover:text-white`
                    }
                >
                    <MdDashboard className="text-lg" />
                    Dashboard Overview
                </NavLink>

                <NavLink
                    to="/manageAllBookings"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
             ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
             hover:bg-green-500 hover:text-white`
                    }
                >
                    <MdBookOnline className="text-lg" />
                    Manage All Bookings
                </NavLink>

                <NavLink
                    to="/addApartment"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
             ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
             hover:bg-green-500 hover:text-white`
                    }
                >
                    <MdAddHome className="text-lg" />
                    Add Apartment
                </NavLink>

                <NavLink
                    to="/manageApartments"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded no-underline transition-colors duration-200
             ${isActive ? "bg-green-700 font-semibold text-white" : "text-black"}
             hover:bg-green-500 hover:text-white`
                    }
                >
                    <MdHomeWork className="text-lg" />
                    Manage Apartments
                </NavLink>
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
