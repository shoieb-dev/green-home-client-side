import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { useSidebar } from "../../../contexts/SidebarContext";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const ReviewAdding = () => {
    const navigate = useNavigate();
    const { userData } = useSidebar();
    const { axiosInstance } = useAxiosInstance();
    const { register, handleSubmit, reset } = useForm();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (!rating || rating < 1) {
                toast.error("Please select a rating before submitting.");
                setLoading(false);
                return;
            }

            const reviewData = {
                email: userData?.email || "",
                reviewtext: data.reviewtext,
                rating,
            };

            const res = await axiosInstance.post(API_ENDPOINTS.reviews, reviewData);

            // Check for success flag instead of insertedId
            if (res.data?.success) {
                toast.success(res.data.message || "Review added successfully!");
                reset();
                setRating(0);

                setTimeout(() => {
                    navigate("/my-reviews");
                }, 3000);
            } else {
                toast.error(res.data?.message || "Failed to add review. Please try again.");
            }
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-20 px-4">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Add a Review</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                    {/* Review Text */}
                    <div>
                        <label htmlFor="reviewtext" className="block text-sm font-semibold text-gray-700 mb-2">
                            Review
                        </label>
                        <textarea
                            id="reviewtext"
                            rows={4}
                            placeholder="Write your review here..."
                            {...register("reviewtext", { required: true })}
                            className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[...Array(5)].map((_, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                            className="hidden"
                                        />
                                        <FaStar
                                            size={28}
                                            className="cursor-pointer transition-transform transform hover:scale-110"
                                            color={currentRating <= (hover || rating) ? "#facc15" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting Review" : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default ReviewAdding;
