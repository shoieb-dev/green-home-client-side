import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const EditReviews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [viewData, setViewData] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    const {
        register,
        reset,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm({
        defaultValues: {
            reviewtext: "",
            rating: 0,
        },
    });

    useEffect(() => {
        if (!id) {
            toast.error("Invalid review ID");
            navigate("/my-reviews");
            return;
        }

        setFetchLoading(true);
        axiosInstance
            .get(`${API_ENDPOINTS.reviews}/${id}`)
            .then((res) => {
                const reviewData = res?.data;
                setViewData(reviewData);
                setSelectedRating(reviewData?.rating || 0);

                // Reset form with fetched data
                reset({
                    reviewtext: reviewData?.reviewtext || "",
                    rating: reviewData?.rating || 0,
                });
            })
            .catch((err) => {
                console.error("Error fetching review:", err);
                toast.error(err.response?.data?.message || "Failed to load review");
                navigate("/my-reviews");
            })
            .finally(() => {
                setFetchLoading(false);
            });
    }, [axiosInstance, id, navigate, reset]);

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
        setValue("rating", rating, { shouldValidate: true });
    };

    const handleOpenModal = () => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this review? This action cannot be undone.",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.reviews}/${id}`)
                .then(() => {
                    toast.success("Review deleted successfully");
                    setTimeout(() => {
                        navigate("/my-reviews");
                    }, 3000);
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

    const onSubmit = async (data) => {
        if (selectedRating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setSubmitLoading(true);
        try {
            const updateData = {
                reviewtext: data.reviewtext,
                rating: selectedRating,
            };

            const res = await axiosInstance.put(`${API_ENDPOINTS.reviews}/${id}`, updateData);
            console.log("res", res);

            if (res.data.success) {
                toast.success(res.data.message || "Review updated successfully!");
                setTimeout(() => {
                    navigate("/my-reviews");
                }, 3000);
            } else {
                toast.error(res.data.message || "Failed to update review");
            }
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.response?.data?.message || "Failed to update review");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="bg-gray-100 flex items-center justify-center p-6 min-h-screen">
                <div className="text-center">
                    <div className="text-gray-500">Loading review...</div>
                </div>
            </div>
        );
    }

    if (!viewData) {
        return (
            <div className="bg-gray-100 flex items-center justify-center p-6 min-h-screen">
                <div className="text-center">
                    <div className="text-gray-500">Review not found</div>
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

            <div className="bg-gray-100 flex items-center justify-center p-6 min-h-screen">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-700 pb-6">Edit Review</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Text <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("reviewtext", {
                                    required: "Review text is required",
                                    minLength: {
                                        value: 10,
                                        message: "Review must be at least 10 characters",
                                    },
                                    maxLength: {
                                        value: 1000,
                                        message: "Review cannot exceed 1000 characters",
                                    },
                                })}
                                rows="6"
                                placeholder="Share your experience..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"
                            />
                            {errors.reviewtext && (
                                <p className="text-red-500 text-sm mt-1">{errors.reviewtext.message}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => handleRatingClick(rating)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        aria-label={`Rate ${rating} stars`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className={`text-2xl ${
                                                rating <= selectedRating ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                    {selectedRating > 0 ? `${selectedRating}/5` : "Click to rate"}
                                </span>
                            </div>
                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
                        </div>

                        {/* User Info (Read-only) */}
                        {viewData.user && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Reviewer:</span> {viewData.user.displayName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Email:</span> {viewData.email}
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="bg-white border border-red-500 text-red-500 px-4 py-2 rounded shadow hover:text-white hover:bg-red-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                disabled={submitLoading}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/my-reviews")}
                                    className="bg-gray-500 text-white px-6 py-2 rounded shadow hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded shadow bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
};

export default EditReviews;
