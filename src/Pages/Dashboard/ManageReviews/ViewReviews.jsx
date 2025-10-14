import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const ViewReviews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [viewData, setViewData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    const defaultFormValues = {
        name: "",
        email: "",
        rating: "",
        reviewtext: "",
    };

    const {
        register,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (id && viewData) {
            reset({
                name: viewData.name || "",
                email: viewData.email || "",
                rating: viewData.rating || "",
                reviewtext: viewData.reviewtext || "",
            });
        }
    }, [viewData, id, reset]);

    useEffect(() => {
        axiosInstance
            .get(`${API_ENDPOINTS.reviews}/${id}`)
            .then((res) => setViewData(res?.data))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            });
    }, [axiosInstance, id, reset]);

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
                    navigate(-1);
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

            <div className="bg-gray-100 flex items-center justify-center p-6">
                <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-700 pb-6">View Review</h2>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                {...register("name", { required: "Name is required", maxLength: 50 })}
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition my-1 disabled:bg-gray-200"
                                disabled
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                })}
                                type="email"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition my-1 disabled:bg-gray-200"
                                disabled
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Review Text */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Text</label>
                            <textarea
                                {...register("reviewtext", { required: "Review Text is required" })}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition my-1 disabled:bg-gray-200"
                                disabled
                            ></textarea>
                            {errors.reviewtext && (
                                <p className="text-red-500 text-sm mt-1">{errors.reviewtext.message}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>

                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        icon={faStar}
                                        className={index < viewData.rating ? "text-yellow-400" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
                        </div>

                        {/* Button */}
                        <div className="md:col-span-2 gap-x-2 flex justify-end">
                            <button
                                type="button"
                                className="bg-green-600 text-white px-6 py-1 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOpenModal(id)}
                                className="bg-white border border-red-500 text-red-500 px-2 py-1 rounded shadow hover:text-white hover:bg-red-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                {loading ? "Loading..." : "Delete"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ViewReviews;
