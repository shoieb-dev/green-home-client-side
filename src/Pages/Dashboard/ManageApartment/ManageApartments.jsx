import { useEffect, useState } from "react";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";
import "./ManageApartments.css";

const ManageApartments = () => {
    const { axiosInstance } = useAxiosInstance();
    const [apartments, setApartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(() => () => {});
    const [modalData, setModalData] = useState({ title: "", message: "" });

    useEffect(() => {
        axiosInstance
            .get(API_ENDPOINTS.houses)
            .then((res) => setApartments(res?.data))
            .catch(console.error);
    }, [axiosInstance]);

    const handleOpenModal = (id) => {
        setModalData({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this apartment?",
        });

        setModalAction(() => () => {
            axiosInstance
                .delete(`${API_ENDPOINTS.houses}/${id}`)
                .then(() => {
                    setApartments((prev) => prev.filter((b) => b._id !== id));
                })
                .catch((err) => console.error("Delete failed:", err));

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
                <h2 className="text-2xl font-semibold mb-4">Manage Apartments</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                {/* <th className="border px-4 py-2">#</th> */}
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Address</th>
                                <th className="border px-4 py-2">Area</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apartments.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100 transition text-center">
                                    {/* <td className="border px-4 py-2">{index + 1}</td> */}
                                    <td className="border px-8 py-2 text-left">{item.name}</td>
                                    <td className="border px-4 py-2">{item.address}</td>
                                    <td className="border px-4 py-2">{item.area} sft</td>
                                    <td className="border px-4 py-2">${item.price}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => {
                                                handleOpenModal(item._id);
                                            }}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {apartments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No apartment found.
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

export default ManageApartments;
