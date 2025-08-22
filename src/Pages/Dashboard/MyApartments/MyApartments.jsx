import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const MyApartments = () => {
    const { user } = useAuth();
    const { axiosInstance } = useAxiosInstance();
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        axiosInstance
            .get(`${API_ENDPOINTS.bookings}/${user?.email}`)
            .then((res) =>
                setApartments(res?.data.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()))
            )
            .catch(console.error);
    }, [axiosInstance]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            axios.delete(`${API_ENDPOINTS.bookings}/${id}`).then((res) => {
                if (res.data.deletedCount > 0) {
                    setApartments(apartments.filter((apt) => apt._id !== id));
                }
            });
        }
    };

    return (
        <div className="p-6 mt-16 bg-white h-screen shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Booked Apartments</h2>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-green-700 text-white">
                        <tr>
                            <th className="border px-4 py-2 text-left">House</th>
                            <th className="border px-4 py-2 text-left">Price</th>
                            <th className="border px-4 py-2 text-left">Phone</th>
                            <th className="border px-4 py-2 text-left">Booked At</th>
                            <th className="border px-4 py-2 text-left">Status</th>
                            <th className="border px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apartments.length > 0 ? (
                            apartments.map((apartment) => (
                                <tr key={apartment._id} className="border-b hover:bg-gray-100 transition">
                                    <td className="border px-4 py-2">{apartment.house}</td>
                                    <td className="border px-4 py-2">${apartment.price}</td>
                                    <td className="border px-4 py-2">{apartment.phone}</td>
                                    <td className="border px-4 py-2">
                                        {moment(apartment.bookedAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded font-semibold capitalize ${
                                                apartment.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : apartment.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {apartment.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleDelete(apartment._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyApartments;
