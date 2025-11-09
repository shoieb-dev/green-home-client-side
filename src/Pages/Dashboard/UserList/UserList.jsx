import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaCrown, FaRedo, FaSearch, FaTrash, FaUser, FaUserShield } from "react-icons/fa";
import Avatar1 from "../../../assets/images/avatar1.png";
import Loader from "../../../components/Loader/Loader";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

// Constants
const ITEMS_PER_PAGE = 10;

/**
 * User Statistics Component
 */
const UserStats = ({ users }) => {
    const stats = useMemo(() => {
        const total = users.length;
        const admins = users.filter((u) => u.role === "admin").length;
        const regularUsers = total - admins;
        const recentUsers = users.filter((u) => moment().diff(moment(u.createdAt), "days") <= 7).length;

        return { total, admins, regularUsers, recentUsers };
    }, [users]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-blue-600" />
                    <p className="text-sm text-blue-600 font-medium">Total Users</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <FaUserShield className="text-purple-600" />
                    <p className="text-sm text-purple-600 font-medium">Admins</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-green-600" />
                    <p className="text-sm text-green-600 font-medium">Regular Users</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.regularUsers}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-amber-600" />
                    <p className="text-sm text-amber-600 font-medium">New (7 days)</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.recentUsers}</p>
            </div>
        </div>
    );
};

/**
 * Empty State Component
 */
const EmptyState = ({ searchQuery, onClear }) => (
    <div className="text-center py-12">
        <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{searchQuery ? "No users found" : "No users yet"}</h3>
        <p className="text-sm text-gray-500">
            {searchQuery ? (
                <>
                    No users match your search. Try different keywords or{" "}
                    <button onClick={onClear} className="text-blue-600 hover:underline">
                        clear search
                    </button>
                    .
                </>
            ) : (
                "Users will appear here once they register."
            )}
        </p>
    </div>
);

/**
 * User Card for Mobile View
 */
const UserCard = ({ user, onMakeAdmin, onDelete, isLastAdmin, actionLoading }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-start gap-3 mb-3">
            <img
                src={user.photoURL || user.googlePhotoUrl || Avatar1}
                alt={`${user.displayName}'s avatar`}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                    e.target.src = Avatar1;
                }}
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                    {isLastAdmin && <FaCrown className="text-purple-500" size={14} title="Master Admin" />}
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="mt-1">
                    <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.role === "admin"
                                ? isLastAdmin
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {user.role === "admin" ? (isLastAdmin ? "Master Admin" : "Admin") : "User"}
                    </span>
                </div>
            </div>
        </div>

        <div className="text-sm text-gray-600 mb-3">
            <p>
                <strong>Updated:</strong> {moment(user.updatedAt).format("MMM DD, YYYY")}
            </p>
        </div>

        <div className="flex gap-2">
            <button
                onClick={() => onMakeAdmin(user.email, user.role)}
                disabled={isLastAdmin || actionLoading === user._id}
                className={`flex-1 ${
                    isLastAdmin
                        ? "bg-gray-400 cursor-not-allowed"
                        : user.role === "admin"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                } disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1`}
                title={isLastAdmin ? "Cannot remove the last admin" : ""}
            >
                <FaUserShield size={12} />
                {actionLoading === user._id ? "..." : user.role === "admin" ? "Remove Admin" : "Make Admin"}
            </button>
            <button
                onClick={() => onDelete(user._id, user.role)}
                disabled={isLastAdmin || actionLoading === user._id}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                title={isLastAdmin ? "Cannot delete the last admin" : ""}
            >
                <FaTrash size={12} />
                {actionLoading === user._id ? "..." : "Delete"}
            </button>
        </div>
    </div>
);

/**
 * Main UserList Component
 */
