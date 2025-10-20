import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRedo, FaSearch, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../../components/Loader/Loader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

// Constants
const STATUS_STYLES = {
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const ITEMS_PER_PAGE = 10;

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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? "No bookings found" : "No bookings yet"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? (
                <>
                    No bookings match your search. Try different keywords or{" "}
                    <button onClick={onClear} className="text-blue-600 hover:underline">
                        clear search
                    </button>
                    .
                </>
            ) : (
                "Bookings will appear here once users start making reservations."
            )}
        </p>
    </div>
);

/**
 * Booking Card for Mobile View
 */
const BookingCard = ({ booking, onAction, actionLoading }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-900">{booking.house}</h3>
                    <p className="text-sm text-gray-600">{booking.name}</p>
                </div>
                <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize border ${
                        STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                    }`}
                >
                    {booking.status}
                </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
                <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${booking.email}`} className="text-blue-600 hover:underline">
                        {booking.email}
                    </a>
                </p>
                <p>
                    <strong>Booked:</strong> {moment(booking.bookedAt).format("MMM DD, YYYY")}
                </p>
                {booking.phone && (
                    <p>
                        <strong>Phone:</strong>{" "}
                        <a href={`tel:${booking.phone}`} className="text-blue-600 hover:underline">
                            {booking.phone}
                        </a>
                    </p>
                )}
            </div>

            <div className="flex gap-2 pt-2">
                {booking.status === "pending" && (
                    <>
                        <button
                            onClick={() => onAction("approve", booking._id)}
                            disabled={actionLoading === booking._id}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                            <FaCheck size={12} />
                            {actionLoading === booking._id ? "..." : "Approve"}
                        </button>
                        <button
                            onClick={() => onAction("reject", booking._id)}
                            disabled={actionLoading === booking._id}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                            <FaTimes size={12} />
                            {actionLoading === booking._id ? "..." : "Reject"}
                        </button>
                    </>
                )}
                {(booking.status === "approved" || booking.status === "rejected") && (
                    <button
                        onClick={() => onAction("delete", booking._id)}
                        disabled={actionLoading === booking._id}
                        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <FaTrash size={12} />
                        {actionLoading === booking._id ? "Deleting..." : "Delete"}
                    </button>
                )}
            </div>
        </div>
    </div>
);

/**
 * Main ManageAllBookings Component
 */
const ManageAllBookings = () => {
    const { axiosInstance } = useAxiosInstance();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    /**
     * Fetch all bookings
     */
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_ENDPOINTS.bookings);
            const sortedBookings = (response?.data || []).sort(
                (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
            );
            setBookings(sortedBookings);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to load bookings";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Failed to fetch bookings:", err);
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
                await fetchBookings();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchBookings]);

    /**
     * Filter and search bookings
     */
    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.house?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    /**
     * Pagination
     */
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    /**
     * Handle action initiation (opens modal)
     */
    const handleOpenModal = (actionType, bookingId) => {
        const actionConfig = {
            approve: {
                title: "Approve Booking",
                message: "Are you sure you want to approve this booking?",
            },
            reject: {
                title: "Reject Booking",
                message: "Are you sure you want to reject this booking?",
            },
            delete: {
                title: "Delete Booking",
                message: "Are you sure you want to delete this booking? This action cannot be undone.",
            },
        };

        setPendingAction({ type: actionType, bookingId });
        setShowModal(true);
    };

    /**
     * Execute confirmed action
     */
    const executeAction = async () => {
        if (!pendingAction) return;

        const { type, bookingId } = pendingAction;
        setActionLoading(bookingId);
        setShowModal(false);

        try {
            if (type === "delete") {
                await axiosInstance.delete(`${API_ENDPOINTS.bookings}/${bookingId}`);
                setBookings((prev) => prev.filter((b) => b._id !== bookingId));
                toast.success("Booking deleted successfully");
            } else {
                const newStatus = type === "approve" ? "approved" : "rejected";
                await axiosInstance.patch(`${API_ENDPOINTS.bookings}/${bookingId}`, { status: newStatus });
                setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
                toast.success(`Booking ${newStatus} successfully`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Failed to ${type} booking`;
            toast.error(errorMessage);
            console.error(`Failed to ${type} booking:`, err);
        } finally {
            setActionLoading(null);
            setPendingAction(null);
        }
    };

    /**
     * Clear search and filters
     */
    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <FaRedo className="mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    const modalConfig = pendingAction
        ? {
              approve: {
                  title: "Approve Booking",
                  message: "Are you sure you want to approve this booking?",
              },
              reject: {
                  title: "Reject Booking",
                  message: "Are you sure you want to reject this booking?",
              },
              delete: {
                  title: "Delete Booking",
                  message: "Are you sure you want to delete this booking? This action cannot be undone.",
              },
          }[pendingAction.type]
        : { title: "", message: "" };

    return (
        <>
            <ConfirmationModal
                isOpen={showModal}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={executeAction}
                onCancel={() => {
                    setShowModal(false);
                    setPendingAction(null);
                }}
            />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-white shadow-md rounded-lg">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Manage All Bookings</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                            <button
                                onClick={fetchBookings}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaRedo size={14} />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by house, name, or email..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            {(searchQuery || statusFilter !== "all") && (
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
                    {paginatedBookings.length > 0 ? (
                        <>
                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 space-y-4">
                                {paginatedBookings.map((booking) => (
                                    <BookingCard
                                        key={booking._id}
                                        booking={booking}
                                        onAction={handleOpenModal}
                                        actionLoading={actionLoading}
                                    />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Apartment</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">User Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">User Email</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                Booking Date
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedBookings.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-left">{booking.house}</td>
                                                <td className="px-4 py-3 text-left">{booking.name}</td>
                                                <td className="px-4 py-3 text-left">
                                                    <a
                                                        href={`mailto:${booking.email}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {booking.email}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {moment(booking.bookedAt).format("MMM DD, YYYY")}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded text-xs font-semibold capitalize border ${
                                                            STATUS_STYLES[booking.status] || STATUS_STYLES.pending
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {booking.status === "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleOpenModal("approve", booking._id)
                                                                    }
                                                                    disabled={actionLoading === booking._id}
                                                                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                >
                                                                    {actionLoading === booking._id ? "..." : "Approve"}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleOpenModal("reject", booking._id)
                                                                    }
                                                                    disabled={actionLoading === booking._id}
                                                                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-3 py-1 rounded text-sm transition-colors"
                                                                >
                                                                    {actionLoading === booking._id ? "..." : "Reject"}
                                                                </button>
                                                            </>
                                                        )}
                                                        {(booking.status === "approved" ||
                                                            booking.status === "rejected") && (
                                                            <button
                                                                onClick={() => handleOpenModal("delete", booking._id)}
                                                                disabled={actionLoading === booking._id}
                                                                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors"
                                                            >
                                                                {actionLoading === booking._id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of{" "}
                                        {filteredBookings.length} bookings
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
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                                            ))}
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

export default ManageAllBookings;
