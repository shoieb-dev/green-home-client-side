import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaRedo, FaSearch, FaStar, FaTrash, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

// Constants
const ITEMS_PER_PAGE = 10;

/**
 * Star Rating Display Component
 */
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={14} className={star <= rating ? "text-yellow-500" : "text-gray-300"} />
            ))}
            <span className="ml-1 text-sm font-medium text-gray-700">({rating})</span>
        </div>
    );
};

/**
 * Empty State Component
 */
const EmptyState = ({ searchQuery, onClear }) => (
    <div className="text-center py-12">
        <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? "No reviews found" : "No reviews yet"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? (
                <>
                    No reviews match your search. Try different keywords or{" "}
                    <button onClick={onClear} className="text-blue-600 hover:underline">
                        clear search
                    </button>
                    .
                </>
            ) : (
                "Reviews will appear here once users start submitting feedback."
            )}
        </p>
    </div>
);

/**
 * Review Card for Mobile View
 */
const ReviewCard = ({ review, onView, onDelete, deleteLoading }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
                {review.user?.photoURL ? (
                    <img
                        src={review.user.photoURL}
                        alt={review.user.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                review.user?.displayName || "User"
                            )}&background=random`;
                        }}
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-500" />
                    </div>
                )}
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{review.user?.displayName || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">{moment(review.createdAt).format("MMM DD, YYYY")}</p>
                </div>
            </div>

            {/* Rating */}
            {review.rating && <StarRating rating={review.rating} />}

            {/* House Name */}
            {review.house?.name && (
                <p className="text-sm text-gray-600">
                    <strong>Property:</strong> {review.house.name}
                </p>
            )}

            {/* Review Text */}
            <p className="text-sm text-gray-700 line-clamp-3">{review.reviewtext || "No review text provided."}</p>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => onView(review._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <FaEye size={12} />
                    View Full
                </button>
                <button
                    onClick={() => onDelete(review._id)}
                    disabled={deleteLoading === review._id}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <FaTrash size={12} />
                    {deleteLoading === review._id ? "..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

/**
 * Main ReviewList Component
 */
const ReviewList = () => {
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();

    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest, rating-high, rating-low

    const [showModal, setShowModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    /**
     * Fetch all reviews
     */
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_ENDPOINTS.reviews);
            setReviewData(response?.data || []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to load reviews";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

    /**
     * Initial data fetch
     */
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchReviews();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchReviews]);

    /**
     * Filter, search, and sort reviews
     */
    const filteredReviews = reviewData
        .filter((review) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                review.user?.displayName?.toLowerCase().includes(query) ||
                review.reviewtext?.toLowerCase().includes(query) ||
                review.house?.name?.toLowerCase().includes(query);

            const matchesRating =
                ratingFilter === "all" || (review.rating && review.rating.toString() === ratingFilter);

            return matchesSearch && matchesRating;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "rating-high":
                    return (b.rating || 0) - (a.rating || 0);
                case "rating-low":
                    return (a.rating || 0) - (b.rating || 0);
                default:
                    return 0;
            }
        });

    /**
     * Pagination
     */
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    /**
     * Navigation handlers
     */
    const handleView = (id) => {
        navigate(`/manageReviews/view/${id}`);
    };

    /**
     * Delete handlers
     */
    const handleOpenModal = (id) => {
        setPendingDeleteId(id);
        setShowModal(true);
    };

    const executeDelete = async () => {
        if (!pendingDeleteId) return;

        setDeleteLoading(pendingDeleteId);
        setShowModal(false);

        try {
            await axiosInstance.delete(`${API_ENDPOINTS.reviews}/${pendingDeleteId}`);
            setReviewData((prev) => prev.filter((review) => review._id !== pendingDeleteId));
            toast.success("Review deleted successfully");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete review";
            toast.error(errorMessage);
            console.error("Delete failed:", err);
        } finally {
            setDeleteLoading(null);
            setPendingDeleteId(null);
        }
    };

    /**
     * Clear filters
     */
    const handleClearFilters = () => {
        setSearchQuery("");
        setRatingFilter("all");
        setCurrentPage(1);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load reviews</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                    onClick={fetchReviews}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <FaRedo className="mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            <ConfirmationModal
                isOpen={showModal}
                title="Confirm Deletion"
                message="Are you sure you want to delete this review? This action cannot be undone."
                onConfirm={executeDelete}
                onCancel={() => {
                    setShowModal(false);
                    setPendingDeleteId(null);
                }}
            />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white shadow-md rounded-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Manage Reviews</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                            <button
                                onClick={fetchReviews}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaRedo size={14} />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col lg:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by user, review text, or property..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={ratingFilter}
                                onChange={(e) => {
                                    setRatingFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="rating-high">Highest Rating</option>
                                <option value="rating-low">Lowest Rating</option>
                            </select>
                            {(searchQuery || ratingFilter !== "all") && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {paginatedReviews.length > 0 ? (
                        <>
                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 space-y-4">
                                {paginatedReviews.map((review) => (
                                    <ReviewCard
                                        key={review._id}
                                        review={review}
                                        onView={handleView}
                                        onDelete={handleOpenModal}
                                        deleteLoading={deleteLoading}
                                    />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Property</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Review</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Rating</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedReviews.map((review) => (
                                            <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-left">
                                                    <div className="flex items-center gap-2">
                                                        {review.user?.photoURL ? (
                                                            <img
                                                                src={review.user.photoURL}
                                                                alt={review.user.displayName}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                        review.user?.displayName || "User"
                                                                    )}&background=random`;
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <FaUser className="text-gray-500 text-xs" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium">
                                                            {review.user?.displayName || "Anonymous"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-left">{review.house?.name || "N/A"}</td>
                                                <td className="px-4 py-3 text-left max-w-xs">
                                                    <p className="truncate">
                                                        {review.reviewtext?.length > 60
                                                            ? review.reviewtext.slice(0, 60) + "..."
                                                            : review.reviewtext || "No text"}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {review.rating ? (
                                                        <StarRating rating={review.rating} />
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-gray-600">
                                                    {moment(review.createdAt).format("MMM DD, YYYY")}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleView(review._id)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                            title="View Full Review"
                                                        >
                                                            <FaEye size={12} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenModal(review._id)}
                                                            disabled={deleteLoading === review._id}
                                                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                            title="Delete Review"
                                                        >
                                                            <FaTrash size={12} />
                                                            {deleteLoading === review._id ? "..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} of{" "}
                                        {filteredReviews.length} reviews
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let page;
                                                if (totalPages <= 5) {
                                                    page = i + 1;
                                                } else if (currentPage <= 3) {
                                                    page = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    page = totalPages - 4 + i;
                                                } else {
                                                    page = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-2 rounded-lg transition-colors ${
                                                            currentPage === page
                                                                ? "bg-blue-600 text-white"
                                                                : "hover:bg-gray-50 border border-gray-300"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-6">
                            <EmptyState searchQuery={searchQuery} onClear={handleClearFilters} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReviewList;
