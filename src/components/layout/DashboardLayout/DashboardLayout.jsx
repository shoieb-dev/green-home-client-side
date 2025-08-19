import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

export default function DashboardLayout() {
    return (
        <>
            <Header />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-gray-100 ml-72">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