const UserList = () => {
    const { axiosInstance } = useAxiosInstance();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    /**
     * Calculate admin count and check if user is last admin
     */
    const adminCount = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);
    const isLastAdmin = useCallback(
        (userRole) => {
            const role = userRole || "user"; // Treat undefined/null as "user"
            return role === "admin" && adminCount === 1;
        },
        [adminCount]
    );

    /**
     * Fetch all users
     */
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(API_ENDPOINTS.users);
            setUsers(response?.data || []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to load users";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Failed to fetch users:", err);
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
                await fetchUsers();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchUsers]);

    /**
     * Filter and search users
     */
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                user.displayName?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query);

            // Handle role filtering - if user.role is undefined/null, treat as "user"
            const userRole = user.role || "user";
            const matchesRole = roleFilter === "all" || userRole === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    /**
     * Pagination
     */
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    /**
     * Handle make/remove admin
     */
    const handleMakeAdmin = (email, currentRole) => {
        // Normalize role - treat undefined/null as "user"
        const role = currentRole || "user";

        if (isLastAdmin(role)) {
            toast.error("Cannot remove the last admin. At least one admin must remain.");
            return;
        }

        const isAdmin = role === "admin";

        setPendingAction({
            type: "role",
            email,
            currentRole: role,
            isAdmin,
        });
        setShowModal(true);
    };

    /**
     * Handle delete user
     */
    const handleOpenModal = (userId, userRole) => {
        // Normalize role - treat undefined/null as "user"
        const role = userRole || "user";

        if (isLastAdmin(role)) {
            toast.error("Cannot delete the last admin. At least one admin must remain.");
            return;
        }

        setPendingAction({
            type: "delete",
            userId,
        });
        setShowModal(true);
    };

    /**
     * Execute confirmed action
     */
    const executeAction = async () => {
        if (!pendingAction) return;

        setShowModal(false);
        setActionLoading(pendingAction.userId || pendingAction.email);

        try {
            if (pendingAction.type === "delete") {
                await axiosInstance.delete(`${API_ENDPOINTS.users}/${pendingAction.userId}`);
                setUsers((prev) => prev.filter((user) => user._id !== pendingAction.userId));
                toast.success("User deleted successfully");
            } else if (pendingAction.type === "role") {
                const { email, isAdmin } = pendingAction;
                const endpoint = isAdmin ? `${API_ENDPOINTS.users}/remove-admin` : `${API_ENDPOINTS.users}/make-admin`;
                const newRole = isAdmin ? "user" : "admin";

                const response = await axiosInstance.put(endpoint, { email });

                if (response.data.success) {
                    toast.success(response.data.message || `Role updated successfully`);
                    setUsers((prev) => prev.map((user) => (user.email === email ? { ...user, role: newRole } : user)));
                } else {
                    toast.error(response.data.message || "Failed to update role");
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Operation failed";
            toast.error(errorMessage);
            console.error("Action failed:", err);
        } finally {
            setActionLoading(null);
            setPendingAction(null);
        }
    };

    /**
     * Clear filters
     */
    const handleClearFilters = () => {
        setSearchQuery("");
        setRoleFilter("all");
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load users</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <FaRedo className="mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    const modalConfig = pendingAction
        ? pendingAction.type === "delete"
            ? {
                  title: "Confirm Deletion",
                  message: "Are you sure you want to delete this user? This action cannot be undone.",
              }
            : {
                  title: pendingAction.isAdmin ? "Confirm Remove Admin" : "Confirm Make Admin",
                  message: pendingAction.isAdmin
                      ? "Are you sure you want to remove admin privileges from this user?"
                      : "Are you sure you want to make this user an admin?",
              }
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaRedo size={14} />
                                <span>Refresh</span>
                            </button>
                        </div>

                        {/* Statistics */}
                        <UserStats users={users} />

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="user">Users</option>
                            </select>
                            {(searchQuery || roleFilter !== "all") && (
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
                    {paginatedUsers.length > 0 ? (
                        <>
                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 space-y-4">
                                {paginatedUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        onMakeAdmin={handleMakeAdmin}
                                        onDelete={handleOpenModal}
                                        isLastAdmin={isLastAdmin(user.role)}
                                        actionLoading={actionLoading}
                                    />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Photo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Role</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Modified At</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedUsers.map((user) => {
                                            const isMasterAdmin = isLastAdmin(user.role);
                                            const userRole = user.role || "user"; // Normalize role
                                            return (
                                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-left">
                                                        <img
                                                            src={user.photoURL || user.googlePhotoUrl || Avatar1}
                                                            alt={`${user.displayName}'s avatar`}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                            onError={(e) => {
                                                                e.target.src = Avatar1;
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{user.displayName}</span>
                                                            {isMasterAdmin && (
                                                                <FaCrown
                                                                    className="text-purple-500"
                                                                    size={14}
                                                                    title="Master Admin"
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-left">
                                                        <a
                                                            href={`mailto:${user.email}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {user.email}
                                                        </a>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                                                                userRole === "admin"
                                                                    ? isMasterAdmin
                                                                        ? "bg-purple-100 text-purple-800"
                                                                        : "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {userRole === "admin"
                                                                ? isMasterAdmin
                                                                    ? "Master Admin"
                                                                    : "Admin"
                                                                : "User"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                                                        {moment(user.updatedAt).format("MMM DD, YYYY")}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleMakeAdmin(user.email, userRole)}
                                                                disabled={isMasterAdmin || actionLoading === user._id}
                                                                className={`${
                                                                    isMasterAdmin
                                                                        ? "bg-gray-400 cursor-not-allowed"
                                                                        : userRole === "admin"
                                                                        ? "bg-red-500 hover:bg-red-600"
                                                                        : "bg-green-500 hover:bg-green-600"
                                                                } disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1`}
                                                                title={
                                                                    isMasterAdmin ? "Cannot remove the last admin" : ""
                                                                }
                                                            >
                                                                <FaUserShield size={12} />
                                                                {actionLoading === user._id
                                                                    ? "..."
                                                                    : userRole === "admin"
                                                                    ? "Remove Admin"
                                                                    : "Make Admin"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenModal(user._id, userRole)}
                                                                disabled={isMasterAdmin || actionLoading === user._id}
                                                                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                                                                title={
                                                                    isMasterAdmin ? "Cannot delete the last admin" : ""
                                                                }
                                                            >
                                                                <FaTrash size={12} />
                                                                {actionLoading === user._id ? "..." : "Delete"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
                                        {filteredUsers.length} users
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

export default UserList;
