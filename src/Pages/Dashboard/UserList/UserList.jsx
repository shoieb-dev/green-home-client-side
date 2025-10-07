import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Avatar1 from "../../../assets/images/avatar1.png";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import moment from "moment";

const UserList = () => {
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.users)
            .then((res) => setUsers(res?.data))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Something went wrong!");
            });
    }, [axiosInstance]);

    const handleEdit = (id) => {
        navigate(`/apartment-form/edit/${id}`);
    };

    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this user?",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.users}/${id}`)
                .then(() => {
                    toast.success("User deleted successfully");
                    setUsers((prev) => prev.filter((b) => b._id !== id));
                })
                .catch((err) => {
                    console.error("Delete failed:", err);
                    toast.error("Failed to delete user. Please try again.");
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
                            {users.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition text-center">
                                    <td className="px-6 py-2 border border-gray-200 text-gray-800">
                                        <img
                                            src={item.photoURL || Avatar1 || item.googlePhotoUrl}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full mx-auto"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">{item.displayName}</td>
                                    <td className="px-4 py-2 border border-gray-200">{item.email}</td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {item.role === "admin" ? "Admin" : "User"}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        {moment(item.updatedAt).format("DD-MM-YYYY")}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Edit
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
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500 border border-gray-200">
                                        No user found.
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
