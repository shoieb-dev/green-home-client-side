import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useSidebar } from "../../../contexts/SidebarContext";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const MyReviews = () => {
    const { userData } = useSidebar();
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        // Don't fetch if userData is not available yet
        if (!userData?._id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        axiosInstance
            .get(`${API_ENDPOINTS.reviews}/user/${userData._id}`)
            .then((res) => {
                setReviewData(res?.data || []);
            })
            .catch((err) => {
                console.error("Error fetching reviews:", err);
                toast.error(err.response?.data?.message || "Failed to fetch reviews");
                setReviewData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [axiosInstance, userData?._id]);

    const handleEdit = (id) => {
        navigate(`/my-reviews/edit/${id}`);
    };

    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this review? This action cannot be undone.",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.reviews}/${id}`)
                .then(() => {
                    toast.success("Review deleted successfully");
                    setReviewData((prev) => prev.filter((review) => review._id !== id));
                })
                .catch((err) => {
                    console.error("Delete failed:", err);
                    toast.error(err.response?.data?.message || "Failed to delete review");
                })
                .finally(() => {
                    setShowModal(false);
                });
        });

        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading your reviews...</div>
                </div>
            </div>
        );
    }

    if (!userData?._id) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Please log in to view your reviews</div>
                </div>
            </div>
        );
    }

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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">My Reviews</h2>
                    <button
                        onClick={() => navigate("/add-review")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition-colors"
                    >
                        + Add Review
                    </button>
                </div>

                {reviewData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">You haven't written any reviews yet</p>
                        <button
                            onClick={() => navigate("/add-review")}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors"
                        >
                            Write Your First Review
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="px-4 py-2 border border-white text-left">Review Text</th>
                                    <th className="px-4 py-2 border border-white">Rating</th>
                                    <th className="px-4 py-2 border border-white">Date</th>
                                    <th className="px-4 py-2 border border-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-100 transition text-center">
                                        <td className="px-4 py-2 border border-gray-200 text-left">
                                            <div className="w-full">
                                                {item.reviewtext?.length > 100
                                                    ? `${item.reviewtext.slice(0, 100)}...`
                                                    : item.reviewtext || "No review text"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, index) => (
                                                    <FontAwesomeIcon
                                                        key={index}
                                                        icon={faStar}
                                                        className={
                                                            index < item.rating ? "text-yellow-400" : "text-gray-300"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200 whitespace-nowrap">
                                            {moment(item.createdAt).format("DD-MM-YYYY")}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item._id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                                                    aria-label="Edit review"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                                                    aria-label="Delete review"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default MyReviews;
