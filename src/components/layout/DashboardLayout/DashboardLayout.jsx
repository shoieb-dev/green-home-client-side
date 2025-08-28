import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useSidebar } from "../../../contexts/SidebarContext";

export default function DashboardLayout() {
    const { isCollapsed } = useSidebar();

    return (
        <>
            <Header />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className={`flex-1 bg-gray-100 mt-16 ${isCollapsed ? "ml-20" : "ml-72"}`}>
                    <Outlet />
                </main>
            </div>
        </>
    );
}
