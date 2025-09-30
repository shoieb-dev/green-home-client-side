import moment from "moment";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import useAuth from "../../../hooks/useAuth";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const MyApartments = () => {
    const { user } = useAuth();
    const { axiosInstance } = useAxiosInstance();
    const [apartments, setApartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        axiosInstance
            .get(`${API_ENDPOINTS.bookings}/${user?.email}`)
            .then((res) =>
                setApartments(res?.data.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()))
            )
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            });
    }, [axiosInstance]);
    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this booking?",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.bookings}/${id}`)
                .then(() => {
                    toast.success("Booking deleted successfully.");
                    setApartments((prev) => prev.filter((apt) => apt._id !== id));
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(err.response?.data?.message || "Failed to delete booking.");
                })
                .finally(() => {
                    setShowModal(false);
                });
        });
        setShowModal(true);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={showModal}
                title={modalData.title}
                message={modalData.message}
                onConfirm={modalAction}
                onCancel={() => setShowModal(false)}
            />
            <div className="p-6 bg-white h-screen shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Manage Booked Apartments</h2>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="border px-4 py-2">House</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Phone</th>
                                <th className="border px-4 py-2">Booked At</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apartments.map((apartment, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100 transition">
                                    <td className="border border-gray-200 px-4 py-2">{apartment.house}</td>
                                    <td className="border border-gray-200 px-4 py-2">${apartment.price}</td>
                                    <td className="border border-gray-200 px-4 py-2">{apartment.phone}</td>
                                    <td className="border border-gray-200 px-4 py-2">
                                        {moment(apartment.bookedAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-2">
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
                                    <td className="border border-gray-200 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleOpenModal(apartment._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {apartments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500 border border-gray-200">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default MyApartments;
