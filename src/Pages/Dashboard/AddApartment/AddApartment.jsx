import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const AddApartment = () => {
    const { mode, id } = useParams();
    const isEditMode = mode === "edit";
    const navigate = useNavigate();
    const { axiosInstance } = useAxiosInstance();
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);

    const defaultFormValues = {
        name: "",
        address: "",
        bed: "",
        bath: "",
        area: "",
        price: "",
        heading: "",
        description: "",
        image: "",
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (isEditMode && editData) {
            reset({
                name: editData.name || "",
                address: editData.address || "",
                bed: editData.bed || "",
                bath: editData.bath || "",
                area: editData.area || "",
                price: editData.price || "",
                heading: editData.heading || "",
                description: editData.description || "",
                image: editData.img1 || "",
            });
        }
    }, [editData, isEditMode, reset]);

    useEffect(() => {
        if (isEditMode) {
            axiosInstance
                .get(`${API_ENDPOINTS.houses}/${id}`)
                .then((res) => setEditData(res?.data))
                .catch(console.error);
        } else {
            reset(defaultFormValues);
        }
    }, [axiosInstance, id, mode, reset, isEditMode]);

    const onSubmit = async (data) => {
        setLoading(true);
        // return;
        try {
            const res = isEditMode
                ? await axiosInstance.put(`${API_ENDPOINTS.houses}/${id}`, data)
                : await axiosInstance.post(API_ENDPOINTS.houses, data);

            if (res.data.insertedId || res.data.modifiedCount > 0) {
                toast.success(`House ${isEditMode ? "updated" : "added"} successfully!`);
                reset();
                setTimeout(() => {
                    navigate("/manageApartments");
                }, 3000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-700 pb-6">{isEditMode ? "Edit" : "Add New"} Apartment</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            {...register("name", { required: "Name is required", maxLength: 50 })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            {...register("address", { required: "Address is required" })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Bed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bed</label>
                        <input
                            {...register("bed", { required: "Bed is required", min: 0, valueAsNumber: true })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.bed && <p className="text-red-500 text-sm mt-1">{errors.bed.message}</p>}
                    </div>

                    {/* Bath */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bath</label>
                        <input
                            {...register("bath", { required: "Bath is required", valueAsNumber: true, min: 0 })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.bath && <p className="text-red-500 text-sm mt-1">{errors.bath.message}</p>}
                    </div>

                    {/* Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
                        <input
                            {...register("area", { required: "Area is required", min: 0, valueAsNumber: true })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                            {...register("price", { required: "Price is required", min: 0, valueAsNumber: true })}
                            type="number"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Heading */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                        <input
                            {...register("heading", { required: "Heading is required" })}
                            type="text"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                            {...register("image", { required: "Image URL is required" })}
                            type="url"
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Spinner animation="border" size="sm" className="mr-2" />
                                    {isEditMode ? "Updating Apartment" : "Adding Apartment"}
                                </span>
                            ) : isEditMode ? (
                                "Update Apartment"
                            ) : (
                                "Add Apartment"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default AddApartment;
