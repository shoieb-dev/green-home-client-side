import React from "react";
import { LuConstruction } from "react-icons/lu";

const Payment = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <div className="bg-white shadow-md rounded-2xl p-10 max-w-md">
                <div className="flex items-center justify-center w-40 h-40 mx-auto rounded-full bg-blue-100 mb-6">
                    <LuConstruction className="text-blue-600 text-9xl" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-3">Page Under Construction</h1>
                <p className="text-gray-600 text-base">This page is currently being built. Please check back later.</p>
            </div>
        </div>
    );
};

export default Payment;
