import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const ReviewList = () => {
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [reviewData, setReviewData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.reviews)
            .then((res) => setReviewData(res?.data))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            });
    }, [axiosInstance]);

    const handleView = (id) => {
        navigate(`/manageReviews/view/${id}`);
    };

    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this review?",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.reviews}/${id}`)
                .then(() => {
                    toast.success("Reiview deleted successfully");
                    setReviewData((prev) => prev.filter((b) => b._id !== id));
                })
                .catch((err) => {
                    console.error("Delete failed:", err);
                    toast.error("Failed to delete review. Please try again.");
                });

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
            <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Manage Reviews</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-white">Name</th>
                                <th className="px-4 py-2 border border-white">Review Text</th>
                                <th className="px-4 py-2 border border-white">Date</th>
                                <th className="px-4 py-2 border border-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition text-center">
                                    <td className="px-4 py-2 border border-gray-200">{item.user?.displayName}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-left">
                                        {item.reviewtext?.length > 50
                                            ? item.reviewtext.slice(0, 50) + "..."
                                            : item.reviewtext}
                                    </td>

                                    <td className="px-4 py-2 border border-gray-200">
                                        {moment(item.createdAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleView(item._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(item._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reviewData.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500 border border-gray-200">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ReviewList;
