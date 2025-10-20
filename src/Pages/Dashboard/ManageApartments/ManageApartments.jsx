import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaPlus, FaRedo, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

// Constants
const ITEMS_PER_PAGE = 10;

/**
 * Empty State Component
 */
const EmptyState = ({ searchQuery, onClear, onAddNew }) => (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? "No apartments found" : "No apartments yet"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? (
                <>
                    No apartments match your search. Try different keywords or{" "}
                    <button onClick={onClear} className="text-blue-600 hover:underline">
                        clear search
                    </button>
                    .
                </>
            ) : (
                "Get started by adding your first apartment."
            )}
        </p>
        {!searchQuery && (
            <div className="mt-6">
                <button
                    onClick={onAddNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FaPlus className="mr-2" />
                    Add New Apartment
                </button>
            </div>
        )}
    </div>
);

/**
 * Apartment Card for Mobile View
 */
const ApartmentCard = ({ apartment, onEdit, onDelete, onView, deleteLoading }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Image */}
        {apartment.image && (
            <div className="h-40 bg-gray-200 overflow-hidden">
                <img
                    src={apartment.image}
                    alt={apartment.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                />
            </div>
        )}

        <div className="p-4">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{apartment.name}</h3>
                <p className="text-sm text-gray-600">{apartment.address}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">Area:</span>{" "}
                        <span className="font-medium">{apartment.area} sqft</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="font-semibold text-green-600">${apartment.price}</span>
                    </div>
                    {apartment.bedrooms && (
                        <div>
                            <span className="text-gray-500">Bedrooms:</span>{" "}
                            <span className="font-medium">{apartment.bedrooms}</span>
                        </div>
                    )}
                    {apartment.bathrooms && (
                        <div>
                            <span className="text-gray-500">Bathrooms:</span>{" "}
                            <span className="font-medium">{apartment.bathrooms}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onView(apartment._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <FaEye size={12} />
                    View
                </button>
                <button
                    onClick={() => onEdit(apartment._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <FaEdit size={12} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(apartment._id)}
                    disabled={deleteLoading === apartment._id}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                    <FaTrash size={12} />
                    {deleteLoading === apartment._id ? "..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

/**
 * Main ManageApartments Component
 */
const ManageApartments = () => {
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name"); // name, price, area

    const [showModal, setShowModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    /**
     * Fetch all apartments
     */
    const fetchApartments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_ENDPOINTS.houses);
            setApartments(response?.data || []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to load apartments";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Failed to fetch apartments:", err);
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
                await fetchApartments();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchApartments]);

    /**
     * Filter and sort apartments
     */
    const filteredApartments = apartments
        .filter((apartment) => {
            const query = searchQuery.toLowerCase();
            return (
                apartment.name?.toLowerCase().includes(query) ||
                apartment.address?.toLowerCase().includes(query) ||
                apartment.area?.toString().includes(query) ||
                apartment.price?.toString().includes(query)
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "price":
                    return a.price - b.price;
                case "area":
                    return b.area - a.area;
                default:
                    return 0;
            }
        });

    /**
     * Pagination
     */
    const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE);
    const paginatedApartments = filteredApartments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    /**
     * Navigation handlers
     */
    const handleEdit = (id) => {
        navigate(`/apartment-form/edit/${id}`);
    };

    const handleView = (id) => {
        navigate(`/apartment/${id}`); // Adjust route as needed
    };

    const handleAddNew = () => {
        navigate("/apartment-form/create/new");
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
            await axiosInstance.delete(`${API_ENDPOINTS.houses}/${pendingDeleteId}`);
            setApartments((prev) => prev.filter((apt) => apt._id !== pendingDeleteId));
            toast.success("Apartment deleted successfully");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete apartment";
            toast.error(errorMessage);
            console.error("Delete failed:", err);
        } finally {
            setDeleteLoading(null);
            setPendingDeleteId(null);
        }
    };

    /**
     * Clear search
     */
    const handleClearSearch = () => {
        setSearchQuery("");
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load apartments</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                    onClick={fetchApartments}
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
                message="Are you sure you want to delete this apartment? This action cannot be undone."
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
                                <h2 className="text-2xl font-bold text-gray-800">Manage Apartments</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredApartments.length} apartment{filteredApartments.length !== 1 ? "s" : ""}{" "}
                                    found
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchApartments}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FaRedo size={14} />
                                    <span>Refresh</span>
                                </button>
                                <button
                                    onClick={handleAddNew}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaPlus size={14} />
                                    <span>Add New</span>
                                </button>
                            </div>
                        </div>

                        {/* Search and Sort */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, address, area, or price..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price">Sort by Price</option>
                                <option value="area">Sort by Area</option>
                            </select>
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {paginatedApartments.length > 0 ? (
                        <>
                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {paginatedApartments.map((apartment) => (
                                    <ApartmentCard
                                        key={apartment._id}
                                        apartment={apartment}
                                        onEdit={handleEdit}
                                        onDelete={handleOpenModal}
                                        onView={handleView}
                                        deleteLoading={deleteLoading}
                                    />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Area</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Price</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedApartments.map((apartment) => (
                                            <tr key={apartment._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-left">
                                                    <div className="flex items-center gap-3">
                                                        {apartment.image && (
                                                            <img
                                                                src={apartment.image}
                                                                alt={apartment.name}
                                                                className="w-12 h-12 rounded object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = "none";
                                                                }}
                                                            />
                                                        )}
                                                        <span className="font-medium">{apartment.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-left text-gray-600">
                                                    {apartment.address}
                                                </td>
                                                <td className="px-4 py-3 text-center">{apartment.area} sqft</td>
                                                <td className="px-4 py-3 text-center font-semibold text-green-600">
                                                    ${apartment.price}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleView(apartment._id)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                            title="View Details"
                                                        >
                                                            <FaEye size={12} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(apartment._id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                            title="Edit Apartment"
                                                        >
                                                            <FaEdit size={12} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenModal(apartment._id)}
                                                            disabled={deleteLoading === apartment._id}
                                                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                            title="Delete Apartment"
                                                        >
                                                            <FaTrash size={12} />
                                                            {deleteLoading === apartment._id ? "..." : "Delete"}
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
                                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredApartments.length)} of{" "}
                                        {filteredApartments.length} apartments
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
                            <EmptyState searchQuery={searchQuery} onClear={handleClearSearch} onAddNew={handleAddNew} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageApartments;
