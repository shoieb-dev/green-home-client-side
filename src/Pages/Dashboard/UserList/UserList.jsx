import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Avatar1 from "../../../assets/images/avatar1.png";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const UserList = () => {
    const { axiosInstance } = useAxiosInstance();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        fetchUsers();
    }, [axiosInstance]);

    const fetchUsers = () => {
        setLoading(true);
        axiosInstance
            .get(API_ENDPOINTS.users)
            .then((res) => setUsers(res?.data || []))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Failed to fetch users");
            })
            .finally(() => setLoading(false));
    };

    // Calculate admin count
    const adminCount = users.filter((user) => user.role === "admin").length;
    const isLastAdmin = (userRole) => userRole === "admin" && adminCount === 1;

    const handleMakeAdmin = (email, currentRole) => {
        // Prevent removing last admin
        if (isLastAdmin(currentRole)) {
            toast.error("Cannot remove the last admin. At least one admin must remain.");
            return;
        }

        const isAdmin = currentRole === "admin";

        setModalData({
            title: isAdmin ? "Confirm Remove Admin" : "Confirm Make Admin",
            message: isAdmin
                ? "Are you sure you want to remove admin privileges from this user?"
                : "Are you sure you want to make this user an admin?",
        });

        setModalAction(() => () => {
            const endpoint = isAdmin ? `${API_ENDPOINTS.users}/remove-admin` : `${API_ENDPOINTS.users}/make-admin`;

            const newRole = isAdmin ? "user" : "admin";
            const successMessage = isAdmin ? "Admin privileges removed" : "User promoted to admin";
            const errorMessage = isAdmin ? "Failed to remove admin" : "Failed to make admin";

            axiosInstance
                .put(endpoint, { email })
                .then(({ data }) => {
                    if (data.success) {
                        toast.success(data.message || successMessage);
                        setUsers((prev) =>
                            prev.map((user) => (user.email === email ? { ...user, role: newRole } : user))
                        );
                        setShowModal(false);
                    } else {
                        toast.error(data.message || `${errorMessage}. Try again.`);
                    }
                })
                .catch((err) => {
                    console.error(`${errorMessage}:`, err);
                    toast.error(err.response?.data?.message || `${errorMessage}. Please try again.`);
                })
                .finally(() => setShowModal(false));
        });

        setShowModal(true);
    };

    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this user? This action cannot be undone.",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.users}/${id}`)
                .then(() => {
                    toast.success("User deleted successfully");
                    setUsers((prev) => prev.filter((user) => user._id !== id));
                    setShowModal(false);
                })
                .catch((err) => {
                    console.error("Delete failed:", err);
                    toast.error(err.response?.data?.message || "Failed to delete user. Please try again.");
                })
                .finally(() => setShowModal(false));
        });

        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading users...</div>
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
                <h2 className="text-2xl font-semibold mb-4">User List</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-white">Photo</th>
                                <th className="px-4 py-2 border border-white">Name</th>
                                <th className="px-4 py-2 border border-white">Email</th>
                                <th className="px-4 py-2 border border-white">Role</th>
                                <th className="px-4 py-2 border border-white">Modified At</th>
                                <th className="px-4 py-2 border border-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-100 transition text-center">
                                    <td className="px-6 py-2 border border-gray-200 text-gray-800">
                                        <img
                                            src={item.photoURL || item.googlePhotoUrl || Avatar1}
                                            alt={`${item.displayName}'s avatar`}
                                            className="w-10 h-10 rounded-full mx-auto object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">{item.displayName}</td>
                                    <td className="px-4 py-2 border border-gray-200">{item.email}</td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                                item.role === "admin"
                                                    ? isLastAdmin(item.role)
                                                        ? "bg-purple-100 text-purple-800" // Different color for master admin
                                                        : "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {item.role === "admin"
                                                ? isLastAdmin(item.role)
                                                    ? "Master Admin"
                                                    : "Admin"
                                                : "User"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {moment(item.updatedAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleMakeAdmin(item.email, item.role)}
                                                disabled={isLastAdmin(item.role)}
                                                className={`${
                                                    isLastAdmin(item.role)
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : item.role === "admin"
                                                        ? "bg-red-500 hover:bg-red-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                } text-white px-3 py-1 rounded transition-colors`}
                                                aria-label={
                                                    item.role === "admin"
                                                        ? "Remove admin privileges"
                                                        : "Grant admin privileges"
                                                }
                                                title={isLastAdmin(item.role) ? "Cannot remove the last admin" : ""}
                                            >
                                                {item.role === "admin" ? "Remove Admin" : "Make Admin"}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(item._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                                                aria-label="Delete user"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500 border border-gray-200">
                                        No users found.
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

export default UserList;
