import moment from "moment";
import { useEffect, useState } from "react";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";

const ManageAllBookings = () => {
    const { axiosInstance } = useAxiosInstance();
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.bookings)
            .then((res) =>
                setBookings(res?.data.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()))
            )
            .catch(console.error);
    }, [axiosInstance]);

    const handleOpenModal = (actionType, bookingId) => {
        const isDelete = actionType === "delete";

        setModalData({
            title: isDelete ? "Confirm Deletion" : "Confirm Status Change",
            message: isDelete
                ? "Are you sure you want to delete this booking?"
                : "Are you sure you want to update the status?",
        });

        setModalAction(() => () => {
            if (isDelete) {
                axiosInstance
                    .delete(`${API_ENDPOINTS.bookings}/${bookingId}`)
                    .then(() => {
                        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
                        toast.success("Booking deleted successfully.");
                    })
                    .catch((err) => console.error("Delete failed:", err));
            } else {
                axiosInstance
                    .patch(`${API_ENDPOINTS.bookings}/${bookingId}`, { status: actionType })
                    .then(() => {
                        toast.success(`Booking ${actionType} successfully.`);
                        setBookings((prev) =>
                            prev.map((b) => (b._id === bookingId ? { ...b, status: actionType } : b))
                        );
                    })
                    .catch((error) => console.error("Status update failed:", error));
            }
            setShowModal(false);
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
                <h2 className="text-2xl font-semibold mb-4">Manage All Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                {/* <th className="border px-4 py-2">#</th> */}
                                <th className="border px-4 py-2">Apartment</th>
                                <th className="border px-4 py-2">User Name</th>
                                <th className="border px-4 py-2">User Email</th>
                                <th className="border px-4 py-2">Booking Date</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking._id} className="border-b hover:bg-gray-100 transition text-center">
                                    {/* <td className="border px-4 py-2">{index + 1}</td> */}
                                    <td className="border px-4 py-2">{booking.house}</td>
                                    <td className="border px-4 py-2">{booking.name}</td>
                                    <td className="border px-4 py-2">{booking.email}</td>
                                    <td className="border px-4 py-2">
                                        {moment(booking.bookedAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded font-semibold capitalize ${
                                                booking.status === "approved"
                                                    ? "bg-green-100 text-green-700 "
                                                    : booking.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        {booking.status === "pending" && (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal("approved", booking._id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal("rejected", booking._id)}
                                                    className="bg-yellow-600 text-white px-3 py-1 rounded"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {(booking.status === "approved" || booking.status === "rejected") && (
                                            <button
                                                onClick={() => handleOpenModal("delete", booking._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
        </>
    );
};

export default ManageAllBookings;
